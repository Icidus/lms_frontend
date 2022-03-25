import React, { Component } from 'react'
import { Form, 
    FormGroup, 
    Label, 
    Input, 
    Button,     
    Card,
    CardBody,
    CardHeader, } from 'reactstrap'
import { state } from '../static/states'
import Alerts from '../controller/alerts'
import { vendors, vertical } from '../util/db'
import Select from 'react-select'
import countryList from 'react-select-country-list'

export default class VendorNew extends Component {
    state = {
        vendorFormData: {
            company_name: '',
            username: '',
            password: '',
            lead_price: '',
            approved: 1,
            first_name: '',
            last_name: '',
            address: '',
            city: '',
            state: '',
            country: '',
            zipcode: '',
            home_phone: '',
            work_phone: '',
            cell_phone: '',
            blocked: 0,
            post_key: '',
            sell_type: '',
            percentage: '',
            ping: 0,
            email: '',
            selectedVerticals: [],
            sell_response: 'system'
        },
        verticals: [],
    }

    componentDidMount =  () => {
        this.viewAllVerticals()
    }

    generatePostKey = (e) => {
        e.preventDefault()
        const vendorFormData= this.state.vendorFormData
        let d = new Date().getTime();
        if( window.performance && typeof window.performance.now === "function" )
        {
            d += performance.now();
        }
        
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
        {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c === 'x' ? r : (r&0x3|0x8)).toString(16);
        });
        vendorFormData["post_key"] = uuid
        this.setState({
           vendorFormData
        })
    }

    handleChange = e => {
        const vendorFormData= this.state.vendorFormData
        vendorFormData[e.target.name] = e.target.value
        this.setState({
            vendorFormData
        }) 
    }

    handleFormSubmit = async e => {
        e.preventDefault()
        const { vendorFormData } = this.state
        if(vendorFormData && vendorFormData.post_key !== '' && vendorFormData.first_name !== '' && vendorFormData.sell_type !== '' && vendorFormData.email !== '') {
            const add = await vendors(vendorFormData, 'add')
            if(add && add["code"] === 201){
                Alerts.success('New vendor successfully created')
                this.props.history.push('/vendor')
            } else {
                Alerts.error(add)
            }
        } else {
            const error = {
                name: 'Required fields missing',
                message: 'You are missing some required fields.  Please review the list'
            }
            Alerts.error(error)
        }    
    }

    viewAllVerticals = async () => {
        const results = await vertical()
        const { items } = results || []
        this.setState({
            verticals: items
        })
    }

    handleMultiChange = (data, name) => {
        let id = []
        Object.keys(data).map(items =>
            id.push(data[items].value)
        )
        const vendorFormData = this.state.vendorFormData
        vendorFormData["selectedVerticals"] = id
        this.setState({
            vendorFormData
        })
    }

    handleCountry = item => {
        const vendorFormData= this.state.vendorFormData
        vendorFormData['country'] = item.value
        this.setState({
            vendorFormData
        }) 
    }


    render(){
        const { vendorFormData, verticals } = this.state
        return(
            <div>
                <Card>
                    <CardHeader>
                        New Vendor Form
                    </CardHeader>
                    <CardBody>    
                        <NewVendorForm
                            vendorFormData={vendorFormData}
                            generatePostKey={this.generatePostKey}
                            handleChange={this.handleChange}
                            handleFormSubmit={this.handleFormSubmit}
                            verticals={verticals}
                            handleMultiChange={this.handleMultiChange}
                            addVerticals={this.addVerticals}
                            handleCountry={this.handleCountry}
                        />
                    </CardBody>
                </Card>        
            </div>    
        )
    }
}



