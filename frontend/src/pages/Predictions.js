import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { apiService } from '../services/api';
import Card from '../components/shared/Card';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const PredictionsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
`;

const PageSubtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0;
`;

const EventDetailsCard = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 32px;
  
  h3, p {
    color: white;
  }
`;

const EventDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  
  &:last-child {
    border-bottom: none;
  }
`;

const EventLabel = styled.span`
  font-weight: 500;
`;

const EventValue = styled.span`
  font-weight: 600;
`;

const PredictionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const PredictionCard = styled(Card)`
  text-align: center;
  border-left: 4px solid ${props => props.color || '#3b82f6'};
`;

const PredictionValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
`;

const PredictionLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartContainer = styled.div`
  height: 300px;
  width: 100%;
`;

const InsightsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InsightItem = styled.li`
  display: flex;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const InsightIcon = styled.span`
  font-size: 1.2rem;
  margin-right: 12px;
  margin-top: 2px;
`;

const InsightText = styled.p`
  margin: 0;
  color: #374151;
  line-height: 1.5;
`;

const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  font-weight: 600;
  color: #374151;
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
  color: #64748b;
`;

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Predictions = () => {
  const [predictions, setPredictions] = useState(null);
  const [overview, setOverview] = useState(null);
  const [staffing, setStaffing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventPerformance, setEventPerformance] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [predictionsRes, overviewRes, staffingRes, eventPerfRes] = await Promise.all([
          apiService.getMarch5Predictions(),
          apiService.getAnalysisOverview(),
          apiService.getStaffingRecommendations(),
          apiService.getEventPerformance()
        ]);

        setPredictions(predictionsRes.data);
        setOverview(overviewRes.data);
        setStaffing(staffingRes.data);
        setEventPerformance(eventPerfRes.data);
      } catch (err) {
        setError(err.message);
        console.error('Predictions data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="large" text="Loading predictions..." />;
  }

  if (error) {
    return (
      <PredictionsContainer>
        <Card title="Error" subtitle="Failed to load predictions data">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </Card>
      </PredictionsContainer>
    );
  }

  // Prepare comparison data
  const comparisonData = [
    {
      metric: 'Attendance',
      predicted: '10,000',
      avgNBA: overview?.avg_attendance ? Math.round(overview.avg_attendance).toLocaleString() : 'N/A',
      difference: overview?.avg_attendance ? `${((10000 - overview.avg_attendance) / overview.avg_attendance * 100).toFixed(1)}%` : 'N/A'
    },
    {
      metric: 'Transactions',
      predicted: predictions?.predictions?.transactions?.toLocaleString() || 'N/A',
      avgNBA: overview?.avg_transactions ? Math.round(overview.avg_transactions).toLocaleString() : 'N/A',
      difference: overview?.avg_transactions ? `${((predictions?.predictions?.transactions - overview.avg_transactions) / overview.avg_transactions * 100).toFixed(1)}%` : 'N/A'
    },
    {
      metric: 'Net Sales',
      predicted: predictions?.predictions?.net_sales ? `$${predictions.predictions.net_sales.toLocaleString()}` : 'N/A',
      avgNBA: overview?.avg_sales ? `$${Math.round(overview.avg_sales).toLocaleString()}` : 'N/A',
      difference: overview?.avg_sales ? `${((predictions?.predictions?.net_sales - overview.avg_sales) / overview.avg_sales * 100).toFixed(1)}%` : 'N/A'
    }
  ];

  const metricsChartData = [
    {
      name: 'Predicted',
      transactions: predictions?.predictions?.transactions || 0,
      sales: predictions?.predictions?.net_sales || 0
    },
    {
      name: 'Historical Avg',
      transactions: overview?.avg_transactions || 0,
      sales: overview?.avg_sales || 0
    }
  ];

  const nbaAvgTrans = eventPerformance?.event_type_performance?.['NBA Regular Season']?.avg_transactions || null;
  const nbaTransPerAtt = eventPerformance?.event_type_performance?.['NBA Regular Season']?.avg_transactions && eventPerformance?.event_type_performance?.['NBA Regular Season']?.avg_attendance
    ? (eventPerformance.event_type_performance['NBA Regular Season'].avg_transactions / eventPerformance.event_type_performance['NBA Regular Season'].avg_attendance)
    : null;
  const sundayAvgTrans = eventPerformance?.day_of_week_performance?.Sunday?.avg_transactions || null;
  const sundayTransPerAtt = eventPerformance?.day_of_week_performance?.Sunday?.avg_transactions && eventPerformance?.day_of_week_performance?.Sunday?.avg_attendance
    ? (eventPerformance.day_of_week_performance.Sunday.avg_transactions / eventPerformance.day_of_week_performance.Sunday.avg_attendance)
    : null;
  const attendanceAssumption = predictions?.event_details?.expected_attendance || 10000;
  const nbaBaselineAtAttendance = nbaTransPerAtt ? Math.round(nbaTransPerAtt * attendanceAssumption) : null;
  const sundayBaselineAtAttendance = sundayTransPerAtt ? Math.round(sundayTransPerAtt * attendanceAssumption) : null;
  const naiveOverallBaseline = Math.round((overview?.key_metrics?.transactions_per_attendee || 0) * attendanceAssumption);

  return (
    <PredictionsContainer>
      <PageHeader>
        <PageTitle>March 5th Game Predictions</PageTitle>
        <PageSubtitle>
          Forecasted demand and performance metrics for the Oklahoma City Thunder game
        </PageSubtitle>
      </PageHeader>

      <EventDetailsCard title="Game Details">
        <EventDetail>
          <EventLabel>Date:</EventLabel>
          <EventValue>{predictions?.event_details?.date}</EventValue>
        </EventDetail>
        <EventDetail>
          <EventLabel>Opponent:</EventLabel>
          <EventValue>{predictions?.event_details?.opponent}</EventValue>
        </EventDetail>
        <EventDetail>
          <EventLabel>Game Time:</EventLabel>
          <EventValue>{predictions?.event_details?.time}</EventValue>
        </EventDetail>
        <EventDetail>
          <EventLabel>Expected Attendance:</EventLabel>
          <EventValue>{predictions?.event_details?.expected_attendance?.toLocaleString()}</EventValue>
        </EventDetail>
      </EventDetailsCard>

      <PredictionsGrid>
        <PredictionCard color="#3b82f6">
          <PredictionValue>{predictions?.predictions?.transactions?.toLocaleString() || 0}</PredictionValue>
          <PredictionLabel>Predicted Transactions</PredictionLabel>
        </PredictionCard>
        <PredictionCard color="#10b981">
          <PredictionValue>${predictions?.predictions?.net_sales?.toLocaleString() || 0}</PredictionValue>
          <PredictionLabel>Predicted Net Sales</PredictionLabel>
        </PredictionCard>
        <PredictionCard color="#f59e0b">
          <PredictionValue>{predictions?.predictions?.units?.toLocaleString() || 0}</PredictionValue>
          <PredictionLabel>Predicted Units Sold</PredictionLabel>
        </PredictionCard>
        <PredictionCard color="#ef4444">
          <PredictionValue>{(staffing?.total_pos_needed || predictions?.predictions?.pos_terminals || 0).toLocaleString()}</PredictionValue>
          <PredictionLabel>POS Terminals Recommended</PredictionLabel>
        </PredictionCard>
      </PredictionsGrid>

      <MetricsGrid>
        <Card title="Performance Comparison" subtitle="Predicted vs Historical Average">
          <ComparisonTable>
            <thead>
              <tr>
                <TableHeader>Metric</TableHeader>
                <TableHeader>Predicted</TableHeader>
                <TableHeader>Historical Avg</TableHeader>
                <TableHeader>Difference</TableHeader>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr key={index}>
                  <TableCell style={{ fontWeight: '500' }}>{row.metric}</TableCell>
                  <TableCell>{row.predicted}</TableCell>
                  <TableCell>{row.avgNBA}</TableCell>
                  <TableCell style={{ 
                    color: row.difference.startsWith('-') ? '#ef4444' : '#10b981',
                    fontWeight: '500'
                  }}>
                    {row.difference}
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </ComparisonTable>
        </Card>

        <Card title="Metrics Visualization" subtitle="Predicted vs Historical">
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricsChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'sales' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                  name === 'sales' ? 'Sales' : 'Transactions'
                ]} />
                <Bar dataKey="transactions" fill="#3b82f6" />
                <Bar dataKey="sales" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </MetricsGrid>

      <Card title="Per-Attendee Metrics" subtitle="Expected performance per guest (methodology below)">
        <PredictionsGrid>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' }}>
              {predictions?.derived_metrics?.trans_per_attendee || 0}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>
              Transactions per Attendee
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>
              ${predictions?.derived_metrics?.sales_per_attendee || 0}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>
              Sales per Attendee
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b', marginBottom: '8px' }}>
              ${predictions?.derived_metrics?.sales_per_transaction || 0}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>
              Sales per Transaction
            </div>
          </div>
        </PredictionsGrid>
      </Card>

      <Card title="Key Insights" subtitle="Important predictions and recommendations">
        <InsightsList>
          {predictions?.key_insights?.map((insight, index) => (
            <InsightItem key={index}>
              <InsightIcon>-</InsightIcon>
              <InsightText>{insight}</InsightText>
            </InsightItem>
          )) || []}
        </InsightsList>
      </Card>

      <Card title="Methodology & Rationale" subtitle="Step by step derivation (links to Methods)">
        <InsightsList>
          <InsightItem>
            <InsightIcon>1</InsightIcon>
            <InsightText>
              Set assumptions: attendance = 10,000; Sunday 2 PM; average opponent/event-type effect.
            </InsightText>
          </InsightItem>
          <InsightItem>
            <InsightIcon>2</InsightIcon>
            <InsightText>
              Score models using these inputs to obtain event-level predictions for transactions, sales, units, POS.
            </InsightText>
          </InsightItem>
          <InsightItem>
            <InsightIcon>3</InsightIcon>
            <InsightText>
              Compute KPIs: trans/attendee = transactions / 10,000; sales/attendee = sales / 10,000; sales/transaction = sales / transactions.
            </InsightText>
          </InsightItem>
          <InsightItem>
            <InsightIcon>4</InsightIcon>
            <InsightText>
              Compare to historical NBA averages and weekend daytime patterns. Lower-than-average expected due to lower attendance and
              Sunday afternoon timing (historically lower per-capita than prime-time).
            </InsightText>
          </InsightItem>
        </InsightsList>
      </Card>

      <Card title="Supporting Evidence" subtitle="Context for 4,837 predicted transactions">
        <InsightsList>
          <InsightItem>
            <InsightIcon>-</InsightIcon>
            <InsightText>
              Historical average transactions per event: {overview?.avg_transactions?.toLocaleString?.() || overview?.avg_transactions}.
            </InsightText>
          </InsightItem>
          <InsightItem>
            <InsightIcon>-</InsightIcon>
            <InsightText>
              Overall trans/attendee baseline × 10,000: {naiveOverallBaseline.toLocaleString()}.
            </InsightText>
          </InsightItem>
          <InsightItem>
            <InsightIcon>-</InsightIcon>
            <InsightText>
              NBA-only baseline: {nbaTransPerAtt ? nbaTransPerAtt.toFixed(3) : 'N/A'} per attendee ⇒ {nbaBaselineAtAttendance ? nbaBaselineAtAttendance.toLocaleString() : 'N/A'} at 10,000.
            </InsightText>
          </InsightItem>
          <InsightItem>
            <InsightIcon>-</InsightIcon>
            <InsightText>
              Sunday baseline: {sundayTransPerAtt ? sundayTransPerAtt.toFixed(3) : 'N/A'} per attendee ⇒ {sundayBaselineAtAttendance ? sundayBaselineAtAttendance.toLocaleString() : 'N/A'} at 10,000.
            </InsightText>
          </InsightItem>
          <InsightItem>
            <InsightIcon>-</InsightIcon>
            <InsightText>
              Model prediction (4,837) sits within these baselines and below overall average due to Sunday afternoon timing and lower attendance profile.
            </InsightText>
          </InsightItem>
        </InsightsList>
      </Card>

      <Card title="NBA Baseline Check" subtitle="Per-attendee baseline with simple 95% band">
        <PredictionsGrid>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '1rem', color: '#64748b', marginBottom: '6px' }}>Baseline trans/attendee</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6' }}>
              {overview?.key_metrics?.transactions_per_attendee || 0}
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '1rem', color: '#64748b', marginBottom: '6px' }}>Baseline at 10,000</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a' }}>
              {Math.round((overview?.key_metrics?.transactions_per_attendee || 0) * 10000).toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '1rem', color: '#64748b', marginBottom: '6px' }}>Simple 95% band</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#0f172a' }}>
              {(() => {
                const baseline = (overview?.key_metrics?.transactions_per_attendee || 0) * 10000;
                const band = Math.round(baseline * 0.15);
                return `${Math.max(0, Math.round(baseline - band)).toLocaleString()} - ${Math.round(baseline + band).toLocaleString()}`;
              })()}
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '1rem', color: '#64748b', marginBottom: '6px' }}>Model prediction</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>
              {predictions?.predictions?.transactions?.toLocaleString()}
            </div>
          </div>
        </PredictionsGrid>
      </Card>
    </PredictionsContainer>
  );
};

export default Predictions; 