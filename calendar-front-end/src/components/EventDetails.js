import React, { Component } from 'react';
import './EventDetails.css';

const defaultNewEvent = {
  title: '',
  description: '',
  time: '00:00',
  address: '',
};

class EventDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: Object.assign({}, defaultNewEvent),
    };

    this.updateEvent = this.updateEvent.bind(this);
    this.getFormattedTime = this.getFormattedTime.bind(this);
  }

  componentDidMount() {
    const { event } = this.props;
    this.setState({ event: event ? event : defaultNewEvent });
  }

  updateEvent() {
    const { update, dayToUpdate } = this.props;
    const { event } = this.state;
    if (!event.time && event.date) {
      event.time = this.getFormattedTime();
      this.setState({ event });
    }
    if (update) {
      update(dayToUpdate, event);
    }
    this.closeForm();
  }

  closeForm() {
    const { close } = this.props;
    this.setState({
      event: Object.assign({}, defaultNewEvent),
    });
    if (close) {
      close();
    }
  }

  inputHandler(property, e) {
    const { event } = this.state;
    event[property] = e.target.value;
    this.setState({ event });
  }

  getFormattedTime() {
    const { event } = this.state;
    if (event) {
      const date = new Date(event.date);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    }
    return null;
  }

  render() {
    const { event } = this.props;
    const { id, title, description, address, time } = this.state.event;
    return (
      <div className="addform">
        <div>{event && event.title}</div>
        <i className="fas fa-times-circle" onClick={() => this.closeForm()} />

        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={this.inputHandler.bind(this, 'title')}
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="Title"
          />
        </div>

        <input
          type="text"
          value={description}
          onChange={this.inputHandler.bind(this, 'description')}
          className="form-control"
          aria-describedby="emailHelp"
          placeholder="Description"
        />

        <input
          type="text"
          value={address}
          onChange={this.inputHandler.bind(this, 'address')}
          className="form-control"
          aria-describedby="emailHelp"
          placeholder="Address"
        />

        <div className="form-group">
          <input
            value={time ? time : this.getFormattedTime()}
            type="time"
            onChange={this.inputHandler.bind(this, 'time')}
            className="form-control"
            id="appt-time"
            required
          />
        </div>
        <div className="form-check" />

        <button onClick={this.updateEvent} className="btn btn-primary">
          {id ? 'Save event' : 'Add event'}
        </button>
      </div>
    );
  }
}

export default EventDetail;
