import React, { Component } from 'react'
import { vendors } from '../util/db'
import Select from 'react-select'
import { Link } from 'react-router-dom'
import countryList from 'react-select-country-list'
import { 
    TabContent, 
    TabPane, 
    Nav, 
    NavItem, 
    NavLink, 
    Card,  
    CardTitle, 
    CardText, 
    Row, 
    Col, 
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    Form, 
    FormGroup, 
    Label, 
    Input, 
    FormText ,
    CardBody,
    Breadcrumb,
    BreadcrumbItem
} from 'reactstrap';
import ReactTable from 'react-table'
import FoldableTableHOC from "react-table/lib/hoc/foldableTable";
import 'react-table/react-table.css'
import { CSVLink } from "react-csv";

const FoldableTable = FoldableTableHOC(ReactTable);


export default class Vendor extends Component {

    state = {
        data: [],
        pages: 1,
        total: 0,
        perPage: 20,
        display: true,
        vendorModal: false,
        update: {},
        updateModal: false,
        loading: true,
    }

    componentDidMount = async () => {
       return this.viewVendors('', 'search', '')
    }

    viewVendors = async (content, type, params, status) => {
        const results = await vendors(content, type, params)
        const { items, _meta } = results || []
        this.setState({
            data: items,
            pages: _meta ? _meta.pageCount : -1,
            total: _meta ? _meta.totalCount : 0,
            perPage: _meta ? _meta.perPage : 20,
            loading: false
        })
    }

    updateDisplay = () => {
        this.setState(prevState => ({
            display: !prevState.display
        }));
    }

    handleChange = e => {
        const vendorFormData= this.state.vendorFormData
        vendorFormData[e.target.name] = e.target.value
        this.setState({
            vendorFormData
        }) 
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
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        vendorFormData["post_key"] = uuid
        this.setState({
           vendorFormData
        })
    }

    handleNewVendor = async e => {
        e.preventDefault()
        const data = this.state.vendorFormData
        const add = await vendors(data, 'add')
        if(add){
            this.viewVendors('', 'search', '')
            data["post_key"] = ''
            this.setState({
                display: true,
                data
            })
        } else {
            alert('error')
        }
     }

     toggleVendorModal = () => {
        this.setState(prevState => ({
            vendorModal: !prevState.vendorModal
        }))
    }  

    handleUpdateModal = (e, data) => {
        e.preventDefault()
        this.setState({
            updateModal: true,
            update: data
        })
    }

    handleUpdateChange = e => {
        const update = this.state.update
        update[e.target.name] = e.target.value
        this.setState({
            update
        })
    }

    toggleUpdateModal = () => {
        this.setState(prevState => ({
            updateModal: !prevState.updateModal
        }))
    } 

    handleUpdateVendor = () => {

    }

    handleDelete = async (e, content) => {
        e.preventDefault()
    }

    vendorDisplay = row => {
        this.props.history.push(`/vendor/${row.original.id}`)
    }

    

