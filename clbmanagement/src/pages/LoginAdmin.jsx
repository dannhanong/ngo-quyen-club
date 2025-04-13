import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUserCircle, FaUser } from 'react-icons/fa';
import AuthLayout from './AuthLayout';
import { loginAdmin } from '../services/adminAuthService';
import Logo from '../components/Logo';

const api = process.env.REACT_APP_API_URL;

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
  width: 87% ;
  padding: 18px 20px 18px 55px;
  border: 2px solid transparent;
  border-radius: 16px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

  &:focus {
    border-color: #6a11cb;
    box-shadow: 0 5px 20px rgba(106, 17, 203, 0.15);
    outline: none;
    transform: translateY(-2px);
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
  background: linear-gradient(45deg, #6a11cb, #2575fc);
  color: white;
  padding: 18px;
  border: none;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(106, 17, 203, 0.2);
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(106, 17, 203, 0.3);
  }

  &:active {
    transform: translateY(-1px);
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
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  min-height: 600px;

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

const LoginAdmin = () => {
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
      const response = await loginAdmin(formData);
      alert("Đăng nhập thành công!");
      navigate("/dashboard-teacher-clb");

    } catch (error) {
      alert(error?.response?.data?.message || "Đăng nhập thất bại!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout wide>
      <LoginWrapper>
        <BrandSection>
          {/* <Logo /> */}
          <BrandTitle>Chào Mừng Đến Với Quản Lý CLB Trường THCS Ngô Quyền</BrandTitle>
          <BrandText>
            Truy cập bảng điều khiển để quản lý hoạt động câu lạc bộ,
            kết nối với thành viên và tổ chức sự kiện một cách hiệu quả.
          </BrandText>
        </BrandSection>
        <FormSection>
          <Logo />
          <Header>
            <Title>Đăng Nhập Admin</Title>
            <Subtitle>Truy cập tài khoản quản trị</Subtitle>
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

          {/* Remove signup link if not needed for admin */}
        </FormSection>
      </LoginWrapper>
    </AuthLayout>
  );
};

export default LoginAdmin;
