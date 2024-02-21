# Database Documentation
`
CREATE TABLE "activity" (
	"activity_id"	INTEGER NOT NULL UNIQUE,
	"child_id"	INTEGER NOT NULL,
	"event_id"	INTEGER NOT NULL,
	"date"	INTEGER NOT NULL,
	"time"	INTEGER NOT NULL,
	"location"	TEXT NOT NULL,
	"staff_id"	INTEGER,
	"family_id"	INTEGER,
	PRIMARY KEY("activity_id" AUTOINCREMENT),
	FOREIGN KEY("event_id") REFERENCES "event"("event_id"),
	FOREIGN KEY("staff_id") REFERENCES "staff"("staff_id"),
	FOREIGN KEY("family_id") REFERENCES "guardian"("family_id"),
	FOREIGN KEY("child_id") REFERENCES "child"("child_id")
);

CREATE TABLE "child" (
	"child_id"	INTEGER NOT NULL UNIQUE,
	"child_name"	INTEGER NOT NULL,
	"remarks"	TEXT,
	PRIMARY KEY("child_id" AUTOINCREMENT)
);

CREATE TABLE "event" (
	"event_id"	INTEGER NOT NULL UNIQUE,
	"event_name"	TEXT NOT NULL UNIQUE,
	"staff_id"	INTEGER NOT NULL,
	PRIMARY KEY("event_id" AUTOINCREMENT),
	FOREIGN KEY("staff_id") REFERENCES "staff"("staff_id")
);

CREATE TABLE "event_link" (
	"event_link_id"	INTEGER NOT NULL UNIQUE,
	"event_id"	INTEGER NOT NULL,
	"child_id"	INTEGER NOT NULL,
	PRIMARY KEY("event_link_id" AUTOINCREMENT),
	FOREIGN KEY("child_id") REFERENCES "child"("child_id"),
	FOREIGN KEY("event_id") REFERENCES "event"("event_id")
);

CREATE TABLE "family_link" (
	"family_link_id"	INTEGER NOT NULL UNIQUE,
	"guardian_id"	INTEGER NOT NULL,
	"child_id"	INTEGER NOT NULL,
	PRIMARY KEY("family_link_id" AUTOINCREMENT),
	FOREIGN KEY("guardian_id") REFERENCES "guardian"("family_id"),
	FOREIGN KEY("child_id") REFERENCES "child"("child_id")
);

CREATE TABLE "guardian" (
	"family_id"	INTEGER NOT NULL UNIQUE,
	"guardian_name"	TEXT NOT NULL,
	"email"	TEXT NOT NULL UNIQUE,
	"phone"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("family_id" AUTOINCREMENT)
);

CREATE TABLE "staff" (
	"staff_id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"email"	TEXT NOT NULL,
	"phone"	INTEGER NOT NULL,
	PRIMARY KEY("staff_id" AUTOINCREMENT)
);
`