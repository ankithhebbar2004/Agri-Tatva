from flask import Flask, request, jsonify
import bcrypt
from datetime import datetime
import os
import sys

# Add the api directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils import get_mongodb_connection, generate_stable_user_id, get_cors_headers

app = Flask(__name__)

@app.route('/api/register', methods=['POST', 'OPTIONS'])
def register():
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.update(get_cors_headers())
        return response
    
    try:
        # Get MongoDB connection
        db = get_mongodb_connection()
        users_collection = db['users']
        
        # Get request data
        data = request.get_json()
        
        if not data:
            response = jsonify({'success': False, 'message': 'No JSON data provided'})
            response.headers.update(get_cors_headers())
            return response, 400
        
        # Validate required fields
        required_fields = ['name', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                response = jsonify({'success': False, 'message': f'Missing required field: {field}'})
                response.headers.update(get_cors_headers())
                return response, 400
        
        # Check if user already exists
        existing_user = users_collection.find_one({'email': data['email']})
        
        if existing_user:
            response = jsonify({'success': False, 'message': 'User already exists with this email'})
            response.headers.update(get_cors_headers())
            return response, 409
        
        # Generate stable user ID from email
        user_id = generate_stable_user_id(data['email'])
        
        # Hash the password
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        # Create user document
        user = {
            'name': data['name'],
            'email': data['email'],
            'user_id': user_id,
            'password': hashed_password,
            'created_at': datetime.now()
        }
        
        # Insert the user
        result = users_collection.insert_one(user)
        
        # Create response without password
        user_response = {
            '_id': str(result.inserted_id),
            'user_id': user_id,
            'name': data['name'],
            'email': data['email'],
            'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        response = jsonify({'success': True, 'message': 'User registered successfully', 'user': user_response})
        response.headers.update(get_cors_headers())
        return response
        
    except Exception as e:
        print(f"Error in register endpoint: {e}")
        response = jsonify({'success': False, 'message': 'Internal server error'})
        response.headers.update(get_cors_headers())
        return response, 500

# For Vercel deployment
def handler(request):
    return app(request)

if __name__ == '__main__':
    app.run(debug=True)