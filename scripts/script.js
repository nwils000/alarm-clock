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
  static lastId = 0;
  constructor(time, reason, audio, id) {
    this.time = time;
    this.reason = reason;
    this.audio = audio;
    this.id = ++Alarm.lastId;
    this.dismissed = false;
    this.isPlaying = false;
  }
}

let upcomingAlarms = [];
// UPDATING UPCOMING ALARMS ARRAY

function removeAlarm(id) {
  allSetAlarms = allSetAlarms.filter((alarm) => alarm.id !== id);
  renderAlarms();
}

function addAlarm(element) {
  allSetAlarms.push(element);
  renderAlarms();
}

function modifyAlarmTime(index, newTime) {
  allSetAlarms[index].time = newTime;
  renderAlarms();
}

function renderAlarms() {
  currentAlarmsListElement.innerHTML = '';

  allSetAlarms.forEach((alarm) => {
    let hours = alarm.time.split(':')[0];
    let minutes = alarm.time.split(':')[1];
    let formattedHours = parseInt(hours, 10).toString();
    let formattedTime = `${formattedHours}:${minutes}`;
    let listItem = document.createElement('li');
    listItem.innerText = `${formattedTime} - ${alarm.reason}`;

    let deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = () => {
      removeAlarm(alarm.id);
    };

    listItem.appendChild(deleteButton);
    currentAlarmsListElement.appendChild(listItem);
  });
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
  let alarmGoingOff = allSetAlarms.findIndex((alarm) => {
    return !alarm.dismissed && alarm.time === currentTimeForAlarm;
  });
  if (alarmGoingOff) {
    alarmGoingOff.dismissed = true;
  }
  alarmElement.style.display = 'none';
  alarmSoundElement.pause();
  console.log(alarmGoingOff);
  removeAlarm(allSetAlarms[alarmGoingOff].id);
});

snoozeElement.addEventListener('click', () => {
  let now = new Date();
  now.setMinutes(now.getMinutes() + 1);

  let hours = now.getHours();
  let minutes = now.getMinutes();

  if (hours > 12) {
    hours -= 12;
  }

  let snoozeTime = `${hours.toString()}:${minutes.toString().padStart(2, '0')}`;

  let alarmGoingOffIndex = allSetAlarms.findIndex((alarm) => {
    return !alarm.dismissed && alarm.time === currentTimeForAlarm;
  });

  if (alarmGoingOffIndex !== -1) {
    allSetAlarms[alarmGoingOffIndex].isPlaying = false;
    allSetAlarms[alarmGoingOffIndex].time = snoozeTime;
    renderAlarms();
  }

  alarmElement.style.display = 'none';
  alarmSoundElement.pause();
});

// LOGIC FOR SUBMITTING ALARM FORM
submitSetAlarmElement.addEventListener('click', () => {
  const newAlarm = new Alarm(alarmTime, alarmReason, alarmSoundSrc);
  addAlarm(newAlarm);
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

let month = now.getMonth() + 5;
let dayOfMonth = now.getDate();
let date = `${month}/${dayOfMonth}`;
dateElement.innerHTML = date;

let currentTimeForAlarm;
// UPDATING THE TIME EVERY .5 SECONDS
function updateCurrentDate() {
  let now = new Date();
  let originalHour = now.getHours();
  originalHour = originalHour.toString().padStart(2, '0');
  originalHour > 12
    ? (originalHour = `${Number(originalHour - 12)}`)
    : (originalHour = originalHour);
  let originalMinute = now.getMinutes();
  originalMinute = originalMinute.toString().padStart(2, '0');
  let originalSecond = now.getSeconds();
  originalSecond = originalSecond.toString().padStart(2, '0');
  let fullTimeString = `${originalHour}:${originalMinute}:${originalSecond}`;
  timeElement.innerHTML = fullTimeString;

  console.log(allSetAlarms);

  // ALARM GOING OFF LOGIC
  currentTimeForAlarm = `${originalHour}:${originalMinute}`;
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
// WHen i snooze i want it to visually update on screen
