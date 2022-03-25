import React, { Component, useState, useEffect, Fragment } from 'react'
import { buyers, orders,lead, vertical, buyerVertical, fieldDefinition, buyerFieldDefinition, zipcode, buyerZipCode, verticalFieldDefinition,universalFieldDefinition, buyerDeliverys, vendors, accounts, modal } from '../util/db'
import { base } from '../config/endpoints'
import Alerts from '../controller/alerts'
import classnames from 'classnames';
import { state } from '../static/states'
import { Link } from 'react-router-dom'
import XMLViewer from 'react-xml-viewer'
import { 
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    Form, 
    FormGroup, 
    Label, 
    Input, 
    FormText,
    Card,
    CardHeader,
    CardBody,
    Col,
    Row,
    Button,
    Breadcrumb,
    BreadcrumbItem,
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
    Table,
    Badge,
    Alert
} from 'reactstrap';
import ReactTable from 'react-table'
import FoldableTableHOC from "react-table/lib/hoc/foldableTable";
import 'react-table/react-table.css'
import Select from 'react-select'
import { ENGINE_METHOD_PKEY_METHS } from 'constants';
const FoldableTable = FoldableTableHOC(ReactTable);

const Bread = ({data}) => {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem><Link to="/buyer">Buyer</Link></BreadcrumbItem>
          <BreadcrumbItem active>Edit {data && data[0] ? ` - ${data[0].company_name}` : ''}</BreadcrumbItem>
        </Breadcrumb>
      </div>
    );
  };

const NewOrder = ({ orderModal, toggleOrderModal, handleFormChange, formSubmit}) => (
    <div>
    <Modal isOpen={orderModal} toggle={toggleOrderModal} className="modal-lg">
      <ModalBody>
        <Form>
        <FormGroup>
            <Label>Billing</Label>
            <Input type="select" name="billing" onChange={(e) => handleFormChange(e)}>
            <option>Select billing...</option>
            <option>Weekly</option>
            <option>Biweekly</option>
          </Input>
        </FormGroup> 
        <FormGroup>
            <Label>Payment</Label>
            <Input type="select" name="payment" onChange={(e) => handleFormChange(e)}>
            <option>Select payment...</option>
            <option>Prepaid</option>
            <option>Postpaid</option>
          </Input>
        </FormGroup>
        <FormGroup> 
        <Label>Credits</Label>
            <Input type="number" name="credits" onChange={(e) => handleFormChange(e)}  />
        </FormGroup>  
        <FormGroup> 
        <Label>Priority</Label>
            <Input type="number" name="priority" onChange={(e) => handleFormChange(e)}  />
        </FormGroup> 
        <FormGroup> 
        <Label>Lead Price</Label>
            <Input type="float" name="lead_price" onChange={(e) => handleFormChange(e)}  />
        </FormGroup>   
        </Form>    
      </ModalBody>
      <ModalFooter>
           <button className="btn btn-primary" onClick={(e) => formSubmit(e)}>Add</button>{' '}
           <button className="btn btn-secondary" onClick={(e) => toggleOrderModal}>Cancel</button>
          </ModalFooter>
    </Modal>
  </div>
)

// function BuyerDisplay(props){
//     const [data, setData] = useState([])
//     const [orders, setOrders] = useState([])
//     const [vertical, setVertical] = useState([])
//     const [fields, setFields] = useState([])
//     const [zipCodesList, setZipCodeList] = useState([])
//     const [zipCodeDistanceList, setZipCodeDistanceList] = useState([])
//     const [zipCodeDistance, setZipCodeDistance] = useState()
//     const [zipCodeDistanceMiles, setZipCodeDistanceMiles] = useState()
//     const [mapped_terms, setMapped_Terms] = useState([{ currentField: '', mappedField: ''}])
//     const [mapped, setMapped] = useState([])
//     const [orderModal, setOrderModal] = useState(false)
//     const [billing, setBilling] = useState()
//     const [buyer_id, setBuyer_ID] = useState(props.match.params.id)
//     const [payment, setPayment] = useState()
//     const [credits, setCredits] = useState(0)
//     const [lead_price, setLead_Price] = useState(0)
//     const [priority, setPriority] = useState(1)
//     const [buyerEdit, setBuyerEdit] = useState(false)
//     const [mappedEdit, setMappedEdit] = useState(false)
//     const [zipCodeEdit, setZipCodeEdit] = useState(false)

//     useEffect(() => {
//         handleSearch()
//         handleOrders()
//         handleVerticals()
//         viewAllFieldDefinitions()
//     }, []);

//     async function handleSearch(){
//         const search = await buyers('', 'search', { 
//             'filter[id]': props.match.params.id, 
//             'expand': "buyerVerticals,buyerFieldDefinitions,zipCodes"
//         })
//         setData(search && search.items ? search.items : [])
//     }

//     async function handleOrders(){
//         const order = await orders('', 'search', { 'filter[buyer_id]': props.match.params.id })
//         setOrders(order && order.items ? order.items : [])
//     }

//     async function handleVerticals(){
//         const verticals = await buyerVertical('', 'search', { 
//             'expand' : 'vertical',
//             'filter[buyer_id]': props.match.params.id 
//         })
//         setVertical(verticals ? verticals : [])
//     }

//     async function viewAllFieldDefinitions(){
//         const results = await fieldDefinition()
//         setFields(results)
//      } 
 
//     const handleFormChange = e => {
//         this.setState({
//             [e.target.name]: e.target.value
//         })
//     }

//     return(

//     )
// }


export default class BuyerDisplay extends Component {

    state = {
        data: [],
        orders: [],
        vertical: [],
        fields: [],
        zipCodeList: [],
        zipCodeDistanceList: [],
        zipCodeDistance: '',
        zipCodeDistanceMiles: '',
        mapped_terms: [{ currentField: '', mappedField: ''}],
        mapped: {},
        orderModal: false,
        billing: '',
        buyer_id: this.props.match.params.id,
        payment: '',
        credits: 0,
        lead_price: 0,
        priority: 1,
        display: 'buyer',
        buyerEdit: false,
        mappedEdit: false,
        zipcodeEdit: false,
        activeTab: 'buyer',
        buyerFields: [],
        vendors: [],
        buyerVendors: [],
        account: true
     }


    componentDidMount = async () => {
        const search = await buyers('', 'search', { 
            'filter[id]': this.props.match.params.id, 
            'expand': "buyerVerticals,buyerFieldDefinitions,zipCodes"
        })
        const order = await orders('', 'search', { 'filter[buyer_id]': this.props.match.params.id })
        const verticals = await buyerVertical('', 'search', { 
            'expand' : 'vertical',
            'filter[buyer_id]': this.props.match.params.id 
        } )

        const data = {
            external_id: this.props.match.params.id,
          }
        
        const checkAccount = await accounts(data, 'externalID')


        const vendorSearch = await vendors('', 'search', '')

        const buyerField = await buyerFieldDefinition({'buyer_id' : this.props.match.params.id }, 'buyer')

        const buyerVendor = await buyers('',"buyer-vendors", { 'buyer_id' : this.props.match.params.id})
        this.viewAllFieldDefinitions()
        this.setState({ 
            data: search.items || [],
            orders: order.items || [],
            vertical: verticals || [],
            buyerFields : buyerField || [],
            vendors: vendorSearch && vendorSearch.items ? vendorSearch.items : [], 
            buyerVendors: buyerVendor || [],
            account: checkAccount
        })
    }

    toggleOrderModal = () => {
        this.setState(prevState => ({
            orderModal: !prevState.orderModal
        }))
    }  

    handleFormChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    toggle = tab => {
        if(this.state.activeTab !== tab){
            this.setState({
                activeTab: tab
            })
        }
    }

    formSubmit = async e => {
        e.preventDefault()
        const submitValues = {
            billing: this.state.billing,
            buyer_id: this.state.buyer_id,
            payment: this.state.payment,
            credits: this.state.credits,
            lead_price: this.state.lead_price,
            priority: this.state.priority
        }
        const add = await orders(submitValues, 'create')
        if(add){
           const order =  await orders('', 'search', { 'filter[buyer_id]': this.props.match.params.id })
           this.setState({ 
            orders: order,
            orderModal: false
        })
        }
    }

    handleDisplayChange = type => {
        this.setState({
            display: type
        })
    }

    editBuyer = (e) => {
        const { data} = this.state
        data[e.target.name] = e.target.value
        this.setState({
            data
        })
    }

    handleEdit = (value) => {
        this.setState(prevState => ({
            [value]: !prevState[value]
        }))
    }

    viewAllFieldDefinitions = async () => {
        const results = await fieldDefinition()
        this.setState({
            fields: results.items
        })
     } 

    // This sections handles editing of mapped terms 

    addAdditional = (e) => {
        e.preventDefault()
        this.setState((prevState) => ({
                mapped_terms: 
                    [...prevState.mapped_terms, {currentField: '', mappedField: ''}
                ],
        }));
      }

    handleAddAdditionalChangeSelect = (e, value, id) => {
        const classValue = value.trim()
        const arrayKey = id.replace(`${classValue}-`, '').trim()
        let additionalQueryTerms = [...this.state.mapped_terms]
        additionalQueryTerms[arrayKey][classValue] = e.value
        this.setState({ additionalQueryTerms })
   } 
   
   handleAddAdditionalChangeInput = e => {
     const classValue = e.target.className.replace(/form-control/g, '').trim()
     const arrayKey = e.target.id.replace(`${classValue}-`, '').trim()
     let additionalQueryTerms = [...this.state.mapped_terms]
     additionalQueryTerms[arrayKey][classValue] = e.target.value
     this.setState({ additionalQueryTerms }) 
   }

    addBuyerMappedFields = async e => {
       e.preventDefault()
       const fields = {
            mapped: this.state.mapped_terms,
            id: this.props.match.params.id 
       }
       const add = await buyerFieldDefinition(fields, 'add')
       if(add){
           Alerts.success('New field successfully created')
       }
   }

   updateBuyerMappedFieldsSelect = (e, index) => {
        const { data } = this.state
        data[0]["buyerFieldDefinitions"][index]["name"] =  e
        this.setState({
            data
        })
   }

   updateBuyerMappedFieldsData = (e, index) => {
    const { data } = this.state
    data[0]["buyerFieldDefinitions"][index][e.target.name] =  e.target.value
    this.setState({
        data
    }) 
   }

   updateBuyerSubmit = async (e, index) => {
    e.preventDefault()
    const { data } = this.state
    const items = data[0]["buyerFieldDefinitions"][index]
    const update = await buyerFieldDefinition(items, 'update')
    if(update){
        Alerts.success('Fields updated successfully')
    }
   }

   handleZipcodesByState = async (item) => {
    let data = []
    if(item){
    item.map(async items => 
         data.push(items.value)
    )
    const states = data.join(',')
    let set = []
    const results = await zipcode('', 'state', {'state': states })
    Object.keys(results).map(items => 
        results[items].map(item => 
            set.push(item)
        )
    )
    this.setState({
        zipCodeList: set
    }, () => {
        console.log(this.state.zipCodeList)
    })
    }

}

handleZipCodeDistance = e => {
    this.setState({
        [e.target.name]: e.target.value
    })
}

handleZipcodeDistanceLocate = async e => {
    e.preventDefault()
    const results = await zipcode('', 'distance', {'zip': this.state.zipCodeDistance, 'miles': this.state.zipCodeDistanceMiles })
    this.setState(prevState => ({
        zipCodeDistanceList: [...prevState.zipCodeDistanceList, ...results]
    }), () => {
        console.log(this.state.zipCodeDistanceList)
    })
 }

 handleZipcodeDistanceSubmit = async e => {
     e.preventDefault()
     const list = {
        id: this.props.match.params.id,
        zipCodesDistance: this.state.zipCodeDistanceList
     }
     const submit = await buyerZipCode(list, 'distance')
     if(submit){
        const search = await buyers('', 'search', { 
            'filter[id]': this.props.match.params.id, 
            'expand': "buyerVerticals,buyerFieldDefinitions,zipCodes"
        })
        this.setState({ 
            data: search.items || []
        })
        Alerts.success('New zipcodes added to buyer')
    }
 }

    handleAddStateZipcodesSubmit = async e => {
        const list = {
            id: this.props.match.params.id,
            zipCodesState: this.state.zipCodeList
        }
        const submit = await buyerZipCode(list, 'state')
        if(submit){
            const search = await buyers('', 'search', { 
                'filter[id]': this.props.match.params.id, 
                'expand': "buyerVerticals,buyerFieldDefinitions,zipCodes"
            })
            this.setState({ 
                data: search.items || []
            })
            Alerts.success('New zipcodes added to buyer')
        }
    }

    handleZipCodeUdpate = (e) => {
        console.log(e.target.value)
    }

    handleDeleteZipCodes = async (e) => {
        const list = {
            id: this.props.match.params.id,
        }
        const submit = await buyerZipCode(list, 'delete') 
        if(submit){
            const search = await buyers('', 'search', { 
                'filter[id]': this.props.match.params.id, 
                'expand': "buyerVerticals,buyerFieldDefinitions,zipCodes"
            })
            this.setState({ 
                data: search.items || []
            })
            Alerts.success('All zipcodes removed')
        }
    }

