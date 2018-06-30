package com.example.calendarbackend.repositories;

import com.example.calendarbackend.models.Event;
import org.springframework.data.repository.Repository;

import java.sql.Timestamp;

public interface EventRepository extends Repository<Event, Long> {
    Iterable<Event> findByDateBetween (Timestamp startDate, Timestamp endDate);
}
