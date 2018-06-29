import axios from 'axios';

const eventService = {};

const baseUrl = 'http://localhost:8080/events';

eventService.getEvents = () => {
    return axios.get(baseUrl);
}

eventService.getByDate = (date) => {
    const url = `${baseUrl}/date/${date}`;
    return axios.get(url);
}

export default eventService;