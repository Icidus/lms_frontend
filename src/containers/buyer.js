import React, { Component, useState, useEffect, useReducer } from 'react'
import { buyers, vertical, fieldDefinition } from '../util/db'
import { Link } from 'react-router-dom'
import Select from 'react-select'
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
    FormText,
    Breadcrumb, 
    BreadcrumbItem,
    Button,
    CardBody
} from 'reactstrap';
import classnames from 'classnames';
import ReactTable from 'react-table'
import FoldableTableHOC from "react-table/lib/hoc/foldableTable";
import 'react-table/react-table.css'
import { CSVLink } from "react-csv";

const FoldableTable = FoldableTableHOC(ReactTable);

function Buyer(props){
    const [ data, setData ] = useState([])
    const [ activeTab, setActiveTab ] = useState(['Pending'])
    const [ mapped_terms, setMappedTerms ] = useState([{ currentField: '', mappedField: ''}])
    const [ verticals, setVerticals ] = useState([])
    const [ fields, setFields ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ pages, setPages ] = useState(-1)
    const [ total, setTotal ] = useState(0)
    const [ perPage, setPerPage ] = useState(20)
    const [ sortFilter, setSortFilter ] = useState({
        filter : [],
        sort: [],
        size: 0
    })
    const [ buyerFormData, setBuyerFormData ] = useState({
        name: '',
        billing: "weekly",
        payment: 'postpaid',
        credits: 0,
        username: '',
        password: '',
        contact: {},
        leads: {},
        status: 0,
        zipcodes: '',
        mapped: {},
        ping_url: '',
        post_url: '',
        mapped: []
    })

    useEffect(() => {
        buyerSearch()
    }, []);

    async function buyerSearch(){
        const search = await buyers('', 'search', {'expand' : 'orders' })
        const { items, _meta } = search || []
        setData(items || [])
        setPages(_meta && _meta.pageCount ? _meta.pageCount : 0)
        setTotal(_meta && _meta.totalCount ? _meta.totalCount : 0)
        setPerPage(_meta && _meta.perPage ? _meta.perPage : 0)
        setLoading(false)
    }

    //Handles table page change
    const handlePageChange = () => {

    }

    //Handles filtering of the table
    const handleFilteredChange = (filtered, column) => {
        sortFilter["filter"] = filtered
        setSortFilter(sortFilter)
        handleFilteredSearch(sortFilter)
    }

    //Handles sorting of the table
    const handleSortedChange = (newSorted) => {
        sortFilter["sort"] = newSorted
        setSortFilter(sortFilter)
        handleFilteredSearch(sortFilter)
    }

    //Handles Page Size change
    const handlePageSizeChange = (pageSize, pageIndex) => {
        sortFilter["size"] = pageSize
        setSortFilter(sortFilter)
        handleFilteredSearch(sortFilter)
    }

    //Sends a search filter to the database
    async function handleFilteredSearch(sortFilter, page=1){
        const search = await buyers(sortFilter, 'filter', {
            'page' : page, 
            'expand' : 'orders' 
        })
        const { items, _meta } = search || []
        setData(items)
        setPages(_meta.pageCount)
        setTotal(_meta.totalCount)
        setPerPage(_meta.perPage)
    }

    //Pushes to buyer display record page 
   const handleBuyerDisplay = (rowInfo) => {
        props.history.push(`buyer/${rowInfo.original.id}`)
    }

    const Bread = (props) => {
        return (
          <div>
            <Breadcrumb>
              <BreadcrumbItem active>Buyer</BreadcrumbItem>
            </Breadcrumb>
          </div>
        );
      };
  
    //Handles Lead Display
    return(
        <div>
            <Bread />
            
            <div className="d-flex justify-content-end" style={{marginBotton: "30px"}}>
                <CSVLink 
                    data={data || []}
                    filename={`buyer-dataexport${Date.now()}.csv`}
                    className="btn btn-primary"
                    target="_blank"
                    style={{marginRight: "20px"}}
                >
                    Export data
                </CSVLink>
                <Link className="btn btn-primary" to="/buyer/new">Add Buyer</Link>
                <a className="btn btn-primary" style={{marginLeft: "15px"}} target="_blank" type="button" href="https://docs.google.com/document/d/1u6cbXU8tpvmVIQ1geDYTN2054tAQE8M4L02Cj7wEhhM/edit#bookmark=id.brjxe36n5l4j">Buyer Help</a>
            </div>
             <br /> 
        <Card>
            <CardBody>
                <BuyerDisplay 
                    data={data}
                    loading={loading}
                    pages={pages}
                    handlePageChange={handlePageChange}
                    handleFilteredChange={handleFilteredChange}
                    handleSortedChange={handleSortedChange}
                    handlePageSizeChange={handlePageSizeChange}
                    handleBuyerDisplay={handleBuyerDisplay}
                />
            </CardBody>    
        </Card> 
        </div>   
    )

}

