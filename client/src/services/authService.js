import axios from 'axios';

// Adjust this URL to your actual authentication endpoint
const API_URL = '/api/auth/';

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}login`, userData);

  if (response.data && response.data.token) {
    // This assumes your backend sends a response like:
    // { success: true, token: 'jwt_token_here', user: { _id: '...', name: '...', ... } }

    // We combine the user object and the token into one object for storage.
    const userToStore = {
      ...response.data.user,
      token: response.data.token,
    };

    // Now, we save the complete object to localStorage.
    localStorage.setItem('user', JSON.stringify(userToStore));
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  login,
  logout,
};

export default authService;

