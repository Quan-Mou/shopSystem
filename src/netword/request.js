// import axios from 'axios'
// export function request(config) {
//   const instance = axios.create({
//     baseURL='https://www.liulongbin.top:8888/api/private/v1',
//     timeout: 5000
//   })
//   return instance(config)
// }

import axios from "axios"

export default function request(config) {
  const instance = axios.create({
    // baseURL: 'http://123.207.32.32:8000/home/multidata',
    baseURL: 'https://www.liulongbin.top:8888/api/private/v1',

    timeout: 5000
  })

  instance.interceptors.request.use(config => {
    // console.log('请求拦截');
    return config
  }, err => {
    // console.log('拦截失败！！！');
    return err
  })

  instance.interceptors.response.use(response => {
    console.log('来到响应拦截');
    return response;
  }, err => {
    console.log('响应拦截失败！！！');
    return err
  })

  return instance(config);
}



