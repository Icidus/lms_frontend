import React, {useState, useEffect, useRef} from 'react'
import { Row, Col, Form, FormGroup, Table, Button, Label, Alert, Input} from 'reactstrap'
import { report, vendors } from '../../util/db'
import { CSVLink } from "react-csv";
import Select from 'react-select'
import DatePicker from "react-datepicker";
import moment from 'moment'

const initialStateVendorParams = {
    vendor_id: '',
    vertical_id: '',
    start_date: '',
    end_date: '',
    sold_date: false
}

function VendorReport(props){
    const selectInputRef = useRef();
    const [vendorParams, setVendorParams] = useState(initialStateVendorParams)
    const [vendor, setVendor] = useState([])
    const [vendorList, setVendorList] = useState([])
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [leads, setLeads] = useState([])
    const [showLeads, setShowLeads] = useState(false)
    const [loading, setLoading] = useState(true)
    const [soldDate, setSoldDate] = useState()

    useEffect(() => {
        if(props.activeTab == 'vendor'){
            initialSearch()
            requestVendors()
        }
    }, [props.activeTab]);

    useEffect(() => {
        if(vendorParams.vertical_id !== '' || vendorParams.vendor_id !== '' || (startDate !== null && endDate !== null)){
            vendorSearch()
        }    
    },[vendorParams])

    useEffect(() => {
        if(soldDate === false || soldDate === true){
            vendorSearch()
        }    
    },[soldDate])

    useEffect(() => {
        if(startDate !== null && endDate !== null){
            setVendorParams({
                ...vendorParams,
                start_date: moment(startDate).format('YYYY-MM-DD'),
                end_date: moment(endDate).format('YYYY-MM-DD')
            })
        }
    }, [startDate, endDate])


    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }


    const requestVendors = async () => {
        const results = await vendors('', 'search', '')
        const items = results && results.items ? results.items : []
        setVendorList(items)
    }

    const initialSearch = async () => {
        const results = await report('', 'vendor', '')
        const items = results && results.items ? results.items : []
        setVendor(items)
        setLoading(false)
    }  

    const vendorSearch = async () => {
        setLoading(true)
        const results = await report('', 'vendor', vendorParams)
        const items = results && results.items ? results.items : []
        setVendor(items)
        setLoading(false)
    }

    const handleChange = (e, type) => {
        setVendorParams({
            ...vendorParams,
            [type]: e.value
        })
    }

    const handleDate = (date, type) => {
        setVendorParams({
            ...vendorParams,
            [type]: date
        })
    }

    const handleTypeChange = (e, type) => {
        setVendorParams({
            ...vendorParams,
            [type]: e.target.checked
        })
        setSoldDate(e.target.checked)
    }

    const resetFilters = e => {
        setLoading(true)
        const initial = {
            vendor_id: '',
            vertical_id: '',
            start_date: '',
            end_date: ''
        }
        setVendorParams(initial)
        setStartDate(null)
        setEndDate(null)
        initialSearch()
        setLoading(false)
    } 

        const verticalArray = props.vertical ? Object.keys(props.vertical).map(items => ({
            value: props.vertical[items].id,
            label: props.vertical[items].label
        })) : []
    

        const vendorArray = vendorList ? Object.keys(vendorList).map(items => ({
            value: vendorList[items].id,
            label: vendorList[items].company_name
        })) : []
    
        return(
            <div>
                <div style={{margin: "20px"}}>
                    <p>Search Options</p>
                    <Row>
                        <Col>
                            <Form>
                                <FormGroup>
                                    <Label>Vertical Selection</Label>
                                    {Object.keys(verticalArray).length ? 
                                        <Select
                                            onChange={(e) =>handleChange(e, 'vertical_id')}
                                            options={verticalArray}
                                    /> : ''}
                                </FormGroup>
                                <FormGroup>
                                    <Label>Vendor Selection</Label>
                                    {Object.keys(vendorArray).length ? 
                                        <Select
                                            name={"vendor_id"}
                                            inputId={"vendor_id"}
                                            onChange={(e) => handleChange(e, 'vendor_id')}
                                            options={vendorArray}
                                            isClearable={true}
                                            ref={selectInputRef}
                                    /> : ''}
                                </FormGroup>
                                <FormGroup check>
                                <Input onChange={(e) => handleTypeChange(e, 'sold_date')} type="checkbox" />
                                <Label check>Search by Sell Date</Label>
                                </FormGroup> 
                                <br />
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
                            </Form>
                        </Col>
                    </Row>    
                    <CSVLink 
                        data={vendor|| []}
                        filename={`leads-dataexport${Date.now()}.csv`}
                        className="btn btn-primary"
                        target="_blank"
                        style={{marginRight: "20px"}}
                    >
                        Export data
                    </CSVLink>{' '}
                    <Button color="success" onClick={e => resetFilters(e)}>Reset Filters</Button>
                </div>
                {loading ? <Alert color="warning">Loading data.  One moment...</Alert>: ''}
                <Table>
                    <thead>
                        <tr>
                            <th>Vendor Id</th>
                            <th>Vendor Name</th>
                            <th>Leads Received</th>
                            <th>Sold</th>
                            <th>Returned</th>
                            <th>Sale Percentage</th>
                            <th>Lead Cost</th>
                            <th>Revenue</th>
                            <th>Average</th>
                            <th>Actions</th>
                        </tr> 
                    </thead>  
                    <tbody>
                        {Object.keys(vendor).map((items,idx) => 
                            <tr key={idx}>
                                <td>{vendor[items].vendor_id}</td>
                                <td>{vendor[items].vendor}</td>
                                <td>{vendor[items].leads_received}</td>
                                <td>{vendor[items].sold}</td>
                                <td>{vendor[items].returned}</td>
                                <td>{vendor[items].sale_percentage}</td>
                                <td>{vendor[items].lead_cost}</td>
                                <td>{vendor[items].revenue}</td>
                                <td>{vendor[items].average}</td>
                                <td><Button color="primary" onClick={e => props.getLeads(
                                    e, 
                                    vendor[items].vendor_id, 
                                    vendorParams.vertical_id,
                                    vendorParams.start_date,
                                    vendorParams.end_date,
                                    '',
                                    soldDate
                                    )}>See Leads</Button></td>
                            </tr>
                        )}
                    </tbody>  
                </Table>    
            </div>
        )
    
}

export default VendorReport