    handleBuyerEdit = (e) => {
        const data = this.state.data
        if(e.target.name === 'paused' || e.target.name === 'all_vendors'){
            data[0][e.target.name] = +e.target.checked
            if(e.target.checked === true){
                data[0]["vendors"] = []
            }    
        } else {
            data[0][e.target.name] = e.target.value
        }    
        this.setState({
            data: data
        }, () => {
        })
    }

    handleEditSubmit = async (e) => {
        e.preventDefault()
        const update = await buyers(this.state.data[0], 'update')
        if(update && update["code"] === 201){
            Alerts.success('Buyer updated successfully')
            const buyerVendor = await buyers('',"buyer-vendors", { 'buyer_id' : this.props.match.params.id})
            this.setState({
                buyerEdit: false,
                buyerVendors: buyerVendor
            })
        } else {
            const errors = {
                name : "Error updating",
                message: update
            }
            Alerts.error(errors)
        }
    }

    handleDeleteBuyer = async (e) => {
        e.preventDefault()
        const data = {
            id: this.props.match.params.id
        }
        const deleteBuyer = await buyers(data, 'delete')
        if(deleteBuyer){
            Alerts.success('Buyer successfully deleted')
            this.props.history.push(`/buyer`)
        } else {
            const error = {
                name: "Error",
                message: "There was a problem deleting this buyer"
            }
            Alerts.error(error)
        }
    }


   //End section of editing mapped terms


    ordersDisplay = row => {
        this.props.history.push(`/orders/${row.original.id}`)
    }

    handleNewVertical = async data => {
        const add = await buyers(data, 'display')
        if(add && add.code === 201){
            const buyerField = await buyerFieldDefinition({'buyer_id' : this.props.match.params.id }, 'buyer')
            this.setState({
                buyerFields: buyerField
            })
        } 
    }

    updateZipcodes = async data => {
        const add = await buyers(data, 'display_zipcodes')
        if(add){
            const search = await buyers('', 'search', { 
                'filter[id]': this.props.match.params.id, 
                'expand': "buyerVerticals,buyerFieldDefinitions,zipCodes"
            })

            this.setState({
                data: search.items || []
            })
        }
    }

    handleBuyerVendorDelete = async id => {
        const data = {
            id: id
        }
        const deleteBuyer = await buyers(data, 'buyer-vendors-delete')
        if(deleteBuyer){
            Alerts.success('Buyer Vendor successfully deleted')
            const buyerVendor = await buyers('',"buyer-vendors", { 'buyer_id' : this.props.match.params.id})
            this.setState({
                buyerVendors: buyerVendor
            })
        } else {
            const error = {
                name: "Error",
                message: "There was a problem deleting this vendor"
            }
            Alerts.error(error)
        }
    }

    handleMultiChange = (value, name) => {
        let id = []
       if(value && value.length) {
           Object.keys(value).map(items =>
            id.push(value[items].value)
           ) 
        }
        const data = this.state.data
        data[0][name] = id
        this.setState({
            data: data
        })
    }

    render(){
        console.log(this.state.data)
        const { data, orders, orderModal, fields, vertical, display, buyerEdit, mappedEdit, mapped_terms, buyerZipCodes, zipcodeEdit, zipCodeDistanceList, vendors, buyerVendors, account  } = this.state
        return(
            <div>
                <Bread 
                    data={data}
                />
                {this.state.data && this.state.data[0] && this.state.data[0].paused === 1 ?
                <Alert color="warning">This vendor will not recieve any leads until you uncheck pause</Alert>
                : ''}
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === 'buyer' })}
                            onClick={() => { this.toggle('buyer'); }}
                        >
                            Buyer information
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === 'customized_fields' })}
                            onClick={() => { this.toggle('customized_fields'); }}
                        >
                            Customized Fields
                        </NavLink>
                    </NavItem>
                    {/* <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === 'zipcodes' })}
                            onClick={() => { this.toggle('zipcodes'); }}
                        >
                            Zipcodes
                        </NavLink>
                    </NavItem> */}
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === 'purchase_orders' })}
                            onClick={() => { this.toggle('purchase_orders'); }}
                        >
                            Purchase Orders
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="buyer">
                    <Row>
                        <Col>
                            <Card body>
                                {this.state.activeTab === "buyer" ?
                                <DisplayBuyer 
                                    data={data}
                                    buyerEdit={buyerEdit}
                                    handleBuyerEdit={this.handleBuyerEdit}
                                    handleEdit={this.handleEdit}
                                    handleEditSubmit={this.handleEditSubmit }
                                    vendors={vendors}
                                    buyerVendors={buyerVendors}
                                    handleBuyerVendorDelete={this.handleBuyerVendorDelete}
                                    handleMultiChange={this.handleMultiChange}
                                    account={account}
                                />
                                : ''}
                            </Card>
                        </Col>        
                    </Row>
                    </TabPane>
                    <TabPane tabId="customized_fields">
                        <Row>
                        <Col>
                            <Card body>
                            {this.state.activeTab === "customized_fields" ?
                            <DisplayBuyerMappedFields
                                buyerFields={this.state.buyerFields}
                                buyerId={this.props.match.params.id }
                                handleNewVertical={this.handleNewVertical}
                            />
                            : ''}
                            </Card>
                        </Col>        
                    </Row>  
                    </TabPane>
                    {/* <TabPane tabId="zipcodes">
                        <Row>
                        <Col>
                            <Card body>
                            <CardBuyerZipcodes
                                data={data}
                                handleZipcodesByState={this.handleZipcodesByState}
                                buyerZipCodes={buyerZipCodes}
                                handleToggle={this.handleToggle}
                                handleZipCodeDistance={this.handleZipCodeDistance}
                                handleZipcodeDistanceSubmit={this.handleZipcodeDistanceSubmit}
                                handleAddBuyerFormChange={this.handleAddBuyerFormChange}
                                zipcodeEdit={zipcodeEdit}
                                handleEdit={this.handleEdit}
                                handleAddStateZipcodesSubmit={this.handleAddStateZipcodesSubmit}
                                handleZipCodeUdpate={this.handleZipCodeUdpate}
                                handleDeleteZipCodes={this.handleDeleteZipCodes}
                                zipCodeDistanceList={zipCodeDistanceList}
                                handleZipcodeDistanceLocate={this.handleZipcodeDistanceLocate}
                                updateZipcodes={this.updateZipcodes}
                                buyerId={this.props.match.params.id }
                            />  
                        </Card>
                        </Col>
                        </Row>    
                    </TabPane> */}
                    <TabPane tabId="purchase_orders">
                    <Row>
                        <Col>
                            <Card body>
                            {this.state.activeTab === "purchase_orders" ?
                            <CardBuyerOrders
                                data={orders}
                                ordersDisplay={this.ordersDisplay}
                            />
                            : ''}
                            </Card>
                        </Col>
                    </Row>        
                    </TabPane>        
                </TabContent>
                {/* <Row>
                    <Col md="4">
                        <CardBuyerOptions
                            handleDisplayChange={this.handleDisplayChange}
                            handleDeleteBuyer={this.handleDeleteBuyer}
                        />
                    </Col>
                    <Col md="8"> 
                        {display === 'orders' ? 
                        <CardBuyerOrders
                            data={orders}
                            ordersDisplay={this.ordersDisplay}
                        />
                        : ''}
                        {display === 'buyer' ?
                        <CardBuyerData 
                            data={data}
                            buyerEdit={buyerEdit}
                            handleEdit={this.handleEdit}
                            handleBuyerEdit={this.handleBuyerEdit}
                            handleEditSubmit={this.handleEditSubmit}
                        />
                        : ''}
                        {display === 'fields' ?
                        <CardBuyerFields
                            data={data}
                            mappedEdit={mappedEdit}
                            fields={fields}
                            addAdditional={this.addAdditional}
                            handleEdit={this.handleEdit}
                            mapped_terms={mapped_terms}
                            handleAddAdditionalChangeSelect={this.handleAddAdditionalChangeSelect} 
                            handleAddAdditionalChangeInput={this.handleAddAdditionalChangeInput}
                            updateBuyerMappedFieldsSelect={this.updateBuyerMappedFieldsSelect}
                            updateBuyerMappedFieldsData={this.updateBuyerMappedFieldsData}
                            updateBuyerSubmit={this.updateBuyerSubmit}
                            addBuyerMappedFields={this.addBuyerMappedFields}
                        />
                        : ''}
                        {display === 'verticals' ?    
                        <CardBuyerVerticals
                            data={vertical}
                        />  
                        : ''}
                        {display === 'zipcodes' ?
                        <CardBuyerZipcodes
                            data={data}
                            handleZipcodesByState={this.handleZipcodesByState}
                            buyerZipCodes={buyerZipCodes}
                            handleToggle={this.handleToggle}
                            handleZipCodeDistance={this.handleZipCodeDistance}
                            handleZipcodeDistanceSubmit={this.handleZipcodeDistanceSubmit}
                            handleAddBuyerFormChange={this.handleAddBuyerFormChange}
                            zipcodeEdit={zipcodeEdit}
                            handleEdit={this.handleEdit}
                            handleAddStateZipcodesSubmit={this.handleAddStateZipcodesSubmit}
                            handleZipCodeUdpate={this.handleZipCodeUdpate}
                            handleDeleteZipCodes={this.handleDeleteZipCodes}
                            zipCodeDistanceList={zipCodeDistanceList}
                            handleZipcodeDistanceLocate={this.handleZipcodeDistanceLocate}
                        />    
                        : ''}
                      </Col>
                 </Row>        */}
                {/* <NewOrder  
                    toggleOrderModal={this.toggleOrderModal}
                    orderModal={orderModal}
                    formSubmit={this.formSubmit}
                    handleFormChange={this.handleFormChange}
                /> */}
                {/* {Object.keys(data).map((items, idx ) => 
                    <h1>{data[items].company_name}</h1>
                )}
                </div>
                <h2>Purchase Orders</h2>
                <table className="table" style={{backgroundColor: 'white'}}>
                    <thead>
                        <tr>
                            <th>Priority</th>
                            <th>PO Number</th>
                            <th>Payment type</th>
                            <th>Billing cycle</th>
                            <th>Lead Purchase Price</th>
                            <th>Remaining credits</th>
                            <th>Open</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders ? Object.keys(orders).map((items,idx) => (
                            <tr key={idx}>
                                <td>{orders[items].priority}</td>
                                <td>{orders[items].po_number}</td>
                                <td>{orders[items].payment}</td>
                                <td>{orders[items].billing}</td>
                                <td>{orders[items].lead_price}</td>
                                <td>{orders[items].credits}</td>
                                <td>{orders[items].open === 1 ? "true" : 'false'}</td>
                                <td>{orders[items].timestamp}</td>
                            </tr>    
                        )) 
                        : 
                        <tr>
                            <td>No Open Orders</td>
                        </tr>
                        }
                    </tbody>    
                </table> */}
            </div>   
        )
    }
}

const CardBuyerOptions = ({ handleDisplayChange, handleDeleteBuyer }) => (
    <Card>
        <CardHeader>
        <h1 className="display-4 mb-0" style={{fontSize: "20px"}}>Buyer Options</h1>
        </CardHeader> 
        <CardBody>
            <ul className="list-unstyled">
                <li onClick={(e) => handleDisplayChange('buyer')}>Buyer</li>
                <li onClick={(e) => handleDisplayChange('fields')}>Mapped Fields</li>
                <li onClick={(e) => handleDisplayChange('verticals')}>Verticals</li>
                <li onClick={(e) => handleDisplayChange('zipcodes')}>Zipcodes</li>
                <li onClick={(e) => handleDisplayChange('orders')}>Purchase Orders</li>
                <br />
                <br />
                <Button color="danger" onClick={(e) => {if(window.confirm('Are you sure you want to delete this buyer? You will not be able to recover any information.')) {handleDeleteBuyer(e)}}}>Delete Buyer</Button>
            </ul>    
        </CardBody>     
    </Card>
)

const CardBuyerOrders = ({ data, ordersDisplay }) => (
        <DisplayOrders 
            data={data}
            ordersDisplay={ordersDisplay}
        />
)



//Creates display for Buyer zipcodes

const CardBuyerZipcodes = ({ 
    data,
    handleZipcodesByState, 
    buyerZipCodes, 
    handleToggle, 
    handleZipcodeDistanceSubmit, 
    handleZipCodeDistance, 
    handleAddBuyerFormChange,
    zipcodeEdit,
    handleEdit,
    handleAddStateZipcodesSubmit,
    handleZipCodeUdpate,
    handleDeleteZipCodes,
    zipCodeDistanceList,
    handleZipcodeDistanceLocate,
    updateZipcodes,
    buyerId
}) => (
    <div>
    {zipcodeEdit ?
    <NewBuyerZipCodes 
            updateZipcodes={updateZipcodes}
            buyerId={buyerId }
        /> 
    : ''} 
        <DisplayBuyerZipcodes
            data={data}
            zipcodeEdit={zipcodeEdit}
            handleEdit={handleEdit}
            handleZipCodeUdpate={handleZipCodeUdpate}
            handleDeleteZipCodes={handleDeleteZipCodes}
        />    
    </div> 
)

