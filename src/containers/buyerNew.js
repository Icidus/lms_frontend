import React, { Component } from 'react'
import { 
    Button, 
    Form, 
    FormGroup, 
    Label, 
    Input, 
    FormText,
    TabContent,
    TabPane,
    NavItem, 
    NavLink,
    Row, 
    Col,
    Breadcrumb, 
    BreadcrumbItem,
    Card,
    CardHeader,
    CardBody
} from 'reactstrap';
import Select from 'react-select'
import Alerts from '../controller/alerts'
import countryList from 'react-select-country-list'
import classnames from 'classnames';
import makeAnimated from 'react-select/animated';
import { fieldDefinition, buyers, vertical, vendors, zipcode } from '../util/db'
import { zipcodes } from 'zipcodes'
import { state } from '../static/states'

const animatedComponents = makeAnimated();

const BreadCrumbNavigation = ({ }) => (
    <div style={{backgroundColor: 'white'}}>
      <Breadcrumb>
        <BreadcrumbItem><a href="/buyer">Buyer</a></BreadcrumbItem>
        <BreadcrumbItem active>Add New Buyer</BreadcrumbItem>
      </Breadcrumb>
    </div>
)


export default class NewBuyer extends Component {

    state = {
        username: '',
        password: '',
        company_name: '',
        name: '',
        affiliate: '',
        address: '',
        city: '',
        state: '',
        country: '',
        work_phone: '',
        cell_phone: '',
        contact_email: '',
        mapped_terms: [{ currentField: '', mappedField: ''}],
        ping_url: '',
        post_url: '',
        activeTab: 'data',
        delivery_type: '',
        delivery_language: '',
        response_language: '',
        frequency: '',
        zipcodes: '',
        fields: {},
        mapped: {},
        selectedVerticals: {},
        selectedVendors: {},
        verticals: {},
        vendors: {},
        buyerData: true,
        buyerSettings: true,
        buyerMapping: true,
        buyerZipCodes: true,
        zipCodeList: [],
        zipCodeDistanceList: [],
        zipCodeDistance: '',
        zipCodeDistanceMiles: ''
    }

    componentDidMount =  () => {
        this.viewAllFieldDefinitions()
        this.viewAllVerticals()
        this.viewVendors('', 'search', '')
    }

    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
      }

      viewAllFieldDefinitions = async () => {
        const results = await fieldDefinition()
        const items = results && results.items ? results.items : []
        this.setState({
            fields: items
        })
     }  

    handleAddBuyerFormChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        }, () => {
            console.log(this.state.zipcodes)
        })
    }

    handleCountry = item => {
        this.setState({
            country: item.value
        })
    }

    viewAllVerticals = async () => {
        const results = await vertical()
        const items = results && results.items ? results.items : []
        this.setState({
            verticals: items
        })
    }

    viewVendors = async (content, type, params, status) => {
        const results = await vendors(content, type, params)
        const items = results && results.items ? results.items : []
        this.setState({
            vendors: items
        })
    }

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


    handleMultiChange = (data, name) => {
        let id = []
        Object.keys(data).map(items =>
            id.push(data[items].value)
        )
        this.setState({
            [name] : id
        })
    }

    handleZipcodesByState = async (item) => {
        let data = []
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

    handleZipCodeDistance = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
   }

    handleZipcodeDistanceSubmit = async e => {
        e.preventDefault()
        const results = await zipcode('', 'distance', {'zip': this.state.zipCodeDistance, 'miles': this.state.zipCodeDistanceMiles })
        this.setState(prevState => ({
            zipCodeDistanceList: [...prevState.zipCodeDistanceList, ...results]
        }), () => {
            console.log(this.state.zipCodeDistanceList)
        })
    }

    handleToggle = value => (
        this.setState(prevState => ({
            [value]: !prevState[value]
        }))
    )


     handleSubmit = async e => {
         e.preventDefault()
         const { username, password, company_name } = this.state
         const fields = {
            username: this.state.username,
            password: this.state.password,
            company_name: this.state.company_name,
            name: this.state.name,
            affiliate: this.state.affiliate,
            address: this.state.address,
            city: this.state.city,
            state: this.state.state,
            country: this.state.country,
            work_phone: this.state.work_phone,
            cell_phone: this.state.cell_phone,
            contact_email: this.state.contact_email,
            zipcodes: this.state.zipcodes,
            mapped: this.state.mapped_terms,
            ping_url: this.state.ping_url,
            post_url: this.state.post_url,
            verticals: this.state.selectedVerticals,
            vendors: this.state.selectedVendors,
            delivery_type: this.state.delivery_type,
            delivery_language: this.state.delivery_language,
            response_language: this.state.response_language,
            frequency: this.state.frequency,
            zipCodesState: this.state.zipCodeList,
            zipCodesDistance: this.state.zipCodeDistanceList
         }
         if(username && password && company_name){
         const add = await buyers(fields, 'add')
            if(add){
                Alerts.success('New buyer successfully created')
            }
        } else {
            const errors = {
                name: "Missing fields",
                message: "Please check that you have all the required fields"
            }
            Alerts.error(errors)
        }    

     }


    render(){
        const { activeTab, country, fields, verticals, vendors, mapped_terms, buyerData, buyerMapping, buyerSettings, buyerZipCodes } = this.state
        return(
            <Form>
                <div className="d-flex justify-content-end" style={{marginBotton: "30px"}}>
                    <Button onClick={(e) => this.handleSubmit(e)} color="success">Add New Buyer</Button>
                </div>    
                <br />
                <div>
                    <CardBuyerData
                        handleAddBuyerFormChange={this.handleAddBuyerFormChange}
                        country={country}
                        handleCountry={this.handleCountry}
                        buyerData={buyerData}
                        handleToggle={this.handleToggle}
                    />
                    <CardMappingData 
                        fields={fields}
                        addAdditional={this.addAdditional}
                        mapped_terms={mapped_terms}
                        handleAddAdditionalChangeSelect={this.handleAddAdditionalChangeSelect} 
                        handleAddAdditionalChangeInput={this.handleAddAdditionalChangeInput}
                        buyerMapping={buyerMapping}
                        handleToggle={this.handleToggle}
                    />
                    <CardSettingsData
                        handleAddBuyerFormChange={this.handleAddBuyerFormChange} 
                        verticals={verticals} 
                        vendors={vendors} 
                        handleMultiChange={this.handleMultiChange}
                        buyerSettings={buyerSettings}
                        handleToggle={this.handleToggle}
                    />
                    <CardZipCodeData
                        handleZipcodesByState={this.handleZipcodesByState}
                        buyerZipCodes={buyerZipCodes}
                        handleToggle={this.handleToggle}
                        handleZipCodeDistance={this.handleZipCodeDistance}
                        handleZipcodeDistanceSubmit={this.handleZipcodeDistanceSubmit}
                        handleAddBuyerFormChange={this.handleAddBuyerFormChange}
                    />
                </div>
          </Form>  
        )
    }
}

