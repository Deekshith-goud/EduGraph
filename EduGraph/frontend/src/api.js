import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const uploadData = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const fetchStudents = () => api.get('/students');

// Actually, in our current backend, /students returns all info.
// If we had a separate detail endpoint we'd use it.
// For now, fetchStudents returns everything we need for the list.
