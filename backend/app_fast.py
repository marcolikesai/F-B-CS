from flask import Flask, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Global cache
cache = None
cache_file = os.path.join(os.path.dirname(__file__), 'analysis_cache.json')

def load_cache():
    """Load cached results from JSON file"""
    global cache
    if cache is None:
        if os.path.exists(cache_file):
            with open(cache_file, 'r') as f:
                cache = json.load(f)
            print(f"Cache loaded from {cache_file}")
        else:
            print(f"Cache file not found: {cache_file}")
            print("Run: python backend/cache_results.py to generate cache")
            cache = {}
    return cache

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Silver Arena Analytics API (Fast Mode)",
        "timestamp": datetime.now().isoformat(),
        "cache_generated": cache.get('generated_at', 'Not available') if cache else 'Cache not loaded'
    })

@app.route('/api/analysis/overview')
def get_analysis_overview():
    """Get high-level analysis overview"""
    try:
        data = load_cache()
        if 'overview' not in data:
            return jsonify({"error": "Cache not available. Run cache_results.py first."}), 503
        return jsonify(data['overview'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analysis/event-performance')
def get_event_performance():
    """Get event performance breakdown by type and day"""
    try:
        data = load_cache()
        if 'event_performance' not in data:
            return jsonify({"error": "Cache not available. Run cache_results.py first."}), 503
        return jsonify(data['event_performance'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analysis/stand-performance')
def get_stand_performance():
    """Get stand performance analysis"""
    try:
        data = load_cache()
        if 'stand_performance' not in data:
            return jsonify({"error": "Cache not available. Run cache_results.py first."}), 503
        return jsonify(data['stand_performance'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predictions/march5')
def get_march5_predictions():
    """Get predictions for March 5th game"""
    try:
        data = load_cache()
        if 'march5_predictions' not in data:
            return jsonify({"error": "Cache not available. Run cache_results.py first."}), 503
        return jsonify(data['march5_predictions'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/staffing/recommendations')
def get_staffing_recommendations():
    """Get staffing recommendations for March 5th"""
    try:
        data = load_cache()
        if 'staffing_recommendations' not in data:
            return jsonify({"error": "Cache not available. Run cache_results.py first."}), 503
        return jsonify(data['staffing_recommendations'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/historical-data')
def get_historical_data():
    """Get historical event data for charts"""
    try:
        data = load_cache()
        if 'historical_data' not in data:
            return jsonify({"error": "Cache not available. Run cache_results.py first."}), 503
        return jsonify(data['historical_data'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/risk-assessment')
def get_risk_assessment():
    """Get risk assessment and opportunities"""
    try:
        data = load_cache()
        if 'risk_assessment' not in data:
            return jsonify({"error": "Cache not available. Run cache_results.py first."}), 503
        return jsonify(data['risk_assessment'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/cache/refresh')
def refresh_cache():
    """Refresh the cache by running analysis again"""
    try:
        # Import and run cache generation
        import subprocess
        result = subprocess.run([
            'python', 
            os.path.join(os.path.dirname(__file__), 'cache_results.py')
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            # Reload cache
            global cache
            cache = None
            load_cache()
            return jsonify({
                "status": "success",
                "message": "Cache refreshed successfully",
                "generated_at": cache.get('generated_at', 'Unknown')
            })
        else:
            return jsonify({
                "status": "error",
                "message": "Failed to refresh cache",
                "error": result.stderr
            }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Silver Arena Analytics API (Fast Mode)...")
    print("Loading cached results...")
    load_cache()
    if cache:
        print(f"Cache loaded successfully (generated: {cache.get('generated_at', 'Unknown')})")
    else:
        print("No cache available. Generate cache first with: python backend/cache_results.py")
    print("Starting server on http://localhost:5001")
    app.run(debug=True, host='0.0.0.0', port=5001) 