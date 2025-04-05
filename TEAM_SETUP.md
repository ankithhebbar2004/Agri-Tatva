# Team Database Setup Instructions

This document explains how to connect to the shared MongoDB database for our Crop Yield Prediction project.

## Option 1: MongoDB Atlas (Recommended for Team Collaboration)

1. **Get Connection String**: Ask the team leader for the MongoDB Atlas connection string.

2. **Configure Your Local Setup**:
   - Copy the `.env.example` file to `.env`
   - Uncomment the `MONGODB_URI` line and paste your connection string

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
   ```

3. **Install Required Packages**:
   ```
   pip install -r requirements.txt
   ```

4. **Test Your Connection**:
   ```
   python -m backend.app
   ```
   Or visit `http://localhost:5000/check-db` after starting the app

## Option 2: Self-hosted MongoDB

If using a self-hosted MongoDB accessible on your network:

1. **Configure Connection Details**:
   - Copy the `.env.example` file to `.env`
   - Update the following variables:
   
   ```
   MONGODB_HOST=192.168.1.x  # Replace with actual server IP
   MONGODB_PORT=27017
   MONGODB_DB_NAME=crop_yield_db
   MONGODB_USER=your_username  # If authentication is enabled
   MONGODB_PASSWORD=your_password  # If authentication is enabled
   ```

2. **Verify Network Access**:
   - Ensure the MongoDB server allows connections from your IP
   - Check that port 27017 is open on the server firewall

## Useful Commands

### Check Connection Status
```python
python -c "from backend.db.mongodb import MongoDB; print('Connected' if MongoDB.get_instance().check_connection() else 'Failed to connect')"
```

### View Database Contents
After making predictions, view them using MongoDB Compass or the MongoDB shell:
```
mongosh "mongodb://localhost:27017/crop_yield_db"
db.predictions.find().pretty()
```
