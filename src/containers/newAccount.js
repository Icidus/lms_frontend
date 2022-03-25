import React, { useState, useEffect } from 'react'
import { Form, FormGroup, Input, Label, InputGroup, Button, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { accounts, accountTypes } from '../util/db'
import Alerts from '../controller/alerts'

function NewAccount(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [type, setType] = useState(1)
    const [phone, setPhone] = useState('')
    const [accountType, setAccountType] = useState([])

    useEffect(() => {
        getAccountTypes()
    }, [])

    async function getAccountTypes(){
        const search = await accountTypes('', 'search')
        setAccountType(search)
    }

    const handleCreationChange = e => {
        const createNewAccount = this.state.createNewAccount
        createNewAccount[e.target.name] = e.target.value
        this.setState({
          createNewAccount
        })
      }

    const handleAccountCreationSubmit = async e => {
        e.preventDefault()
        const data = {
          email: email
        }  

        const createAccount = {
            email: email,
            password: password,
            first_name: first_name,
            last_name: last_name,
            type: type,
            phone: phone
        }
        const account = await accounts(data, 'verify')
        if(account){
            Alerts.success('You already have an account')
        } else {
          const create = await accounts(createAccount, 'accountCreation')
          if(create){
             Alerts.success('Account successfully created')
          } else {
            const error = {
              name: 'Account creation',
              message: "There was a problem creating your account."
            }
            Alerts.error(error)
          }
        }   
      }

      const Bread = (props) => {
        return (
          <div>
            <Breadcrumb>
              <BreadcrumbItem active>New Account</BreadcrumbItem>
            </Breadcrumb>
          </div>
        );
      };
  
    

      return(
        <div>
            <Bread />  
        <div className="login-form">
        <Form className="form-signin" onSubmit={handleAccountCreationSubmit}>
            <FormGroup>
                <Label for="email">Email Address</Label>
                <Input type="email" value={email} name="email" onChange={event => setEmail(event.target.value)} placeholder="email address" required autofocus />
            </FormGroup>
            <FormGroup>
                <Label for="password">Password</Label>
                <Input type="password" value={password} name="password" onChange={event => setPassword(event.target.value)} placeholder="password" required />
            </FormGroup>
            <FormGroup>
                <Label for="password">First Name</Label>
                <Input type="text" value={first_name} name="first_name" onChange={event => setFirstName(event.target.value)} required />
            </FormGroup>
            <FormGroup>
                <Label for="password">Last Name</Label>
                <Input type="text" value={last_name} name="last_name" onChange={event => setLastName(event.target.value)} required />
            </FormGroup>
            <FormGroup>
                <Label for="phone">Phone</Label>
                <Input type="text" value={phone} name="phone" onChange={event => setPhone(event.target.value)} required />
            </FormGroup>
            <FormGroup>
                <Label for="password">Type</Label>
                <Input type='select' onChange={event => setType(event.target.value)}>
                    {accountType ? Object.keys(accountType).map((set, index) => 
                        <option selected={type === accountType[set].type ? 'selected' : ''} value={accountType[set].id}>{accountType[set].type}</option>
                    ): <option></option>}
                </Input>
            </FormGroup>
            <Button color="primary" className="btn-block" type="submit">Create Account</Button>        
        </Form>
        </div>
        </div>
      )
}

export default NewAccount