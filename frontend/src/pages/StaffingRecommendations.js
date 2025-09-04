import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { apiService } from '../services/api';
import Card from '../components/shared/Card';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const StaffingContainer = styled.div`
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

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const SummaryCard = styled(Card)`
  text-align: center;
  border-left: 4px solid ${props => props.color || '#3b82f6'};
`;

const SummaryValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
`;

const SummaryLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

const StaffingTable = styled.table`
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
  font-size: 0.875rem;
`;

const TableRow = styled.tr`
  &:hover {
    background: #f8fafc;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
  color: #64748b;
  font-size: 0.875rem;
`;

const StandName = styled.div`
  font-weight: 500;
  color: #374151;
  margin-bottom: 2px;
`;

const ChartContainer = styled.div`
  height: 400px;
  width: 100%;
`;

const RecommendationsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const RecommendationItem = styled.li`
  display: flex;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const RecommendationIcon = styled.span`
  font-size: 1.2rem;
  margin-right: 12px;
  margin-top: 2px;
`;

const RecommendationText = styled.p`
  margin: 0;
  color: #374151;
  line-height: 1.5;
`;

const PriorityBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.priority) {
      case 'high': return '#fef2f2';
      case 'medium': return '#fefbf2';
      case 'low': return '#f0fdf4';
      default: return '#f8fafc';
    }
  }};
  color: ${props => {
    switch (props.priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#64748b';
    }
  }};
`;

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const StaffingRecommendations = () => {
  const [staffingData, setStaffingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getStaffingRecommendations();
        setStaffingData(response.data);
      } catch (err) {
        setError(err.message);
        console.error('Staffing data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="large" text="Loading staffing recommendations..." />;
  }

  if (error) {
    return (
      <StaffingContainer>
        <Card title="Error" subtitle="Failed to load staffing data">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </Card>
      </StaffingContainer>
    );
  }

  // Prepare chart data
  const chartData = staffingData?.staffing_by_stand?.map((stand, index) => ({
    name: stand.stand_group.replace(/^(GC|DEST|PORTABLE) - /, ''),
    transactions: stand.predicted_transactions,
    pos_needed: stand.pos_terminals_needed,
    efficiency: stand.avg_trans_per_pos
  })) || [];

  const pieData = staffingData?.staffing_by_stand?.map((stand, index) => ({
    name: stand.stand_group.replace(/^(GC|DEST|PORTABLE) - /, ''),
    value: stand.pos_terminals_needed,
    color: COLORS[index % COLORS.length]
  })) || [];

  const getPriority = (transactions) => {
    if (transactions > 500) return 'high';
    if (transactions > 200) return 'medium';
    return 'low';
  };

  // Compute totals for percent labels
  const totalPos = pieData.reduce((sum, d) => sum + d.value, 0);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const name = pieData[index]?.name || '';
    const pct = ((pieData[index].value / (totalPos || 1)) * 100).toFixed(0) + '%';
    const label = `${name} ${pct}`;
    return (
      <text x={x} y={y} fill="#111827" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11}>
        {label}
      </text>
    );
  };

  return (
    <StaffingContainer>
      <PageHeader>
        <PageTitle>Staffing Recommendations</PageTitle>
        <PageSubtitle>
          Optimal staffing allocation for March 5th Oklahoma City Thunder game
        </PageSubtitle>
      </PageHeader>

      <SummaryGrid>
        <SummaryCard color="#3b82f6">
          <SummaryValue>{staffingData?.total_pos_needed || 0}</SummaryValue>
          <SummaryLabel>Total POS Terminals</SummaryLabel>

        </SummaryCard>
        <SummaryCard color="#10b981">
          <SummaryValue>{staffingData?.total_cashiers_needed || 0}</SummaryValue>
          <SummaryLabel>Cashiers Needed</SummaryLabel>
        </SummaryCard>
        <SummaryCard color="#f59e0b">
          <SummaryValue>{staffingData?.staffing_by_stand?.length || 0}</SummaryValue>
          <SummaryLabel>Stand Types</SummaryLabel>
        </SummaryCard>
        <SummaryCard color="#ef4444">
          <SummaryValue>
            {staffingData?.staffing_by_stand?.reduce((sum, stand) => sum + stand.predicted_transactions, 0) || 0}
          </SummaryValue>
          <SummaryLabel>Total Transactions</SummaryLabel>
        </SummaryCard>
      </SummaryGrid>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <Card title="Staffing by Stand Type" subtitle="POS terminals and predicted transactions">
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  value.toLocaleString(),
                  name === 'transactions' ? 'Predicted Transactions' : 
                  name === 'pos_needed' ? 'POS Terminals' : 'Avg Trans/POS'
                ]} />
                <Bar dataKey="pos_needed" fill="#3b82f6" name="pos_needed" />
                <Bar dataKey="transactions" fill="#10b981" name="transactions" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        <Card title="POS Distribution" subtitle="Allocation across stand types (based on historical share × service rate)">
          <ChartContainer style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'POS Terminals']} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </div>

      <div style={{ marginTop: '8px', marginBottom: '24px' }}>
        <Card title="POS Distribution Legend" subtitle="Stand share of total POS terminals">
          <RecommendationsList>
            {(pieData || []).map((d, i) => (
              <RecommendationItem key={`legend-${i}`}>
                <RecommendationIcon>-</RecommendationIcon>
                <RecommendationText>
                  {d.name}: {(d.value / (totalPos || 1) * 100).toFixed(0)}% ({d.value} POS)
                </RecommendationText>
              </RecommendationItem>
            ))}
          </RecommendationsList>
        </Card>
      </div>

      <Card title="Detailed Staffing Breakdown" subtitle="Stand-by-stand requirements">
        <StaffingTable>
          <thead>
            <tr>
              <TableHeader>Stand Type</TableHeader>
              <TableHeader>Predicted Transactions</TableHeader>
              <TableHeader>POS Terminals</TableHeader>
              <TableHeader>Avg Trans/POS</TableHeader>
              <TableHeader>Priority</TableHeader>
            </tr>
          </thead>
          <tbody>
            {staffingData?.staffing_by_stand?.map((stand, index) => (
              <TableRow key={index}>
                <TableCell>
                  <StandName>{stand.stand_group}</StandName>
                </TableCell>
                <TableCell>{stand.predicted_transactions.toLocaleString()}</TableCell>
                <TableCell>
                  <strong>{stand.pos_terminals_needed}</strong>
                </TableCell>
                <TableCell>{stand.avg_trans_per_pos}</TableCell>
                <TableCell>
                  <PriorityBadge priority={getPriority(stand.predicted_transactions)}>
                    {getPriority(stand.predicted_transactions).toUpperCase()}
                  </PriorityBadge>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </StaffingTable>
      </Card>

      <Card title="Operational Recommendations" subtitle="Best practices for March 5th">
        <RecommendationsList>
          {staffingData?.recommendations?.map((recommendation, index) => (
            <RecommendationItem key={index}>
              <RecommendationIcon>👥</RecommendationIcon>
              <RecommendationText>{recommendation}</RecommendationText>
            </RecommendationItem>
          )) || []}
        </RecommendationsList>
      </Card>

      <Card title="Methodology" subtitle="How staffing numbers are computed">
        <RecommendationsList>
          <RecommendationItem>
            <RecommendationIcon>≡</RecommendationIcon>
            <RecommendationText>
              Step 1 — Allocate predicted transactions across stand groups by historical share of
              transactions observed in the Stand POS dataset.
            </RecommendationText>
          </RecommendationItem>
          <RecommendationItem>
            <RecommendationIcon>≡</RecommendationIcon>
            <RecommendationText>
              Step 2 — For each stand group, compute POS terminals as
              POS_needed = ceil(predicted_transactions_for_group / avg_trans_per_pos_for_group).
            </RecommendationText>
          </RecommendationItem>
          <RecommendationItem>
            <RecommendationIcon>≡</RecommendationIcon>
            <RecommendationText>
              The pie chart shows the distribution of POS terminals by stand group, not transactions. Bars
              show both POS needed and predicted transactions for context.
            </RecommendationText>
          </RecommendationItem>
        </RecommendationsList>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '32px' }}>
        <Card title="Staffing Timeline" subtitle="Recommended deployment schedule">
          <RecommendationsList>
            <RecommendationItem>
              <RecommendationIcon>🕐</RecommendationIcon>
              <RecommendationText>
                <strong>90 minutes before game:</strong> Deploy 60% of staff to handle early arrivals
              </RecommendationText>
            </RecommendationItem>
            <RecommendationItem>
              <RecommendationIcon>🕑</RecommendationIcon>
              <RecommendationText>
                <strong>30 minutes before game:</strong> All staff deployed, focus on high-traffic stands
              </RecommendationText>
            </RecommendationItem>
            <RecommendationItem>
              <RecommendationIcon>🏀</RecommendationIcon>
              <RecommendationText>
                <strong>Halftime:</strong> Peak demand period - ensure all terminals are operational
              </RecommendationText>
            </RecommendationItem>
            <RecommendationItem>
              <RecommendationIcon>🕘</RecommendationIcon>
              <RecommendationText>
                <strong>Post-game:</strong> Maintain 40% staff for post-game sales (15 minutes)
              </RecommendationText>
            </RecommendationItem>
          </RecommendationsList>
        </Card>

        <Card title="Risk Mitigation" subtitle="Contingency planning">
          <RecommendationsList>
            <RecommendationItem>
              <RecommendationIcon>⚠️</RecommendationIcon>
              <RecommendationText>
                Keep 2-3 backup cashiers on standby for unexpected demand spikes
              </RecommendationText>
            </RecommendationItem>
            <RecommendationItem>
              <RecommendationIcon>🔧</RecommendationIcon>
              <RecommendationText>
                Have technical support available for POS system issues
              </RecommendationText>
            </RecommendationItem>
            <RecommendationItem>
              <RecommendationIcon>📱</RecommendationIcon>
              <RecommendationText>
                Implement mobile payment backup systems for high-volume stands
              </RecommendationText>
            </RecommendationItem>
            <RecommendationItem>
              <RecommendationIcon>📊</RecommendationIcon>
              <RecommendationText>
                Monitor real-time queue lengths and adjust staffing dynamically
              </RecommendationText>
            </RecommendationItem>
          </RecommendationsList>
        </Card>
      </div>
    </StaffingContainer>
  );
};

export default StaffingRecommendations; 