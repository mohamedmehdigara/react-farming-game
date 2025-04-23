import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const baseButtonStyles = css`
  width: 100px;
  height: 40px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap; /* Prevent text wrapping */

  &:focus {
    outline: 2px solid ${({ theme }) => theme.focusColor || '#007bff'}; /* Add a default focus color */
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const primaryStyles = css`
  background-color: ${({ theme }) => theme.primaryColor || '#007bff'}; /* Use theme or default */
  color: ${({ theme }) => theme.primaryTextColor || '#fff'};
`;

const secondaryStyles = css`
  background-color: ${({ theme }) => theme.secondaryColor || '#6c757d'};
  color: ${({ theme }) => theme.secondaryTextColor || '#fff'};
`;

const dangerStyles = css`
  background-color: ${({ theme }) => theme.dangerColor || '#dc3545'};
  color: ${({ theme }) => theme.dangerTextColor || '#fff'};
`;

const StyledButton = styled.button`
  ${baseButtonStyles}

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return primaryStyles;
      case 'secondary':
        return secondaryStyles;
      case 'danger':
        return dangerStyles;
      default:
        return primaryStyles; /* Default to primary */
    }
  }}
`;

const Button = ({ children, onClick, disabled, variant = 'primary', isLoading }) => {
  return (
    <StyledButton
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      variant={variant}
    >
      {isLoading ? 'Loading...' : children}
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  isLoading: PropTypes.bool,
};

export default Button;