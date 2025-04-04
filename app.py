from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import sklearn
print(sklearn.__version__)
#loading models
dtr = pickle.load(open('dtr.pkl','rb'))
preprocessor = pickle.load(open('preprocessor.pkl','rb'))

#flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/predict", methods=['POST'])
def predict():
    if request.method == 'POST':
        # Check if request is coming from React (JSON) or form
        if request.is_json:
            data = request.get_json()
            Year = data['Year']
            average_rain_fall_mm_per_year = data['average_rain_fall_mm_per_year']
            pesticides_tonnes = data['pesticides_tonnes']
            avg_temp = data['avg_temp']
            Area = data['Area']
            Item = data['Item']
        else:
            # Handle form data (original behavior)
            Year = request.form['Year']
            average_rain_fall_mm_per_year = request.form['average_rain_fall_mm_per_year']
            pesticides_tonnes = request.form['pesticides_tonnes']
            avg_temp = request.form['avg_temp']
            Area = request.form['Area']
            Item = request.form['Item']

        features = np.array([[Year, average_rain_fall_mm_per_year, pesticides_tonnes, avg_temp, Area, Item]], dtype=object)
        transformed_features = preprocessor.transform(features)
        prediction = dtr.predict(transformed_features).reshape(1, -1)
        
        # If request is from React, return JSON
        if request.is_json:
            return jsonify({"prediction": prediction.tolist()})
        
        # Otherwise return the HTML template
        return render_template('index.html', prediction=prediction)

if __name__ == "__main__":
    app.run(debug=True)