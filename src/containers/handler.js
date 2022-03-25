import React, { useState, useEffect, Fragment } from 'react';
import { Header } from '../controller/header'
import { RoutesAdmin, RoutesEmployee, RoutesBuyer, RoutesVendor } from '../controller/router'
import Sidebar from '../controller/sidebar'
import { LoginPage, PasswordChange, CreateAccount} from '../controller/login'
import { createBrowserHistory } from 'history';
import { accounts } from '../util/login'
import Alerts from '../controller/alerts'
import { useLmsContext } from '../context/lmsContext'
import { buyers } from '../util/db'
import { useClearCache } from "react-clear-cache";
import {Alert, Container, Row} from 'reactstrap'
import { VendorDashboard, BuyerDashboard } from '../containers'

function Handler(){

  const history = createBrowserHistory()
  const { updateLogin, updateToken ,email, password, access_key, access_token } = useLmsContext() 
  const [loggedIn, setLoggedIn] = useState(false)
  const [first_name, setFirstName] = useState('')
  const [external, setExternal] = useState('')
  const [first_time, setFirstTime] = useState(-1)
  const [type, setType] = useState('')
  const [updatePassword, setUpdatePassword] = useState('')
  const [updatePasswordVerify, setUpdatePasswordVerify] = useState('')
  const [serverResponse, setServerResponse] = useState([])
  const [alertMessages, setAlertMessages] = useState([])
  const [passwordReset, setPasswordReset] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const toggleMobile = () => setIsOpen(!isOpen);
  const toggleMobileClose = () =>setIsOpen(false)
  
  // const { isLatestVersion, emptyCacheStorage } = useClearCache();

  useEffect(() => {
    if(sessionStorage.getItem('account')) {
      const storage = JSON.parse(sessionStorage.getItem('account'))
      const { account } = storage || ''
      const { first_name, type, access_token, id } = account || ''
      setLoggedIn(true)
      setFirstName(first_name)
      setExternal(id)
      setType(type)
      // getServerResponses()
      // getAlerts()
    }  
  }, [])

  // const getServerResponses = async () => {
  //   const search = await buyers('', 'response', '')
  //   setServerResponse(search)
  // }

  // const getAlerts = async () => {
  //   const search = await buyers('', 'alerts', '')
  //   setAlertMessages(search)
  // }

  const handleLoginChange = e => {
    updateLogin(
      e.target.name, e.target.value
    )
  }

  const handleLoginUpdateChangeVerify = e => {
    setUpdatePasswordVerify(e.target.value)
  }

  const handleLoginUpdateChange = e => {
    setUpdatePassword(e.target.value)
  }

  const handleLoginUpdateSubmit = async e => {
    e.preventDefault()
    if(updatePassword === updatePasswordVerify){
      const data = {
        email: email,
        password_field: updatePasswordVerify
      }
      const account = await accounts(data, 'update')
      if(account){
        setFirstTime(-1)
        Alerts.success('Password successfully updated.  Please login with your new password')
        history.push('/login')
      }
    } else {
      const error = {
        name: 'Passwords do not match',
        message: "Passwords do not match please re-enter"
      }
      Alerts.error(error)
    }  
  }

  const handleLoginSubmit = async e => {
    e.preventDefault()
    const data = {
      email: email,
      password_field: password
    }
    const account = await accounts(data, 'login')
    const { first_name, last_name, access_token, type, first_time, id } = account || ''
    if(first_time === 1){
      updateToken(access_token)
      setFirstTime(first_time)
      Alerts.success('Create a new password')
    } else {
      if(account && account.access_token){
        setFirstName(first_name)  
        setType(type)
        updateToken(access_token)
        setExternal(id)
        sessionStorage.setItem('account', JSON.stringify({loggedIn: true, account }))
        setLoggedIn(true)
        history.push("/dashboard")
    } else {
      const data = {
        name: 'Login error',
        message: 'There was a problem with your username or password'
      }
      Alerts.error(data)
    }
    }
  }

  const logOut = (e) => {
    e.preventDefault()
    sessionStorage.clear()
    window.location.href = '/'
  }

  return(
    sessionStorage.getItem('account') || loggedIn === true ?
      <Fragment>
        <Header 
          first_name={first_name}
          logOut={logOut}
          serverResponse={serverResponse}
          alertMessages={alertMessages}
          type={type}
          toggleMobile={toggleMobile}
        />
        <Container fluid>  
          {type === 1 || type === 2 ?
            <Row>
              <Sidebar 
                type={type}
                isOpen={isOpen}
                toggleMobileClose={toggleMobileClose}
              />
              <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4" style={{marginTop: '110px'}}>
                {type === 1 ? <RoutesAdmin /> : type === 2 ? <RoutesEmployee /> : ''}
              </main>
            </Row>
          :   
          <div style={{marginTop: '110px'}}>
            { type === 3 ? <BuyerDashboard id={external}/> : type === 4 ? <VendorDashboard /> : '' }
          </div> 
          }
        </Container>  
      </Fragment>  
    : 
    first_time === 1 ? 
      <PasswordChange 
        handleLoginUpdateChange={handleLoginUpdateChange}
        handleLoginUpdateSubmit={handleLoginUpdateSubmit}
        handleLoginUpdateChangeVerify={handleLoginUpdateChangeVerify}
      />  
    :
    <LoginPage
        handleLoginChange={handleLoginChange}
        handleLoginSubmit={handleLoginSubmit}
    />
  )  

}

export default Handler