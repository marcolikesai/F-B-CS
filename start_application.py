#!/usr/bin/env python3
"""
Silver Arena Analytics Application Launcher
Starts both the Flask backend and React frontend
"""

import subprocess
import sys
import os
import time
import signal
import threading
from pathlib import Path

class ApplicationLauncher:
    def __init__(self):
        self.backend_process = None
        self.frontend_process = None
        self.base_dir = Path(__file__).parent.absolute()
        
    def check_dependencies(self):
        """Check if required dependencies are installed"""
        print("🔍 Checking dependencies...")
        
        # Check Python dependencies
        try:
            import flask
            import pandas
            import numpy
            import sklearn
            print("✅ Python dependencies found")
        except ImportError as e:
            print(f"❌ Missing Python dependency: {e}")
            print("Please install backend dependencies: pip install -r backend/requirements.txt")
            return False
            
        # Check if Node.js is available
        try:
            subprocess.run(['node', '--version'], check=True, capture_output=True)
            print("✅ Node.js found")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("❌ Node.js not found. Please install Node.js to run the frontend.")
            return False
            
        return True
        
    def install_frontend_dependencies(self):
        """Install frontend dependencies if needed"""
        frontend_dir = self.base_dir / 'frontend'
        node_modules = frontend_dir / 'node_modules'
        
        if not node_modules.exists():
            print("📦 Installing frontend dependencies...")
            try:
                subprocess.run(['npm', 'install'], 
                             cwd=frontend_dir, 
                             check=True)
                print("✅ Frontend dependencies installed")
            except subprocess.CalledProcessError:
                print("❌ Failed to install frontend dependencies")
                return False
        else:
            print("✅ Frontend dependencies already installed")
        return True
        
    def start_backend(self):
        """Start the Flask backend server"""
        print("🚀 Starting Flask backend server...")
        backend_dir = self.base_dir / 'backend'
        
        try:
            self.backend_process = subprocess.Popen([
                sys.executable, 'app.py'
            ], cwd=backend_dir)
            print("✅ Backend server started on http://localhost:5000")
            return True
        except Exception as e:
            print(f"❌ Failed to start backend: {e}")
            return False
            
    def start_frontend(self):
        """Start the React frontend server"""
        print("🚀 Starting React frontend server...")
        frontend_dir = self.base_dir / 'frontend'
        
        try:
            # Set environment to avoid automatic browser opening
            env = os.environ.copy()
            env['BROWSER'] = 'none'
            
            self.frontend_process = subprocess.Popen([
                'npm', 'start'
            ], cwd=frontend_dir, env=env)
            print("✅ Frontend server started on http://localhost:3000")
            return True
        except Exception as e:
            print(f"❌ Failed to start frontend: {e}")
            return False
            
    def wait_for_backend(self, max_attempts=30):
        """Wait for backend to be ready"""
        import requests
        
        print("⏳ Waiting for backend to be ready...")
        for attempt in range(max_attempts):
            try:
                response = requests.get('http://localhost:5001/', timeout=2)
                if response.status_code == 200:
                    print("✅ Backend is ready!")
                    return True
            except requests.exceptions.RequestException:
                pass
            time.sleep(1)
        
        print("❌ Backend failed to start within timeout")
        return False
        
    def cleanup(self):
        """Clean up processes"""
        print("\n🛑 Shutting down servers...")
        
        if self.backend_process:
            self.backend_process.terminate()
            try:
                self.backend_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.backend_process.kill()
            print("✅ Backend server stopped")
            
        if self.frontend_process:
            self.frontend_process.terminate()
            try:
                self.frontend_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.frontend_process.kill()
            print("✅ Frontend server stopped")
            
    def signal_handler(self, signum, frame):
        """Handle interrupt signals"""
        self.cleanup()
        sys.exit(0)
        
    def run(self):
        """Main application runner"""
        print("🏟️  Silver Arena Analytics Application Launcher")
        print("=" * 50)
        
        # Set up signal handlers
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
        
        try:
            # Check dependencies
            if not self.check_dependencies():
                return False
                
            # Install frontend dependencies
            if not self.install_frontend_dependencies():
                return False
                
            # Start backend
            if not self.start_backend():
                return False
                
            # Wait for backend to be ready
            if not self.wait_for_backend():
                self.cleanup()
                return False
                
            # Start frontend
            if not self.start_frontend():
                self.cleanup()
                return False
                
            print("\n🎉 Application started successfully!")
            print("📊 Dashboard: http://localhost:3000")
            print("🔌 API: http://localhost:5000")
            print("\nPress Ctrl+C to stop the application")
            
            # Keep the script running
            while True:
                time.sleep(1)
                
        except KeyboardInterrupt:
            self.cleanup()
            return True
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            self.cleanup()
            return False

if __name__ == "__main__":
    launcher = ApplicationLauncher()
    success = launcher.run()
    sys.exit(0 if success else 1) 