#!/bin/bash

echo "🔍 Checking if package is ready for publication..."

# Check if required files exist
required_files=("package.json" "README.md" "LICENSE" "src/lib/index.ts")
for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "❌ Missing required file: $file"
    exit 1
  fi
done

echo "✅ All required files present"

# Check if package.json has required fields
if ! grep -q '"name"' package.json; then
  echo "❌ Package name not set in package.json"
  exit 1
fi

if ! grep -q '"version"' package.json; then
  echo "❌ Package version not set in package.json"
  exit 1
fi

if ! grep -q '"description"' package.json; then
  echo "❌ Package description not set in package.json"
  exit 1
fi

echo "✅ Package.json has required fields"

# Try to build the package
echo "🔨 Building package..."
pnpm run prepack

if [[ $? -ne 0 ]]; then
  echo "❌ Build failed"
  exit 1
fi

echo "✅ Build successful"

# Check if dist folder was created
if [[ ! -d "dist" ]]; then
  echo "❌ dist folder not created"
  exit 1
fi

echo "✅ dist folder created"

# Check if main files exist in dist
if [[ ! -f "dist/index.js" ]]; then
  echo "❌ dist/index.js not found"
  exit 1
fi

if [[ ! -f "dist/index.d.ts" ]]; then
  echo "❌ dist/index.d.ts not found"
  exit 1
fi

echo "✅ Built files present"

echo ""
echo "🎉 Package is ready for publication!"
echo ""
echo "To publish:"
echo "1. Make sure you're logged in to npm: npm login"
echo "2. Run: npm publish"
echo ""
echo "Or for a dry run: npm publish --dry-run"