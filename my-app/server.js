'use strict';

const express = require('express');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(cors());


/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {sqlite3.Database} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
      filename: 'data.db',
      driver: sqlite3.Database
  });

  return db;
}

app.post('/create/family', async (req, res) => {
  try {
      let { name, email, phone, password } = req.body;
      if (!name || !email || !phone || !password) {
          return res.status(400).send('Missing data');
      }

      const db = await getDBConnection();

      const emailExists = await db.get(`SELECT 1 FROM guardian WHERE email = ?`, [email]);
        if (emailExists) {
            return res.status(404).send('Email already exists in the database');
        }

        const phoneExists = await db.get(`SELECT 1 FROM guardian WHERE phone = ?`, [phone]);
        if (phoneExists) {
            return res.status(404).send('Phone already exists in the database');
        }

      const result = await db.run(`INSERT INTO guardian (guardian_name, email, phone, password) VALUES (?, ?, ?, ?)`, [name, email, phone, password]);

      if (result && result.lastID) {
          return res.status(201).json({ familyId: result.lastID });
      } else {
          return res.status(500).send('Could not create the family entry');
      }
  } catch (error) {
      console.error('Failed to create family', error);
      return res.status(500).send('Internal Server Error');
  }
});

app.post('/login/family', async (req, res) => {
    const { credential, password } = req.body; // 'credential' can be either email or phone

    if (!credential || !password) {
        return res.status(400).send('Email/phone and password are required');
    }

    try {
        const db = await getDBConnection();

        const query = `SELECT * FROM guardian WHERE (email = ? OR phone = ?) AND password = ?`;
        const guardian = await db.get(query, [credential, credential, password]);

        if (guardian) {
            res.status(200).json({ message: 'Login successful', familyId: guardian.family_id });
        } else {
            res.status(404).send('Login failed: Guardian not found or password incorrect');
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal server error');
    }
});

app.post('/addchild/family', async (req, res) => {
  try {
      let { childName, familyId, remarks } = req.body;
      if (!childName || !familyId || !remarks) {
          return res.status(404).send('Missing data');
      }

      const db = await getDBConnection();

      const guardianExists = await db.get(`SELECT 1 FROM guardian WHERE family_id = ?`, [familyId]);
      if (!guardianExists) {
          return res.status(404).send('Family ID does not exist');
      }

      const childResult = await db.run(`INSERT INTO child (child_name, child_remarks) VALUES (?, ?)`, [childName, remarks]);

      if (childResult && childResult.lastID) {
          const childId = childResult.lastID;

          const linkResult = await db.run(`INSERT INTO family_link (family_id, child_id) VALUES (?, ?)`, [familyId, childId]);

          if (linkResult && linkResult.lastID) {
              return res.status(201).json({ childId: childId });
          } else {
              return res.status(500).send('Could not link the child with the guardian');
          }
      } else {
          return res.status(500).send('Internal Server Error');
      }
  } catch (error) {
      console.error('Failed to add child to family', error);
      return res.status(500).send('Internal Server Error');
  }
});

app.post('/create/staff', async (req, res) => {
  try {
      let { name, email, phone, password } = req.body;
      if (!name || !email || !phone || !password) {
          return res.status(400).send('Missing data');
      }

      const db = await getDBConnection();

      const emailAdded = await db.get(`SELECT 1 FROM staff WHERE email = ?`, [email]);
      if (emailAdded) {
          return res.status(404).send('Email already exists in the database');
      }

      const phoneAdded = await db.get(`SELECT 1 FROM staff WHERE phone = ?`, [phone]);
      if (phoneAdded) {
          return res.status(404).send('Phone already exists in the database');
      }

      const result = await db.run(`INSERT INTO staff (name, email, phone, password) VALUES (?, ?, ?, ?)`, [name, email, phone, password]);

      if (result && result.lastID) {
          return res.status(201).json({ staffId: result.lastID });
      } else {
          return res.status(500).send('Could not create the staff entry');
      }
  } catch (error) {
      console.error('Failed to create staff', error);
      return res.status(500).send('Internal Server Error');
  }
});

app.post('/login/staff', async (req, res) => {
    const { credential, password } = req.body;

    if (!credential || !password) {
        return res.status(400).send('Email/phone and password are required');
    }

    try {
        const db = await getDBConnection();

        const query = `SELECT * FROM staff WHERE (email = ? OR phone = ?) AND password = ?`;
        const staff = await db.get(query, [credential, credential, password]);

        if (staff) {
            res.status(200).json({ message: 'Login successful', staffId: staff.staff_id });
        } else {
            res.status(404).send('Login failed: Staff not found or password incorrect');
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal server error');
    }
});

app.post('/create/event', async (req, res) => {
  try {
      let { name, staffId, description, date} = req.body;
      if (!name || !staffId || !description || !date ) {
          return res.status(400).send('Missing data');
      }

      const db = await getDBConnection();

      const eventAdded = await db.get(`SELECT 1 FROM event WHERE event_name = ?`, [name]);
      if (eventAdded) {
          return res.status(404).send('Event already exists in the database');
      }

      const staffExists = await db.get(`SELECT 1 FROM staff WHERE staff_id = ?`, [staffId]);
      if (!staffExists) {
          return res.status(404).send('Staff ID does not exist');
      }

      const result = await db.run(`INSERT INTO event (event_name, staff_id, event_description, event_date) VALUES (?, ?, ?, ?)`, [name, staffId, description, date]);

      if (result && result.lastID) {
          return res.status(201).json({ eventId: result.lastID });
      } else {
          return res.status(500).send('Could not create the event entry');
      }
  } catch (error) {
      console.error('Failed to create staff', error);
      return res.status(500).send('Internal Server Error');
  }
});

app.post('/addchild/event', async (req, res) => {
  try {
      let { eventId, childId } = req.body;
      if (!eventId || !childId) {
          return res.status(400).send('Missing data');
      }

      const db = await getDBConnection();

      const eventExists = await db.get(`SELECT 1 FROM event WHERE event_id = ?`, [eventId]);
      if (!eventExists) {
          return res.status(404).send('Event ID does not exist');
      }

      const childExists = await db.get(`SELECT 1 FROM child WHERE child_id = ?`, [childId]);
      if (!childExists) {
          return res.status(404).send('Child ID does not exist');
      }

      const childAdded = await db.get(`SELECT 1 FROM event_link WHERE event_id = ? AND child_id = ?`, [eventId, childId]);
      if (childAdded) {
          return res.status(404).send('Child already added to event');
      }

      const result = await db.run(`INSERT INTO event_link (event_id, child_id) VALUES (?, ?)`, [eventId, childId]);

      if (result && result.lastID) {
          return res.status(201).send('Child successfully added to event.');
      } else {
          return res.status(500).send('Could not add the child to the event');
      }
  } catch (error) {
      console.error('Failed to add child to event', error);
      return res.status(500).send('Internal Server Error');
  }
});


app.post('/checkin/byparent', async (req, res) => {
  try {
      let { childId, eventId, date, time, location, familyId } = req.body;
      if (!childId || !eventId || !date || !time || !location || !familyId) {
          return res.status(400).send('Missing required data');
      }

      const db = await getDBConnection();

      const childExists = await db.get(`SELECT 1 FROM child WHERE child_id = ?`, [childId]);
      if (!childExists) {
          return res.status(404).send('Child ID does not exist');
      }

      const eventExists = await db.get(`SELECT 1 FROM event WHERE event_id = ?`, [eventId]);
      if (!eventExists) {
          return res.status(404).send('Event ID does not exist');
      }

      const familyExists = await db.get(`SELECT 1 FROM guardian WHERE family_id = ?`, [familyId]);
      if (!familyExists) {
          return res.status(404).send('Family ID does not exist');
      }

      const result = await db.run(`
          INSERT INTO activity (child_id, event_id, date, time, location, family_id)
          VALUES (?, ?, ?, ?, ?, ?)`, [childId, eventId, date, time, location, familyId]);

      if (result && result.lastID) {
          return res.status(201).send('Child successfully checked in to event by parent.');
      } else {
          return res.status(500).send('Could not check in the child to the event');
      }
  } catch (error) {
      console.error('Failed to check in child by parent', error);
      return res.status(500).send('Internal Server Error');
  }
});

app.post('/checkin/bystaff', async (req, res) => {
  try {
      let { childId, eventId, date, time, location, staffId } = req.body;
      if (!childId || !eventId || !date || !time || !location || !staffId) {
          return res.status(400).send('Missing required data');
      }

      const db = await getDBConnection();

      const childExists = await db.get(`SELECT 1 FROM child WHERE child_id = ?`, [childId]);
      if (!childExists) {
          return res.status(404).send('Child ID does not exist');
      }

      const eventExists = await db.get(`SELECT 1 FROM event WHERE event_id = ?`, [eventId]);
      if (!eventExists) {
          return res.status(404).send('Event ID does not exist');
      }

      const staffExists = await db.get(`SELECT 1 FROM staff WHERE staff_id = ?`, [staffId]);
      if (!staffExists) {
          return res.status(404).send('staff ID does not exist');
      }

      const result = await db.run(`
          INSERT INTO activity (child_id, event_id, date, time, location, staff_id) 
          VALUES (?, ?, ?, ?, ?, ?)`, [childId, eventId, date, time, location, staffId]);

      if (result && result.lastID) {
          return res.status(201).send('Child successfully checked in to event by staff.');
      } else {
          return res.status(500).send('Could not check in the child to the event');
      }
  } catch (error) {
      console.error('Failed to check in child by parent', error);
      return res.status(500).send('Internal Server Error');
  }
});

app.get('/lookup/family/child', async (req, res) => {
    const { familyId } = req.query;
    if (!familyId) {
        return res.status(400).send('Missing or invalid familyId');
    }

    try {
        const db = await getDBConnection();
        const children = await db.all(`
            SELECT child_id 
            FROM family_link 
            WHERE family_id = ?`, [familyId]);

        const childIds = children.map(child => child.child_id);

        res.status(200).json(childIds);
    } catch (error) {
        console.error('Failed to lookup family\'s children', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/lookup/family/info', async (req, res) => {
    const { familyId } = req.query;
    if (!familyId) {
        return res.status(400).send('Missing or invalid familyId');
    }

    try {
        const db = await getDBConnection();
        const info = await db.get(`SELECT guardian_name, email, phone FROM guardian WHERE family_id = ?`, [familyId]);
        if (!info) {
            return res.status(404).send('Family not found');
        }
        res.status(200).json(info);
    } catch (error) {
        console.error('Failed to lookup family info', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/lookup/child/event', async (req, res) => {
    const { childId } = req.query;
    if (!childId) {
        return res.status(400).send('Missing or invalid childId');
    }

    try {
        const db = await getDBConnection();
        const events = await db.all(`
            SELECT e.event_name, el.event_id
            FROM event_link el
            JOIN event e ON el.event_id = e.event_id
            WHERE el.child_id = ?`, [childId]);

        res.status(200).json(events);
    } catch (error) {
        console.error('Failed to lookup child\'s events', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/lookup/child/info', async (req, res) => {
    const { childId } = req.query;
    if (!childId) {
        return res.status(400).send('Missing or invalid childId');
    }

    try {
        const db = await getDBConnection();
        if (childId === 'all') {
            // If childId is 'all', query to get all child names and ids
            const allChildrenInfo = await db.all(`SELECT child_id, child_name, child_remarks FROM child`);
            if (!allChildrenInfo.length) {
                return res.status(404).send('No children found');
            }
            return res.status(200).json(allChildrenInfo);
        } else {
            // Handle the case for a specific childId as before
            const childInfo = await db.get(`SELECT child_name, child_remarks FROM child WHERE child_id = ?`, [childId]);
            if (!childInfo) {
                return res.status(404).send('Child not found');
            }
            return res.status(200).json(childInfo);
        }
    } catch (error) {
        console.error('Failed to lookup child info', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/lookup/child/family', async (req, res) => {
    const { childId } = req.query;
    if (!childId) {
        return res.status(400).send('Missing or invalid childId');
    }

    try {
        const db = await getDBConnection();
        const family = await db.all(`
            SELECT family_id
            FROM family_link
            WHERE child_id = ?`, [childId]);

        const familyIds = family.map(family => family.family_id);
        res.status(200).json(familyIds);
    } catch (error) {
        console.error('Failed to lookup children\'s family', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/lookup/child/activity', async (req, res) => {
    const { childId } = req.query;
    if (!childId) {
        return res.status(400).send('Missing or invalid childId');
    }

    try {
        const db = await getDBConnection();
        const activities = await db.all(`
            SELECT event_id, date, time, location, staff_id, family_id 
            FROM activity
            WHERE child_id = ?`, [childId]);
        res.status(200).json(activities);
    } catch (error) {
        console.error('Failed to lookup child\'s activities', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/lookup/staff/info', async (req, res) => {
    const { staffId } = req.query;

    try {
        const db = await getDBConnection();
        if (staffId === 'all') {
            // Fetch and return info for all staff members
            const allStaffInfo = await db.all(`SELECT staff_id, name, email, phone FROM staff`);
            return res.status(200).json(allStaffInfo);
        } else if (staffId) {
            // Fetch and return info for a specific staff member
            const info = await db.get(`SELECT name, email, phone FROM staff WHERE staff_id = ?`, [staffId]);
            if (!info) {
                return res.status(404).send('Staff not found');
            }
            res.status(200).json(info);
        } else {
            // No staffId or staffId not 'all'
            return res.status(400).send('Missing or invalid staffId');
        }
    } catch (error) {
        console.error('Failed to lookup staff info', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/lookup/staff/event', async (req, res) => {
    const { staffId } = req.query;
    if (!staffId) {
        return res.status(400).send('Missing or invalid staffId');
    }

    try {
        const db = await getDBConnection();
        const events = await db.all(`SELECT event_id FROM event WHERE staff_id = ?`, [staffId]);
        res.status(200).json(events.map(event => event.event_id));
    } catch (error) {
        console.error('Failed to lookup staff\'s events', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/lookup/event/child', async (req, res) => {
    const { eventId } = req.query;
    if (!eventId) {
        return res.status(400).send('Missing or invalid eventId');
    }

    try {
        const db = await getDBConnection();
        const children = await db.all(`SELECT child_id FROM event_link WHERE event_id = ?`, [eventId]);
        res.status(200).json( children.map(child => child.child_id) );
    } catch (error) {
        console.error('Failed to lookup event\'s children', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/lookup/event/info', async (req, res) => {
    const { eventId } = req.query;
    if (!eventId) {
        return res.status(400).send('Missing or invalid eventId');
    }

    const db = await getDBConnection();
    try {
        if (eventId === 'all') {
            const allEventInfo = await db.all(`SELECT event_id, event_name, staff_id, event_description, event_date FROM event ORDER BY event_date DESC`);
            return res.status(200).json(allEventInfo);
        } else {
            const info = await db.all(`SELECT event_name, staff_id, event_description, event_date FROM event WHERE event_id = ?`, [eventId]);
            if (info.length === 0) {
                return res.status(404).send('Event not found');
            }
            res.status(200).json(info);
        }
    } catch (error) {
        console.error('Failed to lookup event info', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/lookup/event/activity', async (req, res) => {
    const { eventId } = req.query;
    if (!eventId) {
        return res.status(400).send('Missing or invalid eventId');
    }

    try {
        const db = await getDBConnection();
        const activities = await db.all(`
            SELECT child_id, date, time, location, staff_id, family_id 
            FROM activity
            WHERE event_id = ?`, [eventId]);
        res.status(200).json(activities);
    } catch (error) {
        console.error('Failed to lookup event\'s activities', error);
        res.status(500).send('Internal Server Error');
    }
});

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});