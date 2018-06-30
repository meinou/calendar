package com.example.calendarbackend.controllers;

import com.example.calendarbackend.models.DayEvents;
import com.example.calendarbackend.models.Event;
import com.example.calendarbackend.repositories.EventCrudRepository;
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
    private EventCrudRepository eventCrudRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    EntityManager entityManager;

    @GetMapping("/events")
    public Iterable<Event> findAllEvents() {
        return eventCrudRepository.findAll();
    }


    @GetMapping("/events/month/{date}")
    public ArrayList<DayEvents> getAllInMonth(
            @PathVariable("date") @DateTimeFormat(pattern = "yyyyMM") Date date
    ) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        Date lastDayOfMonth = calendar.getTime();
        calendar.setTime(lastDayOfMonth);
        calendar.set(Calendar.DAY_OF_WEEK, Calendar.SATURDAY);
        Date endDay = calendar.getTime();

        calendar.setTime(date);
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        Date firstDayOfMonth = calendar.getTime();
        calendar.setTime(firstDayOfMonth);
        calendar.set(Calendar.DAY_OF_WEEK, calendar.getFirstDayOfWeek());
        Date startDay = calendar.getTime();

        Iterable<Event> events = eventRepository.findByDateBetween(new Timestamp(startDay.getTime()), new Timestamp(endDay.getTime()));
        ArrayList<DayEvents> days = new ArrayList<>();

        HashMap<Date, ArrayList<Event>> dateToEvents = new HashMap<Date, ArrayList<Event>>();
        for (Event event : events) {
            calendar.setTime(event.getDate());
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            Date eventDate = calendar.getTime();

            if (!dateToEvents.containsKey(eventDate)) {
                dateToEvents.put(eventDate, new ArrayList<Event>());
            }

            dateToEvents.get(eventDate).add(event);
        }
        

        while (startDay.compareTo(endDay) <= 0) {
            DayEvents dayEvents = new DayEvents();
            dayEvents.setDate(startDay);
            if (dateToEvents.containsKey(startDay)) {
                dayEvents.setEvents(dateToEvents.get(startDay));
            } else {
                dayEvents.setEvents(new ArrayList<Event>());
            }
            calendar.setTime(startDay);
            calendar.add(Calendar.DATE, 1);
            startDay = calendar.getTime();
            days.add(dayEvents);
        }
        return days;
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
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        Date lastDay = calendar.getTime();

        query.setParameter(1, date);
        query.setParameter(2, lastDay);

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
        return eventCrudRepository.findById(eventId);
    }



    @PostMapping("/events")
    public Event createNewEvent(@RequestBody Event newEvent) {
        return eventCrudRepository.save(newEvent);
    }

    @DeleteMapping("/events/{eventId}")
    public HttpStatus deleteEventById(@PathVariable Long eventId){
        eventCrudRepository.deleteById(eventId);
        return HttpStatus.OK;
    }

    @PatchMapping("/events/{eventId}")
    public Event updateEventById(@PathVariable Long eventId, @RequestBody Event event){
        Event newEvent = eventCrudRepository.findById(eventId).get();

        newEvent.setAddress(event.getAddress());
        newEvent.setDate(event.getDate());
        newEvent.setDescription(event.getDescription());
        newEvent.setTitle(event.getTitle());

        return eventCrudRepository.save(newEvent);
    }
}
