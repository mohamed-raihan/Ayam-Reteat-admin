import axios from 'axios';

// Create axios instance with custom config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

//http://localhost:8000
//https://backend.ayamretreat.com

export default api