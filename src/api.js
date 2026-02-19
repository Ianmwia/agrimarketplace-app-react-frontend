{/* create the api helper */}

import axios from 'axios';

const API = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    withCredentials: true,
});

{/*Auto handle django csrf tokens */}
API.defaults.xsrfCookieName = 'csrftoken';
API.defaults.xsrfHeaderName = 'X-CSRFToken';

export default API;