    render(){
        const { data, vendorModal, vendorFormData, update, updateModal, loading } = this.state
        return(
            <div >
                <div>
                    <Breadcrumb>
                        <BreadcrumbItem active>Vendors</BreadcrumbItem>
                    </Breadcrumb>
                </div>
                 <div className="d-flex justify-content-end" style={{marginBotton: "30px"}}>
                 <CSVLink 
                    data={data || []}
                    filename={`vendor-dataexport${Date.now()}.csv`}
                    className="btn btn-primary"
                    target="_blank"
                    style={{marginRight: "20px"}}
                >
                    Export data
                </CSVLink>
                    <Link className="btn btn-primary" to="/vendor/new">New Vendor</Link>
                </div>  
                <br />
                <Card>
                    <CardBody>
                        <Display
                            data={data}
                            vendorDisplay={this.vendorDisplay}
                            loading={loading}
                        />
                    </CardBody>
                </Card>        
                {/* <VendorAddForm
                    handleChange={this.handleChange}
                    vendorFormData={vendorFormData}
                    generatePostKey={this.generatePostKey}
                    handleClose={this.updateDisplay}
                    handleNewVendor={this.handleNewVendor}
                    toggleVendorModal={this.toggleVendorModal}
                    vendorModal={vendorModal}
                />
                 <VendorUpdateForm
                    data={update}
                    handleUpdateFormChange={this.handleUpdateFormChange}
                    handleUpdateChange={this.handleUpdateChange} 
                    handleUpdateVendor={this.handleUpdateVendor}
                    vendorUpdateModal={updateModal}
                    toggleVendorUpdateModal={this.toggleUpdateModal}
                />
                <div className="table-responsive">
            <table className="table table-hover"  style={{backgroundColor: "white"}}>
      <thead>
        <tr>
            <th scope="col">Name</th>
            <th scope="col">Approved</th>
            <th scope="col">Lead Price</th>
            <th scope="col">Blocked</th>
            <th scope="col">Timestamp</th>
            <th scope="col">Options</th>
        </tr>
        </thead>
        <tbody>  
            {Object.keys(data).map((items, idx) => 
                <tr key={idx}>
                    <td>{data[items].name}</td>
                    <td>{data[items].approved === 1 ? "true" : "false"}</td>
                    <td>{data[items].lead_price}</td>
                    <td>{data[items].blocked === 1 ? "true" : "false"}</td>
                    <td>{data[items].timestamp}</td>
                    <td>
                        <button className="btn btn-primary" onClick={(e) => this.vendorDisplay(data[items].id)}>View</button>{' '} 
                        <button className="btn btn-warning" onClick={(e) => this.handleUpdateModal(e, data[items])}>Edit</button>{' '}
                        <button className="btn btn-danger" onClick={(e) => this.handleDelete(e, data[items])}>Delete</button>  
                    </td> 
                </tr>    
            )}
        </tbody>    
    </table>
    </div>  */}
            </div>   
        )
    }
}

const Display = ({data , vendorDisplay, loading }) => (
    <FoldableTable
    data={data}
    columns={
        [{
            Header: "Company Name",
            accessor: "company_name",
            foldable: true
        },{
            Header: "Lead Price",
            accessor: "lead_price",
            foldable: true
        },{
            Header: "First Name",
            accessor: "firstname",
            foldable: true
        },{
            Header: "Last Name",
            accessor: "lastname",
            foldable: true
        },{
            Header: "State",
            accessor: "state",
            foldable: true 
        },{
            Header: "Sell type",
            accessor: "sell_type",
            foldable: true    
        },{
            Header: "Approved",
            accessor: "approved",
            foldable: true  
        }
    ]
    }
    pageSize={data ? data.length : 20}
    loading={loading}
    filterable={true}
    getTrProps={(state, rowInfo) => ({
        onClick: () => vendorDisplay(rowInfo)
    })}
    className="-highlight"
/>
)



