import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.nav`
  width: 280px;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 24px 0;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
`;

const Logo = styled.div`
  padding: 0 24px 24px 24px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 24px;
`;

const LogoText = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    font-size: 1.5rem;
  }
`;

const MenuSection = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 12px 24px;
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: ${props => props.$isActive ? '#3b82f6' : '#64748b'};
  background: ${props => props.$isActive ? '#eff6ff' : 'transparent'};
  text-decoration: none;
  font-weight: ${props => props.$isActive ? '500' : '400'};
  border-right: ${props => props.$isActive ? '3px solid #3b82f6' : '3px solid transparent'};
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    color: #3b82f6;
  }
`;

const MenuIcon = styled.span`
  margin-right: 12px;
  font-size: 1.1rem;
`;

const menuItems = [
  {
    section: 'Overview',
    items: [
      { path: '/', label: 'Dashboard', icon: '-' },
      { path: '/methods', label: 'Methods', icon: '-' },
      { path: '/predictions', label: 'March 5th Predictions', icon: '-' },
    ]
  },
  {
    section: 'Analysis',
    items: [
      { path: '/stand-analysis', label: 'Stand Performance', icon: '-' },
      { path: '/staffing', label: 'Staffing Recommendations', icon: '-' },
      { path: '/risk-assessment', label: 'Risk Assessment', icon: '-' },
    ]
  }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <SidebarContainer>
      <Logo>
        <LogoText>Silver Arena</LogoText>
      </Logo>
      
      {menuItems.map((section, index) => (
        <MenuSection key={index}>
          <SectionTitle>{section.section}</SectionTitle>
          {section.items.map((item) => (
            <MenuItem
              key={item.path}
              to={item.path}
              $isActive={location.pathname === item.path}
            >
              <MenuIcon>{item.icon}</MenuIcon>
              {item.label}
            </MenuItem>
          ))}
        </MenuSection>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar; 