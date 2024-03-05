# Testing Protocol Documentation

## 1. API Testing
- Testing all API functionalities ensures that requests are correctly processed, responses are accurate, and the database accurately reflects changes.

### Tools
- Thunder Client: Used for sending GET and POST requests to API endpoints.
- DB Browser: Used for inspecting the database to ensure correct data recording and retrieval.
- API Documentation: Referenced to ensure adherence to specified request formats, response structures, and error handling protocols.

### Testing POST Requests**
For each POST endpoint described in the API documentation:

**Prepare the Request:**
- Construct a POST request in Thunder Client with the correct URL as specified in the API documentation.
- Include the correct JSON body information as outlined in the example requests of the API documentation.

**Send the Request:**
- Use Thunder Client to send the request to the API.

**Verify Database Entries:**
- Use DB Browser to inspect the relevant tables in the database.
- Ensure that the correct data has been recorded in the database, matching the sent request body.

**Check for Expected Responses:**
- Verify that the API response matches the example response provided in the API documentation.
- Ensure that the correct status codes and data structures are returned by the API.

**Error Handling Verification:**
- Send variations of the request with missing or incorrect information to test error handling.
- Confirm that the API returns the expected error status codes and messages as specified in the documentation.

### Testing GET Requests**
For each GET endpoint described in the API documentation:

**Prepare the Request:**
- Construct a GET request in Thunder Client with the correct URL and query parameters as specified in the API documentation.

**Send the Request:**
- Use Thunder Client to send the request to the API.

**Verify Response Data:**
- Check if the expected information is retrieved in the response, as outlined in the API documentation.

**Error Handling Verification:**
- Send requests with unexpected queries or incorrect parameters to test error handling.
- Ensure that the API returns the expected error status codes and messages as specified in the documentation.

## 2. Front-end Testing
Testing all use cases through the frontend interface to ensure that the expected behaviors and information are displayed correctly, and the correct information is stored in the database.

### Credential Page
**Credential Page - UI Design**
-   Toggle between signup and login views.

**Credential Page - Creating a Family Account**
-   Ensure all required fields are completed before calling the API.
-   Confirm the accurate addition of data to the database's guardian table (cross-reference with the guardian table).

**Credential Page - Creating a Staff Account**
-   Display an additional text box for role selection when the account type is set to staff.
-   Ensure all required fields are completed before calling the API.
-   Verify the correct addition of data to the database's staff table (cross-reference with the staff table).

**Credential Page - Logging into a Family Account**
-   Ensure all required fields are completed before calling the API.
-   If credentials match those in the guardian table, return the user ID and redirect to the appropriate family profile; otherwise, display the correct error message (verify with the guardian table).

**Credential Page - Logging into a Staff Account**
-   Ensure all required fields are completed before calling the API.
-   If credentials match those in the staff table, return the user ID and redirect to the appropriate staff profile; otherwise, display the correct error message (verify with the staff table).

### Family Profile Page
**Family Profile Page - UI Design**
-   Toggle between different views.

**Family Profile Page - Retrieving Family Information**
-   Retrieve accurate family information (cross-reference with the guardian table).

**Family Profile Page - Adding a Child**
-   Ensure all required fields are completed before calling the API.
-   Display the correct message.
-   Verify the accurate recording of data in the child and family_link tables.

**Family Profile Page - Retrieving Children's Information**
-   Retrieve information for all children associated with the family account (verify with the family_link table).
-   Retrieve individual children's information (verify with the child table).
-   Populate child selectors in event, activity, and check-in views.

**Family Profile Page - Retrieving Each Child's Event Information**
-   Retrieve all events associated with a selected child (verify with the event_link and event tables).
-   Retrieve staff information associated with each event (verify with the staff table).

**Family Profile Page - Retrieving Each Child's Activities**
-   Indicate whether a child was checked in by staff or a parent.
-   Retrieve all activities associated with the selected child and populate the event selector (verify with the activity table).
-   Retrieve the name of the staff or parent (verify with the parent or staff table).

**Family Profile Page - Checking in Each Child at a Specific Event**
-   Display all events associated with the selected child (verify with the event_link table).
-   Ensure all required fields are completed before calling the API.
-   Display the correct message.
-   Verify the accurate recording of data in the activity table.

### Staff Profile Page
**Staff Profile Page - UI Design**
-   Toggle between different views.

**Staff Profile Page - Retrieving Staff Information**
-   Retrieve accurate staff information (cross-reference with the staff table).

**Staff Profile Page - Creating an Event**
-   Ensure all required fields are completed before calling the API.
-   Display the correct message.
-   Verify the accurate recording of data in the event table.

**Staff Profile Page - Retrieving Event Information**
-   Retrieve all event information associated with the staff account (cross-reference with the event table).
-   Populate event selectors in children, activity, and check-in views.

**Staff Profile Page - Adding a Child to a Specific Event**
-   Ensure all required fields are completed before calling the API.
-   Display the correct message.
-   Verify the accurate recording of data in the event_link table.

**Staff Profile Page - Retrieving Information on Children Associated with Each Event**
-   Retrieve all information on children associated with a selected event (verify with the event_link and child tables).
-   Retrieve parent information for each child (verify with the family_link and guardian tables).

**Staff Profile Page - Retrieving Children's Activities Associated with Each Event**
-   Indicate whether a child was checked in by staff or a parent.
-   Retrieve all activities of children associated with the selected event (verify with the activity table).
-   Retrieve the name of the staff or parent (verify with the parent or staff table).

**Staff Profile Page - Checking in Each Child at a Specific Event**
-   Display all children associated with the selected event and populate the child selector (verify with the event_link table).
-   Ensure all required fields are completed before calling the API.
-   Display the correct message.
-   Verify the accurate recording of data in the activity table.

**Staff Profile Page - Posting Messages on the Bulletin Board**
-   Ensure all required fields are completed before calling the API.
-   Display the correct message.
-   Verify the accurate recording of data in the bulletin table.

**Staff Profile Page - Retrieving Bulletin Board Messages Associated with Staff**
-   Display all messages associated with the user (verify with the bulletin table).

### Home Page
**Home Page - Weekly Agenda**
-   Display correct events and their dates on the appropriate day (verify with the event table).

**Home Page - Our Staff**
-   Display accurate staff information (cross-reference with the staff table).

**Home Page - Message Bulletin Board**
-   Display correct bulletin messages and their associated staff (verify with the bulletin and staff tables).

### Event Page
**Events Page - Events**
-   Display correct events and their associated staff information (verify with the event and staff tables).

### Contact Page
**Contact Page - Contact**
-   Display all staff information (cross-reference with the staff table).
-   Display events associated with staff (verify with the event table).