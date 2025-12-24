import axios from './axios';

class FacultyService {
  createProfile(data) {
    // We store both student and faculty profiles in the same 'profiles' collection
    // The 'role' field in the user object helps distinguish them later
    return axios.post('/profiles', data);
  }

  getProfile(userId) {
    return axios.get(`/profiles?userId=${userId}`);
  }
}

export default new FacultyService();