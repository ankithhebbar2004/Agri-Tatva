# Crop Yield Prediction Project

A modern web application for predicting crop yields using machine learning, built with React frontend and Python backend, deployable on Vercel.

## Features

- 🌾 **Crop Yield Prediction**: Advanced ML models for accurate yield predictions
- 👤 **User Authentication**: Complete auth system with registration, login, and password reset
- 📊 **Interactive Dashboard**: Modern UI with dark/light mode toggle
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔒 **Secure**: Password hashing, JWT tokens, and secure API endpoints
- ☁️ **Cloud Ready**: Fully deployable on Vercel with serverless functions

## Tech Stack

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Bootstrap for styling
- Context API for state management

### Backend
- Python Flask serverless functions
- MongoDB for data storage
- scikit-learn for ML models
- bcrypt for password hashing
- Vercel serverless deployment

## Deployment on Vercel

This application is ready for deployment on Vercel. Follow these steps:

### 1. Prerequisites
- GitHub account
- Vercel account
- MongoDB Atlas account (recommended)

### 2. Environment Variables
Set the following environment variables in your Vercel project:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crop_yield_db
MONGODB_DB_NAME=crop_yield_db
```

### 3. Deploy
1. Fork this repository
2. Connect your GitHub repository to Vercel
3. Set the environment variables in Vercel dashboard
4. Deploy!

The `vercel.json` configuration file is already set up to handle:
- React frontend build
- Python serverless functions
- API routing
- CORS handling

## Local Development

### Frontend
```bash
npm install
npm start
```

### Backend (for local testing)
```bash
cd backend
pip install -r requirements.txt
python app.py
```

## API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `POST /api/forgot-password` - Password reset request
- `POST /api/reset-password` - Password reset
- `POST /api/predict` - Crop yield prediction
- `GET /api/health` - Health check

## Project Structure

```
├── src/                    # React frontend
│   ├── components/        # React components
│   ├── context/          # React context
│   └── data/             # Static data
├── api/                   # Vercel serverless functions
│   ├── utils.py          # Shared utilities
│   ├── predict.py        # Prediction endpoint
│   ├── login.py          # Authentication endpoints
│   └── ...
├── build/                 # Production build
├── *.pkl                  # ML model files
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

