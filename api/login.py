from flask import Flask, request, jsonify
import bcrypt
import os
import sys

# Add the api directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils import get_mongodb_connection, generate_stable_user_id, get_cors_headers

app = Flask(__name__)

@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
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
        if not data.get('email') or not data.get('password'):
            response = jsonify({'success': False, 'message': 'Email and password are required'})
            response.headers.update(get_cors_headers())
            return response, 400
        
        # Find user by email
        user = users_collection.find_one({'email': data['email']})
        
        if not user:
            response = jsonify({'success': False, 'message': 'User not found. Kindly register.'})
            response.headers.update(get_cors_headers())
            return response, 404
        
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
            
            response = jsonify({'success': True, 'message': 'Login successful', 'user': user_response})
            response.headers.update(get_cors_headers())
            return response
        else:
            response = jsonify({'success': False, 'message': 'Incorrect password'})
            response.headers.update(get_cors_headers())
            return response, 401
            
    except Exception as e:
        print(f"Error in login endpoint: {e}")
        response = jsonify({'success': False, 'message': 'Internal server error'})
        response.headers.update(get_cors_headers())
        return response, 500

# For Vercel deployment
def handler(request):
    return app(request)

if __name__ == '__main__':
    app.run(debug=True)