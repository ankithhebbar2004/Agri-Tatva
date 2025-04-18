from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import sklearn
from pymongo import MongoClient
from datetime import datetime
import os
import sys
from dotenv import load_dotenv
import bcrypt  # Add this import for password hashing
import secrets  # Import for generating reset tokens
import smtplib  # For sending emails
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import hashlib  # Add this import for creating stable user IDs from emails

# Add parent directory to path so we can import from there
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

print(sklearn.__version__)

# MongoDB Setup - Use environment variables for flexible configuration
load_dotenv()

# First check for MongoDB Atlas URI (highest priority)
mongodb_uri = os.environ.get('MONGODB_URI')

if mongodb_uri:
    # Use MongoDB Atlas connection
    print(f"Connecting to MongoDB Atlas cluster")
    client = MongoClient(mongodb_uri)
    # Extract DB name from URI or use default
    db_name = os.environ.get('MONGODB_DB_NAME', 'crop_yield_db')
    db = client[db_name]
else:
    # Fallback to direct connection parameters
    mongo_host = os.environ.get('MONGODB_HOST', 'localhost')
    mongo_port = int(os.environ.get('MONGODB_PORT', 27017))
    mongo_db = os.environ.get('MONGODB_DB_NAME', 'crop_yield_db')
    mongo_user = os.environ.get('MONGODB_USER', '')
    mongo_password = os.environ.get('MONGODB_PASSWORD', '')
    
    # Build connection string
    if mongo_user and mongo_password:
        connection_string = f"mongodb://{mongo_user}:{mongo_password}@{mongo_host}:{mongo_port}/"
    else:
        connection_string = f"mongodb://{mongo_host}:{mongo_port}/"
    
    print(f"Connecting to MongoDB at {mongo_host}:{mongo_port}")
    client = MongoClient(connection_string)
    db = client[mongo_db]

predictions_collection = db['predictions']
users_collection = db['users']

# Check if MongoDB connection is working and database exists
def check_mongodb_connection():
    try:
        # Check connection
        client.server_info()
        print("✅ Successfully connected to MongoDB server")
        
        # Check if our database is in the list of database names
        database_names = client.list_database_names()
        if 'crop_yield_db' in database_names:
            print(f"✅ Database 'crop_yield_db' exists")
        else:
            print(f"ℹ️ Database 'crop_yield_db' doesn't exist yet. It will be created when data is inserted.")
        
        # Check collections in the database
        collection_names = db.list_collection_names()
        if 'predictions' in collection_names:
            print(f"✅ Collection 'predictions' exists")
            print(f"ℹ️ Number of records in 'predictions' collection: {predictions_collection.count_documents({})}")
        else:
            print(f"ℹ️ Collection 'predictions' doesn't exist yet. It will be created when data is inserted.")
            
        return True
    except Exception as e:
        print(f"❌ MongoDB connection error: {e}")
        return False

# Adjust paths for model loading - look in both current directory and parent directory
def find_model_path(filename):
    if os.path.exists(filename):
        return filename
    elif os.path.exists(os.path.join('..', filename)):
        return os.path.join('..', filename)
    else:
        raise FileNotFoundError(f"Could not find model file: {filename}")

# Loading models
try:
    dtr = pickle.load(open(find_model_path('dtr.pkl'),'rb'))
    preprocessor = pickle.load(open(find_model_path('preprocessor.pkl'),'rb'))
except Exception as e:
    print(f"Error loading models: {e}")
    sys.exit(1)

# Flask app
app = Flask(__name__, 
           static_folder=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'static'),
           template_folder=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'templates'))
CORS(app)  # Enable CORS for all routes

def generate_stable_user_id(email):
    """Generate a stable user ID based on email address"""
    # Create a hash of the email and take the first 16 chars as the ID
    email_hash = hashlib.md5(email.lower().encode()).hexdigest()
    return f"user_{email_hash[:16]}"

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route("/predict", methods=['POST'])
def predict():
    if request.method == 'POST':
        # Check if request is coming from React (JSON) or form
        if request.is_json:
            data = request.get_json()
            Year = data['Year']
            average_rain_fall_mm_per_year = data['average_rain_fall_mm_per_year']
            pesticides_tonnes = data['pesticides_tonnes']
            avg_temp = data['avg_temp']
            Area = data['Area']
            Item = data['Item']
            
            # Get user ID from the request
            user_id = data.get('user_id')
            
            # If no user_id but we have email, generate it
            if not user_id and 'email' in data:
                user_id = generate_stable_user_id(data['email'])
        else:
            # Handle form data (original behavior)
            Year = request.form['Year']
            average_rain_fall_mm_per_year = request.form['average_rain_fall_mm_per_year']
            pesticides_tonnes = request.form['pesticides_tonnes']
            avg_temp = request.form['avg_temp']
            Area = request.form['Area']
            Item = request.form['Item']
            user_id = request.form.get('user_id')

        features = np.array([[Year, average_rain_fall_mm_per_year, pesticides_tonnes, avg_temp, Area, Item]], dtype=object)
        transformed_features = preprocessor.transform(features)
        prediction = dtr.predict(transformed_features).reshape(1, -1)
        
        # Store prediction in MongoDB with user reference
        prediction_record = {
            'timestamp': datetime.now(),
            'user_id': user_id,  # Store user ID with the prediction
            'features': {
                'Year': Year,
                'average_rain_fall_mm_per_year': average_rain_fall_mm_per_year,
                'pesticides_tonnes': pesticides_tonnes,
                'avg_temp': avg_temp,
                'Area': Area,
                'Item': Item
            },
            'prediction': prediction.tolist()[0][0]
        }
        predictions_collection.insert_one(prediction_record)
        
        # If request is from React, return JSON
        if request.is_json:
            return jsonify({"prediction": prediction.tolist()})
        
        # Otherwise return the HTML template
        return render_template('index.html', prediction=prediction)

