import React from 'react';
import styled from 'styled-components';

type ControlsProps = {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ isRunning, onStart, onStop, onReset }) => {
  return (
    <Container>
      {!isRunning ? (
        <Button onClick={onStart}>スタート</Button>
      ) : (
        <Buttons>
          <Button onClick={onStop}>停止</Button>
          <Button onClick={onReset}>リセット</Button>
        </Buttons>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  bottom: 80px;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 100;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 20px;
`;

const Button = styled.button`
  min-width: 120px;
  height: 50px;
  font-size: 16px;
  font-weight: bold;
  background-color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 5px rgba(133, 140, 241, 0.6);
  }
`;
