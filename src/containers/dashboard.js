import React, { useState, useEffect, Fragment } from 'react'
import { Table, Button, ButtonGroup, Card, CardBody, CardHeader, Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Dropdown, DropdownMenu, DropdownToggle,DropdownItem, Modal, ModalHeader, ModalBody} from 'reactstrap'
import { dashboards, buyers, lead, vertical, vendors  } from '../util/db'
import { createBrowserHistory } from 'history';
import {Doughnut} from 'react-chartjs-2';
import { CSVLink } from "react-csv";
import { withRouter, Link } from 'react-router-dom'
import ReactTable from 'react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FoldableTableHOC from "react-table/lib/hoc/foldableTable";
import moment from 'moment'
import { dashboard } from '../config/endpoints';
const FoldableTable = FoldableTableHOC(ReactTable);

function Dashboard(props){
const [modal, setModal] = useState(false)
const [data, setData] = useState([])
  const [buyerCount, setBuyerCount ] = useState(0)   
  const [vendorCount, setVendorCount ] = useState(0)
  const [leadsByType, setLeadsByType] = useState([])
  const [leadCount, setLeadCount] = useState(0)
  const [buyer, setBuyer] = useState([])
  const [soldLeads, setSoldLeads] = useState([])
  const [verticals, setVerticals] = useState([])
  const [vendor, setVendor ] = useState([])
  const [alert, setAlert] = useState([])
  const [pendingLeads, setPendingLeads] = useState([])
  const [failedLeads, setFailedLeads] = useState([])
  const [declinedLeads, setDeclinedLeads] = useState([])
  const [unsoldLeads, setUnsoldLeads] = useState([])

  const[failedVendor, setFailedVendor] = useState([])

  const [buyerDropdown, setBuyerDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false)

  const toggle = () => setBuyerDropdownOpen(prevState => !prevState);
  const toggleModal = () => setModal(!modal);

  useEffect(() => {
    const fetchData = async () => {
        const bCount = await dashboards('', 'buyer-count')
        const vCount = await dashboards('', 'vendor-count')
        const lTypeCount = await dashboards('', 'lead-by-type')
        const tLeads = await dashboards('', 'lead-count')
        const newAlerts = await dashboards('', 'alerts')
        const allBuyers = await buyers('', 'search')
        const soldLeads = await lead('', 'pivot-sold')
        const vert = await vertical()
        const ven = await vendors('', 'search') 
        const pending = await dashboards('', 'pending')
        const failed = await dashboards('', 'failed')
        const declined = await dashboards('', 'declined')
        const unsold = await dashboards('', 'unsold')
        const allBuyersItems = allBuyers && allBuyers.items ? allBuyers.items : []
        setBuyerCount(bCount)
        setVendorCount(vCount)
        setLeadsByType(lTypeCount)
        setLeadCount(tLeads)
        setBuyer(allBuyersItems)
        setSoldLeads(soldLeads)
        setVerticals(vert && vert.items ? vert.items : [])
        setVendor(ven && ven.items ? ven.items : [])
        setAlert(newAlerts)
        setPendingLeads(pending)
        setFailedLeads(failed)
        setDeclinedLeads(declined)
        setUnsoldLeads(unsold)
    }
    fetchData()
  },[])

  useEffect(() => {
    if(failedVendor.length > 0){
        toggleModal()
    }  
  },[failedVendor])

  const handleFailed = async (e, vendor)  => {
      e.preventDefault()
      setLoading(true)
    let search = await dashboards('', "failed-vendor", {
        'vendor_id' : vendor
    })
    setFailedVendor(search)
    setLoading(false)
  }

  return(
    <Col>
        <FailedLeadsModal
            modal={modal}
            toggleModal={toggleModal}
            failedVendor={failedVendor}
            loading={loading}
        />
        <Row>
            <QuickActions 
                verticals={verticals}
            />
        </Row>  
        <br />  
        <Row>
            <div className="col-xl-5 col-lg-6">
            <Row>
            <BuyerCount 
                total={buyerCount}
                buyer={buyer}
            />
            <VendorCount
                total={vendorCount}
                vendor={vendor}
            />
            </Row>
            <br />
            <Row>
            <LeadCount
                total={leadCount}
            />
            </Row>
            </div>
            <div className="col-xl-7  col-lg-6">
            <LeadsByCount
                data={leadsByType}
            />
            </div>
        </Row>  
        <br />
        <Row>
            <PendingLeadsDisplay
                pendingLeads={pendingLeads}
            />
            <FailedLeadsDisplay 
                failedLeads={failedLeads}
                handleFailed={handleFailed}
            />
            <UnsoldLeadsDisplay
                unsoldLeads={unsoldLeads}
            />
            <DeclinedLeadsDisplay
                declinedLeads={declinedLeads}
            />
            {/* <SoldLeads
                soldLeads={soldLeads}
            /> */}
            {/* <AlertInformation 
                alert={alert}
            /> */}
        </Row>    
    </Col>
  )
}
const FailedLeadsModal = props => {

    return(
        <Modal size="xl" isOpen={props.modal} toggle={props.toggleModal}>
        <ModalHeader toggle={props.toggleModal}>Failed Leads</ModalHeader>
        <ModalBody>
        <ReactTable
            data={props.failedVendor}
            columns={
                [
                {
                    Header: "View",
                    accessor: "view",
                    foldable: false,
                    sortable: false,
                    filterable: false,
                    maxWidth: 50,
                    Cell: function(props){
                        console.log(props)
                        return (
                            <Fragment>
                            {/* <a href="#" id="view" onClick={() => props.leadsDisplay(props)}><FontAwesomeIcon icon={['fas', "eye"]} size="lg" style={{marginRight: "20px"}}/></a> */}
                            <Link to={`/leads/${props.original.lead_id}`}><FontAwesomeIcon icon={['fas', "eye"]} size="lg" style={{marginRight: "20px"}}/></Link>
                            </Fragment>
                        )  
                    }   
                },
        {
            Header: "Lead ID",
            accessor: "lead_id",
            id: "lead_id",
            foldable: true,
            maxWidth: 100,
            style: { 'whiteSpace': 'unset' }
        },
        {
            Header: "Vendor",
            accessor: 'company_name',
            id: "company_name",
            foldable: true,
            maxWidth: 150,
            style: { 'whiteSpace': 'unset' }
        },
        {
            Header: "Buyer",
            accessor: 'buyer_company_name',
            id: "buyer_company_name",
            foldable: true,
            maxWidth: 150,
            style: { 'whiteSpace': 'unset' }
        },
        {
            Header: "Server Response",
            accessor: 'server_response',
            id: "server_response",
            foldable: true,
            style: { 'whiteSpace': 'unset' },
            Cell: function(props){
                return(
                    <pre>{JSON.stringify(JSON.parse(props.value), null, 2)}</pre>
                )
            }  
        },{
            Header: "Date",
            accessor: "timestamp",
            id: "timestamp",
            foldable: true,
            maxWidth: 150,
            style: { 'whiteSpace': 'unset' }
        }
    ]
            }
            loading={props.loading}
            className="-highlight"
            />
        </ModalBody>
      </Modal>
    )
}

