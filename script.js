// VARIABLES
let clock = document.querySelector('.clock');
let alarm = document.querySelector('.alarm');
let time = document.querySelector('.time'); // Assuming you want to target the time element
let date = document.querySelector('.date');
let day = document.querySelector('.day');
let temperature = document.querySelector('.temperature');

let setAlarm = document.querySelector('.set-alarm');
let hour = document.querySelector('.hour');
let minute = document.querySelector('.minute');
let reason = document.querySelector('.reason');
let sound = document.querySelector('.sound');
let alarmReason = document.querySelector('.alarm-reason');
let submitSetAlarm = document.querySelector('.submit-set-alarm');
let snooze = document.querySelector('.snooze');
let dismiss = document.querySelector('.dismiss');

/* 
variables: 
clock: to hide when timer goes off. 
alarm: to display when timer goes off.
time: to add the current time
date: to add the current date
day: to add the current day
temperature: to add the current temperature

setAlarm: display when user clicks toggleSetAlarm
hour: interpret the hour input
minute: interpret the minute input
userAlarmTime: combine the hour and minute into usable data
reason: use to display in .alarm-reason element

sound: use to decide what source to give to an audio element
alarmReason: the h2 element that needs to be populated with reason
audio: use to create an audio element
submitSetAlarm: use to toggle the clock and alarm displays and pass the correct data to alarm
snooze: add new alarm with teh exact same data for 5 minutes
dismiss: remove the alarm and redisplay the clock

*/
