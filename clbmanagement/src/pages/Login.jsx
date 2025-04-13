import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUserCircle, FaUser } from 'react-icons/fa';

import AuthLayout from './AuthLayout';
import { loginService } from '../services/authService';

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(106, 17, 203, 0.2); }
  50% { box-shadow: 0 0 20px rgba(106, 17, 203, 0.4); }
  100% { box-shadow: 0 0 5px rgba(106, 17, 203, 0.2); }
`;

const moveBackground = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const CircleDecoration = styled.div`
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  backdrop-filter: blur(10px);
  z-index: 0;

  &.top-left {
    width: 300px;
    height: 300px;
    top: -150px;
    left: -150px;
  }

  &.bottom-right {
    width: 400px;
    height: 400px;
    bottom: -200px;
    right: -200px;
  }
`;

const BackgroundParticle = styled.div`
  position: absolute;
  width: ${props => props.size || '10px'};
  height: ${props => props.size || '10px'};
  background: ${props => props.color || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 50%;
  top: ${props => props.top};
  left: ${props => props.left};
  animation: ${float} 6s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  z-index: 0;
`;

const CenteredContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a, #2d3436);
  padding: 40px;
  gap: 40px;
  overflow: hidden;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    padding: 20px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  padding: 0 40px;
  z-index: 1;

  h1 {
    font-size: 3.5em;
    margin: 0;
    background: linear-gradient(45deg, #fff, #d3d3d3);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 1.2em;
    margin-top: 20px;
    color: #a0aec0;
    max-width: 500px;
  }

  @media (max-width: 968px) {
    display: none;
  }
`;

const RightSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;

  @media (max-width: 968px) {
    width: 100%;
  }
`;

const LoginContainer = styled.div`
  width: 100%;
  max-width: 450px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: linear-gradient(to right, #6a11cb, #2575fc);
    border-radius: 3px;
  }
`;

const Title = styled.h1`
  color: #fff;
  font-size: 2.5em;
  margin: 0;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  color: #a0aec0;
  margin-top: 10px;
  font-size: 1.1em;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const InputGroup = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #6a11cb;
    font-size: 20px;
    transition: all 0.3s ease;
  }
`;

const Input = styled.input`
  width: 88%;
  padding: 18px 20px 18px 55px;
  border: 2px solid transparent;
  border-radius: 16px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(5px);

  &:focus {
    background: rgba(255, 255, 255, 0.98);
    border-color: #6a11cb;
    box-shadow: 
      0 0 0 4px rgba(106, 17, 203, 0.1),
      0 5px 20px rgba(106, 17, 203, 0.15);
    outline: none;
    transform: translateY(-2px) scale(1.01);
  }

  &::placeholder {
    color: #9fa8da;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 18px 20px 18px 55px;
  border: 2px solid transparent;
  border-radius: 16px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  appearance: none;

  &:focus {
    border-color: #6a11cb;
    box-shadow: 0 5px 20px rgba(106, 17, 203, 0.15);
    outline: none;
    transform: translateY(-2px);
  }
`;

const Button = styled.button`
  background: linear-gradient(45deg, #6a11cb, #2575fc, #6a11cb);
  background-size: 200% auto;
  color: white;
  padding: 18px;
  border: none;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(106, 17, 203, 0.2);
  text-transform: uppercase;
  letter-spacing: 1px;
  animation: ${moveBackground} 3s infinite;

  &:hover {
    background-position: right center;
    transform: translateY(-3px) scale(1.02);
    box-shadow: 
      0 10px 30px rgba(106, 17, 203, 0.3),
      0 0 0 4px rgba(106, 17, 203, 0.2);
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }
`;

const Links = styled.div`
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(106, 17, 203, 0.1);

  a {
    color: #6a11cb;
    text-decoration: none;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(106, 17, 203, 0.1);
    }
  }
`;

const LoginWrapper = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  min-height: 600px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: ${glow} 3s infinite;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      rgba(106, 17, 203, 0.1),
      rgba(37, 117, 252, 0.1)
    );
    background-size: 400% 400%;
    animation: ${moveBackground} 15s ease infinite;
    z-index: -1;
  }

  @media (max-width: 968px) {
    flex-direction: column;
    min-height: auto;
  }
`;

const BrandSection = styled.div`
  flex: 1;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(244, 63, 94, 0.1));
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      rgba(99, 102, 241, 0.1) 0%,
      rgba(244, 63, 94, 0.1) 100%
    );
    z-index: 0;
  }

  @media (max-width: 968px) {
    padding: 30px;
    text-align: center;
  }
`;

const FormSection = styled.div`
  flex: 1;
  padding: 40px;
  background: rgba(255, 255, 255, 0.02);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 70%
    );
    pointer-events: none;
  }

  @media (max-width: 968px) {
    padding: 30px;
  }
`;

const BrandTitle = styled.h1`
  color: #fff;
  font-size: 2.5em;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
`;

const BrandText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1em;
  line-height: 1.6;
  position: relative;
  z-index: 1;
`;

const Login = () => {
  const [ formData, setFormData ] = useState({
    username: "",
    password: ""
  });
  const [ isLoading, setIsLoading ] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [ name ]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginService(formData);

      alert("Đăng nhập thành công!");

      // Navigate based on user role or to default page
      navigate("/dashboard");

    } catch (error) {
      alert(error.message || "Đăng nhập thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout wide>
      <LoginWrapper>
        <BackgroundParticle size="15px" top="10%" left="5%" delay="0s" />
        <BackgroundParticle size="20px" top="70%" left="80%" delay="2s" />
        <BackgroundParticle size="12px" top="40%" left="90%" delay="4s" />
        <BrandSection>
          <BrandTitle>Chào Mừng Đến Với Các CLB Trường THCS Ngô Quyền</BrandTitle>
          {/* <BrandText>
            Truy cập bảng điều khiển để quản lý hoạt động câu lạc bộ,
            kết nối với thành viên và tổ chức sự kiện một cách hiệu quả.
          </BrandText> */}
        </BrandSection>
        <FormSection>
          <Header>
            <Title>Đăng Nhập</Title>
            <Subtitle>Truy cập tài khoản của bạn</Subtitle>
          </Header>

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <FaUser />
              <Input
                type="text"
                name="username"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
              />
            </InputGroup>

            <InputGroup>
              <FaLock />
              <Input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
              />
            </InputGroup>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
            </Button>
          </Form>

          <Links>
            <Link to="/signup">Chưa có tài khoản? Đăng ký ngay</Link>
          </Links>
        </FormSection>
      </LoginWrapper>
    </AuthLayout>
  );
};

export default Login;
