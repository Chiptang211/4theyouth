'use strict';
document.addEventListener('DOMContentLoaded', function() {
    fetchEvents();
});

function fetchEvents() {
  fetch('https://info442.chiptang.com/lookup/event/info?eventId=all')
      .then(response => response.json())
      .then(events => {
          const eventsByDayOfWeek = groupEventsByDayOfWeek(events);
          const sortedDays = sortDaysOfWeek(Object.keys(eventsByDayOfWeek));
          sortedDays.forEach(day => {
              displayEventsByDay(day, eventsByDayOfWeek[day]);
          });
      })
      .catch(error => console.error('Error fetching events:', error));
}

function groupEventsByDayOfWeek(events) {
  return events.reduce((acc, event) => {
      const eventDate = new Date(event.event_date);
      const dayOfWeek = eventDate.toLocaleString('en-US', { weekday: 'long' });
      (acc[dayOfWeek] = acc[dayOfWeek] || []).push(event);
      return acc;
  }, {});
}

function sortDaysOfWeek(days) {
  const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
}

function displayEventsByDay(day, events) {
  const eventList = document.getElementById('event_day_list');
  let daySection = document.querySelector(`#day-${day}`);
  if (!daySection) {
      daySection = document.createElement('div');
      daySection.className = 'daily-agenda';
      daySection.id = `day-${day}`;
      daySection.innerHTML = `<h2>${day}</h2>`;
      eventList.appendChild(daySection);
  }

  events.forEach(event => {
      const eventElement = document.createElement('div');
      eventElement.className = 'event day-div';
      const eventDate = new Date(event.event_date);
      const formattedDate = `${eventDate.getMonth() + 1}-${eventDate.getDate()}`;
      eventElement.textContent = `${event.event_name} (${formattedDate})`;
      daySection.appendChild(eventElement);
  });
}





// JS for staff & bulletin section, do NOT remove
async function fetchStaffInfo() {
    const response = await fetch('https://info442.chiptang.com/lookup/staff/info?staffId=all');
    if (!response.ok) {
      throw new Error('Failed to fetch staff info');
    }
    return response.json();
  }

  async function fetchBulletinMessages() {
    const response = await fetch('https://info442.chiptang.com/lookup/bulletin?staffId=all');
    if (!response.ok) {
      throw new Error('Failed to fetch bulletin messages');
    }
    return response.json();
  }

  async function displayBulletinWithStaffNames() {
    try {
      const [staffInfo, bulletinMessages] = await Promise.all([fetchStaffInfo(), fetchBulletinMessages()]);

      const staffMap = new Map(staffInfo.map(staff => [staff.staff_id, staff.name]));

      const bulletinSection = document.getElementById('bulletin');
      bulletinSection.innerHTML = '';

      bulletinMessages.forEach(message => {
        const staffName = staffMap.get(message.staff_id) || 'Unknown Staff';
        const messageElement = document.createElement('div');
        messageElement.className = 'info-div';
        messageElement.innerHTML = `
          <strong>${staffName} </strong> (ID ${message.staff_id})<br>
          ${message.message}<br>
        `;
        bulletinSection.appendChild(messageElement);
      });
    } catch (error) {
      console.error('Failed to display bulletin messages:', error);
      document.getElementById('bulletin').innerText = 'Failed to load bulletin messages.';
    }
  }


  // Call the function to display bulletins with staff names on page load
  document.addEventListener('DOMContentLoaded', displayBulletinWithStaffNames);

  async function fetchAndDisplayStaffInfo() {
    try {
      const response = await fetch('https://info442.chiptang.com/lookup/staff/info?staffId=all');
      if (!response.ok) {
        throw new Error('Failed to fetch staff info');
      }
      const staffInfo = await response.json();

      const staffContactContainer = document.getElementById('staff-contact-container');
      staffContactContainer.innerHTML = '';

      staffInfo.forEach(staff => {
        const staffProfileElement = document.createElement('div');
        staffProfileElement.className = 'staff-profile';
        staffProfileElement.innerHTML = `
          <img src="img/staff/${staff.name}.jpg" alt="Staff ${staff.name}" class="profile-img">
          <div class="profile-info">
              <h2>${staff.name}</h2>
              <ul>
                  <li>${staff.role}</li>
                  <li><a href="mailto:${staff.email}">${staff.email}</a></li>
                  <li><a href="tel:${staff.phone}">${staff.phone}</a></li>
              </ul>
          </div>
        `;
        staffContactContainer.appendChild(staffProfileElement);
      });
    } catch (error) {
      console.error('Failed to display staff info:', error);
    }
  }
  
  // Call the function to display staff info on page load
  document.addEventListener('DOMContentLoaded', fetchAndDisplayStaffInfo);

