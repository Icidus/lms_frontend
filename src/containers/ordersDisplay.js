import React, { useState,useEffect } from 'react'
import ReactTable from 'react-table'
import { Table, Button, Row, Col, Form, Input, Label, FormGroup, TabContent, TabPane, Nav, NavItem,NavLink, Card, Breadcrumb, BreadcrumbItem, BreadCrumbNavigation,Modal, ModalHeader, ModalBody, ModalFooter, CardTitle, CardText } from 'reactstrap'
import { orders, lead, buyers } from '../util/db'
import FoldableTableHOC from "react-table/lib/hoc/foldableTable";
import 'react-table/react-table.css'
import Alerts from '../controller/alerts'
import {withRouter, Link} from 'react-router-dom'
import classnames from 'classnames';
const FoldableTable = FoldableTableHOC(ReactTable);

function OrderDisplay(props){
    const [data, setData] = useState([])
    const [leads, setLeads] = useState([])
    const [buyer, setBuyer] = useState([])
    const [orderVertical, setOrderVertical] = useState([])
    const [activeTab, setActiveTab] = useState('order');
    const [edit, setEdit] = useState(false)
    const toggle = tab => {
      if(activeTab !== tab) setActiveTab(tab);
    }

    useEffect(() => {
        handleOrderSearch()
    }, [])

    useEffect(() => {
        if(data && data[0]){
            handleBuyerSearch()
        }
    },[data])

    const handleOrderSearch = async () => {
        const order = await orders('', 'search', {
            'fields': 'id,billing,priority,payment,credits,buyer_id,lead_price,po_number,open,timestamp', 
            'filter[id]': props.match.params.id
        })

        const leads = await lead('', 'get-by-order', {'order_id' : props.match.params.id})

        const orderVertical = await orders('', 'vertical', {'id' : props.match.params.id})

        const items = order && order.items ? order.items : []
        const leadItems = leads || []
        setData(items)
        setLeads(leadItems)
        setOrderVertical(orderVertical && orderVertical.items ? orderVertical.items : [])
    }    


    const handleBuyerSearch = async () => {
        const buyerData = await buyers('', 'search', {
            'fields': 'company_name,name,affiliate,address,city,state,country,work_phone,cell_phone,contact_email', 
            'filter[id]' : data[0].buyer_id,
         })
         setBuyer(buyerData && buyerData.items ? buyerData.items : [])
    }

    const handleEdit = () => setEdit(!edit);

    const handleOrderEdit = e => {
        let list = [...data]
        list[0][e.target.name] = e.target.name === "open" ? parseInt(e.target.value) :  e.target.value 
        setData(list)
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        const update = await orders(data[0], 'update')
        if(update && update["code"] === 201){
            Alerts.success('Order updated successfully')
            handleEdit()
        } else {
            Alerts.error(update)
        }
    }

    const viewLead = (e,id) => {
        props.history.push(`/leads/${id}`)
    }

    console.log(orderVertical)

    const Bread = () => {
        return (
          <div>
            <Breadcrumb>
              <BreadcrumbItem><Link to="/orders">Orders</Link></BreadcrumbItem>
              <BreadcrumbItem active>Order Information</BreadcrumbItem>
            </Breadcrumb>
          </div>
        );
      };

    return(
        <div>
            <Bread />
            <br />
    <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'order' })}
            onClick={() => { toggle('order'); }}
          >
            Order Information
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'buyer' })}
            onClick={() => { toggle('buyer'); }}
          >
            Buyer Information
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'sold' })}
            onClick={() => { toggle('sold'); }}
          >
            Leads sold
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="order">
          <Row>
            <Col>
                <Card body>
                    <CardTitle>Order Information</CardTitle>
                    <CardText>
                    {data ? data.map((items, index) => 
                    <div key={index}>
                        <dl>
                            {Object.keys(items).map((key) => 
                                <span key={key}>
                                    <dt>{key}</dt>
                                    {edit 
                                        ? key === 'open' 
                                            ? 
                                                <Input type="select" name="open" defaultValue={items[key]} onChange={(e) => handleOrderEdit(e, index)}>
                                                    <option value="0">False</option>
                                                    <option value="1">True</option>
                                                </Input>

                                             : <Input type="text" onChange={(e) => handleOrderEdit(e, index)} name={key} value={items[key]} />
                                    : key === 'open' 
                                        ? items[key] === 1 ? <dd>true</dd> : <dd>false</dd>
                                        : <dd>{items[key]}</dd>
                                    }                        
                                </span>    
                            )}
                        </dl>
                        <Button color="primary" onClick={(e) => handleEdit('orderEdit')}>Edit</Button>{' '}
                        {edit ? <Button color="success" onClick={(e) => handleEditSubmit(e)}>Save Changes</Button> : ''}
                    </div>   
                    ) : ''}
                    </CardText>    
                </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="buyer">
          <Row>
            <Col>
              <Card body>
                <CardTitle>Buyer</CardTitle>
                <CardText>
                {data && data.length ? data.map((items, index) => 
                    <dl key={index}>
                        {Object.keys(items).map((key) => 
                            <span key={key}>
                                <dt>{key}</dt>
                                <dd>{items[key]}</dd>
                            </span>    
                        )}
                    </dl>
                ) : ''}
                </CardText>
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="sold">
          <Row>
            <Col>
                <Card body>
                <Table>
                    <thead>
                        <tr>
                            <th>Vendor Name</th>
                            <th>Vertical</th>
                            <th>Sold Price</th>
                            <th>Sold Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>   
                        {leads && leads.length > 0 ?Object.keys(leads).map((items,idx) => 
                            <tr key={idx}>
                                <td>{leads[items].vendor_name}</td>
                                <td>{leads[items].vertical_label}</td>
                                <td>{leads[items].sold_price}</td>
                                <td>{leads[items].sold_date}</td>
                                <td><Button color="success" onClick={e => viewLead(e, leads[items].lead_id)}>View Lead</Button></td>
                            </tr>
                        ): <tr><td>No leads purchased</td></tr>}
                    </tbody>     
                </Table> 
                </Card>   
            </Col>
          </Row>
        </TabPane>
      </TabContent>
      </div>
    )
}

