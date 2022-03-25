import React, { 
    Component,   
    useState,
    useEffect,
    useReducer 
} from 'react'

import { vertical, fieldDefinition, verticalFieldDefinition, verticalDuplicateCheck, offer } from '../util/db'
import { 
    TabContent,
    TabPane,
    NavItem, 
    NavLink,
    Nav,
    Row, 
    Col,
    Form, 
    FormGroup, 
    Label, 
    Input, 
    FormText ,
    CustomInput,
    Card,
    CardBody,
    CardHeader,
    Button,
    Breadcrumb,
    BreadcrumbItem
} from 'reactstrap';
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import Alerts from '../controller/alerts'
import Select from 'react-select'

const initialState = {
    vertical: [],
    mapping: [],
    fields: [],
    verticalFields: [],
    verticalSettingsDisplay: true,
    verticalFieldsDisplay: true,
    verticalDisplay: true,
    verticalEdit: false,
    newFields : {
        label: '',
        name: '',
        required: '',
        vertical_id: ''
    },
    duplicate: {
        firstname: 0,
        lastname: 0,
        email: 0,
        phone: 0,
        zipcode: 0,
        timeperiod: "30",
        against: 'all',
        active: 0,
        vertical_id: 0,
        id: 0
     }
}

const Bread = (props) => {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem><Link to="/vertical">Vertical</Link></BreadcrumbItem>
          <BreadcrumbItem active>Edit Vertical</BreadcrumbItem>
        </Breadcrumb>
      </div>
    );
  };

const reducer = (state, action) => {
    switch(action.type){
        case 'ADD_VERTICAL':
            return {
                ...state,
                vertical: action.payload
            }
        case 'EDIT_VERTICAL':
            const { vertical } = state
            const list = vertical.map((item) => (
                {...item, [action.payload.field]: action.payload.value}
            ))
            return {
                ...state,
                vertical: list
            }
        case 'ADD_DUPLICATE':
            return {
                ...state,
                duplicate: action.payload
            }
        case 'EDIT_DUPLICATE':
            return {
                ...state,
                duplicate: action.payload
            }
        case 'ADD_VERTICALFIELDS':
            return {
                ...state,
                verticalFields: action.payload
            } 
       case 'ADD_FIELDS':
            return{
               ...state,
               fields: action.payload 
            }  
        case 'UPDATE_FIELDS':
            return{
                ...state,
                newFields: action.payload
            }      
        case 'ADD_MAPPING':
            return{
                ...state,
                mapping: action.payload
            }         
        default: 
            throw new Error()      
    }
}

