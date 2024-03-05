# API Documentation
##Last Updated Mar 5

## Host this API server locally
`cd ~/my-app`
change directory to my-app

`npm init -y`
set up node

`npm install express sqlite3 sqlite cors`
install additional dependencies

`node server.js`
run node server

base url local: "http://localhost:8000" + request

### Optional Tools
- Thunder Client in VS Code
- DB Browser for SQLite


## Connect to Web API
base url: "https://info442.chiptang.com" + request


## 1. Create Family
- **Request URL:** `/create/family`
- **Request Format:** JSON
- **Request Type:** POST
- **Description:** Adds a new family to the database, including guardian's name, email, phone number, and password.
- **Example Request:**
```
JSON
{
  "name": "Hung Tran",
  "email": "hung@test.com",
  "phone": "4251234321",
  "password": "password"
}
```

- **Example Response:**
```
JSON
{
  "familyId": 2
}
```

- **Error Handling:**
  - Returns 400 if required data is missing.
  - Returns 404 if email or phone already exists.
  - Returns 500 for internal server errors.


## 2. Family Login
- **Request URL:** `/login/family`
- **Request Format:** JSON
- **Request Type:** POST
- **Description:** Guardian Login with either email or phone as credential, and password.
- **Example Request:**
```
JSON
{
  "credential": "hung@test.com",
  "password": "password"
}
or
{
  "credential": "4251234321",
  "password": "password"
}
```


- **Example Response:**
```
JSON
{
  "message": "Login successful",
  "familyId": 1
}
```

- **Error Handling:**
  - Returns 400 if required data is missing.
  - Returns 404 if login failed: user not found or password incorrect.
  - Returns 500 for internal server errors.


## 3. Add Child to Family
- **Request URL:** `/addchild/family`
- **Request Format:** JSON
- **Request Type:** POST
- **Description:** Links a child with a family by inserting a new child and updating the family_link table.
- **Example Request:**
```
JSON
{
  "childName": "Daisy Tran",
  "familyId": 2,
  "remarks": "Lactose intolerant: No dairy products; lactose-free alternatives needed"
}
```

- **Example Response:**
```
JSON
{
  "childId": 4
}
```

- **Error Handling:**
  - Returns 404 if family ID does not exist or data is missing.
  - Returns 500 for internal errors.


## 4. Create Staff
- **Request URL:** `/create/staff`
- **Request Format:** JSON
- **Request Type:** POST
- **Description:** Adds a new staff member to the database.
- **Example Request:**
```
JSON
{
  "name": "Chip",
  "email": "chip@test.com",
  "phone": "2067654321",
  "password": "password",
  "role": "Camp Counselor"
}
```

- **Example Response:**
```
JSON
{
  "staffId": 1
}
```

- **Error Handling:**
  - Returns 400 if required data is missing.
  - Returns 404 if email or phone already exists.
  - Returns 500 for other errors.


## 5. Staff Login
- **Request URL:** `/login/staff`
- **Request Format:** JSON
- **Request Type:** POST
- **Dcription:** Staff Login with either email or phone as credential, and password.
- **Example Request:**
```
JSON
{
  "credential": "chip@test.com",
  "password": "password"
}
or
{
  "credential": "2067654321",
  "password": "password"
}
```

- **Example Response:**
```
JSON
{
  "message": "Login successful",
  "staffId": 1
}
```

- **Error Handling:**
  - Returns 400 if required data is missing.
  - Returns 404 if login failed: user not found or password incorrect.
  - Returns 500 for internal server errors.


## 6. Create Event
- **Request URL:** `/create/event`
- **Request Format:** JSON
- **Request Type:** POST
- **Dcription:** Creates a new event and associates it with a staff member.
- **Example Request:**
```
JSON
{
  "name": "Wildlife Safari Day",
  "staffId": 1,
  "description": "A day trip for campers aged 7-13 to the local wildlife park. Includes guided tours, animal encounters, and educational talks on conservation efforts. Don’t forget your binoculars!",
  "date": "2024-03-04"
}
```

- **Example Response:**
```
JSON
{
  "eventId": 10
}
```

- **Error Handling:**
  - Returns 400 for missing data.
  - Returns 404 if staff ID does not exist or event already exists.
  - Returns 500 for internal server errors.


## 7. Add Child to Event
- **Request URL:** `/addchild/event`
- **Request Format:** JSON
- **Request Type:** POST
- **Dcription:** Links a child to an event.
- **Example Request:**
```
JSON
{
  "eventId": 10,
  "childId": 7
}
```

- **Example Response:**
```
JSON
{
  "message": "Child successfully added to event."
}
```

- **Error Handling:**
  - Returns 400 for missing data.
  - Returns 404 if event or child ID does not exist.
  - Returns 500 for internal server errors.