const BuyerDisplay = ({data, loading, pages, handlePageChange, handleFilteredChange, handleSortedChange, handlePageSizeChange, handleBuyerDisplay}) => (
    <ReactTable
        data={data}
        columns={
            [{
                Header: "Company Name",
                accessor: "company_name",
                id: "company_name",
                foldable: true
            },{
                Header: "Name",
                accessor: "name",
                id: "name",
                foldable: true
            },{
                Header: "Affiliate",
                accessor: "affiliate",
                id: "affiliate",
                foldable: true
            },{
                Header: "Email",
                accessor: "contact_email",
                id: "contact_email",
                foldable: true
            },{
                Header: "Status",
                accessor: "status",
                id: 'status',
                Cell: function(props){
                    if(props.value === 0){
                        return <span className="badge badge-danger">Inactive</span>
                    } else {
                        return <span className="badge badge-success">Active</span>
                    }
                }    
            },{
                Header: "Purchase Orders",
                accessor: "orders",
                id: "orders",
                Cell: function(props){
                        return props && props.value && props.value.length ? props.value.length : 0
                },
                filterable: false
            }]
        }
        manual
        pages={pages}
        loading={loading}
        pageSize={data ? data.length : 20}
        onPageChange={(pageIndex) => handlePageChange(pageIndex + 1)}
        onFilteredChange={(filtered, column) => handleFilteredChange(filtered, column)}
        filterable={true}
        onSortedChange={(newSorted, column, shiftKey) => handleSortedChange(newSorted)}
        onPageSizeChange={(pageSize, pageIndex) => handlePageSizeChange(pageSize, pageIndex)}
        getTrProps={(state, rowInfo) => ({
            onClick: () => handleBuyerDisplay(rowInfo)
        })}
    />
    )

// export default class Buyer extends Component {

//     state = {
//         data: [],
//         active: [],
//         inactive: [],
//         all: [],
//         activeTab: 'active',
//         activeBuyerAddTab: 'add',
//         addBuyerModal: false,
//         buyerFormData: {
//             name: '',
//             billing: "weekly",
//             payment: 'postpaid',
//             credits: 0,
//             username: '',
//             password: '',
//             contact: {},
//             leads: {},
//             status: 0,
//             zipcodes: '',
//             mapped: {},
//             ping_url: '',
//             post_url: '',
//             mapped: {}
//         },
//         mapped_terms: [{ currentField: '', mappedField: ''}],
//         verticals: {},
//         fields: {},
//         loading: true,
//         pages: -1,
//         total: 0,
//         perPage: 20,
//         sortFilter: {
//             'filter' : [],
//             'sort': [],
//             'size': 0
//         } 
//     }
    
//     componentDidMount = async () => {
//         const search = await buyers('', 'search', {'expand' : 'orders' })
//         const { items, _meta } = search || []
//         this.setState({
//             data: items,
//             pages: _meta ? _meta.pageCount : -1,
//             total: _meta ? _meta.totalCount : 0,
//             perPage: _meta ? _meta.perPage : 20,
//             loading: false
//         })
//     }

//     handleChange = e => {
//         this.setState({
//             [e.target.name]: e.target.value
//         })
//     }