function VerticalDisplay(props){
    const [ state, dispatch ] = useReducer(reducer, initialState)
    const [activeTab, setActiveTab] = useState('vertical')
    const [verticalEdit, setVerticalEdit] = useState(false)

    useEffect(() => {
        getVertical()
        getVerticalDuplicates()
        getVerticalFields()
        // getVerticalOffers()
        getAllFields()
        getFields()
    }, []);
    

    const getVertical = async () => {
        const get = await vertical('', 'search', { 'filter[id]': props.match.params.id} )
        const { items } = get || []
        dispatch({ type: 'ADD_VERTICAL', payload: items });
    }

    const getVerticalFields = async () => {
        const get = await vertical('', 'fields', { 'id': props.match.params.id} )
        dispatch({ type: 'ADD_VERTICALFIELDS', payload: get })
    }

    const getAllFields = async () => {
        const get = await fieldDefinition('', 'search')
        const { items } = get || []
        dispatch({ type: 'ADD_FIELDS', payload: items })

    }

    const getFields = async () => {
        const get = await verticalFieldDefinition('', 'mapping', { 'vertical_id': props.match.params.id})
        const { items } = get || []
        dispatch({ type: 'ADD_MAPPING', payload: items })
    }

    const addField = async e => {
        e.preventDefault()
        const add = await fieldDefinition(state.newFields, 'create')
        if(add){
            dispatch({ type: 'UPDATE_FIELDS', payload: {name: '', label: '', required: ''}})
            getFields()
            getVerticalFields()
            getAllFields()
            Alerts.success('New field definition successfully created')
        }    
    }

    const handleFieldAddChange = e => {
        const newFields = state.newFields
        newFields[e.target.name] = e.target.value
        newFields['vertical_id'] = props.match.params.id
        dispatch({ type: 'UPDATE_FIELDS', payload: newFields })
    }

    //Updates the use field
    const updatedVerticalFields = async (e, field_id) => {
        if(e.target.checked === true){
        const data = {
            'vertical_id': props.match.params.id,
            'field_id': field_id,
            'required': 1
        }
            await verticalFieldDefinition(data, 'update')
        } else {
            const data = {
                'vertical_id': props.match.params.id,
                'field_id': field_id, 
                'required': 0
            }
            await verticalFieldDefinition(data, 'update')
        }
        getVerticalFields()
    }

    //Updates post field
    const updatedVerticalPostRequired = async (e, id) => {
        if(e.target.checked === true){
            const data = {
                'vertical_id': props.match.params.id,
                'field_id' : id,
                'required_post': 1,
            }
            const update =  await verticalFieldDefinition(data, 'update-post')
            if(update){  getFields() }
            } else {
                const data = {
                    'vertical_id': props.match.params.id,
                    'field_id' : id,
                    'required_post': 0, 
                }
                const update = await verticalFieldDefinition(data, 'update-post')
                if(update){ getFields() }
            }
            getVerticalFields()   
    }

    //updates required ping
    const updatedVerticalPingRequired = async(e, id) => {
        if(e.target.checked === true){
            const data = {
                'vertical_id': props.match.params.id,
                'field_id' : id,
                'required_ping': 1,
            }
               const update =  await verticalFieldDefinition(data, 'update-ping')
               if(update){  getFields() }
            } else {
                const data = {
                    'vertical_id': props.match.params.id,
                    'field_id' : id,
                    'required_ping': 0, 
                }
                const update = await verticalFieldDefinition(data, 'update-ping')
                if(update){ getFields() }
            }
            getVerticalFields()  
    }

    const addNewField = async e => {
        const data = {
            'vertical_id': props.match.params.id,
            'field_id' : e.value,
            'required': 0,
        }
        const add = await verticalFieldDefinition(data, 'create')
        if(add){ getVerticalFields() }   
    }

    const deleteVerticalField = async (e, id) => {
        const data = {
            'id': id
        }
        const remove = await verticalFieldDefinition(data, 'delete')
        if(remove){ getVerticalFields() }  
    }

    const getVerticalDuplicates = async () => {
        const get = await verticalDuplicateCheck('', 'search', { 'id': props.match.params.id} )
        if(get && get.length){
            dispatch({
                type: 'ADD_DUPLICATE',
                payload: {
                    firstname: get[0].firstname,
                    lastname: get[0].lastname,
                    email: get[0].email,
                    phone: get[0].phone,
                    zipcode: get[0].zipcode,
                    timeperiod: get[0].timeperiod,
                    against: get[0].against,
                    active: get[0].active, 
                    vertical_id: props.match.params.id,
                    id: get[0].id
                }
            })
        }
    }

    const editVertical = (e, index) => {
        dispatch({ type: 'EDIT_VERTICAL', payload: { field: e.target.name, value: e.target.value, index: index}})
    }

    const toggle = tab => {
      if(activeTab !== tab) setActiveTab(tab);
    }

    const toggleVerticalEdit = () => setVerticalEdit(!verticalEdit)

    const editVerticalSave = async e => {
        e.preventDefault()
        const update = await vertical(state.vertical[0], 'update')
        if(update){
            Alerts.success(`Vertical updated successfully`)
            setVerticalEdit(false)
        }    
    }

    const handleDuplicateCheck = e => {
        const data = {
            vertical_id: props.match.params.id,
            id: state.duplicate.id,
            firstname: e.target.name === 'firstname' 
                        ? e.target.checked && e.target.checked === true 
                            ? 1
                            : 0
                        : state.duplicate.firstname,
            lastname: e.target.name === 'lastname' 
                        ? e.target.checked && e.target.checked === true 
                            ? 1
                            : 0 
                        : state.duplicate.lastname,
            email: e.target.name === 'email'
                        ? e.target.checked && e.target.checked === true 
                            ? 1
                            : 0
                        : state.duplicate.email,
            phone: e.target.name === 'phone'
                        ? e.target.checked && e.target.checked === true 
                            ? 1
                            : 0
                        : state.duplicate.phone,
            zipcode: e.target.name === 'zipcode'
                        ? e.target.checked && e.target.checked === true 
                            ? 1
                            : 0
                        : state.duplicate.zipcode,
            timeperiod: e.target.name === 'timeperiod' ? parseInt(e.target.value) : state.duplicate.timeperiod,
            against: e.target.name === 'all' ? 'all' : state.duplicate.against,
            active: e.target.name === 'active' 
                        ? e.target.checked && e.target.checked === true 
                            ? 1
                            : 0
                        : state.duplicate.active,
        }
        dispatch({
            type: 'EDIT_DUPLICATE',
            payload: data
        })
    }

    const handleDuplicateCheckSubmit = async e => {
        e.preventDefault()
        const duplicate = state.duplicate
        if(duplicate && duplicate.vertical_id && duplicate.id !== 0){
            const add = await verticalDuplicateCheck(state.duplicate, 'update')
            if(add){
                Alerts.success(`Duplicate check updates successful`)
            } else {
                const errorMessage = {
                    name: 'Error',
                    message: "There was an error submitting your duplicate checks"
                }
                Alerts.error(errorMessage)
            }
        } else {
            const add = await verticalDuplicateCheck(state.duplicate, 'create')
            if(add){
                Alerts.success(`Duplicate creation successful`)
            } else {
                const errorMessage = {
                    name: 'Error',
                    message: "There was an error creating your duplicate checks"
                }
                Alerts.error(errorMessage)
            }
        }    
    }




    return(
        <div>
            <Bread />
        <Card>
        <CardBody>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'vertical' })}
              onClick={() => { toggle('vertical'); }}
            >
            Vertical
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'settings' })}
              onClick={() => { toggle('settings'); }}
            >
             Settings
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'fields' })}
              onClick={() => { toggle('fields'); }}
            >
             Fields
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="vertical">
            <Card>
                <CardBody>
                    <VerticalFieldsDisplay 
                        editVerticalSave={editVerticalSave}
                        editVertical={editVertical}
                        toggleVerticalEdit={toggleVerticalEdit}
                        verticalEdit={verticalEdit}
                        vertical={state.vertical}
                    />
                </CardBody>
            </Card>     
          </TabPane>
          <TabPane tabId="settings">
             <Card>
                 <CardBody>
                     <VerticalSettingsTab
                        handleDuplicateCheck={handleDuplicateCheck}
                        handleDuplicateCheckSubmit={handleDuplicateCheckSubmit}
                        duplicate={state.duplicate}
                     />
                 </CardBody>
             </Card>        
          </TabPane>
          <TabPane tabId="fields">
            <VerticalFieldTabs
                data={state.verticalFields}
                fields={state.fields}
                addField={addField}
                handleFieldAddChange={handleFieldAddChange}
                updatedVerticalFields={updatedVerticalFields}
                verticalFields={state.verticalFields}
                updatedVerticalPostRequired={updatedVerticalPostRequired}
                updatedVerticalPingRequired={updatedVerticalPingRequired}
                id={props.match.params.id}
                addNewField={addNewField}
                deleteVerticalField={deleteVerticalField}
            />
          </TabPane>
        </TabContent>
        </CardBody>
      </Card>
      </div>
    )
}

