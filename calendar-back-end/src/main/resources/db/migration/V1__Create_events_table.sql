create table EVENTS (
    ID serial,
    date timestamp DEFAULT NOW() NOT NULL,
    title varchar(100) NOT NULL,
    description varchar(1024),
    address varchar(1024)
);