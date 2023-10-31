import styled from "styled-components";
import PropTypes from "prop-types";
import React from "react";

const Button = styled.button`
  width: 100px;
  height: 50px;
  border: 1px solid black;
  background-color: #fff;
  cursor: pointer;
  outline: none;

  &.is-disabled {
    background-color: #ccc;
    cursor: default;
  }

  &:hover {
    background-color: #eee;
  }

  &:active {
    background-color: #ccc;
  }
`;

const MyButton = ({ children, onClick, isDisabled, type }) => {
  return (
    <Button
      onClick={onClick}
      isDisabled={isDisabled}
      type={type}
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
};

export default MyButton;