export default withRouter(OrderDisplay)

// export default class OrdersDisplay extends Component {

//     state = {
//         data: [],
//         leads: [],
//         buyer: [],
//         display: 'order',
//         orderEdit: false
//     }

//     componentDidMount(){
//         this.getOrderRecord()
//     }

//     getOrderRecord = async () => {
//         const order = await orders('', 'search', {
//             'fields': 'id,billing,payment,credits,buyer_id,lead_price,po_number,priority,open,timestamp', 
//             'filter[id]': this.props.match.params.id
//         })

//         const { items } = order || []
//         let leadData = []
//         let buyerData = []
//         if(items && items[0]){
//            leadData = await lead('', 'sold', {'id' : this.props.match.params.id})
//            buyerData = await buyers('', 'search', {
//                'fields': 'company_name,name,affiliate,address,city,state,country,work_phone,cell_phone,contact_email', 
//                'filter[id]' : items[0].buyer_id,
//             })
//         }  

        
//         this.setState({
//             loading: false,
//             data: items,
//             leads: leadData && leadData.items ? leadData.items : [],
//             buyer: buyerData && buyerData.items ? buyerData.items : []
//         })

//     }

//     handleDisplayChange = type => {
//         this.setState({
//             display: type
//         })
//     }

//     handleEdit = (value) => {
//         this.setState(prevState => ({
//             [value]: !prevState[value]
//         }))
//     }

//     handleOrderEdit = e => {
//         const data = this.state.data
//         data[0][e.target.name] = e.target.value
//         this.setState({
//             data: data
//         })
//     }

//     handleEditSubmit = async (e) => {
//         e.preventDefault()
//         const update = await orders(this.state.data[0], 'update')
//         if(update){
//             Alerts.success('Order updated successfully')
//         } else {
//             const error = {
//                 name: "Error",
//                 message: "There was a problem updating this order"
//             }
//             Alerts.error(error)
//         }
//     }

//     render(){
//         const { data, leads, loading, buyer, display, orderEdit } = this.state
//         return(
//             <div>
//                 <Row>
//                     <Col md="4">
//                         <CardBuyerOptions
//                             handleDisplayChange={this.handleDisplayChange}
//                         />
//                     </Col>    
//                     <Col>
//                     {display === 'order' ?
//                     <CardBuyerOrders
//                         data={data}
//                         handleEdit={this.handleEdit}
//                         handleEditSubmit={this.handleEditSubmit}
//                         orderEdit={orderEdit}
//                         handleOrderEdit={this.handleOrderEdit}
//                     />
//                     : ''}
//                     {display === 'sold' ?
//                     <CardSoldLeads
//                         data={leads}
//                         loading={loading}
//                     />
//                     : ''}
//                     {display === 'buyer' ?
//                     <CardBuyer
//                         buyer={buyer}
//                     />
//                     : ''}
//                     </Col>
//                 </Row>    
//             </div>    
//         )
//     }
// }

