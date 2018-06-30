import React, { Component } from 'react';
import Day from './Day';
import './Week.css';

class Week extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.createWeek = this.createWeek.bind(this);
  }

  isToday(date) {
    const today = new Date();
    return (
      today.getDate() === date.getDate() &&
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth()
    );
  }

  createWeek() {
    const { days, click, deleteHandle } = this.props;
    return days.map((day, i) => (
      <Day
        key={i}
        index={day.index}
        day={day.convertedDate.getDate()}
        click={click}
        header={this.isToday(day.convertedDate) ? 'Today' : ''}
        events={day.events}
        deleteHandle={deleteHandle}
      />
    ));
  }

  render() {
    return <div className="week">{this.createWeek()}</div>;
  }
}

export default Week;