const VerticalFieldsDisplay = ({ editVertical, editVerticalSave, vertical, toggleVerticalEdit, verticalEdit}) => (
    <Form onSubmit={(e) => editVerticalSave(e)}>
        {vertical && vertical.length ? vertical.map((items, index) => 
            <dl key={index}>
                {Object.keys(items).map((key) => 
                    <span key={key}>
                        <dt>{key}</dt>
                        {verticalEdit ?
                        <Input type="text" name={key} value={items[key]} onChange={(e) => editVertical(e, index)} />     
                        : <dd>{items[key]}</dd>}
                    </span>    
                )}
            </dl>
        ): ''}
        <Button color="info" onClick={() => toggleVerticalEdit()}>Edit</Button>{' '}
        {verticalEdit ? <Button color="success">Save</Button> : ''}
    </Form>  
)

const VerticalSettingsTab = ({ handleDuplicateCheck, handleDuplicateCheckSubmit, duplicate }) => (
    <div>
        <div style={{paddingTop: "30px"}}>
            <form>
                <FormGroup check>
                    <Label check>
                        <Input 
                            type="checkbox" 
                            name="active" 
                            checked={duplicate.active === 1 ? "checked" : ''}  
                            onChange={(e) => handleDuplicateCheck(e)} 
                        />{' '}
                        Duplicate check on incoming leads
                    </Label>
                </FormGroup>
            </form>  
        </div>
        {duplicate.active === 1 ?
        <div>
            <div style={{paddingTop: "30px"}}>
            <form className="form-inline">
                <span style={{marginRight: "10px"}}>Fields:</span>
                <FormGroup check style={{marginRight: "20px"}}>
                    <Label check>
                        <Input 
                            type="checkbox" 
                            name="firstname" 
                            checked={duplicate.firstname === 1 ? "checked" : false} 
                            onChange={(e) => handleDuplicateCheck(e)} />{' '}
                        First Name
                    </Label>
                </FormGroup> 
                <FormGroup check style={{marginRight: "20px"}}>
                    <Label check>
                        <Input type="checkbox" name="lastname" checked={duplicate.lastname === 1 ? true : false}  onChange={(e) => handleDuplicateCheck(e)} />{' '}
                        Last Name
                    </Label>
                </FormGroup>
                <FormGroup check style={{marginRight: "20px"}}>
                    <Label check>
                        <Input type="checkbox" name="email" checked={duplicate.email === 1 ? true : false} onChange={(e) => handleDuplicateCheck(e)} />{' '}
                        Email
                    </Label>
                </FormGroup>
                {/* <FormGroup check style={{marginRight: "20px"}}>
                    <Label check>
                        <Input type="checkbox" name="phone" checked={duplicate.phone === 1 ? true : false} onChange={(e) => handleDuplicateCheck(e)} />{' '}
                        Phone
                    </Label>
                </FormGroup> */}
                <FormGroup check style={{marginRight: "20px"}}>
                    <Label check>
                        <Input type="checkbox" name="zipcode" checked={duplicate.zipcode === 1 ? true : false} onChange={(e) => handleDuplicateCheck(e)} />{' '}
                        Zipcode
                    </Label>
                </FormGroup>
            </form>  
            </div>
            {/* <div style={{paddingTop: "30px"}}>
                <VerticalSettingsAgainst 
                    handleDuplicateCheck={handleDuplicateCheck}
                    duplicate={duplicate}
                />
            </div> */}
            <div style={{paddingTop: "30px"}}>
                <VerticalSettingsWithin
                    handleDuplicateCheck={handleDuplicateCheck}
                    duplicate={duplicate}
                />
            </div> 
         </div>   
        : ''}     
         <div className="d-flex justify-content-end">
            <button className="btn btn-primary mb-2" onClick={(e) => handleDuplicateCheckSubmit(e)}>Save</button>
        </div>  
    </div>
    
)