const DisplayBuyer = ({ data, buyerEdit, handleEdit, handleBuyerEdit, handleEditSubmit, vendors, handleMultiChange, buyerVendors, handleBuyerVendorDelete, account }) => {
    const items = data && data[0] ? data[0] : []
    const vendorArray = vendors ? Object.keys(vendors).map(items => ({
        value: vendors[items].id,
        label: vendors[items].company_name
    })) : []

    return(
    <div>
        <Row>
            <Col>
        {data && data.length > 0 ?
        <FormGroup check style={{paddingBottom: "20px"}}>
                <Label check>
                    <Input
                        type="checkbox" 
                        name="paused" 
                        checked={items.paused === 1 ? "checked" : ''}  
                        onChange={(e) => handleBuyerEdit(e)} 
                    />{' '}
                    Pause (Leads will not be sent to this vendor)
                </Label>
        </FormGroup>
        : ''}
        <FormGroup check style={{paddingBottom: "20px", paddingTop: "20px"}}>
            <Label check>
                <Input
                    type="checkbox" 
                    name="all_vendors" 
                    checked={items.all_vendors === 1 ? "checked" : ''}  
                        onChange={(e) => handleBuyerEdit(e)} 
                    />{' '}
                    Select all vendors
                </Label>
        </FormGroup>   
        { items.all_vendors  === 0  ?
        <FormGroup>
            <Label>Preferred Vendors</Label>
            {Object.keys(vendorArray).length ? 
            <Select
                onChange={(e) => handleMultiChange(e, 'vendors')}
                options={vendorArray}
                isMulti
                closeMenuOnSelect={false}
            /> : ''}
            </FormGroup>
        : '' }
        <dl className="row">
            {account === false && buyerEdit ?
            <Fragment>
                <dt className="col-sm-3">User Name</dt>
                <dd className="col-sm-9">
                    <Input type="text" name="username" onChange={(e) => handleBuyerEdit(e)} />
                </dd>
                <dt className="col-sm-3">Password</dt>
                <dd className="col-sm-9">
                    <Input type="text" name="password" onChange={(e) => handleBuyerEdit(e)} />
                </dd>
            </Fragment>
            : ''}
            <dt className="col-sm-3">Company Name</dt>
            <dd className="col-sm-9">
                {buyerEdit ? <Input type="text" name="company_name" value={items.company_name} onChange={(e) => handleBuyerEdit(e)} />
                : items.company_name}
            </dd>
            <dt className="col-sm-3">First Name</dt>
            <dd className="col-sm-9">
                {buyerEdit ? <Input type="text" name="first_name" value={items.first_name} onChange={(e) => handleBuyerEdit(e)} />
                : items.first_name}
            </dd>
            <dt className="col-sm-3">Last Name</dt>
            <dd className="col-sm-9">
                {buyerEdit ? <Input type="text" name="last_name" value={items.last_name} onChange={(e) => handleBuyerEdit(e)} />
                : items.last_name}
            </dd>
            <dt className="col-sm-3">Email</dt>
            <dd className="col-sm-9">
                {buyerEdit ? <Input type="text" name="contact_email" value={items.contact_email} onChange={(e) => handleBuyerEdit(e)} />
                : items.contact_email}
            </dd>
            <dt className="col-sm-3">Address</dt>
            <dd className="col-sm-9">
                {buyerEdit ? <Input type="text" name="address" value={items.address} onChange={(e) => handleBuyerEdit(e)} />
                : items.address}
            </dd>
            <dt className="col-sm-3">City</dt>
            <dd className="col-sm-9">
                {buyerEdit ? <Input type="text" name="city" value={items.city} onChange={(e) => handleBuyerEdit(e)} />
                : items.city}
            </dd>
            <dt className="col-sm-3">State</dt>
            <dd className="col-sm-9">
                {buyerEdit ? <Input type="text" name="state" value={items.state} onChange={(e) => handleBuyerEdit(e)} />
                : items.state}
            </dd>
            <dt className="col-sm-3">Zipccode</dt>
            <dd className="col-sm-9">
                {buyerEdit ? <Input type="text" name="state" value={items.zipcode} onChange={(e) => handleBuyerEdit(e)} />
                : items.zipcode}
            </dd>
            <dt className="col-sm-3">Country</dt>
            <dd className="col-sm-9">
                {buyerEdit ? <Input type="text" name="country" value={items.country} onChange={(e) => handleBuyerEdit(e)} />
                : items.country}
            </dd>
            <dt className="col-sm-3">Work Phone</dt>
            <dd className="col-sm-9">
                {buyerEdit ? <Input type="text" name="work_phone" value={items.work_phone} onChange={(e) => handleBuyerEdit(e)} />
                : items.work_phone}
            </dd>
            <dt className="col-sm-3">Cell Phone</dt>
            <dd className="col-sm-9">
                {buyerEdit ? <Input type="text" name="cell_phone" value={items.cell_phone} onChange={(e) => handleBuyerEdit(e)} />
                : items.cell_phone}
            </dd>
        </dl> 
        </Col>
        <Col>
            <p>Selected Vendors</p>
            {buyerVendors && buyerVendors.length ? Object.keys(buyerVendors).map((items,idx) => 
                <Row key={idx}>     
                    <Col>     
                        <FormGroup>
                            <Input
                                value={buyerVendors[items].company_name}
                                type="text"
                                className="form-control currentField"
                                disabled
                            /> 
                        </FormGroup> 
                    </Col>
                    <Col>
                        <Button color="danger" onClick={e => handleBuyerVendorDelete(buyerVendors[items].id)}>Delete</Button>
                    </Col>  
                </Row> 
            ): ''}
        </Col>
        </Row>
        <Button onClick={() => handleEdit('buyerEdit')}>Edit</Button>{' '}
        <Button color="success" onClick={(e) => handleEditSubmit(e)}>Save Changes</Button>
    </div>    
    )
}


