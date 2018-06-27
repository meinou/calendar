package com.example.calendarbackend.repositories;

import com.example.calendarbackend.models.Event;
import org.springframework.data.repository.CrudRepository;

public interface EventRepository extends CrudRepository<Event, Long> {

}
