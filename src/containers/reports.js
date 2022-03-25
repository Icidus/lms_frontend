import React, { useState, useEffect, Fragment } from 'react'
import { report, vertical, vendors, buyers } from '../util/db'
import ReportsNavigation from './reportsComponents/reportsNavigation'
import { Table, Alert, Button, Row, Col, Form, Input, Label, FormGroup, TabContent, TabPane, Nav, NavItem,NavLink, Card, Breadcrumb, BreadcrumbItem, BreadCrumbNavigation,Modal, ModalHeader, ModalBody, ModalFooter, CardTitle, CardText, CardBody } from 'reactstrap'
import ReactDataGrid from "react-data-grid";
import classnames from 'classnames';
import { CSVLink } from "react-csv";
import Select from 'react-select'
import DatePicker from "react-datepicker";
import moment from 'moment'
 
import "react-datepicker/dist/react-datepicker.css";
// import * as WebDataRocksReact from '../util/report-handler';


function Reports(props){
    const [verticals, setVerticals] = useState([])
    const [activeTab, setActiveTab] = useState('vendor');
    const [vendorList, setVendorList] = useState([])
    const [leads, setLeads] = useState([])
    const [showLeads, setShowLeads] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showVendors, setShowVendors] = useState(false)
    const [buyerVendors, setBuyerVendors] = useState([])

    useEffect(() => {
        requestVerticals()
    }, []);


    const requestVerticals = async () => {
        const results = await vertical()
        const items = results && results.items ? results.items : []
        setVerticals(items)
    }

    const toggle = tab => {
        if(activeTab !== tab) setActiveTab(tab);
      }


    const toggleShowLeads = () => {
        setShowLeads(!showLeads);
        setLeads([])
    }    

    const toggleShowVendors = () => {
        setShowVendors(!showVendors)
        setBuyerVendors([])
    }

    const getLeads = async (e,id,vertical_id,start_date,end_date,buyer_id, sold_date ) => {
        setShowLeads(true)
        setLoading(true)
        const search = await report('', 'lead-data', {
            id: id,
            vertical_id: vertical_id,
            start_date: start_date,
            end_date: end_date,
            buyer_id: buyer_id,
            sold_date: sold_date
        })
        setLeads(search)
        setLoading(false)
    }

    const getVendors = async (e,id,vertical_id,start_date,end_date,buyer_id, sold_date ) => {
        setShowVendors(true)
        setLoading(true)
        const results = await report('', 'buyer-vendor-report', {
            id: id,
            vertical_id: vertical_id,
            start_date: start_date,
            end_date: end_date,
            buyer_id: buyer_id,
            sold_date: sold_date
        })
        const items = results && results.items ? results.items : []
        setBuyerVendors(items)
        setLoading(false)
    }


    return(
        <ReportsNavigation
            showLeads={showLeads}
            leads={leads}
            toggleShowLeads={toggleShowLeads}
            setLeads={setLeads}
            loading={loading}
            vertical={verticals}
            getLeads={getLeads}
            toggle={toggle}
            activeTab={activeTab}
            history={props.history}
            buyerVendors={buyerVendors}
            showVendors={showVendors}
            setShowVenodrs={setShowVendors}
            toggleShowVendors={toggleShowVendors}
            getVendors={getVendors}
        />
    )
}

export default Reports






