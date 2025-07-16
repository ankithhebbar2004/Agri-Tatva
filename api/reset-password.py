from flask import Flask, request, jsonify
import bcrypt
from datetime import datetime
import os
import sys

# Add the api directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils import get_mongodb_connection, get_cors_headers

app = Flask(__name__)

@app.route('/api/reset-password', methods=['POST', 'OPTIONS'])
def reset_password():
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
        
        token = data.get('token')
        new_password = data.get('new_password')
        
        if not token or not new_password:
            response = jsonify({'success': False, 'message': 'Missing token or new password'})
            response.headers.update(get_cors_headers())
            return response, 400
        
        # Find user with this token
        user = users_collection.find_one({
            'reset_token': token,
            'reset_expiry': {'$gt': datetime.now()}
        })
        
        if not user:
            response = jsonify({'success': False, 'message': 'Invalid or expired reset token'})
            response.headers.update(get_cors_headers())
            return response, 400
        
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
        
        response = jsonify({'success': True, 'message': 'Password has been reset successfully'})
        response.headers.update(get_cors_headers())
        return response
        
    except Exception as e:
        print(f"Error in reset-password endpoint: {e}")
        response = jsonify({'success': False, 'message': 'Internal server error'})
        response.headers.update(get_cors_headers())
        return response, 500

# For Vercel deployment
def handler(request):
    return app(request)

if __name__ == '__main__':
    app.run(debug=True)