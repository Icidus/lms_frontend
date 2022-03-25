import React, {useState, useEffect, Fragment} from 'react'
import { Table, Input, Button } from 'reactstrap'
import { accounts, accountTypes, buyers,vendors } from '../util/db'
import Alerts from '../controller/alerts'

function EditUsers(){

    useEffect(() => {
        getUsers()
        getAccountTypes()
        getBuyers()
        getVendors()
    }, []);

    const [users, setUsers] = useState([])
    const [accountType, setAccountType] = useState([])
    const [password, setPassword] = useState('')
    const [type, setType] = useState(0)
    const [buyer, setBuyer] = useState([])
    const [vendor, setVendor] = useState([])

    async function getUsers(){
        const search = await accounts('', 'retrieve')
        setUsers(search)
    }
    
    const getBuyers = async () => {
        const search = await buyers('', 'search', {'expand' : 'orders' })
        const { items, _meta } = search || []
        setBuyer(items)
    }    

    const getVendors = async () => {
        const results = await vendors("", "search")
        const { items, _meta } = results || []
        setVendor(items)
    }

    async function getAccountTypes(){
        const search = await accountTypes('', 'search')
        setAccountType(search)
    }

    const handleSubmit = (e, email, external_id) => {
        e.preventDefault()
        const data = {
            email: email,
            password_field: password,
            type:type,
            external_id: external_id
        }
        const update = accounts(data, 'adminUpdate')
        if(update){
            Alerts.success('User updated')
            setPassword('')
        } else {
            const error = {
                name: "Error",
                message: "There was a problem updating this account"
            }
            Alerts.error(error)
        }
    }

    const updateType = (e, index) => {
        var list = e.nativeEvent.target.selectedIndex;
        const user = users
        user[index].type = e.target.value
        user[index].type0 = e.nativeEvent.target[list].text
        setUsers(user)
        setType(e.target.value)
    }

    const updateLink = (e, index) => {
        const user = users
        user[index].external_id = e.target.value
        setUsers(user)
    }

    const updatePassword = (e, index) => {
        setPassword(e.target.value)
        setType(users[index].type)
    }


    return(
        <Table>
            <thead>
                <tr>
                   <th>First Name</th>
                   <th>Last Name</th>
                   <th>Email/Username</th>
                   <th>New Password</th>
                   <th>Type</th>
                   <th>Account Link</th>
                </tr>    
            </thead>
            <tbody>
                {users && users.length > 0? Object.keys(users).map((items, index) => 
                    <tr key={index}>
                        <td>{users[items].first_name}</td>
                        <td>{users[items].last_name}</td>
                        <td>{users[items].email}</td>
                        <td><Input type="password" onChange={e => updatePassword(e, index)} /></td>
                        <td>
                            <Input type='select' onChange={e => updateType(e, index)}>
                                {accountType && accountType.length > 0 ? Object.keys(accountType).map((set, index) => 
                                    <option selected={users[items].type0 && users[items].type0.type && users[items].type0.type ===  accountType[set].type ? 'selected' : ''} value={accountType[set].id}>{accountType[set].type}</option>
                                ): <option></option>}
                            </Input>
                        </td>  
                        <td>
                            {users[items].type === "3" ?
                                <Input type="select" onChange={e => updateLink(e, index)}>
                                <option value="">Select buyer...</option>
                                   {buyer && buyer.length > 0 ? Object.keys(buyer).map((item, index) => 
                                    <option selected={users[items].external_id == buyer[item].id ? 'selected' : ''} value={buyer[item].id}>{buyer[item].company_name}</option>
                                ): <option></option>}
                                </Input>
                            : users[items].type === '4' ?
                                <Input type="select" onChange={e => updateLink(e, index)}>
                                <option value="">Select vendor...</option>
                                {vendor && vendor.length > 0 ? Object.keys(vendor).map((item, index) => 
                                <option selected={users[items].external_id == vendor[item].id ? 'selected' : ''} value={vendor[item].id}>{vendor[item].company_name}</option>
                                ): <option></option>}
                                </Input>     
                            : ''}
                        </td>       
                        <td><Button color="primary" onClick={(e) => handleSubmit(e, users[items].email, users[items].external_id)}>Update</Button></td>
                    </tr>
                ) : ''} 
            </tbody>        
        </Table>    
    )
}

export default EditUsers