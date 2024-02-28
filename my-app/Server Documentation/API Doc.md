# API Documentation
##Last Updated Feb 26

## Host your server locally
cd to this folder

`npm init -y`
leave everything at sefault

`npm install express sqlite3 sqlite cors`
install additional libraries

`node server.js`
run server

base url local: "http://localhost:8000" + request

Optional Tools
- Thunder Client in VS Code
- DB Browser for SQLite


## Connect to web API
base url: "info442.chiptang.com" + request


## 1. Create Family
**Request URL:** /create/family
**Request Format:** JSON
**Request Type:** POST
**Description:** Adds a new family to the database, including guardian's name, email, phone number, and password.
**Example Request:**
JSON
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "password": "password"
}

**Example Response:**
JSON
{
  "familyId": 1
}

**Error Handling:**
Returns 400 if required data is missing.
Returns 404 if email or phone already exists.
Returns 500 for internal server errors.


## 2. Family Login
**Request URL:** /login/family
**Request Format:** JSON
**Request Type:** POST
**Description:** Guardian Login with either email or phone as credential, and password.
**Example Request:**
JSON
{
  "credential": "john.doe@example.com",
  "password": "password"
}

**Example Response:**
JSON
{
  "message": "Login successful",
  "familyId": 1
}

**Error Handling:**
Returns 400 if required data is missing.
Returns 404 if login failed: user not found or password incorrect.
Returns 500 for internal server errors.


## 3. Add Child to Family
**Request URL:** /addchild/family
**Request Format:** JSON
**Request Type:** POST
**Description:** Links a child with a family by inserting a new child and updating the family_link table.
**Example Request:**
JSON
{
  "childName": "Jane Doe",
  "familyId": 1,
  "remarks": "Jane is allergic to cats"
}

**Example Response:**
JSON
{
  "childId": 1
}

**Error Handling:**
Returns 404 if family ID does not exist or data is missing.
Returns 500 for internal errors.


## 4. Create Staff
**Request URL:** /create/staff
**Request Format:** JSON
**Request Type:** POST
**Description:** Adds a new staff member to the database.
**Example Request:**
JSON
{
  "name": "Alice Smith",
  "email": "alice.smith@example.com",
  "phone": "0987654321",
  "password": "password"
}

**Example Response:**
JSON
{
  "staffId": 1
}

**Error Handling:**
Returns 400 if required data is missing.
Returns 404 if email or phone already exists.
Returns 500 for other errors.


## 5. Staff Login
**Request URL:** /login/staff
**Request Format:** JSON
**Request Type:** POST
**Description:** Staff Login with either email or phone as credential, and password.
**Example Request:**
JSON
{
  "credential": "john.doe@example.com",
  "password": "password"
}

**Example Response:**
JSON
{
  "message": "Login successful",
  "staffId": 1
}

**Error Handling:**
Returns 400 if required data is missing.
Returns 404 if login failed: user not found or password incorrect.
Returns 500 for internal server errors.


## 6. Create Event
**Request URL:** /create/event
**Request Format:** JSON
**Request Type:** POST
**Description:** Creates a new event and associates it with a staff member.
**Example Request:**
JSON
{
  "name": "Summer Camp",
  "staffId": 1,
  "description": "Summer Camp Description",
  "date": "2024-02-28"
}

**Example Response:**
JSON
{
  "eventId": 1
}

**Error Handling:**
Returns 400 for missing data.
Returns 404 if staff ID does not exist or event already exists.
Returns 500 for internal server errors.


## 7. Add Child to Event
**Request URL:** /addchild/event
**Request Format:** JSON
**Request Type:** POST
**Description:** Links a child to an event.
**Example Request:**
JSON
{
  "eventId": 1,
  "childId": 1
}

**Example Response:**
JSON
{
  "message": "Child successfully added to event."
}

**Error Handling:**
Returns 400 for missing data.
Returns 404 if event or child ID does not exist.
Returns 500 for internal server errors.


## 8. Check-in by Parent
**Request URL:** /checkin/byparent
**Request Format:** JSON
**Request Type:** POST
**Description:** Records a child's check-in to an event by a parent, including date, time, and location.
**Example Request:**
JSON
{
  "childId": 1,
  "eventId": 1,
  "date": "20240217",
  "time": "1000",
  "location": "Main Hall",
  "familyId": 1
}

**Example Response:**
JSON
{
  "message": "Child successfully checked in to event by parent."
}