const CardBuyerData = ({ handleAddBuyerFormChange, country, handleCountry, buyerData, handleToggle }) => (
<Card>
    <CardHeader>
        <h2 className="mb-0">
            <button className="btn btn-link" type="button">
                {buyerData 
                    ? <span onClick={() => handleToggle('buyerData')}>[Collapse]</span> 
                    : <span onClick={() => handleToggle('buyerData')}>[Expand]</span> 
                } Buyer Data
            </button>
        </h2>
    </CardHeader>  
    {buyerData ?
    <CardBody>  
    <NewBuyerForm
            handleAddBuyerFormChange={handleAddBuyerFormChange }
            country={country}
            handleCountry={handleCountry}
        />
    </CardBody>
    : ''}
</Card>
)

const CardMappingData = ({ 
    fields, 
    addAdditional, 
    mapped_terms, 
    handleAddAdditionalChangeSelect,  
    handleAddAdditionalChangeInput,
    buyerMapping,
    handleToggle
}) => (
<Card>
    <CardHeader>
        <h2 className="mb-0">
            <button className="btn btn-link" type="button">
            {buyerMapping
                    ? <span onClick={() => handleToggle('buyerMapping')}>[Collapse]</span> 
                    : <span onClick={() => handleToggle('buyerMapping')}>[Expand]</span> 
                }
                Buyer Mapping
            </button>
        </h2>
    </CardHeader>
    {buyerMapping ?      
    <CardBody>  
    <BuyerMappingForm  
        fields={fields}
        addAdditional={addAdditional}
        additionalQueryTerms={mapped_terms}
        handleAddAdditionalChangeSelect={handleAddAdditionalChangeSelect}
        handleAddAdditionalChangeInput={handleAddAdditionalChangeInput}
    />
    </CardBody>
    : ''}
</Card>  
)

const CardSettingsData = ({handleAddBuyerFormChange, verticals, vendors, handleMultiChange, buyerSettings, handleToggle}) => (
<Card>
    <CardHeader>
        <h2 className="mb-0">
            <button className="btn btn-link" type="button">
            {buyerSettings
                    ? <span onClick={() => handleToggle('buyerSettings')}>[Collapse]</span> 
                    : <span onClick={() => handleToggle('buyerSettings')}>[Expand]</span> 
                }
                Buyer Settings
            </button>
        </h2>
    </CardHeader>
    {buyerSettings ?
    <CardBody>  
    <NewBuyerSettings
        handleAddBuyerFormChange={handleAddBuyerFormChange }
        verticals={verticals}
        vendors={vendors}
        handleMultiChange={handleMultiChange}
    />
    </CardBody>
    : ''}
</Card>     
)

