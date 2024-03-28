// VARIABLES
let clockElement = document.querySelector('.clock');
let alarmElement = document.querySelector('.alarm');
let timeElement = document.querySelector('.time');
let dateElement = document.querySelector('.date');
let temperatureElement = document.querySelector('.temperature');
let toggleSetAlarmElement = document.querySelector('.toggle-set-alarm');
let cancelSetAlarmElement = document.querySelector('.cancel-set-alarm');
let currentAlarmsListElement = document.querySelector('.current-alarms-list');

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

let allSetAlarms = [];

class Alarm {
  constructor(time, reason, audio) {
    this.time = time;
    this.reason = reason;
    this.audio = audio;
    this.dismissed = false;
    this.isPlaying = false;
  }
}

// OPENING NEW ALARM FORM
toggleSetAlarmElement.addEventListener('click', () => {
  setAlarmElement.style.display = 'block';
});
cancelSetAlarmElement.addEventListener('click', () => {
  setAlarmElement.style.display = 'none';
});

// HANDLING FORM DATA
let alarmTime;
let alarmReason = null;
let alarmSoundSrc = soundChoiceElement.value;
alarmTimeElement.addEventListener('input', () => {
  if (Number(alarmTimeElement.value.split(':')[0]) > 12) {
    alarmTimeHourNumber = Number(alarmTimeElement.value.split(':')[0]) - 12;
    alarmTime = `${alarmTimeHourNumber}:${
      alarmTimeElement.value.split(':')[1]
    }`;
  } else {
    alarmTime = `${parseInt(alarmTimeElement.value.split(':')[0], 10)}:${
      alarmTimeElement.value.split(':')[1]
    }`;
  }
});
reasonElement.addEventListener('input', () => {
  alarmReason = reasonElement.value;
});
soundChoiceElement.addEventListener('change', () => {
  alarmSoundSrc = soundChoiceElement.value;
});

dismissElement.addEventListener('click', () => {
  let alarmGoingOff = allSetAlarms.find((alarm) => {
    return !alarm.dismissed && alarm.time === currentTimeForAlarm;
  });
  if (alarmGoingOff) {
    alarmGoingOff.dismissed = true;
  }
  alarmElement.style.display = 'none';
  alarmSoundElement.pause();
});

snoozeElement.addEventListener('click', () => {
  let now = new Date();
  now.setMinutes(now.getMinutes() + 5);
  let hours = now.getHours().toString().padStart(2, '0');
  let minutes = now.getMinutes().toString().padStart(2, '0');

  let alarmGoingOff = allSetAlarms.find((alarm) => {
    return !alarm.dismissed && alarm.time === currentTimeForAlarm;
  });
  if (alarmGoingOff) {
    alarmGoingOff.isPlaying = false;
    alarmGoingOff.time = `${hours}:${minutes}`;
    console.log(alarmGoingOff.time);
  }
  alarmElement.style.display = 'none';
  alarmSoundElement.pause();
});

// LOGIC FOR SUBMITTING ALARM FORM
submitSetAlarmElement.addEventListener('click', () => {
  const newAlarm = new Alarm(alarmTime, alarmReason, alarmSoundSrc);
  allSetAlarms.push(newAlarm);
  // DISPLAYING CURRENT ALARMS LIST
  let currentAlarm = allSetAlarms[allSetAlarms.length - 1];
  let currentAlarmsListItem = document.createElement('li');
  currentAlarmsListItem.innerText = `${currentAlarm.time}${currentAlarm.reason}`;
  currentAlarmsListElement.appendChild(currentAlarmsListItem);
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

let currentTimeForAlarm;
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
  currentTimeForAlarm = `${currentHour}:${currentMinute}`;
  // console.log(allSetAlarms);
  allSetAlarms.forEach((alarm, index) => {
    if (
      alarm.time === currentTimeForAlarm &&
      alarm.dismissed === false &&
      !alarm.isPlaying
    ) {
      alarmElement.style.display = 'block';
      alarmSoundElement.setAttribute('src', alarm.audio);
      if (alarm.dismissed === false && alarmSoundElement.paused) {
        alarm.isPlaying = true;
        alarmSoundElement.play();
      }

      alarmReasonElement.innerHTML = alarm.reason;
    }
  });
}
updateCurrentDate();

setInterval(updateCurrentDate, 500);

// I want submit to close the form
// I want the alarm noise to keep going off until the minute is over
