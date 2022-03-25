import React,{useState, useReducer, useEffect, Fragment } from 'react'
import {Alert ,Table, Badge, Button, Row, Col, Form, Input, Label, FormGroup, TabContent, TabPane, Nav, NavItem,NavLink, Card, Breadcrumb, BreadcrumbItem, BreadCrumbNavigation,Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { base, buyerVerticals } from '../config/endpoints'
import axios from 'axios'
import Select from 'react-select'
import Alerts from '../controller/alerts'
import countryList from 'react-select-country-list'
import classnames from 'classnames';
import makeAnimated from 'react-select/animated';
import { fieldDefinition, buyers, vertical, vendors, zipcode, verticalFieldDefinition, universalFieldDefinition } from '../util/db'
import { zipcodes } from 'zipcodes'
import { state } from '../static/states'
import { withRouter, Link } from 'react-router-dom';
import CardBody from 'reactstrap/lib/CardBody';
import {helpBuyerNewBasic, helpBuyerNewCustomize, helpBuyerNewCustomizeVertical, helpBuyerNewCustomizeCustom, helpBuyerNewCustomizeFixed, helpBuyerNewCustomizeDelivery, helpBuyerNewCustomizeZipCodes} from '../config/help'


function BuyerNew(props){
    const initialFormState = { 
        id: null,
        username: '',
        password: '',
        company_name: '',
        first_name: '',
        last_name: '',
        affiliate: '',
        address: '',
        city: '',
        state: '',
        country: '',
        work_phone: '',
        cell_phone: '',
        contact_email: '',
        zip: '',
        mapped_terms: [{ currentField: '', mappedField: ''}],
        custom_mapped_terms: [{ currentField: '', mappedField: '', vertical: ''}],
        universal_mapped_terms: [],
        delivery_settings: [],
        settings: [],
        delivery: [], 
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
        vendorsAll: true,
        buyerData: true,
        buyerSettings: true,
        buyerMapping: true,
        buyerZipCodes: true,
        zipCodeList: [],
        zipCodeState: [],
        zipCodeDistance: [],
        zipCodeAll: true,
        zipCodeDistanceList: [],
        zipCodeDistanceMiles: '',
        paused: false
    }
    const [data, setData ] = useState(initialFormState)
    const [activeTab, setActiveTab] = useState('information');

    console.log(data.settings)

    useEffect(() => {
        const fetchData = async () => {
            const fieldSearch = await fieldDefinition()
            const vendorSearch = await vendors('', 'search', '')
            const verticalSearch = await vertical()
            const universalSearch = await universalFieldDefinition('', 'search', '')
            setData({...data, 
                fields: fieldSearch && fieldSearch.items ? fieldSearch.items : [], 
                vendors: vendorSearch && vendorSearch.items ? vendorSearch.items : [], 
                verticals: verticalSearch && verticalSearch.items ? verticalSearch.items : [],
                universalFields: universalSearch && universalSearch.items ? universalSearch.items : []
            })
        }
        fetchData()
    }, [])


    const Bread = ({ }) => (
        <div style={{backgroundColor: 'white'}}>
          <Breadcrumb>
            <BreadcrumbItem><Link to="/buyer">Buyer</Link></BreadcrumbItem>
            <BreadcrumbItem active>Add New Buyer</BreadcrumbItem>
          </Breadcrumb>
        </div>
    )

    const toggle = tab => {
      if(activeTab !== tab) setActiveTab(tab);
    }

    const handleInputChange = e => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }

    const handleCountry = item => {
        setData({ ...data, country: item.value})
    }

    const handleMultiChange = (value, name) => {
        let id = []
       if(value && value.length) {
           Object.keys(value).map(items =>
            id.push(value[items].value)
           ) 
        }
        setData({ ...data, [name]: id})
    }

    const addAdditional = (e) => {
        setData({ ...data, mapped_terms: [...data.mapped_terms, {currentField: '', mappedField: ''}]})
    }

    const addAdditionalCustom = e => {
        setData({ ...data, custom_mapped_terms: [...data.custom_mapped_terms, {currentField: '', mappedField: ''}]})
    }

    const handleAddAdditionalChangeSelect = (e, value, id) => {
        const classValue = value.trim()
        const arrayKey = id.replace(`${classValue}-`, '').trim()
        let additionalQueryTerms = [...data.mapped_terms]
        additionalQueryTerms[arrayKey][classValue] = e.value
        setData({ ...data, additionalQueryTerms })
   } 

   const handleAddAdditionalChangeInput = e => {
        const classValue = e.target.className.replace(/form-control/g, '').trim()
        const arrayKey = e.target.id.replace(`${classValue}-`, '').trim()
        let additionalQueryTerms = [...data.mapped_terms]
        additionalQueryTerms[arrayKey][classValue] = e.target.value
        setData({ ...data, additionalQueryTerms }) 
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



    const handleZipcodeDistanceSubmit = async e => {
        e.preventDefault()
        const results = await zipcode('', 'distance', {'zip': data.zipCodeDistance, 'miles': data.zipCodeDistanceMiles })
        setData(prevState => ({...prevState, zipCodeList: results}))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        const { username, password, company_name } = data
        const fields = data
        if(username && password && company_name){
        const add = await buyers(fields, 'add')
           if(add && add["code"] === 201){
               Alerts.success('New buyer successfully created')
               props.history.push('/buyer')
           } else {
               const errors = {
                   name: 'Error posting',
                   message: add
               }
                Alerts.error(errors)  
           }
       } else {
           const errors = {
               name: "Missing fields",
               message: "Please check that you have all the required fields"
           }
           Alerts.error(errors)
       }    

    }

    const handleAddSettings = values => {
        setData({ ...data, settings: [values]})
    }

    const handleAddUniversalSettings = values => {
        setData({...data, universal_mapped_terms: [values]})
    }

    const handleAddDeliverySettings = values => {
        setData({...data, delivery_settings: [values]})
    }

    const handleAddZipCodeSettings = values => {
        setData({...data, zipcodes: [values]})
    }

    const handleAddZipCodeStates = value => {
        setData({...data, zipCodeState: value})
    }

    const handleAddZipCodeDistances = value => {
        setData({...data, zipCodeDistance: value})
    }

    const removeSetVertical = index => {
        const setting = data.settings.filter((item,i) => i !== index)
        const mapped = data.universal_mapped_terms.filter((item,i) => i !== index)
        const delivery = data.delivery_settings.filter((item,i) => i !== index)
        const zip = data.zipcodes.filter((item,i) => i !== index)
        setData({...data, 
            settings: setting,
            universal_mapped_terms: mapped,
            delivery_settings: delivery,
            zipcodes: zip
        });
    }

    const toggleAllZip = type => {
        setData({...data, zipCodeAll:type})
    }

    const toggleAllVendors = type => {
        setData({...data, vendorsAll :type})
        if(type === true){
            setData({...data, selectedVendors: []})
        }
    }

    const toggleAllPause = type => {
        setData({
            ...data, paused: type
        })
    }


    return(
        <div>
        <Bread />   
        {data && data.paused === true ?
                <Alert color="warning">This vendor will not recieve any leads until you uncheck pause</Alert>
            : ''}
        <div className="d-flex justify-content-end" style={{marginBotton: "30px"}}>
            {data.username && data.password && data.company_name ?
                <Button onClick={(e) => handleSubmit(e)} color="success">Add New Buyer</Button>
            : <Button color="default" disabled>Add required fields</Button>}    
        </div>    
        <br /> 
        <Nav tabs>
            <NavItem>
                <NavLink
                    className={classnames({ active: activeTab === 'information' })}
                    onClick={() => { toggle('information'); }}
                >
                    Basic Information
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    className={classnames({ active: activeTab === 'settings' })}
                    onClick={() => { toggle('settings'); }}
                >
                Customize fields
                </NavLink>
            </NavItem>
            {/* <NavItem>
                <NavLink
                    className={classnames({ active: activeTab === 'zipcodes' })}
                    onClick={() => { toggle('zipcodes'); }}
                >
                Zipcodes
                </NavLink>
            </NavItem> */}
            {/* <NavItem>
                <NavLink
                    className={classnames({ active: activeTab === 'purchased_leads' })}
                    onClick={() => { toggle('purchased_leads'); }}
                >
                Purchased Leads
                </NavLink>
            </NavItem> */}
        </Nav>
        <TabContent activeTab={activeTab}>
            <TabPane tabId="information">
                <Row>
                    <Col>
                        <Card body>
                            <InformationForm
                                handleInputChange={handleInputChange}
                                handleCountry={handleCountry}
                                data={data}
                                handleMultiChange={handleMultiChange}
                                toggleAllVendors={toggleAllVendors}
                                toggleAllPause={toggleAllPause}
                            />
                        </Card>
                    </Col>
                </Row>        
            </TabPane>
            <TabPane tabId="settings">
                <Row>
                    <Col>
                        <Card body>
                            <NewSettingsForm
                                data={data}
                                settings={data.settings}
                                delivery={data.delivery_settings}
                                handleAddSettings={handleAddSettings}
                                handleAddAdditionalCustomChangeInput={handleAddAdditionalCustomChangeInput}
                                addAdditionalCustom={addAdditionalCustom}
                                handleAddDeliverySettings={handleAddDeliverySettings}
                                handleAddUniversalSettings={handleAddUniversalSettings}
                                handleAddZipCodeSettings={handleAddZipCodeSettings}
                                removeSetVertical={removeSetVertical}
                                toggleAllZip={toggleAllZip}
                                handleAddZipCodeStates={handleAddZipCodeStates}
                                handleAddZipCodeDistances={handleAddZipCodeDistances}
                            />
                            {/* <SettingsForm
                                data={data}
                                addAdditional={addAdditional}
                                handleMultiChange={handleMultiChange}
                                handleInputChange={handleInputChange}
                                handleAddAdditionalChangeSelect={handleAddAdditionalChangeSelect}
                                handleAddAdditionalChangeInput={handleAddAdditionalChangeInput}
                                handleAddAdditionalCustomChangeInput={handleAddAdditionalCustomChangeInput}
                                addAdditionalCustom={addAdditionalCustom}
                            /> */}
                        </Card>
                    </Col>
                </Row>  
            </TabPane>
            {/* <TabPane tabId="zipcodes">
                <Row>
                    <Col>
                        <Card body>
                            <ZipCodesForm 
                                data={data}
                                handleZipcodesByState={handleZipcodesByState}
                                handleZipCodeDistance={handleZipCodeDistance}
                                handleZipcodeDistanceSubmit={handleZipcodeDistanceSubmit}
                                handleInputChange={handleInputChange}
                            />
                        </Card>
                    </Col>
                </Row>            
            </TabPane> */}
            {/* <TabPane tabId="purchased_leads">
                <Row>
                    <Col>
                        <Card body>
                            <PurchasedLeadsForm 
                                data={data}
                            />
                        </Card>
                    </Col>
                </Row>            
            </TabPane> */}
        </TabContent>
        </div>    
    )
}

const InformationForm = props => {

    const [type, setType] = useState(true)
    const [pause, setPause] = useState(false)

    const toggleVendors = e => {
        setType(!type)
    }

    const togglePause = e => {
        setPause(!pause)
    }

    useEffect(() => {
        props.toggleAllVendors(type)
    },[type])

    useEffect(() => {
        props.toggleAllPause(pause)
    },[pause])

    const vendorArray = props.data.vendors ? Object.keys(props.data.vendors).map(items => ({
        value: props.data.vendors[items].id,
        label: props.data.vendors[items].company_name
    })) : []
    return(
     <div>
         <div className="d-flex justify-content-end">
            <a href={helpBuyerNewBasic} style={{marginBottom: "20px"}} type="button" className="btn btn-primary" target="_blank">Basic information help</a>
         </div>   
    <Form>
        <Row>
            <Col>
                <FormGroup check style={{paddingBottom: "20px"}}>
                <Label check>
                    <Input
                        type="checkbox" 
                        name="" 
                        checked={pause === true ? "checked" : ''}  
                        onChange={(e) => togglePause(e)} 
                    />{' '}
                    Pause (Leads will not be sent to this vendor)
                </Label>
                </FormGroup>
                <FormGroup>
                    <Label for="username">User Name* (required)</Label>
                    <Input type="text" value={props.data.username} name="username" placeholder="Username" required onChange={props.handleInputChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password* (required)</Label>
                    <Input type="text" value={props.data.password} name="password" placeholder="Password" required onChange={props.handleInputChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="username">Company Name* (required)</Label>
                    <Input type="text" value={props.data.company_name} name="company_name" placeholder="Company Name" required onChange={props.handleInputChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="name">First Name</Label>
                    <Input type="text" value={props.data.first_name} name="first_name" placeholder="First Name" onChange={props.handleInputChange}/>
                </FormGroup>
                <FormGroup>
                    <Label for="name">Last Name</Label>
                    <Input type="text" value={props.data.last_name} name="last_name" placeholder="Last Name" onChange={props.handleInputChange}/>
                </FormGroup>
                <FormGroup>
                    <Label for="affiliate">Affiliate</Label>
                    <Input type="text" value={props.data.affiliate} name="affiliate" placeholder="affiliate" onChange={props.handleInputChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="work_phone">Work Phone</Label>
                    <Input type="text" value={props.data.work_phone} name="work_phone" placeholder="Work Phone" onChange={props.handleInputChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="cell_phone">Cell Phone</Label>
                    <Input type="text" value={props.data.cell_phone} name="cell_phone" placeholder="Cell Phone" onChange={props.handleInputChange}/>
                </FormGroup>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="email" value={props.data.contact_email} name="contact_email" placeholder="Email" onChange={props.handleInputChange} />
                </FormGroup> 
            </Col>
            <Col>
                <FormGroup>
                    <Label for="address">Address</Label>
                    <Input type="textarea" value={props.data.address} name="address" onChange={props.handleInputChange}/>
                </FormGroup>
                <FormGroup>
                    <Label for="city">City</Label>
                    <Input type="text" name="city" value={props.data.city} placeholder="City" onChange={props.handleInputChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="state">State</Label>
                    <Input type="select" name="state" value={props.data.state} onChange={props.handleInputChange}>
                    <option value="">State</option>
                        {Object.keys(state).map(items => 
                            <option key={items} value={items}>{state[items]}</option>
                        )}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="city">Zipcode</Label>
                    <Input type="text" name="zip" value={props.data.zip} placeholder="Zipcode" onChange={props.handleInputChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="country">Country</Label>
                    <Select
                        options={countryList().getData()}
                        onChange={props.handleCountry}
                    />
                </FormGroup>
                <FormGroup check style={{paddingBottom: "20px", paddingTop: "20px"}}>
                <Label check>
                    <Input
                        type="checkbox" 
                        name="" 
                        checked={type === true ? "checked" : ''}  
                        onChange={(e) => toggleVendors(e)} 
                    />{' '}
                    Select all vendors
                </Label>
                </FormGroup>   
                { type === false  ?
                <FormGroup>
                    <Label>Preferred Vendors</Label>
                    {Object.keys(vendorArray).length ? <Select
                        onChange={(e) => props.handleMultiChange(e, 'selectedVendors')}
                        options={vendorArray}
                        isMulti
                        closeMenuOnSelect={false}
                    /> : ''}
                </FormGroup>
                : '' }
                <FormGroup>
                    <Label for="ping_url">Ping URL</Label>
                    <Input type="text" value={props.data.ping_url} name="ping_url" placeholder="Ping Url" onChange={props.handleInputChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="comment">Comments</Label>
                    <Input type="textarea" value={props.data.comment} name="comment" placeholder="Comments" onChange={props.handleInputChange} />
                </FormGroup>
            </Col>
        </Row>
    </Form> 
    </div>
    )
}

const NewSettingsForm = props => {

    const [verticalSelected, setVerticalSelected] = useState(0)
    const [verticalSelectedName, setVerticalSelectedName] = useState('')
    const [fields, setFields] = useState([])
    const [verticalSettings, setVerticalSettings] = useState([])
    const [universalSettings, setUniversalSettings] = useState([])
    const [deliverySettings, setDeliverySettings ] = useState([])
    const [zipCodeSettings, setZipCodeSettings] = useState([])
    const [modal, setModal] = useState(false);
    const [zipCodeDistances, setZipCodeDistances] = useState([])
    const [zipCodeStates, setZipCodeStates] = useState([])

    const toggle = () => {
        setModal(!modal);
    }    

    useEffect(() => {
        getVerticalDefinitions()
        if(verticalSelected && verticalSelected !== 0){
            setDeliverySettings({...deliverySettings,  [verticalSelected]: {
                ...deliverySettings[verticalSelected],
                all_zips : "1",
                vertical_id: verticalSelected
        }})
        }
    },[verticalSelected])

    useEffect(() => {
        props.handleAddUniversalSettings(universalSettings)
    }, [universalSettings])

    useEffect(() => {
        props.handleAddSettings(verticalSettings)
    }, [verticalSettings])

    useEffect(() => {
        props.handleAddDeliverySettings(deliverySettings)
    },[deliverySettings])

    useEffect(() => {
        props.handleAddZipCodeSettings(zipCodeSettings)
    },[zipCodeSettings])

    useEffect(() => {
        props.handleAddZipCodeDistances(zipCodeDistances)
    },[zipCodeDistances])

    useEffect(() => {
        props.handleAddZipCodeStates(zipCodeStates)
    },[zipCodeStates])


    const getVerticalDefinitions = async () => {
        const get = await verticalFieldDefinition('', 'mapping', { 'vertical_id': verticalSelected})
        setFields(get)
    }

    const getVerticalName = async () => {
        const get = await vertical('', 'search', { 'filter[id]': verticalSelected} )
        const { items } = get || []
        setVerticalSelectedName(items.Label)
    }

    const verticalArray = props.data.verticals ? Object.keys(props.data.verticals).map(items => ({
        value: props.data.verticals[items].id,
        label: props.data.verticals[items].label
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



    const handleDataMapInput = (e,idx, type) => {

        setVerticalSettings({...verticalSettings,  [verticalSelected]: {
            ...verticalSettings[verticalSelected],
            [e.target.name]: e.target.value,
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
                vertical_id: verticalSelected
        }})
    }

    const handleDataMapUniversalInput = (e, idx) => {
        setUniversalSettings({...universalSettings,  [verticalSelected]: {
                ...universalSettings[verticalSelected],
                [e.target.name]: e.target.value,
                vertical_id: verticalSelected
        }})
    }

    const handleDeliveryInput = (e, idx) => {
        setDeliverySettings({...deliverySettings,  [verticalSelected]: {
            ...deliverySettings[verticalSelected],
            [e.target.name]:e.target.value,
            vertical_id: verticalSelected
       }})
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

    const handleAdd = e => {
        e.preventDefault()
        setModal(false)
    }


    return(
        <div>
          <div className="d-flex justify-content-end">
            <a href={helpBuyerNewCustomize} style={{marginBottom: "20px"}} type="button" className="btn btn-primary" target="_blank">Customization help</a>
         </div>   
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
            {props.delivery && props.delivery.length ?
            <Table>
                <thead>
                    <tr>
                        <th>Vertical</th>
                        <th>Action</th>
                    </tr>    
                </thead>
                <tbody>
                    {Object.keys(props.delivery).map((items,idx) => 
                        Object.keys(props.delivery[items]).map(list =>
                            <tr key={idx}>
                                <td>{props.delivery[items][list].vertical_id}</td>
                                <td><Button color="danger" onClick={e => props.removeSetVertical(idx)}>Delete</Button></td>
                            </tr>    
                        ))}
                </tbody>
            </Table>   
            : ''}  
            <FieldModal 
                toggle={toggle}
                modal={modal}
                delivery={props.delivery}
                fields={fields}
                verticalSelectedName={verticalSelectedName}
                handleDataMapInput={handleDataMapInput}
                handleAdd={handleAdd}
                data={props.data}
                handleAddAdditionalCustomChangeInput={props.handleAddAdditionalCustomChangeInput}
                addAdditionalCustom={props.addAdditionalCustom}
                verticalSelected={verticalSelected}
                handleDeliveryInput={handleDeliveryInput}
                handleDataMapUniversalInput={handleDataMapUniversalInput}
                handleZipCodeInput={handleZipCodeInput}
                handleDataMapUniversal={handleDataMapUniversal}
                toggleAllZip={props.toggleAllZip}
                handleAddZipCodeState={handleAddZipCodeState}
                handleAddZipCodeDistance={handleAddZipCodeDistance}
                handleDataMapInputCustomFormat={handleDataMapInputCustomFormat}
            />
        </div>   
    )
}

//Edit fields to customize data being sent to buyers
const FieldModal = props => {
    const [activeTab, setActiveTab] = useState('vertical');
    const toggle = tab => {
      if(activeTab !== tab) setActiveTab(tab);
    }
    return(
        <div>
        <Modal isOpen={props.modal} toggle={props.toggle} size="xl">
          <ModalHeader toggle={props.toggle}>Customize {props.verticalSelectedName}</ModalHeader>
           <p style={{marginLeft: "20px", marginTop: "20px"}}>
            <strong>Delivery fields are required to submit</strong>
           </p>
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
                        <div className="d-flex justify-content-end">
                            <a href={helpBuyerNewCustomizeVertical} style={{marginBottom: "20px"}} type="button" className="btn btn-primary" target="_blank">Vertical help</a>
                        </div>   
                        <EditVerticalFields 
                            fields={props.fields}
                            handleDataMapInput={props.handleDataMapInput}
                            handleDataMapInputCustomFormat={props.handleDataMapInputCustomFormat}
                        />
                        </div>
                    </TabPane>
                    <TabPane tabId="fixed">
                        <div style={{padding: "20px"}}>
                        <div className="d-flex justify-content-end">
                            <a href={helpBuyerNewCustomizeFixed} style={{marginBottom: "20px"}} type="button" className="btn btn-primary" target="_blank">Fixed help</a>
                        </div>  
                        <UniversalFieldDisplay 
                            data={props.data}
                            handleDataMapUniversalInput={props.handleDataMapUniversalInput}
                            handleDataMapUniversal={props.handleDataMapUniversal}
                        />
                        </div>
                    </TabPane>
                    <TabPane tabId="custom">
                        <div style={{padding: "20px"}}>
                        <div className="d-flex justify-content-end">
                            <a href={helpBuyerNewCustomizeCustom} style={{marginBottom: "20px"}} type="button" className="btn btn-primary" target="_blank">Custom help</a>
                        </div> 
                        <CustomAdditionalTerms
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
                        <div className="d-flex justify-content-end">
                            <a href={helpBuyerNewCustomizeDelivery} style={{marginBottom: "20px"}} type="button" className="btn btn-primary" target="_blank">Delivery help</a>
                        </div> 
                        <EditDelivery
                            handleDeliveryInput={props.handleDeliveryInput}
                        />
                    </div>
                    </TabPane>
                    <TabPane tabId="zipcodes">
                    <div style={{padding: "20px"}}>
                        <div className="d-flex justify-content-end">
                            <a href={helpBuyerNewCustomizeZipCodes} style={{marginBottom: "20px"}} type="button" className="btn btn-primary" target="_blank">Zipcode help</a>
                        </div> 
                        <NewBuyerZipCodesList
                            data={props.data}
                            handleZipCodeInput={props.handleZipCodeInput}
                            toggleAllZip={props.toggleAllZip}
                            handleAddZipCodeState={props.handleAddZipCodeState}
                            handleAddZipCodeDistance={props.handleAddZipCodeDistance}
                            verticalSelected={props.verticalSelected}
                        />
                    </div>
                    </TabPane>
                </TabContent>    
          </ModalBody>
          <ModalFooter>
              {props.delivery.length 
                ? <Button color="primary" onClick={e => props.handleAdd(e)}>Add</Button>
                : <Button color="secondary" disabled>Add</Button>
              }
            <Button color="secondary" onClick={props.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
}


const UniversalFieldDisplay = props => {
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
        <p>Verticals can be mapped below. Even if a vertical is not mapped, it will still be sent to a buyer.</p>
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
                                onChange={(e) => props.handleDataMapInput(e, idx, 0)}
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


const EditDelivery = props => {
    return(
    <Form>    
    <p>All values are required.</p>
    <a href="https://docs.google.com/document/d/1u6cbXU8tpvmVIQ1geDYTN2054tAQE8M4L02Cj7wEhhM/edit#bookmark=id.ugozn4wjzj88" target="_blank">Help with delivery</a>
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
        <option value="">Select Delivery Type...</option>
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        </Input>
    </FormGroup>
    <FormGroup>
        <Label for="delivery">Delivery Language</Label>
        <Input type="select"  name="delivery_language"  onChange={props.handleDeliveryInput} >
        <option value="">Select Delivery Language...</option>
        <option value="xml">XML</option>
        <option value="json">JSON</option>
        <option value="text">Text</option>
        </Input>
    </FormGroup>
    <FormGroup>
        <Label for="delivery">Response Language</Label>
        <Input type="select"  name="response_language"  onChange={props.handleDeliveryInput} >
        <option value="">Select Response Language...</option>
        <option value="xml">XML</option>
        <option value="json">JSON</option>
        <option value="text">Text</option>
        </Input>
    </FormGroup>
    </Form>
    )
}

const SettingsForm = props => {
    return(
    <Form>
        <Row>
            <Col>
            <h5>Map vertical terms</h5>
            <small>Use the fields below to re-map any vertical fields to this buyers external system.  Re-mapped terms will replace the standard fields used in this system</small>
            <br />
            <AdditionalQueryTerms
                mapped_terms={props.data.mapped_terms}
                addAdditional={props.addAdditional}
                handleAddAdditionalChangeSelect={props.handleAddAdditionalChangeSelect}
                handleAddAdditionalChangeInput={props.handleAddAdditionalChangeInput}
                fields={props.data.fields}
            />  
            </Col>
            <Col>
            <h5>Custom mapped terms</h5>
            <small>Use the fields below to create custom fields that will be sent to this buyer's system</small>
            <br />
            <CustomAdditionalTerms
                custom_mapped_terms={props.data.custom_mapped_terms}
                addAdditionalCustom={props.addAdditionalCustom}
                handleAddAdditionalCustomChangeInput={props.handleAddAdditionalCustomChangeInput}
            />                
            </Col>
            
         </Row>   
    </Form> 
    )
}

const ZipCodesForm = props => {
    // const zipCodeCount = props.data.zipCodeList.flat()
    return(
        <div>
                {/* <NewBuyerZipCodesList
                        props={props}
                /> */}
                <Col>
                    <h2>Options for adding zipcodes</h2>
                    <p>You can choose any of the options below or use a combination</p>
                    <NewBuyerZipCodesState 
                        handleAddZipCodeState={props.handleAddZipCodeState}
                    />
                    <br />
                    <NewBuyerZipCodesDistance 
                        props={props}
                    />
                    <br />

                </Col> */}
                {/* <Col>
                    <h2>List of current zipcodes ({zipCodeCount.length})</h2>
                        <Input type="textarea" rows="20" name="zipCodeList" value={props.data.zipCodeList} onChange={props.handleInputChange} />
                </Col> */}       
    </div>  
    )

}

const PurchasedLeadsForm = props => {
    const vendorArray = props.data.vendors ? Object.keys(props.data.vendors).map(items => ({
        value: props.data.vendors[items].id,
        label: props.data.vendors[items].name
    })) : []

    return(
        <Col>
                <FormGroup>
                    <Label for="ping_url">Ping URL</Label>
                    <Input type="text" value={props.data.ping_url} name="ping_url" placeholder="Ping Url" onChange={props.handleInputChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="post_url">Post URL</Label>
                    <Input type="text" value={props.data.post_url} name="post_url" placeholder="Post Url" onChange={props.handleInputChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="delivery">Delivery Type</Label>
                    <Input type="select"  name="delivery_type"  onChange={props.handleInputChange} >
                    <option value="" selected="selected">Select Delivery Type...</option>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="delivery">Delivery Language</Label>
                    <Input type="select"  name="delivery_language"  onChange={props.handleInputChange} >
                    <option value="" selected="selected">Select Delivery Language...</option>
                    <option value="xml">XML</option>
                    <option value="json">JSON</option>
                    </Input>
                </FormGroup>
            </Col>
    )
}


///Get Zipcodes by distance

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

//Get ZipCodes by state

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


const AdditionalQueryTerms = props => {
    const fieldArray = props.fields ? Object.keys(props.fields).map(items => ({
        value: props.fields[items].name,
        label: props.fields[items].name
    })) : []
    return(
        props.mapped_terms.map((val, idx) => {
            let currentFieldId = `currentField-${idx}`, mappedFieldId = `mappedField-${idx}`
            return(
                <div className="form-row" key={idx}>
                    <Col>
                        <FormGroup>
                            {Object.keys(fieldArray).length ? 
                                <Select
                                    onChange={(e) => props.handleAddAdditionalChangeSelect(e, "currentField", currentFieldId)}
                                    options={fieldArray}
                                    id={currentFieldId}
                                    className="currentField"
                                    dataid={idx}
                                /> : ''}
                        </FormGroup> 
                    </Col>    
                    <Col>
                        <FormGroup>
                            <Input
                                type="text"
                                dataid={idx}
                                name={mappedFieldId}
                                id={mappedFieldId}
                                value={props.mapped_terms[idx].mappedField}
                                className="form-control mappedField"
                                onChange={(e) => props.handleAddAdditionalChangeInput(e)}
                            /> 
                        </FormGroup> 
                    </Col> 
                    <Col>
                        <Button color="primary" onClick={(e) => props.addAdditional(e)}>+</Button>
                    </Col> 
                </div>
            )
        })
    )
}

const CustomAdditionalTerms = props => {
    return(
        <div>
        <p>Create any custom values you want to send to the buyer. A field does not need a value to be created.</p>
        {props.custom_mapped_terms.map((val, idx) => {
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
        })}
        </div>
    )
}


export default withRouter(BuyerNew)