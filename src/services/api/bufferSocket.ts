import AudioRecord from "react-native-audio-record";
import { Buffer } from "buffer";

let ws: WebSocket;

export const startStreaming = () => {
  ws = new WebSocket("ws://your-server-ip:8080");

  ws.onopen = () => {
    console.log("WebSocket connected");

    AudioRecord.init({
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      audioSource: 6, // voice recognition source
      wavFile: "test.wav",
    });

    AudioRecord.start();

    AudioRecord.on("data", (data: string) => {
      // data là base64 string, convert sang Buffer để gửi
      const chunk = Buffer.from(data, "base64");
      ws.send(chunk);
    });
  };
};

export const stopStreaming = () => {
  AudioRecord.stop();
  if (ws) ws.close();
};
