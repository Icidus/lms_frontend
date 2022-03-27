import React, {useState, useEffect} from 'react'
import { Row, Col, Form, FormGroup, Table, Button, Label, Alert, Input} from 'reactstrap'
import { report, buyers } from '../../util/db'
import { CSVLink } from "react-csv";
import Select from 'react-select'
import DatePicker from "react-datepicker";
import moment from 'moment'

const params = {
    buyer_id: '',
    vertical_id: '',
    start_date: '',
    end_date: '',
    sold_date: false
}

function BuyerReport(props){

    const [buyerParams, setBuyerParams] = useState(params)
    const [buyer, setBuyer] = useState([])
    const [buyerList, setBuyerList] = useState([])
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [leads, setLeads] = useState([])
    const [showLeads, setShowLeads] = useState(false)
    const [loading, setLoading] = useState(true)
    const [soldDate, setSoldDate] = useState()

    useEffect(() => {
        if(props.activeTab == 'buyer' && buyer.length < 1){
            requestBuyers()
            initialSearchBuyer()
        }  
    }, [props.activeTab]);

    useEffect(() => {
        if(buyerParams.vertical_id !== '' || buyerParams.buyer_id !== '' || (startDate !== null && endDate !== null)){
            buyerSearch()
        }    
    },[buyerParams])

    useEffect(() => {
        if(soldDate === false || soldDate === true){
            buyerSearch()
        }    
    },[soldDate])

    useEffect(() => {
        if(startDate !== null && endDate !== null){
            setBuyerParams({
                ...buyerParams,
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

    const requestBuyers = async () => {
        const search = await buyers('', 'search', '')
        setBuyerList(search.items || [])
    }

    const initialSearchBuyer = async () => {
        setLoading(true)
        const results = await report('', 'buyer', '')
        const items = results && results.items ? results.items : []
        setBuyer(items)
        setLoading(false)
    }

    const buyerSearch = async () => {
        setLoading(true)
        const results = await report('', 'buyer', buyerParams)
        const items = results && results.items ? results.items : []
        setBuyer(items)
        setLoading(false)
    }

    const handleChange = (e, type) => {
        setBuyerParams({
            ...buyerParams,
            [type]: e.value
        })
    }

    const handleDate = (date, type) => {
        setBuyerParams({
            ...buyerParams,
            [type]: date
        })
    }

    const handleTypeChange = (e, type) => {
        setBuyerParams({
            ...buyerParams,
            [type]: e.target.checked
        })
        setSoldDate(e.target.checked)
    }

    const resetFilters = e => {
        const initial = {
            buyer_id: '',
            vertical_id: '',
            start_date: '',
            end_date: ''
        }
        setBuyerParams(initial)
        setStartDate(null)
        setEndDate(null)
        initialSearchBuyer()
    }


        const verticalArray = props.vertical ? Object.keys(props.vertical).map(items => ({
            value: props.vertical[items].id,
            label: props.vertical[items].label
        })) : []
    
        const buyerArray = buyerList ? Object.keys(buyerList).map(items => ({
            value: buyerList[items].id,
            label: buyerList[items].company_name
        })) : []
    
        console.log(buyer)
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
                                            onChange={(e) => handleChange(e, 'vertical_id')}
                                            options={verticalArray}
                                    /> : ''}
                                </FormGroup>
                                <FormGroup>
                                    <Label>Buyer Selection</Label>
                                    {Object.keys(buyerArray).length ? 
                                        <Select
                                            onChange={(e) => handleChange(e, 'buyer_id')}
                                            options={buyerArray}
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
                        data={props.vendor|| []}
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
                            <th>Buyer Id</th>
                            <th>Company Name</th>
                            <th>Vertical</th>
                            <th>Leads Sold</th>
                            <th>Sold Price</th>
                            <th>Lead Cost</th>
                            <th>Returns</th>
                            <th>Returns Price</th>
                            <th>Sold Price - Return Price</th>
                            <th>Payable</th>
                        </tr>   
                    </thead>  
                    <tbody>
                        {buyer && buyer.length > 0 ? Object.keys(buyer).map((items,idx) => {
                            const payable = (Number(buyer[items].lead_sold)) - (buyer[items].return_leads !== null ? Number(buyer[items].return_leads) : 0)
                            const soldPrice = (Number(buyer[items].amt)) - (buyer[items].return_price !== null ? Number(buyer[items].return_price) : 0)
                            return(
                            <tr key={idx}>
                                <td>{buyer[items].buyer_id}</td>
                                <td>{buyer[items].company_name}</td>
                                <td>{buyer[items].vertical}</td>
                                <td>{buyer[items].lead_sold}</td>
                                <td>{buyer[items].amt}</td>
                                <td>{buyer[items].lead_cost}</td>
                                <td>{buyer[items].return_leads !== null ? buyer[items].return_leads : 0}</td>
                                <td>{buyer[items].return_price !== null ? buyer[items].return_price : 0}</td>
                                <td>{soldPrice}</td>
                                <td>{payable}</td>
                                <td><Button color="primary" onClick={e => props.getLeads(
                                    e, 
                                    '',
                                    buyerParams.vertical_id,
                                    buyerParams.start_date,
                                    buyerParams.end_date,
                                    buyer[items].buyer_id,
                                    soldDate
                                )}>See Leads</Button></td>
                                <td><Button color="primary"
                                onClick={e => props.getVendors(
                                    e, 
                                    '',
                                    buyerParams.vertical_id,
                                    buyerParams.start_date,
                                    buyerParams.end_date,
                                    buyer[items].buyer_id,
                                    soldDate
                                )}>
                                See Vendors</Button></td>
                            </tr>
                            )
                        }): []}
                    </tbody>  
                </Table>    
            </div>
        )
    
}

export default BuyerReport