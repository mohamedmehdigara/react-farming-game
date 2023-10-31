import styled from "styled-components";

const Button = styled.button`
  width: 100px;
  height: 50px;
  border: 1px solid black;
  background-color: #fff;
  cursor: pointer;

  &.is-disabled {
    background-color: #ccc;
    cursor: default;
  }
`;

const MyButton = ({ children, onClick, isDisabled }) => {
  return (
    <Button onClick={onClick} isDisabled={isDisabled}>
      {children}
    </Button>
  );
};

export default MyButton;
