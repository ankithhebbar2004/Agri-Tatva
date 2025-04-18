from math import ceil
import numpy as np
import pandas as pd
from scipy import linalg
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, cross_val_score, KFold

from sklearn.preprocessing import OneHotEncoder, MinMaxScaler
from sklearn.neighbors import KNeighborsRegressor
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, Lasso, Ridge
from sklearn.svm import LinearSVR
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
import pickle
import warnings

warnings.simplefilter(action='ignore', category=FutureWarning)

# Load dataset
df = pd.read_csv('yield_df1.csv')

# Drop 'Unnamed' column if present
if 'Unnamed: 0' in df.columns:
    df.drop('Unnamed: 0', axis=1, inplace=True)

# Handling Null values
print("Handling Null values")
print("Null:", df.isnull().sum())

# Dropping Duplicate Entries
print("Duplicate Entries")
print("Duplicates:", df.duplicated().sum())

print("Dropping Duplicates")
df.drop_duplicates(inplace=True)
print(df.head())

# Function to check if a value is a string
def isStr(obj):
    try:
        float(obj)
        return False
    except:
        return True

# Drop rows with non-numeric values in 'average_rain_fall_mm_per_year' column
to_drop = df[df['average_rain_fall_mm_per_year'].apply(isStr)].index
df.drop(to_drop, inplace=True)

print("Converting column 3 to Numerics")
print("converting average rainfall column to float")
df['average_rain_fall_mm_per_year'] = df['average_rain_fall_mm_per_year'].astype(np.float64)

# Visualizing top 50 Areas
plt.figure(figsize=(15, 10))
top_areas = df['Area'].value_counts().nlargest(50).index
sns.countplot(y=df[df['Area'].isin(top_areas)]['Area'])
plt.title('Count of Top 50 Areas')
plt.xlabel('Count')
plt.ylabel('Area')
plt.show()

# Identify the top 50 areas with the highest crop yield
top_areas = df.groupby('Area')['hg/ha_yield'].sum().sort_values(ascending=False).head(50).index

# Filter the dataframe for the top 50 areas
df_top_areas = df[df['Area'].isin(top_areas)]

# Visualizing Crop Yield vs Item
crops = df['Item'].unique()
yield_per_crop = []
for crop in crops:
    yield_per_crop.append(df[df['Item'] == crop]['hg/ha_yield'].sum())
sns.barplot(y=crops, x=yield_per_crop)
plt.title('Crop Yield vs Item')
plt.show()

# Train-Test-Split
col = ['Year', 'average_rain_fall_mm_per_year', 'pesticides_tonnes', 'avg_temp', 'Area', 'Item', 'hg/ha_yield']
df = df[col]
X = df.iloc[:, :-1]
y = df.iloc[:, -1]
print(df.head(3))
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Preprocessing: Converting Categorical to Numerical and Scaling the values
ohe = OneHotEncoder(drop='first')
scale = MinMaxScaler()

preprocesser = ColumnTransformer(  transformers=[
        ('StandardScale', scale, [0, 1, 2, 3]),
        ('OHE', ohe, [4, 5]),
    ],
    remainder='passthrough'
)

X_train_dummy = preprocesser.fit_transform(X_train)
X_test_dummy = preprocesser.transform(X_test)

# Define the number of folds for cross-validation
num_folds = 10  # You can adjust this number as needed

# Initialize KFold object
kf = KFold(n_splits=num_folds, shuffle=True, random_state=42)

# Training the model
models = {
    'Linear Regression': LinearRegression(),
    'Lasso Regression': Lasso(),
    'Ridge Regression': Ridge(),
    'Decision Tree Regressor': DecisionTreeRegressor(),
    'Support Vector Regressor' : LinearSVR(),
    'K Nearest Neighbours Regressor' : KNeighborsRegressor(n_neighbors=100),
    'Gradient Boosting Regressor' : GradientBoostingRegressor(n_estimators=200, max_depth=3, random_state=0)
}

plt.figure(figsize=(12, 10))

for name, md in models.items():
    scores = cross_val_score(md, X_train_dummy, y_train, cv=10, scoring='neg_mean_absolute_error')
    avg_mae = -scores.mean()
    scores_r2 = cross_val_score(md, X_train_dummy, y_train, cv=10, scoring='r2')
    avg_r2 = scores_r2.mean()
    print('After applying Cross Validation\n')
    print(f"{name} : \n Mean-Absolute-Error(MAE)  : {avg_mae} \t Mean R-squared : {avg_r2} \n\n")
    
    md.fit(X_train_dummy, y_train)
    y_pred = md.predict(X_test_dummy)

    if name == 'Linear Regression':  # For Linear Regression
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        mse = mean_squared_error(y_test,y_pred)
        print(f"{name} : \n Mean-Absolute-Error(MAE) : {mae} \t R-squared : {r2} \t Mean-Squared-Error(MSE) : {mse} \n\n")
    else:  # For other algorithms
        print(f"{name} : \n  Mean-Absolute-Error(MAE) : {mean_absolute_error(y_test, y_pred)} \t R-squared : {r2_score(y_test, y_pred)} \t Mean-Squared-Error(MSE)  : {mean_squared_error(y_test, y_pred)}\n\n ")
    
    
