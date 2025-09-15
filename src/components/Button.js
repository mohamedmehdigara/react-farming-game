import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import PropTypes from 'prop-types';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Shared styles for all buttons
const baseButtonStyles = css`
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
  text-align: center;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  padding: 0 15px; // Add padding for better spacing

  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
`;

// Style variants
const primaryStyles = css`
  background-color: #007bff;
  color: #fff;
  &:hover {
    background-color: #0056b3;
  }
  &:active {
    background-color: #004085;
  }
`;

const secondaryStyles = css`
  background-color: #6c757d;
  color: #fff;
  &:hover {
    background-color: #5a6268;
  }
  &:active {
    background-color: #495057;
  }
`;

const dangerStyles = css`
  background-color: #dc3545;
  color: #fff;
  &:hover {
    background-color: #c82333;
  }
  &:active {
    background-color: #bd2130;
  }
`;

const disabledStyles = css`
  background-color: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
  &:hover {
    background-color: #e9ecef; // Prevent color change on hover
  }
`;

// Size variants
const sizeStyles = {
  small: css`
    min-width: 80px;
    height: 30px;
    font-size: 0.8em;
  `,
  medium: css`
    min-width: 100px;
    height: 40px;
    font-size: 1em;
  `,
  large: css`
    min-width: 120px;
    height: 50px;
    font-size: 1.2em;
  `,
};

const StyledButton = styled.button`
  ${baseButtonStyles}

  ${({ variant }) => {
    switch (variant) {
      case 'primary': return primaryStyles;
      case 'secondary': return secondaryStyles;
      case 'danger': return dangerStyles;
      case 'disabled': return disabledStyles; // New disabled variant
      default: return primaryStyles;
    }
  }}

  ${({ size }) => sizeStyles[size || 'medium']}
`;

const Spinner = styled.span`
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: ${spin} 1s ease-in-out infinite;
  margin-right: 8px;
`;

const Button = ({ children, onClick, disabled, variant = 'primary', isLoading, size = 'medium' }) => {
  const buttonVariant = disabled || isLoading ? 'disabled' : variant;

  return (
    <StyledButton
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      variant={buttonVariant}
      size={size}
    >
      {isLoading && <Spinner />}
      {children}
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  isLoading: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default Button;