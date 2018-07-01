import React, { Component } from 'react';
import monthService from '../services/monthService';
import Week from './Week';
import './Month.css';
import eventService from '../services/eventService';

const defaultNewEvent = {
  title: '',
  description: '',
  time: '00:00',
  address: '',
};

class Month extends Component {
  constructor() {
    super();
    this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.state = {
      days: [],
      addForm: false,
      newEvent: Object.assign({}, defaultNewEvent),
    };

    this.createMonth = this.createMonth.bind(this);
    this.getEvents = this.getEvents.bind(this);
    this.clickAdd = this.clickAdd.bind(this);
    this.createAddForm = this.createAddForm.bind(this);
    this.titleHandler = this.titleHandler.bind(this);
    this.descriptionHandler = this.descriptionHandler.bind(this);
    this.timeHandler = this.timeHandler.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.addressHandler = this.addressHandler.bind(this);
  }

  componentDidMount() {
    this.getEvents();
  }

  componentDidUpdate(prevProps) {
    const { month } = this.props;
    if (month !== prevProps.month) {
      this.getEvents();
    }
  }

  getEvents() {
    const { month, year } = this.props;
    const realMonth = month + 1;
    const date = `${year}${realMonth < 10 ? '0' : ''}${realMonth}`;
    eventService.getForMonth(date).then((resp) => {
      if (!resp || !resp.data) {
        return;
      }
      this.setState({
        days: resp.data,
      });
    });
  }

  addEvent() {
    const { month, year } = this.props;
    const { dayToUpdate, newEvent, days } = this.state;
    if (newEvent.title && newEvent.time) {
      const copyEvent = {};
      Object.assign(copyEvent, newEvent);

      const day = days[dayToUpdate];
      if (!day) {
        return;
      }

      const time = newEvent.time.toString();
      const newMonth = monthService.getMonthName(month);
      const string = `${day.convertedDate.getDate()} ${newMonth} ${year} ${time}`;
      const date = new Date(string);
      copyEvent.date = date;

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
    const { days } = this.state;
    const day = days[index];
    if (!day) {
      return;
    }
    const dayEvents = day.events.filter((e) => e.id !== id);
    day.events = dayEvents;
    this.setState({ days });
  }

  descriptionHandler(event) {
    const { newEvent } = this.state;
    newEvent.description = event.target.value;
    this.setState({ newEvent });
  }

  addressHandler(event) {
    const { newEvent } = this.state;
    newEvent.address = event.target.value;
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
    const { title, description, address, time } = this.state.newEvent;
    console.log('time', time);
    return (
      <div className="addform">
        <i className="fas fa-times-circle" onClick={() => this.closeForm()} />

        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={this.titleHandler}
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="Title"
          />
        </div>

        <input
          type="text"
          value={description}
          onChange={this.descriptionHandler}
          className="form-control"
          aria-describedby="emailHelp"
          placeholder="Description"
        />

        <input
          type="text"
          value={address}
          onChange={this.addressHandler}
          className="form-control"
          aria-describedby="emailHelp"
          placeholder="Address"
        />

        <div className="form-group">
          <input
            value={time}
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

  closeForm() {
    this.setState({
      newEvent: Object.assign({}, defaultNewEvent),
      addForm: false,
    });
  }

  createMonth() {
    const { month, year } = this.props;
    const { days } = this.state;
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
          month={month}
          year={year}
          days={week}
          deleteHandle={this.deleteEvent}
        />
      );
    });
  }

  render() {
    const { month, year } = this.props;
    const form = this.state.addForm ? this.createAddForm() : '';
    return (
      <div>
        <p>
          {monthService.getMonthName(month)}
          , {year}
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