//     viewBuyers = async (content, type, params, status) => {
//         const results = await buyers(content, type, params)
//         this.setState({
//             [status]: results
//         })
//     }

//     toggleActivity = (tab) => {
//         if (this.state.activeTab !== tab) {
//           this.setState({
//             activeTab: tab
//           }, () => {
//               tab === 'active' 
//                 ? this.viewBuyers('', 'status', { 'status': 1}, 'active')
//                 : tab === 'inactive' 
//                     ? this.viewBuyers('', 'status', { 'status': 0 }, 'inactive')
//                     : this.viewBuyers('', 'search', '', 'all')
//           });
//         }
//       }

//      toggleBuyerModal = () => {
//         this.setState(prevState => ({
//             addBuyerModal: !prevState.addBuyerModal
//         }), () => {
//             this.viewAllVerticals()
//             this.viewAllFieldDefinitions()
//         });
//       }  
      
//       toggleBuyerTabs = (tab) => {
//         if (this.state.activeBuyerAddTab !== tab) {
//             this.setState({
//                activeBuyerAddTab: tab
//             });
//           }
//       } 

//       viewAllVerticals = async () => {
//         const results = await vertical()
//         this.setState({
//             verticals: results
//         })
//     }

//     viewAllFieldDefinitions = async () => {
//         const results = await fieldDefinition()
//         this.setState({
//             fields: results
//         })
//     }

//     handleVerticalChange = (item) => {
//         const buyerFormData = this.state.buyerFormData
//         buyerFormData['leads'] = item
//         this.setState({
//             buyerFormData
//         })
//     }

//     handleAddBuyerFormChange = (e) => {
//         const buyerFormData = this.state.buyerFormData
//         buyerFormData[e.target.name] = e.target.value
//         e.target.name === 'credits' && e.target.value > 0 || e.target.value == -1
//             ? buyerFormData['status'] = 1
//             : buyerFormData['status'] = 0
//         this.setState({
//             buyerFormData
//         })
//     }

//     handleNewBuyer = async e => {
//        e.preventDefault()
//        const buyerFormData = this.state.buyerFormData
//        buyerFormData["mapped"] = this.state.mapped_terms
//        const add = await buyers(this.state.buyerFormData, 'add')
//        if(add){
//             this.viewBuyers('', 'search', { 'filter[status]': 1}, 'active')
//        } else {
//            alert('error')
//        }
//     }

//     handleZipCodes = e => {
//         const buyerFormData = this.state.buyerFormData
//         buyerFormData[e.target.name] = e.target.value
//         this.setState({
//             buyerFormData
//         })
//     }

//     addAdditional = (e) => {
//         e.preventDefault()
//         this.setState((prevState) => ({
//                 mapped_terms: 
//                     [...prevState.mapped_terms, {currentField: '', mappedField: ''}
//                 ],
//         }));
//       }

//       handleAddAdditionalChangeSelect = (e, value, id) => {
//            const classValue = value.trim()
//            const arrayKey = id.replace(`${classValue}-`, '').trim()
           
//            let additionalQueryTerms = [...this.state.mapped_terms]
//            additionalQueryTerms[arrayKey][classValue] = e.value
//            this.setState({ additionalQueryTerms })
//       } 
      
//       handleAddAdditionalChangeInput = e => {
//         const classValue = e.target.className.replace(/form-control/g, '').trim()
//         const arrayKey = e.target.id.replace(`${classValue}-`, '').trim()
//         let additionalQueryTerms = [...this.state.mapped_terms]
//         additionalQueryTerms[arrayKey][classValue] = e.target.value
//         this.setState({ additionalQueryTerms }) 
//       }

//       handleBuyerDisplay = (rowInfo) => {
//         this.props.history.push(`buyer/${rowInfo.original.id}`)
//       }


//     handleFilteredChange = (filtered, column) => {
//         const { sortFilter } = this.state
//         sortFilter["filter"] = filtered
//         this.setState({
//             sortFilter
//         }, () => {
//             this.handleFilteredSearch(this.state.sortFilter)
//         })

