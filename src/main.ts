import p5 from "p5";

import { computeZoomAtTime } from "./animations/zoom";
import { loadEvents } from "./io/loadEvents";
import type { AnimationEvent } from "./core/types";

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

new p5((p) => {
  let backgroundImage: p5.Image | null = null;
  let events: AnimationEvent[] = [];
  let startedAtMs = 0;

  p.setup = async () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.frameRate(60);
    p.imageMode(p.CENTER);

    try {
      backgroundImage = await p.loadImage("/assets/background.png");
      events = await loadEvents("/events.json");
    } catch (error) {
      console.error(error);
    }

    startedAtMs = p.millis();
  };

  p.draw = () => {
    const elapsedSec = (p.millis() - startedAtMs) / 1000;
    const zoom = computeZoomAtTime(elapsedSec, events);

    p.background(0);
    p.push();
    p.translate(p.width / 2, p.height / 2);
    p.scale(zoom);

    if (backgroundImage) {
      p.image(backgroundImage, 0, 0, p.width, p.height);
    } else {
      p.fill(32);
      p.rectMode(p.CENTER);
      p.rect(0, 0, p.width, p.height);
    }

    p.pop();
  };
});
