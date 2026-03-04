{/* create the api helper */}
const baseURL = import.meta.env.VITE_API_BASE_URL|| "http://localhost:8000/api/";

import axios from 'axios';

const API = axios.create({
    baseURL: baseURL,
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
    return null;
}

API.interceptors.request.use(async (config) => {
    if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
        let csrfToken = getCookie('csrftoken');

        //if (!) do not call always just when no token is available
        if (!csrfToken){
            try{
                await API.get(`${baseURL}csrf/`, {withCredentials:true})
                csrfToken = getCookie('csrftoken')
            }catch (error){
                console.error("csrf fetch failed", error)
            }
            // await axios.get(`${baseURL}csrf/`, { withCredentials: true });
            // csrfToken = getCookie('csrftoken');

        }
        if (csrfToken){
            config.headers['X-CSRFToken'] = csrfToken
        }

        //config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
});

export default API;