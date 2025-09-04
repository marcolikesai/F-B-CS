from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import sys
import os
import json
from datetime import datetime

# Add parent directory to path to import our analyzer
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from data_analysis import SilverArenaAnalyzer

app = Flask(__name__)
CORS(app)

# Global analyzer instance
analyzer = None
analysis_report = None

def initialize_analyzer():
    """Initialize the analyzer and run the analysis"""
    global analyzer, analysis_report
    if analyzer is None:
        data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'Demand Planning - Case Data Final 2023.xlsx')
        analyzer = SilverArenaAnalyzer(data_path)
        analysis_report = analyzer.run_full_analysis()
    return analyzer, analysis_report

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Silver Arena Analytics API",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/analysis/overview')
def get_analysis_overview():
    """Get high-level analysis overview"""
    try:
        analyzer, report = initialize_analyzer()
        
        # Calculate summary statistics
        combined_data = analyzer.combined_data
        
        overview = {
            "total_events_analyzed": len(combined_data),
            "date_range": {
                "start": combined_data['Calendar Date'].min().isoformat(),
                "end": combined_data['Calendar Date'].max().isoformat()
            },
            "event_types": combined_data['EventTypeName'].unique().tolist(),
            "avg_attendance": round(combined_data['Total Attendance'].mean()),
            "avg_transactions": round(combined_data['Transactions'].mean()),
            "avg_sales": round(combined_data['Net Sales'].mean(), 2),
            "key_metrics": {
                "transactions_per_attendee": round(combined_data['Trans_Per_Attendee'].mean(), 3),
                "sales_per_attendee": round(combined_data['Sales_Per_Attendee'].mean(), 2),
                "sales_per_transaction": round(combined_data['Sales_Per_Transaction'].mean(), 2)
            }
        }
        
        return jsonify(overview)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analysis/event-performance')