const VendorAddForm = ({  handleChange, vendorFormData, generatePostKey, handleClose, handleNewVendor, vendorModal, toggleVendorModal }) => {
    return(
    <Modal isOpen={vendorModal} toggle={toggleVendorModal} className="modal-xl">
    <ModalBody>    
        <Form inline>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Label className="mr-sm-2">Post Key</Label>
            <Input type="text" name="post_key" value={vendorFormData.post_key} />{ ' ' }
        </FormGroup> 
        <button className="btn btn-primary" onClick={(e) => generatePostKey(e)}>Generate Post Key</button>
        </Form>
        <br />
        <Form> 
        <Row>
        <Col>
        <FormGroup>
            <Label>Name/Company Name</Label>
            <Input type="text" name="name" onChange={(e) => handleChange(e)}  />
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
            <Label>Price</Label>
            <Input type="text" name="lead_price" onChange={(e) => handleChange(e)}  />
        </FormGroup> 
        <FormGroup>
            <Label>Approved</Label>
            <Input type="select" name="payment" onChange={(e) => handleChange(e)}>
            <option value="1">True</option>
            <option value="0">False</option>
          </Input>
        </FormGroup>
        <FormGroup>
        <Label>Required to Ping</Label>
        <Input type="select" name="ping_required" onChange={(e) => handleChange(e)}>
        <option value="1">True</option>
        <option value="0">False</option>
      </Input>
        </FormGroup>
        </Col>
        <Col>
        <FormGroup>
            <Label>First Name</Label>
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
    <option value="" selected="selected">State</option>
        <option value="AL">Alabama</option>
        <option value="AK">Alaska</option>
        <option value="AZ">Arizona</option>
        <option value="AR">Arkansas</option>
        <option value="CA">California</option>
        <option value="CO">Colorado</option>
        <option value="CT">Connecticut</option>
        <option value="DE">Delaware</option>
        <option value="DC">District Of Columbia</option>
        <option value="FL">Florida</option>
        <option value="GA">Georgia</option>
        <option value="HI">Hawaii</option>
        <option value="ID">Idaho</option>
        <option value="IL">Illinois</option>
        <option value="IN">Indiana</option>
        <option value="IA">Iowa</option>
        <option value="KS">Kansas</option>
        <option value="KY">Kentucky</option>
        <option value="LA">Louisiana</option>
        <option value="ME">Maine</option>
        <option value="MD">Maryland</option>
        <option value="MA">Massachusetts</option>
        <option value="MI">Michigan</option>
        <option value="MN">Minnesota</option>
        <option value="MS">Mississippi</option>
        <option value="MO">Missouri</option>
        <option value="MT">Montana</option>
        <option value="NE">Nebraska</option>
        <option value="NV">Nevada</option>
        <option value="NH">New Hampshire</option>
        <option value="NJ">New Jersey</option>
        <option value="NM">New Mexico</option>
        <option value="NY">New York</option>
        <option value="NC">North Carolina</option>
        <option value="ND">North Dakota</option>
        <option value="OH">Ohio</option>
        <option value="OK">Oklahoma</option>
        <option value="OR">Oregon</option>
        <option value="PA">Pennsylvania</option>
        <option value="RI">Rhode Island</option>
        <option value="SC">South Carolina</option>
        <option value="SD">South Dakota</option>
        <option value="TN">Tennessee</option>
        <option value="TX">Texas</option>
        <option value="UT">Utah</option>
        <option value="VT">Vermont</option>
        <option value="VA">Virginia</option>
        <option value="WA">Washington</option>
        <option value="WV">West Virginia</option>
        <option value="WI">Wisconsin</option>
        <option value="WY">Wyoming</option>
    </Input>
    </FormGroup>
        <FormGroup>
            <Label>Zipcode</Label>
            <Input type="text" name="zipcode" onChange={(e) => handleChange(e)}  />
        </FormGroup>
        <FormGroup>
            <Label>Phone</Label>
            <Input type="text" name="phone" onChange={(e) => handleChange(e)}  />
        </FormGroup>
        </Col>
        </Row>
        </Form>
        </ModalBody>
      <ModalFooter>
           <button className="btn btn-primary" onClick={(e) => handleNewVendor(e)}>Add</button>{' '}
           <button className="btn btn-secondary" onClick={toggleVendorModal}>Cancel</button>
          </ModalFooter>
    </Modal>   
    )
}