const NewVendorForm = ({ vendorFormData, generatePostKey, handleChange, handleFormSubmit, handleAddBuyerFormChange, verticals, handleMultiChange, addVerticals, handleCountry }) => {
    const verticalArray = verticals ? Object.keys(verticals).map(items => ({
        value: verticals[items].id,
        label: verticals[items].label
    })) : {}
   
    return(
   <div> 
    <h4>Post Key<br /><small>A post key is required and must be generated using the button below</small></h4>
    <p style={{marginTop: "20px", marginBottom: "20px"}}>
        <strong>{vendorFormData.post_key !== '' ? vendorFormData.post_key : "xxxxxxxxxxxxxxxxxxxxxxxxxx"}</strong>
        </p>
    {/* <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
        
        <Label className="mr-sm-2">Post Key  *required</Label>
        <Input type="text" name="post_key" value={vendorFormData.post_key} />{ ' ' }
    </FormGroup>  */}
    <Button className="btn btn-primary" onClick={(e) => generatePostKey(e)}>Generate Post Key</Button>
    <br />
    <br />
    <Form onSubmit={(e) => handleFormSubmit(e)}>
    <FormGroup>
        <Label>Name/Company Name</Label>
        <Input type="text" name="company_name" onChange={(e) => handleChange(e)}  />
    </FormGroup>  
    <FormGroup>
        <Label>Add Verticals this vendor can use to ping/post to</Label>
        {Object.keys(verticalArray).length ? <Select
            onChange={(e) => handleMultiChange(e, 'selectedVerticals')}
            options={verticalArray}
            isMulti
            closeMenuOnSelect={false}
        /> : ''}
    </FormGroup> 
    <FormGroup>
        <Label>UserName</Label>
        <Input type="text" name="username" onChange={(e) => handleChange(e)}  />
    </FormGroup> 
    <FormGroup>
        <Label>Password</Label>
        <Input type="text" name="password" onChange={(e) => handleChange(e)}  />
    </FormGroup>  
    <FormGroup>
        <Label>Sell Type *required</Label>
        <Input type="select" name="sell_type" onChange={(e) => handleChange(e)}>
        <option value="">Choose sell type...</option>
        <option value="fixed">Fixed</option>
        <option value="margin">Margin</option>
        </Input>
    </FormGroup> 
    <FormGroup>
        <Label>Sell response <br /><small>This will indicate what information the vendor will see when the sell a lead.  Server will send a response based on whether the server accepts the lead or rejects it.  Buyer will cycle through all potential buyers and send a response based on whether the lead was sold or not</small></Label>
        <Input type="select" name="sell_response" onChange={(e) => handleChange(e)}>
        <option value="">Choose sell response...</option>
        <option value="server">Server</option>
        <option value="buyer">Buyer</option>
        </Input>
    </FormGroup> 
    {vendorFormData.sell_type === 'fixed' ? 
    <FormGroup>
        <Label>Price</Label>
        <Input type="text" name="lead_price" onChange={(e) => handleChange(e)}  />
    </FormGroup> 
    : vendorFormData.sell_type === 'margin' ?
    <FormGroup>
        <Label>Percentage</Label>
        <Input type="text" name="percentage" onChange={(e) => handleChange(e)}  />
    </FormGroup> 
    : ''}
    <FormGroup>
        <Label>Approved</Label>
        <Input type="select" name="payment" onChange={(e) => handleChange(e)}>
        <option value="">Select one..</option>
        <option value="1">True</option>
        <option value="0">False</option>
      </Input>
    </FormGroup>
    <FormGroup>
        <Label>Required to Ping</Label>
        <Input type="select" name="ping_required" onChange={(e) => handleChange(e)}>
        <option value="">Select one..</option>
        <option value="0">False</option>
        <option value="1">True</option>
      </Input>
    </FormGroup>
    <FormGroup>
        <Label>First Name *required</Label>
        <Input type="text" name="first_name" onChange={(e) => handleChange(e)}  />
    </FormGroup>   
    <FormGroup>
        <Label>Last Name</Label>
        <Input type="text" name="last_name" onChange={(e) => handleChange(e)}  />
    </FormGroup> 
    <FormGroup>
        <Label>Address</Label>
        <Input type="textarea" name="address" onChange={(e) => handleChange(e)}  />
    </FormGroup>   
    <FormGroup>
        <Label>City</Label>
        <Input type="text" name="city" onChange={(e) => handleChange(e)}  />
    </FormGroup>
    <FormGroup>
    <Label for="state">State</Label>
    <Input type="select" name="state" onChange={(e) => handleChange(e)}>
    <option value="">State</option>
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
    <FormGroup>
        <Label>Zipcode</Label>
        <Input type="text" name="zipcode" onChange={(e) => handleChange(e)}  />
    </FormGroup>
    <FormGroup>
        <Label>Work Phone</Label>
        <Input type="text" name="work_phone" onChange={(e) => handleChange(e)}  />
    </FormGroup>
    <FormGroup>
        <Label>Home Phone</Label>
        <Input type="text" name="home_phone" onChange={(e) => handleChange(e)}  />
    </FormGroup>
    <FormGroup>
        <Label>Cell Phone</Label>
        <Input type="text" name="cell_phone" onChange={(e) => handleChange(e)}  />
    </FormGroup>
    <FormGroup>
        <Label>Email *required</Label>
        <Input type="text" name="email" onChange={(e) => handleChange(e)}  />
    </FormGroup> 
    {vendorFormData.email !== '' && vendorFormData.post_key !== ''?
        <Button color="success" onClick={(e) => handleFormSubmit(e)}>Submit</Button>
        : <Button color="secondary">Please add required fields</Button>}
    </Form>
 </div>
 )   
}