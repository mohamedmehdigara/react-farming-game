import styled from "styled-components";
import PropTypes from "prop-types";
import React from "react";

const Button = styled.button`
  width: ${({ size }) => (size === "small" ? "80px" : size === "large" ? "120px" : "100px")};
  height: 50px;
  border-radius: 5px;
  background-color: ${({ variant, backgroundColor }) => backgroundColor || variantColor[variant]};
  border: 1px solid ${({ variant }) => variantColor[variant] || "#ccc"};
  cursor: pointer;
  outline: none;
  font-weight: bold;
  text-align: center;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px; /* Add some padding for icons */

  &.is-disabled {
    background-color: #ccc;
    cursor: default;
  }

  &:hover {
    background-color: ${({ variant }) => hoverColor[variant] || "#eee"};
    box-shadow: 0 0 3px ${({ variant }) => variantColor[variant] || "#ccc"};
  }

  &:active {
    background-color: ${({ variant }) => variantColor[variant] || "#ccc"};
    transform: scale(0.95);
  }

  &:focus {
    box-shadow: 0 0 3px #000000;
    border: 1px solid #000000;
  }
`;

const variantColor = {
  primary: "#007bff",
  secondary: "#6c757d",
  danger: "#dc3545",
  success: "#28a745", /* Add success variant color */
  info: "#17a2b8", /* Add info variant color */
};

const hoverColor = {
  primary: "#0062cc",
  secondary: "#5a626f",
  danger: "#c8233b",
  success: "#219631", /* Add success variant hover color */
  info: "#138496", /* Add info variant hover color */
};

const MyButton = ({ children, onClick, isDisabled, type, variant, size, backgroundColor, icon }) => {
  return (
    <Button
      onClick={onClick}
      isDisabled={isDisabled}
      type={type}
      className={variant}
      size={size}
      backgroundColor={backgroundColor}
    >
      {icon && <i className={`fas fa-${icon}`}></i>} {children}
    </Button>
  );
};
MyButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  type: PropTypes.string,
  variant: PropTypes.oneOf(["primary", "secondary", "danger", "success", "info"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  backgroundColor: PropTypes.string,
  icon: PropTypes.string, // Add prop type for icon
};


export default MyButton;