**Error Handling:**
Returns 400 for missing data.
Returns 404 if child, event, or family ID does not exist.
Returns 500 for internal errors.


## 9. Check-in By Staff
**Request URL:** /checkin/bystaff
**Request Format:** JSON
**Request Type:** POST
**Description:** Allows staff to check in a child for an event by submitting the necessary details.
**Example Request:**
JSON
{
  "childId": 1,
  "eventId": 2,
  "date": 20230217,
  "time": 1300,
  "location": "Playground",
  "staffId": 3
}

**Example Response:**
"Child successfully checked in to event by staff."

**Error Handling:**
Returns 400 for missing data.
Returns 404 for non-existent IDs.
Returns 500 for server errors.


## 10. Create Bulletin
**Request URL:** /create/bulletin
**Request Format:** JSON
**Request Type:** POST
**Description:** Allows staff to post message on bulletin board.
**Example Request:**
JSON
{
    "staffId": 1,
    "message": "this is a message"
}

**Example Response:**
"Bulletin message successfully posted."

**Error Handling:**
Returns 400 for missing data.
Returns 404 for non-existent IDs.
Returns 500 for server errors.


## 11. Lookup Family's Children
**Request URL:** /lookup/family/child
**Request Format:** Query Parameters
**Request Type:** GET
**Description:** Retrieves the IDs of all children associated with a given family ID.
**Example Request:**
/lookup/family/child?familyId=1

**Example Response:**
JSON
[1, 2, 3]

**Error Handling:**
Returns 400 for invalid queries.
Returns 500 for server errors.


## 12. Lookup Family Info
**Request URL:** /lookup/family/info
**Request Format:** Query Parameters
**Request Type:** GET
**Description:** Retrieves the information of a guardian based on the family ID.
**Example Request:**
/lookup/family/info?familyId=1

**Example Response:**
JSON
{
  "guardian_name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890"
}

**Error Handling:**
Returns 400 for invalid queries.
Returns 404 for non-existent family.
Returns 500 for server errors.


## 13. Lookup Child's Events
**Request URL:** /lookup/child/event
**Request Format:** Query Parameters
**Request Type:** GET
**Description:** Retrieves all events a child is linked to.
**Example Request:**
/lookup/child/event?childId=1

**Example Response:**
JSON

[
  {
    "event_name": "Art Class",
    "eventId": 2
  },
  {
    "event_name": "Music Lesson",
    "eventId": 3
  }
]

**Error Handling:**
Returns 400 for invalid queries.
Returns 500 for server errors.


## 14. Child Information Lookup
**Request URL:** /lookup/child/info
**Request Format:** Query Parameters
**Request Type:** GET
**Description:** Retrieves information about children. This endpoint can be used to fetch the name of a specific child based on a provided child ID, or to retrieve names and IDs for all children when provided with a special value for childId.
**Example Request:**
***specific Child***
GET /lookup/child/info?childId=1

***All Children***
GET /lookup/child/info?childId=all

**Example Response:**
***specific Child***
{
  "child_name": "John Doe"
}
***All Children***
[
  {
    "child_id": 1,
    "child_name": "John Doe"
  },
  {
    "child_id": 2,
    "child_name": "Jane Doe"
  },
  ...
]

**Error Handling:**
Returns 400 Bad Request if the childId parameter is missing or invalid.
Returns 404 Not Found if no child is found with the given ID.
Returns 500 Internal Server Error for any server-side issues.


## 15. Lookup Children's Family
**Request URL:** /lookup/child/family
**Request Format:** Query Parameters
**Request Type:** GET
**Description:** Retrieves the IDs of all families associated with a given child ID.
**Example Request:**
/lookup/child/family?childId=1

**Example Response:**
JSON
[1, 2, 3]

**Error Handling:**
Returns 400 for invalid queries.
Returns 500 for server errors.


## 16. Child Activity Lookup
**Request URL:** /lookup/child/activity
**Request Format:** Query Parameters
**Request Type:** GET
**Description:** Retrieves a list of activities for a specified child, including event ID, date, time, location, staff ID, and family ID.
**Example Request:**
GET /lookup/child/activity?childId=2

**Example Response:**
JSON

[
  {
    "event_id": 3,
    "date": Feb 24, 2024,
    "time": 12:26 AM,
    "location": "Park",
    "staff_id": 1,
    "family_id": 2
  }
]

