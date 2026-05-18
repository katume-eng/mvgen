import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { AnimationEvent } from "../src/core/types";

type CliOptions = {
  bpm: number;
  duration: number;
  intervalBeats: number;
  strength: number;
  out: string;
};

const toNumber = (value: string | undefined, flag: string): number => {
  if (!value) {
    throw new Error(`Missing value for ${flag}`);
  }

  const number = Number(value);
  if (!Number.isFinite(number)) {
    throw new Error(`Invalid numeric value for ${flag}: ${value}`);
  }

  return number;
};

const parseOptions = (argv: string[]): CliOptions => {
  const options: Partial<CliOptions> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = argv[index + 1];

    switch (flag) {
      case "--bpm":
        options.bpm = toNumber(value, flag);
        index += 1;
        break;
      case "--duration":
        options.duration = toNumber(value, flag);
        index += 1;
        break;
      case "--intervalBeats":
        options.intervalBeats = toNumber(value, flag);
        index += 1;
        break;
      case "--strength":
        options.strength = toNumber(value, flag);
        index += 1;
        break;
      case "--out":
        if (!value) {
          throw new Error("Missing value for --out");
        }
        options.out = value;
        index += 1;
        break;
      default:
        throw new Error(`Unknown argument: ${flag}`);
    }
  }

  if (
    options.bpm === undefined ||
    options.duration === undefined ||
    options.intervalBeats === undefined ||
    options.strength === undefined ||
    options.out === undefined
  ) {
    throw new Error("Required args: --bpm --duration --intervalBeats --strength --out");
  }

  return options as CliOptions;
};

const generateZoomEvents = ({ bpm, duration, intervalBeats, strength }: Omit<CliOptions, "out">): AnimationEvent[] => {
  if (bpm <= 0 || duration <= 0 || intervalBeats <= 0) {
    throw new Error("--bpm, --duration, and --intervalBeats must be greater than 0");
  }

  const beatInterval = (60 / bpm) * intervalBeats;
  const eventDuration = Math.min(beatInterval, 0.5);
  const events: AnimationEvent[] = [];

  for (let time = 0; time < duration; time += beatInterval) {
    events.push({
      type: "zoom",
      time: Number(time.toFixed(6)),
      duration: Number(eventDuration.toFixed(6)),
      strength
    });
  }

  return events;
};

const main = async (): Promise<void> => {
  const options = parseOptions(process.argv.slice(2));
  const events = generateZoomEvents(options);

  const outputPath = path.resolve(process.cwd(), options.out);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(events, null, 2)}\n`, "utf8");

  console.log(`Generated ${events.length} events at ${outputPath}`);
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
