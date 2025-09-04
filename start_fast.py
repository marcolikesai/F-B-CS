#!/usr/bin/env python3
"""
Fast startup script for Silver Arena Analytics
Uses pre-computed cache for instant API responses
"""

import subprocess
import sys
import os
import time
import signal
from pathlib import Path

class FastLauncher:
    def __init__(self):
        self.backend_process = None
        self.frontend_process = None
        self.base_dir = Path(__file__).parent.absolute()
        
    def start_backend(self):
        """Start the fast cached backend server"""
        print("Starting fast backend server...")
        backend_dir = self.base_dir / 'backend'
        
        try:
            self.backend_process = subprocess.Popen([
                sys.executable, 'app_fast.py'
            ], cwd=backend_dir)
            print("Backend server started on http://localhost:5001")
            return True
        except Exception as e:
            print(f"Failed to start backend: {e}")
            return False
            
    def start_frontend(self):
        """Start the React frontend server"""
        print("Starting frontend server...")
        frontend_dir = self.base_dir / 'frontend'
        
        try:
            env = os.environ.copy()
            env['BROWSER'] = 'none'
            
            self.frontend_process = subprocess.Popen([
                'npm', 'start'
            ], cwd=frontend_dir, env=env)
            print("Frontend server started on http://localhost:3000")
            return True
        except Exception as e:
            print(f"Failed to start frontend: {e}")
            return False
            
    def cleanup(self):
        """Clean up processes"""
        print("Shutting down servers...")
        
        if self.backend_process:
            self.backend_process.terminate()
            try:
                self.backend_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.backend_process.kill()
            print("Backend server stopped")
            
        if self.frontend_process:
            self.frontend_process.terminate()
            try:
                self.frontend_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.frontend_process.kill()
            print("Frontend server stopped")
            
    def signal_handler(self, signum, frame):
        """Handle interrupt signals"""
        self.cleanup()
        sys.exit(0)
        
    def run(self):
        """Main application runner"""
        print("Silver Arena Analytics - Fast Mode")
        print("=" * 40)
        
        # Set up signal handlers
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
        
        try:
            # Start backend
            if not self.start_backend():
                return False
                
            # Wait a moment
            time.sleep(2)
                
            # Start frontend
            if not self.start_frontend():
                self.cleanup()
                return False
                
            print("\nApplication started successfully!")
            print("Dashboard: http://localhost:3000")
            print("API: http://localhost:5001")
            print("\nPress Ctrl+C to stop")
            
            # Keep running
            while True:
                time.sleep(1)
                
        except KeyboardInterrupt:
            self.cleanup()
            return True
        except Exception as e:
            print(f"Error: {e}")
            self.cleanup()
            return False

if __name__ == "__main__":
    launcher = FastLauncher()
    success = launcher.run()
    sys.exit(0 if success else 1) 