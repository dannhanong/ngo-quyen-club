import React from 'react';
import styled from 'styled-components';
import logoImage from '../assets/logo.jpg'; // Adjust the path to your logo

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const LogoImg = styled.img`
  height: 80px;
  width: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Logo = () => {
    return (
        <LogoWrapper>
            <LogoImg src={logoImage} alt="Club Management Logo" />
        </LogoWrapper>
    );
};

export default Logo;
