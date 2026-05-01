#!/bin/bash

set -e

echo "Building frontend..."
cd frontend
npm run build

echo "Building Docker image..."
docker build -t borehole-ai/frontend:latest .

echo "Pushing to registry..."
docker push borehole-ai/frontend:latest

echo "Deploying to Kubernetes..."
kubectl apply -f ../infrastructure/kubernetes/frontend/

echo "Frontend deployed successfully!"