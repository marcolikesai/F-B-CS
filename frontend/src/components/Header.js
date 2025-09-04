import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  margin-top: 2px;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatusBadge = styled.div`
  background: #10b981;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <TitleSection>
        <Title>Silver Arena Analytics</Title>
        <Subtitle>Demand Planning & Concession Analytics Dashboard</Subtitle>
      </TitleSection>
      <StatusBadge>
        System Active
      </StatusBadge>
    </HeaderContainer>
  );
};

export default Header; 