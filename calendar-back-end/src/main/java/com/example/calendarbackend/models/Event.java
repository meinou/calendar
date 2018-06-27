package com.example.calendarbackend.models;

import javax.persistence.*;
import java.sql.Timestamp;

import lombok.*;

@Data@AllArgsConstructor@NoArgsConstructor@Getter@Setter
@Entity
@Table(name = "EVENTS")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date")
    private Timestamp date;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "address")
    private String address;
}
