# Application works locally with docker-compose.

## In a case of any problems or questions feel free to ping me by email `mei.mentret@gmail.com`

### To install:

install Java 8, then run:

`brew cask install docker`
`brew install docker`

`brew install docker-compose`

### To run:
`docker-compose up`

### To stop:

`^C` and `docker-compose down`

### To see database:
`brew install postgres`

`psql -h localhost -p 5432 -U postgres`

`\c calendar`

## API:

### GET `http://localhost:8080/events`
returns all events in database

### GET `http://localhost:8080/events/month/{date}` where {date}=YYYYmm
returns all events in month mm

### GET `http://localhost:8080/events/date/{date}` where {date}=YYYYmmDD
returns all events in day

### `http://localhost:8080/events/{eventId}`
returns event with id

### POST    `http://localhost:8080/events`
creates new event

### DELETE `http://localhost:8080/events/{eventId}`
removes event of current id

### PATCH `http://localhost:8080/events/{eventId}`
updates event of current id
