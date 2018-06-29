import React, { Component } from 'react';
import Week from './Week';
import './Month.css';
import eventService from '../services/eventService';

class Month extends Component {
    constructor() {
        super();
        this.state = {
            currentMonth: 7,
            currentYear: 2018,
            currentEvents: null,
            months : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        }
        this.createMonth = this.createMonth.bind(this);
        this.getEvents = this.getEvents.bind(this);
        this.getByDate = this.getByDate.bind(this);
    }

    componentDidMount() {
        this.getEvents();
    }

    getEvents() {
        eventService.getEvents()
            .then((resp) => {
                console.log(resp.data);
                this.setState({ currentEvents: resp.data});
            })
            .catch(err => {
                console.log('this is my err ', err)
            });
    }

    getByDate() {
        const date = new Date('07 July 2018 14:48 UTC');
        
        eventService.getByDate(date.toISOString().slice(0,10).replace(/-/g,""))
            .then((resp) => {
                console.log(resp.data);
            })
    }

    createMonth() {
        let weeks = [];
        var month = this.state.currentMonth < 10 ? `0${this.state.currentMonth}` : `${this.state.currentMonth}`;
        const first = new Date(`2018-${month}-01T14:52:23.176+0000`);
        const dayOfWeek = first.getDay();
        console.log("sunday: " + dayOfWeek);
        const numOfDays = 30;
  
        const numWeeks = numOfDays % 7 - dayOfWeek < 7 ? numOfDays / 7  : numOfDays / 7 - dayOfWeek - 1;
        for (var i = 0; i <= numWeeks; i++) {
            const week = {};
            week.number = i + 1;

            if (i === 0) week.dayOfWeek = dayOfWeek;
            else week.dayOfWeek = 0;
            week.firstDay = i* 7 + dayOfWeek + 1;
           
            if (i === numOfDays/7 + 1) week.lastDay = numOfDays % 7 - dayOfWeek;
            else week.lastDay = week.firstDay + 7 > numOfDays ? numOfDays : week.firstDay + 7;
            weeks.push(week);

        }

        return weeks.map((week) => {
            return (<Week key={week.number} month={this.state.currentMonth} year={this.state.currentYear} firstDay={week.firstDay} dayOfWeek={week.dayOfWeek} lastDay={week.lastDay}/>);
        })
    }

    render() {
        const month = this.createMonth();
        return(<div>
                    <p>{this.state.months[this.state.currentMonth - 1]}, {this.state.currentYear}</p>
                    <div className="month">{month}</div>
        </div>);
    }
}

export default Month;