import React, { Component } from 'react';
import Day from './Day';
import './Week.css';

class Week extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.createWeek = this.createWeek.bind(this);
  }

  createWeek() {
    const { days, click, deleteHandle } = this.props;
    return days.map((day, i) => (
      <Day
        key={i}
        index={day.index}
        day={day.convertedDate.getDate()}
        click={click}
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
