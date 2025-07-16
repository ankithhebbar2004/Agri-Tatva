from flask import Flask, request, jsonify
import numpy as np
from datetime import datetime
import json
import os
import sys

# Add the api directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils import get_mongodb_connection, load_models, get_cors_headers

app = Flask(__name__)

# Global variables for models (loaded once)
dtr = None
preprocessor = None

def load_models_once():
    """Load models only once to avoid repeated loading"""
    global dtr, preprocessor
    if dtr is None or preprocessor is None:
        dtr, preprocessor = load_models()

@app.route('/api/predict', methods=['POST', 'OPTIONS'])
def predict():
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.update(get_cors_headers())
        return response
    
    try:
        # Load models
        load_models_once()
        
        # Get MongoDB connection
        db = get_mongodb_connection()
        predictions_collection = db['predictions']
        
        # Get request data
        data = request.get_json()
        
        if not data:
            response = jsonify({'error': 'No JSON data provided'})
            response.headers.update(get_cors_headers())
            return response, 400
        
        # Extract features
        Year = data.get('Year')
        average_rain_fall_mm_per_year = data.get('average_rain_fall_mm_per_year')
        pesticides_tonnes = data.get('pesticides_tonnes')
        avg_temp = data.get('avg_temp')
        Area = data.get('Area')
        Item = data.get('Item')
        user_id = data.get('user_id')
        
        # Validate required fields
        required_fields = ['Year', 'average_rain_fall_mm_per_year', 'pesticides_tonnes', 'avg_temp', 'Area', 'Item']
        for field in required_fields:
            if data.get(field) is None or data.get(field) == '':
                response = jsonify({'error': f'Missing required field: {field}'})
                response.headers.update(get_cors_headers())
                return response, 400
        
        # Prepare features for prediction
        features = np.array([[Year, average_rain_fall_mm_per_year, pesticides_tonnes, avg_temp, Area, Item]], dtype=object)
        transformed_features = preprocessor.transform(features)
        prediction = dtr.predict(transformed_features).reshape(1, -1)
        
        # Store prediction in MongoDB
        prediction_record = {
            'timestamp': datetime.now(),
            'user_id': user_id,
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
        
        response = jsonify({"prediction": prediction.tolist()})
        response.headers.update(get_cors_headers())
        return response
        
    except Exception as e:
        print(f"Error in predict endpoint: {e}")
        response = jsonify({'error': str(e)})
        response.headers.update(get_cors_headers())
        return response, 500

# For Vercel deployment
def handler(request):
    return app(request)

if __name__ == '__main__':
    app.run(debug=True)