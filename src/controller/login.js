import React from 'react'
import { Form, FormGroup, Input, Label, InputGroup, Button } from 'reactstrap'
import '../css/login.css'

export const LoginPage = ({ handleLoginChange, handleLoginSubmit,handleCreateNewPage }) => (
    <div className="login-form">
    <Form className="form-signin">
        <div className="text-center mb-4" style={{width: "172", height:"172"}}>
            <img className="mb-4 img-fluid" src="http://oconcomarketing.com/lms/images/backend_logo.png" alt="LMS logo" width="172" height="172"/>
        </div>
        <FormGroup>
            <Label for="email">Email Address</Label>
            <Input type="email" name="email" onChange={(e) => handleLoginChange(e)} placeholder="email address" required autoFocus />
        </FormGroup>
        <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" name="password" onChange={(e) => handleLoginChange(e)} placeholder="password" required />
        </FormGroup>
        <Button color="primary" className="btn-block" onClick={(e) => handleLoginSubmit(e)} type="submit">Submit</Button>{ ' '}
        {/* <Button color="primary" className="btn-block" onClick={(e) => handleCreateNewPage(e)} type="submit">Create new account</Button> */}
    </Form>
    </div>
)

export const PasswordChange = ({handleLoginUpdateChange, handleLoginUpdateSubmit, handleLoginUpdateChangeVerify }) => (
    <div className="login-form">
    <Form className="form-signin">
        <div className="text-center mb-4" style={{width:"172", height:"172"}}>
            <img className="mb-4 img-fluid" src="http://oconcomarketing.com/lms/images/backend_logo.png" alt="LMS logo"/>
        </div>
        <FormGroup>
            <Label for="password">New Password</Label>
            <Input type="password" name="password" onChange={(e) => handleLoginUpdateChange(e)} placeholder="password" required />
        </FormGroup>
        <FormGroup>
            <Label for="password">New Password Verify</Label>
            <Input type="password" name="password" onChange={(e) => handleLoginUpdateChangeVerify(e)} placeholder="password" required />
        </FormGroup>
        <Button color="primary" className="btn-block" onClick={(e) => handleLoginUpdateSubmit(e)} type="submit">Update</Button>{ ' '}
    </Form>
    </div>
)


export const CreateAccount = ({ handleAccountCreationSubmit, handleCreationChange }) => (
    <div className="login-form">
    <Form className="form-signin">
        <FormGroup>
            <Label for="email">Email Address</Label>
            <Input type="email" name="email" onChange={(e) => handleCreationChange(e)} placeholder="email address" required autofocus />
        </FormGroup>
        <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" name="password" onChange={(e) => handleCreationChange(e)} placeholder="password" required />
        </FormGroup>
        <FormGroup>
            <Label for="password">First Name</Label>
            <Input type="text" name="first_name" onChange={(e) => handleCreationChange(e)} required />
        </FormGroup>
        <FormGroup>
            <Label for="password">Last Name</Label>
            <Input type="text" name="last_name" onChange={(e) => handleCreationChange(e)} required />
        </FormGroup>
        <FormGroup>
            <Label for="phone">Phone</Label>
            <Input type="text" name="phone" onChange={(e) => handleCreationChange(e)} required />
        </FormGroup>
        <FormGroup>
            <Label for="password">Type</Label>
            <Input type="text" name="type" onChange={(e) => handleCreationChange(e)} required />
        </FormGroup>
        <Button color="primary" className="btn-block" onClick={(e) => handleAccountCreationSubmit(e)} type="submit">Create Account</Button>        
    </Form>
    </div>
)