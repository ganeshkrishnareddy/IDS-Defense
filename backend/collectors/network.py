import asyncio
import random
import json
from datetime import datetime
from engine.detection import threat_detector
from manager import manager

class NetworkCollector:
    def __init__(self, mode="simulation"):
        self.mode = mode
        self.is_running = False

    async def start(self):
        self.is_running = True
        print(f"Network Collector started in {self.mode} mode.")
        if self.mode == "simulation":
            await self.run_simulation()
        else:
            await self.run_live_capture()

    async def stop(self):
        self.is_running = False
        print("Network Collector stopped.")

    async def run_simulation(self):
        """
        Simulate network traffic and occasional threats for SOC dashboard.
        """
        protocols = ["TCP", "UDP", "HTTP", "HTTPS", "DNS", "SSH", "TLS v1.3"]
        attacker_ips = [
            "185.123.45.67", "91.234.56.78", "103.45.67.89", 
            "45.67.89.10", "14.23.45.67", "223.1.2.3"
        ]
        
        while self.is_running:
            # Simulate a packet
            is_potential_attack = random.random() > 0.8
            src_ip = random.choice(attacker_ips) if is_potential_attack else f"192.168.1.{random.randint(1, 254)}"
            
            packet_data = {
                "timestamp": datetime.now().isoformat(),
                "src_ip": src_ip,
                "dst_ip": f"10.0.0.{random.randint(1, 254)}",
                "protocol": random.choice(protocols),
                "length": random.randint(40, 1500),
                "info": "Generic Traffic" if not is_potential_attack else "Suspicious payload header detected"
            }
            
            # Predict with enriched metadata
            features = threat_detector.preprocess(packet_data)
            prediction = threat_detector.predict(features)
            
            # Create alert/log
            alert = {
                **packet_data,
                **prediction
            }
            
            # Broadcast alerts
            if alert["is_anomaly"]:
                try:
                    await manager.broadcast(json.dumps(alert))
                except Exception as e:
                    print(f"Broadcast error: {e}")
            
            # Sleep to simulate traffic speed - faster for more data points
            await asyncio.sleep(random.uniform(0.05, 0.4))

    async def run_live_capture(self):
        """
        Reserved for live Scapy sniffing.
        """
        pass

collector = NetworkCollector(mode="simulation")
