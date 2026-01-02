from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import time

# Absolute imports
from collectors.network import collector
from manager import manager

app = FastAPI(
    title="IDS Defense API",
    description="Intrusion Detection System with ML & Real-Time Dashboard",
    version="1.0.0",
    docs_url="/docs",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Project Identity
IDENTITY = {
    "project": "Intrusion Detection System (IDS)",
    "developer": "P Ganesh Krishna Reddy",
    "portfolio": "https://pganeshreddy.netlify.app/",
    "deployment": "ProgVision",
    "deployment_url": "https://progvision.in/"
}

@app.on_event("startup")
async def startup_event():
    # Start the network collector in simulation mode
    asyncio.create_task(collector.start())

@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "IDS Defense API is operational",
        "identity": IDENTITY
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": time.time()}

@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