## 8. Check-in by Parent
- **Request URL:** `/checkin/byparent`
- **Request Format:** JSON
- **Request Type:** POST
- **Dcription:** Records a child's check-in to an event by a parent, including date, time, and location.
- **Example Request:**
```
JSON
{
  "childId": 4,
  "eventId": 15,
  "date": "Feb 24, 2024",
  "time": "9:31 AM",
  "location": "Bus Pick Up",
  "familyId": 2
}
```

- **Example Response:**
```
JSON
{
  "message": "Child successfully checked in to event by parent."
}
```

- **Error Handling:**
  - Returns 400 for missing data.
  - Returns 404 if child, event, or family ID does not exist.
  - Returns 500 for internal errors.


## 9. Check-in By Staff
- **Request URL:** `/checkin/bystaff`
- **Request Format:** JSON
- **Request Type:** POST
- **Dcription:** Allows staff to check in a child for an event by submitting the necessary details.
- **Example Request:**
```
JSON
{
  "childId": 9,
  "eventId": 10,
  "date": "Feb 24, 2024",
  "time": "9:26 AM",
  "location": "Playground",
  "staffId": 3
}
```

- **Example Response:**
"Child successfully checked in to event by staff."

- **Error Handling:**
  - Returns 400 for missing data.
  - Returns 404 for non-existent IDs.
  - Returns 500 for server errors.


## 10. Create Bulletin
- **Request URL:** `/create/bulletin`
- **Request Format:** JSON
- **Request Type:** POST
- **Dcription:** Allows staff to post message on bulletin board.
- **Example Request:**
```
JSON
{
    "staffId": 1,
    "message": "Our camp will be hosting a Family Day this summer. Parents and siblings are invited to join us for a day of fun activities, performances, and a picnic lunch"
}
```

- **Example Response:**
"Bulletin message successfully posted."

- **Error Handling:**
  - Returns 400 for missing data.
  - Returns 404 for non-existent IDs.
  - Returns 500 for server errors.


## 11. Lookup Family's Children
- **Request URL:** `/lookup/family/child`
- **Request Format:** Query Parameters
- **Request Type:** GET
- **Dcription:** Retrieves the IDs of all children associated with a given family ID.
- **Example Request:**
```
GET
/lookup/family/child?familyId=2
```

- **Example Response:**
```
[
  4,
  5,
  6,
  7
]
```

- **Error Handling:**
  - Returns 400 for invalid queries.
  - Returns 500 for server errors.


## 12. Lookup Family Info
- **Request URL:** `/lookup/family/info`
- **Request Format:** Query Parameters
- **Request Type:** GET
- **Dcription:** Retrieves the information of a guardian based on the family ID.
- **Example Request:**
```
GET
/lookup/family/info?familyId=2
```

- **Example Response:**
```
JSON
{
  "guardian_name": "Hung Tran",
  "email": "hung@test.com",
  "phone": "4251234321"
}
```

- **Error Handling:**
  - Returns 400 for invalid queries.
  - Returns 404 for non-existent family.
  - Returns 500 for server errors.


## 13. Lookup Child's Events
- **Request URL:** `/lookup/child/event`
- **Request Format:** Query Parameters
- **Request Type:** GET
- **Dcription:** Retrieves all events a child is linked to.
- **Example Request:**
```
GET
/lookup/child/event?childId=4
```

- **Example Response:**
```
JSON
[
  {
    "event_name": "Junior Chef Cook-off",
    "event_id": 4
  },
  {
    "event_name": "Superhero Training Camp",
    "event_id": 15
  },
  {
    "event_name": "Robotics and Coding Camp",
    "event_id": 5
  },
  {
    "event_name": "Adventure Sports Day",
    "event_id": 6
  }
]
```

- **Error Handling:**
  - Returns 400 for invalid queries.
  - Returns 500 for server errors.


## 14. Child Information Lookup
- **Request URL:** `/lookup/child/info`
- **Request Format:** Query Parameters
- **Request Type:** GET
- **Dcription:** Retrieves information about children. This endpoint can be used to fetch the name of a specific child based on a provided child ID, or to retrieve names and IDs for all children when provided with a special value for childId.
- **Example Request:**
  - ***specific Child***
```
GET 
/lookup/child/info?childId=4
```

  - ***All Children***
```
GET
/lookup/child/info?childId=all
```

- **Example Response:**
  - ***specific Child***
```
{
  "child_name": "Daisy Tran",
  "child_remarks": "Lactose intolerant: No dairy products; lactose-free alternatives needed."
}
```
  - ***All Children***
