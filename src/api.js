{/* create the api helper */}

import axios from 'axios';

const API = axios.create({
    baseURL: "http://localhost:8000/api/",
    withCredentials: true,
});

{/*Auto handle django csrf tokens */}
API.defaults.xsrfCookieName = 'csrftoken';
API.defaults.xsrfHeaderName = 'X-CSRFToken';

{/*add interceptor to get cookies */}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

API.interceptors.request.use(async (config) => {
    if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
        let csrfToken = getCookie('csrftoken');

        if (csrfToken){
            await axios.get('http://localhost:8000/api/csrf/', { withCredentials: true });
            csrfToken = getCookie('csrftoken');
        }

        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
});

export default API;