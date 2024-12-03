import React from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import p5Types from 'p5';

type VisualizerProps = {
  isRunning: boolean;
  analyserNode: AnalyserNode;
}

const Visualizer: React.FC<VisualizerProps> = React.memo(({ isRunning, analyserNode }) => {
  const sketch = (p: p5Types & { updateWithProps?: (props: { isRunning: boolean }) => void }) => {
    let dataArray: Uint8Array;
    let bufferLength: number;
    let angleOffset = 0;
    let running = false;

    p.setup = () => {
      p.createCanvas(456, 456);
      bufferLength = analyserNode.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      p.angleMode(p.DEGREES);
    };

    p.draw = () => {
      p.clear();

      analyserNode.getByteFrequencyData(dataArray);

      p.translate(p.width / 2, p.height / 2);

      if (running) {
        angleOffset += 0.1;
      }

      for (let i = 0; i < 360; i += 4) {
        const index = Math.floor(p.map(i * 2 / 3, 0, 360, 0, dataArray.length - 1));
        console.log(index);
        const value = dataArray[index];

        const r = p.map(value * 1.5, 0, 255, 100, 255);
        const g = p.map(value * 1.5, 0, 255, 50, 200);
        const b = p.map(value * 1.5, 0, 255, 150, 255);

        p.stroke(r, g, b);
        p.strokeWeight(2);

        const radius = p.map(value, 0, 255, 116, 200);

        const x1 = radius * p.cos(i + angleOffset);
        const y1 = radius * p.sin(i + angleOffset);
        const x2 = (radius + 48) * p.cos(i + angleOffset);
        const y2 = (radius + 48) * p.sin(i + angleOffset);

        p.line(x1, y1, x2, y2);
      }
    };

    p.updateWithProps = (props: { isRunning: boolean }) => {
      running = props.isRunning;
      if (!running) {
        angleOffset = 0;
        p.noLoop();
      }
    };
  };

  return <ReactP5Wrapper sketch={sketch} isRunning={isRunning} />;
});

export default Visualizer;
