# PVA Brand Frontend - Running & Deployment Guide

## Running Frontend Without Port 5173

### Option 1: Production Build (Best for Production)

This creates an optimized static build ready for deployment.

#### Step 1: Build the Project
```bash
cd pvabrand-app
npm run build
```

This creates a `dist/` folder with all compiled files.

#### Step 2: Serve Production Build Locally
```bash
# Option A: Using http-server (simple)
npx http-server dist -p 3000

# Option B: Using Python
python -m http.server 3000 --directory dist

# Option C: Using Node.js http-server
npm install -g http-server
http-server dist -p 3000
```

Then access: `http://localhost:3000`

**Advantages:**
- Optimized for production
- Smaller file size
- Better performance
- No dev server overhead

---

### Option 2: Development on Different Port

#### For Frontend Only
```bash
cd pvabrand-app

# Method 1: Command line flag
npm run dev -- --port 3000

# Method 2: Create .env.local (better)
echo "VITE_PORT=3000" > .env.local
npm run dev

# Method 3: Edit package.json
```

Update `package.json`:
```json
{
  "scripts": {
    "dev": "vite --port 3000",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Then run:
```bash
npm run dev
```

Access at: `http://localhost:3000`

---

### Option 3: With Backend on Different Port

#### Terminal 1 - Backend
```bash
cd backend
php artisan serve --host 0.0.0.0 --port 8080
```

#### Terminal 2 - Frontend
```bash
cd pvabrand-app
npm run dev -- --port 3000
```

#### Update Frontend .env.local
```env
VITE_API_URL=http://localhost:8080/api
```

#### Access:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080/api`

---

## Deployment Scenarios

### Scenario 1: Full Production (cPanel/Web Hosting)

**Structure:**
```
yourdomain.com/
├── api/              (Laravel backend)
├── assets/           (React compiled assets)
└── index.html        (React entry point)
```

**Frontend URL:** `https://yourdomain.com`
**Backend URL:** `https://yourdomain.com/api`
**Port:** 443 (HTTPS)

**Steps:**
1. Build frontend: `npm run build`
2. Update `.env`: `VITE_API_URL=https://yourdomain.com/api`
3. Rebuild: `npm run build`
4. Upload `dist/` contents to cPanel root
5. Upload backend to `/api` folder
6. Configure `.htaccess` for React routing

See: `BACKEND_DEPLOYMENT.md` for detailed cPanel instructions.

---

### Scenario 2: Separate Domains

**Frontend Domain:** `app.yourdomain.com`
**Backend Domain:** `api.yourdomain.com`

#### Frontend Setup
1. Build: `npm run build`
2. Update `.env`: `VITE_API_URL=https://api.yourdomain.com`
3. Rebuild: `npm run build`
4. Upload to `app.yourdomain.com` hosting

#### Backend Setup
1. Deploy to `api.yourdomain.com`
2. Update `.env`:
```env
APP_URL=https://api.yourdomain.com
SANCTUM_STATEFUL_DOMAINS=app.yourdomain.com,api.yourdomain.com
```

---

### Scenario 3: Docker Deployment

#### Dockerfile for Frontend
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_URL=http://localhost:8000/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build:
      context: ./pvabrand-app
      args:
        VITE_API_URL: http://backend:8000/api
    ports:
      - "3000:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DB_CONNECTION: mysql
      DB_HOST: db
      DB_DATABASE: pvabrand
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: pvabrand
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

Run:
```bash
docker-compose up
```

Access: `http://localhost:3000`

---

### Scenario 4: Vercel/Netlify (Free Hosting)

#### Option A: Vercel (Recommended)

1. **Build Locally**
```bash
npm run build
```

2. **Create `vercel.json` in root**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@api_url"
  }
}
```

3. **Push to GitHub**
```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

4. **Connect to Vercel**
- Go to vercel.com
- Import project from GitHub
- Add environment variable: `VITE_API_URL=https://yourdomain.com/api`
- Deploy

**Access:** `https://projectname.vercel.app`

#### Option B: Netlify

1. **Push code to GitHub**

2. **Connect to Netlify**
- Go to netlify.com
- New site from Git
- Select repository
- Build command: `npm run build`
- Publish directory: `dist`
- Deploy

