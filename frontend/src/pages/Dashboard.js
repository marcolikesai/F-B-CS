import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { apiService } from '../services/api';
import Card from '../components/shared/Card';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-xl);
  min-height: 100vh;
  background-color: var(--bg-secondary);

  @media (max-width: 768px) {
    padding: var(--space-xl) var(--space-lg);
  }
`;

const PageHeader = styled.div`
  margin-bottom: var(--space-3xl);
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 var(--space-lg) 0;
  letter-spacing: -0.05em;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin: 0 auto;
  max-width: 600px;
  line-height: 1.5;
  font-weight: 400;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-3xl);
`;

const MetricCard = styled.div`
  background: var(--bg-primary);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: var(--shadow-lg);
    border-color: var(--border-color-dark);
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.accentColor || 'var(--color-primary)'};
  }
`;

const MetricValue = styled.div`
  font-size: 3rem;
  font-weight: 900;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  line-height: 1;
  letter-spacing: -0.02em;
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-xs);
`;

const MetricIcon = styled.div`
  position: absolute;
  top: var(--space-xl);
  right: var(--space-xl);
  width: 48px;
  height: 48px;
  border-radius: var(--radius-xl);
  background: ${props => props.background || 'var(--color-gray-100)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  opacity: 0.8;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-xl);
  margin-bottom: var(--space-3xl);

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: var(--bg-primary);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--border-color-dark);
  }
`;

const ChartHeader = styled.div`
  margin-bottom: var(--space-xl);
`;

const ChartTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
  letter-spacing: -0.025em;
`;

const ChartSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 400;
`;

const ChartContainer = styled.div`
  height: 400px;
  width: 100%;
`;

const SecondaryChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-3xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InsightsSection = styled.div`
  background: var(--bg-primary);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-sm);
`;

const InsightsHeader = styled.div`
  margin-bottom: var(--space-xl);
`;

const InsightsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
  letter-spacing: -0.025em;
`;

const InsightsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--space-lg);
`;

const InsightItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--bg-secondary);
  border: var(--border-width) solid var(--border-color-light);
  border-radius: var(--radius-xl);
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-tertiary);
    border-color: var(--border-color);
    transform: translateY(-1px);
  }
`;

const InsightIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  background: ${props => props.background || 'var(--color-primary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const InsightText = styled.p`
  margin: 0;
  color: var(--text-primary);
  line-height: 1.5;
  font-weight: 500;
  font-size: 0.875rem;
`;

// Professional light theme chart colors
const CHART_COLORS = ['#1f2937', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [eventPerformance, setEventPerformance] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [overviewRes, eventRes, historicalRes] = await Promise.all([
          apiService.getAnalysisOverview(),
          apiService.getEventPerformance(),
          apiService.getHistoricalData()
        ]);

        setOverview(overviewRes.data);
        setEventPerformance(eventRes.data);
        setHistoricalData(historicalRes.data);
      } catch (err) {
        setError(err.message);
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="large" text="Loading dashboard data..." />;
  }

  if (error) {
    return (
      <DashboardContainer>
        <Card title="Error" subtitle="Failed to load dashboard data">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </Card>
      </DashboardContainer>
    );
  }

  // Prepare chart data
  const eventTypeData = eventPerformance ? Object.entries(eventPerformance.event_type_performance).map(([type, data]) => ({
    name: type.replace(' Regular Season', ''),
    attendance: Math.round(data.avg_attendance),
    transactions: Math.round(data.avg_transactions),
    sales: Math.round(data.avg_sales)
  })) : [];

  const dayOrder = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const dayOfWeekData = eventPerformance ? Object.entries(eventPerformance.day_of_week_performance)
    .map(([day, data]) => ({
      day,
      name: day.substring(0, 3),
      attendance: Math.round(data.avg_attendance),
      transactions: Math.round(data.avg_transactions),
      sales: Math.round(data.avg_sales)
    }))
    .sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)) : [];

  // Recent trends data (last 10 events)
  const recentTrends = historicalData ? historicalData.slice(-10).map(event => ({
    date: new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    attendance: event.attendance,
    transactions: event.transactions,
    sales: Math.round(event.net_sales)
  })) : [];

  // Pie chart data for event types
  const pieData = eventTypeData.map((item, index) => ({
    name: item.name,
    value: item.attendance,
    color: CHART_COLORS[index % CHART_COLORS.length]
  }));

  const insights = [
    {
      icon: '📊',
      text: `Average of ${overview?.key_metrics?.transactions_per_attendee || 0} transactions per attendee across all events`,
      background: '#1f2937'
    },
    {
      icon: '💰',
      text: `Average revenue of $${overview?.key_metrics?.sales_per_attendee || 0} per attendee`,
      background: '#10b981'
    },
    {
      icon: '🏒',
      text: `NHL games average ${eventTypeData.find(d => d.name === 'NHL')?.attendance || 0} attendees vs ${eventTypeData.find(d => d.name === 'NBA')?.attendance || 0} for NBA games`,
      background: '#3b82f6'
    },
    {
      icon: '📅',
      text: `Weekend games typically see higher attendance and concession sales`,
      background: '#f59e0b'
    }
  ];

  return (
    <DashboardContainer className="animate-fade-in">
      <PageHeader>
        <PageTitle>Analytics Dashboard</PageTitle>
        <PageSubtitle>
          Comprehensive analysis of {overview?.total_events_analyzed || 0} events from{' '}
          {overview?.date_range?.start ? new Date(overview.date_range.start).toLocaleDateString() : ''} to{' '}
          {overview?.date_range?.end ? new Date(overview.date_range.end).toLocaleDateString() : ''}
        </PageSubtitle>
      </PageHeader>

      <MetricsGrid>
        <MetricCard accentColor="#1f2937">
          <MetricIcon background="var(--bg-tertiary)">👥</MetricIcon>
          <MetricLabel>Average Attendance</MetricLabel>
          <MetricValue>{overview?.avg_attendance?.toLocaleString() || 0}</MetricValue>
        </MetricCard>
        
        <MetricCard accentColor="#3b82f6">
          <MetricIcon background="var(--bg-tertiary)">🎯</MetricIcon>
          <MetricLabel>Average Transactions</MetricLabel>
          <MetricValue>{overview?.avg_transactions?.toLocaleString() || 0}</MetricValue>
        </MetricCard>
        
        <MetricCard accentColor="#10b981">
          <MetricIcon background="var(--bg-tertiary)">💰</MetricIcon>
          <MetricLabel>Average Sales per Event</MetricLabel>
          <MetricValue>${overview?.avg_sales?.toLocaleString() || 0}</MetricValue>
        </MetricCard>
        
        <MetricCard accentColor="#f59e0b">
          <MetricIcon background="var(--bg-tertiary)">📈</MetricIcon>
          <MetricLabel>Sales per Transaction</MetricLabel>
          <MetricValue>${overview?.key_metrics?.sales_per_transaction || 0}</MetricValue>
        </MetricCard>
      </MetricsGrid>

      <ChartsSection>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Performance by Event Type</ChartTitle>
            <ChartSubtitle>Comparing attendance and transaction metrics</ChartSubtitle>
          </ChartHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-200)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--text-secondary)" 
                  fontSize={12}
                  fontWeight={500}
                />
                <YAxis 
                  stroke="var(--text-secondary)" 
                  fontSize={12}
                  fontWeight={500}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'sales' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                    name.charAt(0).toUpperCase() + name.slice(1)
                  ]}
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                />
                <Bar dataKey="attendance" fill="#1f2937" radius={[4, 4, 0, 0]} />
                <Bar dataKey="transactions" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>Event Distribution</ChartTitle>
            <ChartSubtitle>Attendance by event type</ChartSubtitle>
          </ChartHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={140}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [value.toLocaleString(), 'Attendance']}
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>
      </ChartsSection>

      <SecondaryChartsGrid>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Weekly Performance Patterns</ChartTitle>
            <ChartSubtitle>Average attendance by day of week</ChartSubtitle>
          </ChartHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dayOfWeekData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-200)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--text-secondary)" 
                  fontSize={12}
                  fontWeight={500}
                />
                <YAxis 
                  stroke="var(--text-secondary)" 
                  fontSize={12}
                  fontWeight={500}
                />
                <Tooltip 
                  formatter={(value) => [value.toLocaleString(), 'Attendance']}
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#1f2937" 
                  strokeWidth={3}
                  dot={{ fill: '#1f2937', strokeWidth: 0, r: 6 }}
                  activeDot={{ r: 8, fill: '#1f2937' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>Recent Performance Trends</ChartTitle>
            <ChartSubtitle>Last 10 events performance</ChartSubtitle>
          </ChartHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recentTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-200)" />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--text-secondary)" 
                  fontSize={12}
                  fontWeight={500}
                />
                <YAxis 
                  stroke="var(--text-secondary)" 
                  fontSize={12}
                  fontWeight={500}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'sales' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                    name.charAt(0).toUpperCase() + name.slice(1)
                  ]}
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#1f2937" 
                  strokeWidth={2}
                  dot={{ fill: '#1f2937', strokeWidth: 0, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="transactions" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>
      </SecondaryChartsGrid>

      <InsightsSection>
        <InsightsHeader>
          <InsightsTitle>Key Insights</InsightsTitle>
        </InsightsHeader>
        <InsightsList>
          {insights.map((insight, index) => (
            <InsightItem key={index}>
              <InsightIcon background={insight.background}>
                {insight.icon}
              </InsightIcon>
              <InsightText>{insight.text}</InsightText>
            </InsightItem>
          ))}
        </InsightsList>
      </InsightsSection>
    </DashboardContainer>
  );
};

export default Dashboard; 