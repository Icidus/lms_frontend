import React, { useState } from 'react'
import { display } from '../static/sidebar'
import {Nav,Collapse, NavbarToggler} from 'reactstrap'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const storage = JSON.parse(sessionStorage.getItem('account'))
const localAccount = storage && storage.account ? storage.account : ''
const { access_token } = localAccount || ''

export default function Sidebar(props){
    return (
        <nav id="sidebarMenu" className={props.isOpen ? "col-md-3 col-lg-2 d-md-block sidebar" : "col-md-3 col-lg-2 d-md-block sidebar collapse"}>
        <div className="sidebar-sticky pt-3">
       {!props.isOpen ?
        <ul className="nav flex-column">
                <li className="nav-item">
                    <a href="#" className="nav-link">
                        {/* <img className="img-fluid" src="http://oconcomarketing.com/lms/images/backend_logo.png" /> */}
                    </a>
                </li>
            </ul>
        : ''}    
        {props.type === 1 || props.type === 2 ?    
        <ul className="nav flex-column">
        {
            Object.keys(display).map(key => 
                <li className="nav-item" key={key}>
                    <NavLink onClick={props.toggleMobileClose} activeClassName="active" className="nav-link" to={`/${display[key].action}`}>
                        {display[key].icon !== '' ?
                        <span className="feather"><FontAwesomeIcon icon={display[key].icon} /></span>
                        : ''}
                        {display[key].display} 
                   </NavLink>
                </li>
            )
        }
        </ul>  
        : ''}  
        {props.type === 1 ?
        <ul className="nav flex-column">
            <li className="nav-item">
             <NavLink onClick={props.toggleMobileClose}  className="nav-link sub" to={`/new-account`}>
                Create New Account
             </NavLink>  
             <NavLink onClick={props.toggleMobileClose}  className="nav-link sub" to={`/edit-users`}>
                Edit Users
             </NavLink>   
             <NavLink onClick={props.toggleMobileClose}  className="nav-link sub" to={`/universal-fields`}>
                System Fields
             </NavLink>  
             <NavLink onClick={props.toggleMobileClose}  className="nav-link sub" to={`/process-queue`}>
                Process Queue
             </NavLink>  
            </li>
        </ul> 
        : ''}   
        </div>
    </nav> 
    )
}