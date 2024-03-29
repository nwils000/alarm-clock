// VARIABLES
let clockElement = document.querySelector('.clock');
let alarmElement = document.querySelector('.alarm');
let timeElement = document.querySelector('.time');
let dateElement = document.querySelector('.date');
let temperatureElement = document.querySelector('.temperature');
let toggleSetAlarmElement = document.querySelector('.toggle-set-alarm');
let cancelSetAlarmElement = document.querySelector('.cancel-set-alarm');
let cancelEditAlarmElement = document.querySelector('.cancel-edit-alarm');
let currentAlarmsListSetElement = document.querySelector(
  '.current-alarms-list-set'
);
let currentAlarmsListEditElement = document.querySelector(
  '.current-alarms-list-edit'
);
let manualDeleteButton = document.querySelector('.manual-delete-button');

let setAlarmElement = document.querySelector('.set-alarm');
let editAlarmElement = document.querySelector('.edit-alarm');
let alarmTimeElement = document.querySelector('.alarm-time');
let editAlarmTimeElement = document.querySelector('.edit-alarm-time');
let labelElement = document.querySelector('.label');
let editLabelElement = document.querySelector('.edit-label');
let soundChoiceElement = document.querySelector('.sound-choice');
let editSoundChoiceElement = document.querySelector('.edit-sound-choice');
let alarmLabelElement = document.querySelector('.alarm-label');
let submitEditAlarmElement = document.querySelector('.submit-edit-alarm');
let submitSetAlarmElement = document.querySelector('.submit-set-alarm');
let snoozeElement = document.querySelector('.snooze');
let dismissElement = document.querySelector('.dismiss');
let alarmSoundElement = document.querySelector('.alarm-sound');

let audio = document.createElement('audio');
let now = new Date();

let allSetAlarms = [];

class Alarm {
  static lastId = 0;
  constructor(time, label, audio) {
    this.time = time;
    this.label = label;
    this.audio = audio;
    this.id = ++Alarm.lastId;
    this.dismissed = false;
    this.isPlaying = false;
    this.disabled = false;
  }
}

let upcomingAlarms = [];
// UPDATING UPCOMING ALARMS ARRAY

function removeAlarm(id) {
  allSetAlarms = allSetAlarms.filter((alarm) => alarm.id !== id);
  renderAlarms();
}

function disableAlarm(id) {
  let currentAlarmToDisable = allSetAlarms.find((alarm) => alarm.id === id);
  currentAlarmToDisable.disabled = true;
}

let currentAlarmToEdit;
function editAlarm(id) {
  currentAlarmToEdit = allSetAlarms.find((alarm) => alarm.id === id);
}

function addAlarm(element) {
  allSetAlarms.push(element);
  renderAlarms();
}

function modifyAlarmTime(index, newTime) {
  allSetAlarms[index].time = newTime;
  renderAlarms();
}

function createDeleteButton(alarmId) {
  let button = document.createElement('button');
  button.innerText = 'Delete';
  button.addEventListener('click', () => removeAlarm(alarmId));
  return button;
}

function createDisableButton(alarmId) {
  let button = document.createElement('button');
  button.innerText = 'Disable';
  button.addEventListener('click', () => {
    disableAlarm(alarmId);
    alarmElement.style.display = 'none';
    alarmSoundElement.pause();
  });
  return button;
}

function createEditButton(alarmId) {
  let button = document.createElement('button');
  button.innerText = 'Edit';
  button.addEventListener('click', () => {
    editAlarm(alarmId);
    editAlarmElement.style.display = 'block';
    setAlarmElement.style.display = 'none';
  });
  return button;
}

function renderAlarms() {
  currentAlarmsListSetElement.innerHTML = '';
  currentAlarmsListEditElement.innerHTML = '';

  allSetAlarms.forEach((alarm) => {
    let hours = alarm.time.split(':')[0];
    let minutes = alarm.time.split(':')[1];
    let formattedHours = parseInt(hours, 10).toString();
    let formattedTime = `${formattedHours}:${minutes}`;
    let listItem = document.createElement('li');
    listItem.innerText = `${formattedTime} - ${alarm.label}`;

    let deleteButton = createDeleteButton(alarm.id);
    let disableButton = createDisableButton(alarm.id);
    let editButton = createEditButton(alarm.id);

    listItem.appendChild(editButton);
    listItem.appendChild(disableButton);
    listItem.appendChild(deleteButton);
    currentAlarmsListSetElement.appendChild(listItem);

    let listItemClone = document.createElement('li');
    listItemClone.textContent = `${formattedTime} - ${alarm.label}`;

    let deleteButtonClone = createDeleteButton(alarm.id);
    let disableButtonClone = createDisableButton(alarm.id);
    let editButtonClone = createEditButton(alarm.id);

    listItemClone.appendChild(editButtonClone);
    listItemClone.appendChild(disableButtonClone);
    listItemClone.appendChild(deleteButtonClone);
    currentAlarmsListEditElement.appendChild(listItemClone);
  });
}

