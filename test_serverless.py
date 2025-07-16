#!/usr/bin/env python3
"""
Test script to verify serverless functions work correctly
"""

import os
import sys
import json
import tempfile
import subprocess

# Add api directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'api'))

def test_health_endpoint():
    """Test the health endpoint"""
    print("Testing health endpoint...")
    try:
        from api.health import app
        
        with app.test_client() as client:
            response = client.get('/api/health')
            data = json.loads(response.data)
            
            if response.status_code == 200 and data.get('status') == 'healthy':
                print("✅ Health endpoint test passed")
                return True
            else:
                print(f"❌ Health endpoint test failed: {data}")
                return False
                
    except Exception as e:
        print(f"❌ Health endpoint test failed with error: {e}")
        return False

def test_model_loading():
    """Test model loading functionality"""
    print("Testing model loading...")
    try:
        from api.utils import load_models
        
        dtr, preprocessor = load_models()
        
        if dtr is not None and preprocessor is not None:
            print("✅ Model loading test passed")
            return True
        else:
            print("❌ Model loading test failed: Models are None")
            return False
            
    except Exception as e:
        print(f"❌ Model loading test failed with error: {e}")
        return False

def test_cors_headers():
    """Test CORS headers functionality"""
    print("Testing CORS headers...")
    try:
        from api.utils import get_cors_headers
        
        headers = get_cors_headers()
        
        required_headers = ['Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers']
        
        if all(header in headers for header in required_headers):
            print("✅ CORS headers test passed")
            return True
        else:
            print(f"❌ CORS headers test failed: Missing headers")
            return False
            
    except Exception as e:
        print(f"❌ CORS headers test failed with error: {e}")
        return False

def main():
    """Run all tests"""
    print("Running serverless function tests...\n")
    
    tests = [
        test_health_endpoint,
        test_model_loading,
        test_cors_headers
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print(f"Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The serverless functions are ready for deployment.")
        return 0
    else:
        print("❌ Some tests failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())