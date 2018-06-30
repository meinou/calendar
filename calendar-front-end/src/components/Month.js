import React, { Component } from 'react';
import Week from './Week';
import Day from './Day';
import './Month.css';
import eventService from '../services/eventService';

class Month extends Component {
  constructor() {
    super();
    this.months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.state = {
      currentMonth: 7,
      currentYear: 2018,
      days: [],
      addForm: false,
      newEvent: {
        title: null,
        description: null,
        time: null,
      },
    };
    this.createMonth = this.createMonth.bind(this);
    this.getEvents = this.getEvents.bind(this);
    this.clickAdd = this.clickAdd.bind(this);
    this.createAddForm = this.createAddForm.bind(this);
    this.titleHandler = this.titleHandler.bind(this);
    this.descriptionHandler = this.descriptionHandler.bind(this);
    this.timeHandler = this.timeHandler.bind(this);
    this.post = this.addEvent.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
  }

  componentDidMount() {
    this.getEvents();
  }

  getEvents() {
    // const { month, year } = this.props;
    const { currentMonth, currentYear } = this.state;
    const date = `${currentYear}${Day.formatDayMonth(currentMonth)}`;
    eventService.getForMonth(date).then((resp) => {
      if (!resp || !resp.data) {
        return;
      }
      this.setState({
        days: resp.data,
      });
    });
  }

  closeForm() {
    this.setState({
      newEvent: {
        title: null,
        description: null,
        time: null,
      },
      addForm: false,
    });
  }

  addEvent() {
    const { currentMonth, currentYear, dayToUpdate, newEvent, days } = this.state;
    if (newEvent.title && newEvent.time && newEvent.description) {
      const copyEvent = {};
      Object.assign(copyEvent, newEvent);
      const day = days[dayToUpdate];
      if (!day) {
        return;
      }
      const time = newEvent.time.toString();
      const month = this.months[currentMonth - 1];
      const string = `${dayToUpdate} ${month} ${currentYear} ${time}`;
      const date = new Date(string);
      copyEvent.date = date;

      day;

      eventService
        .post(copyEvent)
        .then((resp) => {
          this.closeForm();

          const event = resp.data;
          event.convertedDate = this.getDateFromServerDateString(event.date);
          day.events.push(event);
          this.setState({ days });
        })
        .catch(console.error);
    }
  }

  deleteEvent(index, id) {
    console.log('deleteEvent');
    console.log('index', index, 'id', id);
    const { days } = this.state;
    const day = days[index];
    if (!day) {
      return;
    }
    const dayEvents = day.events.filter((e) => e.id !== id);
    console.log('dayEvents:', dayEvents);
    day.events = dayEvents;
    this.setState({ days });
  }

  descriptionHandler(event) {
    const { newEvent } = this.state;
    newEvent.description = event.target.value;
    this.setState({ newEvent });
  }

  titleHandler(event) {
    const { newEvent } = this.state;
    newEvent.title = event.target.value;
    this.setState({ newEvent });
  }

  timeHandler(event) {
    const { newEvent } = this.state;
    newEvent.time = event.target.value;
    this.setState({ newEvent });
  }

  clickAdd(index) {
    this.setState({ addForm: true, dayToUpdate: index });
  }

  createAddForm() {
    return (
      <div className="addform">
        <i className="fas fa-times-circle" onClick={() => this.closeForm()} />

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            onChange={this.titleHandler}
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Title"
          />
        </div>
        <label>Description</label>
        <input
          type="text"
          onChange={this.descriptionHandler}
          className="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Description"
        />

        <div className="form-group">
          <label>Time:</label>
          <input
            type="time"
            onChange={this.timeHandler}
            className="form-control"
            id="appt-time"
            required
          />
        </div>
        <div className="form-check" />

        <button onClick={this.addEvent} className="btn btn-primary">
          Add event
        </button>
      </div>
    );
  }

  getDateFromServerDateString(date) {
    const datePart = date.split('T')[0];
    const yearMonthDate = datePart.split('-');
    return new Date(yearMonthDate[0], yearMonthDate[1] - 1, yearMonthDate[2]);
  }

  createMonth() {
    const { currentMonth, currentYear, days } = this.state;
    if (!days) {
      return;
    }
    const weeks = [];
    let week = [];
    for (let i = 0; i < days.length; i++) {
      if (!days[i].convertedDate) {
        days[i].convertedDate = this.getDateFromServerDateString(days[i].date);
      }
      days[i].index = i;
      week.push(days[i]);
      if ((i + 1) % 7 === 0) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length) {
      weeks.push(week);
    }

    return weeks.map((week, ind) => {
      return (
        <Week
          key={ind}
          click={this.clickAdd}
          month={currentMonth}
          year={currentYear}
          days={week}
          deleteHandle={this.deleteEvent}
        />
      );
    });
  }

  render() {
    const form = this.state.addForm ? this.createAddForm() : '';
    return (
      <div>
        <p>
          {this.months[this.state.currentMonth - 1]}, {this.state.currentYear}
        </p>
        <div className="month">
          <div className="week-header">
            {this.days.map((day, index) => (
              <div key={index} className="day-title">
                {day}
              </div>
            ))}
          </div>
          {this.createMonth()}
        </div>
        {form}
      </div>
    );
  }
}

export default Month;
