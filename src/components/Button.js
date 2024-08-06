import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ButtonContainer = styled.button`
  width: 100px;
  height: 40px;
  border-radius: 5px;
  border: none;
    cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease-in-out;

 

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Button = ({ children, onClick, disabled, variant, isLoading }) => {
  return (
    <ButtonContainer type="button" onClick={onClick} disabled={disabled || isLoading}>
      {isLoading ? 'Loading...' : children}
    </ButtonContainer>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']), // Add more variants as needed
  isLoading: PropTypes.bool,
};

export default Button;