export default VerticalDisplay

const CardVerticalOptions = ({ handleDisplayChange}) => (
    <Card>
        <CardHeader>
        <h1 className="display-4 mb-0" style={{fontSize: "20px"}}>Vertical Options</h1>
        </CardHeader> 
        <CardBody>
            <ul className="list-unstyled">
                <li onClick={(e) => handleDisplayChange('vertical')}>Vertical</li>
                <li onClick={(e) => handleDisplayChange('settings')}>Settings</li>
                <li onClick={(e) => handleDisplayChange('field')}>Fields</li>
            </ul>    
        </CardBody>     
    </Card>
)

// const CardVertical = ({
//     vertical, 
//     verticalDisplay, 
//     handleToggle,
//     verticalEdit,
//     toggleVerticalEdit,
//     editVertical,
//     editVerticalSave
// }) => (
//     <Card> 
//     <CardBody>  
//     <VerticalFieldsDisplay 
//         vertical={vertical}
//         verticalEdit={verticalEdit}
//         toggleVerticalEdit={toggleVerticalEdit}
//         editVertical={editVertical}
//         editVerticalSave={editVerticalSave}
//     />
//     </CardBody>
// </Card>
// )

const CardVerticalSettings = ({  
    handleDuplicateCheck, 
    handleDuplicateCheckSubmit, 
    duplicate,
    handleToggle,
    verticalSettingsDisplay
 }) => (
    <Card>
        <CardHeader>
            <h2 className="mb-0">
                <button className="btn btn-link" type="button">
                    {verticalSettingsDisplay 
                        ? <span onClick={() => handleToggle('verticalSettingsDisplay')}>[Collapse]</span> 
                        : <span onClick={() => handleToggle('verticalSettingsDisplay')}>[Expand]</span> 
                    } Vertical Settings
                </button>
            </h2>
        </CardHeader>  
        {verticalSettingsDisplay ?
        <CardBody>  
        <VerticalSettingsTab
            handleDuplicateCheck={handleDuplicateCheck}
            handleDuplicateCheckSubmit={handleDuplicateCheckSubmit}
            duplicate={duplicate}
        />
        </CardBody>
        : ''}
    </Card>
)

