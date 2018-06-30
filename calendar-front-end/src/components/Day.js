import React, { Component } from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import './Day.css';
import eventService from '../services/eventService';

class Day extends Component {
  static formatDayMonth(dayOrMonth) {
    return `${dayOrMonth < 10 ? '0' : ''}${dayOrMonth}`;
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.createList = this.createList.bind(this);
    this.deleteById = this.deleteById.bind(this);
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
    events.sort((a, b) => a.date > b.date);
    return (
      <div className="events-container">
        {events.map((event) => {
          const date = new Date(event.date).getTime();
          return (
            <div key={event.id} className="event-record">
              <Moment className="time" format="HH:mm">
                {date}
              </Moment>
              <div className="title">{event.title}</div>
              <div className="close">
                <div className="fas fa-times-circle" onClick={() => this.deleteById(event.id)} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const { click, day, header, index } = this.props;
    return (
      <div className="day">
        <div className="header">
          <span className="num">{day}</span>
          <span className="text">{header}</span>
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
  header: PropTypes.string,
  index: PropTypes.number.isRequired,
};

export default Day;
