import { useReducer } from 'react'
import createUseContext from 'constate'

const initialState =  {
    access_key: '',
    email: '',
    password: ''
}

const reducer = (state, action) => {
    switch(action.type){
        case 'UPDATE_STATE':
        return {
            ...state,
            [action.payload.item] : action.payload.value
        } 
        case 'UPDATE_TOKEN':
        return {
            ...state,
            access_key : action.payload
        }
        default: 
            throw new Error()      
    }
}

const useLoggedInStatus = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { 
        access_key,
        email,
        password
    } = state
    const updateLogin = (item, value) => {
        dispatch({
            type: "UPDATE_STATE",
            payload: {
                item: item,
                value: value
            }
        })
    }
    const updateToken = (value) => {
        dispatch({
            type: "UPDATE_TOKEN",
            payload: value
        })
    }
    return { 
        access_key,
        updateLogin,
        updateToken,
        email,
        password
    }
}

export const useLmsContext = createUseContext(useLoggedInStatus);