'use strict';

document.addEventListener('DOMContentLoaded', function() {
    const userId = getQueryParam('id');
    fetchStaffInfo(userId);
    fetchEventAndPopulateSelectors(userId);

    document.getElementById('event_view').addEventListener('click', () => toggleView('event_box'));
    document.getElementById('children_view').addEventListener('click', () => toggleView('children_box'));
    document.getElementById('activity_view').addEventListener('click', () => toggleView('activity_box'));
    document.getElementById('check_in_view').addEventListener('click', () => toggleView('check_in_box'));

    document.getElementById('event_view').addEventListener('click', () => {
        toggleView('event_box');
        const userId = getQueryParam('id');
        fetchEventList(userId);
    });

    //Create Event
    document.getElementById('create_event_button').addEventListener('click', () => {
        document.getElementById('create_event_form').style.display = 'block';
    });

    document.getElementById('hide_event_button').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('create_event_form').style.display = 'none';
    });

    document.getElementById('create_event_form').addEventListener('submit', addEvent);

    //Add Child to Event
    document.getElementById('add_child_button').addEventListener('click', () => {
        let eventId = document.getElementById('child_event_selector').value;
        if (eventId) {
            document.getElementById('add_child_form').style.display = 'block';
            fetchChildAndPopulateSelectors(eventId);
        }
    });

    // Hide the add child form and reset the child selector when cancel button is clicked
    document.getElementById('hide_child_button').addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission or any default action
        document.getElementById('add_child_form').style.display = 'none';
        document.getElementById('child_child_selector').value = '';
    });

    // Listener for form submission to add child to event
    document.getElementById('add_child_form').addEventListener('submit', addChild);



    document.getElementById('child_event_selector').addEventListener('change', fetchChildrenForEvent);

    //event selector
    document.getElementById('activity_event_selector').addEventListener('change', fetchActivitiesForEvent);

    //check in selector
    document.getElementById('check_in_event_selector').addEventListener('change', function() {
        updateChildOptionsForEvent(this.value);
    });

    document.getElementById('check_in_button').addEventListener('click', checkInChild);
});

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function fetchStaffInfo(userId) {
    fetch(`http://localhost:8000/lookup/staff/info?staffId=${userId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('user_name').textContent = data.name;
            document.getElementById('user_id').textContent = userId;
            document.getElementById('phone').textContent = data.phone;
            document.getElementById('email').textContent = data.email;
        })
        .catch(error => console.error('Error fetching staff info:', error));
}

function toggleView(activeViewId) {
    ['children_box', 'event_box', 'activity_box', 'check_in_box'].forEach(section => {
        document.getElementById(section).style.display = section === activeViewId ? 'block' : 'none';
    });
}

function fetchEventList(userId) {
    fetch(`http://localhost:8000/lookup/staff/event?staffId=${userId}`)
        .then(response => response.json())
        .then(eventIds => {
            const eventListDiv = document.getElementById('event_list');
            eventListDiv.innerHTML = '';
            eventIds.forEach(eventId => {
                fetch(`http://localhost:8000/lookup/event/info?eventId=${eventId}`)
                    .then(response => response.json())
                    .then(eventInfos => {
                        eventInfos.forEach(eventInfo => {
                            const eventElement = document.createElement('div');
                            eventElement.textContent = eventInfo.event_name;
                            eventElement.className = 'info-div';
                            eventListDiv.appendChild(eventElement);
                        });
                    })
                    .catch(error => console.error('Error fetching event info:', error));
            });
        })
        .catch(error => console.error('Error fetching events list:', error));
}


function fetchEventAndPopulateSelectors(userId) {
    fetch(`http://localhost:8000/lookup/staff/event?staffId=${userId}`)
        .then(response => response.json())
        .then(eventIds => {
            const eventListDiv = document.getElementById('event_list');
            eventListDiv.innerHTML = '';
            const selectors = ['child_event_selector', 'activity_event_selector', 'check_in_event_selector'].map(selectorId => document.getElementById(selectorId));
            selectors.forEach(selector => {
                selector.innerHTML = '<option value="">Select an Event</option>';
                eventIds.forEach(eventId => {
                    fetch(`http://localhost:8000/lookup/event/info?eventId=${eventId}`)
                        .then(response => response.json())
                        .then(eventInfos => {
                            eventInfos.forEach(eventInfo => {
                                const option = new Option(eventInfo.event_name, eventId);
                                selector.add(option);
                            });
                        })
                        .catch(error => console.error('Error fetching event info for event ID:', eventId, error));
                });
            });
        })
        .catch(error => console.error('Error fetching events:', error));
}


function fetchChildAndPopulateSelectors(eventId) {
    fetch(`http://localhost:8000/lookup/child/info?childId=all`)
        .then(response => response.json())
        .then(allChildren => {
            fetch(`http://localhost:8000/lookup/event/child?eventId=${eventId}`)
                .then(response => response.json())
                .then(childrenInEvent => {
                    const childrenInEventIds = new Set(childrenInEvent.map(child => child.child_id));
                    const childSelector = document.getElementById('child_child_selector');
                    childSelector.innerHTML = '<option value="">Select a Child</option>';

                    allChildren.forEach(child => {
                        if (!childrenInEventIds.has(child.child_id)) {
                            const optionText = `${child.child_id} - ${child.child_name}`;
                            const option = new Option(optionText, child.child_id);
                            childSelector.appendChild(option);
                        }
                    });
                })
                .catch(error => console.error('Failed to fetch children in the event:', error));
        })
        .catch(error => console.error('Failed to fetch all children:', error));
}


function fetchChildrenForEvent() {
    const eventId = document.getElementById('child_event_selector').value;
    fetch(`http://localhost:8000/lookup/event/child?eventId=${eventId}`)
        .then(response => response.json())
        .then(childrenIds => {
            const childrenList = document.getElementById('children_list');
            childrenList.innerHTML = '';

            childrenIds.forEach(childId => {
                fetch(`http://localhost:8000/lookup/child/info?childId=${childId}`)
                    .then(response => response.json())
                    .then(childInfo => {
                        fetch(`http://localhost:8000/lookup/child/family?childId=${childId}`)
                            .then(response => response.json())
                            .then(familyIds => {
                                familyIds.forEach(familyId => {
                                    fetch(`http://localhost:8000/lookup/family/info?familyId=${familyId}`)
                                        .then(response => response.json())
                                        .then(familyInfo => {
                                            const familyElement = document.createElement('div');
                                            familyElement.className = 'info-div';
                                            familyElement.innerHTML = `
                                                <strong>Child Name:</strong> ${childInfo.child_name}<br>
                                                <strong>Child Id:</strong> ${childId}<br> <!-- Correctly displaying child_id -->
                                                <strong>Guardian Name:</strong> ${familyInfo.guardian_name}<br>
                                                <strong>Email:</strong> ${familyInfo.email}<br>
                                                <strong>Phone:</strong> ${familyInfo.phone}<br>
                                            `;
                                            childrenList.appendChild(familyElement);
                                        })
                                        .catch(error => console.error('Error fetching family info:', error));
                                });
                            })
                            .catch(error => console.error('Error fetching family IDs:', error));
                    })
                    .catch(error => console.error('Error fetching child info:', error));
            });
        })
        .catch(error => console.error('Error fetching children for event:', error));
}

function fetchActivitiesForEvent() {
    const eventId = document.getElementById('activity_event_selector').value;
    fetch(`http://localhost:8000/lookup/event/activity?eventId=${eventId}`)
        .then(response => response.json())
        .then(activities => {
            const activitiesList = document.getElementById('activity_list');
            activitiesList.innerHTML = '';

            activities.forEach(activity => {
                fetch(`http://localhost:8000/lookup/child/info?childId=${activity.child_id}`)
                    .then(response => response.json())
                    .then(childInfo => {
                        const activityElement = document.createElement('div');
                        activityElement.className = 'info-div';
                        let checkInByInfo = '';

                        if (activity.staff_id) {
                            fetch(`http://localhost:8000/lookup/staff/info?staffId=${activity.staff_id}`)
                                .then(response => response.json())
                                .then(staffInfo => {
                                    checkInByInfo = `Check-in by Staff: ${staffInfo.name}`;
                                    updateActivityElement(activity, childInfo, activityElement, checkInByInfo);
                                });
                        } else if (activity.family_id) {
                            fetch(`http://localhost:8000/lookup/family/info?familyId=${activity.family_id}`)
                                .then(response => response.json())
                                .then(familyInfo => {
                                    checkInByInfo = `Check-in by Family: ${familyInfo.guardian_name}`;
                                    updateActivityElement(activity, childInfo, activityElement, checkInByInfo);
                                });
                        }
                    })
                    .catch(error => console.error('Error fetching child info:', error));
            });
        })
        .catch(error => console.error('Error fetching activities for event:', error));
}

function updateActivityElement(activity, childInfo, element, checkInByInfo) {
    element.innerHTML = `
        <strong>${checkInByInfo}</strong><br>
        <strong>Child Name:</strong> ${childInfo.child_name}<br>
        <strong>Child ID:</strong> ${activity.child_id}<br>
        <strong>Location:</strong> ${activity.location}<br>
        <strong>Date:</strong> ${activity.date}<br>
        <strong>Time:</strong> ${activity.time}<br>
    `;
    document.getElementById('activity_list').appendChild(element);
}


function addEvent(e) {
    e.preventDefault();
    const userId = getQueryParam('id');
    const name = document.getElementById('name').value;

    fetch('http://localhost:8000/create/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, staffId: userId })
    })
    .then(response => response.ok ? response.json() : Promise.reject('Failed to create event'))
    .then(() => {
        alert('Event created successfully');
        document.getElementById('create_event_form').reset();
        document.getElementById('create_event_form').style.display = 'none';
        fetchEventAndPopulateSelectors();
        window.location.reload();
    })
    .catch(error => {
        console.error('Error creating event:', error);
        alert('Error creatiing event: ' + error);
    });
}

