// GLOBAL VARIABLES
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
let now = new Date();

// ALARM CONSTRUCTOR

class Alarm {
  static lastId = 0;
  constructor(time, label, audio) {
    this.id = ++Alarm.lastId;
    this.time = time;
    this.label = label;
    this.audio = audio;
    this.dismissed = false;
    this.isPlaying = false;
  }
  snooze() {
    let [hours, minutes] = this.time.split(':').map((x) => parseInt(x));
    minutes += 5;
    if (minutes >= 60) {
      hours = (hours + 1) % 24;
      minutes -= 60;
    }
    this.time = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
    this.dismissed = false;
    this.isPlaying = false;
  }

  dismiss() {
    this.dismissed = true;
    this.isPlaying = false;
    alarmElement.style.display = 'none';
    alarmSoundElement.pause();
  }
  enable() {
    this.dismissed = false;
  }
}

// INITIALIZE ARRAY OF ALARMS

let allSetAlarms = [];

// FUNCTIONS TO MANIPULATE ALL ALARMS ARRAY

function addAlarm(time, label, audio) {
  const newAlarm = new Alarm(time, label, audio);
  allSetAlarms.push(newAlarm);
  renderAlarms();
  setAlarmElement.style.display = 'none';
}

function editAlarm(id, newTime, newLabel, newAudio) {
  const alarm = allSetAlarms.find((alarm) => alarm.id === id);
  if (alarm) {
    alarm.time = newTime;
    alarm.label = newLabel;
    alarm.audio = newAudio;
    renderAlarms();
  }
  editAlarmElement.style.display = 'none';
}

function snoozeAlarm(id) {
  const alarm = allSetAlarms.find((alarm) => alarm.id === id);
  if (alarm) {
    alarm.snooze();
    renderAlarms();
  }
  alarmElement.style.display = 'none';
  alarmSoundElement.pause();
}

function dismissAlarm(id) {
  const alarm = allSetAlarms.find((alarm) => alarm.id === id);
  if (alarm) {
    alarm.dismiss();
  }
  renderAlarms();
}

function removeAlarm(alarmId) {
  allSetAlarms = allSetAlarms.filter((alarm) => alarm.id !== alarmId);
  renderAlarms();
}

// FUNCTIONS TO CREATE BUTTONS FOR EACH ALARM IN LIST

function createDeleteButton(alarmId) {
  const button = document.createElement('button');
  button.innerText = 'Delete';
  button.addEventListener('click', () => removeAlarm(alarmId));
  return button;
}

function createToggleEnableDisableButton(alarmId) {
  const button = document.createElement('button');
  const alarm = allSetAlarms.find((alarm) => alarm.id === alarmId);
  button.innerText = alarm.dismissed ? 'Enable' : 'Disable';

  button.addEventListener('click', () => {
    if (!alarm.dismissed) {
      alarm.dismiss();
      if (alarm.isPlaying) {
        alarm.isPlaying = false;
        alarmSoundElement.pause();
        alarmElement.style.display = 'none';
      }
      button.innerText = 'Enable';
    } else {
      alarm.enable();
      button.innerText = 'Disable';
    }
    renderAlarms();
  });
  return button;
}

function createEditButton(alarmId) {
  const button = document.createElement('button');
  button.innerText = 'Edit';
  button.addEventListener('click', () => {
    currentAlarmIdToEdit = alarmId;
    const alarm = allSetAlarms.find((alarm) => alarm.id === alarmId);
    if (alarm) {
      editAlarmTimeElement.value = alarm.time;
      editLabelElement.value = alarm.label;
      editSoundChoiceElement.value = alarm.audio;
      editAlarmElement.style.display = 'block';
      setAlarmElement.style.display = 'none';
    }
  });
  return button;
}

//  FUNCTION TO RE-RENDER LIST WHEN ARRAY CHANGES

