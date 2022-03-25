import React from 'react';
import Handler from './containers/handler'
import { useLmsContext } from './context/lmsContext'

function App(){

  return(
    <div>
     <useLmsContext.Provider>
      <Handler />
     </useLmsContext.Provider>
    </div> 
  )  

}

export default App

// export default class App extends Component {

//   state = {
//     email: '',
//     password: '',
//     loggedIn: false,
//     createAccount: false,
//     name: '',
//     first_name: '',
//     type: '',
//     first_time: -1,
//     updatePassword: '',
//     updatePasswordVerify: '',
//     createNewAccount: {
//       email: '',
//       password: '',
//       first_name: '',
//       last_name: '',
//       type: '',
//       phone: ''
//     }
//   }

//   componentDidMount = async () => {
//     if(sessionStorage.getItem('account')) {
//       const storage = JSON.parse(sessionStorage.getItem('account'))
//       const { account } = storage || ''
//       const { first_name } = account || ''
//       updateLogin({
//         loggedIn: true,
//         first_name: first_name
//       })
//     }  
//   }

//   handleLoginChange = e => {
//     this.setState({
//       [e.target.name]: e.target.value
//     })
//   }

//   handleLoginSubmit = async e => {
//     e.preventDefault()
//   }


//   handleLoginUpdateChange = e => {
//     this.setState({
//       updatePassword: e.target.value
//     })
//   }
  
//   handleLoginUpdateChangeVerify = e => {
//     this.setState({
//       updatePasswordVerify: e.target.value
//     })
//   }

//   handleLoginUpdateSubmit = async e => {
//     e.preventDefault()
//     if(this.state.updatePassword === this.state.updatePasswordVerify){
//       const data = {
//         email: this.state.email,
//         password_field: this.state.updatePasswordVerify
//       }
//       const account = await accounts(data, 'update')
//       if(account){
//         this.setState({
//           first_time: -1,
//           createAccount: false,
//           loggedIn: false
//         }, () => {
//           history.push('/login')
//         })
//       }
//     } else {
//       const error = {
//         name: 'Passwords do not match',
//         message: "Passwords do not match please re-enter"
//       }
//       Alerts.error(error)
//     }  
//   }

//   handleLoginSubmit = async e => {
//     e.preventDefault()
//     const data = {
//       email: this.state.email,
//       password_field: this.state.password
//     }
//     const account = await accounts(data, 'login')
//     const { first_name, last_name, access_token, type, first_time } = account || ''
//     if(first_time === 1){
//       updateLogin({
//         access_key: access_token
//       })
//       this.setState({
//         access_key: access_token,
//         first_time: first_time
//       })
//     } else {
//       if(account && account.access_token){
//         updateLogin({
//           loggedIn: true,
//           first_name: first_name,
//           last_name: last_name,
//           access_key: access_token,
//           type: type,
//           first_time : first_time
//         })
//         this.setState({
//           loggedIn: true,
//           first_name: first_name,
//           last_name: last_name,
//           access_key: access_token,
//           type: type,
//           first_time : first_time
//         }, () => {
//           sessionStorage.setItem('account', JSON.stringify({loggedIn: true, account }))
//         }, () => {
//           history.push("/dashboard")
//         })
//     } else {
//       const data = {
//         name: 'Login error',
//         message: 'There was a problem with your username or password'
//       }
//       Alerts.error(data)
//     }
//     }
//   }

//   handleCreationChange = e => {
//     const createNewAccount = this.state.createNewAccount
//     createNewAccount[e.target.name] = e.target.value
//     this.setState({
//       createNewAccount
//     })
//   }

//   handleAccountCreationSubmit = async e => {
//     e.preventDefault()
//     const { createNewAccount } = this.state
//     const data = {
//       email: createNewAccount.email
//     }  
//     const account = await accounts(data, 'verify')
//     if(account){
//       this.setState({
//         createAccount: false,
//         email: createNewAccount.email
//       }, () => {
//         Alerts.success('You already have an account')
//       })
//     } else {
//       const create = await accounts(this.state.createNewAccount, 'accountCreation')
//       if(create){
//         this.setState({ createAccount: false }, () => Alerts.success('Account successfully created'))
//       } else {
//         const error = {
//           name: 'Account creation',
//           message: "There was a problem creating your account."
//         }
//         Alerts.error(error)
//       }
//     }   
//   }

//   handleCreateNewPage = () => {
//     this.setState({
//       createAccount: true
//     })
//   }

//   logOut = (e) => {
//     e.preventDefault()
//     sessionStorage.clear()
//     window.location.href = '/'
//   }


//   render(){
//     const { loggedIn, first_time, createAccount, first_name } = this.state
//     return(
//       <div>
//       <useLmsContext.Provider>
//       {sessionStorage.getItem('account') || loggedIn === true ?
//       <div className="container-fluid">
//         <Header 
//           first_name={first_name}
//           logOut={this.logOut}
//         />
//         <div className="row">
//           <Sidebar 
//             updateDisplay={this.updateDisplay}
//           />
//           <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4" style={{marginTop: '110px'}}>
//             <Routes />
//           </main>
//         </div>    
//       </div>
//       : 
//       first_time === 1 ? 
//         <PasswordChange 
//           handleLoginUpdateChange={this.handleLoginUpdateChange}
//           handleLoginUpdateSubmit={this.handleLoginUpdateSubmit}
//           handleLoginUpdateChangeVerify={this.handleLoginUpdateChangeVerify}
//         />  
//       : createAccount === true ?
//         <CreateAccount 
//           handleAccountCreationSubmit={this.handleAccountCreationSubmit}
//           handleCreationChange={this.handleCreationChange}
//         />
//       : <LoginPage
//         handleLoginChange={this.handleLoginChange}
//         handleLoginSubmit={this.handleLoginSubmit}
//         handleCreateNewPage={this.handleCreateNewPage}
//         state={this.state}
//       />}
//        </useLmsContext.Provider>
//       </div> 
//     )
//   }
// }