// const CardBuyerOptions = ({ handleDisplayChange }) => (
//     <Card>
//         <CardHeader>
//         <h1 className="display-4 mb-0" style={{fontSize: "20px"}}>Order Options</h1>
//         </CardHeader> 
//         <CardBody>
//             <ul className="list-unstyled">
//                 <li onClick={(e) => handleDisplayChange('order')}>Order Information</li>
//                 <li onClick={(e) => handleDisplayChange('buyer')}>Buyer</li>
//                 <li onClick={(e) => handleDisplayChange('sold')}>Sold Leads</li>
//             </ul>    
//         </CardBody>     
//     </Card>
// )

// const CardBuyerOrders = ({ data, handleEdit, orderEdit, handleEditSubmit, handleOrderEdit }) => (
//     <Card>
//     <CardHeader>
//         Order Information
//     </CardHeader>
//     <CardBody>
//         <Display
//             data={data}
//             handleEdit={handleEdit}
//             orderEdit={orderEdit}
//             handleEditSubmit={handleEditSubmit}
//             handleOrderEdit={handleOrderEdit}
//         />
//     </CardBody>        
//     </Card> 
// )

// const CardSoldLeads = ({ data, loading }) => (
//     <Card>
//     <CardHeader>
//         Sold Leads
//     </CardHeader>
//     <CardBody>
//         <SoldLeadsDisplay
//             data={data}
//             loading={loading}
//         />
//     </CardBody>        
//     </Card> 
// )

// const CardBuyer = ({ buyer }) => (
//     <Card>
//     <CardHeader>
//         Buyer Information
//     </CardHeader>
//     <CardBody>
//         <DisplayBuyer
//             buyer={buyer}
//         />
//     </CardBody>        
//     </Card> 
// )

// const BuyerDisplay = ({ data }) => (
//     <div>
//     {data && data.length ? data.map((items, index) => 
//         <dl key={index}>
//             {Object.keys(items).map((key) => 
//                 <span key={key}>
//                     <dt>{key}</dt>
//                     <dd>{items[key]}</dd>
//                 </span>    
//             )}
//         </dl>
//     ) : ''}
//     </div>    
// ) 

// const Display = ({ data, handleEdit, orderEdit, handleOrderEdit, handleEditSubmit }) => {
//     return(
//     data ? data.map((items, index) => 
//      <div>
//         <dl key={index}>
//             {Object.keys(items).map((key) => 
//                 <span key={key}>
//                     <dt>{key}</dt>
//                     {orderEdit ?
//                         <Input type="text" onChange={(e) => handleOrderEdit(e, index)} name={key} value={items[key]} />
//                         : <dd>{items[key]}</dd>
//                     }                        
//                 </span>    
//             )}
//         </dl>
//         <Button color="primary" onClick={(e) => handleEdit('orderEdit')}>Edit</Button>{' '}
//         {orderEdit ? <Button color="success" onClick={(e) => handleEditSubmit(e)}>Save Changes</Button> : ''}
//      </div>   
//     ) : '' 
//     ) 
// }

// const DisplayBuyer = ({ buyer }) => (
//     buyer && buyer.length ? buyer.map((items, index) => 
//         <dl key={index}>
//             {Object.keys(items).map((key) => 
//                 <span key={key}>
//                     <dt>{key}</dt>
//                     <dd>{items[key]}</dd>
//                 </span>    
//             )}
//         </dl>
//     ) : ''
// )

// const SoldLeadsDisplay = ({ data, loading }) => (
//     <FoldableTable
//         data={data}
//         columns={
//         [{
//             Header: "Price",
//             accessor: "price",
//             id: "price",
//             foldable: true
//         },{
//             Header: "Sold Price",
//             accessor: "sold_price",
//             id: "sold_price",
//             foldable: true
//         },{
//             Header: "Company Name",
//             accessor: "company_name",
//             id: "company_name",
//             foldable: true
//         },{
//             Header: "Vendor",
//             id: "vendor_label",
//             accessor: "vendor_label",
//             foldable: true
//         }]
//     }
//     pageSize={data ? data.length : 20}
//     loading={loading}
//     filterable={false}
//     className="-striped -highlight"
// />
// )
