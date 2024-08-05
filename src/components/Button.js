import styled from 'styled-components';
import PropTypes from 'prop-types';

const Button = styled.button`
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

const MyButton = ({ children, onClick, disabled, variant }) => {
  return (
    <Button onClick={onClick} disabled={disabled} variant={variant}>
      {children}
    </Button>
  );
};

MyButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  variant: PropTypes.string,
};

export default MyButton;
