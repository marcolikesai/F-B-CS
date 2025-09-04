import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import warnings
warnings.filterwarnings('ignore')

class SilverArenaAnalyzer:
    def __init__(self, data_path):
        self.data_path = data_path
        self.event_chars = None
        self.event_pos = None
        self.stand_pos = None
        self.combined_data = None
        self.models = {}
        
    def load_data(self):
        """Load all data from Excel file"""
        print("Loading data from Excel file...")
        self.event_chars = pd.read_excel(self.data_path, sheet_name='Event Characteristics Data')
        self.event_pos = pd.read_excel(self.data_path, sheet_name='Event Point of Sale Data')
        self.stand_pos = pd.read_excel(self.data_path, sheet_name='Stand Point of Sale Data')
        
        print(f"Event Characteristics: {self.event_chars.shape}")
        print(f"Event POS Data: {self.event_pos.shape}")
        print(f"Stand POS Data: {self.stand_pos.shape}")
        
    def clean_data(self):
        """Clean and prepare data for analysis"""
        print("Cleaning data...")
        
        # Convert dates
        for df in [self.event_chars, self.event_pos, self.stand_pos]:
            df['Calendar Date'] = pd.to_datetime(df['Calendar Date'])
            
        # Add derived features to event characteristics
        self.event_chars['DayOfWeek'] = self.event_chars['Calendar Date'].dt.day_name()
        self.event_chars['Month'] = self.event_chars['Calendar Date'].dt.month
        self.event_chars['Hour'] = pd.to_datetime(self.event_chars['Event Time'], format='%H:%M:%S').dt.hour
        self.event_chars['IsWeekend'] = self.event_chars['DayOfWeek'].isin(['Saturday', 'Sunday'])
        
        # Combine event characteristics with event POS data
        self.combined_data = self.event_chars.merge(
            self.event_pos, 
            on=['Venue Name', 'Calendar Date'], 
            how='inner'
        )
        
        print("Data cleaning completed.")
        print(f"Combined dataset shape: {self.combined_data.shape}")
        
    def exploratory_analysis(self):
        """Perform exploratory data analysis"""
        print("Performing exploratory data analysis...")
        
        # Basic statistics
        print("\n=== ATTENDANCE STATISTICS ===")
        print(self.combined_data['Total Attendance'].describe())
        
        print("\n=== TRANSACTION STATISTICS ===")
        print(self.combined_data['Transactions'].describe())
        
        print("\n=== EVENT TYPE BREAKDOWN ===")
        event_summary = self.combined_data.groupby('EventTypeName').agg({
            'Total Attendance': ['mean', 'std', 'count'],
            'Transactions': ['mean', 'std'],
            'Net Sales': ['mean', 'std'],
            'Units': ['mean', 'std']
        }).round(2)
        print(event_summary)
        
        print("\n=== DAY OF WEEK ANALYSIS ===")
        dow_summary = self.combined_data.groupby('DayOfWeek').agg({
            'Total Attendance': 'mean',
            'Transactions': 'mean',
            'Net Sales': 'mean'
        }).round(2)
        print(dow_summary)
        
        # Calculate key metrics
        self.combined_data['Trans_Per_Attendee'] = self.combined_data['Transactions'] / self.combined_data['Total Attendance']
        self.combined_data['Sales_Per_Attendee'] = self.combined_data['Net Sales'] / self.combined_data['Total Attendance']
        self.combined_data['Sales_Per_Transaction'] = self.combined_data['Net Sales'] / self.combined_data['Transactions']
        
        print("\n=== KEY PERFORMANCE METRICS ===")
        print(f"Average Transactions per Attendee: {self.combined_data['Trans_Per_Attendee'].mean():.3f}")
        print(f"Average Sales per Attendee: ${self.combined_data['Sales_Per_Attendee'].mean():.2f}")
        print(f"Average Sales per Transaction: ${self.combined_data['Sales_Per_Transaction'].mean():.2f}")
        
    def analyze_stand_performance(self):
        """Analyze performance by stand type"""
        print("\n=== STAND PERFORMANCE ANALYSIS ===")
        
        stand_summary = self.stand_pos.groupby('Stand Group').agg({
            'Transactions': ['sum', 'mean'],
            'Net Sales': ['sum', 'mean'],
            'Units': ['sum', 'mean'],
            'Total POS': 'mean'
        }).round(2)
        
        # Calculate efficiency metrics
        stand_efficiency = self.stand_pos.groupby('Stand Group').agg({
            'Trans Per POS': 'mean',
            'Units Per Trans': 'mean'
        }).round(3)
        
        print("Stand Group Performance Summary:")
        print(stand_summary)
        print("\nStand Group Efficiency Metrics:")
        print(stand_efficiency)
        
        return stand_summary, stand_efficiency
        
    def build_prediction_models(self):
        """Build models to predict transactions and sales"""
        print("\nBuilding prediction models...")
        
        # Prepare features for modeling
        features_df = self.combined_data.copy()
        
        # Encode categorical variables
        le_event_type = LabelEncoder()
        le_opponent = LabelEncoder()
        le_day = LabelEncoder()
        
        features_df['EventType_Encoded'] = le_event_type.fit_transform(features_df['EventTypeName'])
        features_df['Opponent_Encoded'] = le_opponent.fit_transform(features_df['Opponent'])
        features_df['DayOfWeek_Encoded'] = le_day.fit_transform(features_df['DayOfWeek'])
        
        # Select features
        feature_cols = ['Total Attendance', 'EventType_Encoded', 'Opponent_Encoded', 
                       'DayOfWeek_Encoded', 'Month', 'Hour', 'IsWeekend']
        
        X = features_df[feature_cols]
        
        # Build models for different targets
        targets = ['Transactions', 'Net Sales', 'Units', 'Total POS']
        
        for target in targets:
            print(f"\nTraining model for {target}...")
            y = features_df[target]
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            # Train multiple models
            models = {
                'RandomForest': RandomForestRegressor(n_estimators=100, random_state=42),
                'GradientBoosting': GradientBoostingRegressor(random_state=42),
                'LinearRegression': LinearRegression()
            }
            
            best_model = None
            best_score = float('-inf')
            
            for name, model in models.items():
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)
                score = r2_score(y_test, y_pred)
                
                print(f"{name} R² Score: {score:.3f}")
                
                if score > best_score:
                    best_score = score
                    best_model = model
                    
            self.models[target] = {
                'model': best_model,
                'score': best_score,
                'encoders': {
                    'event_type': le_event_type,
                    'opponent': le_opponent,
                    'day': le_day
                }
            }
            
    def predict_march_5_demand(self):
        """Predict demand for March 5th Oklahoma City Thunder game"""
        print("\n=== MARCH 5TH DEMAND PREDICTION ===")
        
        # Game details
        march_5_date = datetime(2023, 3, 5)
        expected_attendance = 10000
        
        # Create feature vector for March 5th
        march_5_features = {
            'Total Attendance': expected_attendance,
            'EventType_Encoded': 0,  # NBA (assuming similar to existing NBA games)
            'Opponent_Encoded': 0,   # Will use average opponent effect
            'DayOfWeek_Encoded': 6,  # Sunday (March 5, 2023 was a Sunday)
            'Month': 3,
            'Hour': 14,  # 2 PM Eastern
            'IsWeekend': 1
        }
        
        # Make predictions
        predictions = {}
        
        for target, model_info in self.models.items():
            model = model_info['model']
            feature_vector = np.array([[march_5_features[col] for col in model.feature_names_in_]])
            prediction = model.predict(feature_vector)[0]
            predictions[target] = max(0, prediction)  # Ensure non-negative
            
        print(f"Expected Attendance: {expected_attendance:,}")
        print(f"Predicted Transactions: {predictions['Transactions']:,.0f}")
        print(f"Predicted Net Sales: ${predictions['Net Sales']:,.2f}")
        print(f"Predicted Units Sold: {predictions['Units']:,.0f}")
        print(f"Predicted POS Terminals Needed: {predictions['Total POS']:.0f}")
        
        # Calculate derived metrics
        trans_per_attendee = predictions['Transactions'] / expected_attendance
        sales_per_attendee = predictions['Net Sales'] / expected_attendance
        sales_per_transaction = predictions['Net Sales'] / predictions['Transactions']
        
        print(f"\nDerived Metrics:")
        print(f"Transactions per Attendee: {trans_per_attendee:.3f}")
        print(f"Sales per Attendee: ${sales_per_attendee:.2f}")
        print(f"Sales per Transaction: ${sales_per_transaction:.2f}")
        
        return predictions
        
    def generate_staffing_recommendations(self, predictions):
        """Generate staffing recommendations based on predictions"""
        print("\n=== STAFFING RECOMMENDATIONS ===")
        
        total_transactions = predictions['Transactions']
        
        # Calculate transactions per stand type based on historical data
        stand_transaction_share = self.stand_pos.groupby('Stand Group')['Transactions'].sum()
        total_historical_transactions = stand_transaction_share.sum()
        stand_share_pct = stand_transaction_share / total_historical_transactions
        
        print("Predicted transactions by stand type:")
        staffing_needs = {}
        
        for stand_group, share in stand_share_pct.items():
            predicted_trans = total_transactions * share
            
            # Get average efficiency for this stand type
            stand_data = self.stand_pos[self.stand_pos['Stand Group'] == stand_group]
            avg_trans_per_pos = stand_data['Trans Per POS'].mean()
            
            # Calculate POS terminals needed
            pos_needed = max(1, np.ceil(predicted_trans / avg_trans_per_pos))
            
            staffing_needs[stand_group] = {
                'predicted_transactions': predicted_trans,
                'pos_terminals_needed': pos_needed,
                'avg_trans_per_pos': avg_trans_per_pos
            }
            
            print(f"{stand_group}: {predicted_trans:.0f} transactions, {pos_needed:.0f} POS terminals")
            
        # Overall staffing recommendation
        total_pos_needed = sum([info['pos_terminals_needed'] for info in staffing_needs.values()])
        
        print(f"\nTotal POS Terminals Recommended: {total_pos_needed:.0f}")
        print(f"Total Cashiers Needed (assuming 1 per traditional POS): {total_pos_needed:.0f}")
        
        # Risk assessment
        print(f"\n=== RISK ASSESSMENT ===")
        print("Key Risks and Opportunities:")
        print("- Lower attendance than typical NBA games may reduce per-capita spending")
        print("- Sunday afternoon timing may favor family-friendly concessions")
        print("- Consider promoting higher-margin items to boost sales per transaction")
        print("- Monitor queue lengths and be prepared to open additional POS if needed")
        
        return staffing_needs
        
    def generate_summary_report(self, predictions, staffing_needs):
        """Generate executive summary report"""
        report = {
            'event_details': {
                'date': 'March 5, 2023',
                'opponent': 'Oklahoma City Thunder',
                'time': '2:00 PM Eastern',
                'expected_attendance': 10000
            },
            'predictions': predictions,
            'staffing_recommendations': staffing_needs,
            'key_insights': [
                f"Expected {predictions['Transactions']:,.0f} transactions generating ${predictions['Net Sales']:,.2f}",
                f"Recommend {sum([info['pos_terminals_needed'] for info in staffing_needs.values()]):.0f} POS terminals",
                "Focus on efficient service during peak pre-game and halftime periods",
                "Monitor beverage stands closely as they typically see highest volume"
            ]
        }
        return report
        
    def run_full_analysis(self):
        """Run the complete analysis pipeline"""
        self.load_data()
        self.clean_data()
        self.exploratory_analysis()
        self.analyze_stand_performance()
        self.build_prediction_models()
        predictions = self.predict_march_5_demand()
        staffing_needs = self.generate_staffing_recommendations(predictions)
        report = self.generate_summary_report(predictions, staffing_needs)
        
        return report

if __name__ == "__main__":
    analyzer = SilverArenaAnalyzer('data/Demand Planning - Case Data Final 2023.xlsx')
    report = analyzer.run_full_analysis()
    print("\n" + "="*50)
    print("ANALYSIS COMPLETE - Report generated successfully!")
    print("="*50) 