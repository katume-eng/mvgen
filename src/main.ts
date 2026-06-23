import p5 from "p5";

import { computeZoomAtTime } from "./animations/zoom";
import { computeShakeAtTime } from "./animations/shake";
import { computeRotateAtTime } from "./animations/rotate";
import { computeOpacityAtTime } from "./animations/opacity";
import { computeBlurAtTime } from "./animations/blur";
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

    // Load background image using proper p5 callback → Promise (more reliable than direct await)
    const imagePromise = new Promise<p5.Image | null>((resolve) => {
      p.loadImage(
        "/assets/background.png",
        (img) => {
          console.log("[mvgen] Background image loaded successfully");
          resolve(img);
        },
        (err) => {
          console.error("[mvgen] Failed to load background image:", err);
          resolve(null);
        }
      );
    });

    // Events use normal fetch (already promise-based)
    const eventsPromise = loadEvents("/events.json").then((ev) => {
      console.log("[mvgen] Events loaded:", ev.length);
      return ev;
    }).catch((err) => {
      console.error("[mvgen] Failed to load events:", err);
      return [] as AnimationEvent[];
    });

    try {
      backgroundImage = await imagePromise;
      events = await eventsPromise;
    } catch (error) {
      console.error("[mvgen] Unexpected load error:", error);
      backgroundImage = backgroundImage || null;
      events = events || [];
    }

    startedAtMs = p.millis();
  };

  p.draw = () => {
    const elapsedSec = (p.millis() - startedAtMs) / 1000;

    const zoom = computeZoomAtTime(elapsedSec, events);
    const shake = computeShakeAtTime(elapsedSec, events);
    const rotation = computeRotateAtTime(elapsedSec, events);
    const opacity = computeOpacityAtTime(elapsedSec, events);
    const blurAmt = computeBlurAtTime(elapsedSec, events);

    p.background(0);

    if (backgroundImage) {
      p.push();

      const cx = p.width / 2;
      const cy = p.height / 2;

      // Apply shake as small translation offset (shake already includes oscillation)
      p.translate(cx + shake, cy + shake * 0.6);
      p.rotate(rotation);
      p.scale(zoom);

      if (opacity < 255) {
        p.tint(255, opacity);
      }

      // Lightweight blur via canvas 2d context filter (no extra Graphics buffer)
      const ctx = p.drawingContext as CanvasRenderingContext2D;
      const prevFilter = ctx.filter;
      if (blurAmt > 0.1) {
        ctx.filter = `blur(${blurAmt}px)`;
      }

      p.image(backgroundImage, 0, 0, p.width, p.height);

      // DEBUG: bright green marker + time text.
      // These are drawn AFTER the image so they are on top.
      // They follow all effects (shake/rotate/zoom/opacity/blur).
      // If you see the green square and yellow time, then drawing + transforms are working.
      // If the screen is still black, it means your background.png itself is dark or transparent.
      p.noTint();   // ensure debug is full brightness even during opacity events
      p.fill(0, 255, 0);
      p.noStroke();
      p.rectMode(p.CENTER);
      p.rect(300, 200, 60, 60);

      // Show current time (proves the animation loop + effects are running)
      p.fill(255, 255, 0);
      p.textAlign(p.LEFT, p.CENTER);
      p.textSize(16);
      p.text("t=" + elapsedSec.toFixed(2), 340, 200);

      // reset filter
      ctx.filter = prevFilter || "none";

      p.pop();

      if (opacity < 255) {
        p.noTint();
      }
    } else {
      // Visible fallback (no transforms) so screen isn't pitch black
      p.fill(40, 60, 100);
      p.rectMode(p.CENTER);
      p.rect(p.width / 2, p.height / 2, p.width * 0.85, p.height * 0.85);

      p.fill(220);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(32);
      p.text("背景画像を読み込めませんでした", p.width / 2, p.height / 2 - 30);
      p.textSize(20);
      p.text("(ブラウザコンソールとネットワークタブを確認)", p.width / 2, p.height / 2 + 10);
      p.textSize(18);
      p.fill(180);
      p.text("404の場合 → ハードリロード (Ctrl+Shift+R / Cmd+Shift+R)", p.width / 2, p.height / 2 + 50);
    }
  };
});
