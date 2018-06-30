package com.example.calendarbackend.models;

import lombok.*;

import java.util.ArrayList;
import java.util.Date;

@Data @AllArgsConstructor @NoArgsConstructor @Getter @Setter
public class DayEvents {
    private Date date;
    private ArrayList<Event> events;

}
