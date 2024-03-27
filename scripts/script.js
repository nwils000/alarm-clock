// VARIABLES
let clockElement = document.querySelector('.clock');
let alarmElement = document.querySelector('.alarm');
let timeElement = document.querySelector('.time');
let dateElement = document.querySelector('.date');
let temperatureElement = document.querySelector('.temperature');
let toggleSetAlarmElement = document.querySelector('.toggle-set-alarm');
let cancelSetAlarmElement = document.querySelector('.cancel-set-alarm');

let setAlarmElement = document.querySelector('.set-alarm');
let alarmTimeElement = document.querySelector('.alarm-time');
let getLocalTemperature = document.querySelector('.get-temperature-btn');
let reasonElement = document.querySelector('.reason');
let soundChoiceElement = document.querySelector('.sound-choice');
let alarmReasonElement = document.querySelector('.alarm-reason');
let submitSetAlarmElement = document.querySelector('.submit-set-alarm');
let snoozeElement = document.querySelector('.snooze');
let dismissElement = document.querySelector('.dismiss');
let alarmSoundElement = document.querySelector('.alarm-sound');

let audio = document.createElement('audio');
let now = new Date();

// OPENING NEW ALARM FORM
toggleSetAlarmElement.addEventListener('click', () => {
  setAlarmElement.style.display = 'block';
});
cancelSetAlarmElement.addEventListener('click', () => {
  setAlarmElement.style.display = 'none';
});

// HANDLING FORM DATA
let alarmTime = alarmTimeElement.value;
let alarmReason = null;
let alarmSoundSrc = soundChoiceElement.value;
alarmTimeElement.addEventListener('input', () => {
  alarmTime = alarmTimeElement.value;
});
reasonElement.addEventListener('input', () => {
  alarmReason = reasonElement.value;
});
soundChoiceElement.addEventListener('change', () => {
  alarmSoundSrc = soundChoiceElement.value;
});

let dismissPressed = false;
dismissElement.addEventListener('click', () => {
  if (dismissPressed === false) {
    dismissPressed = true;
  } else {
    dismissPressed = false;
  }
});

// LOGIC FOR SUBMITTING ALARM FORM
let submittedAlarmTime = '';
submitSetAlarmElement.addEventListener('click', () => {
  submittedAlarmTime = alarmTime;
  alarmSoundElement.setAttribute('src', alarmSoundSrc);
});

// GETTING USER LOCATION AND FETCHING TEMPERATURE FROM API
getLocalTemperature.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    function showPosition(position) {
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&hourly=temperature_2m`
      )
        .then((res) => res.json())
        .then((data) => {
          getLocalTemperature.style.display = 'none';
          const temperaturesArray = data.hourly.temperature_2m;
          temperatureElement.innerHTML = `${(
            temperaturesArray[now.getHours()] * (9 / 5) +
            32
          ).toFixed(2)}°F`;
        });
    }
  } else {
    getLocalTemperature.style.display = 'default';
  }
});

let month = now.getMonth() + 1;
let dayOfMonth = now.getDate();
let date = `${month}/${dayOfMonth}`;
dateElement.innerHTML = date;

// UPDATING THE TIME EVERY .5 SECONDS
function updateCurrentDate() {
  let now = new Date();
  let originalHour = now.getHours();
  let currentHour;
  originalHour.toString().length === 1
    ? (currentHour = `0${originalHour}`)
    : (currentHour = originalHour);
  originalHour > 12
    ? (currentHour = originalHour - 12)
    : (currentHour = originalHour);
  let originalMinute = now.getMinutes();
  let currentMinute;
  originalMinute.toString().length === 1
    ? (currentMinute = `0${originalMinute}`)
    : (currentMinute = originalMinute);
  let originalSecond = now.getSeconds();
  let currentSecond;
  originalSecond.toString().length === 1
    ? (currentSecond = `0${originalSecond}`)
    : (currentSecond = originalSecond);
  let fullTimeString = `${currentHour}:${currentMinute}:${currentSecond}`;
  timeElement.innerHTML = fullTimeString;

  // ALARM GOING OFF LOGIC
  let currentTimeForAlarm = `${currentHour}:${currentMinute}`;
  if (submittedAlarmTime === currentTimeForAlarm && dismissPressed === false) {
    alarmElement.style.display = 'block';
    alarmSoundElement.play();
  } else {
    alarmSoundElement.pause();
    alarmElement.style.display = 'none';
    dismissPressed = false;
    submittedAlarmTime = '';
  }
}
updateCurrentDate();

setInterval(updateCurrentDate, 500);
