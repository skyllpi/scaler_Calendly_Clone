const BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:4000'
  : 'https://scalercalendlyclone-production.up.railway.app';

export default BASE_URL;
