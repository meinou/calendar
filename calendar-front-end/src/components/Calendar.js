import React, { Component } from 'react';
import Month from './Month';
import monthService from '../services/monthService';
import './Calendar.css';

class Calendar extends Component {
  constructor() {
    super();
    const today = new Date();
    this.state = {
      month: today.getMonth(),
      year: today.getFullYear(),
    };
  }

  getMonthClass(index) {
    const { month } = this.state;
    return month === index ? 'btn-success' : '';
  }

  setMonth(index) {
    this.setState({
      month: index,
    });
  }

  render() {
    const { month, year } = this.state;
    return (
      <div>
        <div className="month-container">
          {monthService.getMonths().map((m, i) => (
            <div
              key={i}
              onClick={() => this.setMonth(i)}
              className={'month-button btn ' + this.getMonthClass(i)}
            >
              {m}
            </div>
          ))}
        </div>
        <Month month={month} year={year} />
      </div>
    );
  }
}

export default Calendar;
