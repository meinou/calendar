import axios from 'axios';

const eventService = {};

const baseUrl = 'http://localhost:8080/events';

eventService.getEvents = () => {
  return axios.get(baseUrl);
};

eventService.getForMonth = (date) => {
  const url = `${baseUrl}/month/${date}`;
  return axios.get(url);
};

eventService.getByDate = (date) => {
  const url = `${baseUrl}/date/${date}`;
  return axios.get(url);
};

eventService.delete = (id) => {
  const url = `${baseUrl}/${id}`;
  return axios.delete(url);
};

eventService.post = (newEvent) => {
  return axios.post(baseUrl, newEvent);
};

export default eventService;
