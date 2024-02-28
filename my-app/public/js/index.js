'use strict';

// Agenda
// Eddie, does this look right? I recovered it from GitHub history
document.addEventListener('DOMContentLoaded', function() {
  fetchEvents();
});
function fetchEvents() {
  fetch('https://info442.chiptang.com/lookup/event/info?eventId=all')
      .then(response => response.json())
      .then(events => {
          const mondayEvents = events.filter(event => getDayName(event.event_date, 'en-US') === 'Monday');
          mondayEvents.forEach(event => {
                  fetchStaffInfo(event.staff_id)
                      .then(staffInfo => {
                          displayEvent(event, staffInfo, date);
                      });
              });
      })
      .catch(error => console.error('Error fetching events:', error));
}

function groupEventsByDate(events) {
  return events.reduce((acc, event) => {
      (acc[event.event_date] = acc[event.event_date] || []).push(event);
      return acc;
  }, {});
}
function fetchStaffInfo(staffId) {
  return fetch(`https://info442.chiptang.com/lookup/staff/info?staffId=${staffId}`)
      .then(response => response.json())
      .then(data => {
          return {
              name: data.name,
              email: data.email,
              phone: data.phone
          };
      })
      .catch(error => {
          console.error(`Error fetching staff info for ID ${staffId}:`, error);
          return { name: 'Unknown', email: '', phone: '' };
      });
}
function getDayName (date, country){
  var date = new Date(date);
  return date.toLocaleDateString(locale, { weekday: 'long'});
}
function displayEvent(event, staffInfo, date) {
  const eventList = document.getElementById('event_list');
  let dateSection = document.querySelector(`#date-${date}`);

      if (!dateSection) {
      dateSection = document.createElement('div');
      dateSection.id = `date-${date}`;
      dateSection.innerHTML = `<h2>${date}</h2>`;
      eventList.appendChild(dateSection);
      }

  const eventElement = document.createElement('div');
  eventElement.className = 'event';
  eventElement.innerHTML = `
      <h3>${event.event_name}</h3>
      <p>${event.event_description}</p>
      <p><strong>Staff:</strong> ${staffInfo.name}, <a href="mailto:${staffInfo.email}">${staffInfo.email}</a>, <a href="tel:${staffInfo.phone}">${staffInfo.phone}</a></p>
  `;
  dateSection.appendChild(eventElement);
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
          <img src="img/hung.jpeg" alt="Staff ${staff.name}" class="profile-img">
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