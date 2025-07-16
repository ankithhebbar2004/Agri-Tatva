import os
import pickle
import hashlib
from pymongo import MongoClient
from datetime import datetime

# MongoDB connection utility
def get_mongodb_connection():
    """Get MongoDB connection using environment variables"""
    mongodb_uri = os.environ.get('MONGODB_URI')
    
    if mongodb_uri:
        client = MongoClient(mongodb_uri)
        db_name = os.environ.get('MONGODB_DB_NAME', 'crop_yield_db')
        db = client[db_name]
    else:
        # Fallback to direct connection parameters
        mongo_host = os.environ.get('MONGODB_HOST', 'localhost')
        mongo_port = int(os.environ.get('MONGODB_PORT', 27017))
        mongo_db = os.environ.get('MONGODB_DB_NAME', 'crop_yield_db')
        mongo_user = os.environ.get('MONGODB_USER', '')
        mongo_password = os.environ.get('MONGODB_PASSWORD', '')
        
        if mongo_user and mongo_password:
            connection_string = f"mongodb://{mongo_user}:{mongo_password}@{mongo_host}:{mongo_port}/"
        else:
            connection_string = f"mongodb://{mongo_host}:{mongo_port}/"
        
        client = MongoClient(connection_string)
        db = client[mongo_db]
    
    return db

# Load ML models
def load_models():
    """Load ML models from pickle files"""
    try:
        # Get the directory of the current script
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Look for models in the parent directory
        model_dir = os.path.dirname(current_dir)
        
        dtr_path = os.path.join(model_dir, 'dtr.pkl')
        preprocessor_path = os.path.join(model_dir, 'preprocessor.pkl')
        
        if not os.path.exists(dtr_path):
            raise FileNotFoundError(f"Could not find dtr.pkl at {dtr_path}")
        if not os.path.exists(preprocessor_path):
            raise FileNotFoundError(f"Could not find preprocessor.pkl at {preprocessor_path}")
        
        with open(dtr_path, 'rb') as f:
            dtr = pickle.load(f)
        
        with open(preprocessor_path, 'rb') as f:
            preprocessor = pickle.load(f)
        
        return dtr, preprocessor
    except Exception as e:
        print(f"Error loading models: {e}")
        raise

def generate_stable_user_id(email):
    """Generate a stable user ID based on email address"""
    email_hash = hashlib.md5(email.lower().encode()).hexdigest()
    return f"user_{email_hash[:16]}"

def get_cors_headers():
    """Get CORS headers for API responses"""
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }