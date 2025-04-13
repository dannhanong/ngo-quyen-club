import React from 'react';
import styled, { keyframes } from 'styled-components';

const floatingBg = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.1); }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a2463 0%, #3e92cc 100%);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 40%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 40%);
    z-index: 0;
  }
`;

const BackgroundShapes = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 1;

  .shape {
    position: absolute;
    background: linear-gradient(45deg, 
      rgba(255, 255, 255, 0.3), 
      rgba(255, 255, 255, 0.1)
    );
    border-radius: 50%;
    animation: ${floatingBg} 15s infinite ease-in-out;
    backdrop-filter: blur(5px);

    &:nth-child(1) {
      width: 600px;
      height: 600px;
      top: -300px;
      left: -200px;
      background: linear-gradient(45deg, 
        rgba(65, 88, 208, 0.3), 
        rgba(200, 80, 192, 0.2)
      );
    }

    &:nth-child(2) {
      width: 450px;
      height: 450px;
      bottom: -200px;
      right: -100px;
      background: linear-gradient(45deg, 
        rgba(200, 80, 192, 0.2), 
        rgba(255, 204, 112, 0.3)
      );
    }
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  width: ${props => props.wide ? '100%' : 'auto'};
  max-width: ${props => props.wide ? '1400px' : '500px'};
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2px; // Creates a subtle border effect
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 30px;
    padding: 2px;
    background: linear-gradient(45deg, 
      rgba(255, 255, 255, 0.5), 
      rgba(255, 255, 255, 0.2)
    );
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
`;

const AuthLayout = ({ children, wide }) => (
  <Container>
    <BackgroundShapes>
      <div className="shape" />
      <div className="shape" />
    </BackgroundShapes>
    <ContentWrapper wide={wide}>
      {children}
    </ContentWrapper>
  </Container>
);

export default AuthLayout;
