import React from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import p5Types from 'p5';

type VisualizerProps = {
  isRunning: boolean;
  analyserNode: AnalyserNode;
}

const CANVAS_SIZE = 456;
const CIRCLE_DEGREES = 360;
const CIRCLE_DIVISION_ANGLE = 4;
const CIRCLE_ROTATION_SPEED = 0.1;
const CIRCLE_RADIUS = 116;
const LINE_LENGTH = 48;

const COLOR_MAPPING = {
  r: { inputMin: 0, inputMax: 255 * 1.6, outputMin: 133, outputMax: 255 },
  g: { inputMin: 0, inputMax: 255 * 1.6, outputMin: 73, outputMax: 200 },
  b: { inputMin: 0, inputMax: 255 * 1.6, outputMin: 152, outputMax: 255 },
};

const mapColor = (p: p5Types, value: number) => {
  const r = p.map(value, COLOR_MAPPING.r.inputMin, COLOR_MAPPING.r.inputMax, COLOR_MAPPING.r.outputMin, COLOR_MAPPING.r.outputMax);
  const g = p.map(value, COLOR_MAPPING.g.inputMin, COLOR_MAPPING.g.inputMax, COLOR_MAPPING.g.outputMin, COLOR_MAPPING.g.outputMax);
  const b = p.map(value, COLOR_MAPPING.b.inputMin, COLOR_MAPPING.b.inputMax, COLOR_MAPPING.b.outputMin, COLOR_MAPPING.b.outputMax);
  return { r, g, b };
};

export const Visualizer: React.FC<VisualizerProps> = React.memo(({ isRunning, analyserNode }) => {
  const sketch = (p: p5Types & { updateWithProps?: (props: { isRunning: boolean }) => void }) => {
    let dataArray: Uint8Array;
    let bufferLength: number;
    let angleOffset = 0;

    p.setup = () => {
      p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
      bufferLength = analyserNode.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      p.angleMode(p.DEGREES);
    };

    p.draw = () => {
      p.clear();
      p.translate(p.width / 2, p.height / 2);

      analyserNode.getByteFrequencyData(dataArray);
      angleOffset += CIRCLE_ROTATION_SPEED;

      for (let i = 0; i < CIRCLE_DEGREES; i += CIRCLE_DIVISION_ANGLE) {
        const index = Math.floor(p.map(i * 3 / 4, 0, CIRCLE_DEGREES, 0, dataArray.length - 1));
        const value = dataArray[index];

        const { r, g, b } = mapColor(p, value * 1.6);
        p.stroke(r, g, b);
        p.strokeWeight(2);

        const radius = p.map(value, 0, 255, CIRCLE_RADIUS, 200);
        const x1 = radius * p.cos(i + angleOffset);
        const y1 = radius * p.sin(i + angleOffset);
        const x2 = (radius + LINE_LENGTH) * p.cos(i + angleOffset);
        const y2 = (radius + LINE_LENGTH) * p.sin(i + angleOffset);
        p.line(x1, y1, x2, y2);
      }
    };
  };

  return <ReactP5Wrapper sketch={sketch} isRunning={isRunning} />;
});
