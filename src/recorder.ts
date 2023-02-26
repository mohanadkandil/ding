import { IMediaRecorder } from "./types";

// make audio recordings with web audio api
const audioRecorder: IMediaRecorder = {
  audioBlobs: [],
  mediaRecorder: null,
  streamBeingCaptured: null,

  start: () => {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      return Promise.reject(new Error("no support"));
    } else {
      // the audio recording is supported
      return navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          audioRecorder.streamBeingCaptured = stream;
          audioRecorder.mediaRecorder = new MediaRecorder(stream);
          audioRecorder.audioBlobs = [];

          audioRecorder.mediaRecorder.addEventListener(
            "dataavailable",
            (event) => {
              if (audioRecorder.audioBlobs)
                audioRecorder.audioBlobs.push(event.data);
            }
          );
          // start recording
          audioRecorder.mediaRecorder.start();
        });
    }
  },
  stop: () => {
    return new Promise((resolve) => {
      // set audio type
      const mimeType = audioRecorder.mediaRecorder?.mimeType;

      // listen for the stop event
      audioRecorder.mediaRecorder?.addEventListener("stop", () => {
        // create a single blob object
        if (audioRecorder.audioBlobs) {
          const audioBlob = new Blob(audioRecorder.audioBlobs, {
            type: mimeType,
          });

          // resolve the promise with the blob
          resolve(audioBlob);
        }
      });
      audioRecorder.cancel();
    });
  },
  cancel: () => {
    // stop the recording
    audioRecorder.mediaRecorder?.stop();

    // stop all tracks on the active stream
    audioRecorder.stopStream();

    // reset API properties for next recording
    audioRecorder.resetRecordingProperties();
  },

  stopStream: () => {
    audioRecorder.streamBeingCaptured
      ?.getTracks()
      .forEach((tracks) => tracks.stop());
  },

  resetRecordingProperties: () => {
    audioRecorder.mediaRecorder = null;
    audioRecorder.streamBeingCaptured = null;
  },
};

// main app
export const startAudioRecording = () => {
  audioRecorder
    .start()
    ?.then(() => console.log("recording audio"))
    .catch((error) => {
      if (error.message.includes("no support"))
        console.log("no support for audio recording");
      switch (error.name) {
        case "AbortError": //error from navigator.mediaDevices.getUserMedia
          console.log("An AbortError has occured.");
          break;
        case "NotAllowedError": //error from navigator.mediaDevices.getUserMedia
          console.log(
            "A NotAllowedError has occured. User might have denied permission."
          );
          break;
        case "NotFoundError": //error from navigator.mediaDevices.getUserMedia
          console.log("A NotFoundError has occured.");
          break;
        case "NotReadableError": //error from navigator.mediaDevices.getUserMedia
          console.log("A NotReadableError has occured.");
          break;
        case "SecurityError": //error from navigator.mediaDevices.getUserMedia or from the MediaRecorder.start
          console.log("A SecurityError has occured.");
          break;
        case "TypeError": //error from navigator.mediaDevices.getUserMedia
          console.log("A TypeError has occured.");
          break;
        case "InvalidStateError": //error from the MediaRecorder.start
          console.log("An InvalidStateError has occured.");
          break;
        case "UnknownError": //error from the MediaRecorder.start
          console.log("An UnknownError has occured.");
          break;
        default:
          console.log("An error occured with the error name " + error.name);
      }
    });
};

export const cancelAudioRecording = () => {
  console.log("canceling audio recording");
  audioRecorder.cancel();
};