const CardFieldSettings = ({  
    mapping,
    addField,
    handleFieldAddChange,
    updatedVerticalFields,
    verticalFields,
    updatedVerticalRequired,
    updatedVerticalPingRequired,
    id,
    fields,
    addNewField,
    handleToggle,
    verticalFieldsDisplay,
    deleteVerticalField
 }) => (
    <Card>
        <CardHeader>
            <h2 className="mb-0">
                <button className="btn btn-link" type="button">
                    {verticalFieldsDisplay
                        ? <span onClick={() => handleToggle('verticalFieldsDisplay')}>[Collapse]</span> 
                        : <span onClick={() => handleToggle('verticalFieldsDisplay')}>[Expand]</span> 
                    } Vertical Fields
                </button>
            </h2>
        </CardHeader>  
        {verticalFieldsDisplay ?
        <CardBody>  
            <VerticalFieldTabs
                data={mapping}
                addField={addField}
                handleFieldAddChange={handleFieldAddChange}
                updatedVerticalFields={updatedVerticalFields}
                verticalFields={verticalFields}
                updatedVerticalRequired={updatedVerticalRequired}
                updatedVerticalPingRequired={updatedVerticalPingRequired}
                id={id}
                fields={fields}
                addNewField={addNewField}
                deleteVerticalField={deleteVerticalField}
            />
        </CardBody>
        : ''}
    </Card>
)

//Display the Vertical and provides options for editing


const VerticalFieldTabs = ({ 
    data, 
    handleFieldAddChange, 
    addField, 
    updatedVerticalFields, 
    verticalFields, 
    updatedVerticalPostRequired,
    updatedVerticalPingRequired,
    id,
    fields,
    addNewField,
    deleteVerticalField
}) => {
    // const selectedFields = verticalFields && verticalFields.length ?
    //     Object.keys(verticalFields).map(set => parseInt(verticalFields[set].field_id))
    //     : ''
    // let required = {}
    //  const requiredFields =  verticalFields && verticalFields.length ?
    //     Object.keys(verticalFields).map(set => 
    //         required[verticalFields[set].id] = parseInt(verticalFields[set].required))
    //  : '' 
    return(
    <div className="table-responsive">
    <br />
    <Row>
        <Col>
            <VerticalFieldForm 
                handleFieldAddChange={handleFieldAddChange}
                addField={addField}
            />
         </Col>
         <Col>   
            <AllFields
                fields={fields}
                addNewField={addNewField}
            />
         </Col>
    </Row>        
    <table className="table table-hover">
      <thead>
        <tr>
            <th scope="col">Label</th>
            <th scope="col">Name</th>
            <th scope="col">Required Post</th>
            <th scope="col">Required Ping</th>
            <th scope="col">Use</th>
            <th scope="col">Remove</th>
        </tr>
      </thead>
      <tbody>  
            {data ? Object.keys(data).map((items, idx) => 
                <tr key={idx}>
                    <td>{data[items].label}</td>
                    <td>{data[items].name}</td>
                    <td>
                        <Input
                            type="checkbox" 
                            checked={data[items].required_post === "1" ? "checked" : ""} 
                            onChange={(e) =>  updatedVerticalPostRequired(e, data[items].field_id)} />
                    </td>
                    <td>
                        <Input
                            type="checkbox" 
                            checked={data[items].required_ping === "1" ? "checked" : ""} 
                            onChange={(e) =>  updatedVerticalPingRequired(e, data[items].field_id)} />
                    </td>
                    <td>
                        <Input
                            type="checkbox" 
                            checked={data[items].required === "1"  ? "checked" : ""} 
                            onChange={(e) => updatedVerticalFields(e, data[items].field_id)} />{' '}
                    </td>
                    <td>
                        <Button color="danger" onClick={e => deleteVerticalField(e, data[items].vertical_field_id)}>Delete</Button>
                    </td>    
                </tr>
            ): <tr><td></td></tr>}
        </tbody>    
    </table>
    </div>
    )
}

