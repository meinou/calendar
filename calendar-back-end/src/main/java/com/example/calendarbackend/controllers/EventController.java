package com.example.calendarbackend.controllers;

import com.example.calendarbackend.models.Event;
import com.example.calendarbackend.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.*;

@CrossOrigin
@RestController
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    EntityManager entityManager;

    @GetMapping("/events")
    public Iterable<Event> findAllEvents() {
        return eventRepository.findAll();
    }


    @GetMapping("/events/date/{date}")
    public Iterable<Event> getAllByDate(
            @PathVariable("date") @DateTimeFormat(pattern = "yyyyMMdd") Date date
    ) {
        Query query = entityManager.createNativeQuery("SELECT *" +
                "FROM events\n" +
                "WHERE events.date BETWEEN ?1 AND ?2");
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DAY_OF_MONTH, +1);
        Date endDate = calendar.getTime();

        query.setParameter(1, date);
        query.setParameter(2, endDate);

        Iterable<Event> result = query.getResultList();

        return result;
    }

//
//    @GetMapping("/events?date={date}")
//    public Iterable<Event> findAllEvents(@PathVariable Timestamp date) {
//        return eventRepository.findByDate(date);
//    }

    @GetMapping("/events/{eventId}")
    public Optional<Event> findEventById(@PathVariable Long eventId) {
        return eventRepository.findById(eventId);
    }

    @PostMapping("/events")
    public Event createNewEvent(@RequestBody Event newEvent) {
        return eventRepository.save(newEvent);
    }

    @DeleteMapping("/events/{eventId}")
    public HttpStatus deleteEventById(@PathVariable Long eventId){
        eventRepository.deleteById(eventId);
        return HttpStatus.OK;
    }

    @PatchMapping("/events/{eventId}")
    public Event updateEventById(@PathVariable Long eventId, @RequestBody Event event){
        Event newEvent = eventRepository.findById(eventId).get();

        newEvent.setAddress(event.getAddress());
        newEvent.setDate(event.getDate());
        newEvent.setDescription(event.getDescription());
        newEvent.setTitle(event.getTitle());

        return eventRepository.save(newEvent);
    }
}
