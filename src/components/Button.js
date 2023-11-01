import styled from "styled-components";
import PropTypes from "prop-types";
import React from "react";

const Button = styled.button`
  width: 100px;
  height: 50px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  outline: none;
  font-weight: bold;
  text-align: center;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;

  &.is-disabled {
    background-color: #ccc;
    cursor: default;
  }

  &:hover {
    background-color: #eee;
    box-shadow: 0 0 3px #ccc;
  }

  &:active {
    background-color: #ccc;
    transform: scale(0.95);
  }
`;

const MyButton = ({ children, onClick, isDisabled, type, variant }) => {
  const buttonVariant = variant || "primary";

  return (
    <Button
      onClick={onClick}
      isDisabled={isDisabled}
      type={type}
      className={buttonVariant}
    >
      {children}
    </Button>
  );
};

MyButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  type: PropTypes.string,
  variant: PropTypes.oneOf(["primary", "secondary", "danger"]),
};

export default MyButton;