//Buyer field mapping is done here
const DisplayBuyerMappedFields = props => {

    const initialFormState = { 
        custom_mapped_terms: [{ currentField: '', mappedField: '', vertical: ''}],
    }

    const [verticalSelected, setVerticalSelected] = useState(0)
    const [verticalSelectedName, setVerticalSelectedName] = useState('')
    const [fields, setFields] = useState([])
    const [universalFields, setUniversalFields] = useState([])
    const [currentVerticalFields, setCurrentVerticalFields] = useState([])
    const [currentCustomFields, setCurrentCustomFields] = useState([])
    const [currentFixedFields, setCurrentFixedFields] = useState([])
    const [fixedFields, setFixedFields] = useState([])
    const [verticalSettings, setVerticalSettings] = useState([])
    const [fixedSettings, setFixedSettings] = useState([])
    const [deliverySettings, setDeliverySettings ] = useState([])
    const [currentZipCodes, setCurrentZipCodes] = useState([])
    const [currentZipCodesState, setCurrentZipCodesState] = useState([])
    const [modal, setModal] = useState(false)
    const [data, setData] = useState(initialFormState)
    const [zipCodeSettings, setZipCodeSettings] = useState([])
    const [zipCodeDistances, setZipCodeDistances] = useState([])
    const [zipCodeStates, setZipCodeStates] = useState([])
    const [allZips, setAllZips] = useState(false)
    const [activeTab, setActiveTab] = useState('vertical');
    const [deliveryExample, setDeliveryExample] = useState([])
    const [testString, setTestString] = useState([])
    const [testPopup, setTestPopup] = useState(false)
    const [testResults, setTestResults] = useState()
    const [testFormat, setTestFormat] = useState()
    
    const toggleTab = tab => {
      if(activeTab !== tab) setActiveTab(tab);
    }

    const toggle = () => {
        setModal(!modal)
    }    

    const testToggleModal = () => {
        setTestPopup(!testPopup)
    }

    useEffect(() => {
        if(modal === true){
            getCurrentVerticalFields()
        }
    },[modal])

    useEffect(() => {
        if(testPopup === false){
            setTestResults()
            setTestFormat()
            setTestString([])
        }
    },[testPopup])

    useEffect(() => {
        if(activeTab === 'vertical'){
            getCurrentVerticalFields()
        } else if (activeTab === 'fixed'){
            getCurrentFixedFields()
        } else if (activeTab === 'custom'){
            getCurrentCustom()
        } else if (activeTab === 'zipcodes'){
            getZipCode()
            getZipCodeState()
            getBuyerVerticals()
        } else if (activeTab === 'delivery'){
            getDelivery()
        } else {
            getCurrentVerticalFields()
        }
    },[activeTab])

    useEffect(() => {
        if(testString && Object.keys(testString).map(items => items).length> 0){
            const formatSearch = async () => {
                const data ={
                    'delivery_language': testString["delivery_lanaguage"],
                    'post_values': testString["post_values"]
                }
                const format = await lead(data, 'format-post-values')
                setTestFormat(format)
            }
            formatSearch()

        }
    }, [testString])


    //get verticals after getting current verticals
    useEffect(() => {
        getVerticals()
    },[currentVerticalFields])

    useEffect(() => {
        getFixedFields()
    },[currentFixedFields])


    const getVerticals = async () => {
        //Get all vertical field definitions based on vertical id
        const get = await verticalFieldDefinition('', 'mapping', { 'vertical_id': verticalSelected})
        //We need to remove the currently customized verticals from the existing list
        //Create an array of currently customized vertical fields by name
        let customizedVerticalsArray = []
        if(currentVerticalFields && currentVerticalFields.length > 0){
            Object.keys(currentVerticalFields).map((items,idx) => 
            customizedVerticalsArray.push(currentVerticalFields[items].name)
            )
        }    
        const filteredFields = get.filter( items => customizedVerticalsArray.indexOf( items.name ) == -1 )
        setFields(filteredFields)
    }

    const getCurrentVerticalFields = async () => {
        const currentVerticalField = await buyerFieldDefinition({'custom': '0','buyer_id': props.buyerId, 'vertical': verticalSelected}, 'custom')
        setCurrentVerticalFields(currentVerticalField)
    } 

    const getFixedFields = async () => {
        //Get all fixed/universal field definitions
        const universalSearch = await universalFieldDefinition('', 'search', '')
        let customizedFixedArray = []
        if(currentFixedFields && currentFixedFields.length > 0) {
            Object.keys(currentFixedFields).map((items,idx) => 
            customizedFixedArray.push(currentFixedFields[items].name)
            )
        }    
        //Remove current customized fixed fields from existing list
        const filteredFixed = universalSearch.items.filter( items => customizedFixedArray.indexOf( items.name ) == -1 )
        setFixedFields(filteredFixed)
    }

    const getCurrentFixedFields = async () => {
        //Get current buyer's customized fixed/universal field definitions
        const currentFixedField = await buyerFieldDefinition({'custom': '2','buyer_id': props.buyerId, 'vertical': verticalSelected}, 'custom')
        setCurrentFixedFields(currentFixedField)
    }

    const getCurrentCustom = async () => {
        //Get buyer's customized field definitions
        const currentCustomField = await buyerFieldDefinition({'custom': '1','buyer_id': props.buyerId, 'vertical': verticalSelected}, 'custom')
        //Sets custom field values
        setCurrentCustomFields(currentCustomField)
    }

    const getZipCode = async () => {
        const currentZipCode = await buyerZipCode('', 'search',{'buyer_id' : props.buyerId, 'vertical_id': verticalSelected})
        setCurrentZipCodes(currentZipCode)    
    }

    const getZipCodeState = async () => {
        const currentZipCodeState = await buyerZipCode('', 'search-state',{'buyer_id' : props.buyerId, 'vertical_id': verticalSelected})
        setCurrentZipCodesState(currentZipCodeState)
    }

    const getBuyerVerticals = async () => {
        const currentBuyerVerticals = await buyerVertical('', 'search', {'filter[buyer_id]' : props.buyerId, 'filter[vertical_id]': verticalSelected})
        if(currentBuyerVerticals && currentBuyerVerticals.items && currentBuyerVerticals.items[0].all_zips && currentBuyerVerticals.items[0].all_zips === "1"){
            setAllZips(true)
        }
    }

    const getDelivery = async () => {
        const currentDelivery = await buyerDeliverys({'buyer_id': props.buyerId, 'vertical': verticalSelected}, 'vertical')
        setDeliverySettings(currentDelivery)
    }




    const handleChange = value => {
        setVerticalSelected(value)
        setModal(true)
    }

    /*
    This section handles the update and management of customized vertical fields
    */

    const handleDataMapInput = (e,idx) => {
        setVerticalSettings({...verticalSettings,  [verticalSelected]: {
            ...verticalSettings[verticalSelected],
            [e.target.name]: e.target.value,
            vertical_id: verticalSelected,
            buyer_id: props.buyerId
        }})
    }

    const handleDataMapInputCustom = (e, idx, type) => {
        if(verticalSettings[verticalSelected][e.target.name.replace("custom_formating_", '')] !== ''){
            setVerticalSettings({...verticalSettings,  [verticalSelected]: {
                ...verticalSettings[verticalSelected],
                [e.target.name]: e.target.value,
                vertical_id: verticalSelected
           }})  
        } else {
            setVerticalSettings({...verticalSettings,  [verticalSelected]: {
                ...verticalSettings[verticalSelected],
                [e.target.name]: e.target.value,
                [e.target.name.replace("custom_formating_", '')] : e.target.name.replace("custom_formating_", ''),
                vertical_id: verticalSelected
        }}) 
        }
    }



    const handleCurrentVerticalUpdate = (e, key) => {
        let additionalQueryTerms = [...currentVerticalFields]
        if(!e.target.name.includes("custom_formating_")){
            additionalQueryTerms[key][e.target.name] = e.target.value
            setCurrentVerticalFields(additionalQueryTerms)
        }
    }

    const handleVerticalSave = async key => {
        const update = await buyerFieldDefinition(currentVerticalFields[key], 'update')
        if(update){
            Alerts.success('Field updated successfully')
        }
    }

    const handleAddNewVerticals = async e => {
        const add = await buyerFieldDefinition({'settings' : verticalSettings}, 'add') 
        if(add){
            Alerts.success('New fields added')
            setVerticalSettings([])
            getVerticals()
            getCurrentVerticalFields()
        }
    }

    const handleVerticalDelete = async id => {
        const deleteField = await buyerFieldDefinition({id: id}, 'delete')
        if(deleteField){
            Alerts.success('Field successfully deleted')
            getVerticals()
            getCurrentVerticalFields()
        }
    }

    /*
        END customized vertical updates
    */

    /*
    This section handles the update and management of fixed fields
    */

   const handleFixed = (e, idx) => {
        setFixedSettings({...fixedSettings,  [verticalSelected]: {
            ...fixedSettings[verticalSelected],
            [e.target.name]: e.target.name,
            vertical: verticalSelected,
            buyer_id: props.buyerId
        }})
    }


    const handleFixedMapInput = (e,idx) => {
        setFixedSettings({...fixedSettings,  [verticalSelected]: {
            ...fixedSettings[verticalSelected],
            [e.target.name]: e.target.value,
            vertical: verticalSelected,
            buyer_id: props.buyerId
    }})
    }

    const handleCurrentFixedUpdate = (e, key) => {
        let additionalQueryTerms = [...currentFixedFields]
        additionalQueryTerms[key][e.target.name] = e.target.value
        setCurrentFixedFields(additionalQueryTerms)
    }

    const handleFixedSave = async key => {
        const update = await buyerFieldDefinition(currentFixedFields[key], 'update')
        if(update){
            Alerts.success('Field updated successfully')
        }
    }

    const handleAddNewFixed = async e => {
        const add = await buyerFieldDefinition({'fixed' : fixedSettings}, 'add') 
        if(add){
            Alerts.success('New fixed fields added')
            setFixedSettings([])
            setUniversalFields([])
            getFixedFields()
            getCurrentFixedFields()
        }
    }

    const handleFixedDelete = async id => {
        const deleteField = await buyerFieldDefinition({id: id}, 'delete')
        if(deleteField){
            Alerts.success('Fixed field successfully deleted')
            getFixedFields()
            getCurrentFixedFields()
        }
    }
    /*
        END customized fixed fields
    */

    /*
        Begin management of customized terms
    */

   const handleAddAdditionalCustomChangeInput = e => {
        const classValue = e.target.className.replace(/form-control/g, '').trim()
        const arrayKey = e.target.id.replace(`${classValue}-`, '').trim()
        let additionalQueryTerms = [...data.custom_mapped_terms]
        additionalQueryTerms[arrayKey][classValue] = e.target.value
        if(classValue === 'currentField'){
            additionalQueryTerms[arrayKey]['vertical'] = e.target.name
        }    
        additionalQueryTerms[arrayKey]["buyer_id"] = props.buyerId
        setData({ ...data, additionalQueryTerms }) 
    }

    const addAdditionalCustom = e => {
        setData({ ...data, custom_mapped_terms: [...data.custom_mapped_terms, {currentField: '', mappedField: ''}]})
    }

    const handleCurrentCustomUpdate = (e, key) => {
        let additionalQueryTerms = [...currentCustomFields]
        additionalQueryTerms[key][e.target.name] = e.target.value
        setCurrentCustomFields(additionalQueryTerms)
    }

    const handleAddNewCustom = async e => {
        const add = await buyerFieldDefinition(data, 'add') 
        if(add){
            Alerts.success('New fields added')
            getCurrentCustom()
            setData(initialFormState)
        }
    }

    const handleCustomSave = async key => {
        const update = await buyerFieldDefinition(currentCustomFields[key], 'update')
        if(update){
            Alerts.success('Field updated successfully')
        }
    }

    const handleCustomDelete = async id => {
        const deleteField = await buyerFieldDefinition({id: id}, 'delete')
        if(deleteField){
            Alerts.success('Field successfully deleted')
            getCurrentCustom()
        }
    }
    /*
        End management of customized terms
    */

    /*
        Begin management of delivery
    */

   const handleDeliveryInput = (e ) => {
        let additionalQueryTerms = [...deliverySettings]
        additionalQueryTerms[0][e.target.name] = e.target.value
        setDeliverySettings(additionalQueryTerms)
    }

    const handleDeliveryInputs = (e, idx) => {
        setDeliverySettings({...deliverySettings,  [verticalSelected]: {
            ...deliverySettings[verticalSelected],
            [e.target.name]:e.target.value,
            vertical_id: verticalSelected,
            buyer_id: props.buyerId
       }})
    }

    const handleAddNewDelivery = async e => {
        const update = await buyerDeliverys(deliverySettings[0], 'update')
        if(update){
            Alerts.success('Fields updated successfully')
        }
    }

    const handleAddDeliveryManual = async e => {
        const add = await buyerDeliverys({delivery_settings: deliverySettings}, 'delivery-manual')
        if(add && add.code === 201){
            Alerts.success('Fields added successfully')
        } else {
            Alerts.error(add)
        }
    }
    
    /*
        End management of delivery
    */

   const handleZipCodeInput = (e) => {
        setZipCodeSettings({...zipCodeSettings,  [verticalSelected]: {
            ...zipCodeSettings[verticalSelected],
            [e.target.name]:e.target.value,
            vertical: verticalSelectedName,
            vertical_id: verticalSelected,
            buyer_id: props.buyerId
    }})
    }

    const handleAddZipCodeDistance = e => {
        setZipCodeDistances({...zipCodeDistances, [verticalSelected]: {
            ...zipCodeDistances[verticalSelected],
            distance:e,
            vertical: verticalSelectedName,
            vertical_id: verticalSelected,
            buyer_id: props.buyerId
        }})
    }


    const handleAddZipCodeState = value => {
        setZipCodeStates({...zipCodeStates, [verticalSelected]: {
            ...zipCodeStates[verticalSelected],
            state: value,
            vertical: verticalSelectedName,
            vertical_id: verticalSelected,
            buyer_id: props.buyerId 
        }})
    }
    

    const handleZipCodeDelete = async id => {
        const deleteField = await buyerZipCode({id: id}, 'delete')
        if(deleteField){
            Alerts.success('Field successfully deleted')
            getZipCode()
        } 
    }

    const handleZipCodeStateDelete = async id => {
        const deleteField = await buyerZipCode({id: id}, 'delete-state')
        if(deleteField){
            Alerts.success('Field successfully deleted')
            getZipCodeState()
        } 
    }

    const handleAddNewZipCodes = async e => {
        e.preventDefault()
        const add = await buyers({zipcodes: zipCodeSettings, zipCodeState: zipCodeStates, zipCodeDistance: zipCodeDistances}, 'display_zipcodes')
        if(add){
            Alerts.success('Zipcode successfully added')
            getZipCode()
            getZipCodeState()
        }
    }

    const toggleZip = e => {
        setAllZips(!allZips) 
    }

    const handleAddAllZipCodes = async e => {
        e.preventDefault()
        const add = await buyerZipCode({buyer_id: props.buyerId, vertical_id: verticalSelected}, 'update-all')
        if(add && add.code === 201){
            Alerts.success('Now using all zipcodes')
        } else {
            Alerts.error(add)
        }
    }

    const getPostString = async v => {
        const search = await lead('','delivery-example',{
            "buyer": props.buyerId, 
            "vertical": v
        })
        setDeliveryExample(search)
    }

    const getTestSearchString = async v => {
        const search = await lead('','delivery-example',{
            "buyer": props.buyerId, 
            "vertical": v
        })

        setTestString(search) 
        testToggleModal()
    }

    const updateTestData = e => {
        setTestString({...testString, "post_values": {
            ...testString["post_values"],
            [e.target.name]: e.target.value
        }})
    }

    const testSearch = async () => {
        const search = await lead(testString, 'delivery-test-search')
        if(search && search.code === 200){
            setTestResults(search.results)
        } else {
            setTestResults('Error')
        }
    }

    const updateTestSearch = async () => {
        const data ={
            'delivery_language': testString["delivery_lanaguage"],
            'post_values': testString["post_values"]
        }
        const format = await lead(data, 'format-post-values')
        setTestFormat(format)
    }

    return(
        <div>
                <div>
                    <p>Add new vertical settings</p>
                    <NewSettingsForm 
                        handleNewVertical={props.handleNewVertical}
                        buyerId={props.buyerId}
                    />
                </div>
                <TestModal
                    testPopup={testPopup}
                    testToggleModal={testToggleModal}
                    testString={testString}
                    updateTestData={updateTestData}
                    testSearch={testSearch}
                    testResults={testResults}
                    testFormat={testFormat}
                    updateTestSearch={updateTestSearch}
                />
                {deliveryExample && deliveryExample.url ?    
                <div className="jumbotron">
                    <button type="button" onClick={e => setDeliveryExample([])} className="close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <pre>
                        {deliveryExample}
                    </pre>    
                    {/* <dl>
                        <dt>Url</dt>
                        <dd>{deliveryExample && deliveryExample.url ? deliveryExample.url : ''}</dd>
                        <dt>Type</dt>
                        <dd>{deliveryExample && deliveryExample.delivery_type ? deliveryExample.delivery_type : ''}</dd>
                        <dt>Language</dt>
                        <dd>{deliveryExample && deliveryExample.language ? deliveryExample.language : ''}</dd>
                        <dt>Success</dt>
                        <dd>{deliveryExample && deliveryExample.delivery_success ? deliveryExample.delivery_success : ''}</dd>
                        <dt>Fail</dt>
                        <dd>{deliveryExample && deliveryExample.failure ? deliveryExample.failure : ''}</dd>
                        {deliveryExample && deliveryExample.post_values ?
                        <Fragment>
                        <dt>Post Values</dt>
                        <dd>
                            {JSON.stringify(deliveryExample.post_values, null, 2)}
                        </dd>
                        </Fragment>
                        : ''}
                    </dl> */}
                </div>  
                : ''}  
                <Table>
                    <thead>
                        <tr>
                            <th>Vertical</th>
                            <th>Action</th>
                            <th>Test String</th>
                        </tr>    
                    </thead>
                    <tbody>
                    {Object.keys(props.buyerFields).map((items,idx) => 
                        <tr key={idx}>
                            <td>{props.buyerFields[items].Label}</td>
                            <td>
                                <Button color="primary" onClick={() => handleChange(props.buyerFields[items].vertical_id)}>Edit</Button>{' '}
                            </td>
                            <td>
                                <Button onClick={e => getTestSearchString(props.buyerFields[items].vertical_id)}>Test String</Button>
                            </td>      
                        </tr>      
                    )}
                    </tbody>
                </Table>    
            <FieldModal 
                toggle={toggle}
                modal={modal}
                fields={fields}
                universalFields={universalFields}
                currentCustomFields={currentCustomFields}
                currentFixedFields={currentFixedFields}
                fixedFields={fixedFields}
                currentVerticalFields={currentVerticalFields}
                handleDataMapInput={handleDataMapInput}
                data={props.data}
                handleAddAdditionalCustomChangeInput={handleAddAdditionalCustomChangeInput}
                addAdditionalCustom={props.addAdditionalCustom}
                verticalSelected={verticalSelected}
                handleDeliveryInput={handleDeliveryInput}
                handleVerticalSave={handleVerticalSave}
                handleCurrentVerticalUpdate={handleCurrentVerticalUpdate}
                handleAddNewVerticals={handleAddNewVerticals}
                handleVerticalDelete={handleVerticalDelete}
                data={data}
                addAdditionalCustom={addAdditionalCustom}
                handleCustomSave={handleCustomSave}
                handleCurrentCustomUpdate={handleCurrentCustomUpdate}
                handleCustomDelete={handleCustomDelete}
                handleAddNewCustom={handleAddNewCustom}
                deliverySettings={deliverySettings}
                handleAddNewDelivery={handleAddNewDelivery}
                handleFixedMapInput={handleFixedMapInput}
                handleFixed={handleFixed}
                handleCurrentFixedUpdate={handleCurrentFixedUpdate}
                handleFixedSave={handleFixedSave}
                handleAddNewFixed={handleAddNewFixed}
                handleFixedDelete={handleFixedDelete}
                currentZipCodes={currentZipCodes}
                handleZipCodeInput={handleZipCodeInput}
                handleZipCodeDelete={handleZipCodeDelete}
                handleAddNewZipCodes={handleAddNewZipCodes}
                handleDeliveryInputs={handleDeliveryInputs}
                toggleTab={toggleTab}
                activeTab={activeTab}
                allZips={allZips}
                toggleZip={toggleZip}
                handleAddAllZipCodes={handleAddAllZipCodes}
                currentZipCodesState={currentZipCodesState}
                handleZipCodeStateDelete={handleZipCodeStateDelete}
                handleAddZipCodeState={handleAddZipCodeState}
                handleAddZipCodeDistance={handleAddZipCodeDistance}
                handleAddDeliveryManual={handleAddDeliveryManual}
                handleDataMapInputCustom={handleDataMapInputCustom}
            />
        </div>    
    )    
}

