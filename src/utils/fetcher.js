/**
 * https://github.com/axios/axios
 * 基于axios二次封装的request库，支持客户端和服务端
 */
import axios from 'axios'
import { redirect } from "react-router-dom";
import { message } from "antd";


export function fetcher(options) {
  let client = typeof window !== 'undefined'
  if(options.headers.title){
    options.headers.title = encodeURIComponent(options.headers.title)
  }
  //日期转时间戳
  if(options.headers.DATE && options.headers.DATE[0] && options.headers.DATE[1]){
    options.headers.startTime = new Date(options.headers.DATE[0].format('YYYY-MM-DD 00:00:00')).getTime() / 1000
    options.headers.endTime = new Date(options.headers.DATE[1].format('YYYY-MM-DD 23:59:59')).getTime() / 1000
  }
  const config = {
    // 测试
    baseURL: options?.baseURL || "http://192.168.1.179:8080",
    // baseURL: options?.baseURL || "/api",
    method: options.method || 'post',
    url: options.url,
    data: options.data,
    params: options.params,
    withCredentials: options.withCredentials || false, // 是否允许携带cookie
    ...options,
  }
  if (options?.headers) {
    const token = localStorage.getItem("token")
    if (token) {
      options.headers['token'] = token
    }
    config['headers'] = options.headers
  }
  return axios(config)
    .then(res => {
      //  token 过期
      if (res.data?.code === 401) {
        // message.error("token失效,请重新登录")
        localStorage.removeItem("token")
        return redirect("/login");
      }
      if (options.done) {
        // done回调里不能有window等客户端属性
        options.done(res.data)
      }
      return res.data
    })
    .catch(err => {
      console.error(err)
      if (err.response) {
        if (options.fail) {
          // fail回调里不能有window等客户端属性
          options.fail(err.response)
        }
        return err.response.data
      } else {
        return err
      }
    })
}