knn = models['K Nearest Neighbours Regressor']
dtr = models['Decision Tree Regressor']
y_pred_knn = knn.predict(X_test_dummy)
y_pred_dtr = dtr.predict(X_test_dummy)

# Make predictions
y_pred = knn.predict(X_test_dummy)

# Plot Actual vs Predicted Crop Yield
sns.scatterplot(x=y_test, y=y_pred_dtr, label='hg/ha yield', alpha=0.7, s=80)

# Add a diagonal line for comparison
plt.plot([min(y_test), max(y_test)], [min(y_test), max(y_test)], linestyle='--', color='gray')

plt.xlabel("Actual Yield")
plt.ylabel("Predicted Yield")
plt.title("Actual vs Predicted Crop Yield")
plt.legend()
plt.show()  

# After the existing visualization code and before the serialization code, add these visualizations:

# 1. Enhanced Actual vs Predicted visualization for multiple models
plt.figure(figsize=(15, 10))
plt.scatter(y_test, y_pred_knn, label='KNN Predictions', alpha=0.5, color='blue')
plt.scatter(y_test, y_pred_dtr, label='Decision Tree Predictions', alpha=0.5, color='red')
plt.plot([min(y_test), max(y_test)], [min(y_test), max(y_test)], 'k--', lw=3)
plt.xlabel('Actual Yield', fontsize=14)
plt.ylabel('Predicted Yield', fontsize=14)
plt.title('Actual vs Predicted Yield Comparison Across Models', fontsize=16)
plt.legend(fontsize=12)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('actual_vs_predicted_comparison.png')
plt.show()

# 2. Residual Plot Analysis
plt.figure(figsize=(15, 10))

# KNN Residuals
residuals_knn = y_test - y_pred_knn
plt.subplot(2, 2, 1)
plt.scatter(y_pred_knn, residuals_knn, alpha=0.5)
plt.axhline(y=0, color='r', linestyle='-')
plt.xlabel('Predicted Values (KNN)', fontsize=12)
plt.ylabel('Residuals', fontsize=12)
plt.title('KNN Residual Plot', fontsize=14)
plt.grid(True, alpha=0.3)

# Decision Tree Residuals
residuals_dtr = y_test - y_pred_dtr
plt.subplot(2, 2, 2)
plt.scatter(y_pred_dtr, residuals_dtr, alpha=0.5, color='orange')
plt.axhline(y=0, color='r', linestyle='-')
plt.xlabel('Predicted Values (Decision Tree)', fontsize=12)
plt.ylabel('Residuals', fontsize=12)
plt.title('Decision Tree Residual Plot', fontsize=14)
plt.grid(True, alpha=0.3)

# 3. Error Distribution Histogram
plt.subplot(2, 2, 3)
plt.hist(residuals_knn, bins=30, alpha=0.5, label='KNN Errors')
plt.hist(residuals_dtr, bins=30, alpha=0.5, label='DT Errors')
plt.xlabel('Prediction Error', fontsize=12)
plt.ylabel('Frequency', fontsize=12)
plt.title('Error Distribution', fontsize=14)
plt.legend()
plt.grid(True, alpha=0.3)

# 4. QQ Plot for Residuals
from scipy import stats
plt.subplot(2, 2, 4)
stats.probplot(residuals_knn, dist="norm", plot=plt)
plt.title('QQ Plot (KNN Residuals)', fontsize=14)

plt.tight_layout()
plt.savefig('residual_analysis.png')
plt.show()

# 5. Feature Importance for Decision Tree
if hasattr(dtr, 'feature_importances_'):
    # Get feature names (numeric and one-hot encoded)
    numeric_cols = ['Year', 'average_rain_fall_mm_per_year', 'pesticides_tonnes', 'avg_temp']
    categorical_cols = ['Area', 'Item']
    
    # Get one-hot encoded column names
    ohe_col_names = []
    for col in categorical_cols:
        unique_vals = X[col].unique()
        # Skip the first value due to drop='first' in OneHotEncoder
        for val in unique_vals[1:]:
            ohe_col_names.append(f"{col}_{val}")
    
    # Combine all feature names
    all_feature_names = numeric_cols + ohe_col_names
    
    # Get feature importances from DTR
    importances = dtr.feature_importances_
    
    # We need to handle the fact that feature importance array might be shorter
    # than our feature names due to how OneHotEncoder and ColumnTransformer work
    if len(importances) <= len(all_feature_names):
        feature_names = all_feature_names[:len(importances)]
    else:
        print("Warning: Feature importance array length doesn't match feature names")
        feature_names = [f"Feature {i}" for i in range(len(importances))]
    
    # Sort feature importances
    indices = np.argsort(importances)[-10:]  # Top 10 features
    
    plt.figure(figsize=(10, 8))
    plt.barh(range(len(indices)), importances[indices], align='center')
    plt.yticks(range(len(indices)), [feature_names[i] if i < len(feature_names) else f"Feature {i}" for i in indices])
    plt.xlabel('Feature Importance')
    plt.title('Top 10 Important Features (Decision Tree)')
    plt.tight_layout()
    plt.savefig('feature_importance.png')
    plt.show()

