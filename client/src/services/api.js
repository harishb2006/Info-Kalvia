export const API_BASE_URL = 'https://info-kalvia.onrender.com/api';
// export const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const authService = {
  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    localStorage.removeItem('token');
    return response.json();
  }
};

export const studentService = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/students/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    if (!response.ok) {
      const error = await response.json();
      const err = new Error(error.error || 'Failed to fetch profile');
      err.status = response.status;
      throw err;
    }
    return response.json();
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/students/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(profileData)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }
    return response.json();
  },

  deleteApplication: async (applicationId) => {
    const response = await fetch(`${API_BASE_URL}/students/profile/applications/${applicationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete application');
    }
    return response.json();
  }
};
