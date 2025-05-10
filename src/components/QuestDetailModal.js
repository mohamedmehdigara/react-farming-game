import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure it's on top of other content */
`;

const ModalContent = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 500px;
`;

const ModalTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 15px;
`;

const ModalDescription = styled.p`
  margin-bottom: 10px;
  color: #333;
`;

const ModalReward = styled.p`
  color: green;
  margin-bottom: 15px;
  font-weight: bold;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const QuestDetailModal = ({ quest, onClose }) => {
  if (!quest) {
    return null;
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}> {/* Prevent click-through */}
        <ModalTitle>{quest.title}</ModalTitle>
        <ModalDescription>{quest.description}</ModalDescription>
        {quest.reward && <ModalReward>Reward: {quest.reward}</ModalReward>}
        {quest.goal && (
          <p>Progress: {quest.goal.current} / {quest.goal.quantity} ({quest.goal.type}: {quest.goal.itemId || 'N/A'})</p>
        )}
        <ModalActions>
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
          {quest.status !== 'completed' && (
            <Button onClick={() => alert('Implement Claim Reward Logic')} variant="success">
              Claim Reward (if completed)
            </Button>
          )}
          {/* Add other actions like 'Abandon Quest' if needed */}
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default QuestDetailModal;