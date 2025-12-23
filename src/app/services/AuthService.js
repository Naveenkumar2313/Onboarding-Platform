import axios from './axios';

class AuthService {
  // Mock Login: In reality, this checks the mock DB for a matching user
  async login(email, password) {
    // json-server filtering: /users?email=x&password=y
    const response = await axios.get(`/users?email=${email}&password=${password}`);
    if (response.data.length > 0) {
      return response.data[0]; // Return the found user
    }
    throw new Error('Invalid email or password');
  }

  async register(email, role) {
      // This will be used by Admin to invite users later
      return await axios.post('/users', { email, role, password: 'tempPassword123' });
  }
}

export default new AuthService();