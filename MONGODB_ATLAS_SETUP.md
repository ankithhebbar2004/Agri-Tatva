# MongoDB Atlas Setup Guide

This guide will help you set up a MongoDB Atlas cluster for team collaboration on the Crop Yield Prediction project.

## Setting Up MongoDB Atlas

1. **Create an Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for a free account

2. **Create a New Cluster**
   - Click "Build a Database"
   - Select the FREE shared cluster option
   - Choose a cloud provider (AWS, Google Cloud, or Azure) and region closest to your team
   - Click "Create Cluster" (this takes a few minutes)

3. **Set Up Database Access**
   - Go to Security → Database Access
   - Click "Add New Database User"
   - Username and Password authentication method
   - Create a username and password (save these!)
   - Set privileges to "Read and Write to Any Database"
   - Add User

4. **Configure Network Access**
   - Go to Security → Network Access
   - Click "Add IP Address"
   - For development, you can select "Allow Access from Anywhere" (not recommended for production)
   - Alternatively, add each team member's IP address
   - Click "Confirm"

5. **Get Your Connection String**
   - Go to Databases → Connect
   - Click "Connect your application"
   - Select "Python" and version "3.6 or later"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `myFirstDatabase` with your credentials and database name (`crop_yield_db`)

## Team Configuration

Share the following information with your team members:

1. The connection string format:
   ```
   mongodb+srv://<username>:<password>@<cluster-url>/crop_yield_db?retryWrites=true&w=majority
   ```

2. Each team member should:
   - Create their own `.env` file
   - Paste the connection string as the value for `MONGODB_URI`
   - Replace `<username>` and `<password>` with the database user credentials you created
   
3. Important security notes:
   - Never commit the `.env` file to version control
   - Don't share database credentials via unsecured channels
   - For production, restrict IP access to specific addresses

## Testing the Connection

To test your MongoDB Atlas connection:

1. Run the Flask application:
   ```
   cd d:\Crop_Yield_Prediction_Advanced_UI\backend
   python app.py
   ```

2. Visit `/check-db` endpoint to verify the connection:
   ```
   http://localhost:5000/check-db
   ```

## Database Organization

- All team members will share the same MongoDB Atlas cluster
- All predictions will be stored in the `predictions` collection
- Everyone can see all predictions made by the team