3. **Add environment variable**
- Site settings > Build & deploy > Environment
- Add: `VITE_API_URL=https://yourdomain.com/api`
- Rebuild

---

## Port Configuration Options

### Persistent Port Configuration

#### Option 1: Environment File
Create `pvabrand-app/.env.local`:
```env
VITE_PORT=3000
VITE_API_URL=http://localhost:8000/api
```

#### Option 2: Config File
Edit `pvabrand-app/vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: 'localhost',
    strictPort: false,
  },
})
```

#### Option 3: Package.json Scripts
Update `package.json`:
```json
{
  "scripts": {
    "dev": "vite --port 3000 --host 0.0.0.0",
    "dev:8080": "vite --port 8080",
    "dev:5174": "vite --port 5174",
    "build": "vite build",
    "preview": "vite preview --port 3000"
  }
}
```

Then run:
```bash
npm run dev          # Port 3000
npm run dev:8080     # Port 8080
npm run dev:5174     # Port 5174
```

---

## API Configuration for Different Environments

### Development
```env
VITE_API_URL=http://localhost:8000/api
```

### Staging
```env
VITE_API_URL=https://staging-api.yourdomain.com
```

### Production
```env
VITE_API_URL=https://yourdomain.com/api
```

### Override in Code
```javascript
// If environment variable not set, use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
```

---

## Building for Different Targets

### Production Build (Optimized)
```bash
npm run build
```

### Preview Production Build Locally
```bash
npm run preview
```

Access at: `http://localhost:4173` (default preview port)

### Build with Custom Base URL
```bash
VITE_API_URL=https://api.example.com npm run build
```

### Build for Subdirectory (e.g., yourdomain.com/app)
Edit `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/app/',  // Add this line
})
```

Then build:
```bash
npm run build
```

---

## Testing Different Ports Locally

### Quick Test Script
Create `test-ports.sh`:
```bash
#!/bin/bash

echo "Testing port 3000..."
npm run dev -- --port 3000 &
PID1=$!

sleep 5

echo "Testing port 8080..."
php artisan serve --port 8080 &
PID2=$!

echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8080/api"
echo "Press Ctrl+C to stop"

wait
```

Run:
```bash
chmod +x test-ports.sh
./test-ports.sh
```

---

## Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build -- --analyze

# Build with report
npm run build -- --report
```

### Serve with Compression
```bash
npm install -g http-server
http-server dist -p 3000 -g  # -g enables gzip
```

### Minify & Cache Busting
Vite automatically handles this in production build:
- JavaScript minified
- Assets have hash in filename
- CSS bundled and minified
- Images optimized

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
npm run dev -- --port 3001
```

### CORS Errors
Make sure backend allows CORS. Update backend `.env`:
```env
SANCTUM_STATEFUL_DOMAINS=localhost:3000,yourdomain.com
```

### API Not Responding
Check:
1. Frontend `.env` has correct API URL
2. Backend is running
3. Backend port is accessible
4. CORS is configured

### Build Failures
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build

# Check for errors
npm run lint
npm run build -- --sourcemap
```

---

## Quick Reference

### Development (Port 3000)
```bash
echo "VITE_PORT=3000" > pvabrand-app/.env.local
cd pvabrand-app
npm install
npm run dev
# Access: http://localhost:3000
```

### Production (No Port)
```bash
cd pvabrand-app
npm run build
npx http-server dist -p 80
# Access: http://localhost (no port shown)
```

### With Backend (Port 3000 + 8000)
```bash
# Terminal 1
cd backend
php artisan serve --port 8000

# Terminal 2
cd pvabrand-app
npm run dev -- --port 3000

# Frontend: http://localhost:3000
# Backend: http://localhost:8000/api
```

---

## Environment Variables Summary

| Variable | Purpose | Example |
|----------|---------|---------|
| VITE_PORT | Dev server port | 3000 |
| VITE_API_URL | Backend API URL | http://localhost:8000/api |
| NODE_ENV | Environment | development/production |

---

**Deployment Ready**: ✅
**Flexibility**: High (multiple port options)
**Production Ready**: ✅
