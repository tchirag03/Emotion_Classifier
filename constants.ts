import { InputMode } from "./types";

export const DEFAULT_ENDPOINT = "http://localhost:8000/predict";

/**
 * MODULARITY SETTING:
 * Keep only the modes you need for your specific hackathon problem statement.
 * Remove items from this array to hide them in the UI.
 */
export const ENABLED_MODES: InputMode[] = [
  InputMode.TEXT,
  InputMode.IMAGE,
  InputMode.AUDIO,
  InputMode.VIDEO
];
