# 🛡️ IDS Defense: SOC-Grade ML Intrusion Detection Platform

**Deployed and maintained by P Ganesh Krishna Reddy | Engineering by ProgVision**

[![Live Demo](https://img.shields.io/badge/Live-idsdefense.netlify.app-blue?style=for-the-badge&logo=netlify)](https://idsdefense.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-IDS--Defense-black?style=for-the-badge&logo=github)](https://github.com/ganeshkrishnareddy/IDS-Defense)

IDS Defense is an enterprise-grade Intrusion Detection System that merges high-frequency network telemetry with Machine Learning to identify and visualize security breaches in real-time.

## 📺 System Overview

### Real-Time SOC Dashboard
![IDS Dashboard Main](https://raw.githubusercontent.com/ganeshkrishnareddy/IDS-Defense/main/docs/dashboard_main.png)
*Full real-time visualization of network throughput, anomaly spikes, and threat distribution.*

## ✨ Core Features

### 1. 🧠 ML-Powered Detection Engine
- **Models**: Optimized Random Forest & XGBoost v1.2 classifiers.
- **Granular Severity**: Critical, High, Medium, and Low risk prioritization.
- **Inference Latency**: Sub-10ms response time for proactive defense.
- **Detection Types**: Hybrid analysis combining ML anomalies with signature-based rules.

### 2. 📊 SOC-Grade Visuals
- **Actionable KPIs**: Real-time trend indicators with count-up animations and incident-aware coloring.
- **Expandable Threat Feed**: Deep-inspection rows revealing feature vectors, confidence scores, and detection logic.
- **Analytic Widgets**: Top-attacker IP tracking and threat distribution donut charts.

### 3. 🛡️ Enterprise Engineering
- **WebSocket Streaming**: Instant, bi-directional communication for zero-latency alerts.
- **Zero-Trust Ready**: Architecture built for encrypted, authenticated security ecosystems.
- **Compliance**: Infrastructure aligned with NIST-800 and SOC2 standards.

## �️ Step-by-Step Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- Git

### 1. Backend (FastAPI + ML Engine)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
python main.py
```
*The backend starts a WebSocket server on port 8000 and begins network traffic simulation.*

### 2. Frontend (Next.js Dashboard)
```bash
cd frontend
npm install
npm run build
npm start -- --port 3200
```
*The dashboard will be available at `http://localhost:3200`.*

## � Deployment

### GitHub
1. Create a repository named `IDS-Defense` on GitHub.
2. Initialize and push:
```bash
git init
git remote add origin https://github.com/ganeshkrishnareddy/IDS-Defense.git
git branch -M main
git add .
git commit -m "Initial Release: SOC-Grade IDS Defense Platform"
git push -u origin main
```

### Netlify (Frontend)
- **Site Name**: `idsdefense.netlify.app`
- **Build Command**: `npm run build`
- **Publish Directory**: `.next`
- **Note**: Ensure the `@netlify/plugin-nextjs` is enabled in your `netlify.toml`.

## 🧾 Project Identity
- **Created By**: P Ganesh Krishna Reddy ([Portfolio](https://pganeshreddy.netlify.app/))
- **Engineering**: Deployed by **ProgVision** ([progvision.in](https://progvision.in/))
- **Core Stack**: Next.js 15, FastAPI, Tailwind CSS, Scapy, XGBoost.

---
*Built for the next generation of Security Operations Centers. 🔒🛡️*
