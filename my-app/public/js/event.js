document.addEventListener('DOMContentLoaded', function() {
    fetchEvents();
});

function fetchEvents() {
    fetch('https://info442.chiptang.com/lookup/event/info?eventId=all')
        .then(response => response.json())
        .then(events => {
            const eventsByDate = groupEventsByDate(events);
            Object.keys(eventsByDate).forEach(date => {
                eventsByDate[date].forEach(event => {
                    fetchStaffInfo(event.staff_id)
                        .then(staffInfo => {
                            displayEvent(event, staffInfo, date);
                        });
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
