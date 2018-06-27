package com.example.calendarbackend.controllers;

import com.example.calendarbackend.models.Event;
import com.example.calendarbackend.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @GetMapping("/events")
    public Iterable<Event> findAllEvents() {
        return eventRepository.findAll();
    }

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
