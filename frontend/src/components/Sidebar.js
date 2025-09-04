import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.nav`
  width: 300px;
  background: var(--bg-primary);
  border-right: var(--border-width) solid var(--border-color);
  padding: var(--space-2xl) 0;
  box-shadow: var(--shadow-xs);
  height: 100vh;
  overflow-y: auto;
  position: sticky;
  top: 0;

  @media (max-width: 768px) {
    width: 280px;
  }
`;

const Logo = styled.div`
  padding: 0 var(--space-2xl) var(--space-2xl) var(--space-2xl);
  border-bottom: var(--border-width) solid var(--border-color-light);
  margin-bottom: var(--space-2xl);
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-sm);
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  font-weight: 800;
`;

const LogoText = styled.h2`
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.025em;
`;

const LogoSubtext = styled.p`
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin: 0;
  padding-left: 52px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MenuSection = styled.div`
  margin-bottom: var(--space-2xl);
`;

const SectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 var(--space-md) var(--space-2xl);
  display: flex;
  align-items: center;
  gap: var(--space-sm);

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-color-light);
  }
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: var(--space-md) var(--space-2xl);
  color: ${props => props.$isActive ? 'var(--color-primary)' : 'var(--text-secondary)'};
  background: ${props => props.$isActive ? 'var(--bg-tertiary)' : 'transparent'};
  text-decoration: none;
  font-weight: ${props => props.$isActive ? '600' : '500'};
  transition: all 0.15s ease;
  position: relative;
  margin: 0 var(--space-sm);
  border-radius: var(--radius-lg);

  &::before {
    content: '';
    position: absolute;
    left: -${props => props.$isActive ? 'var(--space-sm)' : '0'};
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--color-primary);
    border-radius: 0 2px 2px 0;
    opacity: ${props => props.$isActive ? '1' : '0'};
    transition: all 0.15s ease;
  }

  &:hover {
    background: var(--bg-tertiary);
    color: var(--color-primary);
    transform: translateX(2px);
  }

  &:hover::before {
    opacity: 0.3;
  }
`;

const MenuIcon = styled.div`
  margin-right: var(--space-md);
  font-size: 1.25rem;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: ${props => props.$isActive ? 'var(--color-primary)' : 'transparent'};
  color: ${props => props.$isActive ? 'white' : 'inherit'};
  transition: all 0.15s ease;
`;

const MenuLabel = styled.span`
  font-size: 0.875rem;
  line-height: 1.4;
  font-weight: inherit;
`;

const menuItems = [
  {
    section: 'Overview',
    items: [
      { path: '/', label: 'Dashboard', icon: '📊' },
      { path: '/methods', label: 'Methods', icon: '🔬' },
      { path: '/predictions', label: 'March 5th Predictions', icon: '🎯' },
    ]
  },
  {
    section: 'Analysis',
    items: [
      { path: '/stand-analysis', label: 'Stand Performance', icon: '🏪' },
      { path: '/staffing', label: 'Staffing Recommendations', icon: '👥' },
      { path: '/risk-assessment', label: 'Risk Assessment', icon: '⚠️' },
    ]
  }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <SidebarContainer>
      <Logo>
        <LogoSection>
          <LogoIcon>🏟️</LogoIcon>
          <LogoText>Silver Arena</LogoText>
        </LogoSection>
        <LogoSubtext>Analytics Dashboard</LogoSubtext>
      </Logo>
      
      {menuItems.map((section, index) => (
        <MenuSection key={index}>
          <SectionTitle>{section.section}</SectionTitle>
          {section.items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <MenuItem
                key={item.path}
                to={item.path}
                $isActive={isActive}
              >
                <MenuIcon $isActive={isActive}>{item.icon}</MenuIcon>
                <MenuLabel>{item.label}</MenuLabel>
              </MenuItem>
            );
          })}
        </MenuSection>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar; 