const PendingLeadsDisplay = props => {
   return(
    <div className="col-xl-6 col-lg-12 order-lg-2 order-xl-1">
    <Card className="pendingDisplay" style={{height: "200px", overflowY: "auto", marginTop: "10px", marginBottom: "30px"}}>
        <CardBody>
        <h5 className="text-muted font-weight-normal mt-0" title="Number of pending leads">Pending Leads</h5>

        <Table>
            <tbody>
                {props.pendingLeads.length > 0 ? (Object.keys(props.pendingLeads).map((items,idx) => (
                    <tr key={idx}>  
                        <td>{props.pendingLeads[items].company}</td>
                        <td><Link to={`/leads?status=pending&vendor=${props.pendingLeads[items].company}`}>{props.pendingLeads[items].pending}</Link></td>
                    </tr>    
                ))
                ): (
                    <tr><td>No pending leads found</td></tr>
                )}
            </tbody>    
        </Table>   
        </CardBody>
    </Card>  
    </div>  
   ) 
}

const DeclinedLeadsDisplay = props => {
    const d = moment()
    const d7days = d.subtract(7, "days");
    const updatedDate = d7days.format('YYYY-MM-DD')
    return(
     <div className="col-xl-6 col-lg-12 order-lg-2 order-xl-1">
     <Card className="pendingDisplay" style={{height: "200px", overflowY: "auto", marginTop: "10px", marginBottom: "30px"}}>
         <CardBody>
         <h5 className="text-muted font-weight-normal mt-0" title="Number of pending leads">Declined Leads</h5>
 
         <Table>
             <tbody>
                 {props.declinedLeads.length > 0 ? (Object.keys(props.declinedLeads).map((items,idx) => (
                     <tr key={idx}>  
                         <td>{props.declinedLeads[items].company}</td>
                         <td><Link to={`/leads?status=declined&vendor=${props.declinedLeads[items].company}&end_date=${moment().format('YYYY-MM-DD')}&start_date=${updatedDate}`}>{props.declinedLeads[items].declined}</Link></td>
                     </tr>    
                 ))
                 ): (
                     <tr><td>No declined leads found</td></tr>
                 )}
             </tbody>    
         </Table>   
         </CardBody>
     </Card>  
     </div>  
    ) 
 }

 const UnsoldLeadsDisplay = props => {
    const d = moment()
    const d7days = d.subtract(7, "days");
    const updatedDate = d7days.format('YYYY-MM-DD')
    return(
     <div className="col-xl-6 col-lg-12 order-lg-2 order-xl-1">
     <Card className="pendingDisplay" style={{height: "200px", overflowY: "auto", marginTop: "10px", marginBottom: "30px"}}>
         <CardBody>
         <h5 className="text-muted font-weight-normal mt-0" title="Number of pending leads">Unsold Leads</h5>
 
         <Table>
             <tbody>
                 {props.unsoldLeads.length > 0 ? (Object.keys(props.unsoldLeads).map((items,idx) => (
                     <tr key={idx}>  
                         <td>{props.unsoldLeads[items].company}</td>
                         <td><Link to={`/leads?status=not+sold&vendor=${props.unsoldLeads[items].company}&end_date=${moment().format('YYYY-MM-DD')}&start_date=${updatedDate}`}>{props.unsoldLeads[items].unsold}</Link></td>
                     </tr>    
                 ))
                 ): (
                     <tr><td>No unsold leads found</td></tr>
                 )}
             </tbody>    
         </Table>   
         </CardBody>
     </Card>  
     </div>  
    ) 
 }

