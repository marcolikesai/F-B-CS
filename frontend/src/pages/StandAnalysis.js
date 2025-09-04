import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiService } from '../services/api';
import Card from '../components/shared/Card';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const StandAnalysisContainer = styled.div`
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

const StandTable = styled.table`
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

const ChartContainer = styled.div`
  height: 400px;
  width: 100%;
`;

const StandAnalysis = () => {
  const [standData, setStandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getStandPerformance();
        setStandData(response.data);
      } catch (err) {
        setError(err.message);
        console.error('Stand analysis data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="large" text="Loading stand analysis..." />;
  }

  if (error) {
    return (
      <StandAnalysisContainer>
        <Card title="Error" subtitle="Failed to load stand analysis data">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </Card>
      </StandAnalysisContainer>
    );
  }

  const chartData = Object.entries(standData || {}).map(([standGroup, data]) => ({
    name: standGroup.replace(/^(GC|DEST|PORTABLE) - /, ''),
    transactions: data.total_transactions,
    sales: data.total_sales,
    efficiency: data.trans_per_pos
  }));

  return (
    <StandAnalysisContainer>
      <PageHeader>
        <PageTitle>Stand Performance Analysis</PageTitle>
        <PageSubtitle>
          Historical performance analysis of concession stands
        </PageSubtitle>
      </PageHeader>

      <Card title="Stand Performance Overview" subtitle="Total transactions and sales by stand type">
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
                name === 'sales' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                name === 'sales' ? 'Total Sales' : 'Total Transactions'
              ]} />
              <Bar dataKey="transactions" fill="#3b82f6" />
              <Bar dataKey="sales" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card>

      <Card title="Detailed Performance Metrics" subtitle="Stand-by-stand breakdown">
        <StandTable>
          <thead>
            <tr>
              <TableHeader>Stand Type</TableHeader>
              <TableHeader>Total Transactions</TableHeader>
              <TableHeader>Total Sales</TableHeader>
              <TableHeader>Avg Sales/Transaction</TableHeader>
              <TableHeader>Efficiency (Trans/POS)</TableHeader>
            </tr>
          </thead>
          <tbody>
            {Object.entries(standData || {}).map(([standGroup, data]) => (
              <TableRow key={standGroup}>
                <TableCell style={{ fontWeight: '500' }}>{standGroup}</TableCell>
                <TableCell>{data.total_transactions.toLocaleString()}</TableCell>
                <TableCell>${data.total_sales.toLocaleString()}</TableCell>
                <TableCell>${(data.total_sales / data.total_transactions).toFixed(2)}</TableCell>
                <TableCell>{data.trans_per_pos.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </StandTable>
      </Card>
    </StandAnalysisContainer>
  );
};

export default StandAnalysis; 