# Database Documentation

## 1. Activity
Check in activity
```
CREATE TABLE "activity" (
	"activity_id"	INTEGER NOT NULL UNIQUE,
	"child_id"	INTEGER NOT NULL,
	"event_id"	INTEGER NOT NULL,
	"date"	TEXT NOT NULL,
	"time"	TEXT NOT NULL,
	"location"	TEXT NOT NULL,
	"staff_id"	INTEGER,
	"family_id"	INTEGER,
	PRIMARY KEY("activity_id" AUTOINCREMENT),
	FOREIGN KEY("staff_id") REFERENCES "staff"("staff_id"),
	FOREIGN KEY("child_id") REFERENCES "child"("child_id"),
	FOREIGN KEY("event_id") REFERENCES "event"("event_id"),
	FOREIGN KEY("family_id") REFERENCES "guardian"("family_id")
);
```

## 2. Bulletin
Message board
```
CREATE TABLE "bulletin" (
	"bulletin_id"	INTEGER NOT NULL UNIQUE,
	"staff_id"	INTEGER NOT NULL,
	"message"	INTEGER NOT NULL,
	PRIMARY KEY("bulletin_id" AUTOINCREMENT),
	FOREIGN KEY("staff_id") REFERENCES "staff"("staff_id")
);
```

## 3. Child
Child info
```
CREATE TABLE "child" (
	"child_id"	INTEGER NOT NULL UNIQUE,
	"child_name"	INTEGER NOT NULL,
	"child_remarks"	TEXT NOT NULL,
	PRIMARY KEY("child_id" AUTOINCREMENT)
);
```

## 4. Event
Event info
```
CREATE TABLE "event" (
	"event_id"	INTEGER NOT NULL UNIQUE,
	"event_name"	TEXT NOT NULL UNIQUE,
	"staff_id"	INTEGER NOT NULL,
	"event_description"	TEXT NOT NULL,
	"event_date"	TEXT NOT NULL,
	FOREIGN KEY("staff_id") REFERENCES "staff"("staff_id"),
	PRIMARY KEY("event_id" AUTOINCREMENT)
);
```

## 5. Event_link
Event and child pairs
```
CREATE TABLE "event_link" (
	"event_link_id"	INTEGER NOT NULL UNIQUE,
	"event_id"	INTEGER NOT NULL,
	"child_id"	INTEGER NOT NULL,
	PRIMARY KEY("event_link_id" AUTOINCREMENT),
	FOREIGN KEY("child_id") REFERENCES "child"("child_id"),
	FOREIGN KEY("event_id") REFERENCES "event"("event_id")
);
```

## 6. Family_link
Family and child pairs
```
CREATE TABLE "family_link" (
	"family_link_id"	INTEGER NOT NULL UNIQUE,
	"family_id"	INTEGER NOT NULL,
	"child_id"	INTEGER NOT NULL,
	PRIMARY KEY("family_link_id" AUTOINCREMENT),
	FOREIGN KEY("family_id") REFERENCES "guardian"("family_id"),
	FOREIGN KEY("child_id") REFERENCES "child"("child_id")
);
```

## 7. Guardian
Family info
```
CREATE TABLE "guardian" (
	"family_id"	INTEGER NOT NULL UNIQUE,
	"guardian_name"	TEXT NOT NULL,
	"email"	TEXT NOT NULL UNIQUE,
	"phone"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	PRIMARY KEY("family_id" AUTOINCREMENT)
);
```

## 8. Staff
Staff info
```
CREATE TABLE "staff" (
	"staff_id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"email"	TEXT NOT NULL,
	"phone"	INTEGER NOT NULL,
	"password"	TEXT NOT NULL,
	"role"	INTEGER NOT NULL,
	PRIMARY KEY("staff_id" AUTOINCREMENT)
);
```