const FailedLeadsDisplay = props => {
    return(
     <div className="col-xl-6 col-lg-12 order-lg-2 order-xl-1">
     <Card style={{height: "200px", overflowY: "auto", marginTop: "10px", marginBottom: "30px"}}>
         <CardBody>
         <h5 className="text-muted font-weight-normal mt-0" title="Number of failed leads">Failed Leads</h5>
 
         <Table>
             <tbody>
                 {props.failedLeads.length > 0 ? (Object.keys(props.failedLeads).map((items,idx) => (
                     <tr key={idx}>  
                         <td>{props.failedLeads[items].company_name}</td>
                         <td><a href="#" onClick={e =>props.handleFailed(e, props.failedLeads[items].vendor_id)}>{props.failedLeads[items].failed}</a></td>
                     </tr>    
                 ))
                 ): (
                     <tr><td>No failed leads found</td></tr>
                 )}
             </tbody>    
         </Table>   
         </CardBody>
     </Card>  
     </div>  
    ) 
 }

const QuickActions = props => {
    const csvLink = React.createRef()
    const [data, setData] = useState([])
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    const getData = async name => {
        const results = await lead('', 'pivot-vertical', {'id' : name})
        setData(results)
    }

    useEffect(() => {
        if(data && data.length > 0){
            csvLink.current.link.click()
        }    
    }, [data])

    return(
    <div className="col-xl-12  col-lg-11">
    <Card>
        <CardBody>
            <h5 className="text-muted font-weight-normal mt-0" title="Quick actions">Quick actions</h5>
            <ButtonGroup>
            <Link to="/vertical/new" type="button" style={{marginRight: "10px"}} className="btn btn-primary">Add new vertical</Link>{' '}
            <Link to="/buyer/new" type="button" style={{marginRight: "10px"}} className="btn btn-primary">Add new buyer</Link>{' '}
            <Link to="/orders/new" type="button" style={{marginRight: "10px"}} className="btn btn-primary" color="primary">Add new order</Link>{' '}
            <Link to="/vendor/new" type="button" style={{marginRight: "10px"}} className="btn btn-primary" color="primary">Add new vendor</Link>{' '}
            </ButtonGroup>
        </CardBody>   
        <CSVLink 
            data={data}
            filename={`lead-dataexport${Date.now()}.csv`}
            target="_blank"
            className="hidden"
            ref={csvLink}
        />
    </Card>   
    </div> 
    )
}