const VendorUpdateForm = ({  
        data,
        handleUpdateChange, 
        handleUpdateVendor, 
        vendorUpdateModal, 
        toggleVendorUpdateModal 
    }) => {
    const { name, username, lead_price, approved, firstname, lastname, address, city, state, zipcode, phone } = data || ''    
    return(
    <Modal isOpen={vendorUpdateModal} toggle={toggleVendorUpdateModal} className="modal-xl">
    <ModalBody>    
        <Form> 
        <Row>
        <Col>
        <FormGroup>
            <Label>Name/Company Name</Label>
            <Input type="text" value={name} name="name" onChange={(e) => handleUpdateChange(e)}  />
        </FormGroup>   
        <FormGroup>
            <Label>UserName</Label>
            <Input type="text" value={username} name="username" onChange={(e) => handleUpdateChange(e)}  />
        </FormGroup> 
        <FormGroup>
            <Label>Password</Label>
            <Input type="text" name="password" placeholder="Old passwords are not shown.  You may only update." onChange={(e) => handleUpdateChange(e)}  />
        </FormGroup>   
        <FormGroup>
            <Label>Price</Label>
            <Input type="text" value={lead_price} name="lead_price" onChange={(e) => handleUpdateChange(e)}  />
        </FormGroup> 
        <FormGroup>
            <Label>Approved</Label>
            <Input type="select" value={approved} name="approved" onChange={(e) => handleUpdateChange(e)}>
            <option value="1">True</option>
            <option value="0">False</option>
          </Input>
        </FormGroup>
        <FormGroup>
            <Label>Required to Ping</Label>
            <Input type="select" name="ping_required" onChange={(e) => handleUpdateChange(e)}>
            <option value="1">True</option>
            <option value="0">False</option>
            </Input>
        </FormGroup>
        </Col>
        <Col>
        <FormGroup>
            <Label>First Name</Label>
            <Input type="text" value={firstname} name="first_name" onChange={(e) => handleUpdateChange(e)}  />
        </FormGroup>   
        <FormGroup>
            <Label>Last Name</Label>
            <Input type="text" value={lastname} name="last_name" onChange={(e) => handleUpdateChange(e)}  />
        </FormGroup> 
        <FormGroup>
            <Label>Address</Label>
            <Input type="textarea" value={address} name="address" onChange={(e) => handleUpdateChange(e)}  />
        </FormGroup>   
        <FormGroup>
            <Label>City</Label>
            <Input type="text" value={city} name="city" onChange={(e) => handleUpdateChange(e)}  />
        </FormGroup>
        <FormGroup>
    <Label for="state">State</Label>
    <Input type="select" value={state} name="state" onChange={(e) => handleUpdateChange(e)}>
    <option value="" selected="selected">State</option>
        <option value="AL">Alabama</option>
        <option value="AK">Alaska</option>
        <option value="AZ">Arizona</option>
        <option value="AR">Arkansas</option>
        <option value="CA">California</option>
        <option value="CO">Colorado</option>
        <option value="CT">Connecticut</option>
        <option value="DE">Delaware</option>
        <option value="DC">District Of Columbia</option>
        <option value="FL">Florida</option>
        <option value="GA">Georgia</option>
        <option value="HI">Hawaii</option>
        <option value="ID">Idaho</option>
        <option value="IL">Illinois</option>
        <option value="IN">Indiana</option>
        <option value="IA">Iowa</option>
        <option value="KS">Kansas</option>
        <option value="KY">Kentucky</option>
        <option value="LA">Louisiana</option>
        <option value="ME">Maine</option>
        <option value="MD">Maryland</option>
        <option value="MA">Massachusetts</option>
        <option value="MI">Michigan</option>
        <option value="MN">Minnesota</option>
        <option value="MS">Mississippi</option>
        <option value="MO">Missouri</option>
        <option value="MT">Montana</option>
        <option value="NE">Nebraska</option>
        <option value="NV">Nevada</option>
        <option value="NH">New Hampshire</option>
        <option value="NJ">New Jersey</option>
        <option value="NM">New Mexico</option>
        <option value="NY">New York</option>
        <option value="NC">North Carolina</option>
        <option value="ND">North Dakota</option>
        <option value="OH">Ohio</option>
        <option value="OK">Oklahoma</option>
        <option value="OR">Oregon</option>
        <option value="PA">Pennsylvania</option>
        <option value="RI">Rhode Island</option>
        <option value="SC">South Carolina</option>
        <option value="SD">South Dakota</option>
        <option value="TN">Tennessee</option>
        <option value="TX">Texas</option>
        <option value="UT">Utah</option>
        <option value="VT">Vermont</option>
        <option value="VA">Virginia</option>
        <option value="WA">Washington</option>
        <option value="WV">West Virginia</option>
        <option value="WI">Wisconsin</option>
        <option value="WY">Wyoming</option>
    </Input>
    </FormGroup>
        <FormGroup>
            <Label>Zipcode</Label>
            <Input type="text" value={zipcode} name="zipcode" onChange={(e) => handleUpdateChange(e)}  />
        </FormGroup>
        <FormGroup>
            <Label>Phone</Label>
            <Input type="text" value={phone} name="phone" onChange={(e) => handleUpdateChange(e)}  />
        </FormGroup>
        </Col>
        </Row>
        </Form>
        </ModalBody>
      <ModalFooter>
           <button className="btn btn-primary" onClick={(e) => handleUpdateVendor(e)}>Update</button>{' '}
           <button className="btn btn-secondary" onClick={toggleVendorUpdateModal}>Cancel</button>
          </ModalFooter>
    </Modal>   
    )
}

function generateUUID()
{
	var d = new Date().getTime();
	
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

return uuid;
}