def get_event_performance():
    """Get event performance breakdown by type and day"""
    try:
        analyzer, report = initialize_analyzer()
        combined_data = analyzer.combined_data
        
        # Event type performance
        event_type_stats = combined_data.groupby('EventTypeName').agg({
            'Total Attendance': ['mean', 'std', 'count'],
            'Transactions': ['mean', 'std'],
            'Net Sales': ['mean', 'std'],
            'Units': ['mean', 'std']
        }).round(2)
        
        event_type_performance = {}
        for event_type in event_type_stats.index:
            event_type_performance[event_type] = {
                "avg_attendance": event_type_stats.loc[event_type, ('Total Attendance', 'mean')],
                "attendance_std": event_type_stats.loc[event_type, ('Total Attendance', 'std')],
                "event_count": event_type_stats.loc[event_type, ('Total Attendance', 'count')],
                "avg_transactions": event_type_stats.loc[event_type, ('Transactions', 'mean')],
                "avg_sales": event_type_stats.loc[event_type, ('Net Sales', 'mean')],
                "avg_units": event_type_stats.loc[event_type, ('Units', 'mean')]
            }
        
        # Day of week performance
        dow_stats = combined_data.groupby('DayOfWeek').agg({
            'Total Attendance': 'mean',
            'Transactions': 'mean',
            'Net Sales': 'mean'
        }).round(2)
        
        dow_performance = {}
        for day in dow_stats.index:
            dow_performance[day] = {
                "avg_attendance": dow_stats.loc[day, 'Total Attendance'],
                "avg_transactions": dow_stats.loc[day, 'Transactions'],
                "avg_sales": dow_stats.loc[day, 'Net Sales']
            }
        
        return jsonify({
            "event_type_performance": event_type_performance,
            "day_of_week_performance": dow_performance
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analysis/stand-performance')
def get_stand_performance():
    """Get stand performance analysis"""
    try:
        analyzer, report = initialize_analyzer()
        
        # Get stand performance data
        stand_summary = analyzer.stand_pos.groupby('Stand Group').agg({
            'Transactions': ['sum', 'mean'],
            'Net Sales': ['sum', 'mean'],
            'Units': ['sum', 'mean'],
            'Total POS': 'mean'
        }).round(2)
        
        stand_efficiency = analyzer.stand_pos.groupby('Stand Group').agg({
            'Trans Per POS': 'mean',
            'Units Per Trans': 'mean'
        }).round(3)
        
        stand_performance = {}
        for stand_group in stand_summary.index:
            stand_performance[stand_group] = {
                "total_transactions": stand_summary.loc[stand_group, ('Transactions', 'sum')],
                "avg_transactions": stand_summary.loc[stand_group, ('Transactions', 'mean')],
                "total_sales": stand_summary.loc[stand_group, ('Net Sales', 'sum')],
                "avg_sales": stand_summary.loc[stand_group, ('Net Sales', 'mean')],
                "total_units": stand_summary.loc[stand_group, ('Units', 'sum')],
                "avg_units": stand_summary.loc[stand_group, ('Units', 'mean')],
                "avg_pos": stand_summary.loc[stand_group, ('Total POS', 'mean')],
                "trans_per_pos": stand_efficiency.loc[stand_group, 'Trans Per POS'],
                "units_per_trans": stand_efficiency.loc[stand_group, 'Units Per Trans']
            }
        
        return jsonify(stand_performance)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predictions/march5')
def get_march5_predictions():
    """Get predictions for March 5th game"""
    try:
        analyzer, report = initialize_analyzer()
        
        return jsonify({
            "event_details": report['event_details'],
            "predictions": {
                "transactions": round(report['predictions']['Transactions']),
                "net_sales": round(report['predictions']['Net Sales'], 2),
                "units": round(report['predictions']['Units']),
                "pos_terminals": round(report['predictions']['Total POS'])
            },
            "derived_metrics": {
                "trans_per_attendee": round(report['predictions']['Transactions'] / 10000, 3),
                "sales_per_attendee": round(report['predictions']['Net Sales'] / 10000, 2),
                "sales_per_transaction": round(report['predictions']['Net Sales'] / report['predictions']['Transactions'], 2)
            },
            "key_insights": report['key_insights']
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/staffing/recommendations')
def get_staffing_recommendations():
    """Get staffing recommendations for March 5th"""
    try:
        analyzer, report = initialize_analyzer()
        
        staffing_data = []
        total_pos = 0
        
        for stand_group, info in report['staffing_recommendations'].items():
            staff_info = {
                "stand_group": stand_group,
                "predicted_transactions": round(info['predicted_transactions']),
                "pos_terminals_needed": int(info['pos_terminals_needed']),
                "avg_trans_per_pos": round(info['avg_trans_per_pos'], 1)
            }
            staffing_data.append(staff_info)
            total_pos += int(info['pos_terminals_needed'])
        
        return jsonify({
            "staffing_by_stand": staffing_data,
            "total_pos_needed": total_pos,
            "total_cashiers_needed": total_pos,
            "recommendations": [
                "Focus staffing during peak pre-game and halftime periods",
                "Monitor beverage and grill stands for highest transaction volumes",
                "Have backup staff ready for unexpected demand spikes",
                "Consider promoting higher-margin items to boost revenue per transaction"
            ]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/historical-data')
def get_historical_data():
    """Get historical event data for charts"""
    try:
        analyzer, report = initialize_analyzer()
        combined_data = analyzer.combined_data
        
        # Prepare data for charts
        historical_data = []
        for _, row in combined_data.iterrows():
            historical_data.append({
                "date": row['Calendar Date'].isoformat(),
                "event_type": row['EventTypeName'],
                "opponent": row['Opponent'],
                "attendance": row['Total Attendance'],
                "transactions": row['Transactions'],
                "net_sales": round(row['Net Sales'], 2),
                "units": row['Units'],
                "day_of_week": row['DayOfWeek'],
                "trans_per_attendee": round(row['Trans_Per_Attendee'], 3),
                "sales_per_attendee": round(row['Sales_Per_Attendee'], 2)
            })
        
        return jsonify(historical_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/risk-assessment')
def get_risk_assessment():
    """Get risk assessment and opportunities"""
    try:
        analyzer, report = initialize_analyzer()
        combined_data = analyzer.combined_data
        
        # Calculate risk factors
        nba_games = combined_data[combined_data['EventTypeName'] == 'NBA Regular Season']
        avg_nba_attendance = nba_games['Total Attendance'].mean()
        avg_nba_trans_per_attendee = nba_games['Trans_Per_Attendee'].mean()
        
        risk_assessment = {
            "attendance_risk": {
                "predicted_attendance": 10000,
                "avg_nba_attendance": round(avg_nba_attendance),
                "attendance_gap": round(avg_nba_attendance - 10000),
                "risk_level": "Medium" if avg_nba_attendance - 10000 > 2000 else "Low"
            },
            "revenue_risk": {
                "predicted_trans_per_attendee": round(report['predictions']['Transactions'] / 10000, 3),
                "avg_nba_trans_per_attendee": round(avg_nba_trans_per_attendee, 3),
                "performance_gap": round(avg_nba_trans_per_attendee - (report['predictions']['Transactions'] / 10000), 3)
            },
            "operational_risks": [
                "Lower attendance may reduce economies of scale",
                "Sunday afternoon timing may affect concession preferences",
                "Potential for longer lines if understaffed",
                "Weather could impact attendance and concession sales"
            ],
            "opportunities": [
                "Family-friendly promotions for Sunday afternoon game",
                "Focus on higher-margin items to boost per-transaction revenue",
                "Implement mobile ordering to reduce wait times",
                "Cross-sell complementary items at high-traffic stands"
            ],
            "mitigation_strategies": [
                "Have flexible staffing model to adjust POS terminals as needed",
                "Monitor real-time queue lengths and adjust staffing",
                "Prepare promotional materials for slower-moving inventory",
                "Ensure backup payment systems are available"
            ]
        }
        
        return jsonify(risk_assessment)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Silver Arena Analytics API...")
    print("Initializing data analysis...")
    initialize_analyzer()
    print("Analysis complete. Starting server...")
    app.run(debug=True, host='0.0.0.0', port=5001) 