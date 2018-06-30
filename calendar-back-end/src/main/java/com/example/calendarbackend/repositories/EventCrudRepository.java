package com.example.calendarbackend.repositories;

import com.example.calendarbackend.models.Event;
import org.springframework.data.repository.CrudRepository;

public interface EventCrudRepository extends CrudRepository<Event, Long> {
}
