import axios from './axios';

class StudentService {
  createProfile(data) {
    // Post to 'profiles' collection in db.json
    return axios.post('/profiles', data);
  }

  getProfile(userId) {
    return axios.get(`/profiles?userId=${userId}`);
  }
}

export default new StudentService();