#!/usr/bin/env python3
"""
Pre-compute all analysis results and cache them for fast API responses
"""

import json
import sys
import os
from datetime import datetime

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from data_analysis import SilverArenaAnalyzer

def serialize_numpy(obj):
    """Convert numpy types to Python native types for JSON serialization"""
    if hasattr(obj, 'item'):
        return obj.item()
    elif hasattr(obj, 'tolist'):
        return obj.tolist()
    elif isinstance(obj, (int, float, str, bool, list, dict, type(None))):
        return obj
    else:
        return str(obj)

def clean_for_json(data):
    """Recursively clean data structure for JSON serialization"""
    if isinstance(data, dict):
        return {key: clean_for_json(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [clean_for_json(item) for item in data]
    else:
        return serialize_numpy(data)

def generate_cache():
    """Generate all cached results"""
    print("🔄 Generating cached results...")
    
    # Initialize analyzer
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'Demand Planning - Case Data Final 2023.xlsx')
    analyzer = SilverArenaAnalyzer(data_path)
    
    print("📊 Running full analysis...")
    report = analyzer.run_full_analysis()
    
    # Prepare all cached data
    cache = {
        'generated_at': datetime.now().isoformat(),
        'overview': {
            'total_events_analyzed': len(analyzer.combined_data),
            'date_range': {
                'start': analyzer.combined_data['Calendar Date'].min().isoformat(),
                'end': analyzer.combined_data['Calendar Date'].max().isoformat()
            },
            'event_types': analyzer.combined_data['EventTypeName'].unique().tolist(),
            'avg_attendance': round(analyzer.combined_data['Total Attendance'].mean()),
            'avg_transactions': round(analyzer.combined_data['Transactions'].mean()),
            'avg_sales': round(analyzer.combined_data['Net Sales'].mean(), 2),
            'key_metrics': {
                'transactions_per_attendee': round(analyzer.combined_data['Trans_Per_Attendee'].mean(), 3),
                'sales_per_attendee': round(analyzer.combined_data['Sales_Per_Attendee'].mean(), 2),
                'sales_per_transaction': round(analyzer.combined_data['Sales_Per_Transaction'].mean(), 2)
            }
        },
        
        'event_performance': {
            'event_type_performance': {},
            'day_of_week_performance': {}
        },
        
        'stand_performance': {},
        
        'march5_predictions': {
            'event_details': report['event_details'],
            'predictions': {
                'transactions': round(report['predictions']['Transactions']),
                'net_sales': round(report['predictions']['Net Sales'], 2),
                'units': round(report['predictions']['Units']),
                'pos_terminals': round(report['predictions']['Total POS'])
            },
            'derived_metrics': {
                'trans_per_attendee': round(report['predictions']['Transactions'] / 10000, 3),
                'sales_per_attendee': round(report['predictions']['Net Sales'] / 10000, 2),
                'sales_per_transaction': round(report['predictions']['Net Sales'] / report['predictions']['Transactions'], 2)
            },
            'key_insights': report['key_insights']
        },
        
        'staffing_recommendations': {
            'staffing_by_stand': [],
            'total_pos_needed': 0,
            'total_cashiers_needed': 0,
            'recommendations': [
                "Focus staffing during peak pre-game and halftime periods",
                "Monitor beverage and grill stands for highest transaction volumes",
                "Have backup staff ready for unexpected demand spikes",
                "Consider promoting higher-margin items to boost revenue per transaction"
            ]
        },
        
        'risk_assessment': {
            'attendance_risk': {
                'predicted_attendance': 10000,
                'avg_nba_attendance': round(analyzer.combined_data[analyzer.combined_data['EventTypeName'] == 'NBA Regular Season']['Total Attendance'].mean()),
                'attendance_gap': 0,
                'risk_level': 'Medium'
            },
            'revenue_risk': {
                'predicted_trans_per_attendee': round(report['predictions']['Transactions'] / 10000, 3),
                'avg_nba_trans_per_attendee': round(analyzer.combined_data[analyzer.combined_data['EventTypeName'] == 'NBA Regular Season']['Trans_Per_Attendee'].mean(), 3),
                'performance_gap': 0
            },
            'operational_risks': [
                "Lower attendance may reduce economies of scale",
                "Sunday afternoon timing may affect concession preferences",
                "Potential for longer lines if understaffed",
                "Weather could impact attendance and concession sales"
            ],
            'opportunities': [
                "Family-friendly promotions for Sunday afternoon game",
                "Focus on higher-margin items to boost per-transaction revenue",
                "Implement mobile ordering to reduce wait times",
                "Cross-sell complementary items at high-traffic stands"
            ],
            'mitigation_strategies': [
                "Have flexible staffing model to adjust POS terminals as needed",
                "Monitor real-time queue lengths and adjust staffing",
                "Prepare promotional materials for slower-moving inventory",
                "Ensure backup payment systems are available"
            ]
        },
        
        'historical_data': []
    }
    
    print("Processing event performance data...")
    # Event type performance
    event_type_stats = analyzer.combined_data.groupby('EventTypeName').agg({
        'Total Attendance': ['mean', 'std', 'count'],
        'Transactions': ['mean', 'std'],
        'Net Sales': ['mean', 'std'],
        'Units': ['mean', 'std']
    }).round(2)
    
    for event_type in event_type_stats.index:
        cache['event_performance']['event_type_performance'][event_type] = {
            'avg_attendance': event_type_stats.loc[event_type, ('Total Attendance', 'mean')],
            'attendance_std': event_type_stats.loc[event_type, ('Total Attendance', 'std')],
            'event_count': event_type_stats.loc[event_type, ('Total Attendance', 'count')],
            'avg_transactions': event_type_stats.loc[event_type, ('Transactions', 'mean')],
            'avg_sales': event_type_stats.loc[event_type, ('Net Sales', 'mean')],
            'avg_units': event_type_stats.loc[event_type, ('Units', 'mean')]
        }
    
    # Day of week performance
    dow_stats = analyzer.combined_data.groupby('DayOfWeek').agg({
        'Total Attendance': 'mean',
        'Transactions': 'mean',
        'Net Sales': 'mean'
    }).round(2)
    
    for day in dow_stats.index:
        cache['event_performance']['day_of_week_performance'][day] = {
            'avg_attendance': dow_stats.loc[day, 'Total Attendance'],
            'avg_transactions': dow_stats.loc[day, 'Transactions'],
            'avg_sales': dow_stats.loc[day, 'Net Sales']
        }
    
    print("🏪 Processing stand performance data...")
    # Stand performance
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
    
    for stand_group in stand_summary.index:
        cache['stand_performance'][stand_group] = {
            'total_transactions': stand_summary.loc[stand_group, ('Transactions', 'sum')],
            'avg_transactions': stand_summary.loc[stand_group, ('Transactions', 'mean')],
            'total_sales': stand_summary.loc[stand_group, ('Net Sales', 'sum')],
            'avg_sales': stand_summary.loc[stand_group, ('Net Sales', 'mean')],
            'total_units': stand_summary.loc[stand_group, ('Units', 'sum')],
            'avg_units': stand_summary.loc[stand_group, ('Units', 'mean')],
            'avg_pos': stand_summary.loc[stand_group, ('Total POS', 'mean')],
            'trans_per_pos': stand_efficiency.loc[stand_group, 'Trans Per POS'],
            'units_per_trans': stand_efficiency.loc[stand_group, 'Units Per Trans']
        }
    
    print("👥 Processing staffing recommendations...")
    # Staffing recommendations
    total_transactions = report['predictions']['Transactions']
    stand_transaction_share = analyzer.stand_pos.groupby('Stand Group')['Transactions'].sum()
    total_historical_transactions = stand_transaction_share.sum()
    stand_share_pct = stand_transaction_share / total_historical_transactions
    
    total_pos = 0
    for stand_group, share in stand_share_pct.items():
        predicted_trans = total_transactions * share
        stand_data = analyzer.stand_pos[analyzer.stand_pos['Stand Group'] == stand_group]
        avg_trans_per_pos = stand_data['Trans Per POS'].mean()
        pos_needed = max(1, round(predicted_trans / avg_trans_per_pos))
        
        staff_info = {
            'stand_group': stand_group,
            'predicted_transactions': round(predicted_trans),
            'pos_terminals_needed': pos_needed,
            'avg_trans_per_pos': round(avg_trans_per_pos, 1)
        }
        cache['staffing_recommendations']['staffing_by_stand'].append(staff_info)
        total_pos += pos_needed
    
    cache['staffing_recommendations']['total_pos_needed'] = total_pos
    cache['staffing_recommendations']['total_cashiers_needed'] = total_pos
    
    print("📊 Processing historical data...")
    # Historical data
    for _, row in analyzer.combined_data.iterrows():
        cache['historical_data'].append({
            'date': row['Calendar Date'].isoformat(),
            'event_type': row['EventTypeName'],
            'opponent': row['Opponent'],
            'attendance': int(row['Total Attendance']),
            'transactions': int(row['Transactions']),
            'net_sales': round(row['Net Sales'], 2),
            'units': int(row['Units']),
            'day_of_week': row['DayOfWeek'],
            'trans_per_attendee': round(row['Trans_Per_Attendee'], 3),
            'sales_per_attendee': round(row['Sales_Per_Attendee'], 2)
        })
    
    # Calculate risk assessment gaps
    cache['risk_assessment']['attendance_risk']['attendance_gap'] = (
        cache['risk_assessment']['attendance_risk']['avg_nba_attendance'] - 10000
    )
    cache['risk_assessment']['revenue_risk']['performance_gap'] = round(
        cache['risk_assessment']['revenue_risk']['avg_nba_trans_per_attendee'] - 
        cache['risk_assessment']['revenue_risk']['predicted_trans_per_attendee'], 3
    )
    
    # Clean all data for JSON serialization
    cache = clean_for_json(cache)
    
    # Save cache
    cache_file = os.path.join(os.path.dirname(__file__), 'analysis_cache.json')
    with open(cache_file, 'w') as f:
        json.dump(cache, f, indent=2)
    
    print(f"✅ Cache saved to {cache_file}")
    print(f"📦 Cache size: {os.path.getsize(cache_file) / 1024:.1f} KB")
    return cache

if __name__ == "__main__":
    cache = generate_cache()
    print("🎉 Cache generation complete!") 