const CardZipCodeData = ({ handleZipcodesByState, buyerZipCodes, handleToggle, handleZipcodeDistanceSubmit, handleZipCodeDistance, handleAddBuyerFormChange }) => (
    <Card>
    <CardHeader>
        <h2 className="mb-0">
            <button className="btn btn-link" type="button">
            {buyerZipCodes 
                    ? <span onClick={() => handleToggle('buyerZipCodes')}>[Collapse]</span> 
                    : <span onClick={() => handleToggle('buyerZipCodes')}>[Expand]</span> 
                }
                Buyer Zipcodes
            </button>
        </h2>
    </CardHeader>  
    {buyerZipCodes ?
    <CardBody>  
    <NewBuyerZipCodes 
        handleZipcodesByState={handleZipcodesByState}
        handleZipCodeDistance={handleZipCodeDistance}
        handleZipcodeDistanceSubmit={handleZipcodeDistanceSubmit}
        handleAddBuyerFormChange={handleAddBuyerFormChange}
    />
    </CardBody>
    : ''}
</Card> 
)

const NewBuyerZipCodes = ({ handleZipcodesByState, handleZipcodeDistanceSubmit, handleZipCodeDistance,handleAddBuyerFormChange  }) => (
    <div>
        <NewBuyerZipCodesState 
            handleZipcodesByState={handleZipcodesByState}
        />
        <br />
        <NewBuyerZipCodesDistance 
            handleZipCodeDistance={handleZipCodeDistance}
            handleZipcodeDistanceSubmit={handleZipcodeDistanceSubmit}
        />
        <br />
        <NewBuyerZipCodesList
            handleAddBuyerFormChange={handleAddBuyerFormChange}
        />
    </div>    
)

const NewBuyerZipCodesDistance = ({ handleZipcodeDistanceSubmit, handleZipCodeDistance }) => (
    <Form onSubmit={(e) => handleZipcodeDistanceSubmit(e)}>
        <Label>All zipcodes by distance</Label>
        <Row>
            <Col>
                <FormGroup>
                    <Input onChange={(e) => handleZipCodeDistance(e)} type="text" name="zipCodeDistance" />
                </FormGroup>  
            </Col>
            <Col>
                <FormGroup>
                    <Input onChange={(e) => handleZipCodeDistance(e)} type="text" name="zipCodeDistanceMiles" />
                </FormGroup>  
            </Col>
            <Col>
                <Button color="success">Submit</Button>
            </Col>
        </Row>      
    </Form>    
)

const NewBuyerZipCodesList = ({ handleAddBuyerFormChange }) => (
    <Form>
        <FormGroup>
            <Label>Zipcodes - list</Label>
                <Input 
                    type="textarea" 
                    name="zipcodes" 
                    onChange={(e) => handleAddBuyerFormChange(e)} />
        </FormGroup>
    </Form>    
)

const NewBuyerZipCodesState = ({handleZipcodesByState }) => {
    const stateArray = Object.keys(state).map(items => ({
        value: items,
        label: state[items]
    }))

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
                            components={animatedComponents}
                            closeMenuOnSelect={false}
                        /> 
                    : ''}
            </FormGroup>
        </Form>
    )     
}




const NewBuyerSettings = ({ handleAddBuyerFormChange, verticals, handleChange, vendors, handleMultiChange }) => {
    const verticalArray = verticals ? Object.keys(verticals).map(items => ({
        value: verticals[items].id,
        label: verticals[items].label
    })) : {}

    const vendorArray = vendors ? Object.keys(vendors).map(items => ({
        value: vendors[items].id,
        label: vendors[items].name
    })) : {}

    return(
    <Form>
        <Row>
            <Col>
    <FormGroup>
        <Label for="ping_url">Ping URL</Label>
        <Input type="text" name="ping_url" placeholder="Ping Url" onChange={(e) => handleAddBuyerFormChange(e)} />
    </FormGroup>
    <FormGroup>
        <Label for="post_url">Post URL</Label>
        <Input type="text" name="post_url" placeholder="Post Url" onChange={(e) => handleAddBuyerFormChange(e)} />
    </FormGroup>
    <FormGroup>
        <Label for="delivery">Delivery Type</Label>
        <Input type="select"  name="delivery_type"  onChange={(e) => handleAddBuyerFormChange(e)} >
        <option value="" selected="selected">Select Delivery Type...</option>
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        </Input>
    </FormGroup>
    <FormGroup>
        <Label for="delivery">Delivery Language</Label>
        <Input type="select"  name="delivery_language"  onChange={(e) => handleAddBuyerFormChange(e)} >
        <option value="" selected="selected">Select Delivery Language...</option>
        <option value="xml">XML</option>
        <option value="json">JSON</option>
        <option value="json">Email</option>
        </Input>
    </FormGroup>
    <FormGroup>
        <Label for="delivery">Response Language</Label>
        <Input type="select"  name="response_language"  onChange={(e) => handleAddBuyerFormChange(e)} >
        <option value="" selected="selected">Select Response Language...</option>
        <option value="xml">XML</option>
        <option value="json">JSON</option>
        <option value="json">Email</option>
        </Input>
    </FormGroup>
    </Col>
    <Col>
    {/* <FormGroup>
        <Label>Verticals</Label>
        {Object.keys(verticalArray).length ? <Select
            onChange={(e) => handleMultiChange(e, 'selectedVerticals')}
            options={verticalArray}
            isMulti
            components={animatedComponents}
            closeMenuOnSelect={false}
        /> : ''}
    </FormGroup> */}
    <FormGroup>
        <Label>Preferred Vendors</Label>
        {Object.keys(vendorArray).length ? <Select
            onChange={(e) => handleMultiChange(e, 'selectedVendors')}
            options={vendorArray}
            isMulti
            components={animatedComponents}
            closeMenuOnSelect={false}
        /> : ''}
    </FormGroup>
            </Col>
         </Row>   
    </Form>    
    )
}

