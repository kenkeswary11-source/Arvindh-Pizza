#!/bin/bash
# American Pizza - Docker Deployment Script

set -e

echo "🍕 American Pizza - Docker Deployment"
echo "======================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📋 Copying env.example to .env..."
    cp env.example .env
    echo "✅ Created .env file. Please edit it with your configuration before continuing."
    echo ""
    read -p "Press Enter after editing .env file, or Ctrl+C to exit..."
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "🐳 Building and starting containers..."
docker-compose up -d --build

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:80"
echo "   Backend API: http://localhost:5000/api"
echo "   Backend Health: http://localhost:5000/health"
echo ""
echo "📝 View logs: docker-compose logs -f"
echo "🛑 Stop services: docker-compose down"
echo ""