const TestModal = props => {
    const values = props.testString && props.testString.post_values ? props.testString.post_values : []
    let format = props.testFormat ? props.testFormat : ''
    let displayFormat
    let displayData
    if(props.testString["delivery_lanaguage"] === 'xml'){
        displayFormat = <XMLViewer xml={format} />
    } else {
        if(format && format !== ''){
            const json = JSON.parse(format)
            displayFormat = JSON.stringify(json, null, 2) 
        }
    }


    if(props.testString["response_language"] === 'xml'){
        displayData = <XMLViewer xml={props.testResults} />
    } else if(props.testString["response_language"] === 'json') {
        if(props.testString !== ''){
            displayData= JSON.stringify(props.testResults, null, 2) 
        }
    } else {
        displayData = props.testResults
    }


    return(
    <Modal isOpen={props.testPopup} toggle={props.testToggleModal} size="xl">
        <ModalBody>
            <Row>
                <Col md="4">
                    <h3>Test Fields</h3>
                    <div style={{padding: "5px"}}>
                        <Button color="primary" onClick={e => props.testSearch()}>Test Search</Button>{' '}
                        <Button color="warning" onClick={e => props.updateTestSearch()}>Update Search Parameters</Button>{' '}
                    </div>
                    {values && Object.keys(values).map(items => items).length > 0 ? Object.keys(values).map((items,idx) => 
                        <Fragment>
                            <Col>
                        <FormGroup>
                            <Input type="text" name={items} value={items} id="exampleEmail" disabled />
                        </FormGroup>
                        </Col>
                        <Col>
                        <FormGroup>
                            <Input  name={items} value={values[items]} onChange={e => props.updateTestData(e)}  />
                        </FormGroup>
                        </Col>
                        </Fragment>
                    ) : ''}
                </Col>
                <Col md="6">
                    <div>
                        <h3>Parameters</h3>  
                        <pre>
                            {displayFormat}
                        </pre>  
                        <h3>Results</h3>  
                        <pre>
                            {displayData}
                        </pre>  
                     </div> 
                </Col>
            </Row>    
        </ModalBody>    
    </Modal>   
    )
}

const FieldModal = props => {


    return(
        <div>
        <Modal isOpen={props.modal} toggle={props.toggle} size="xl">
          <ModalHeader toggle={props.toggle}>Customize {props.verticalSelectedName}</ModalHeader>
          <ModalBody>
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={classnames({ active: props.activeTab === 'vertical' })}
                        onClick={() => { props.toggleTab('vertical'); }}
                    >
                        Vertical fields
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: props.activeTab === 'fixed' })}
                        onClick={() => { props.toggleTab('fixed'); }}
                    >
                        Fixed fields
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: props.activeTab === 'custom' })}
                        onClick={() => { props.toggleTab('custom'); }}
                    >
                        Custom fields
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: props.activeTab === 'delivery' })}
                        onClick={() => { props.toggleTab('delivery'); }}
                    >
                        Delivery
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: props.activeTab === 'zipcodes' })}
                        onClick={() => { props.toggleTab('zipcodes'); }}
                    >
                        ZipCodes
                    </NavLink>
                </NavItem>
                </Nav>  
                <TabContent activeTab={props.activeTab}>
                    <TabPane tabId="vertical">
                        <div style={{padding: "20px"}}>
                        {props.activeTab === "vertical" ?
                        <EditVerticalFields 
                            fields={props.fields}
                            currentVerticalFields={props.currentVerticalFields}
                            handleDataMapInput={props.handleDataMapInput}
                            handleVerticalSave={props.handleVerticalSave}
                            handleCurrentVerticalUpdate={props.handleCurrentVerticalUpdate}
                            handleAddNewVerticals={props.handleAddNewVerticals}
                            handleVerticalDelete={props.handleVerticalDelete}
                            handleDataMapInputCustom={props.handleDataMapInputCustom}
                        />
                        : ''}
                        </div>
                    </TabPane>
                    <TabPane tabId="fixed">
                        <div style={{padding: "20px"}}>
                        {props.activeTab === "fixed" ?
                        <EditFixedFields
                            currentFixedFields={props.currentFixedFields}
                            fixedFields={props.fixedFields}
                            handleFixedMapInput={props.handleFixedMapInput}
                            handleFixed={props.handleFixed}
                            handleCurrentFixedUpdate={props.handleCurrentFixedUpdate}
                            handleFixedSave={props.handleFixedSave}
                            handleAddNewFixed={props.handleAddNewFixed}
                            handleFixedDelete={props.handleFixedDelete}
                        />
                        : ''}
                        </div>
                    </TabPane>
                    <TabPane tabId="custom">
                        <div style={{padding: "20px"}}>
                        {props.activeTab === "custom" ?
                        <CustomAdditionalTerms
                            handleDataMapInput={props.handleDataMapInput}
                            currentCustomFields={props.currentCustomFields}
                            addAdditionalCustom={props.addAdditionalCustom}
                            handleAddAdditionalCustomChangeInput={props.handleAddAdditionalCustomChangeInput}
                            verticalSelected={props.verticalSelected}
                            data={props.data}
                            handleCustomSave={props.handleCustomSave}
                            handleCurrentCustomUpdate={props.handleCurrentCustomUpdate}
                            handleCustomDelete={props.handleCustomDelete}
                            handleAddNewCustom={props.handleAddNewCustom}
                        /> 
                        : ''}
                        </div>
                    </TabPane>
                    <TabPane tabId="delivery">
                    <div style={{padding: "20px"}}>
                    {props.activeTab === "delivery" ?
                        <EditDelivery
                            handleDeliveryInput={props.handleDeliveryInput}
                            deliverySettings={props.deliverySettings}
                            handleAddNewDelivery={props.handleAddNewDelivery}
                            handleDeliveryInputs={props.handleDeliveryInputs}
                            handleAddDeliveryManual={props.handleAddDeliveryManual}
                        />
                        : ''}
                    </div>
                    </TabPane>
                    <TabPane tabId="zipcodes">
                    <div style={{padding: "20px"}}>
                    {props.activeTab === "zipcodes" ?
                        <EditZipCodes
                            currentZipCodes={props.currentZipCodes}
                            handleZipCodeInput={props.handleZipCodeInput}
                            handleZipCodeDelete={props.handleZipCodeDelete}
                            handleAddNewZipCodes={props.handleAddNewZipCodes}
                            allZips={props.allZips}
                            toggleZip={props.toggleZip}
                            handleAddAllZipCodes={props.handleAddAllZipCodes}
                            currentZipCodesState={props.currentZipCodesState}
                            handleZipCodeStateDelete={props.handleZipCodeStateDelete}
                            handleAddZipCodeState={props.handleAddZipCodeState}
                            handleAddZipCodeDistance={props.handleAddZipCodeDistance}
                        />
                        : ''}
                    </div>
                    </TabPane>
                </TabContent>    
          </ModalBody>
        </Modal>
      </div>
    )
}

const CustomAdditionalTerms = props => {
    
    return(
        <div>
            <p>Current Customized Fields</p>
            {Object.keys(props.currentCustomFields).map((items,idx) => 
                <Row key={idx}>     
                    <Col>     
                        <FormGroup>
                            <Input
                                value={props.currentCustomFields[items].name}
                                type="text"
                                name="name"
                                className="form-control currentField"
                                onChange={(e) => props.handleCurrentCustomUpdate(e, idx)}
                            /> 
                        </FormGroup> 
                    </Col>
                    <Col>    
                        <FormGroup>
                            <Input
                                value={props.currentCustomFields[items].output}
                                type="text"
                                name='output'
                                className="form-control mappedField"
                                onChange={(e) => props.handleCurrentCustomUpdate(e, idx)}
                            /> 
                        </FormGroup> 
                    </Col> 

                    <Col>
                        <Button color="primary" onClick={e => props.handleCustomSave(idx)}>Save Changes</Button>{' '}
                        <Button color="danger" onClick={e => props.handleCustomDelete(props.currentCustomFields[items].id)}>Delete</Button>
                    </Col>  
                </Row> 
            )}
            <p>Add additional Customized Fields</p>
            {props.data && props.data.custom_mapped_terms && props.data.custom_mapped_terms.length > 0 && props.data.custom_mapped_terms.map((val, idx) => {
            let currentFieldId = `currentField-${idx}`, mappedFieldId = `mappedField-${idx}`
            return(
                <div className="form-row" key={idx}>
                    <Col>
                    <FormGroup>
                            <Input
                                type="text"
                                name={props.verticalSelected}
                                dataid={idx}
                                id={currentFieldId}
                                value={props.data.custom_mapped_terms[idx].currentField}
                                className="form-control currentField"
                                onChange={(e) => props.handleAddAdditionalCustomChangeInput(e)}
                            /> 
                    </FormGroup> 
                    </Col>    
                    <Col>
                        <FormGroup>
                            <Input
                                type="text"
                                dataid={idx}
                                name={mappedFieldId}
                                id={mappedFieldId}
                                value={props.data.custom_mapped_terms[idx].mappedField}
                                className="form-control mappedField"
                                onChange={(e) => props.handleAddAdditionalCustomChangeInput(e)}
                            /> 
                        </FormGroup> 
                    </Col> 
                    <Col>
                        <Button color="primary" onClick={(e) => props.addAdditionalCustom(e)}>+</Button>
                    </Col> 
                </div>   
            )

        })}
                    <Button color="primary" onClick={e => props.handleAddNewCustom(e)}>Save Custom Updates</Button>{' '}
        </div>
    )
}


const EditDelivery = props => {
    return(
     props.deliverySettings.length > 0 ? props.deliverySettings.map((items, idx) => 
    <Form key={idx}>    
    <FormGroup>
        <Label for="post_url">Post URL</Label>
        <Input type="text"  name="post" value={items.post} placeholder="Post Url" onChange={props.handleDeliveryInput} />
    </FormGroup>
    <FormGroup>
        <Label for="post_success">Post Success</Label>
        <Input type="text"  name="post_success" value={items.post_success} placeholder="Post Response Success" onChange={props.handleDeliveryInput} />
    </FormGroup>
    <FormGroup>
        <Label for="post_failure">Post Failure</Label>
        <Input type="text"  name="post_failure" value={items.post_failure} placeholder="Post Response Failure" onChange={props.handleDeliveryInput} />
    </FormGroup>
    <FormGroup>
        <Label for="delivery">Delivery Type</Label>
        <Input type="select"  name="delivery_type" value={items.delivery_type}  onChange={props.handleDeliveryInput} >
        <option value="">Select Delivery Type...</option>
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        </Input>
    </FormGroup>
    <FormGroup>
        <Label for="delivery">Delivery Language</Label>
        <Input type="select"  name="delivery_language" value={items.delivery_language}  onChange={props.handleDeliveryInput} >
        <option value="">Select Delivery Language...</option>
        <option value="xml">XML</option>
        <option value="json">JSON</option>
        <option value="text">Text</option>
        </Input>
    </FormGroup>
    <FormGroup>
        <Label for="response">Response Language</Label>
        <Input type="select"  name="response_language" value={items.response_language}  onChange={props.handleDeliveryInput} >
        <option value="">Select Response Language...</option>
        <option value="xml">XML</option>
        <option value="json">JSON</option>
        <option value="text">Text</option>
        </Input>
    </FormGroup>
    <Button color="primary" onClick={e => props.handleAddNewDelivery(e)}>Save Delivery Updates</Button>{' '}
    </Form>
    ) : 
    <Form>    
    <p>All values are required.</p>
    <FormGroup>
        <Label for="post_url">Post URL</Label>
        <Input type="text"  name="post_url" placeholder="Post Url" onChange={props.handleDeliveryInputs} />
    </FormGroup>
    <FormGroup>
        <Label for="post_success">Post Success</Label>
        <Input type="text"  name="post_success" placeholder="Post Response Success" onChange={props.handleDeliveryInputs} />
    </FormGroup>
    <FormGroup>
        <Label for="post_failure">Post Failure</Label>
        <Input type="text"  name="post_failure" placeholder="Post Response Failure" onChange={props.handleDeliveryInputs} />
    </FormGroup>
    <FormGroup>
        <Label for="delivery">Delivery Type</Label>
        <Input type="select"  name="delivery_type"  onChange={props.handleDeliveryInputs} >
        <option value="" selected="selected">Select Delivery Type...</option>
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        </Input>
    </FormGroup>
    <FormGroup>
        <Label for="delivery">Delivery Response</Label>
        <Input type="select"  name="delivery_language"  onChange={props.handleDeliveryInputs} >
        <option value="" selected="selected">Select Delivery Language...</option>
        <option value="xml">XML</option>
        <option value="json">JSON</option>
        <option value="text">Text</option>
        </Input>
    </FormGroup>
    <FormGroup>
        <Label for="response">Response Language</Label>
        <Input type="select"  name="response_language" onChange={props.handleDeliveryInputs} >
        <option value="">Select Response Language...</option>
        <option value="xml">XML</option>
        <option value="json">JSON</option>
        <option value="text">Text</option>
        </Input>
    </FormGroup>
    <Button color="primary" onClick={e => props.handleAddDeliveryManual(e)}>Save Delivery</Button>{' '}

    </Form>
    )
}


