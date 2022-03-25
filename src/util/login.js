import { 
    base,
    account
} from '../config/endpoints'
import queryString from 'query-string'

export const accounts = async (content = '', type = "search", params = {}) => {
    switch(type){
        case 'login':
        case 'accountCreation':
        case 'verify' : 
        case 'update':
        return post(`${base}${account[type]}`, content)
    }

}    


const post = async (string, content) => {
        try {
            const response = await fetch(string, {
                method: 'POST',
                body: JSON.stringify(content)
            }) 
            return response.json()
        } catch (e) {
            catchError('', e)
        }
    }

    

const responseHandling = async response => {
        switch(response.status){
            case 200: 
            case 201:
            case 304:
                 return await response.json()
            break;
            case 204:
                return {}
            case 400:
                return await catchError('Bad Request', response.statusText)    
            break;
            case 401:
            case 403:
                return await catchError('Authentication failed', response.statusText)
            break;
            case 404:
                return await catchError("Doesn't exist", response.statusText)
            break;
            case 405: 
                return await catchError('Method not allowed', response.statusText)
            break;
            case 422:
                return await catchError('Data Validation Fail', response.statusText)
            break;
            case 500:
                return await catchError('Internal Server error', response.statusText)
            break;
            default:
                return await catchError('There was an error.  Check your internet connection', '')                      
        }
    }

const catchError = (value, e) => {
        const error = {
            name: value,
            message: e
        }
        return console.log(error)
    }
