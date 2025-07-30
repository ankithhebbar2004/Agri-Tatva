#!/usr/bin/env python3
"""
Simple validation script for serverless functions (without dependencies)
"""

import os
import sys

def validate_file_structure():
    """Validate that all required files exist"""
    print("Validating file structure...")
    
    required_files = [
        'api/utils.py',
        'api/health.py',
        'api/login.py',
        'api/register.py',
        'api/predict.py',
        'api/forgot-password.py',
        'api/reset-password.py',
        'api/logout.py',
        'api/requirements.txt',
        'vercel.json',
        'dtr.pkl',
        'preprocessor.pkl'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print(f"❌ Missing files: {', '.join(missing_files)}")
        return False
    else:
        print("✅ All required files are present")
        return True

def validate_vercel_config():
    """Validate vercel.json configuration"""
    print("Validating Vercel configuration...")
    
    try:
        import json
        with open('vercel.json', 'r') as f:
            config = json.load(f)
        
        # Check required fields
        if 'functions' not in config:
            print("❌ 'functions' section missing in vercel.json")
            return False
        
        if 'api/*.py' not in config['functions']:
            print("❌ Python functions configuration missing in vercel.json")
            return False
        
        if 'routes' not in config:
            print("❌ 'routes' section missing in vercel.json")
            return False
        
        print("✅ Vercel configuration is valid")
        return True
        
    except Exception as e:
        print(f"❌ Error validating vercel.json: {e}")
        return False

def validate_api_structure():
    """Validate API function structure"""
    print("Validating API function structure...")
    
    api_files = [
        'api/health.py',
        'api/login.py',
        'api/register.py',
        'api/predict.py',
        'api/forgot-password.py',
        'api/reset-password.py',
        'api/logout.py'
    ]
    
    for file_path in api_files:
        try:
            with open(file_path, 'r') as f:
                content = f.read()
                
            # Check for required patterns
            if 'from flask import' not in content:
                print(f"❌ {file_path}: Missing Flask import")
                return False
                
            if 'def handler(request):' not in content:
                print(f"❌ {file_path}: Missing handler function for Vercel")
                return False
                
            if 'get_cors_headers' not in content:
                print(f"❌ {file_path}: Missing CORS headers")
                return False
                
        except Exception as e:
            print(f"❌ Error reading {file_path}: {e}")
            return False
    
    print("✅ All API functions have correct structure")
    return True

def validate_requirements():
    """Validate requirements.txt"""
    print("Validating requirements.txt...")
    
    try:
        with open('api/requirements.txt', 'r') as f:
            requirements = f.read()
        
        required_packages = ['flask', 'numpy', 'scikit-learn', 'pymongo', 'python-dotenv', 'bcrypt']
        
        for package in required_packages:
            if package not in requirements:
                print(f"❌ Missing required package: {package}")
                return False
        
        print("✅ All required packages are listed in requirements.txt")
        return True
        
    except Exception as e:
        print(f"❌ Error reading requirements.txt: {e}")
        return False

def main():
    """Run all validations"""
    print("Running deployment validation...\n")
    
    validations = [
        validate_file_structure,
        validate_vercel_config,
        validate_api_structure,
        validate_requirements
    ]
    
    passed = 0
    total = len(validations)
    
    for validation in validations:
        if validation():
            passed += 1
        print()
    
    print(f"Validation Results: {passed}/{total} validations passed")
    
    if passed == total:
        print("🎉 All validations passed! The application is ready for Vercel deployment.")
        print("\nNext steps:")
        print("1. Push your code to GitHub")
        print("2. Connect your GitHub repository to Vercel")
        print("3. Set up environment variables in Vercel dashboard:")
        print("   - MONGODB_URI")
        print("   - MONGODB_DB_NAME")
        print("4. Deploy!")
        return 0
    else:
        print("❌ Some validations failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())