//Manage the modal for customized verticals
const EditVerticalFields = props => {

    const [customFields, setCustomFields] = useState([])

    useEffect(() => {
        const getFields = async () => {
            const search = await buyers('', 'buyer-custom-format')
            setCustomFields(search)
        }
        getFields()
    },[])

    return(
    <div>
        <p>Current fields</p>
            {Object.keys(props.currentVerticalFields).map((items,idx) => 
                <Row key={idx}>     
                    <Col>     
                        <FormGroup>
                            <Input
                                value={props.currentVerticalFields[items].name}
                                type="text"
                                className="form-control currentField"
                                disabled
                            /> 
                        </FormGroup> 
                    </Col>
                    <Col>    
                        <FormGroup>
                            <Input
                                value={props.currentVerticalFields[items].output}
                                type="text"
                                name='output'
                                className="form-control mappedField"
                                onChange={(e) => props.handleCurrentVerticalUpdate(e, idx)}
                            /> 
                        </FormGroup> 
                    </Col> 
                    <Col>
                    <FormGroup>
                            <Input
                                type="select"
                                name={`custom_formating`}
                                value={props.currentVerticalFields[items].custom_formating}
                                className="custom_formating"
                                onChange={(e) => props.handleCurrentVerticalUpdate(e, idx)}
                            >
                            <option value="">Select a custom format..</option>
                            {Object.keys(customFields).map(items =>
                                <option value={customFields[items].id}>{customFields[items].name}</option>
                            )}
                            </Input> 
                        </FormGroup>   
                    </Col>    
                    <Col>
                        <Button color="primary" onClick={e => props.handleVerticalSave(idx)}>Save Changes</Button>{' '}
                        <Button color="danger" onClick={e => props.handleVerticalDelete(props.currentVerticalFields[items].id)}>Delete</Button>
                    </Col>  
                </Row> 
            )}
            <p>Additional fields</p>
            {Object.keys(props.fields).map((items,idx) => 
                <Row key={idx}>     
                    <Col>     
                        <FormGroup>
                            <Input
                                value={props.fields[items].name}
                                type="text"
                                className="form-control currentField"
                                disabled
                            /> 
                        </FormGroup> 
                    </Col>
                    <Col>    
                        <FormGroup>
                            <Input
                                type="text"
                                name={props.fields[items].name}
                                className="form-control mappedField"
                                onChange={(e) => props.handleDataMapInput(e, idx)}
                           /> 
                        </FormGroup> 
                    </Col> 
                    <Col>
                    <FormGroup>
                            <Input
                                type="select"
                                name={`custom_formating_${props.fields[items].name}`}
                                className="custom_formating"
                                onChange={(e) => props.handleDataMapInputCustom(e, idx)}
                            >
                            <option value="">Select a custom format..</option>
                            {Object.keys(customFields).map(items =>
                                <option value={customFields[items].id}>{customFields[items].name}</option>
                            )}
                            </Input> 
                        </FormGroup>   
                    </Col>      
                </Row>     
            )}
            <Button color="primary" onClick={e => props.handleAddNewVerticals(e)}>Save Vertical Updates</Button>{' '}
    </div> 
    )
}


const EditFixedFields = props => {

    return(
    <div>
        <p>Current fixed fields</p>
            {Object.keys(props.currentFixedFields).map((items,idx) => 
                <Row key={idx}>     
                    <Col>     
                        <FormGroup>
                            <Input
                                value={props.currentFixedFields[items].name}
                                type="text"
                                className="form-control currentField"
                                disabled
                            /> 
                        </FormGroup> 
                    </Col>
                    <Col>    
                        <FormGroup>
                            <Input
                                value={props.currentFixedFields[items].output}
                                type="text"
                                name='output'
                                className="form-control mappedField"
                                onChange={(e) => props.handleCurrentFixedUpdate(e, idx)}
                            /> 
                        </FormGroup> 
                    </Col>  
                    <Col>
                        <Button color="primary" onClick={e => props.handleFixedSave(idx)}>Save Changes</Button>{' '}
                        <Button color="danger" onClick={e => props.handleFixedDelete(props.currentFixedFields[items].id)}>Delete</Button>
                    </Col>  
                </Row> 
            )}
            <p>Additional fixed fields</p>
            {Object.keys(props.fixedFields).map((items,idx) => 
                <Row key={idx}>     
                    <Col>    
                        <FormGroup check>
                            <Input type="checkbox" name={props.fixedFields[items].name} onChange={(e) => props.handleFixed(e, idx)} />
                            <Label check>Use this field</Label>
                        </FormGroup>
                    </Col>
                    <Col>    
                        <FormGroup check>
                            <Input type="checkbox" />
                            <Label check>Map this field</Label>
                        </FormGroup>
                    </Col>
                    <Col>     
                        <FormGroup>
                            <Input
                                value={props.fixedFields[items].name}
                                type="text"
                                className="form-control currentField"
                                disabled
                            /> 
                        </FormGroup> 
                    </Col>
                    <Col>    
                        <FormGroup>
                            <Input
                                type="text"
                                name={props.fixedFields[items].name}
                                className="form-control mappedField"
                                onChange={(e) => props.handleFixedMapInput(e, idx)}
                           /> 
                        </FormGroup> 
                    </Col>    
                </Row>     
            )}
            <Button color="primary" onClick={e => props.handleAddNewFixed(e)}>Save Vertical Updates</Button>{' '}
    </div> 
    )
}

const EditZipCodes = props => {    

    return(
        props.allZips === true ?
        <FormGroup check>
        <Label check>
        <Input
            type="checkbox" 
            name="" 
            checked="checked"
            onChange={(e) => props.toggleZip(e)} 
        />{' '}
        Use all zipcodes in the United States
        </Label><br />
            <Button onClick={(e) => {if(window.confirm('Are you sure you want to update to all zipcodes?  This will delete any current zipcodes saved in the system for this vertical and buyer.')) {props.handleAddAllZipCodes(e)}}}>Update to all zipcodes</Button>
        </FormGroup> 
        :
        <div>
        <FormGroup check>
        <Label check>
        <Input
            type="checkbox" 
            name="" 
            checked=""
            onChange={(e) => props.toggleZip(e)} 
        />{' '}
        Use all zipcodes in the United States
        </Label>
        </FormGroup> 
        <Row>
            <Col>
            <br />
            <EditBuyerZipCodesState 
                handleAddZipCodeState={props.handleAddZipCodeState}
            />
            <br />
            <EditBuyerZipCodesDistance 
                handleAddZipCodeDistance={props.handleAddZipCodeDistance}
                
            />
            <br />
            <Form>
                <FormGroup>
                    <Label>Add a list of zipcodes below</Label>
                        <Input 
                            type="textarea" 
                            name="zipcodes" 
                            rows="10"
                            onChange={(e) => props.handleZipCodeInput(e)} />
                </FormGroup>
                <Button onClick={e => props.handleAddNewZipCodes(e)}>Add new Zipcodes</Button>
            </Form>       
            </Col>
            <Col>    
            <Label>Existing States ({props.currentZipCodesState.length})</Label>
            <div style={{height: "300px", overflowY: "auto"}}>
            {Object.keys(props.currentZipCodesState).map((items,idx) => 
                <Row key={idx}>     
                    <Col>     
                        <FormGroup>
                            <Input
                                value={props.currentZipCodesState[items].state}
                                type="text"
                                className="form-control currentField"
                                disabled
                            /> 
                        </FormGroup> 
                    </Col>
                    <Col>
                        <Button color="danger" onClick={e => props.handleZipCodeStateDelete(props.currentZipCodesState[items].id)}>Delete</Button>
                    </Col>  
                </Row> 
            )}
            </div>
            <br />
            <Label>Existing zipcodes ({props.currentZipCodes.length})</Label>
            <div style={{height: "300px", overflowY: "auto"}}>
            {Object.keys(props.currentZipCodes).map((items,idx) => 
                <Row key={idx}>     
                    <Col>     
                        <FormGroup>
                            <Input
                                value={props.currentZipCodes[items].zipcode}
                                type="text"
                                className="form-control currentField"
                                disabled
                            /> 
                        </FormGroup> 
                    </Col>
                    <Col>
                        <Button color="danger" onClick={e => props.handleZipCodeDelete(props.currentZipCodes[items].id)}>Delete</Button>
                    </Col>  
                </Row> 
            )}
            </div>
            </Col>
        </Row>    
        </div>
    )
}

const EditBuyerZipCodesState = props => {


    const stateArray = Object.keys(state).map(items => ({
        value: items,
        label: state[items]
    }))


    const handleZipcodesByState = e => {
        props.handleAddZipCodeState(e)
    }

    return(
        <Form>
            <FormGroup>
                <Label>All zipcodes by state (Can select multiple)</Label>
                    {Object.keys(stateArray).length 
                    ? 
                        <Select
                            options={stateArray}
                            onChange={(e) => handleZipcodesByState(e)}
                            isMulti
                            closeMenuOnSelect={false}
                        /> 
                    : ''}
            </FormGroup>
        </Form>
    )     
}


const EditBuyerZipCodesDistance = props => {

    const [zipCode, setZipCode] = useState('')
    const [miles, setMiles] = useState('')
    const [distance, setDistance] = useState(0)


    const handleZipcodeDistanceSubmit = async e => {
        e.preventDefault()
        const results = await zipcode('', 'distance', {'zip': zipCode, 'miles': miles })
        props.handleAddZipCodeDistance(results)
        setDistance(results.length)
    }
    return(
    <Form onSubmit={(e) => handleZipcodeDistanceSubmit(e)}>
        <Label>All zipcodes by distance ({distance} count)</Label>
        <Row>
            <Col>
                <FormGroup>
                    <Input value={zipCode} onChange={e => setZipCode(e.target.value)}  type="text" name="zipCodeDistance" />
                </FormGroup>  
            </Col>
            <Col>
                <FormGroup>
                    <Input value={miles} onChange={e => setMiles(e.target.value)}  type="text" name="zipCodeDistanceMiles" />
                </FormGroup>  
            </Col>
            <Col>
                <Button color="success">Submit</Button>
            </Col>
        </Row>      
    </Form>    
    )
}

const DisplayBuyerVerticals = ({ data }) => {
    const set = data && data.length ? Object.keys(data).map(items =>  
        data[items] && data[items].vertical ? data[items].vertical : []
    ) : []
    return(
    <div>
        <ul>
        {set.length ? Object.keys(set).map((item,idx) => 
            <li key={idx}>{set[item].label}</li>
        ) : <p>No buyer verticals set</p>}
        </ul>
    </div>   
    )
}




const DisplayOrders = ({ data, ordersDisplay }) => (
    <FoldableTable
        data={data}
        columns={
        [{
            Header: "Priority",
            accessor: "priority",
            foldable: true
        },{
            Header: "PO Number",
            accessor: "po_number",
            foldable: true
        },{
            Header: "Payment",
            accessor: "payment",
            foldable: true
        },{
            Header: "Billing",
            accessor: "billing",
            foldable: true
        },{
            Header: "Lead Purchase Price",
            accessor: "lead_price",
            foldable: true
        },{
            Header: "Credits",
            accessor: "credits",
            foldable: true
        },{
            Header: "Created",
            accessor: "timestamp",
            foldable: true
        }]
    }
    showPagination={false}
    pageSize={data ? data.length : 20}
    filterable={true}
    getTrProps={(state, rowInfo) => ({
        onClick: () => ordersDisplay(rowInfo)
    })}
/>
)

