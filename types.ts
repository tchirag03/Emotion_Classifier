export enum InputMode {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO'
}

export interface ModelConfig {
  endpointUrl: string;
  threshold: number;
  modelName: string;
}

export interface PredictionResult {
  label?: string;
  confidence?: number;
  data?: any; // For flexible JSON returns
  processingTimeMs?: number;
  timestamp: string;
}

export interface HistoryItem {
  id: string;
  mode: InputMode;
  preview: string; // URL or text snippet
  result: PredictionResult;
  timestamp: number;
}