#!/bin/bash

# Test CORS configuration for API
echo "🧪 Testing CORS configuration..."
echo ""

# Test with Netlify origin
echo "1️⃣ Testing with Netlify origin (https://circleburo.netlify.app):"
curl -I "https://api.circleburo.kz/api/leads" \
  -H "Origin: https://circleburo.netlify.app" \
  2>&1 | grep -i "access-control"
echo ""

# Test with main domain
echo "2️⃣ Testing with main domain (https://circleburo.kz):"
curl -I "https://api.circleburo.kz/api/leads" \
  -H "Origin: https://circleburo.kz" \
  2>&1 | grep -i "access-control"
echo ""

# Test preflight request
echo "3️⃣ Testing OPTIONS preflight request:"
curl -X OPTIONS "https://api.circleburo.kz/api/leads" \
  -H "Origin: https://circleburo.netlify.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v 2>&1 | grep -i "access-control"
echo ""

echo "✅ CORS test completed!"