**Error Handling:**
Returns 400 Bad Request if the childId parameter is missing or invalid.
Returns 500 Internal Server Error for any server-side issues.


## 17. Staff Information Lookup
**Request URL:** /lookup/staff/info
**Request Format:** Query Parameters
**Request Type:** GET
**Description:** Retrieves information about a specific staff member or all staff members from the database.
**Example Request:**
***specific staff***
GET /lookup/staff/info?staffId=1

***all staff***
GET /lookup/staff/info?staffId=all

**Example Response:**
***specific staff***
JSON
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "1234567890"
}

***all staff***
[
  {
    "staff_id": 1,
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "123-456-7890"
  },
  {
    "staff_id": 2,
    "name": "Jane Smith",
    "email": "janesmith@example.com",
    "phone": "098-765-4321"
  }
]

**Error Handling:**
Returns 400 Bad Request if the staffId parameter is missing or invalid.
Returns 404 Not Found if no staff is found with the given ID.
Returns 500 Internal Server Error for any server-side issues.


## 18. Staff's Event Lookup
**Request URL:** /lookup/staff/event
**Request Format:** Query Parameters
**Request Type:** GET
**Description:** Retrieves a list of event IDs that a staff member is associated with, based on a provided staff ID.
**Example Request:**
GET /lookup/staff/event?staffId=1

**Example Response:**
JSON
[1, 2, 3]

**Error Handling:**
Returns 400 Bad Request if the staffId parameter is missing or invalid.
Returns 500 Internal Server Error for any server-side issues.


## 19. Event's Children Lookup
**Request URL:** /lookup/event/child
**Request Format:** Query Parameters
**Request Type:** GET
**Description:** Retrieves a list of child IDs that are linked to a specified event, based on a provided event ID.
**Example Request:**
GET /lookup/event?eventId=3

**Example Response:**
JSON
[1, 2, 3]

**Error Handling:**
Returns 400 Bad Request if the eventId parameter is missing or invalid.
Returns 500 Internal Server Error for any server-side issues.


## 20. Event's Info Lookup
**Request URL:** /lookup/event/info
**Request Format:** Query Parameters
**Request Type:** GET
**Description:** Retrieves a list of event info, or a single event info based on a provided event ID.
**Example Request:**
***All Events***
GET /lookup/event/info?eventId=all

***Single Event***
GET /lookup/event/info?eventId=3

**Example Response:**
***all Event***
[
  {
    "event_name": "event1",
    "staff_id": 1,
    "event_description": "Place holder",
    "event_date": "2024-02-28"
  }
  {
    "event_name": "event2",
    "staff_id": 1,
    "event_description": "Place holder",
    "event_date": "2024-02-28"
  }
]

***Single Event***
JSON
[
  {
    "event_name": "event1",
    "staff_id": 1,
    "event_description": "Place holder",
    "event_date": "2024-02-28"
  }
]

**Error Handling:**
Returns 400 Bad Request if the eventId parameter is missing or invalid.
Returns 500 Internal Server Error for any server-side issues.


## 21. Event Activity Lookup
**Request URL:** /lookup/event/activity
**Request Format:** Query Parameters
**Request Type:** GET
**Description:** Retrieves a list of activities for a specified event, including child ID, date, time, location, staff ID, and family ID.
**Example Request:**
GET /lookup/event/activity?eventId=2

**Example Response:**
JSON

[
  {
    "child_id": 3,
    "date": Feb 24, 2024,
    "time": 12:26 AM,
    "location": "Park",
    "staff_id": 1,
    "family_id": 2
  }
]

**Error Handling:**
Returns 400 Bad Request if the childId parameter is missing or invalid.
Returns 500 Internal Server Error for any server-side issues.


## 22. Bulletin Message Lookup
**Request URL:** /lookup/bulletin
**Request Format:** Query Parameters
**Request Type:** GET
**Description:** Retrieves all bulletin messages, or messages made by a specific staff.
**Example Request:**
***All Events***
/lookup/bulletin?staffId=all

***Single Event***
/lookup/bulletin?staffId=1

**Example Response:**
[
  {
    "bulletin_id": 3,
    "staff_id": 1,
    "message": "this is a message"
  },
  {
    "bulletin_id": 1,
    "staff_id": 1,
    "message": "this is a message"
  }
]

**Error Handling:**
Returns 400 Bad Request if the staffId parameter is missing or invalid.
Returns 500 Internal Server Error for any server-side issues.