function renderAlarms() {
  currentAlarmsListSetElement.innerHTML = '';

  allSetAlarms.forEach((alarm) => {
    let hours = alarm.time.split(':')[0];
    let minutes = alarm.time.split(':')[1];
    let formattedHours = parseInt(hours, 10).toString();
    let formattedTime = `${formattedHours}:${minutes}`;
    let listItem = document.createElement('li');
    listItem.innerText = `${formattedTime} - ${alarm.label}`;

    let deleteButton = createDeleteButton(alarm.id);
    let disableButton = createToggleEnableDisableButton(alarm.id);
    let editButton = createEditButton(alarm.id);

    listItem.appendChild(editButton);
    listItem.appendChild(disableButton);
    listItem.appendChild(deleteButton);
    currentAlarmsListSetElement.appendChild(listItem);

    console.log(allSetAlarms);
  });
}

// DISPLAYING ADD ALARM AND EXITING OUT OF SET AND EDIT ALARM

toggleSetAlarmElement.addEventListener('click', () => {
  setAlarmElement.style.display = 'block';
});
cancelSetAlarmElement.addEventListener('click', () => {
  setAlarmElement.style.display = 'none';
});
cancelEditAlarmElement.addEventListener('click', () => {
  editAlarmElement.style.display = 'none';
});

// HANDLING DISMISS AND SNOOZE BUTTONS

dismissElement.addEventListener('click', () => {
  const playingAlarmId = allSetAlarms.find((alarm) => alarm.isPlaying).id;
  dismissAlarm(playingAlarmId);
});

snoozeElement.addEventListener('click', () => {
  const playingAlarmId = allSetAlarms.find((alarm) => alarm.isPlaying).id;
  snoozeAlarm(playingAlarmId);
});

// LOGIC FOR SUBMITTING NEW ALARM FORM

submitSetAlarmElement.addEventListener('click', () => {
  event.preventDefault();
  const time = alarmTimeElement.value;
  const label = labelElement.value;
  const audio = soundChoiceElement.value;
  addAlarm(time, label, audio);
});

// LOGIC FOR SUBMITTING EDIT ALARM FORM

let currentAlarmIdToEdit = null;

submitEditAlarmElement.addEventListener('click', () => {
  event.preventDefault();
  if (currentAlarmIdToEdit !== null) {
    const newTime = editAlarmTimeElement.value;
    const newLabel = editLabelElement.value;
    const newAudio = editSoundChoiceElement.value;
    editAlarm(currentAlarmIdToEdit, newTime, newLabel, newAudio);
  }
});

// LOGIC FOR REMOVING ALARM FROM ARRAY IN EDIT MENU

manualDeleteButton.addEventListener('click', () => {
  event.preventDefault();
  if (currentAlarmIdToEdit !== null) {
    removeAlarm(currentAlarmIdToEdit);
    editAlarmElement.style.display = 'none';
    currentAlarmIdToEdit = null;
  }
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

// GETTING AND DISPLAYING THE DATE

let month = now.getMonth() + 1;
let dayOfMonth = now.getDate();
let date = `${month}/${dayOfMonth}`;
dateElement.innerHTML = date;

// COMPARING THE TIME AND ALARM TIME

let currentTimeForAlarm;

function updateCurrentTimeAndCheckAlarms() {
  const now = new Date();
  const currentTimeString = `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  allSetAlarms.forEach((alarm) => {
    if (
      !alarm.dismissed &&
      alarm.time === currentTimeString &&
      !alarm.isPlaying
    ) {
      alarm.isPlaying = true;
      alarmElement.style.display = 'block';
      alarmLabelElement.textContent = alarm.label;
      alarmSoundElement.src = alarm.audio;
      alarmSoundElement.play();
      alarmLabelElement.style.display = 'block';
    } else if (alarm.time !== currentTimeString) {
      alarm.isPlaying = false;
    }
  });
  setTimeout(updateCurrentTimeAndCheckAlarms, 500);
}

// DISPLAYING THE CURRENT TIME

function updateCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;
  timeElement.textContent = timeString;
}
setInterval(updateCurrentTime, 500);

updateCurrentTime();
updateCurrentTimeAndCheckAlarms();
