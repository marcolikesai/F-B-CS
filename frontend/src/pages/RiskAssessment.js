import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { apiService } from '../services/api';
import Card from '../components/shared/Card';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const RiskAssessmentContainer = styled.div`
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

const RiskGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RiskCard = styled(Card)`
  border-left: 4px solid ${props => props.riskLevel === 'high' ? '#ef4444' : props.riskLevel === 'medium' ? '#f59e0b' : '#10b981'};
`;

const RiskLevel = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 16px;
  background: ${props => props.level === 'high' ? '#fef2f2' : props.level === 'medium' ? '#fefbf2' : '#f0fdf4'};
  color: ${props => props.level === 'high' ? '#dc2626' : props.level === 'medium' ? '#d97706' : '#16a34a'};
`;

const MetricComparison = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const MetricLabel = styled.span`
  font-weight: 500;
  color: #374151;
`;

const MetricValue = styled.span`
  font-weight: 600;
  color: #64748b;
`;

const ItemsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemIcon = styled.span`
  font-size: 1.2rem;
  margin-right: 12px;
  margin-top: 2px;
`;

const ItemText = styled.p`
  margin: 0;
  color: #374151;
  line-height: 1.5;
`;

const Score = styled.span`
  display: inline-block;
  min-width: 40px;
  padding: 2px 8px;
  border-radius: 12px;
  background: #f1f5f9;
  color: #111827;
  font-weight: 600;
  margin-left: 8px;
`;

// Helper to map qualitative risk to numeric score
const riskScore = (level) => {
  const map = { low: 1, medium: 2, high: 3 };
  return map[(level || '').toLowerCase()] || 2;
};

const RiskAssessment = () => {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getRiskAssessment();
        setRiskData(response.data);
      } catch (err) {
        setError(err.message);
        console.error('Risk assessment data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="large" text="Loading risk assessment..." />;
  }

  if (error) {
    return (
      <RiskAssessmentContainer>
        <Card title="Error" subtitle="Failed to load risk assessment data">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </Card>
      </RiskAssessmentContainer>
    );
  }

  return (
    <RiskAssessmentContainer>
      <PageHeader>
        <PageTitle>Risk Assessment</PageTitle>
        <PageSubtitle>
          Comprehensive risk analysis and mitigation strategies for March 5th game
        </PageSubtitle>
      </PageHeader>

      <RiskGrid>
        <RiskCard riskLevel={riskData?.attendance_risk?.risk_level?.toLowerCase()}>
          <RiskLevel level={riskData?.attendance_risk?.risk_level?.toLowerCase()}>
            {riskData?.attendance_risk?.risk_level} Risk
          </RiskLevel>
          <h4>Attendance Risk Analysis</h4>
          <MetricComparison>
            <MetricLabel>Predicted Attendance:</MetricLabel>
            <MetricValue>{riskData?.attendance_risk?.predicted_attendance?.toLocaleString()}</MetricValue>
          </MetricComparison>
          <MetricComparison>
            <MetricLabel>Average NBA Attendance:</MetricLabel>
            <MetricValue>{riskData?.attendance_risk?.avg_nba_attendance?.toLocaleString()}</MetricValue>
          </MetricComparison>
          <MetricComparison>
            <MetricLabel>Attendance Gap:</MetricLabel>
            <MetricValue style={{ 
              color: riskData?.attendance_risk?.attendance_gap < 0 ? '#ef4444' : '#10b981' 
            }}>
              {riskData?.attendance_risk?.attendance_gap > 0 ? '+' : ''}{riskData?.attendance_risk?.attendance_gap?.toLocaleString()}
            </MetricValue>
          </MetricComparison>
        </RiskCard>

        <RiskCard riskLevel="medium">
          <RiskLevel level="medium">Medium Risk</RiskLevel>
          <h4>Revenue Risk Analysis</h4>
          <MetricComparison>
            <MetricLabel>Predicted Trans/Attendee:</MetricLabel>
            <MetricValue>{riskData?.revenue_risk?.predicted_trans_per_attendee}</MetricValue>
          </MetricComparison>
          <MetricComparison>
            <MetricLabel>Average NBA Trans/Attendee:</MetricLabel>
            <MetricValue>{riskData?.revenue_risk?.avg_nba_trans_per_attendee}</MetricValue>
          </MetricComparison>
          <MetricComparison>
            <MetricLabel>Performance Gap:</MetricLabel>
            <MetricValue style={{ 
              color: riskData?.revenue_risk?.performance_gap < 0 ? '#ef4444' : '#10b981' 
            }}>
              {riskData?.revenue_risk?.performance_gap > 0 ? '+' : ''}{riskData?.revenue_risk?.performance_gap}
            </MetricValue>
          </MetricComparison>
        </RiskCard>
      </RiskGrid>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <Card title="Operational Risks" subtitle="Potential challenges and concerns">
          <ItemsList>
            {riskData?.operational_risks?.map((risk, index) => (
              <ListItem key={index}>
                <ItemIcon>-</ItemIcon>
                <ItemText>{risk}</ItemText>
              </ListItem>
            )) || []}
          </ItemsList>
        </Card>

        <Card title="Opportunities" subtitle="Areas for revenue optimization">
          <ItemsList>
            {riskData?.opportunities?.map((opportunity, index) => (
              <ListItem key={index}>
                <ItemIcon>-</ItemIcon>
                <ItemText>{opportunity}</ItemText>
              </ListItem>
            )) || []}
          </ItemsList>
        </Card>
      </div>

      <Card title="Mitigation Strategies" subtitle="Recommended actions to minimize risks">
        <ItemsList>
          {riskData?.mitigation_strategies?.map((strategy, index) => (
            <ListItem key={index}>
              <ItemIcon>-</ItemIcon>
              <ItemText>{strategy}</ItemText>
            </ListItem>
          )) || []}
        </ItemsList>
      </Card>

      <Card title="Quantitative Summary" subtitle="Normalized risk scoring (1=Low, 2=Medium, 3=High)">
        <ItemsList>
          <ListItem>
            <ItemIcon>≡</ItemIcon>
            <ItemText>
              Attendance Risk: {riskData?.attendance_risk?.risk_level} <Score>{riskScore(riskData?.attendance_risk?.risk_level)}</Score>
            </ItemText>
          </ListItem>
          <ListItem>
            <ItemIcon>≡</ItemIcon>
            <ItemText>
              Revenue Risk: {riskData?.revenue_risk?.performance_gap < 0 ? 'Below baseline' : 'At/Above baseline'}
              <Score>{riskData?.revenue_risk?.performance_gap < 0 ? 2 : 1}</Score>
            </ItemText>
          </ListItem>
          <ListItem>
            <ItemIcon>≡</ItemIcon>
            <ItemText>
              Operational Complexity: High-traffic stands and halftime surge require proactive queue management
              <Score>2</Score>
            </ItemText>
          </ListItem>
        </ItemsList>
      </Card>

    </RiskAssessmentContainer>
  );
};

export default RiskAssessment; 