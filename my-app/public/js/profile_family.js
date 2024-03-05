'use strict';

document.addEventListener('DOMContentLoaded', function() {
    const userId = getQueryParam('id');
    fetchFamilyInfo(userId);
    fetchChildrenList(userId);
    fetchChildrenAndPopulateSelectors(userId);

    document.getElementById('children_view').addEventListener('click', () => toggleView('children_box'));
    document.getElementById('event_view').addEventListener('click', () => toggleView('event_box'));
    document.getElementById('activity_view').addEventListener('click', () => toggleView('activity_box'));
    document.getElementById('check_in_view').addEventListener('click', () => toggleView('check_in_box'));

    document.getElementById('children_view').addEventListener('click', () => {
        toggleView('children_box');
        const userId = getQueryParam('id');
        fetchChildrenList(userId);
    });

    document.getElementById('add_child_button').addEventListener('click', () => {
        document.getElementById('add_child_form').style.display = 'block';
    });

    document.getElementById('hide_child_button').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('add_child_form').style.display = 'none';
    });

    document.getElementById('add_child_form').addEventListener('submit', addChild);
    document.getElementById('event_child_selector').addEventListener('change', fetchEventsForChild);
    document.getElementById('activity_child_selector').addEventListener('change', fetchActivitiesForChild);
    document.getElementById('check_in_child_selector').addEventListener('change', function() {
        updateEventOptionsForChild(this.value);
    });
    document.getElementById('check_in_button').addEventListener('click', checkInChild);
});

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function fetchFamilyInfo(userId) {
    fetch(`https://info442.chiptang.com/lookup/family/info?familyId=${userId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('user_name').textContent = data.guardian_name;
            document.getElementById('user_name_nav').textContent = data.guardian_name;
            document.getElementById('user_id').textContent = userId;
            document.getElementById('phone').textContent = data.phone;
            document.getElementById('email').textContent = data.email;
        })
        .catch(error => console.error('Error fetching family info:', error));
}

function toggleView(activeViewId) {
    ['children_box', 'event_box', 'activity_box', 'check_in_box'].forEach(section => {
        document.getElementById(section).style.display = section === activeViewId ? 'block' : 'none';
    });
}

function fetchChildrenList(userId) {
    fetch(`https://info442.chiptang.com/lookup/family/child?familyId=${userId}`)
        .then(response => response.json())
        .then(childIds => {
            const childrenListDiv = document.getElementById('children_list');
            childrenListDiv.innerHTML = '';
            childIds.forEach(childId => {
                fetch(`https://info442.chiptang.com/lookup/child/info?childId=${childId}`)
                    .then(response => response.json())
                    .then(childInfo => {
                        const childElement = document.createElement('div');
                        childElement.className = 'info-div';
                        childElement.innerHTML = `
                        <strong>${childInfo.child_name}</strong> (ID ${childId})<br>
                        ${childInfo.child_remarks}<br>
                        `;
                        childrenListDiv.appendChild(childElement);
                    });
            });
        })
        .catch(error => console.error('Error fetching children:', error));
}

function fetchChildrenAndPopulateSelectors(userId) {
    fetch(`https://info442.chiptang.com/lookup/family/child?familyId=${userId}`)
        .then(response => response.json())
        .then(childIds => {
            const childrenListDiv = document.getElementById('children_list');
            childrenListDiv.innerHTML = '';
            ['event_child_selector', 'activity_child_selector', 'check_in_child_selector'].forEach(selectorId => {
                const selector = document.getElementById(selectorId);
                selector.innerHTML = '<option value="">Select a Child</option>';
                childIds.forEach(childId => {
                    fetch(`https://info442.chiptang.com/lookup/child/info?childId=${childId}`)
                        .then(response => response.json())
                        .then(childInfo => {
                            const option = new Option(childInfo.child_name, childId);
                            selector.add(option);
                        });
                });
            });
        })
        .catch(error => console.error('Error fetching children:', error));
}

function fetchEventsForChild() {
    const childId = document.getElementById('event_child_selector').value;
    fetch(`https://info442.chiptang.com/lookup/child/event?childId=${childId}`)
        .then(response => response.json())
        .then(events => {
            const eventsList = document.getElementById('events_list');
            eventsList.innerHTML = '';

            events.forEach(event => {
                fetch(`https://info442.chiptang.com/lookup/event/info?eventId=${event.event_id}`)
                    .then(response => response.json())
                    .then(eventInfo => {
                        eventInfo.forEach(info => {
                            fetch(`https://info442.chiptang.com/lookup/staff/info?staffId=${info.staff_id}`)
                                .then(response => response.json())
                                .then(staffInfo => {
                                    const eventElement = document.createElement('div');
                                    eventElement.className = 'info-div';
                                    eventElement.innerHTML = `
                                        <strong>${info.event_name}</strong> (ID ${event.event_id})<br>
                                        ${info.event_date}<br>
                                        ${info.event_description}<br>
                                        <br>
                                        <strong>${staffInfo.role}, ${staffInfo.name}</strong> (ID ${info.staff_id})<br>
                                        <a href="mailto:${staffInfo.email}">${staffInfo.email}</a>
                                        <a href="tel:${staffInfo.phone}">${staffInfo.phone}</a><br>
                                    `;
                                    eventsList.appendChild(eventElement);
                                })
                                .catch(error => console.error('Error fetching staff info:', error));
                        });
                    })
                    .catch(error => console.error('Error fetching event info:', error));
            });
        })
        .catch(error => console.error('Error fetching events for child:', error));
}



function fetchActivitiesForChild() {
    const childId = document.getElementById('activity_child_selector').value;
    fetch(`https://info442.chiptang.com/lookup/child/activity?childId=${childId}`)
        .then(response => response.json())
        .then(activities => {
            const activityList = document.getElementById('activity_list');
            activityList.innerHTML = '';

            activities.forEach(activity => {
                fetch(`https://info442.chiptang.com/lookup/event/info?eventId=${activity.event_id}`)
                    .then(response => response.json())
                    .then(eventInfo => {
                        const info = eventInfo[0];

                        let checkInDetailPromise;

                        if (activity.staff_id) {
                            checkInDetailPromise = fetch(`https://info442.chiptang.com/lookup/staff/info?staffId=${activity.staff_id}`)
                                .then(response => response.json())
                                .then(staffInfo => `Checked in by ${staffInfo.role}: ${staffInfo.name} (ID ${activity.staff_id})`);
                        } else if (activity.family_id) {
                            checkInDetailPromise = fetch(`https://info442.chiptang.com/lookup/family/info?familyId=${activity.family_id}`)
                                .then(response => response.json())
                                .then(familyInfo => `Checked in by Family: ${familyInfo.guardian_name} (ID ${activity.family_id})`);
                        }

                        checkInDetailPromise.then(checkInDetail => {
                            const activityElement = document.createElement('div');
                            activityElement.className = 'info-div';
                            activityElement.innerHTML = `
                                <strong>${checkInDetail}</strong><br>
                                <strong>Event Name:</strong> ${info.event_name} (ID ${activity.event_id})<br>
                                <strong>Location:</strong> ${activity.location}<br>
                                <strong>Date:</strong> ${activity.date}<br>
                                <strong>Time:</strong> ${activity.time}<br>
                            `;
                            activityList.appendChild(activityElement);
                        }).catch(error => console.error('Error fetching check-in info:', error));

                    }).catch(error => console.error('Error fetching event info:', error));
            });
        }).catch(error => console.error('Error fetching activities for child:', error));
}



function addChild(e) {
    e.preventDefault();
    const userId = getQueryParam('id');
    const name = document.getElementById('name').value;
    const remarks = document.getElementById('remarks').value;

    fetch('https://info442.chiptang.com/addchild/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childName: name, familyId: userId, remarks: remarks})
    })
    .then(response => response.ok ? response.json() : Promise.reject('Failed to add child'))
    .then(() => {
        alert('Child added successfully');
        document.getElementById('add_child_form').reset();
        document.getElementById('add_child_form').style.display = 'none';
        fetchChildrenAndPopulateSelectors();
        window.location.reload();
    })
    .catch(error => {
        console.error('Error adding child:', error);
        alert('Error adding child: ' + error);
    });
}

