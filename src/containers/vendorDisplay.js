import React, { Component, Fragment } from 'react'
import { Form, FormGroup, Label, Input, Button, Card, CardBody, CardHeader, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { vendors, accounts } from '../util/db'
import { state } from '../static/states'
import Alerts from '../controller/alerts'
import { Link } from 'react-router-dom'
import countryList from 'react-select-country-list'
import Select from 'react-select'
import { NewAccount } from '.';


const Bread = (props) => {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem><Link to="/vendor">Vendor</Link></BreadcrumbItem>
          <BreadcrumbItem active>Edit Vendor</BreadcrumbItem>
        </Breadcrumb>
      </div>
    );
  };

export default class VendorDisplay extends Component {
     state = {
        data: [],
        edit: false,
        account: true
     }

     componentDidMount(){
        this.getVendor()
        this.checkAccount()
     }

     checkAccount = async () => {
        const data = {
            external_id: this.props.match.params.id,
          }
        
        const checkAccount = await accounts(data, 'externalID')
        this.setState({
            account: checkAccount
        })
     }

     getVendor = async () => {
        const get =  await vendors('', 'search', {'filter[id]': this.props.match.params.id})
        this.setState({
            data: get.items
        })
     }

     toggleVendorEdit = () => {
        this.setState(prevState => ({
            edit: !prevState.edit
        }))
    }

    handleChange = (e, index) => {
        const data = this.state.data
        data[0][e.target.name] = e.target.value
        this.setState({
            data: data
        }) 
    }

    handleCountry = item => {
        const data = this.state.data
        data[0]["country"] = item.value
        this.setState({
            data: data
        })
    }

    handleFormSubmit = async e => {
        e.preventDefault()
        const { data } = this.state
        if(data && data.length > 0 && data[0].post_key !== null && data[0].first_name !== null && data[0].sell_type !== null && data[0].email !== null) {
            const add = await vendors(data[0], 'update')
            if(add){
                Alerts.success('Vendor successfully updated')
                this.setState({
                    edit: false
                })
            } else {
                const errorMessage = {
                    name: 'Error',
                    message: "There was an error updating this vendor"
                }
                Alerts.error(errorMessage)
            }
        } else {
            const error = {
                name: 'Required fields missing',
                message: `You are missing some required fields.  Required fields: post_key: ${data.post_key}, first_name: ${data.first_name}, sell_type: ${data.sell_type}, email: ${data.email}`
            }
            Alerts.error(error)
        }   
    }

