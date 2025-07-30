# Environment Variables for Vercel Deployment

This application requires the following environment variables to be set in your Vercel project:

## Required Variables

### Database Configuration
- `MONGODB_URI`: MongoDB connection URI (e.g., mongodb+srv://username:password@cluster.mongodb.net/database)
- `MONGODB_DB_NAME`: Database name (default: crop_yield_db)

### Alternative Database Configuration (if not using MONGODB_URI)
- `MONGODB_HOST`: MongoDB host (default: localhost)
- `MONGODB_PORT`: MongoDB port (default: 27017)  
- `MONGODB_USER`: MongoDB username (optional)
- `MONGODB_PASSWORD`: MongoDB password (optional)

## How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the required variables listed above
4. Redeploy your application

## Example Values

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crop_yield_db
MONGODB_DB_NAME=crop_yield_db
```

## Note for Development

For local development, create a `.env` file in the root directory with the same variables.