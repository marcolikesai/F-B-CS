import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { apiService } from '../services/api';
import Card from '../components/shared/Card';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const DashboardContainer = styled.div`
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

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const MetricCard = styled(Card)`
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

const ChartsGrid = styled.div`
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

const InsightsSection = styled.div`
  margin-top: 32px;
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

  const insights = [
    {
      icon: '>',
      text: `Average of ${overview?.key_metrics?.transactions_per_attendee || 0} transactions per attendee across all events`
    },
    {
      icon: '$',
      text: `Average revenue of $${overview?.key_metrics?.sales_per_attendee || 0} per attendee`
    },
    {
      icon: '*',
      text: `NHL games average ${eventTypeData.find(d => d.name === 'NHL')?.attendance || 0} attendees vs ${eventTypeData.find(d => d.name === 'NBA')?.attendance || 0} for NBA games`
    },
    {
      icon: '#',
      text: `Weekend games typically see higher attendance and concession sales`
    }
  ];

  return (
    <DashboardContainer>
      <PageHeader>
        <PageTitle>Analytics Overview</PageTitle>
        <PageSubtitle>
          Comprehensive analysis of {overview?.total_events_analyzed || 0} events from{' '}
          {overview?.date_range?.start ? new Date(overview.date_range.start).toLocaleDateString() : ''} to{' '}
          {overview?.date_range?.end ? new Date(overview.date_range.end).toLocaleDateString() : ''}
        </PageSubtitle>
      </PageHeader>

      <MetricsGrid>
        <MetricCard>
          <MetricValue>{overview?.avg_attendance?.toLocaleString() || 0}</MetricValue>
          <MetricLabel>Average Attendance</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>{overview?.avg_transactions?.toLocaleString() || 0}</MetricValue>
          <MetricLabel>Average Transactions</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>${overview?.avg_sales?.toLocaleString() || 0}</MetricValue>
          <MetricLabel>Average Sales per Event</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue>${overview?.key_metrics?.sales_per_transaction || 0}</MetricValue>
          <MetricLabel>Sales per Transaction</MetricLabel>
        </MetricCard>
      </MetricsGrid>

      <ChartsGrid>
        <Card title="Performance by Event Type" subtitle="Average metrics comparison">
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'sales' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]} />
                <Bar dataKey="attendance" fill="#3b82f6" />
                <Bar dataKey="transactions" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        <Card title="Performance by Day of Week" subtitle="Average attendance patterns">
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dayOfWeekData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [value.toLocaleString(), 'Attendance']} />
                <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </ChartsGrid>

      <Card title="Recent Performance Trends" subtitle="Last 10 events">
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={recentTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'sales' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                name.charAt(0).toUpperCase() + name.slice(1)
              ]} />
              <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="transactions" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card>

      <InsightsSection>
        <Card title="Key Insights" subtitle="Important findings from the analysis">
          <InsightsList>
            {insights.map((insight, index) => (
              <InsightItem key={index}>
                <InsightIcon>{insight.icon}</InsightIcon>
                <InsightText>{insight.text}</InsightText>
              </InsightItem>
            ))}
          </InsightsList>
        </Card>
      </InsightsSection>
    </DashboardContainer>
  );
};

export default Dashboard; 