    generatePostKey = (e) => {
        e.preventDefault()
        const { data } = this.state
        let d = new Date().getTime();
        if( window.performance && typeof window.performance.now === "function" )
        {
            d += performance.now();
        }
        
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
        {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        data[0]["post_key"] = uuid
        this.setState({
           data
        })
    }


    render(){
        const { data, edit, account } = this.state
        console.log(data)
        return(
            <div>
                <Bread />
                <Card>
                    <CardHeader>
                       {edit ? "Edit" : ''} Vendor  - {data && data[0] ? data[0].name : ''}
                    </CardHeader>
                    <CardBody> 
                        <EditVendorForm
                            data={data} 
                            edit={edit}
                            generatePostKey={this.generatePostKey} 
                            handleChange={this.handleChange} 
                            handleFormSubmit={this.handleFormSubmit} 
                            toggleVendorEdit={this.toggleVendorEdit}
                            handleCountry={this.handleCountry}
                            account={account}
                        />
                    </CardBody>
                </Card>        
            </div>    
        )
    }
}

const Display = ({ data, toggleVendorEdit }) => {
    return(
    <div>
    {data && data.length ? data.map((set, index) => 
        <dl key={index}>
            {Object.keys(set).map((key) => 
                <span key={key}>
                    <dt>{key}</dt>
                    <dd>{set[key]}</dd>
                </span>    
            )}
        </dl>
    ) : ''}
         <Button color="info" onClick={() => toggleVendorEdit()}>Edit</Button>{' '}

    </div>
    )
}


const EditVendorForm = ({ 
    data, 
    edit,
    generatePostKey, 
    handleChange, 
    handleFormSubmit,
    toggleVendorEdit,
    handleCountry,
    account
}) => {
    return(
    <div> 
      <div className="alert alert-danger" role="alert">
        <strong>Warning!</strong> Changing the post key could impact vendors posting
      </div>
      <p style={{marginTop: "20px", marginBottom: "20px"}}>
        {data && data.length ? data.map((items, index) => 
            <strong>{items.post_key}</strong> 
        ) :  ""}
    </p>
      <Button className="btn btn-primary" onClick={(e) => generatePostKey(e)}>Generate New Post Key</Button>
        <br />
        <br />
     <Form>
     {data && data.length ? data.map((items, index) => {
            return(
            <Form key={items.id}>
                <FormGroup>
                    <Label>ID</Label>
                    {edit ? <Input name="id" value={items.id} disabled onChange={e => handleChange(e)} /> :<p><strong>{items.id}</strong></p>}
                </FormGroup>  
                {account === false && edit ?  
                <Fragment>
                <FormGroup>
                    <Label>UserName</Label>
                    <Input type="text" name="username" onChange={(e) => handleChange(e)}  />
                </FormGroup> 
                <FormGroup>
                    <Label>Password</Label>
                    <Input type="text" name="password" onChange={(e) => handleChange(e)}  />
                </FormGroup>
                </Fragment>  
                : ''}
                <FormGroup>
                    <Label>Company Name</Label>
                    {edit ? <Input name="company_name" value={items.company_name} onChange={e => handleChange(e)} /> :<p><strong>{items.company_name}</strong></p>}
                </FormGroup>  
                <FormGroup>
                    <Label>Lead Price</Label>
                    {edit ? <Input name="lead_price" value={items.lead_price} onChange={e => handleChange(e)} /> : <p><strong>{items.lead_price}</strong></p>}
                </FormGroup>  
                <FormGroup>
                    <Label>Approved</Label>
                    {edit ? 
                    <Input type="select" name="approved" value={items.approved} onChange={e => handleChange(e)}>
                        <option value="">Select an option</option>
                        <option value="1">Approved</option>
                        <option value="0">Not Approved</option>
                    </Input>   
                    : <p><strong>{items.approved}</strong></p>}
                </FormGroup>  
                <FormGroup>
                    <Label>First Name</Label>
                    {edit ? <Input name="firstname" value={items.firstname} onChange={e => handleChange(e)} /> : <p><strong>{items.firstname}</strong></p>}
                </FormGroup>  
                <FormGroup>
                    <Label>Last Name</Label>
                    {edit ? <Input name="lastname" value={items.lastname} onChange={e => handleChange(e)} /> : <p><strong>{items.lastname}</strong></p>}
                </FormGroup>
                <FormGroup>
                    <Label>Address</Label>
                    {edit ? <Input type="textarea" name="address" value={items.address} onChange={e => handleChange(e)} /> : <p><strong>{items.address}</strong></p>}
                </FormGroup>
                <FormGroup>
                    <Label>City</Label>
                    {edit ? <Input name="city" value={items.city} onChange={e => handleChange(e)} /> : <p><strong>{items.city}</strong></p>}
                </FormGroup>
                <FormGroup>
                    <Label for="state">State</Label>
                    {edit ? 
                    <Input type="select" name="state" value={items.state} onChange={e => handleChange(e)}>
                    <option value="">State</option>
                        {Object.keys(state).map(items => 
                            <option key={items} value={items}>{state[items]}</option>
                        )}
                    </Input>
                    : <p><strong>{items.state}</strong></p>}
                </FormGroup>
                <FormGroup>
                    <Label for="country">Country</Label>
                    {edit ? 
                    <Select
                        options={countryList().getData()}
                        onChange={handleCountry}
                    />
                    : <p><strong>{items.country}</strong></p>}
                </FormGroup>
                <FormGroup>
                    <Label>Zipcode</Label>
                   {edit ?  <Input name="zipcode" value={items.zipcode} onChange={e => handleChange(e)} /> : <p><strong>{items.zipcodee}</strong></p>}
                </FormGroup>
                <FormGroup>
                    <Label>Email</Label>
                    {edit ? <Input name="email" value={items.email} onChange={e => handleChange(e)} /> : <p><strong>{items.email}</strong></p>}
                </FormGroup>
                <FormGroup>
                    <Label>Home Phone</Label>
                    {edit ? <Input name="home_phone" value={items.home_phone} onChange={e => handleChange(e)} /> : <p><strong>{items.home_phone}</strong></p>}
                </FormGroup>
                <FormGroup>
                    <Label>Work Phone</Label>
                    {edit ? <Input name="work_phone" value={items.work_phone} onChange={e => handleChange(e)} /> : <p><strong>{items.work_phone}</strong></p>}
                </FormGroup>
                <FormGroup>
                    <Label>Cell Phone</Label>
                    {edit ? <Input name="cell_phone" value={items.cell_phone} onChange={e => handleChange(e)} /> : <p><strong>{items.cell_phonee}</strong></p>}
                </FormGroup>
                <FormGroup>
                    <Label>Blocked</Label>
                    {edit ?
                    <Input type="select" name="blocked" value={items.blocked} onChange={e => handleChange(e)}>
                        <option value="">Select an option</option>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </Input>
                    : <p><strong>{items.blocked !== null ? items.blocked === 0 ? "No" : "Yes" : ''}</strong></p>}
                </FormGroup>
                <FormGroup>
                    <Label>Sell Type</Label>
                    {edit ?
                    <Input type="select" name="sell_type" value={items.sell_type} onChange={e => handleChange(e)}>
                        <option value="">Select an option</option>
                        <option value="fixed">Fixed</option>
                    </Input>
                    : <p><strong>{items.sell_type}</strong></p>}
                </FormGroup>
                <FormGroup>
                    <Label>Sell Response</Label>
                    {edit ?
                    <Input type="select" name="sell_response" value={items.sell_response} onChange={e => handleChange(e)}>
                        <option value="">Select an option</option>
                        <option value="server">Server</option>
                        <option value="buyer">Buyer</option>
                    </Input>
                    : <p><strong>{items.sell_response}</strong></p>}
                </FormGroup>
                <FormGroup>
                    <Label>Ping Required</Label>
                    {edit ?
                    <Input type="select" name="ping_required" value={items.ping_required} onChange={e => handleChange(e)}>
                        <option value="">Select an option</option>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </Input>
                    : <p><strong>{items.ping_required !== null ? items.ping_required === 0 ? "No" : "Yes" : ""}</strong></p>}
                </FormGroup>
            </Form>        
            // <dl key={index}>
            //     {Object.keys(items).map((key) => 
            //         <span key={key}>
            //             <dt>{key}</dt>
            //             {edit 
            //                 ? <Input 
            //                         type="text" 
            //                         name={key} 
            //                         value={items[key]} 
            //                         onChange={(e) => handleChange(e, index)} 
            //                         disabled={items["timestamp"] ? "disabled" : ''}
            //                     />     
            //                 : <dd>{items[key]}</dd>
            //             }
            //         </span>   
            //     )}
            // </dl>
            )
      }): ''}
     <Button color="info" onClick={() => toggleVendorEdit()}>Edit</Button>{' '}
     <Button color="success" onClick={e => handleFormSubmit(e)}>Submit changes</Button>
     </Form>
  </div>  
    ) 
}