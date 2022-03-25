import React from 'react'
import {Route, Switch, Redirect } from "react-router-dom"
import {
    Vertical, 
    VerticalNew, 
    VerticalDisplay,
    Dashboard, 
    Buyer, 
    BuyerDisplay, 
    Leads, 
    LeadsDisplay,
    Reports, 
    Vendor,
    Offer,
    OfferDisplay,
    Orders,
    VendorNew,
    VendorDisplay,
    OrdersDisplay,
    OrdersNew,
    Instructions,
    NewAccount,
    EditUsers,
    NewLeads,
    BuyerNew,
    UniversalFields,
    ProcessQueue,
    VendorDashboard,
    BuyerDashboard
} from '../containers'

export const RoutesAdmin = props => {
    return(
    <Switch>
        <Route path="/vertical/new" component={VerticalNew} />
        <Route path="/vertical/:id" component={VerticalDisplay} />
        <Route path="/vertical" component={Vertical} />
        <Route path="/buyer/new" component={BuyerNew} />
        <Route path="/buyer/:id" component={BuyerDisplay} />
        <Route path="/buyer/:id/update" component={BuyerDisplay} />
        <Route path="/buyer" component={Buyer} />
        <Route path="/leads/new" component={NewLeads} />
        <Route path="/leads/:id" component={LeadsDisplay} />
        <Route path="/leads" component={Leads} />
        <Route path="/reports" component={Reports} />
        <Route path="/vendor/new" component={VendorNew} />
        <Route path="/vendor/:id" component={VendorDisplay} />
        <Route path="/vendor" component={Vendor} />
        <Route path='/offers/:id' component={OfferDisplay} />
        <Route path='/offers' component={Offer} />
        <Route path='/orders/new' component={OrdersNew} />
        <Route path='/orders/:id' component={OrdersDisplay} />
        <Route path='/orders' component={Orders} />
        <Route path='/instructions' component={Instructions} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/new-account" component={NewAccount} />
        <Route path="/edit-users" component={EditUsers} />
        <Route path="/universal-fields" component={UniversalFields} />
        <Route path="/process-queue" component={ProcessQueue} />
        <Redirect exact path="/" to="/dashboard"/>
    </Switch>  
    )  
}

export const RoutesEmployee = props => {
    return(
    <Switch>
        <Route path="/vertical/new" component={VerticalNew} />
        <Route path="/vertical/:id" component={VerticalDisplay} />
        <Route path="/vertical" component={Vertical} />
        <Route path="/buyer/new" component={BuyerNew} />
        <Route path="/buyer/:id" component={BuyerDisplay} />
        <Route path="/buyer/:id/update" component={BuyerDisplay} />
        <Route path="/buyer" component={Buyer} />
        <Route path="/leads/new" component={NewLeads} />
        <Route path="/leads/:id" component={LeadsDisplay} />
        <Route path="/leads" component={Leads} />
        <Route path="/reports" component={Reports} />
        <Route path="/vendor/new" component={VendorNew} />
        <Route path="/vendor/:id" component={VendorDisplay} />
        <Route path="/vendor" component={Vendor} />
        <Route path='/offers/:id' component={OfferDisplay} />
        <Route path='/offers' component={Offer} />
        <Route path='/orders/new' component={OrdersNew} />
        <Route path='/orders/:id' component={OrdersDisplay} />
        <Route path='/orders' component={Orders} />
        <Route path='/instructions' component={Instructions} />
        <Route path="/dashboard" component={Dashboard} />
        <Redirect exact path="/" to="/dashboard"/>
    </Switch>  
    )  
}

export const RoutesBuyer = props => (
    <Switch>
        <Route path="/buyer-dashboard" component={BuyerDashboard} />
        <Redirect exact path="/" to="/buyer-dashboard"/>
    </Switch>    
)

export const RoutesVendor = props => (
    <Switch>
        <Route path="/vendor-dashboard" component={VendorDashboard} />
        <Redirect exact path="/" to="/vendor-dashboard"/>
    </Switch>    
)

