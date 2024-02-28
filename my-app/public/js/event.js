document.addEventListener('DOMContentLoaded', function() {
    fetchEvents();
});

function fetchEvents() {
    fetch('https://info442.chiptang.com/lookup/event/info?eventId=all')
        .then(response => response.json())
        .then(events => {
            const eventsByDate = groupEventsByDate(events);
            const sortedDates = Object.keys(eventsByDate).sort((a, b) => b.localeCompare(a));
            sortedDates.forEach(date => {
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
                id: staffId,
                name: data.name,
                email: data.email,
                phone: data.phone,
                role: data.role
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
        dateSection.className = 'info-div';
        dateSection.id = `date-${date}`;
        dateSection.innerHTML = `<h2>${date}</h2>`;

        // Insert the new date section in the correct position
        const existingDates = [...eventList.querySelectorAll('.info-div')]
            .map(div => div.id.replace('date-', ''));
        const sortedDates = [date, ...existingDates].sort((a, b) => b.localeCompare(a));
        const insertIndex = sortedDates.indexOf(date);

        if (insertIndex === 0 || eventList.children.length === 0) {
            eventList.prepend(dateSection);
        } else if (insertIndex === sortedDates.length - 1) {
            eventList.appendChild(dateSection);
        } else {
            const nextDateSection = document.querySelector(`#date-${sortedDates[insertIndex + 1]}`);
            eventList.insertBefore(dateSection, nextDateSection);
        }
    }

    const eventElement = document.createElement('div');
    eventElement.className = 'event info-div';
    eventElement.innerHTML = `
        <strong>${event.event_name}</strong> (ID ${event.event_id})<br>
        ${event.event_description}<br>
        <br>
        ${staffInfo.role}, ${staffInfo.name} (ID ${staffInfo.id})<br>
        <a href="mailto:${staffInfo.email}">${staffInfo.email}</a>, <a href="tel:${staffInfo.phone}">${staffInfo.phone}</a>
    `;
    dateSection.appendChild(eventElement);
}

