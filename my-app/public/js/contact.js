

document.addEventListener('DOMContentLoaded', fetchStaffAndEvents);

function fetchStaffAndEvents() {
    fetch('https://info442.chiptang.com/lookup/staff/info?staffId=all')
        .then(handleResponse)
        .then(staffList => populateStaffList(staffList))
        .catch(error => console.error('Error fetching staff list:', error));
}

function populateStaffList(staffList) {
    const staffListDiv = document.getElementById('staff_list');
    staffList.forEach(staff => {
        const staffDiv = document.createElement('div');
        staffDiv.className = 'staff-info';
        staffDiv.className = 'info-div';
        staffDiv.innerHTML = `
            <strong>${staff.name} </strong> (ID ${staff.staff_id})<br>
            <strong>Email:</strong> <a href="mailto:${staff.email}">${staff.email}</a><br>
            <strong>Phone:</strong> <a href="tel:${staff.phone}">${staff.phone}</a><br>
            <br>
        `;
        staffListDiv.appendChild(staffDiv);

        // Fetch events associated with this staff member
        fetch(`https://info442.chiptang.com/lookup/staff/event?staffId=${staff.staff_id}`)
            .then(handleResponse)
            .then(eventIds => fetchAndDisplayEvents(eventIds, staffDiv))
            .catch(error => console.error('Error fetching events for staff:', error));
    });
}

function fetchAndDisplayEvents(eventIds, staffDiv) {
    eventIds.forEach(eventId => {
        // Fetch detailed info for each event
        fetch(`https://info442.chiptang.com/lookup/event/info?eventId=${eventId}`)
            .then(handleResponse)
            .then(eventInfos => {
                eventInfos.forEach(eventInfo => {
                    const eventDiv = document.createElement('div');
                    eventDiv.className = 'event-info';
                    eventDiv.className = 'info-div';
                    eventDiv.innerHTML = `
                        ${eventInfo.event_name} (ID: ${eventId})<br>
                    `;
                    staffDiv.appendChild(eventDiv);
                });
            })
            .catch(error => console.error('Error fetching event info:', error));
    });
}

function handleResponse(response) {
    if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`);
    }
    return response.json();
}