const BuyerCount = props => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    return(
    <div className="col-lg-6">
    <Card>
        <CardBody>
        <div className="dropdown float-right">
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle
                tag="span"
                data-toggle="dropdown"
                aria-expanded={dropdownOpen}
            >
            <div className="mdi-dots-vertical"></div>
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem><Link to="/buyer">All buyers</Link></DropdownItem>
                <DropdownItem><Link to="/buyer/new">Add a new buyer</Link></DropdownItem>
                <DropdownItem>
                <CSVLink 
                    data={props.buyer || []}
                    filename={`buyer-dataexport${Date.now()}.csv`}
                    target="_blank"
                    style={{marginRight: "20px"}}
                >
                    Export buyers
                </CSVLink>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
        </div>
            <h5 className="text-muted font-weight-normal mt-0" title="Number of Buyers">Buyers</h5>
            <h3 className="mt-3 mb-3">{props.total}</h3>
        </CardBody>    
    </Card>    
    </div>
    )
}

const VendorCount = props => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);
    return(
    <div className="col-lg-6">
    <Card>
        <CardBody>
        <div className="dropdown float-right">
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle
                tag="span"
                data-toggle="dropdown"
                aria-expanded={dropdownOpen}
            >
            <div className="mdi-dots-vertical"></div>
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem><a href="/vendor">All vendors</a></DropdownItem>
                <DropdownItem><a href="/vendor/new">Add a new vendor</a></DropdownItem>
                <DropdownItem>
                <CSVLink 
                    data={props.vendor || []}
                    filename={`vendor-dataexport${Date.now()}.csv`}
                    target="_blank"
                    style={{marginRight: "20px"}}
                >
                    Export Vendors
                </CSVLink>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
        </div>
            <h5 className="text-muted font-weight-normal mt-0" title="Number of Vendors">Vendors</h5>
            <h3 className="mt-3 mb-3">{props.total}</h3>
        </CardBody>    
    </Card>    
    </div>
    )
}

const LeadsByCount = props => {
    const BackGroundColors = () => [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ]

    const data = {
        labels: Object.keys(props.data).map(items => ( props.data[items].status )),
        datasets: [{
          data: Object.keys(props.data).map(items => ( props.data[items].id )),
          backgroundColor: BackGroundColors(),
        }]
    };
    return(
  
    <Card>
        <CardBody>
            { props.data && props.data.length > 0 ? <Doughnut data={data} /> : "Loading...."}
        </CardBody>    
    </Card>    
    )
}

const SoldLeads = props => (
    <div className="col-xl-6 col-lg-12 order-lg-2 order-xl-1">
    <Card style={{height: "400px", overflowY: "auto", marginTop: "10px"}}>
        <CardBody>
        <h5 className="text-muted font-weight-normal mt-0" title="Number of sold leads">Sold Leads</h5>

        <Table>
            <tbody>
                {props.soldLeads.length > 0 ? (Object.keys(props.soldLeads).map((items,idx) => (
                    <tr key={idx}>  
                        <td>{props.soldLeads[items].vendor_name}</td>
                        <td>{props.soldLeads[items].price}</td>
                        <td>{props.soldLeads[items].vertical_label}</td>
                        <td>{props.soldLeads[items].sold_date}</td>
                    </tr>    
                ))
                ): (
                    <tr><td>No sold leads found</td></tr>
                )}
            </tbody>    
        </Table>   
        </CardBody>
    </Card>  
    </div>  
)

const LeadCount = props => (
    <div className="col-lg-12">
    <Card>
        <CardBody>
            <h5 className="text-muted font-weight-normal mt-0" title="Number of Leads">Leads</h5>
            <h3 className="mt-3 mb-3">{props.total}</h3>
        </CardBody>    
    </Card>    
    </div>
)

const AlertInformation = props => (
    <div className="col-xl-6 col-lg-12 order-lg-2 order-xl-1">
    <Card style={{height: "400px", overflowY: "auto", marginTop: "10px"}}>
        <CardBody>
            {props.alert.length > 0 ?
                Object.keys(props.alert).map((items,index) => 
                    <Fragment key={index}>
                        <h3 className="mt-3 mb-3">{props.alert[items].name}</h3>
                        <p>{props.alert[items].message}</p>
                        <small>{props.alert[items].timestamp}</small>
                    </Fragment>    
                )
            : ''}                
        </CardBody>    
    </Card>    
    </div>
)

export default withRouter(Dashboard)

