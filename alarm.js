const currentTime = document.querySelector("#current-time"); // Reference to the element displaying the current time
const setHours = document.querySelector("#hours"); // Reference to the dropdown menu for selecting hours
const setMinutes = document.querySelector("#minutes"); // Reference to the dropdown menu for selecting minutes
const setSeconds = document.querySelector("#seconds"); // Reference to the dropdown menu for selecting seconds
const setAmPm = document.querySelector("#am-pm"); // Reference to the dropdown menu for selecting AM/PM
const setAlarmButton = document.querySelector("#submitButton"); // Reference to the "Set Alarm" button
const alarmContainer = document.querySelector("#alarms-container"); // Reference to the container for displaying alarms

// Adding Hours, Minutes, Seconds in DropDown Menu
window.addEventListener("DOMContentLoaded", (event) => {
  dropDownMenu(1, 12, setHours); // Populates the hours dropdown menu with options
  dropDownMenu(0, 59, setMinutes); // Populates the minutes dropdown menu with options
  dropDownMenu(0, 59, setSeconds); // Populates the seconds dropdown menu with options

  setInterval(getCurrentTime, 1000); // Updates the current time every second
  fetchAlarm(); // Retrieves and displays saved alarms
});

// Event Listener added to Set Alarm Button
setAlarmButton.addEventListener("click", getInput); // Listens for clicks on the "Set Alarm" button

// Function to populate a dropdown menu with options
function dropDownMenu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const dropDown = document.createElement("option"); // Create an option element
    dropDown.value = i < 10 ? "0" + i : i; // Set the value of the option with leading zeros if necessary
    dropDown.innerHTML = i < 10 ? "0" + i : i; // Set the displayed text of the option with leading zeros if necessary
    element.appendChild(dropDown); // Add the option to the dropdown menu
  }
}

// Function to get and display the current time
function getCurrentTime() {
  let time = new Date(); // Create a new Date object
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  }); // Format the time as "hh:mm:ss AM/PM" and convert to a string
  currentTime.innerHTML = time; // Display the current time in the specified element

  return time; // Return the current time
}

// Function to handle the click event of the Set Alarm button
function getInput(e) {
  e.preventDefault(); // Prevent the default form submission behavior
  const hourValue = setHours.value; // Get the selected hour value
  const minuteValue = setMinutes.value; // Get the selected minute value
  const secondValue = setSeconds.value; // Get the selected second value
  const amPmValue = setAmPm.value; // Get the selected AM/PM value

  const alarmTime = convertToTime(hourValue, minuteValue, secondValue, amPmValue); // Convert the selected time to a specific format
  setAlarm(alarmTime); // Set the alarm for the specified time
}

// Function to convert the selected time to a specific format
function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`; // Returns the time string in "hh:mm:ss AM/PM" format
}

// Function to set an alarm and start the interval checking
function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getCurrentTime()) {
      alert("Alarm Ringing"); // Display an alert when the alarm time is reached
    }
    console.log("running");
  }, 500); // Interval set to check every 500 milliseconds

  addAlaramToDom(time, alarm); // Add the alarm to the DOM
  if (!fetching) {
    saveAlarm(time); // Save the alarm to localStorage
  }
}

// Function to add the alarm to the DOM
function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div"); // Create a div element for the alarm
  alarm.classList.add("alarm", "mb", "d-flex"); // Add CSS classes to the alarm element
  alarm.innerHTML = `
    <div class="time">${time}</div>
    <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>
  `; // HTML content of the alarm element
  const deleteButton = alarm.querySelector(".delete-alarm"); // Reference to the delete button in the alarm element
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId)); // Listens for clicks on the delete button

  alarmContainer.prepend(alarm); // Add the alarm to the beginning of the container
}

// Function to check if alarms are present in localStorage
function checkAlarams() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms"); // Check if alarms are stored in localStorage
  if (isPresent) alarms = JSON.parse(isPresent); // Parse the stored alarms if present

  return alarms; // Return the alarms array
}

// Function to save the alarm to localStorage
function saveAlarm(time) {
  const alarms = checkAlarams(); // Get the stored alarms from localStorage

  alarms.push(time); // Add the new alarm to the alarms array
  localStorage.setItem("alarms", JSON.stringify(alarms)); // Store the updated alarms array in localStorage
}

// Function to fetch alarms from localStorage and set them
function fetchAlarm() {
  const alarms = checkAlarams(); // Get the stored alarms from localStorage

  alarms.forEach((time) => {
    setAlarm(time, true); // Set each alarm from the stored alarms
  });
}

// Function to delete an alarm
function deleteAlarm(event, time, intervalId) {
  const self = event.target; // Reference to the clicked delete button

  clearInterval(intervalId); // Clear the interval associated with the alarm

  const alarm = self.parentElement; // Reference to the parent element of the delete button
  console.log(time);

  deleteAlarmFromLocal(time); // Remove the alarm from localStorage
  alarm.remove(); // Remove the alarm from the DOM
}

// Function to delete an alarm from localStorage
function deleteAlarmFromLocal(time) {
  const alarms = checkAlarams(); // Get the stored alarms from localStorage

  const index = alarms.indexOf(time); // Find the index of the alarm in the alarms array
  alarms.splice(index, 1); // Remove the alarm from the alarms array
  localStorage.setItem("alarms", JSON.stringify(alarms)); // Store the updated alarms array in localStorage
}