//     }

//     handleSortedChange = (newSorted) => {
//         const { sortFilter } = this.state
//         sortFilter["sort"] = newSorted
//         this.setState({
//             sortFilter
//         }, () => {
//             this.handleFilteredSearch(this.state.sortFilter)
//         })
//     }

//     handlePageSizeChange = (pageSize, pageIndex) => {
//         const { sortFilter } = this.state
//         sortFilter["size"] = pageSize
//         this.setState({
//             sortFilter
//         }, () => {
//             this.handleFilteredSearch(this.state.sortFilter)
//         })
//     }

//     handleFilteredSearch = async (sortFilter, page=1) => {
//         const search = await buyers(sortFilter, 'filter', {
//             'page' : page, 
//             'expand' : 'orders' 
//         })
//         const { items, _meta } = search || []
//         this.setState({
//             data: items,
//             pages: _meta ? _meta.pageCount : -1,
//             total: _meta ? _meta.totalCount : 0,
//             perPage: _meta ? _meta.perPage : 20,
//             loading: false
//         })
//     }


//     render(){
//         const { 
//             data, 
//             pages, 
//             loading, 
//             total, 
//             perPage, 
//             active, 
//             inactive, 
//             activeTab, 
//             addBuyerModal, 
//             activeBuyerAddTab, 
//             verticals, 
//             all
//         } = this.state
//         return(
//             <div>
//                 <div className="d-flex justify-content-end" style={{marginBotton: "30px"}}>
//                     <Link className="btn btn-primary" to="/buyer/new">Add Buyer</Link>
//                  </div>
//                  <br />   
//             <div style={{backgroundColor: "white"}}>
//                 <Display 
//                     data={data}
//                     pages={pages}
//                     loading={loading}
//                     total={total}
//                     perPage={perPage}
//                     handleFilteredChange={this.handleFilteredChange}
//                     handlePageChange={this.handlePageChange}
//                     handleSortedChange={this.handleSortedChange}
//                     handlePageSizeChange={this.handlePageSizeChange}
//                     handleBuyerDisplay={this.handleBuyerDisplay}
//                 />
//             {/* <Nav tabs>
//               <NavItem>
//                 <NavLink
//                   className={classnames({ active: activeTab === 'active' })}
//                   onClick={() => { this.toggleActivity('active'); }}
//                 >
//                 Active
//                 </NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink
//                   className={classnames({ active: activeTab === 'inactive' })}
//                   onClick={() => { this.toggleActivity('inactive'); }}
//                 >
//                   Inactive
//                 </NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink
//                   className={classnames({ active: activeTab === 'all' })}
//                   onClick={() => { this.toggleActivity('all'); }}
//                 >
//                   All
//                 </NavLink>
//               </NavItem>
//             </Nav>
//             <TabContent activeTab={activeTab}>
//               <TabPane tabId="active">
//                 <Row>
//                   <Col sm="12">
//                     <Display
//                         data={active}
//                         handleBuyerDisplay={this.handleBuyerDisplay}
//                     />
//                   </Col>
//                 </Row>
//               </TabPane>
//               <TabPane tabId="inactive">
//                 <Row>
//                   <Col sm="12">
//                   <Display
//                         data={inactive}
//                         handleBuyerDisplay={this.handleBuyerDisplay}
//                     />
//                   </Col>
//                 </Row>
//               </TabPane>
//               <TabPane tabId="all">
//                 <Row>
//                   <Col sm="12">
//                   <Display
//                         data={all}
//                         handleBuyerDisplay={this.handleBuyerDisplay}
//                     />
//                   </Col>
//                 </Row>
//               </TabPane>
//             </TabContent> */}
//           </div> 
//           </div>
//         )
//     }
// }

