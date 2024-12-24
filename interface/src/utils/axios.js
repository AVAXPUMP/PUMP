import axios from 'axios';

// 创建 Axios 实例
const instance = axios.create({
    // baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '', // 根据环境设置 baseURL
    baseURL: process.env.NODE_ENV === 'development' ? 'https://avaxpump.com/' : '', // 根据环境设置 baseURL

});

// 你可以在这里添加请求拦截器和响应拦截器
instance.interceptors.request.use(config => {
    // 在发送请求之前做些什么
    return config;
}, error => {
    return Promise.reject(error);
});

instance.interceptors.response.use(response => {
    // 对响应数据做点什么
    return response;
}, error => {
    return Promise.reject(error);
});

export default instance;