import { 
    base, 
    verticals, 
    buyer , 
    fieldDefinitions, 
    leadsData, 
    vendor, 
    verticalFieldDefinitions, 
    verticalDuplicateChecks,
    offers,
    order,
    zipcodes,
    leads,
    buyerVerticals,
    buyerFieldDefinitions,
    buyerZipCodes,
    account,
    accountType,
    dashboard,
    universalFieldDefinitions,
    buyerDelivery,
    reports,
    processQueue
} from '../config/endpoints'
import queryString from 'query-string'

const storage = JSON.parse(sessionStorage.getItem('account'))
const localAccount = storage && storage.account ? storage.account : ''
const { access_token } = localAccount || ''

export const accounts = async (content = '', type = "search", params = {}, access = '') => {
    switch(type){
        case 'login':
        case 'accountCreation':
        case 'verify' : 
        case 'update':
        case 'adminUpdate':
        case 'externalID':
            return post(`${base}${account[type]}`, content, access)
        break    
        case 'retrieve':
            return get(`${base}${account[type]}`, access)
        break    
        default:
            return post(`${base}${account[type]}`, content, access)
        break
    }

}    

export const dashboards = async (content = '', type = "", params = {}, access = '') => {
    switch(type){
        default:
            return get(`${base}${dashboard[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, access)
        break;   
    }
}

export const accountTypes = async (content = '', type = "search", params = {}, access = '') => {
    switch(type){
        case 'search':
            return get(`${base}${accountType[type]}`, access)
        break 
        default:
            return get(`${base}${accountType[type]}`, access)
        break;   
    }
}

export const vertical =  async (content = '', type = "search", params = {}, access = '') => {
    switch(type){
        case 'search':
        case 'fields':
        case 'offers':
            return get(`${base}${verticals[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, access)
        break
        case 'update':
            return post(`${base}${verticals[type]}`, content, access)
        break
        case 'delete':
            return deleteData(`${base}${verticals[type]}${content.id}`, access)
        break   
        case 'filter':
            return post(`${base}${verticals[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, content, access)
        break
        default:
         return post(`${base}${verticals[type]}`, content, access)
       break  
    }
    }

export const verticalFieldDefinition =  async (content = '', type = "search", params = {}, access = '') => {

        switch(type){
            case 'search':
            case 'mapping':
                return await get(`${base}${verticalFieldDefinitions[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, access)
            break
            case 'update':
            case 'update-ping':
            case 'update-post':
            case 'create':
                return post(`${base}${verticalFieldDefinitions[type]}`, content, access)
            break
            default:
                return post(`${base}${verticalFieldDefinitions[type]}`, content, access)
            break

        }
    }

export const verticalDuplicateCheck =  async (content = '', type = "search", params = {}, access = '') => {
        switch(type){
            case 'search':
                return get(`${base}${verticalDuplicateChecks[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, access)
            break
            case 'update':
                return post(`${base}${verticalDuplicateChecks[type]}`, content, access)
            break
            case 'create':
                return post(`${base}${verticalDuplicateChecks[type]}`, content, access)
            break
            default:
            return get(`${base}${verticalDuplicateChecks[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, access)
            break;
        }
    }


export const buyers = async(content = '', type = "search", params = {}, access = '') => {
    switch(type){
        case 'search':
        case 'leads':
        case 'status':
        case 'response':
        case 'alerts':
        case 'buyer-vendors':
        case 'buyer-delivery-response':
        case 'buyer-custom-format':
            return get(`${base}${buyer[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, access)
        break
        case 'filter':
        case 'update':
        case 'display':
        case 'display_zipcodes':
        case 'delivery-manual':
        case 'buyer-vendors-delete':
        case 'buyer-delivery-response-filter':
            return post(`${base}${buyer[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, content, access)
        break
        case 'delete':
            return post(`${base}${buyer[type]}`, content, access)
        break    
        default:
            return post(`${base}${buyer[type]}`, content, access)
        break    
    }
}

export const buyerVertical = async(content = '', type = "search", params = {}, access = '') => {
    switch(type){
        case 'search':
            return get(`${base}${buyerVerticals[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, access)
        break
        case 'add':
            return post(`${base}${buyerVerticals[type]}`, content, access)
        break     
    }        
} 

export const buyerFieldDefinition = async(content = '', type = "search", params = {}, access = '') => {
    switch(type){
        case 'add':
        case 'update':
        case 'buyer':
        case 'custom':
        case 'delete':
            return post(`${base}${buyerFieldDefinitions[type]}`, content, access)
        break
    }
}    

export const buyerDeliverys = async(content = '', type = "search", params = {}, access = '') => {
    switch(type){
        case 'all':
        case 'vertical':
        case 'update':
        case 'delete':
        case 'delivery-manual':
            return post(`${base}${buyerDelivery[type]}`, content, access)
        break
    }
}    

export const buyerZipCode = async(content = '', type = "search", params = {}, access = '') => {
    switch(type){
        case 'distance':
        case 'state':
        case 'manual':
        case 'update':
        case 'delete':
        case 'update-all':
        case 'delete-state':
            return post(`${base}${buyerZipCodes[type]}`, content, access)        
        break
        case 'search':
        case 'search-state':
            return get(`${base}${buyerZipCodes[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, access)
        break
        default:
        break;
    }  

}

export const zipcode = async(content = '', type = "search", params = {}, access = '') => {
    switch(type){
        case 'distance':
        case 'state':
        case 'city':
            return get(`${base}${zipcodes[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, access)
        break
        default:
        break;
    }

}    

export const orders = async(content = '', type = "search", params = {}, access = '') => {
    switch(type){
        case 'search':
        case 'all':
        case 'by-id':
        case 'vertical':
            return get(`${base}${order[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, access)
        break
        case 'filter':
        case 'sort':
        case 'update':
            return post(`${base}${order[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, content, access)
        break
        default:
            return post(`${base}${order[type]}`, content, access)
        break    
    }
}

export const vendors =  async (content = '', type = "search", params = {}, access = '') => {
    switch(type){
        case 'search':
            return get(`${base}${vendor[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, access)
        break
        case 'add':
            return post(`${base}${vendor[type]}`, content, access)
        break;    
        case 'update':
            return post(`${base}${vendor[type]}${content.id}`, content, access)
        break
    }
}


export const leadData = async(content = '', type = "search", params = {}, access = '') => {
    switch(type){
        case 'search':
        case 'by-id':
        return get(`${base}${leadsData[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, access)
        break;
        case 'update':
        case 'updateData':
        return post(`${base}${leadsData[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, content, access)
        break;
    }
}  

export const report = async(content = '', type = "vendor", params = {}, access = '') => {
    switch(type){
        case 'vendor':
        case 'lead-data':
        case 'alert':
        case 'alert-all':
        case 'alert-dashboard':
        case 'buyer':
        case 'buyer-vendor-report':
            return get(`${base}${reports[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, access)
        break;
        case 'alert-filter':
        case 'alert-update':
        case 'lead-by-id':
            return post(`${base}${reports[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, content, access)
        break;
    }    
}  

export const lead = async(content = '', type = "search", params = {}, access = '') => {
    switch(type){
        case 'all':
        case 'sold':
        case 'search':
        case 'pivot':
        case 'pivot-sold':
        case 'pivot-vertical':
        case 'status':
        case 'by-id':
        case 'get-return-lead':
        case 'get-by-order':
        case 'stack-id':
        case 'stack':
        case 'pivot-lead':
        case 'status-id':
        case 'delivery-example':
        case 'get-submit-files':
        case 'get-processed-files':
            return get(`${base}${leads[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, access)
        break
        case 'filter':
        case 'id':
        case 'manual':
        case 'direct-sell':
        case 'update-status':
        case 'update-qccomments':
        case 'return-lead':
        case 'check-sell':
        case 'bulk':
        case 'stack-filter':
        case 'buyer-leads':
        case 'buyer-leads-export':
        case 'buyer-leads-verticals':
        case 'update':
        case 'send-file':
        case 'delete-process-file':
        case 'delivery-test-search':
            return post(`${base}${leads[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, content, access)
        break
        case 'format-post-values':
            return postRaw(`${base}${leads[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, content, access)
        break
    }

}    

export const fieldDefinition = async(content = '', type = "search", params = {}, access = '') => {
    switch(type){
        case 'search':
            return get(`${base}${fieldDefinitions[type]}`, access)   
        break
        case 'create':
            return post(`${base}${fieldDefinitions[type]}`, content, access)
        break
        default:
            return post(`${base}${fieldDefinitions[type]}`, content, access)
        break
    }
}  

export const universalFieldDefinition = async(content = '', type = "search", params = {}, access = '') => {
    switch(type){
        case 'search':
            return get(`${base}${universalFieldDefinitions[type]}`, access)   
        break
        case 'create':
            return post(`${base}${universalFieldDefinitions[type]}`, content, access)
        break
        default:
            return post(`${base}${universalFieldDefinitions[type]}`, content, access)
        break
    }
}  

export const processQueues = async(content = '', type = "search", params = {}, access = '') => {
    switch(type){
        case 'search':
            return get(`${base}${processQueue[type]}`, access)   
        break
    }
} 

export const offer = async(content = '', type = "search", params = {}, access = '') => {
    switch(type){
        case 'search':
        case 'display':
            return get(`${base}${offers[type]}${Object.keys(params).length ? `?${queryString.stringify(params)}` : ''}`, access)
        break;
        default:
        return post(`${base}${offers[type]}`, content, access)
        break;
    }
}  

const get = async (string, access, retries = 5) => {
        const accessCheck = checkToken(access)
        try {
            let response = await fetch(string.includes('?') ? `${string}&access-token=${accessCheck}` : `${string}?access-token=${accessCheck}`)
            return responseHandling(response, string, access, '', 'get', retries) 
        } catch (e) {
            catchError('', e)
        }
    }

const post = async (string, content, access, retries = 5) => {
    const accessCheck = checkToken(access)
        try {
            const response = await fetch(string.includes('?') ? `${string}&access-token=${accessCheck}` : `${string}?access-token=${accessCheck}`, {
                method: 'POST',
                body: JSON.stringify(content)
            }) 
            return responseHandling(response, string, access, content, 'post', retries)
        } catch (e) {
            catchError('', e)
        }
    }

    const postRaw = async (string, content, access, retries = 5) => {
        const accessCheck = checkToken(access)
            try {
                const response = await fetch(string.includes('?') ? `${string}&access-token=${accessCheck}` : `${string}?access-token=${accessCheck}`, {
                    method: 'POST',
                    body: JSON.stringify(content)
                }) 
                return response.text()
            } catch (e) {
                catchError('', e)
            }
        }    

const put = async (string, content, access, retries = 5) => {
    const accessCheck = checkToken(access)

        try {
            const response = await fetch(string.includes('?') ? `${string}&access-token=${accessCheck}` : `${string}?access-token=${accessCheck}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(content)
            }) 
            return response.json()
        } catch (e) {
            catchError('', e)
        }
    }
 
const deleteData = async (string, access) => {
    const accessCheck = checkToken(access)

        try {
            const response = await fetch(string.includes('?') ? `${string}&access-token=${accessCheck}` : `${string}?access-token=${accessCheck}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            }) 
            return true
        } catch (e) {
            catchError('', e)
        }
    }

 const checkToken = (token) => {
    const storage = JSON.parse(sessionStorage.getItem('account'))
    const localAccount = storage && storage.account ? storage.account : ''
    const { access_token } = localAccount || ''
    if(token !== ''){
        return token
    } else if(access_token !== ''){
        return access_token
    } else {
        return ''
    }
 }


const responseHandling = async (response, string, access, content = '', type, retries) => {
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
                if(retries === 0){
                    return await catchError('Internal Server error', response.statusText)
                } else if(type === 'get'){
                    return await get(string, access, retries - 1);
                } else if(type === 'post'){
                    return await post(string, content, access, retries - 1);
                }
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
