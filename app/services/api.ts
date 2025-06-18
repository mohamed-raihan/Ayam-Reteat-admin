import axios from 'axios';

// Create axios instance with custom config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://whatnext-mcve.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  }, // 10 seconds
});

//http://localhost:8000
//https://whatnext-mcve.onrender.com

export default api