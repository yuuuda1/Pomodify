import React from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import p5Types from 'p5';

export const BackgroundAnimation: React.FC = React.memo(() => {
  const sketch = (p: p5Types) => {
    const particles: Particle[] = [];

    class Particle {
      position: p5Types.Vector;
      velocity: p5Types.Vector;
      lifespan: number;

      constructor() {
        this.position = p.createVector(p.width / 2, p.height / 2);
        const angle = p.random(p.TWO_PI);
        const speed = p.random(1, 3);
        this.velocity = p.createVector(p.cos(angle), p.sin(angle)).mult(speed);
        this.lifespan = 360;
      }

      update() {
        this.position.add(this.velocity);
        this.lifespan -= 2;
      }

      display() {
        p.noStroke();
        p.fill(133, 140, 241, this.lifespan);
        p.ellipse(this.position.x, this.position.y, 2.4);
      }

      isDead() {
        return this.lifespan < 0;
      }
    }

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(255);
    };

    p.draw = () => {
      p.background(255, 255, 255, 90);

      particles.push(new Particle());

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.update();
        particle.display();
        if (particle.isDead()) {
          particles.splice(i, 1);
        }
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  };

  return <ReactP5Wrapper sketch={sketch} />;
});