function updateEventOptionsForChild(childId) {
    const eventSelector = document.getElementById('check_in_event_selector');
    eventSelector.innerHTML = '<option value="">Select an Event</option>';

    fetch(`https://info442.chiptang.com/lookup/child/event?childId=${childId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(events => {
            events.forEach(event => {
                const option = new Option(event.event_name, event.event_id);
                eventSelector.add(option);
            });
        })
        .catch(error => {
            console.error('Error fetching events:', error);
        });
}

function checkInChild() {
    const userId = getQueryParam('id');
    const childId = document.getElementById('check_in_child_selector').value;
    const eventId = document.getElementById('check_in_event_selector').value;
    const locationId = document.getElementById('location').value;

    const now = new Date();

    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = now.toLocaleDateString('en-US', dateOptions);

    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const time = now.toLocaleTimeString('en-US', timeOptions);

    fetch('https://info442.chiptang.com/checkin/byparent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            childId: childId,
            eventId: eventId,
            date: date,
            time: time,
            location: locationId,
            familyId: userId
        })
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            return Promise.reject('Failed to check in child');
        }
    })
    .then(responseText => {
        alert('Child checked in successfully: ' + responseText);
    })
    .catch(error => {
        console.error('Error checking in child:', error);
        alert('Error checking in child: ' + error);
    });
}
