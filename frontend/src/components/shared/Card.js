import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-gray-200);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--color-primary-light), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
    border-color: var(--color-primary-light);
  }

  &:hover::before {
    opacity: 1;
  }
`;

const CardHeader = styled.div`
  padding: var(--space-xl) var(--space-xl) var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--color-gray-100);
  background: linear-gradient(180deg, var(--bg-primary) 0%, var(--color-gray-50) 100%);
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-xs) 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const CardSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
`;

const CardBody = styled.div`
  padding: var(--space-xl);
  position: relative;
`;

const CardFooter = styled.div`
  padding: var(--space-lg) var(--space-xl);
  background: var(--color-gray-50);
  border-top: 1px solid var(--color-gray-100);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
`;

const Card = ({ 
  title, 
  subtitle, 
  children, 
  footer, 
  className,
  icon,
  ...props 
}) => {
  return (
    <CardContainer className={`card-modern ${className || ''}`} {...props}>
      {(title || subtitle) && (
        <CardHeader>
          {title && (
            <CardTitle>
              {icon && <span style={{ fontSize: '1.2em', opacity: 0.8 }}>{icon}</span>}
              {title}
            </CardTitle>
          )}
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        </CardHeader>
      )}
      <CardBody>
        {children}
      </CardBody>
      {footer && (
        <CardFooter>
          {footer}
        </CardFooter>
      )}
    </CardContainer>
  );
};

export default Card; 