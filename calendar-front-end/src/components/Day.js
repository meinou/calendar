import React, { Component } from 'react';
import './Day.css';
import eventService from '../services/eventService';

class Day extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: null,
            date: null,
            dateUTC: null
        }
        this.getByDate = this.getByDate.bind(this);
        this.createList = this.createList.bind(this);
    }

    componentDidMount(){
        if(this.props.day && this.props.month && this.props.day) {
            this.getByDate();
        }
            


        
    }


    getByDate() {
        const month = this.props.month < 10 ? `0${this.props.month}` : this.props.month;
        const day = this.props.day < 10 ? `0${this.props.day}`: this.props.day;
        const date = `${this.props.year}${month}${day}`;
        // eventService.getByDate(date.toISOString().slice(0,10).replace(/-/g,""))
        eventService.getByDate(date)
            .then((resp) => {
                const data = resp.data;
                const events = [];
                for (var i = 0; i < data.length; i++){
                    const event = {};
                    const result = data[i];
                    event.id = result[0];
                    event.date = result[1];
                    event.title = result[2];
                    event.description = result[3];
                    event.address = result[4];
                    events.push(event);
                }
                this.setState({ events });
            })
    }

    createList() {
        return (    <ul>{  
            
            (this.props.last && this.props.day < 7) ? "" :   
                this.state.events.map((event) => {
                    const date = new Date(event.date);
                    return <li key={date.getTime() + date.getDate()}> 
                                    <span className="time">
                                        {date.getUTCHours()}:{date.getUTCMinutes()}
                                    </span> 
                                    {event.title}
                                    <i className="fas fa-times-circle"></i>      
                            </li>
                })} </ul>);
    }

    render() {
        // if(this.props.day && this.props.month && this.props.day)
        //     this.getByDate();
        const eventlist = this.state.events ? this.createList() : "";
        return(<div className="day"><div className="header"><span className="num">{this.props.day}</span><i className="fas fa-plus-square"></i></div> {eventlist}</div>);
    }
}

export default Day;