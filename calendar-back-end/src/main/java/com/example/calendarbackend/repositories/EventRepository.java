package com.example.calendarbackend.repositories;

import com.example.calendarbackend.models.Event;
import org.springframework.data.repository.CrudRepository;

import java.sql.Timestamp;

public interface EventRepository extends CrudRepository<Event, Long> {
   // Iterable<Event> findByDate (Timestamp event_date);
}
