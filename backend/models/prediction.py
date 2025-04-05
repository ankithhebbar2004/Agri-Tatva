import os
import pickle
import numpy as np

class CropYieldPredictor:
    _instance = None
    
    @staticmethod
    def get_instance():
        if CropYieldPredictor._instance is None:
            CropYieldPredictor._instance = CropYieldPredictor()
        return CropYieldPredictor._instance
    
    def __init__(self):
        # Find model files
        models_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        dtr_path = os.path.join(models_dir, 'dtr.pkl')
        preprocessor_path = os.path.join(models_dir, 'preprocessor.pkl')
        
        # Load models
        self.dtr = pickle.load(open(dtr_path, 'rb'))
        self.preprocessor = pickle.load(open(preprocessor_path, 'rb'))
    
    def predict(self, Year, average_rain_fall_mm_per_year, pesticides_tonnes, avg_temp, Area, Item):
        """Make a prediction using the trained model"""
        features = np.array([[Year, average_rain_fall_mm_per_year, pesticides_tonnes, avg_temp, Area, Item]], dtype=object)
        transformed_features = self.preprocessor.transform(features)
        prediction = self.dtr.predict(transformed_features).reshape(1, -1)
        return prediction
