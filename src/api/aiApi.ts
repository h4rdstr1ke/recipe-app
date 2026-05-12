import axios from 'axios';

export const aiApi = axios.create({
    baseURL: import.meta.env.VITE_AI_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true' // пропустить страницу-предупреждение
    }
});