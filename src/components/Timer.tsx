import React, { useState, useEffect, useRef } from 'react';
import { Controls } from './Controls';
import { Visualizer } from './Visualizer';
import { BackgroundAnimation } from './BackgroundAnimation';
import styled from 'styled-components';

function getAudioContext(): typeof AudioContext | undefined {
  if ('AudioContext' in window) {
    return window.AudioContext;
  } else if ('webkitAudioContext' in window) {
    return (window as Window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  }
  return undefined;
}

const MAX_TIME = 1500;

export const Timer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    const AudioContextClass = getAudioContext();

    if (AudioContextClass) {
      audioContextRef.current = new AudioContextClass();
      analyserNodeRef.current = audioContextRef.current.createAnalyser();
      fetch('/audio/sound.mp3')
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => audioContextRef.current!.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
          audioBufferRef.current = audioBuffer;
        })
        .catch((error) => console.error(error));

      return () => {
        audioContextRef.current?.close();
      };
    } else {
      console.error('AudioContext is not supported in this browser.');
      return;
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      if (intervalRef.current !== null) return;

      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            stopAudio();
            return MAX_TIME;
          }
          return prevTime - 1;
        });
      }, 1000);

      playAudio();
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      stopAudio();
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const playAudio = () => {
    if (audioContextRef.current && audioBufferRef.current) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.loop = true;
      source.connect(analyserNodeRef.current!);
      analyserNodeRef.current!.connect(audioContextRef.current.destination);
      source.start();
      sourceRef.current = source;
    }
  };

  const stopAudio = () => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mm = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const ss = (seconds % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MAX_TIME);
  };

  return (
    <Container>
      <BackgroundAnimation />
      <TimerContainer>
        <TimerBody>
          <TimerCircle>
            <TimerText>{formatTime(timeLeft)}</TimerText>
          </TimerCircle>
          <VisualizerContainer>
            {audioContextRef.current && analyserNodeRef.current && (
              <Visualizer
                isRunning={isRunning}
                analyserNode={analyserNodeRef.current}
              />
            )}
          </VisualizerContainer>
        </TimerBody>
      </TimerContainer>
      <Controls
        isRunning={isRunning}
        onStart={handleStart}
        onStop={handleStop}
        onReset={handleReset}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  & canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
`;

const TimerContainer = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(133, 140, 241, 0.12);
`;

const TimerBody = styled.div`
  position: relative;
  padding: 80px;
`;

const TimerCircle = styled.div`
  width: 280px;
  height: 280px;
  border-radius: 50%;
  border: 8px solid rgba(255, 255, 255, 0.6);;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  background-color: rgba(255, 255, 255, 0.9);
  // opacity: 0.9;
  position: relative;
  z-index: 2;
  text-align: center;
`;

const TimerText = styled.div`
  position: relative;
  font-size: 56px;
  font-weight: bold;
  letter-spacing: 2px;
  z-index: 20;
  opacity: 1.0;
  color: #213547;
`;

const VisualizerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 8;
`;
