# ☀️ SolarGenius Pro - Complete Documentation

## World's Most Advanced Solar AI Platform

### Overview

SolarGenius Pro is an enterprise-grade AI-powered platform for solar infrastructure design, quoting, education, and repair. Built for Africa and the world.

### Features

#### Core Capabilities
- **AI Quoting Without Site Visits** - BOQ/Image/Video analysis
- **3D Interactive Design Studio** - Real-time roof modeling with shading simulation
- **Comprehensive Sizing Calculator** - Load profiling, PSH, battery optimization
- **Professional Reports** - Engineering, Electrical, Financial, P75/P90
- **Solar Energy School** - 4 levels with certificates
- **1,247+ Fault Code Database** - Searchable with solutions
- **AI Assistant** - NLP chat with voice support
- **Multi-Infrastructure** - Solar + Borehole + Generator
- **Digital Twin** - 25-year lifecycle simulation
- **Market Intelligence** - Real-time pricing, supplier network

#### Technical Capabilities
- Multi-tenancy (SaaS ready)
- Offline-first (Africa advantage)
- PWA / React Native mobile apps
- Real-time WebSocket updates
- M-Pesa/Flutterwave/Paystack integration
- NASA POWER, Google Earth Engine, LiDAR integration

### Quick Start

```bash
# Clone repository
git clone https://github.com/emerson-eims/solargenius-pro.git
cd solargenius-pro

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your API keys

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev

# Start backend server
npm run server

# Run with Docker
docker-compose -f docker/docker-compose.yml up