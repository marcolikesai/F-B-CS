# 🏟️ Silver Arena Analytics Dashboard

A comprehensive data analytics solution for Silver Arena's demand planning and concession analytics. This application provides predictive insights, staffing recommendations, and risk assessments for NBA and NHL games.

## 📋 Overview

Silver Arena Analytics is a full-stack web application that analyzes historical event data to:
- Predict attendance and concession demand for upcoming games
- Generate staffing recommendations by stand type
- Provide risk assessments and mitigation strategies
- Visualize performance trends and insights

### Key Features

- ** Interactive Dashboard**: Real-time analytics with beautiful charts and visualizations
- ** March 5th Predictions**: Specific forecasting for the Oklahoma City Thunder game
- ** Stand Performance Analysis**: Detailed breakdown of concession stand efficiency
- ** Staffing Recommendations**: Optimal POS terminal and cashier allocation
- ** Risk Assessment**: Comprehensive risk analysis with mitigation strategies
- ** Responsive Design**: Modern, mobile-friendly interface

##  Architecture

### Backend (Flask/Python)
- **Data Processing**: Pandas, NumPy for data manipulation
- **Machine Learning**: Scikit-learn for predictive modeling
- **API**: Flask with CORS support
- **Analytics Engine**: Custom Silver Arena analyzer with multiple ML models

### Frontend (React)
- **UI Framework**: React 18 with styled-components
- **Charts**: Recharts for data visualization
- **State Management**: React hooks
- **Styling**: Modern CSS with Inter font

### Data Sources
- Excel file with historical event data (2021-2023)
- Event characteristics, POS data, and stand performance metrics

##  Quick Start

### Prerequisites
- Python 3.8+ with pip
- Node.js 16+ with npm
- Git (optional)

### One-Command Launch
```bash
python start_application.py
```

This will automatically:
1. Check dependencies
2. Install frontend packages
3. Start the Flask backend
4. Start the React frontend
5. Open the application at http://localhost:3000

### Manual Setup

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📊 Data Analysis Features

### Predictive Models
- **Random Forest Regressor**: Primary model for transaction prediction
- **Gradient Boosting**: Alternative model for comparison
- **Linear Regression**: Baseline model for validation

### Key Metrics Analyzed
- Transactions per attendee
- Sales per attendee
- Sales per transaction
- POS terminal efficiency
- Stand-specific performance

### March 5th Game Predictions
- **Expected Attendance**: 10,000
- **Predicted Transactions**: ~4,837
- **Predicted Sales**: ~$129,494
- **Recommended POS Terminals**: 74

## 🎯 Application Pages

### 1. Dashboard (`/`)
- Overview of historical performance
- Key performance indicators
- Event type and day-of-week analysis
- Recent trends visualization

### 2. March 5th Predictions (`/predictions`)
- Detailed game forecasting
- Performance comparisons
- Per-attendee metrics
- Key insights and recommendations

### 3. Stand Analysis (`/stand-analysis`)
- Historical stand performance
- Efficiency metrics by stand type
- Transaction and sales breakdowns

### 4. Staffing Recommendations (`/staffing`)
- POS terminal allocation by stand
- Staffing timeline recommendations
- Risk mitigation strategies
- Priority-based deployment

### 5. Risk Assessment (`/risk-assessment`)
- Attendance risk analysis
- Revenue risk factors
- Operational risks and opportunities
- Mitigation strategies

## 🔧 API Endpoints

### Analysis Endpoints
- `GET /api/analysis/overview` - High-level metrics
- `GET /api/analysis/event-performance` - Performance by event type/day
- `GET /api/analysis/stand-performance` - Stand-specific metrics
- `GET /api/historical-data` - Raw historical data for charts

### Prediction Endpoints
- `GET /api/predictions/march5` - March 5th game predictions
- `GET /api/staffing/recommendations` - Staffing recommendations
- `GET /api/risk-assessment` - Risk analysis and mitigation

## 📁 Project Structure

```
silver-arena-analytics/
├── backend/                    # Flask API server
│   ├── app.py                 # Main Flask application
│   └── requirements.txt       # Python dependencies
├── frontend/                   # React web application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Main application pages
│   │   ├── services/         # API communication
│   │   └── App.js           # Main React component
│   ├── public/              # Static assets
│   └── package.json         # Node.js dependencies
├── data/                      # Data files
│   └── Demand Planning - Case Data Final 2023.xlsx
├── data_analysis.py          # Core analytics engine
├── start_application.py      # Application launcher
├── key.md                   # Project requirements
└── README.md               # This file
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: #3b82f6
- **Success Green**: #10b981
- **Warning Orange**: #f59e0b
- **Error Red**: #ef4444
- **Purple Accent**: #8b5cf6

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Cards**: Clean, shadowed containers
- **Charts**: Interactive Recharts visualizations
- **Tables**: Responsive data tables with hover effects
- **Loading States**: Animated spinners

## Key Insights from Analysis

### Historical Performance
- **Average Attendance**: 13,653 per event
- **Average Transactions**: 10,023 per event
- **Transactions per Attendee**: 0.721
- **Sales per Attendee**: $16.57

### Event Type Differences
- **NHL Games**: Higher attendance (15,205 avg) and sales
- **NBA Games**: Lower attendance (12,027 avg) but consistent performance
- **Weekend Games**: Generally higher attendance and concession sales

### Stand Performance Leaders
1. **GC - Specialty**: Highest total transactions (262K)
2. **GC - Grill Stand**: High volume and efficiency
3. **Hawker Vending Room**: Excellent efficiency (585 trans per stand)

## March 5th Recommendations

### Staffing Priorities
1. **High Priority**: GC - Specialty (18 POS), GC - Grill Stand (14 POS)
2. **Medium Priority**: Hawker Vending Room (10 POS), Portable - Bars (10 POS)
3. **Standard**: All other stands based on predicted demand

### Timeline
- **90 min before**: Deploy 60% of staff
- **30 min before**: Full deployment
- **Halftime**: Peak demand period
- **Post-game**: Maintain 40% for 15 minutes

### Risk Mitigation
- Keep 2-3 backup cashiers on standby
- Monitor real-time queue lengths
- Have technical support available
- Implement mobile payment backups

## 🛠️ Development

### Adding New Features
1. Backend: Add endpoints to `backend/app.py`
2. Frontend: Create components in `frontend/src/components/`
3. Pages: Add new pages to `frontend/src/pages/`
4. Routing: Update `frontend/src/App.js`

### Testing
```bash
# Backend testing
cd backend
python -m pytest

# Frontend testing
cd frontend
npm test
```

### Building for Production
```bash
# Build frontend
cd frontend
npm run build

# The built files will be in frontend/build/
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Silver Arena Management Team for providing the requirements
- Historical data spanning 2021-2023 for comprehensive analysis
- Modern web technologies enabling responsive, interactive dashboards

---