// OPENING NEW ALARM FORM
toggleSetAlarmElement.addEventListener('click', () => {
  setAlarmElement.style.display = 'block';
});
cancelSetAlarmElement.addEventListener('click', () => {
  setAlarmElement.style.display = 'none';
});
cancelEditAlarmElement.addEventListener('click', () => {
  editAlarmElement.style.display = 'none';
});

// HANDLING FORM DATA
let alarmTime;
let alarmLabel = null;
let alarmSoundSrc = soundChoiceElement.value;

let editAlarmTime;
let editAlarmLabel = null;
let editAlarmSoundSrc = editSoundChoiceElement.value;

alarmTimeElement.addEventListener('input', () => {
  if (Number(alarmTimeElement.value.split(':')[0]) > 12) {
    let alarmTimeHourNumber = Number(alarmTimeElement.value.split(':')[0]) - 12;
    alarmTime = `${alarmTimeHourNumber}:${
      alarmTimeElement.value.split(':')[1]
    }`;
  } else {
    alarmTime = `${parseInt(alarmTimeElement.value.split(':')[0], 10)}:${
      alarmTimeElement.value.split(':')[1]
    }`;
  }
});

editAlarmTimeElement.addEventListener('input', () => {
  if (Number(editAlarmTimeElement.value.split(':')[0]) > 12) {
    let alarmTimeHourNumber =
      Number(editAlarmTimeElement.value.split(':')[0]) - 12;
    editAlarmTime = `${alarmTimeHourNumber}:${
      editAlarmTimeElement.value.split(':')[1]
    }`;
  } else {
    editAlarmTime = `${parseInt(
      editAlarmTimeElement.value.split(':')[0],
      10
    )}:${editAlarmTimeElement.value.split(':')[1]}`;
  }
});

labelElement.addEventListener('input', () => {
  alarmLabel = labelElement.value;
});
editLabelElement.addEventListener('input', () => {
  editAlarmLabel = editLabelElement.value;
});

soundChoiceElement.addEventListener('change', () => {
  alarmSoundSrc = soundChoiceElement.value;
});
editSoundChoiceElement.addEventListener('change', () => {
  editAlarmSoundSrc = editSoundChoiceElement.value;
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

  /*  
DISABLE IT AS WELL ***

   */
});

snoozeElement.addEventListener('click', () => {
  let now = new Date();
  now.setMinutes(now.getMinutes() + 5);

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

// LOGIC FOR SUBMITTING NEW ALARM FORM
submitSetAlarmElement.addEventListener('click', () => {
  const newAlarm = new Alarm(alarmTime, alarmLabel, alarmSoundSrc);
  addAlarm(newAlarm);
});

// LOGIC FOR SUBMITTING EDIT ALARM FORM
submitEditAlarmElement.addEventListener('click', () => {
  console.log(currentAlarmToEdit);
  currentAlarmToEdit.time = editAlarmTime;
  currentAlarmToEdit.label = editAlarmLabel;
  currentAlarmToEdit.audio = editAlarmSoundSrc;
  console.log(alarmTime);
  console.log(currentAlarmToEdit);
  console.log(upcomingAlarms);
  renderAlarms();
});

manualDeleteButton.addEventListener('click', () => {
  event.preventDefault();
  console.log(allSetAlarms);
  allSetAlarms = allSetAlarms.filter((alarm) => alarm !== currentAlarmToEdit);
  console.log(allSetAlarms);
  renderAlarms();
});

// GETTING USER LOCATION AND FETCHING TEMPERATURE FROM API

navigator.geolocation.getCurrentPosition(showPosition);
function showPosition(position) {
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&hourly=temperature_2m`
  )
    .then((res) => res.json())
    .then((data) => {
      const temperaturesArray = data.hourly.temperature_2m;
      temperatureElement.innerHTML = `${(
        temperaturesArray[now.getHours()] * (9 / 5) +
        32
      ).toFixed(2)}°F`;
    });
}

let month = now.getMonth() + 1;
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

  // ALARM GOING OFF LOGIC
  currentTimeForAlarm = `${originalHour}:${originalMinute}`;
  allSetAlarms.forEach((alarm) => {
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

      alarmLabelElement.innerHTML = alarm.label;
    } else if (
      alarm.time === currentTimeForAlarm &&
      alarm.dismissed === false &&
      alarm.isPlaying
    ) {
      alarm.isPlaying = false;
    }
  });
}
updateCurrentDate();

setInterval(updateCurrentDate, 500);

// I want submit to close the form
// I want the alarm noise to keep going off until the minute is over
// WHen i snooze i want it to visually update on screen
// Make dismiss button disable it