// const Display = ({data, pages, loading, handleFilteredChange, handlePageChange, handleSortedChange, handlePageSizeChange, handleBuyerDisplay }) => (
//     <Card>
//         <CardBody>
//     <FoldableTable
//     data={data}
//     columns={
//         [{
//             Header: "Company Name",
//             accessor: "company_name",
//             id: "company_name",
//             foldable: true
//         },{
//             Header: "Name",
//             accessor: "name",
//             id: "name",
//             foldable: true
//         },{
//             Header: "Affiliate",
//             accessor: "affiliate",
//             id: "affiliate",
//             foldable: true
//         },{
//             Header: "Email",
//             accessor: "contact_email",
//             id: "contact_email",
//             foldable: true
//         },{
//             Header: "Status",
//             accessor: "status",
//             id: 'status',
//             Cell: function(props){
//                 if(props.value === 0){
//                     return <span className="badge badge-danger">Inactive</span>
//                 } else {
//                     return <span className="badge badge-success">Active</span>
//                 }
//             }    
//         },{
//             Header: "Purchase Orders",
//             accessor: "orders",
//             id: "orders",
//             Cell: function(props){
//                     return props && props.value && props.value.length ? props.value.length : 0
//             },
//             filterable: false
//         }]
//     }
//     manual
//     pages={pages}
//     loading={loading}
//     pageSize={data ? data.length : 20}
//     onPageChange={(pageIndex) => handlePageChange(pageIndex + 1)}
//     onFilteredChange={(filtered, column) => handleFilteredChange(filtered, column)}
//     filterable={true}
//     onSortedChange={(newSorted, column, shiftKey) => handleSortedChange(newSorted)}
//     onPageSizeChange={(pageSize, pageIndex) => handlePageSizeChange(pageSize, pageIndex)}
//     getTrProps={(state, rowInfo) => ({
//         onClick: () => handleBuyerDisplay(rowInfo)
//     })}
// />
// </CardBody>
// </Card>
// )


// const BuyerTable = ({ data, handleBuyerDisplay }) => (
//     <div className="table-responsive">
//     <table className="table table-hover">
//       <thead>
//         <tr>
//             <th scope="col">Company Name</th>
//             <th scope="col">Name</th>
//             <th scope="col">Affiliate</th>
//             <th scope="col">Email</th>
//             <th scope="col">Open Orders</th>
//         </tr>
//         </thead>
//         <tbody>  
//             {Object.keys(data).map((items, idx) => 
//                 <tr key={idx} onClick={() => handleBuyerDisplay(data[items].id)}>
//                     <td>{data[items].company_name}</td>
//                     <td>{data[items].name}</td>
//                     <td>{data[items].affiliate}</td>
//                     <td>{data[items].contact_email}</td>
//                     <td>{data[items].open_orders}</td>
//                 </tr>
//             )  
//             }
//         </tbody>    
//     </table>
//     </div>
// )

// const BuyerNavBar = ({ toggleBuyerModal }) => (
//     <div style={{paddingBottom: '30px'}}>
//         <Link to="/buyer/new" className="btn btn-primary">Add Buyer</Link>
//      </div>   
// )

