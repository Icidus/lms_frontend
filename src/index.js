import 'bootstrap/dist/css/bootstrap.min.css'
import './css/styles.css'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)
ReactDOM.render(<BrowserRouter><Alert stack={{limit: 3}} />  <App /></BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
