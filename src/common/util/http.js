import axios from 'axios'
import {Message} from 'element-ui'
import router from '../../router'
// axios.defaults.baseURL = '/manage-server'
let baseUrl = ''
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8;multipart/form-data'
/**
 * 对请求响应拦截处理
 */
axios.interceptors.response.use(success => {
  if(success.data.retCode && success.data.retCode==1001 ){
    Message.error({message:success.data.retInfo})
    return
  }
  if(success.data.retCode && success.data.retCode==1002 ){ //验证码错误
    Message.error({message:success.data.retInfo})
    return
  }
  if(success.data.retCode && success.data.retCode==200){
    Message.success({message: success.data.retInfo})
  }
  return success.data
}, err => {
  if(err.response.status == 504 || err.response.status==404){
    Message.error({message: '服务器被吃了( ╯□╰ )'})
  }else if(err.response.status==403){
    Message.error({message: '权限不足，请联系管理员'})
  }else if(err.response.status==401){ //未认证，跳转到登录页
    router.replace('/')
  }else{
    if(err.response.data.msg){
      Message.error({message: err.response.data.msg})
    }else{
      Message.error({message:'未知错误!'})
    }
  }
  return
})
export const postHttp = (url, params) =>{
  return axios({
    method: 'post',
    url: `${baseUrl}${url}`,
    data: params
  })
}

export const getHttp = (url, params) => {
  return axios({
    method: 'get',
    url: `${baseUrl}${url}`,
    params: params
  })
}

export const postFormHttp = (url, params) =>{
  return axios({
    method: 'post',
    url: `${baseUrl}${url}`,
    data: params,
    transformRequest: [(data)=>{
      let ret = '';
      for (const i in data) {
        ret += encodeURIComponent(i) + '=' +encodeURIComponent(data[i]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export const putHttp = (url, params) => {
  return axios({
    method: 'put',
    url: `${baseUrl}${url}`,
    data: params
  })
}
export const deleteHttp = (url, params) => {
  return axios({
    method: 'delete',
    url: `${baseUrl}${url}`,
    params: params
  })
}
