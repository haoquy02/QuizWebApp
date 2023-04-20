import axios from 'axios'
export const BASE_URL = 'http://localhost:5177/';
export const ENDPOINTS = {
    participant: 'participants',
    authenticate: 'participants/Authenticate',
    question:'questions',
    getAnswers:'questions/GetAnswers',
    createAccount:'participants/CreateAccount'
}
export const createAPIEndpoint = endpoint =>{
    let url = BASE_URL + 'api/' + endpoint + '/';
    return {
        fetch:()=> axios.get(url, {withCredentials: true }),
        post: newRecord => axios.post(url, newRecord, { withCredentials: true  }),
        put: (updatedRecord) => axios.put(url, updatedRecord, { withCredentials: true }),
        delete:()=>axios.delete(url, {withCredentials: true }),
    }
}
export const createAPIWithoutAuthentication = endpoint =>{
    let url = BASE_URL + 'api/' + endpoint + '/';
    return {
        fetch:()=>axios.get(url,{withCredentials: true }),
        getLogin: (data) => axios.post(url,data,{withCredentials: true}),
        postCreateAccount: (newAccount, password) => axios.post(url,newAccount, {params:{
            password
        }}),
    }
}