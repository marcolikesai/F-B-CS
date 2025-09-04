import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { apiService } from '../services/api';
import Card from '../components/shared/Card';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-xl);
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: var(--space-lg);
  }
`;

const PageHeader = styled.div`
  margin-bottom: var(--space-2xl);
  text-align: center;
  position: relative;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 var(--space-sm) 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const StatsOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-3xl);
`;

const StatCard = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-gray-200);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.gradient || 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))'};
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
  }
`;

const StatValue = styled.div`
  font-size: 2.75rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatIcon = styled.div`
  position: absolute;
  top: var(--space-lg);
  right: var(--space-lg);
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: ${props => props.background || 'var(--color-primary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  opacity: 0.1;
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

const MainChart = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-gray-200);
`;

const SideChart = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-gray-200);
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
`;

const ChartSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--space-xl);
`;

const ChartContainer = styled.div`
  height: 350px;
  width: 100%;
`;

const SecondaryChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-3xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InsightsSection = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-gray-200);
`;

const InsightsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const InsightsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
`;

const InsightItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--color-gray-50);
  border-radius: var(--radius-lg);
  border-left: 4px solid ${props => props.color || 'var(--color-primary)'};
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(4px);
    background: var(--color-gray-100);
  }
`;

const InsightIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: ${props => props.background || 'var(--color-primary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  flex-shrink: 0;
`;

const InsightText = styled.p`
  margin: 0;
  color: var(--text-primary);
  line-height: 1.5;
  font-weight: 500;
`;

// Chart colors
const CHART_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

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
      color: 'var(--color-primary)',
      background: 'var(--color-primary)'
    },
    {
      icon: '💰',
      text: `Average revenue of $${overview?.key_metrics?.sales_per_attendee || 0} per attendee`,
      color: 'var(--color-success)',
      background: 'var(--color-success)'
    },
    {
      icon: '🏒',
      text: `NHL games average ${eventTypeData.find(d => d.name === 'NHL')?.attendance || 0} attendees vs ${eventTypeData.find(d => d.name === 'NBA')?.attendance || 0} for NBA games`,
      color: 'var(--color-secondary)',
      background: 'var(--color-secondary)'
    },
    {
      icon: '📅',
      text: `Weekend games typically see higher attendance and concession sales`,
      color: 'var(--color-warning)',
      background: 'var(--color-warning)'
    }
  ];

  return (
    <DashboardContainer className="fade-in">
      <PageHeader>
        <PageTitle>Analytics Dashboard</PageTitle>
        <PageSubtitle>
          Comprehensive analysis of {overview?.total_events_analyzed || 0} events from{' '}
          {overview?.date_range?.start ? new Date(overview.date_range.start).toLocaleDateString() : ''} to{' '}
          {overview?.date_range?.end ? new Date(overview.date_range.end).toLocaleDateString() : ''}
        </PageSubtitle>
      </PageHeader>

      <StatsOverview className="stagger-children">
        <StatCard gradient="linear-gradient(135deg, #6366f1, #4f46e5)">
          <StatIcon background="rgba(99, 102, 241, 0.1)">👥</StatIcon>
          <StatValue>{overview?.avg_attendance?.toLocaleString() || 0}</StatValue>
          <StatLabel>Average Attendance</StatLabel>
        </StatCard>
        
        <StatCard gradient="linear-gradient(135deg, #06b6d4, #0891b2)">
          <StatIcon background="rgba(6, 182, 212, 0.1)">🎯</StatIcon>
          <StatValue>{overview?.avg_transactions?.toLocaleString() || 0}</StatValue>
          <StatLabel>Average Transactions</StatLabel>
        </StatCard>
        
        <StatCard gradient="linear-gradient(135deg, #10b981, #059669)">
          <StatIcon background="rgba(16, 185, 129, 0.1)">💰</StatIcon>
          <StatValue>${overview?.avg_sales?.toLocaleString() || 0}</StatValue>
          <StatLabel>Average Sales per Event</StatLabel>
        </StatCard>
        
        <StatCard gradient="linear-gradient(135deg, #f59e0b, #d97706)">
          <StatIcon background="rgba(245, 158, 11, 0.1)">📈</StatIcon>
          <StatValue>${overview?.key_metrics?.sales_per_transaction || 0}</StatValue>
          <StatLabel>Sales per Transaction</StatLabel>
        </StatCard>
      </StatsOverview>

      <ChartsSection>
        <MainChart>
          <ChartTitle>Performance by Event Type</ChartTitle>
          <ChartSubtitle>Comparing attendance and transaction metrics</ChartSubtitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-200)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'sales' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                    name.charAt(0).toUpperCase() + name.slice(1)
                  ]}
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--color-gray-200)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                />
                <Bar dataKey="attendance" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="transactions" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </MainChart>

        <SideChart>
          <ChartTitle>Event Distribution</ChartTitle>
          <ChartSubtitle>Attendance by event type</ChartSubtitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
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
                    border: '1px solid var(--color-gray-200)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </SideChart>
      </ChartsSection>

      <SecondaryChartsGrid>
        <MainChart>
          <ChartTitle>Weekly Performance Patterns</ChartTitle>
          <ChartSubtitle>Average attendance by day of week</ChartSubtitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dayOfWeekData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-200)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  formatter={(value) => [value.toLocaleString(), 'Attendance']}
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--color-gray-200)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#4f46e5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </MainChart>

        <MainChart>
          <ChartTitle>Recent Performance Trends</ChartTitle>
          <ChartSubtitle>Last 10 events performance</ChartSubtitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recentTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-200)" />
                <XAxis dataKey="date" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'sales' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                    name.charAt(0).toUpperCase() + name.slice(1)
                  ]}
                  contentStyle={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--color-gray-200)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="transactions" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </MainChart>
      </SecondaryChartsGrid>

      <InsightsSection>
        <InsightsTitle>
          💡 Key Insights
        </InsightsTitle>
        <InsightsList>
          {insights.map((insight, index) => (
            <InsightItem key={index} color={insight.color}>
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