import axios from 'axios';

const instance = axios.create({
  baseURL:
    'https://identity-api.mangofield-2f4eea69.brazilsouth.azurecontainerapps.io/',
});

export default instance;