const AllFields = ({ fields, addNewField }) => {
    const verticalArray = fields ? Object.keys(fields).map(items => ({
        value: fields[items].id,
        label: fields[items].label
    })) : []

    return(
    <Form>
        <FormGroup>
            {Object.keys(verticalArray).length ? 
                <Select
                    onChange={(e) => addNewField(e)} 
                    options={verticalArray}
                /> 
            : ''}
        </FormGroup>
        {/* <FormGroup>
            <Input onChange={(e) => addNewField(e)} className="form-control mb-2 mr-sm-2" type="select" name="allFields">
                <option>Add a new field to this vertical</option>
                {fields ? Object.keys(fields).map((items, idx) => 
                    <option key={idx} value={fields[items].id}>{fields[items].label}</option>
                ) : ''}
          </Input>
        </FormGroup> */}
    </Form>   
    ) 
}

const VerticalFieldForm = ({ handleFieldAddChange, addField }) => (
    <form className="form-inline">
        <input placeholder="Label Name"  onChange={(e) => handleFieldAddChange(e)} className="form-control mb-2 mr-sm-2" name="label"  />
        <input placeholder="Field Name"  onChange={(e) => handleFieldAddChange(e)} className="form-control mb-2 mr-sm-2" name="name"  /> 
        <button onClick={(e) => addField(e)} className="btn btn-primary mb-2">Add</button>
    </form>
)

const VerticalOffersForm = ({ handleOffer, createOffer }) => (
    <form className="form-inline">
        <input placeholder="Name" onChange={(e) => handleOffer(e)} className="form-control mb-2 mr-sm-2" name="name"  />
        <FormGroup>
            <Input onChange={(e) => handleOffer(e)} className="form-control mb-2 mr-sm-2" type="select" name="status">
            <option>Status</option>
            <option value="1">Active</option>
            <option value="0">InActive</option>
          </Input>
        </FormGroup>
        <FormGroup>
            <Input onChange={(e) => handleOffer(e)} className="form-control mb-2 mr-sm-2" type="select" name="approval">
            <option>Approval</option>
            <option>Requires Approval</option>
            <option>Approved</option>
          </Input>
        </FormGroup>
        <FormGroup>
            <Input onChange={(e) => handleOffer(e)} className="form-control mb-2 mr-sm-2" type="select" name="distribution">
            <option value="price">Price</option>
            <option value="weight">Weight</option>
            <option value="priority">Priority</option>
            <option value="round robin">Round Robin</option>
          </Input>
        </FormGroup> 
        <button onClick={(e) => createOffer(e)} className="btn btn-primary mb-2">Add</button>
    </form>
)

const VerticalOffersTab = ({ data, createOffer, handleOffer, offerDisplay }) => (
    <div className="table-responsive">
    <VerticalOffersForm 
        handleOffer={handleOffer}
        createOffer={createOffer}
    />
    <table className="table table-hover">
      <thead>
        <tr>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col">Approval</th>
            <th scope="col">Distribution</th>
            <th scope="col">Timestamp</th>
        </tr>
      </thead>
      <tbody>  
            {data ? Object.keys(data).map((items, idx) => 
                <tr key={idx}  onClick={() => offerDisplay(data[items].id)}>
                    <td>{data[items].name}</td>
                    <td>{data[items].status === 1 ? 'Active' : 'Inactive'}</td>
                    <td>{data[items].approval}</td>
                    <td>{data[items].distribution}</td>
                    <td>{data[items].timestamp}</td>
                </tr>
            ) : '<tr></tr>'}
        </tbody>    
    </table>
    </div>  
)



const VerticalSettingsAgainst = ({ handleDuplicateCheck, duplicate }) => (
    <form className="form-inline">
    <span style={{marginRight: "10px"}}>Against:</span>
    <FormGroup check style={{marginRight: "20px"}}>
        <Label check>
            <Input type="radio" id="all_radio" name="all" checked={duplicate.against === 'all' ? true : false} onChange={(e) => handleDuplicateCheck(e)} />{' '}
            All leads
        </Label>
    </FormGroup>
</form>  
)

const VerticalSettingsWithin = ({ handleDuplicateCheck, duplicate }) => (
    <form className="form-inline">
    <span style={{marginRight: "10px"}}>Within:</span>
    <FormGroup check style={{marginRight: "20px"}}>
        <Input type="number" name="timeperiod" value={duplicate.timeperiod} placeholder="number of days" onChange={(e) => handleDuplicateCheck(e)}/>
    </FormGroup> 
    </form>   
)