const NewBuyerForm = ({ handleAddBuyerFormChange, country, handleCountry }) => (
    <Form>
        <Row>
            <Col>
    <FormGroup>
    <Label for="username">User Name* (required)</Label>
    <Input type="text" name="username" placeholder="Username" required onChange={(e) => handleAddBuyerFormChange(e)} />
    </FormGroup>
    <FormGroup>
    <Label for="password">Password* (required)</Label>
    <Input type="text" name="password" placeholder="Password" required onChange={(e) => handleAddBuyerFormChange(e)} />
    </FormGroup>
    <FormGroup>
    <Label for="username">Company Name* (required)</Label>
    <Input type="text" name="company_name" placeholder="Company Name" required onChange={(e) => handleAddBuyerFormChange(e)} />
    </FormGroup>
    <FormGroup>
    <Label for="name">Name</Label>
    <Input type="text" name="name" placeholder="Name" onChange={(e) => handleAddBuyerFormChange(e)} />
    </FormGroup>
    <FormGroup>
    <Label for="affiliate">Affiliate</Label>
    <Input type="text" name="affiliate" placeholder="affiliate" onChange={(e) => handleAddBuyerFormChange(e)} />
    </FormGroup>
    <FormGroup>
    <Label for="work_phone">Work Phone</Label>
    <Input type="text" name="work_phone" placeholder="Work Phone" onChange={(e) => handleAddBuyerFormChange(e)} />
    </FormGroup>
    <FormGroup>
    <Label for="cell_phone">Cell Phone</Label>
    <Input type="text" name="cell_phone" placeholder="Cell Phone" onChange={(e) => handleAddBuyerFormChange(e)} />
    </FormGroup>
    <FormGroup>
    <Label for="email">Email</Label>
    <Input type="email" name="contact_email" placeholder="Email" onChange={(e) => handleAddBuyerFormChange(e)} />
    </FormGroup> 
    </Col>
    <Col>
    <FormGroup>
    <Label for="address">Address</Label>
    <Input type="textarea" name="address" onChange={(e) => handleAddBuyerFormChange(e)}/>
    </FormGroup>
    <FormGroup>
    <Label for="city">City</Label>
    <Input type="text" name="city" placeholder="City" onChange={(e) => handleAddBuyerFormChange(e)} />
    </FormGroup>
    <FormGroup>
    <Label for="state">State</Label>
    <Input type="select" name="state" onChange={(e) => handleAddBuyerFormChange(e)}>
    <option value="" selected="selected">State</option>
        {Object.keys(state).map(items => 
            <option key={items} value={items}>{state[items]}</option>
        )}
    </Input>
    </FormGroup>
    <FormGroup>
    <Label for="country">Country</Label>
    <Select
        options={countryList().getData()}
        onChange={handleCountry}
    />
    </FormGroup>
    </Col>
    </Row>
</Form>
)


const BuyerMappingForm = ({ 
    handleMapping, 
    fields, 
    handleFieldChange, 
    addAdditional,
    additionalQueryTerms,
    handleAddAdditionalChangeSelect,
    handleAddAdditionalChangeInput
}) => {

return(
<Form>
        <AdditionalQueryTerms
            additionalQueryTerms={additionalQueryTerms}
            addAdditional={addAdditional}
            additionalQueryTerms={additionalQueryTerms}
            handleAddAdditionalChangeSelect={handleAddAdditionalChangeSelect}
            handleAddAdditionalChangeInput={handleAddAdditionalChangeInput}
            fields={fields}
        />  
</Form>  
)  
}

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
