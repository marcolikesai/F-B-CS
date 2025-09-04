import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: var(--bg-primary);
  border-bottom: var(--border-width) solid var(--border-color);
  padding: 0 var(--space-2xl);
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-xs);
  position: sticky;
  top: 0;
  z-index: 100;

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
  background: var(--color-primary);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  font-weight: 800;
  box-shadow: var(--shadow-sm);
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.025em;

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
  background: var(--color-accent);
  color: white;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  box-shadow: var(--shadow-xs);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
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
    50% { opacity: 0.6; }
  }
`;

const MetricsPill = styled.div`
  background: var(--bg-tertiary);
  border: var(--border-width) solid var(--border-color);
  color: var(--text-secondary);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
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