import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.size === 'large' ? '60px' : '40px'};
`;

const Spinner = styled.div`
  border: ${props => props.size === 'large' ? '4px' : '3px'} solid #f3f4f6;
  border-top: ${props => props.size === 'large' ? '4px' : '3px'} solid #3b82f6;
  border-radius: 50%;
  width: ${props => props.size === 'large' ? '40px' : '24px'};
  height: ${props => props.size === 'large' ? '40px' : '24px'};
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: 16px;
  color: #64748b;
  font-size: 0.875rem;
  text-align: center;
`;

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  return (
    <SpinnerContainer size={size}>
      <div>
        <Spinner size={size} />
        {text && <LoadingText>{text}</LoadingText>}
      </div>
    </SpinnerContainer>
  );
};

export default LoadingSpinner; 