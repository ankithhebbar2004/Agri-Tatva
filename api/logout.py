from flask import Flask, request, jsonify
import os
import sys

# Add the api directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils import get_cors_headers

app = Flask(__name__)

@app.route('/api/logout', methods=['POST', 'OPTIONS'])
def logout():
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.update(get_cors_headers())
        return response
    
    try:
        # Since authentication is managed client-side with localStorage,
        # this endpoint simply acknowledges the logout request
        response = jsonify({
            'success': True,
            'message': 'Logout successful'
        })
        response.headers.update(get_cors_headers())
        return response
        
    except Exception as e:
        print(f"Error in logout endpoint: {e}")
        response = jsonify({'success': False, 'message': 'Internal server error'})
        response.headers.update(get_cors_headers())
        return response, 500

# For Vercel deployment
def handler(request):
    return app(request)

if __name__ == '__main__':
    app.run(debug=True)