@app.route('/history', methods=['GET'])
def get_history():
    """Endpoint to retrieve prediction history"""
    # Get the last 10 predictions
    history = list(predictions_collection.find({}, {'_id': 0}).sort('timestamp', -1).limit(10))
    
    # Convert datetime objects to string for JSON serialization
    for record in history:
        record['timestamp'] = record['timestamp'].strftime('%Y-%m-%d %H:%M:%S')
    
    return jsonify({'history': history})

@app.route('/check-db', methods=['GET'])
def check_db():
    """Endpoint to check database status"""
    is_connected = check_mongodb_connection()
    
    # Get collection stats if connected
    stats = {}
    if is_connected:
        try:
            stats['record_count'] = predictions_collection.count_documents({})
            stats['database_exists'] = 'crop_yield_db' in client.list_database_names()
            stats['collection_exists'] = 'predictions' in db.list_collection_names()
        except Exception as e:
            stats['error'] = str(e)
    
    return jsonify({
        'connected': is_connected,
        'database': 'crop_yield_db',
        'collection': 'predictions',
        'stats': stats
    })

@app.route('/register', methods=['POST'])
def register():
    if request.is_json:
        data = request.get_json()
        
        # Check if user already exists
        existing_user = users_collection.find_one({'email': data['email']})
        
        if existing_user:
            return jsonify({'success': False, 'message': 'User already exists with this email'})
        
        # Generate stable user ID from email
        user_id = generate_stable_user_id(data['email'])
        
        # Hash the password
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        # Create user document
        user = {
            'name': data['name'],
            'email': data['email'],
            'user_id': user_id,  # Add stable user_id field
            'password': hashed_password,
            'created_at': datetime.now()
        }
        
        # Insert the user
        result = users_collection.insert_one(user)
        
        # Create a response without password and with proper ID handling
        user_response = {
            '_id': str(result.inserted_id),
            'user_id': user_id,  # Include user_id in response
            'name': data['name'],
            'email': data['email'],
            'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        return jsonify({'success': True, 'message': 'User registered successfully', 'user': user_response})
    
    return jsonify({'success': False, 'message': 'Invalid request format'})

@app.route('/login', methods=['POST'])
def login():
    if request.is_json:
        data = request.get_json()
        
        # Find user by email
        user = users_collection.find_one({'email': data['email']})
        
        if not user:
            return jsonify({'success': False, 'message': 'User not found. Kindly register.'})
        
        # Check password
        if bcrypt.checkpw(data['password'].encode('utf-8'), user['password']):
            # Create response without password
            user_response = {k: v for k, v in user.items() if k != 'password'}
            user_response['_id'] = str(user_response['_id'])  # Convert ObjectId to string
            
            # If user doesn't have user_id yet (older accounts), add it now
            if 'user_id' not in user_response:
                user_id = generate_stable_user_id(user['email'])
                user_response['user_id'] = user_id
                
                # Update the user in the database with the new user_id
                users_collection.update_one(
                    {'_id': user['_id']},
                    {'$set': {'user_id': user_id}}
                )
            
            return jsonify({'success': True, 'message': 'Login successful', 'user': user_response})
        else:
            return jsonify({'success': False, 'message': 'Incorrect password'})
    
    return jsonify({'success': False, 'message': 'Invalid request format'})

@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    if request.is_json:
        data = request.get_json()
        email = data.get('email')
        
        # Check if user exists
        user = users_collection.find_one({'email': email})
        
        if not user:
            return jsonify({'success': False, 'message': 'No account found with this email address.'})
        
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        reset_expiry = datetime.now() + timedelta(hours=24)
        
        # Update user with reset token
        users_collection.update_one(
            {'email': email},
            {'$set': {
                'reset_token': reset_token,
                'reset_expiry': reset_expiry
            }}
        )
        
        # In a production app, you would send an email with the reset link
        reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
        
        # For demo purposes, we'll return the link in the response
        # In production, send this via email and don't return it in the response
        return jsonify({
            'success': True, 
            'message': 'Password reset instructions sent to your email.',
            'debug_link': reset_link  # Remove this in production
        })
    
    return jsonify({'success': False, 'message': 'Invalid request format'})

@app.route('/reset-password', methods=['POST'])
def reset_password():
    if request.is_json:
        data = request.get_json()
        token = data.get('token')
        new_password = data.get('new_password')
        
        if not token or not new_password:
            return jsonify({'success': False, 'message': 'Missing token or new password'})
        
        # Find user with this token
        user = users_collection.find_one({
            'reset_token': token,
            'reset_expiry': {'$gt': datetime.now()}
        })
        
        if not user:
            return jsonify({'success': False, 'message': 'Invalid or expired reset token'})
        
        # Hash the new password
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        
        # Update user's password and remove token
        users_collection.update_one(
            {'_id': user['_id']},
            {
                '$set': {'password': hashed_password},
                '$unset': {'reset_token': "", 'reset_expiry': ""}
            }
        )
        
        return jsonify({'success': True, 'message': 'Password has been reset successfully'})
    
    return jsonify({'success': False, 'message': 'Invalid request format'})

if __name__ == "__main__":
    # Check MongoDB connection on startup
    check_mongodb_connection()
    app.run(debug=True)