const AdditionalQueryTerms = ({
    additionalQueryTerms,
    addAdditional, 
    handleAddAdditionalChangeSelect, 
    handleAddAdditionalChangeInput,
    fields
}) => {   
const fieldArray = fields ? Object.keys(fields).map(items => ({
    value: fields[items].name,
    label: fields[items].name
})) : {}

return(
  additionalQueryTerms.map((val, idx) => {
    let currentFieldId = `currentField-${idx}`, mappedFieldId = `mappedField-${idx}`
    return(
      <div className="form-row" key={idx}>
        <div className="col">
        <FormGroup>
                {Object.keys(fieldArray).length ? 
                <Select
                    onChange={(e) => handleAddAdditionalChangeSelect(e, "currentField", currentFieldId)}
                    options={fieldArray}
                    id={currentFieldId}
                    className="currentField"
                    dataid={idx}
                /> : ''}
            </FormGroup> 
        </div>    
        <div className="col">
        <FormGroup>
        <Input
          type="text"
          dataid={idx}
          name={mappedFieldId}
          id={mappedFieldId}
          value={additionalQueryTerms[idx].mappedField}
          className="form-control mappedField"
          onChange={(e) => handleAddAdditionalChangeInput(e)}
        /> 
        </FormGroup> 
       </div> 
       <div className="col">
          <button className="btn btn-primary" onClick={(e) => addAdditional(e)}>+</button>
        </div>  
      </div>
    )
  })
)
}

//This section handles updating and adding new zipcodes

const DisplayBuyerZipcodes = ({ data, zipcodeEdit, handleEdit, handleZipCodeUdpate, handleDeleteZipCodes }) => {
    const items = data && data[0] ? data[0] : []
    const { zipCodes } = items || []
    return(
        <div>
            <p>Current zipcodes{' '}
                <Button color="primary" onClick={() => handleEdit('zipcodeEdit')}>Edit</Button>{' '}
                {zipcodeEdit ?
                    <Button color="danger" onClick={() => handleDeleteZipCodes('zipcodeEdit')}>Delete All</Button>
                : ''}
            </p>
            {zipCodes ? Object.keys(zipCodes).map((items,idx) => 
            <Row key={idx} style={{marginBottom: "5px"}}>
                <Col>
                    {zipCodes[items].zipcode} 
                </Col>
                {zipcodeEdit ?
                <Col>    
                    <Button color="danger" onClick={(e) => handleZipCodeUdpate(e, idx)}>Delete</Button>
                </Col>
                : ''}
            </Row>      
        ) : ''}
        </div>
    )  
}

const NewBuyerZipCodes = props => {
    const initialFormState = {
        zipcodes: [],
        buyer_id: props.buyerId
    }
    const [data, setData] = useState(initialFormState)

    const handleInputChange = e => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }

    const handleZipCodeUpdates = e => {
        e.preventDefault()
        props.updateZipcodes(data)
    }

    return(
    <div>
    <Form>
        <FormGroup>
            <Label>Add a list of zipcodes below</Label>
                <Input 
                    type="textarea" 
                    name="zipcodes" 
                    rows="30"
                    onChange={(e) => handleInputChange(e)} />
        </FormGroup>
        <Button color="primary" onClick={e => handleZipCodeUpdates(e)}>Update Zipcodes</Button>
    </Form>   
    </div>  
    )  
}

// const NewBuyerZipCodesDistance = ({ handleZipcodeDistanceSubmit, handleZipCodeDistance, handleZipcodeDistanceLocate, zipCodeDistanceList }) => (
//     <Form>
//         <Label>All zipcodes by distance</Label>
//         <Row>
//             <Col>
//                 <FormGroup>
//                     <Input onChange={(e) => handleZipCodeDistance(e)} type="text" name="zipCodeDistance" />
//                 </FormGroup>  
//             </Col>
//             <Col>
//                 <FormGroup>
//                     <Input onChange={(e) => handleZipCodeDistance(e)} type="text" name="zipCodeDistanceMiles" />
//                 </FormGroup>  
//             </Col>
//             <Col>
//                 <Button color="primary" onClick={(e) => handleZipcodeDistanceLocate(e)}>Locate</Button>{' '}
//                 {zipCodeDistanceList.length > 0 
//                     ? <Button color="success" onClick={(e) => handleZipcodeDistanceSubmit(e)}>Submit ({zipCodeDistanceList.length} zipcodes)</Button>
//                     : ''
//                 }      
//             </Col>
//         </Row>      
//     </Form>    
// )


// const NewBuyerZipCodesState = ({handleZipcodesByState, handleAddStateZipcodesSubmit }) => {
//     const stateArray = Object.keys(state).map(items => ({
//         value: items,
//         label: state[items]
//     }))

//     return(
//         <Form>
//             <FormGroup>
//                 <Label>All zipcodes by state (Can select multiple)</Label>
//                     {Object.keys(stateArray).length 
//                     ? 
//                         <Select
//                             options={stateArray}
//                             onChange={(e) => handleZipcodesByState(e)}
//                             isMulti
//                             closeMenuOnSelect={false}
//                         /> 
//                     : ''}
//             </FormGroup>
//                 <Button onClick={(e) => handleAddStateZipcodesSubmit(e)} color="success">Add</Button>
//         </Form>
//     )     
// }

/*
Search: Adding new verticals
Adding new Verticals TODO: This is repetative as its the same process used in buyerNewHook.js.  Should turn this into a reusuable hook.
*/

const initialFormState = { 
    universal_mapped_terms: [],
    custom_mapped_terms: [{ currentField: '', mappedField: '', vertical: ''}],
    delivery_settings: [],
    settings: [],
    ping_url: '',
    post_url: '',
    comment: '',
    activeTab: 'data',
    delivery_type: '',
    delivery_language:'',
    response_language: '',
    frequency: '',
    zipcodes: [],
    fields: [],
    universalFields: [],
    mapped: [],
    selectedVerticals: [],
    selectedVendors: [],
    verticals: [],
    vendors: [],
    buyer_id: '',
    zipCodeAll: true,
    zipCodeList: [],
    zipCodeState: [],
    zipCodeDistance: []

}

const NewSettingsForm = props => {
    const [verticalSelected, setVerticalSelected] = useState(0)
    const [verticalSelectedName, setVerticalSelectedName] = useState('')
    const [fields, setFields] = useState([])
    const [verticalSettings, setVerticalSettings] = useState([])
    const [universalSettings, setUniversalSettings] = useState([])
    const [deliverySettings, setDeliverySettings ] = useState([])
    const [modal, setModal] = useState(false);
    const [data, setData ] = useState(initialFormState)
    const [zipCodeSettings, setZipCodeSettings] = useState([])
    const [zipCodeDistances, setZipCodeDistances] = useState([])
    const [zipCodeStates, setZipCodeStates] = useState([])
    const [activeTab, setActiveTab] = useState('information');

    useEffect(() => {
        getVerticalDefinitions()
        if(verticalSelected && verticalSelected !== 0){
            handleVerticalUpdate()
        }
    },[verticalSelected] )

    useEffect(() => {
        handleAddUniversalSettings(universalSettings)
    }, [universalSettings])

    useEffect(() => {
        handleAddSettings(verticalSettings)
    }, [verticalSettings])

    useEffect(() => {
        handleAddDeliverySettings(deliverySettings)
    },[deliverySettings])

    useEffect(() => {
        handleAddZipCodes(zipCodeSettings)
    },[zipCodeSettings])

    useEffect(() => {
        handleAddZipCodeDistances(zipCodeDistances)
    },[zipCodeDistances])

    useEffect(() => {
        handleAddZipCodeStates(zipCodeStates)
    },[zipCodeStates])

    useEffect(() => {
        const fetchData = async () => {
            const fieldSearch = await fieldDefinition()
            const vendorSearch = await vendors('', 'search', '')
            const verticalSearch = await vertical()
            const universalSearch = await universalFieldDefinition('', 'search', '')
            setData({...data, 
                fields: fieldSearch.items, 
                vendors: vendorSearch.items, 
                verticals: verticalSearch && verticalSearch.items ? verticalSearch.items : [],
                universalFields: universalSearch && universalSearch.items ? universalSearch.items : [],
                buyer_id: props.buyerId
            })
        }
        fetchData()
    }, [])


    const toggle = () => setModal(!modal);

    const handleAddSettings = values => {
        setData({ ...data, settings: [values]})
    }

    const handleAddUniversalSettings = values => {
        setData({...data, universal_mapped_terms: [values]})
    }

    const handleAddDeliverySettings = values => {
        setData({...data, delivery_settings: [values]})
    }

    const toggleAllZip = type => {
        setData({...data, zipCodeAll:type, zipCodeList: [], zipCodeState: [], zipCodeDistance: []})
    }

    const handleAddZipCodes = values => {
        setData({...data, zipCodeList: [values], zipCodeAll: false})
    }

    const handleAddZipCodeStates = value => {
        setData({...data, zipCodeState: value, zipCodeAll: false})
    }

    const handleAddZipCodeDistances = value => {
        setData({...data, zipCodeDistance: value, zipCodeAll: false})
    }


    const getVerticalDefinitions = async () => {
        const get = await verticalFieldDefinition('', 'mapping', { 'vertical_id': verticalSelected})
        setFields(get)
    }

    const verticalArray = data.verticals ? Object.keys(data.verticals).map(items => ({
        value: data.verticals[items].id,
        label: data.verticals[items].label
    })) : []

    const handleChange = e => {
        setVerticalSelected(e.value)
        setVerticalSelectedName(e.label)
        setModal(true)
    }

    const handleVerticalUpdate = () => {
        setDeliverySettings({...deliverySettings,  [verticalSelected]: {
            ...deliverySettings[verticalSelected],
            all_zips : "1",
            vertical_id: verticalSelected
       }})
    }



    const handleDataMapInput = (e,idx) => {
        setVerticalSettings({...verticalSettings,  [verticalSelected]: {
            ...verticalSettings[verticalSelected],
            [e.target.name]: e.target.value,
            vertical: verticalSelectedName,
            vertical_id: verticalSelected
       }})
    }

    const handleDataMapInputCustomFormat = (e, idx, type) => {
        if(verticalSettings[verticalSelected][e.target.name.replace("custom_formating_", '')] !== ''){
            setVerticalSettings({...verticalSettings,  [verticalSelected]: {
                ...verticalSettings[verticalSelected],
                [e.target.name]: e.target.value,
                vertical_id: verticalSelected
           }})  
        } else {
            setVerticalSettings({...verticalSettings,  [verticalSelected]: {
                ...verticalSettings[verticalSelected],
                [e.target.name]: e.target.value,
                [e.target.name.replace("custom_formating_", '')] : e.target.name.replace("custom_formating_", ''),
                vertical_id: verticalSelected
        }}) 
        }
    }

    const handleDataMapUniversal = (e, idx) => {
        setUniversalSettings({...universalSettings,  [verticalSelected]: {
                ...universalSettings[verticalSelected],
                [e.target.name]: e.target.name,
                vertical: verticalSelectedName,
                vertical_id: verticalSelected
        }})
    }

    const handleDataMapUniversalInput = (e, idx) => {
        setUniversalSettings({...universalSettings,  [verticalSelected]: {
                ...universalSettings[verticalSelected],
                [e.target.name]: e.target.value,
                vertical: verticalSelectedName,
                vertical_id: verticalSelected
        }})
    }


    const handleDeliveryInput = (e, idx) => {
        setDeliverySettings({...deliverySettings,  [verticalSelected]: {
            ...deliverySettings[verticalSelected],
            [e.target.name]:e.target.value,
            vertical: verticalSelectedName,
            vertical_id: verticalSelected
       }})
    }

    const handleAdd = e => {
        e.preventDefault()
        console.log(data)
        setModal(false)
        props.handleNewVertical(data)
    }

    const handleAddAdditionalCustomChangeInput = e => {
        const classValue = e.target.className.replace(/form-control/g, '').trim()
        const arrayKey = e.target.id.replace(`${classValue}-`, '').trim()
        let additionalQueryTerms = [...data.custom_mapped_terms]
        additionalQueryTerms[arrayKey][classValue] = e.target.value
        if(classValue === 'currentField'){
            additionalQueryTerms[arrayKey]['vertical'] = e.target.name
        }    
        setData({ ...data, additionalQueryTerms }) 
    }

    const addAdditionalCustom = e => {
        setData({ ...data, custom_mapped_terms: [...data.custom_mapped_terms, {currentField: '', mappedField: ''}]})
    }


    const handleZipCodeInput = (e) => {
        setZipCodeSettings({...zipCodeSettings,  [verticalSelected]: {
            ...zipCodeSettings[verticalSelected],
            [e.target.name]:e.target.value,
            vertical: verticalSelectedName,
            vertical_id: verticalSelected
       }})
    }

    const handleAddZipCodeDistance = e => {
        setZipCodeDistances({...zipCodeDistances, [verticalSelected]: {
            ...zipCodeDistances[verticalSelected],
            distance:e,
            vertical: verticalSelectedName,
            vertical_id: verticalSelected  
        }})
    }


    const handleAddZipCodeState = value => {
        setZipCodeStates({...zipCodeStates, [verticalSelected]: {
            ...zipCodeStates[verticalSelected],
            state: value,
            vertical: verticalSelectedName,
            vertical_id: verticalSelected  
        }})
    }

    return(
        <div>
            <Form>
                <FormGroup>
                    <Label>Vertical Selection</Label>
                    {Object.keys(verticalArray).length ? 
                        <Select
                            onChange={(e) => handleChange(e)}
                            options={verticalArray}
                    /> : ''}
                </FormGroup>
            </Form>
            <NewFieldModal 
                toggle={toggle}
                modal={modal}
                fields={fields}
                verticalSelectedName={verticalSelectedName}
                handleDataMapInput={handleDataMapInput}
                handleAdd={handleAdd}
                data={data}
                handleAddAdditionalCustomChangeInput={handleAddAdditionalCustomChangeInput}
                addAdditionalCustom={addAdditionalCustom}
                verticalSelected={verticalSelected}
                handleDeliveryInput={handleDeliveryInput}
                handleDataMapUniversalInput={handleDataMapUniversalInput}
                handleDataMapUniversal={handleDataMapUniversal}
                toggleAllZip={toggleAllZip}
                handleAddZipCodeState={handleAddZipCodeState}
                handleAddZipCodeDistance={handleAddZipCodeDistance}
                handleDataMapInputCustomFormat={handleDataMapInputCustomFormat}
            />
        </div>   
    )
}

