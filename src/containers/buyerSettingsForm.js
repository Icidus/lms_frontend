import React, {useState, useEffect} from 'react'
import { fieldDefinition, buyers, vertical, vendors, zipcode, verticalFieldDefinition, universalFieldDefinition } from '../util/db'
import { Table, Button, Row, Col, Form, Input, Label, FormGroup, TabContent, TabPane, Nav, NavItem,NavLink, Card, Breadcrumb, BreadcrumbItem, BreadCrumbNavigation,Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Select from 'react-select'
import Alerts from '../controller/alerts'

const initialFormState = { 
    mapped_terms: [{ currentField: '', mappedField: ''}],
    custom_mapped_terms: [{ currentField: '', mappedField: '', vertical: ''}],
    universal_mapped_terms: [],
    delivery_settings: [],
    settings: [],
    delivery: [], 
    ping_url: '',
    post_url: '',
    activeTab: 'data',
    delivery_type: '',
    delivery_language:'',
    frequency: '',
    fields: [],
    universalFields: [],
    mapped: [],
    selectedVerticals: [],
    selectedVendors: [],
    verticals: [],
    vendors: [],
}

function NewSettingsForm() {

    const
    const [verticalSelected, setVerticalSelected] = useState(0)
    const [verticalSelectedName, setVerticalSelectedName] = useState('')
    const [fields, setFields] = useState([])
    const [verticalSettings, setVerticalSettings] = useState([])
    const [universalSettings, setUniversalSettings] = useState([])
    const [deliverySettings, setDeliverySettings ] = useState([])
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    useEffect(() => {
        const fetchData = async () => {
            const fieldSearch = await fieldDefinition()
            const vendorSearch = await vendors('', 'search', '')
            const verticalSearch = await vertical()
            setData({...data, 
                fields: fieldSearch.items, 
                vendors: vendorSearch.items, 
                verticals: verticalSearch && verticalSearch.items ? verticalSearch.items : [],
                universalFields: universalSearch && universalSearch.items ? universalSearch.items : []
            })
        }
        fetchData()
    }, [])

    useEffect(() => {
        getVerticalDefinitions()
    },[verticalSelected] )

    useEffect(() => {
        props.handleAddUniversalSettings(universalSettings)
    }, [universalSettings])

    useEffect(() => {
        props.handleAddSettings(verticalSettings)
    }, [verticalSettings])

    useEffect(() => {
        props.handleAddDeliverySettings(deliverySettings)
    },[deliverySettings])

    const getVerticalDefinitions = async () => {
        const get = await verticalFieldDefinition('', 'mapping', { 'vertical_id': verticalSelected})
        setFields(get)
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

    const handleDataMap = e => {

    }


    const handleDataMapInput = (e,idx) => {
        setVerticalSettings({...verticalSettings,  [verticalSelected]: {
            ...verticalSettings[verticalSelected],
            'currentField' : e.target.name,
            'mappedField': e.target.value,
            vertical: verticalSelectedName,
            vertical_id: verticalSelected
       }})
    }

    const handleDataMapUniversalInput = (e, idx) => {
        setUniversalSettings({...universalSettings,  [verticalSelected]: {
            ...universalSettings[verticalSelected],
            'currentField' : e.target.name,
            'mappedField': e.target.value,
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
        setModal(false)
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
            <FieldModal 
                toggle={toggle}
                modal={modal}
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
                {/* <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === 'fixed' })}
                        onClick={() => { toggle('fixed'); }}
                    >
                        Universal fields
                    </NavLink>
                </NavItem> */}
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
                </Nav>  
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="vertical">
                        <div style={{padding: "20px"}}>
                        <EditVerticalFields 
                            fields={props.fields}
                            handleDataMapInput={props.handleDataMapInput}
                        />
                        </div>
                    </TabPane>
                    <TabPane tabId="fixed">
                        <div style={{padding: "20px"}}>
                        <UniversalFieldDisplay 
                            data={props.data}
                            handleDataMapUniversalInput={props.handleDataMapUniversalInput}
                        />
                        </div>
                    </TabPane>
                    <TabPane tabId="custom">
                        <div style={{padding: "20px"}}>
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
                        <EditDelivery
                            handleDeliveryInput={props.handleDeliveryInput}
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

const UniversalFieldDisplay = props => {
    return(
        <div>
            {Object.keys(props.data.universalFields).map((items,idx) => 
                <Row key={idx}>     
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
    return(
    <div>
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
                </Row>     
            )}
    </div> 
    )
}


const EditDelivery = props => {
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
        <option value="json">Email</option>
        </Input>
    </FormGroup>
    </Form>
    )
}