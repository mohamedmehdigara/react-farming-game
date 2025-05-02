import React, { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';

const QuestLogContainer = styled.div`
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin: 10px;
  width: 300px;
`;

const QuestTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
`;

const QuestItem = styled.div`
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const QuestDescription = styled.p`
  margin-top: 5px;
  margin-bottom: 8px;
  font-size: 0.9em;
  color: #555;
`;

const QuestReward = styled.p`
  font-size: 0.85em;
  color: green;
  margin-bottom: 0;
`;

const QuestStatus = styled.span`
  font-size: 0.8em;
  color: orange; /* Default: In Progress */

  &.completed {
    color: green;
  }

  &.failed {
    color: red;
  }
`;

const QuestLog = ({ quests, onQuestComplete }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleCompleteQuest = (questId) => {
    if (onQuestComplete) {
      onQuestComplete(questId);
    }
  };

  const visibleQuests = expanded ? quests : quests.slice(0, 3); // Show first 3 if not expanded

  return (
    <QuestLogContainer>
      <QuestTitle>
        Quest Log
        {quests.length > 3 && (
          <Button onClick={toggleExpand} variant="secondary" style={{ marginLeft: '10px', fontSize: '0.8em' }}>
            {expanded ? 'Show Less' : 'Show All'}
          </Button>
        )}
      </QuestTitle>
      {visibleQuests.map((quest) => (
        <QuestItem key={quest.id}>
          <h4>{quest.title}</h4>
          <QuestDescription>{quest.description}</QuestDescription>
          {quest.reward && <QuestReward>Reward: {quest.reward}</QuestReward>}
          <QuestStatus className={quest.status}>{quest.status.charAt(0).toUpperCase() + quest.status.slice(1)}</QuestStatus>
          {quest.status !== 'completed' && (
            <Button onClick={() => handleCompleteQuest(quest.id)} variant="success" style={{ marginTop: '5px', fontSize: '0.8em' }}>
              Complete
            </Button>
          )}
        </QuestItem>
      ))}
    </QuestLogContainer>
  );
};

export default QuestLog;