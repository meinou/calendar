import React, { Component } from 'react';
import Day from './Day';
import './Week.css';

class Week extends Component {
    constructor(props) {
        super(props);
        this.state = {
            last: false
        }
        this.createWeek = this.createWeek.bind(this);
    }

    componentDidMount() {
        if (7 - (this.props.lastDay -  this.props.firstDay))
            this.setState({ last: true});
    }

    createWeek() {
        let days = [];
        
        if (this.props.key == 1) {
            //push days from previous month
        }


        for (var i = this.props.firstDay; i < this.props.lastDay; i++) {
            days.push(i);
        }

        for (var i = 0; i < 7 - (this.props.lastDay -  this.props.firstDay); i++) {
            if (i === 0) {
                days.push(this.props.lastDay);
                
            }
            else 
            days.push(i);
        }

        return days.map((day) => {return <Day key={day} last={this.state.last} month={this.props.month} year={this.props.year} day={day}/>});
    }

    render() {
        const week = this.createWeek();
        return (<div className="week">{week}</div>);
    }
}

export default Week;