```
{
    "child_id": 1,
    "child_name": "Adam Baghdasaryan",
    "child_remarks": "Allergic to peanuts: Carries EpiPen."
  },
  {
    "child_id": 2,
    "child_name": "Bella Baghdasaryan",
    "child_remarks": "Asthma: Uses an inhaler; avoid vigorous activities on high pollen days."
  },
  {
    "child_id": 3,
    "child_name": "Charlie Baghdasaryan",
    "child_remarks": "Gluten intolerance: Requires gluten-free meals and snacks."
  },
  {
    "child_id": 4,
    "child_name": "Daisy Tran",
    "child_remarks": "Lactose intolerant: No dairy products; lactose-free alternatives needed."
  },
  ...
]
```

- **Error Handling:**
  - Returns 400 Bad Request if the childId parameter is missing or invalid.
  - Returns 404 Not Found if no child is found with the given ID.
  - Returns 500 Internal Server Error for any server-side issues.


## 15. Lookup Children's Family
- **Request URL:** `/lookup/child/family`
- **Request Format:** Query Parameters
- **Request Type:** GET
- **Dcription:** Retrieves the IDs of all families associated with a given child ID.
- **Example Request:**
```
GET
/lookup/child/family?childId=4
```

- **Example Response:**
```
[
  2
]
```

- **Error Handling:**
  - Returns 400 for invalid queries.
  - Returns 500 for server errors.


## 16. Child Activity Lookup
- **Request URL:** `/lookup/child/activity`
- **Request Format:** Query Parameters
- **Request Type:** GET
- **Dcription:** Retrieves a list of activities for a specified child, including event ID, date, time, location, staff ID, and family ID.
- **Example Request:**
```
GET
/lookup/child/activity?childId=4
```

- **Example Response:**
```
JSON

[
  {
    "event_id": 4,
    "date": "Feb 24, 2024",
    "time": "9:22 AM",
    "location": "School",
    "staff_id": 5,
    "family_id": null
  },
  {
    "event_id": 15,
    "date": "Feb 24, 2024",
    "time": "9:31 AM",
    "location": "Bus",
    "staff_id": 5,
    "family_id": null
  },
  {
    "event_id": 4,
    "date": "Feb 24, 2024",
    "time": "9:22 AM",
    "location": "School Drop Off",
    "staff_id": null,
    "family_id": 2
  },
  {
    "event_id": 15,
    "date": "Feb 24, 2024",
    "time": "9:31 AM",
    "location": "Bus Pick Up",
    "staff_id": null,
    "family_id": 2
  }
]

```

- **Error Handling:**
  - Returns 400 Bad Request if the childId parameter is missing or invalid.
  - Returns 500 Internal Server Error for any server-side issues.


## 17. Staff Information Lookup
- **Request URL:** `/lookup/staff/info`
- **Request Format:** Query Parameters
- **Request Type:** GET
- **Dcription:** Retrieves information about a specific staff member or all staff members from the database.
- **Example Request:**
  - ***specific staff***
```
GET
/lookup/staff/info?staffId=1
```

  - ***all staff***
```
GET
/lookup/staff/info?staffId=all
```

- **Example Response:**
  - ***specific staff***
```
JSON
{
  "name": "Chip",
  "email": "chip@test.com",
  "phone": 2067654321,
  "role": "Camp Counselor"
}
```

  - ***all staff***
```
[
  {
    "staff_id": 1,
    "name": "Chip",
    "email": "chip@test.com",
    "phone": 2067654321,
    "role": "Camp Counselor"
  },
  {
    "staff_id": 2,
    "name": "Josh",
    "email": "josh@test.com",
    "phone": 4257654321,
    "role": "Camp Counselor"
  },
  {
    "staff_id": 3,
    "name": "Eric",
    "email": "eric@test.com",
    "phone": 3607654321,
    "role": "Camp Counselor"
  },
  ...
]
```

- **Error Handling:**
  - Returns 400 Bad Request if the staffId parameter is missing or invalid.
  - Returns 404 Not Found if no staff is found with the given ID.
  - Returns 500 Internal Server Error for any server-side issues.


## 18. Staff's Event Lookup
- **Request URL:** `/lookup/staff/event`
- **Request Format:** Query Parameters
- **Request Type:** GET
- **Dcription:** Retrieves a list of event IDs that a staff member is associated with, based on a provided staff ID.
- **Example Request:**
```
GET
/lookup/staff/event?staffId=1
```

- **Example Response:**
```
[
  10,
  11,
  21,
  22
]
```

- **Error Handling:**
  - Returns 400 Bad Request if the staffId parameter is missing or invalid.
  - Returns 500 Internal Server Error for any server-side issues.


## 19. Event's Children Lookup
- **Request URL:** `/lookup/event/child`
- **Request Format:** Query Parameters
- **Request Type:** GET
- **Dcription:** Retrieves a list of child IDs that are linked to a specified event, based on a provided event ID.
- **Example Request:**
```
GET
/lookup/event/child?eventId=10
```

- **Example Response:**
```
[
  9,
  8,
  7
]
```

