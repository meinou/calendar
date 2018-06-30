import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Day.css';
import eventService from '../services/eventService';

class Day extends Component {
  static formatDayMonth(dayOrMonth) {
    return `${dayOrMonth < 10 ? '0' : ''}${dayOrMonth}`;
  }

  constructor(props) {
    super(props);
    this.state = {
      events: [],
      date: null,
      dateUTC: null,
    };
    this.getByDate = this.getByDate.bind(this);
    this.createList = this.createList.bind(this);
    this.deleteById = this.deleteById.bind(this);
  }

  componentDidMount() {
    // this.getByDate();
  }

  getByDate() {
    const { day, month, year } = this.props;
    const date = `${year}${Day.formatDayMonth(month)}${Day.formatDayMonth(day)}`;
    eventService.getByDate(date).then((resp) => {
      if (!resp.data) {
        return;
      }
      const events = resp.data.map((item) => ({
        id: item[0],
        date: item[1],
        title: item[2],
        description: item[3],
        address: item[4],
      }));
      this.setState({
        events,
      });
    });
  }

  deleteById(id) {
    const { index, deleteHandle } = this.props;
    eventService
      .delete(id)
      .then(() => {
        if (deleteHandle) {
          deleteHandle(index, id);
        }
      })
      .catch(console.error);
  }

  createList() {
    const { events } = this.props;
    return (
      <ul>
        {events.map((event) => {
          const date = new Date(event.date);
          return (
            <li key={event.id}>
              <span className="time">
                {date.getUTCHours()}: {date.getUTCMinutes()}
              </span>
              {event.title}
              <i className="fas fa-times-circle" onClick={() => this.deleteById(event.id)} />
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    const { click, day, index } = this.props;
    return (
      <div className="day">
        <div className="header">
          <span className="num">{day}</span>
          <i className="fas fa-plus-square" onClick={() => click(index)} />
        </div>
        {this.createList()}
      </div>
    );
  }
}

Day.propTypes = {
  click: PropTypes.func.isRequired,
  deleteHandle: PropTypes.func.isRequired,
  events: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
};

export default Day;
