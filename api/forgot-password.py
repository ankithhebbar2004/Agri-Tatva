from flask import Flask, request, jsonify
import secrets
from datetime import datetime, timedelta
import os
import sys

# Add the api directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils import get_mongodb_connection, get_cors_headers

app = Flask(__name__)

@app.route('/api/forgot-password', methods=['POST', 'OPTIONS'])
def forgot_password():
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
        
        email = data.get('email')
        if not email:
            response = jsonify({'success': False, 'message': 'Email is required'})
            response.headers.update(get_cors_headers())
            return response, 400
        
        # Check if user exists
        user = users_collection.find_one({'email': email})
        
        if not user:
            response = jsonify({'success': False, 'message': 'No account found with this email address.'})
            response.headers.update(get_cors_headers())
            return response, 404
        
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
        # For demo purposes, we'll return the link in the response
        # Use the origin from the request or fallback to localhost for development
        reset_link = f"/reset-password?token={reset_token}"
        
        response = jsonify({
            'success': True, 
            'message': 'Password reset instructions sent to your email.',
            'debug_link': reset_link  # Remove this in production
        })
        response.headers.update(get_cors_headers())
        return response
        
    except Exception as e:
        print(f"Error in forgot-password endpoint: {e}")
        response = jsonify({'success': False, 'message': 'Internal server error'})
        response.headers.update(get_cors_headers())
        return response, 500

# For Vercel deployment
def handler(request):
    return app(request)

if __name__ == '__main__':
    app.run(debug=True)