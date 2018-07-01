import React, { Component } from 'react';
import monthService from '../services/monthService';
import Week from './Week';
import './Month.css';
import eventService from '../services/eventService';
import EventDetails from './EventDetails';

class Month extends Component {
  constructor() {
    super();
    this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.state = {
      days: [],
      showDetails: false,
      editEvent: null,
    };

    this.createMonth = this.createMonth.bind(this);
    this.getEvents = this.getEvents.bind(this);
    this.clickEdit = this.clickEdit.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.clickEdit = this.clickEdit.bind(this);
    this.updateDays = this.updateDays.bind(this);
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

  updateDays(dayToUpdate, event) {
    const { days } = this.state;
    const { month, year } = this.props;

    if (event.title && event.time) {
      const copyEvent = Object.assign({}, event);

      const day = days[dayToUpdate];
      if (!day) {
        return;
      }

      const time = event.time.toString();
      const newMonth = monthService.getMonthName(month);
      const string = `${day.convertedDate.getDate()} ${newMonth} ${year} ${time}`;
      const date = new Date(string);
      copyEvent.date = date;

      const promise = copyEvent.id
        ? eventService.patch(copyEvent.id, copyEvent)
        : eventService.post(copyEvent);

      promise
        .then((resp) => {
          const event = resp.data;
          event.convertedDate = this.getDateFromServerDateString(event.date);
          if (copyEvent.id) {
            day.events = day.events ? day.events.filter((e) => e.id !== copyEvent.id) : [];
          }
          day.events.push(event);
          this.setState({ days });
        })
        .catch(console.error);
    }
    this.setState({ days });
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

  clickEdit(index, eventId) {
    const { days } = this.state;
    const day = days[index];
    const event = day && day.events.find((e) => e.id === eventId);
    this.setState({
      showDetails: true,
      dayToUpdate: index,
      editEvent: event ? Object.assign({}, event) : null,
    });
  }

  getDateFromServerDateString(date) {
    const datePart = date.split('T')[0];
    const yearMonthDate = datePart.split('-');
    return new Date(yearMonthDate[0], yearMonthDate[1] - 1, yearMonthDate[2]);
  }

  closeForm() {
    this.setState({ showDetails: false, editEvent: null });
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
          click={this.clickEdit}
          clickTime={this.clickEdit}
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
    const { dayToUpdate, editEvent, showDetails } = this.state;
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
        {showDetails ? (
          <EventDetails
            close={this.closeForm}
            update={this.updateDays}
            dayToUpdate={dayToUpdate}
            event={editEvent}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default Month;
