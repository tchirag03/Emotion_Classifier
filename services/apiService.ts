import { InputMode, ModelConfig, PredictionResult } from "../types";

/**
 * Main function to send data to the Deep Learning Backend.
 * 
 * UNIVERSAL BACKEND PROTOCOL (FastAPI):
 * The frontend sends a POST request with `multipart/form-data`.
 * 
 * Fields sent:
 * - `mode`: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" (Use this in backend to route logic)
 * - `model_name`: string
 * - `threshold`: string (float)
 * - `file`: Binary file (if mode is IMAGE, AUDIO, VIDEO)
 * - `text`: Text string (if mode is TEXT)
 */
export const sendPredictionRequest = async (
  mode: InputMode,
  payload: File | string,
  config: ModelConfig
): Promise<PredictionResult> => {
  const startTime = performance.now();

  try {
    const formData = new FormData();
    
    // Universal Meta-data
    formData.append("mode", mode);
    formData.append("threshold", config.threshold.toString());
    formData.append("model_name", config.modelName);

    // Dynamic Payload
    if (mode === InputMode.TEXT) {
      formData.append("text", payload as string);
    } else {
      // For images, audio, video
      formData.append("file", payload as File);
    }

    const response = await fetch(config.endpointUrl, {
      method: "POST",
      body: formData,
      // Note: Do not set Content-Type header manually for FormData; fetch handles the boundary.
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
    }

    const data = await response.json();
    const endTime = performance.now();

    return {
      label: data.label || "Completed",
      confidence: data.confidence || 0,
      data: data, // Universal bucket for any extra JSON your model returns
      processingTimeMs: Math.round(endTime - startTime),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Prediction failed:", error);
    throw error;
  }
};