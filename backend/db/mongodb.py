from pymongo import MongoClient
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import secrets
import bcrypt

# Load environment variables
load_dotenv()

# MongoDB connection class
class MongoDB:
    _instance = None
    
    @staticmethod
    def get_instance():
        if MongoDB._instance is None:
            MongoDB._instance = MongoDB()
        return MongoDB._instance
    
    def __init__(self):
        # First check for MongoDB Atlas URI (highest priority)
        self.connection_string = os.environ.get('MONGODB_URI')
        self.db_name = os.environ.get('MONGODB_DB_NAME', 'crop_yield_db')
        
        if self.connection_string:
            print(f"Connecting to MongoDB Atlas: {self.db_name}")
        else:
            # Fallback to direct connection
            mongo_host = os.environ.get('MONGODB_HOST', 'localhost')
            mongo_port = int(os.environ.get('MONGODB_PORT', 27017))
            mongo_user = os.environ.get('MONGODB_USER', '')
            mongo_password = os.environ.get('MONGODB_PASSWORD', '')
            
            # Build connection string
            if mongo_user and mongo_password:
                self.connection_string = f"mongodb://{mongo_user}:{mongo_password}@{mongo_host}:{mongo_port}/"
            else:
                self.connection_string = f"mongodb://{mongo_host}:{mongo_port}/"
                
            print(f"Connecting to MongoDB: {self.db_name} at {mongo_host}:{mongo_port}")
        
        # Connect and setup collections
        self.client = MongoClient(self.connection_string)
        self.db = self.client[self.db_name]
        self.predictions = self.db['predictions']
        self.users = self.db['users']
    
    def check_connection(self):
        """Check if MongoDB connection is working"""
        try:
            # Ping the server to verify connection
            self.client.server_info()
            return True
        except Exception as e:
            print(f"MongoDB connection error: {e}")
            return False
    
    def save_prediction(self, prediction_data):
        """Save a prediction to the database"""
        try:
            result = self.predictions.insert_one(prediction_data)
            return result.inserted_id
        except Exception as e:
            print(f"Error saving to MongoDB: {e}")
            return None
    
    def get_prediction_history(self, limit=10):
        """Get prediction history"""
        try:
            results = self.predictions.find({}, {'_id': 0}).sort('timestamp', -1).limit(limit)
            return list(results)
        except Exception as e:
            print(f"Error fetching from MongoDB: {e}")
            return []
    
    def get_stats(self):
        """Get database statistics"""
        stats = {}
        try:
            stats['record_count'] = self.predictions.count_documents({})
            stats['database_exists'] = 'crop_yield_db' in self.client.list_database_names()
            stats['collection_exists'] = 'predictions' in self.db.list_collection_names()
        except Exception as e:
            stats['error'] = str(e)
        return stats
    
    def create_password_reset_token(self, email):
        """Create a password reset token for a user"""
        try:
            # Generate a secure token
            reset_token = secrets.token_urlsafe(32)
            reset_expiry = datetime.now() + timedelta(hours=24)
            
            # Update user with token
            result = self.users.update_one(
                {'email': email},
                {'$set': {
                    'reset_token': reset_token,
                    'reset_expiry': reset_expiry
                }}
            )
            
            if result.modified_count == 1:
                return reset_token
            return None
        except Exception as e:
            print(f"Error creating password reset token: {e}")
            return None
    
    def reset_password_with_token(self, token, new_password):
        """Reset a user's password using a reset token"""
        try:
            # Find user with valid token
            user = self.users.find_one({
                'reset_token': token,
                'reset_expiry': {'$gt': datetime.now()}
            })
            
            if not user:
                return False
                
            # Hash new password
            hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
            
            # Update user's password and remove token
            result = self.users.update_one(
                {'_id': user['_id']},
                {
                    '$set': {'password': hashed_password},
                    '$unset': {'reset_token': "", 'reset_expiry': ""}
                }
            )
            
            return result.modified_count == 1
        except Exception as e:
            print(f"Error resetting password: {e}")
            return False