# 6. Cross-validation scores visualization
plt.figure(figsize=(15, 8))

# Extract metrics from each model for comparison
model_names = []
r2_scores = []
mae_scores = []
mse_scores = []

for name, model in models.items():
    model_names.append(name)
    
    # Calculate R² scores through cross-validation
    r2_cv = cross_val_score(model, X_train_dummy, y_train, cv=5, scoring='r2')
    r2_scores.append(np.mean(r2_cv))
    
    # Calculate MAE scores through cross-validation
    mae_cv = -cross_val_score(model, X_train_dummy, y_train, cv=5, scoring='neg_mean_absolute_error')
    mae_scores.append(np.mean(mae_cv))
    
    # Calculate MSE scores through cross-validation
    mse_cv = -cross_val_score(model, X_train_dummy, y_train, cv=5, scoring='neg_mean_squared_error')
    mse_scores.append(np.mean(mse_cv))

# Performance comparison charts
plt.subplot(1, 3, 1)
bars = plt.bar(model_names, r2_scores)
plt.title('R² Score by Model')
plt.xticks(rotation=90)
plt.ylim(0, 1)
plt.grid(axis='y', alpha=0.3)
# Add value labels on bars
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height + 0.01,
            f'{height:.2f}', ha='center', va='bottom', rotation=0)

plt.subplot(1, 3, 2)
bars = plt.bar(model_names, mae_scores)
plt.title('Mean Absolute Error by Model')
plt.xticks(rotation=90)
plt.grid(axis='y', alpha=0.3)
# Add value labels
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height + 0.01,
            f'{height:.0f}', ha='center', va='bottom', rotation=0)

plt.subplot(1, 3, 3)
bars = plt.bar(model_names, mse_scores)
plt.title('Mean Squared Error by Model')
plt.xticks(rotation=90)
plt.grid(axis='y', alpha=0.3)
# Add value labels
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height + 0.01,
            f'{height:.0f}', ha='center', va='bottom', rotation=0)

plt.tight_layout()
plt.savefig('model_performance_comparison.png')
plt.show()

# 7. Learning curves
from sklearn.model_selection import learning_curve

def plot_learning_curve(estimator, X, y, title, ylim=None, cv=5,
                        n_jobs=None, train_sizes=np.linspace(.1, 1.0, 5)):
    plt.figure(figsize=(10, 6))
    plt.title(title, fontsize=14)
    if ylim is not None:
        plt.ylim(*ylim)
    plt.xlabel("Training examples", fontsize=12)
    plt.ylabel("Score", fontsize=12)
    
    train_sizes, train_scores, test_scores = learning_curve(
        estimator, X, y, cv=cv, n_jobs=n_jobs, train_sizes=train_sizes, scoring='r2')
    
    train_scores_mean = np.mean(train_scores, axis=1)
    train_scores_std = np.std(train_scores, axis=1)
    test_scores_mean = np.mean(test_scores, axis=1)
    test_scores_std = np.std(test_scores, axis=1)
    
    plt.grid(True, alpha=0.3)
    plt.fill_between(train_sizes, train_scores_mean - train_scores_std,
                     train_scores_mean + train_scores_std, alpha=0.1, color="r")
    plt.fill_between(train_sizes, test_scores_mean - test_scores_std,
                     test_scores_mean + test_scores_std, alpha=0.1, color="g")
    plt.plot(train_sizes, train_scores_mean, 'o-', color="r", label="Training score")
    plt.plot(train_sizes, test_scores_mean, 'o-', color="g", label="Cross-validation score")
    
    plt.legend(loc="best", fontsize=12)
    return plt

# Plot learning curves for KNN and Decision Tree
plot_learning_curve(knn, X_train_dummy, y_train, "KNN Learning Curve", ylim=(0, 1.01))
plt.savefig('knn_learning_curve.png')
plt.show()

plot_learning_curve(dtr, X_train_dummy, y_train, "Decision Tree Learning Curve", ylim=(0, 1.01))
plt.savefig('dtr_learning_curve.png')
plt.show()

# Function to make predictions
def prediction(Year, average_rain_fall_mm_per_year, pesticides_tonnes, avg_temp, Area, Item):
    # Create an array of the input features
    features = np.array([[Year, average_rain_fall_mm_per_year, pesticides_tonnes, avg_temp, Area, Item]], dtype=object)

    # Transform the features using the preprocessor
    transformed_features = preprocesser.transform(features)

    # Make the prediction
    predicted_yield = knn.predict(transformed_features).reshape(1, -1)

    return predicted_yield[0]

# Serialize models and preprocesser
pickle.dump(dtr, open('dtr.pkl', 'wb'))
pickle.dump(preprocesser, open('preprocessor.pkl', 'wb'))
