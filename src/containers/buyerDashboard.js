import React, { useEffect, useState, useRef } from 'react'
import { lead } from '../util/db'
import ReactTable from 'react-table'
import { CSVLink } from "react-csv";
import Select from 'react-select'
import DatePicker from "react-datepicker";
import moment from 'moment'
import { UncontrolledTooltip, Container, Row, Col, Form, Label, Card, CardBody, Breadcrumb, BreadcrumbItem, Button, FormGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap'

import FoldableTableHOC from "react-table/lib/hoc/foldableTable";
import "react-datepicker/dist/react-datepicker.css";
const FoldableTable = FoldableTableHOC(ReactTable);

function BuyerDashboard(props){
    const csvLink = useRef()

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [leads, setLeads] = useState([])
    const [verticals, setVerticals] = useState([])
    const [buttonName, setButtonName] = useState('Nothing to export')
    const [verticalSort, setVerticalSort] = useState('')
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [exportData, setExportData] = useState([])
    const [exportListData, setExportListData] = useState([])

    useEffect(() => {
        getAllLeads()
        getVerticals()
    },[])

    useEffect(() => {
        if(verticalSort !== ''){
            getSortLeads()
        }
    },[verticalSort])

    useEffect(() => {
        if(startDate !== null && endDate !== null){
            getSortLeads()
        }
    }, [startDate, endDate])

    useEffect(() => {
        if(exportListData && exportListData.length > 0 ){
            csvLink.current.link.click()
        }
    }, [exportListData])

    useEffect(() => {
        if(exportData && Object.keys(exportData).map(items => items).length > 0){
            const header = Object.keys(exportData).map((items, idx) => 
            Object.keys(exportData[items]).map((sets) => {
                return sets
            }))
    
        const exportLists = Object.keys(exportData).map((items, idx) => 
            Object.keys(exportData[items]).map((sets) => {
                return exportData[items][sets]
        }))
    
        const listExport = header && header.length > 0 ? header[0] : []    
        const lists = [listExport]
        const listData = lists.concat(exportLists)

        setExportListData(listData)

        }
    },[exportData])

    const getAllLeads = async () => {
        const results = await lead({'buyer_id': props.id}, 'buyer-leads')
        const { items, _meta } = results || []
        setData(items)
        setLoading(false)
    }


    const getSortLeads = async () => {
        const results = await lead({'buyer_id': props.id, 'vertical_id' : verticalSort, 'start_date': startDate !== null ? moment(startDate).format('YYYY-MM-DD') : '', 'end_date': endDate !== null ? moment(endDate).format('YYYY-MM-DD') : ''}, 'buyer-leads')
        const { items, _meta } = results || []
        setData(items)
        setLoading(false) 
    }

    const getVerticals = async () => {
        const results = await lead({'buyer_id': props.id}, 'buyer-leads-verticals')
        const { items, _meta } = results || []
        setVerticals(items)
    }

    const exportLeads = async () => {
        setLeads([])
        setButtonName('Generating list....')
        const results = await lead({'buyer_id' : props.id, 'vertical_id' : verticalSort, 'start_date': startDate !== null ? moment(startDate).format('YYYY-MM-DD') : '', 'end_date': endDate !== null ? moment(endDate).format('YYYY-MM-DD') : ''}, 'buyer-leads-export')
        setLeads(results)
    }

    const clearFilters = () => {
        setVerticalSort('')
        setStartDate(null)
        setEndDate(null)
        setLoading(true)
        getAllLeads()
    }

    const getExportData = async e => {
        const results = await lead({'buyer_id' : props.id, 'vertical_id' : verticalSort, 'start_date': startDate !== null ? moment(startDate).format('YYYY-MM-DD') : '', 'end_date': endDate !== null ? moment(endDate).format('YYYY-MM-DD') : ''}, 'buyer-leads-export')
        console.log(results)
        setExportData(results)
    }


    const header = Object.keys(leads).map((items, idx) => 
        Object.keys(leads[items]).map((sets) => {
            return sets
        }))

    const exportLists = Object.keys(leads).map((items, idx) => 
        Object.keys(leads[items]).map((sets) => {
                return leads[items][sets]
        }))

    const list = header && header.length > 0 ? header[0] : []    
    const lists = [list]
    const exportList = lists.concat(exportLists)

    return (
        <div>
            <div >
            <Button color="primary" onClick={e =>getExportData(e)}>Export to CSV</Button>
            <CSVLink
                    data={exportListData || []}
                    filename={`leads-dataexport${Date.now()}.csv`}
                    className="hidden"
                    ref={csvLink}
                    target="_blank" 
                />
                <Button color="warning" onClick={e => clearFilters(e)}>Clear filters</Button>   
              </div>  
              <br />
              <Row>
              <Col xs="4">
                 
                  <Input type="select" onChange={e => setVerticalSort(e.target.value)}>
                  <option value="">Select vertical...</option>

                    {verticals && verticals.length > 0 ? Object.keys(verticals).map((items,idx) => 
                        <option key={idx} value={verticals[items].vertical_id}>{verticals[items].label}</option>
                    ) : []}
                </Input>
                </Col>  
                  <Col>
                <FormGroup>
                            <Label>Start Date </Label>
                            <DatePicker
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                dateFormat="yyyy-MM-dd"
                            />
                            {' '}
                            <Label>End Date </Label>
                            <DatePicker
                                selected={endDate}
                                onChange={date => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                dateFormat="yyyy-MM-dd"
                            />
                    </FormGroup> 
                    </Col>
                </Row>   
            <br />
            <Card>
                <CardBody>
                    <Display
                        data={data}
                        loading={loading}
                    />
                </CardBody>
            </Card>        
         </div>   
    )
}

const Display = (props) => {
    const [hoveredRow, setHoveredRow] = useState(null)
    return(
    <FoldableTable
        data={props.data}
        columns={
        [
        {
            Header: "Vertical",
            accessor: 'vertical_label',
            id: "vertical_label",
            foldable: true
        },{
            Header: "First Name",
            accessor: "first_name",
            id: "first_name",
            foldable: true 
        },{
            Header: "Last Name",
            accessor: "last_name",
            id: "last_name",
            foldable: true 
        },{
            Header: "Email",
            accessor: "email",
            id: "email",
            foldable: true 
        },{
            Header: "State",
            accessor: "state",
            id: "state",
            foldable: true 
        },{
            Header: "Buyer",
            accessor: "buyer",
            id: "buyer",
            foldable: true 
        },{
            Header: "Sold date",
            accessor: "sold_date",
            id: "sold_date",
            foldable: true
        }
    ]
    }
    loading={props.loading}
    filterable={true}
    className="-highlight"
/>
    )
}

export default BuyerDashboard