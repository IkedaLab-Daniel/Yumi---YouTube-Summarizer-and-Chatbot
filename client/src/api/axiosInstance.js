import axios from 'axios';

// > Create Axios Instance with deafault config
const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:5001",
    timeout: 1000,
    headers: {
        
    }
})