//Edit fields to customize data being sent to buyers
const NewFieldModal = props => {
    const [activeTab, setActiveTab] = useState('vertical');
    const toggle = tab => {
      if(activeTab !== tab) setActiveTab(tab);
    }

    return(
        <div>
        <Modal isOpen={props.modal} toggle={props.toggle} size="lg">
          <ModalHeader toggle={props.toggle}>Customize {props.verticalSelectedName}</ModalHeader>
          <ModalBody>
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === 'vertical' })}
                        onClick={() => { toggle('vertical'); }}
                    >
                        Vertical fields
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === 'fixed' })}
                        onClick={() => { toggle('fixed'); }}
                    >
                        Fixed fields
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === 'custom' })}
                        onClick={() => { toggle('custom'); }}
                    >
                        Custom fields
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === 'delivery' })}
                        onClick={() => { toggle('delivery'); }}
                    >
                        Delivery
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === 'zipcodes' })}
                        onClick={() => { toggle('zipcodes'); }}
                    >
                        Zipcodes
                    </NavLink>
                </NavItem>
                </Nav>  
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="vertical">
                        <div style={{padding: "20px"}}>
                        <CreateVerticalFields 
                            fields={props.fields}
                            handleDataMapInput={props.handleDataMapInput}
                            handleDataMapInputCustomFormat={props.handleDataMapInputCustomFormat}
                        />
                        </div>
                    </TabPane>
                    <TabPane tabId="fixed">
                        <div style={{padding: "20px"}}>
                        <CreateFixed
                            data={props.data}
                            handleDataMapUniversalInput={props.handleDataMapUniversalInput}
                            handleDataMapUniversal={props.handleDataMapUniversal}
                        />
                        </div>
                    </TabPane>
                    <TabPane tabId="custom">
                        <div style={{padding: "20px"}}>
                        <CreateCustomAdditionalTerms
                            handleDataMapInput={props.handleDataMapInput}
                            custom_mapped_terms={props.data.custom_mapped_terms}
                            addAdditionalCustom={props.addAdditionalCustom}
                            handleAddAdditionalCustomChangeInput={props.handleAddAdditionalCustomChangeInput}
                            verticalSelected={props.verticalSelected}
                        /> 
                        </div>
                    </TabPane>
                    <TabPane tabId="delivery">
                    <div style={{padding: "20px"}}>
                        <CreateDelivery
                            handleDeliveryInput={props.handleDeliveryInput}
                        />
                    </div>
                    </TabPane>
                    <TabPane tabId="zipcodes">
                    <div style={{padding: "20px"}}>
                        <NewBuyerZipCodesList
                            handleZipCodeInput={props.handleZipCodeInput}
                            toggleAllZip={props.toggleAllZip}
                            handleAddZipCodeState={props.handleAddZipCodeState}
                            handleAddZipCodeDistance={props.handleAddZipCodeDistance}
                        />
                    </div>
                    </TabPane>
                </TabContent>    
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={e => props.handleAdd(e)}>Add</Button>{' '}
            <Button color="secondary" onClick={props.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
}

const NewBuyerZipCodesList = props => {
    
    const [type, setType] = useState(true)
    const [distance, setDistance] = useState(0)

    const [stateCount, setStateCount] = useState(0)

    const toggleZip = e => {
        setType(!type)
        
    }

    useEffect(() => {
        props.toggleAllZip(type)
    },[type])

    return(
    <div>   
    <FormGroup check>
    <Label check>
    <Input
        type="checkbox" 
        name="" 
        checked={type === true ? "checked" : ''}  
        onChange={(e) => toggleZip(e)} 
    />{' '}
    Use all zipcodes in the United States
    </Label>
    </FormGroup>
    <br />
    {type === false ?
    <Form>
        <Card>
            <CardBody>
            <Row>
                <Col>
                    States selected <Badge color="primary">{stateCount}</Badge>
                </Col>
                <Col>   
                    Distance zipcodes <Badge color="primary">{distance}</Badge>
                </Col>
             </Row>
             </CardBody>
        </Card>   
        <br />
         <NewBuyerZipCodesState 
            handleAddZipCodeState={props.handleAddZipCodeState}
            verticalSelected={props.verticalSelected}
            setStateCount={setStateCount}
        />
        <br />
        <NewBuyerZipCodesDistance 
            handleAddZipCodeDistance={props.handleAddZipCodeDistance}
            verticalSelected={props.verticalSelected}
            setDistance={setDistance}
        />
        <br />
        <FormGroup>
            <Label>Add a list of zipcodes below</Label>
                <Input 
                    type="textarea" 
                    name="zipcodes" 
                    rows="10"
                    onChange={(e) => props.handleZipCodeInput(e)} />
        </FormGroup>
    </Form>  
    : '' }
    </div>  
    )
}

const NewBuyerZipCodesState = props => {


    const stateArray = Object.keys(state).map(items => ({
        value: items,
        label: state[items]
    }))


    const handleZipcodesByState = e => {
        props.handleAddZipCodeState(e)
        props.setStateCount(e.length)
    }

    return(
        <Form>
            <FormGroup>
                <Label>All zipcodes by state (Can select multiple)</Label>
                    {Object.keys(stateArray).length 
                    ? 
                        <Select
                            options={stateArray}
                            onChange={(e) => handleZipcodesByState(e)}
                            isMulti
                            closeMenuOnSelect={false}
                        /> 
                    : ''}
            </FormGroup>
        </Form>
    )     
}


const NewBuyerZipCodesDistance = props => {

    const [zipCode, setZipCode] = useState('')
    const [miles, setMiles] = useState('')



    const handleZipcodeDistanceSubmit = async e => {
        e.preventDefault()
        const results = await zipcode('', 'distance', {'zip': zipCode, 'miles': miles })
        props.handleAddZipCodeDistance(results)
        props.setDistance(results.length)
    }
    return(
    <Form onSubmit={(e) => handleZipcodeDistanceSubmit(e)}>
        <Label>All zipcodes by distance</Label>
        <Row>
            <Col>
                <FormGroup>
                    <Input value={zipCode} onChange={e => setZipCode(e.target.value)}  type="text" name="zipCodeDistance" />
                </FormGroup>  
            </Col>
            <Col>
                <FormGroup>
                    <Input value={miles} onChange={e => setMiles(e.target.value)}  type="text" name="zipCodeDistanceMiles" />
                </FormGroup>  
            </Col>
            <Col>
                <Button color="success">Submit</Button>
            </Col>
        </Row>      
    </Form>    
    )
}


const CreateFixed = props => {
    return(
        <div>
            <p>Fixed fields being sent to buyers can be mapped below.  Check "use this field" to select the default value.  Check "use this field" and "map this field" to select the default value and create a mapping scheme.</p>
            {Object.keys(props.data.universalFields).map((items,idx) => 
                <Row key={idx}>     
                <Col>    
                    <FormGroup check>
                        <Input type="checkbox" name={props.data.universalFields[items].name} onChange={(e) => props.handleDataMapUniversal(e, idx)} />
                        <Label check>Use this field</Label>
                    </FormGroup>
                </Col>
                <Col>    
                    <FormGroup check>
                        <Input type="checkbox" />
                        <Label check>Map this field</Label>
                    </FormGroup>
                </Col>
                <Col>     
                    <FormGroup>
                        <Input
                            value={props.data.universalFields[items].name}
                            type="text"
                            className="form-control currentField"
                            disabled
                        /> 
                    </FormGroup> 
                </Col>
                <Col>    
                    <FormGroup>
                        <Input
                            type="text"
                            name={props.data.universalFields[items].name}
                            className="form-control mappedField"
                            onChange={(e) => props.handleDataMapUniversalInput(e, idx)}
                       /> 
                    </FormGroup> 
                </Col> 

            </Row>  
            )}
        </div>   
    )
}

//
const CreateVerticalFields = props => {
    const [customFields, setCustomFields] = useState([])

    useEffect(() => {
        const getFields = async () => {
            const search = await buyers('', 'buyer-custom-format')
            setCustomFields(search)
        }
        getFields()
    },[])

    return(
    <div>
            {Object.keys(props.fields).map((items,idx) => 
                <Row key={idx}>     
                    <Col>     
                        <FormGroup>
                            <Input
                                value={props.fields[items].name}
                                name={props.fields[items].name}
                                type="text"
                                className="form-control currentField"
                                disabled
                            /> 
                        </FormGroup> 
                    </Col>
                    <Col>    
                        <FormGroup>
                            <Input
                                type="text"
                                name={props.fields[items].name}
                                className="form-control mappedField"
                                onChange={(e) => props.handleDataMapInput(e, idx)}
                           /> 
                        </FormGroup> 
                    </Col>  
                    <Col>    
                        <FormGroup>
                            <Input
                                type="select"
                                name={`custom_formating_${props.fields[items].name}`}
                                className="form-control customFormat"
                                onChange={(e) => props.handleDataMapInputCustomFormat(e, idx, 0)}
                            >
                            <option value="">Select a custom format..</option>
                            {Object.keys(customFields).map(items =>
                                <option value={customFields[items].id}>{customFields[items].name}</option>
                            )}
                            </Input> 
                        </FormGroup> 
                    </Col>    
                </Row>     
            )}
    </div> 
    )
}


const CreateDelivery = props => {
    return(
    <Form>    
    <FormGroup>
        <Label for="post_url">Post URL</Label>
        <Input type="text"  name="post_url" placeholder="Post Url" onChange={props.handleDeliveryInput} />
    </FormGroup>
    <FormGroup>
        <Label for="post_success">Post Success</Label>
        <Input type="text"  name="post_success" placeholder="Post Response Success" onChange={props.handleDeliveryInput} />
    </FormGroup>
    <FormGroup>
        <Label for="post_failure">Post Failure</Label>
        <Input type="text"  name="post_failure" placeholder="Post Response Failure" onChange={props.handleDeliveryInput} />
    </FormGroup>
    <FormGroup>
        <Label for="delivery">Delivery Type</Label>
        <Input type="select"  name="delivery_type"  onChange={props.handleDeliveryInput} >
        <option value="" selected="selected">Select Delivery Type...</option>
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        </Input>
    </FormGroup>
    <FormGroup>
        <Label for="delivery">Delivery Language</Label>
        <Input type="select"  name="delivery_language"  onChange={props.handleDeliveryInput} >
        <option value="" selected="selected">Select Delivery Language...</option>
        <option value="xml">XML</option>
        <option value="json">JSON</option>
        <option value="text">Text</option>
        </Input>
    </FormGroup>
    <FormGroup>
        <Label for="response">Response Language</Label>
        <Input type="select"  name="response_language"  onChange={props.handleDeliveryInput} >
        <option value="" selected="selected">Select Response Language...</option>
        <option value="xml">XML</option>
        <option value="json">JSON</option>
        <option value="text">Text</option>
        </Input>
    </FormGroup>
    </Form>
    )
}

const CreateCustomAdditionalTerms = props => {
    return(
        props.custom_mapped_terms.map((val, idx) => {
            let currentFieldId = `currentField-${idx}`, mappedFieldId = `mappedField-${idx}`
            return(
                <div className="form-row" key={idx}>
                    <Col>
                    <FormGroup>
                            <Input
                                type="text"
                                name={props.verticalSelected}
                                dataid={idx}
                                id={currentFieldId}
                                value={props.custom_mapped_terms[idx].currentField}
                                className="form-control currentField"
                                onChange={(e) => props.handleAddAdditionalCustomChangeInput(e)}
                            /> 
                    </FormGroup> 
                    </Col>    
                    <Col>
                        <FormGroup>
                            <Input
                                type="text"
                                dataid={idx}
                                name={mappedFieldId}
                                id={mappedFieldId}
                                value={props.custom_mapped_terms[idx].mappedField}
                                className="form-control mappedField"
                                onChange={(e) => props.handleAddAdditionalCustomChangeInput(e)}
                            /> 
                        </FormGroup> 
                    </Col> 
                    <Col>
                        <Button color="primary" onClick={(e) => props.addAdditionalCustom(e)}>+</Button>
                    </Col> 
                </div>
            )
        })
    )
}

