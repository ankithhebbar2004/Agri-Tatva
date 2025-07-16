# Vercel Deployment Guide

## Overview
This repository has been successfully configured for deployment on Vercel with the following setup:

### Architecture
- **Frontend**: React application (Create React App)
- **Backend**: Python Flask serverless functions
- **Database**: MongoDB (recommended: MongoDB Atlas)
- **Hosting**: Vercel (frontend + serverless functions)

## What Was Changed

### 1. Fixed React Build Issues
- Removed unused variables causing ESLint errors
- Fixed React hooks dependencies
- Ensured clean build with `npm run build`

### 2. Converted Flask Backend to Serverless Functions
- Created `api/` directory with individual serverless functions
- Split monolithic Flask app into separate endpoints:
  - `/api/health` - Health check
  - `/api/login` - User authentication  
  - `/api/register` - User registration
  - `/api/logout` - User logout
  - `/api/predict` - Crop yield prediction
  - `/api/forgot-password` - Password reset request
  - `/api/reset-password` - Password reset
- Added proper CORS handling
- Maintained MongoDB integration
- Preserved ML model loading functionality

### 3. Updated API Endpoints
- Changed all `localhost:5000` URLs to relative `/api/` paths
- Updated all React components to use new endpoints
- Maintained backward compatibility

### 4. Vercel Configuration
- Updated `vercel.json` with Python functions configuration
- Added proper routing for API endpoints
- Configured build settings for React app

### 5. Documentation
- Updated README with deployment instructions
- Created deployment validation script
- Added environment variables documentation

## Deployment Steps

### 1. Prerequisites
- GitHub repository (this repo)
- Vercel account
- MongoDB Atlas account (recommended)

### 2. Environment Variables
Set these in your Vercel project dashboard:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_DB_NAME=crop_yield_db
```

### 3. Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect it as a React app
3. The `vercel.json` configuration will handle the serverless functions
4. Set the environment variables in Vercel dashboard
5. Deploy!

## File Structure
```
├── src/                    # React frontend
├── api/                    # Python serverless functions
│   ├── utils.py           # Shared utilities
│   ├── health.py          # Health check endpoint
│   ├── login.py           # Login endpoint
│   ├── register.py        # Register endpoint
│   ├── predict.py         # Prediction endpoint
│   ├── forgot-password.py # Password reset request
│   ├── reset-password.py  # Password reset
│   ├── logout.py          # Logout endpoint
│   └── requirements.txt   # Python dependencies
├── *.pkl                  # ML model files
├── vercel.json            # Vercel configuration
└── package.json           # Node.js dependencies
```

## Features Preserved
- ✅ User authentication (register, login, logout)
- ✅ Password reset functionality
- ✅ Crop yield prediction with ML models
- ✅ Dark/light mode toggle
- ✅ Responsive design
- ✅ MongoDB data persistence
- ✅ All existing React components

## Validation
Run `python validate_deployment.py` to verify deployment readiness.

## Testing
The application includes:
- Frontend build validation
- API structure validation
- Vercel configuration validation
- File structure validation

## Notes
- The ML models (dtr.pkl, preprocessor.pkl) are included in the repository
- MongoDB connection is configured for both local and cloud deployment
- CORS is properly configured for cross-origin requests
- All API endpoints include proper error handling
- The application maintains the same user experience as the original

## Support
If you encounter any issues during deployment:
1. Check that all environment variables are set correctly
2. Verify MongoDB connection string is valid
3. Ensure all required files are present
4. Check Vercel function logs for any errors