// const BuyerAddModal = ({ 
//     addBuyerModal, 
//     toggleBuyerModal, 
//     toggleBuyerTabs, 
//     activeBuyerAddTab, 
//     verticals, 
//     handleVerticalChange, 
//     handleAddBuyerFormChange, 
//     handleNewBuyer, 
//     handleZipCodes, 
//     fields,
//     addAdditional,
//     additionalQueryTerms,
//     handleAddAdditionalChangeSelect,
//     handleAddAdditionalChangeInput
//  }) => (
//     <div>
//     <Modal isOpen={addBuyerModal} toggle={toggleBuyerModal} className="modal-xl">
//       <ModalHeader toggle={toggleBuyerModal}>[Close]</ModalHeader>
//       <ModalBody>
//           <div className="row">
//             <div className="col-3">
//                 <BuyerAddModalTabs 
//                     toggleBuyerTabs={toggleBuyerTabs}
//                     activeBuyerAddTab={activeBuyerAddTab}
//                 />
//             </div>
//             <div className="col-9">
//                 <TabContent activeTab={activeBuyerAddTab}>
//                     <TabPane tabId="add">
//                         <Col sm="12">
//                             <BuyerAddModalForm 
//                                 handleAddBuyerFormChange={handleAddBuyerFormChange}
//                                 handleNewBuyer={handleNewBuyer}
//                             />
//                         </Col>    
//                     </TabPane>
//                     <TabPane tabId="mapping">
//                         <Col sm="12">
//                             <BuyerMappingForm  
//                                 fields={fields}
//                                 addAdditional={addAdditional}
//                                 additionalQueryTerms={additionalQueryTerms}
//                                 handleAddAdditionalChangeSelect={handleAddAdditionalChangeSelect}
//                                 handleAddAdditionalChangeInput={handleAddAdditionalChangeInput}
//                             />
//                         </Col>    
//                     </TabPane>
//                     <TabPane tabId="settings">
//                         <Col sm="12">
//                             <BuyerSettingsForm 
//                                 verticals={verticals}
//                                 handleVerticalChange={handleVerticalChange}
//                                 handleZipCodes={handleZipCodes}
//                             />
//                         </Col>    
//                     </TabPane>
//                 </TabContent>       
//             </div>    
//           </div>  
//       </ModalBody>
//       <ModalFooter>
//             <Button color="primary" onClick={handleNewBuyer}>Add</Button>{' '}
//             <Button color="secondary" onClick={toggleBuyerModal}>Cancel</Button>
//           </ModalFooter>
//     </Modal>
//   </div>
// )

// const BuyerAddModalForm = ({  handleAddBuyerFormChange, handleNewBuyer }) => {

//     return(
//     <Form>
//         <FormGroup>
//             <Label>Name</Label>
//             <Input type="text" name="name" onChange={(e) => handleAddBuyerFormChange(e)}  />
//         </FormGroup>   
//         <FormGroup>
//             <Label>UserName</Label>
//             <Input type="text" name="username" onChange={(e) => handleAddBuyerFormChange(e)}  />
//         </FormGroup> 
//         <FormGroup>
//             <Label>Password</Label>
//             <Input type="text" name="password" onChange={(e) => handleAddBuyerFormChange(e)}  />
//         </FormGroup>   
//         <FormGroup>
//             <Label>Billing</Label>
//             <Input type="select" name="billing" onChange={(e) => handleAddBuyerFormChange(e)}>
//             <option>Weekly</option>
//             <option>Biweekly</option>
//           </Input>
//         </FormGroup> 
//         <FormGroup>
//             <Label>Payment</Label>
//             <Input type="select" name="payment" onChange={(e) => handleAddBuyerFormChange(e)}>
//             <option>Prepaid</option>
//             <option>Postpaid</option>
//           </Input>
//         </FormGroup>
//         <FormGroup> 
//         <Label>Credits</Label>
//             <Input type="number" name="credits" onChange={(e) => handleAddBuyerFormChange(e)}  />
//         </FormGroup>      
//         </Form>
//     )
// }

// const BuyerSettingsForm = ({verticals, handleVerticalChange, handleZipCodes }) => {
//     const verticalArray = verticals ? Object.keys(verticals).map(items => ({
//         value: verticals[items].name,
//         label: verticals[items].label
//     })) : {}
//     return(
//     <div className="container">    
//     <Form>
//         <FormGroup>
//         <Label>Verticals</Label>
//         {Object.keys(verticalArray).length ? <Select
//             onChange={handleVerticalChange}
//             options={verticalArray}
//             isMulti={true}
//         /> : ''}
//         </FormGroup>
//     </Form> 
//     <Form>
//         <FormGroup>
//           <Label>Zipcodes</Label>
//           <Input type="textarea" name="zipcodes" onChange={(e) => handleZipCodes(e)} />
//         </FormGroup>
//     </Form>     
//     </div>
//     ) 
// }

// const BuyerMappingForm = ({ 
//         handleMapping, 
//         fields, 
//         handleFieldChange, 
//         addAdditional,
//         additionalQueryTerms,
//         handleAddAdditionalChangeSelect,
//         handleAddAdditionalChangeInput
//     }) => {

