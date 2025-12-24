import axios from './axios';

class AdminService {
  // Get all profiles that are 'Pending Verification'
  getAllPendingApplications() {
    return axios.get('/profiles?status=Pending Verification');
  }

  // Approve an application
  approveApplication(profileId) {
    return axios.patch(`/profiles/${profileId}`, { status: 'Verified' });
  }

  // Reject an application
  rejectApplication(profileId) {
    return axios.patch(`/profiles/${profileId}`, { status: 'Rejected' });
  }
}

export default new AdminService();