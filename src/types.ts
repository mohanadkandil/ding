export interface IMediaRecorder {
  mediaRecorder: MediaRecorder | null;
  audioBlobs: Blob[] | null;
  streamBeingCaptured: MediaStream | null;
  start: () => Promise<void>;
  stop: () => void;
  cancel: () => void;
  stopStream: () => void;
  resetRecordingProperties: () => void;
}
