import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: var(--bg-primary);
  border-bottom: 1px solid var(--color-gray-200);
  padding: 0 var(--space-xl);
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);

  @media (max-width: 768px) {
    padding: 0 var(--space-lg);
    height: 70px;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-lg);
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  font-weight: 700;
  box-shadow: var(--shadow-md);
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StatusSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const StatusBadge = styled.div`
  background: linear-gradient(135deg, var(--color-success), #059669);
  color: white;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-xl);
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 768px) {
    padding: var(--space-xs) var(--space-md);
    font-size: 0.75rem;
  }
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const MetricsPill = styled.div`
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  color: var(--text-secondary);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-xl);
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--space-xs);

  @media (max-width: 768px) {
    display: none;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <TitleSection>
        <LogoIcon>🏟️</LogoIcon>
        <TitleGroup>
          <Title>Silver Arena Analytics</Title>
          <Subtitle>Demand Planning & Concession Analytics Dashboard</Subtitle>
        </TitleGroup>
      </TitleSection>
      
      <StatusSection>
        <MetricsPill>
          📊 Live Data
        </MetricsPill>
        <StatusBadge>
          <StatusDot />
          System Active
        </StatusBadge>
      </StatusSection>
    </HeaderContainer>
  );
};

export default Header; 