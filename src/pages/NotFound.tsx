import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NotFoundContainer = styled.div`
  text-align: center;
  color: white;
  padding: 4rem 2rem;
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ErrorMessage = styled.h2`
  font-size: 2rem;
  margin: 1rem 0;
  opacity: 0.9;
`;

const ErrorDescription = styled.p`
  font-size: 1.1rem;
  margin-bottom: 3rem;
  opacity: 0.8;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const HomeButton = styled(Link)`
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const NotFound: React.FC = () => {
  return (
    <NotFoundContainer>
      <ErrorCode>404</ErrorCode>
      <ErrorMessage>Page Not Found</ErrorMessage>
      <ErrorDescription>
        Oops! The page you're looking for doesn't exist. 
        It might have been moved, deleted, or you entered the wrong URL.
      </ErrorDescription>
      <HomeButton to="/">Go Back Home</HomeButton>
    </NotFoundContainer>
  );
};

export default NotFound;
