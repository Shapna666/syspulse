import axios from 'axios';

const axiosClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
  timeout: 15000,
});

export function downloadFile(url, filename) {
  return axiosClient
    .get(url, { responseType: 'blob', timeout: 60000 })
    .then((res) => {
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    });
}

export default axiosClient;