from flask import Flask, request, jsonify
import os
import sys

# Add the api directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils import get_cors_headers

app = Flask(__name__)

@app.route('/api/health', methods=['GET', 'OPTIONS'])
def health():
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.update(get_cors_headers())
        return response
    
    try:
        response = jsonify({
            'status': 'healthy',
            'message': 'API is running successfully',
            'version': '1.0.0'
        })
        response.headers.update(get_cors_headers())
        return response
        
    except Exception as e:
        print(f"Error in health endpoint: {e}")
        response = jsonify({'status': 'error', 'message': str(e)})
        response.headers.update(get_cors_headers())
        return response, 500

# For Vercel deployment
def handler(request):
    return app(request)

if __name__ == '__main__':
    app.run(debug=True)