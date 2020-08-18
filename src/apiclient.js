import axios from 'axios';

const BASE_URI = 'http://localhost:5000';

const client = axios.create({
  baseURL: BASE_URI,
  json: true
});

class APIClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  getSchedules() {
    return this.perform('get', '/schedule');
  }

  getSchedule(id) {
    return this.perform('get', `/schedule/${id}`)
  }

  createSchedule(schedule) {
    return this.perform('post', '/schedule', schedule);
  }

  updateSchedule(schedule) {
    return this.perform('put', `/schedule/${schedule.id}`, schedule);
  }

  deleteSchedule(schedule) {
    return this.perform('delete', `/schedule/${schedule.id}`);
  }

  /*async*/ perform (method, resource, data) {
    return client({
      method,
      url: resource,
      data,
      headers: {}
      // headers: {
      //   Authorization: `Bearer ${this.accessToken}`
      // }
    }).then(resp => {
      return resp.data ? resp.data : [];
    })
  }
}

export default APIClient;