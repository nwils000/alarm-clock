// VARIABLES
let clockElement = document.querySelector('.clock');
let alarmElement = document.querySelector('.alarm');
let timeElement = document.querySelector('.time');
let dateElement = document.querySelector('.date');
let temperatureElement = document.querySelector('.temperature');

let setAlarmElement = document.querySelector('.set-alarm');
let hourElement = document.querySelector('.hour');
let minuteElement = document.querySelector('.minute');
let getLocalTemperature = document.querySelector('.get-temperature-btn');
let reasonElement = document.querySelector('.reason');
let soundElement = document.querySelector('.sound');
let alarmReasonElement = document.querySelector('.alarm-reason');
let submitSetAlarmElement = document.querySelector('.submit-set-alarm');
let snoozeElement = document.querySelector('.snooze');
let dismissElement = document.querySelector('.dismiss');

let audio = document.createElement('audio');
let now = new Date();

getLocalTemperature.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    coordinates.innerHTML = "Couldn't get your coordinates!";
  }

  function showPosition(position) {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&hourly=temperature_2m`
    )
      .then((res) => res.json())
      .then((data) => {
        const temperaturesArray = data.hourly.temperature_2m;

        temperatureElement.innerHTML = '';

        temperatureElement.innerHTML = `${(
          temperaturesArray[now.getHours()] * (9 / 5) +
          32
        ).toFixed(2)}°F`;
      });
  }
});

let month = now.getMonth() + 1;
let dayOfMonth = now.getDate();
let date = `${month}/${dayOfMonth}`;
dateElement.innerHTML = date;

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
}

setInterval(updateCurrentDate, 500);

/* 
variables: 

userAlarmTime: combine the hour and minute into usable data





COMPLETED:
*clock: to hide when timer goes off. 
*alarm: to display when timer goes off.
*time: to add the current time
*date: to add the current date
*day: to add the current day
*temperature: to add the current temperature
*setAlarm: display when user clicks toggleSetAlarm
*hour: interpret the hour input
*minute: interpret the minute input
*reason: use to display in .alarm-reason element
*sound: use to decide what source to give to an audio element
*alarmReason: the h2 element that needs to be populated with reason
*audio: use to create an audio element
*submitSetAlarm: use to toggle the clock and alarm displays and pass the correct data to alarm
*snooze: add new alarm with teh exact same data for 5 minutes
*dismiss: remove the alarm and redisplay the clock

*/