//     return(
//     <Form>
//         <FormGroup>
//             <Label>Ping URL</Label>
//             <Input type="text" name="ping" onChange={(e) => handleMapping(e)}  />
//         </FormGroup> 
//         <FormGroup>
//             <Label>Post URL</Label>
//             <Input type="text" name="post" onChange={(e) => handleMapping(e)}  />
//         </FormGroup> 
//             <AdditionalQueryTerms
//                 additionalQueryTerms={additionalQueryTerms}
//                 addAdditional={addAdditional}
//                 additionalQueryTerms={additionalQueryTerms}
//                 handleAddAdditionalChangeSelect={handleAddAdditionalChangeSelect}
//                 handleAddAdditionalChangeInput={handleAddAdditionalChangeInput}
//                 fields={fields}
//             />
//             {/* <div className="col">
//                 <FormGroup>
//                     <Label>Field to Map</Label>
//                     {Object.keys(fieldArray).length ? <Select
//                         onChange={handleFieldChange}
//                         options={fieldArray}
//                     /> : ''}
//                 </FormGroup> 
//             </div>
//             <div className="col">
//                 <FormGroup>
//                     <Label>Map Field</Label>
//                     <Input type="text" name="currentField" onChange={(e) => handleMapping(e)}  />
//                 </FormGroup> 
//             </div>
//             <div className="col">
//                 <FormGroup>
//                     <Label></Label>
//                     <Button color="primary" onClick={(e) => addAdditional(e)}>[+]</Button>
//                 </FormGroup>    
//             </div>   */}     
//     </Form>  
//     )  
// }

// const BuyerAddModalTabs = ({ toggleBuyerTabs, activeBuyerAddTab }) => (
//     <div className="tabs flex-column nav-pills" id="v-pills-tab" role="tablist">
//             <NavLink
//                className={classnames({ active: activeBuyerAddTab === 'add' })}
//                 onClick={() => { toggleBuyerTabs('add'); }}
//             >
//                 Add
//             </NavLink>
//             <NavLink
//                className={classnames({ active: activeBuyerAddTab === 'mapping' })}
//                 onClick={() => { toggleBuyerTabs('mapping'); }}
//             >
//                 Mapping
//             </NavLink>
//             <NavLink
//                className={classnames({ active: activeBuyerAddTab === 'settings' })}
//                 onClick={() => { toggleBuyerTabs('settings'); }}
//             >
//                 Settings
//             </NavLink>
//      </div>     
// )

// const AdditionalQueryTerms = ({
//         additionalQueryTerms,
//         addAdditional, 
//         handleAddAdditionalChangeSelect, 
//         handleAddAdditionalChangeInput,
//         fields
//     }) => {
//     const fieldArray = fields ? Object.keys(fields).map(items => ({
//         value: fields[items].name,
//         label: fields[items].name
//     })) : {}
//     return(
//       additionalQueryTerms.map((val, idx) => {
//         let currentFieldId = `currentField-${idx}`, mappedFieldId = `mappedField-${idx}`
//         return(
//           <div className="form-row" key={idx}>
//             <div className="col">
//             <FormGroup>
//                     {Object.keys(fieldArray).length ? 
//                     <Select
//                         onChange={(e) => handleAddAdditionalChangeSelect(e, "currentField", currentFieldId)}
//                         options={fieldArray}
//                         id={currentFieldId}
//                         className="currentField"
//                         dataid={idx}
//                     /> : ''}
//                 </FormGroup> 
//             </div>    
//             <div className="col">
//             <FormGroup>
//             <Input
//               type="text"
//               dataid={idx}
//               name={mappedFieldId}
//               id={mappedFieldId}
//               value={additionalQueryTerms[idx].mappedField}
//               className="form-control mappedField"
//               onChange={(e) => handleAddAdditionalChangeInput(e)}
//             /> 
//             </FormGroup> 
//            </div> 
//            <div className="col">
//               <button className="btn btn-primary" onClick={(e) => addAdditional(e)}>+</button>
//             </div>  
//           </div>
//         )
//       })
//     )
//   }

export default Buyer