- **Error Handling:**
  - Returns 400 Bad Request if the eventId parameter is missing or invalid.
  - Returns 500 Internal Server Error for any server-side issues.


## 20. Event's Info Lookup
- **Request URL:** `/lookup/event/info`
- **Request Format:** Query Parameters
- **Request Type:** GET
- **Dcription:** Retrieves a list of event info, or a single event info based on a provided event ID.
- **Example Request:**
  - ***Single Event***
```
GET
/lookup/event/info?eventId=10
```

  - ***All Events***
```
GET
/lookup/event/info?eventId=all
```

- **Example Response:**
  - ***Specific Event***
```
JSON
[
  {
    "event_name": "Wildlife Safari Day",
    "staff_id": 1,
    "event_description": "A day trip for campers aged 7-13 to the local wildlife park. Includes guided tours, animal encounters, and educational talks on conservation efforts. Don’t forget your binoculars!",
    "event_date": "2024-03-04"
  }
]

```

  - ***all Events***
```
[
  {
    "event_id": 22,
    "event_name": "Inventors and Makers Camp",
    "staff_id": 1,
    "event_description": "Designed for curious minds aged 9-15, this camp encourages innovation through science experiments, engineering challenges, and DIY projects, with a showcase of inventions at the end of the session.",
    "event_date": "2024-03-12"
  },
  {
    "event_id": 20,
    "event_name": "Staff Meeting",
    "staff_id": 6,
    "event_description": "Staff Meeting: Week 2 of March",
    "event_date": "2024-03-11"
  },
  ...
]
```

- **Error Handling:**
  - Returns 400 Bad Request if the eventId parameter is missing or invalid.
  - Returns 500 Internal Server Error for any server-side issues.


## 21. Event Activity Lookup
- **Request URL:** `/lookup/event/activity`
- **Request Format:** Query Parameters
- **Request Type:** GET
- **Dcription:** Retrieves a list of activities for a specified event, including child ID, date, time, location, staff ID, and family ID.
- **Example Request:**
```
GET
/lookup/event/activity?eventId=10
```

- **Example Response:**
JSON
```
[
  {
    "child_id": 9,
    "date": "Feb 24, 2024",
    "time": "9:26 AM",
    "location": "Bus",
    "staff_id": 1,
    "family_id": null
  },
  {
    "child_id": 9,
    "date": "Feb 24, 2024",
    "time": "9:26 AM",
    "location": "Bus Pick Up",
    "staff_id": null,
    "family_id": 3
  }
]
```

- **Error Handling:**
  - Returns 400 Bad Request if the childId parameter is missing or invalid.
  - Returns 500 Internal Server Error for any server-side issues.


## 22. Bulletin Message Lookup
- **Request URL:** `/lookup/bulletin`
- **Request Format:** Query Parameters
- **Request Type:** GET
- **Dcription:** Retrieves all bulletin messages, or messages made by a specific staff.
- **Example Request:**
  - ***Bulletin by a specific staff***
```
GET
/lookup/bulletin?staffId=1
```

  - ***All Bulletins***
```
GET
/lookup/bulletin?staffId=all
```

- **Example Response:**
  - ***Bulletin(s) by a specific staff***
```
[
  {
    "bulletin_id": 2,
    "staff_id": 1,
    "message": "Our camp will be hosting a Family Day this summer. Parents and siblings are invited to join us for a day of fun activities, performances, and a picnic lunch."
  },
  {
    "bulletin_id": 1,
    "staff_id": 1,
    "message": "Attention all camp staff and parents: Due to the forecasted rain tomorrow, all outdoor activities will be moved indoors. Please ensure children come prepared with appropriate indoor shoes and activities. We appreciate your cooperation and look forward to a fun-filled day indoors!"
  }
]
```

  - ***All Bulletins***
```
[
  {
    "bulletin_id": 4,
    "staff_id": 3,
    "message": "We're looking for enthusiastic volunteers to help with our upcoming camp carnival! If you're interested in helping out with games, food stations, or setup and cleanup. Volunteers make our events possible, and we'd love to have you join our team for this exciting event."
  },
  {
    "bulletin_id": 3,
    "staff_id": 2,
    "message": "A friendly reminder to all campers and staff: if you've lost any personal items, please check our Lost and Found located at the camp office. We currently have several unclaimed items, including water bottles, hats, and a pair of glasses. Items not claimed by the end of the month will be donated to a local charity."
  },
  {
    "bulletin_id": 2,
    "staff_id": 1,
    "message": "Our camp will be hosting a Family Day this summer. Parents and siblings are invited to join us for a day of fun activities, performances, and a picnic lunch."
  },
  ...
]
```

- **Error Handling:**
  - Returns 400 Bad Request if the staffId parameter is missing or invalid.
  - Returns 500 Internal Server Error for any server-side issues.