import { cancelAudioRecording, startAudioRecording } from "../recorder";

export function changeTimer() {
  const recordButton = <HTMLButtonElement>(
    document.getElementById("Ding__timerRecordButton")
  );

  const resetButton = <HTMLButtonElement>(
    document.getElementById("Ding__timerResetButton")
  );
  var canvas = <HTMLCanvasElement>document.querySelector(".Ding__timer");
  var ctx: any = canvas.getContext("2d");
  var seconds = <HTMLDivElement>(
    document.getElementById("Ding__timerSecondsCounter")
  );
  var timerOn = false;
  var second = (2 * Math.PI) / 60;
  var start = 1.5 * Math.PI;
  var time = 0;
  var animation: number; // used to handle the setInterval function in the recordButton event listener

  var draw = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 30;
    ctx.strokeStyle = "#27ffd6";
    ctx.beginPath();
    ctx.arc(100, 100, 80, start, start + second * time);
    ctx.stroke();
    time = time >= 60 ? 0 : time + 0.05;
  };

  recordButton.addEventListener("click", function () {
    if (!timerOn) {
      recordButton.innerHTML = "Stop";
      cancelAudioRecording();
      recordButton.style.backgroundColor = "#f45d48";
      timerOn = true;
      animation = setInterval(function () {
        draw();
        seconds.innerHTML = Math.floor(time).toString();
      }, 50);
    } else {
      recordButton.innerHTML = "Record";
      startAudioRecording();
      recordButton.style.backgroundColor = "#27ffd6";
      timerOn = false;
      clearInterval(animation);
    }
  });
  resetButton.addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    seconds.innerHTML = "0";
    timerOn = false;
    clearInterval(animation);
    time = 0;
  });
}