function addChild(e) {
    e.preventDefault();
    const eventId = document.getElementById('child_event_selector').value;
    const childId = document.getElementById('child_child_selector').value;

    fetch('http://localhost:8000/addchild/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: eventId, childId: childId })
    })
    .then(response => {
        if (!response.ok) {
            return Promise.reject('Failed to add child');
        }
        return response.text();
    })
    .then(text => {
        console.log(text);
        alert('Child added successfully');
        document.getElementById('child_child_selector').value = '';
        document.getElementById('add_child_form').style.display = 'none';
    })
    .catch(error => {
        console.error('Error adding child:', error);
        alert('Error adding child: ' + error);
    });
}


function updateChildOptionsForEvent(eventId) {
    const childSelector = document.getElementById('check_in_child_selector');
    childSelector.innerHTML = '<option value="">Select a Child</option>';

    fetch(`http://localhost:8000/lookup/event/child?eventId=${eventId}`)
        .then(response => response.json())
        .then(childIds => {
            childIds.forEach(childId => {
                fetch(`http://localhost:8000/lookup/child/info?childId=${childId}`)
                    .then(response => response.json())
                    .then(childInfo => {
                        const optionText = `${childId} - ${childInfo.child_name}`;
                        const option = new Option(optionText, childId);
                        childSelector.appendChild(option);
                    })
                    .catch(error => console.error('Error fetching child info:', error));
            });
        })
        .catch(error => console.error('Error fetching children for event:', error));
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

    fetch('http://localhost:8000/checkin/bystaff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            childId: childId,
            eventId: eventId,
            date: date,
            time: time,
            location: locationId,
            staffId: userId
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

