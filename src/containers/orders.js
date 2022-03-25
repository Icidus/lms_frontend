import React, { Component } from 'react'
import { orders, buyers } from '../util/db'
import { Link } from 'react-router-dom'
import _ from 'lodash'

import Select from 'react-select'
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
    CardBody,
    Breadcrumb,
    BreadcrumbItem
} from 'reactstrap';
import ReactTable from 'react-table'
import FoldableTableHOC from "react-table/lib/hoc/foldableTable";
import 'react-table/react-table.css'
import { CSVLink } from "react-csv";

const FoldableTable = FoldableTableHOC(ReactTable);


const NewOrder = ({ buyers, orderModal, toggleOrderModal, handleFormChange, formSubmit, handleBuyerChange}) => {
    const buyerArray = buyers ? Object.keys(buyers).map(items => ({
        value: buyers[items].id,
        label: buyers[items].company_name
    })) : {}
    return(
    <div>
    <Modal isOpen={orderModal} toggle={toggleOrderModal} className="modal-lg">
      <ModalBody>
        <Form>
        <FormGroup>
        <Label>Buyers</Label>
        {Object.keys(buyerArray).length ? <Select
            onChange={(e) => handleBuyerChange(e)}
            options={buyerArray}
        /> : ''}
        </FormGroup>       
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
           <button className="btn btn-secondary" onClick={toggleOrderModal}>Cancel</button>
          </ModalFooter>
    </Modal>
  </div>
  )
}

export default class Orders extends Component{

    state = {
        data: [],
        pages: 1,
        total: 0,
        perPage: 20,
        buyers: {},
        orderModal: false,
        billing: '',
        buyer_id: '',
        payment: '',
        credits: 0,
        lead_price: 0,
        priority: 1,
        loading: true,
        sortFilter: {
            'filter' : [],
            'sort': [],
            'size': 0
        }
    }

    componentDidMount = async () => {
        const order = await orders('', 'all')
        const { items, _meta } = order || []
        // let data
        // if(items){
        // Object.keys(items).map((set, idx) => {
        //     if(items[set].verticals.length){
        //         Object.keys(items[set].verticals).map(vertical => {
        //             return data.push({
        //                 vertical: items[set].verticals[vertical].label,
        //                 [set]: items[set]
        //             })
        //         })
        //     } else {
        //         return data.push(items[set])
        //     }
        // })
        // }
        // var merged = [].concat.apply([], data)
        // console.log(merged)

        this.setState({
            data: items,
            pages: _meta ? _meta.pageCount : -1,
            total: _meta ? _meta.totalCount : 0,
            perPage: _meta ? _meta.perPage : 20,
            loading: false
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

    handleFilteredChange = (filtered, column) => {
        const { sortFilter } = this.state
        sortFilter["filter"] = filtered
        this.setState({
            sortFilter
        }, () => {
            this.handleFilteredSearch(this.state.sortFilter)
        })

    }

    handleSortedChange = (newSorted) => {
        const { sortFilter } = this.state
        sortFilter["sort"] = newSorted
        this.setState({
            sortFilter
        }, () => {
            this.handleFilteredSearch(this.state.sortFilter)
        })
    }

    handlePageSizeChange = (pageSize, pageIndex) => {
        const { sortFilter } = this.state
        sortFilter["size"] = pageSize
        this.setState({
            sortFilter
        }, () => {
            this.handleFilteredSearch(this.state.sortFilter)
        })
    }

    handleFilteredSearch = async (sortFilter, page=1) => {
        const search = await orders(sortFilter, 'filter', {'page' : page, 'fields': 'id,billing,payment,credits,,lead_price,po_number,priority,open,timestamp,buyer.company_name', 'expand' : 'buyer'})
        const { items, _meta } = search || []
        this.setState({
            data: items,
            pages: _meta ? _meta.pageCount : -1,
            total: _meta ? _meta.totalCount : 0,
            perPage: _meta ? _meta.perPage : 20,
            loading: false
        })
    }

    ordersDisplay = row => {
        this.props.history.push(`/orders/${row.original.id}`)
    }
    


    render(){
        const { data, buyers, orderModal, loading, pages, total, perPage } = this.state
        console.log(data)
        return(
            <div>
                <div>
                    <Breadcrumb>
                        <BreadcrumbItem active>Orders</BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <div className="d-flex justify-content-end" style={{marginBotton: "30px"}}>
                <CSVLink 
                    data={data || []}
                    filename={`orders-dataexport${Date.now()}.csv`}
                    className="btn btn-primary"
                    target="_blank"
                    style={{marginRight: "20px"}}
                >
                    Export data
                </CSVLink>
                    <Link className="btn btn-primary" to="/orders/new">New Order</Link>
                </div>  
                <br />
                <Card>
                    <CardBody>
                        <Display 
                            data={data}
                            pages={pages}
                            loading={loading}
                            total={total}
                            perPage={perPage}
                            verticalDisplay={this.verticalDisplay}
                            handleFilteredChange={this.handleFilteredChange}
                            handlePageChange={this.handlePageChange}
                            handleSortedChange={this.handleSortedChange}
                            handlePageSizeChange={this.handlePageSizeChange}
                            ordersDisplay={this.ordersDisplay}
                        />
                    </CardBody>
                </Card>        
            </div>   
        )
    }
}

const Display = ({data, pages, loading, handleFilteredChange, handlePageChange, handleSortedChange, handlePageSizeChange, ordersDisplay }) => (
    <FoldableTable
    data={data}
    columns={
        [{
            Header: "Order Id",
            accessor: "id",
            id: "id",
            foldable: true
        },
        {
            Header: "PO Number",
            accessor: "po_number",
            id: "po_number",
            foldable: true
        },
        {
            Header: "Buyer Id",
            accessor: "buyer_id",
            id: "buyer_id",
            foldable: true
        },
        {
            Header: "Vertical",
            accessor: "label",
            id: "label",
            foldable: true
        },
        {
            Header: "Company",
            accessor: "company_name",
            id: "company_name",
            foldable: true
        },{
            Header: "Priority",
            accessor: "priority",
            id: "priority",
            foldable: true
        },{
            Header: "Payment",
            id: "payment",
            accessor: "payment",
            foldable: true
        },{
            Header: "Billing",
            id: "billing",
            accessor: "billing",
            foldable: true
        },{
            Header: "Lead Price",
            id: "lead_price",
            accessor: "lead_price",
            foldable: true
        },{
            Header: "Credits",
            id: "credits",
            accessor: "credits",
            foldable: true
        },{
            Header: "Open",
            id: "open",
            accessor: "open",
            foldable: true,
            Cell: function(props){
                if(props.value === "0"){
                    return <span className="badge badge-danger">Inactive</span>
                } else {
                    return <span className="badge badge-success">Active</span>
                }
            }  
        },{
            Header: "Timestamp",
            id: "timestamp",
            accessor: "timestamp",
            foldable: true
        }
    ]
    }
    // manual
    // pages={pages}
    loading={loading}
    pageSize={data ? data.length : 20}
    // onPageChange={(pageIndex) => handlePageChange(pageIndex + 1)}
    // onFilteredChange={(filtered, column) => handleFilteredChange(filtered, column)}
    filterable={true}
    // onSortedChange={(newSorted, column, shiftKey) => handleSortedChange(newSorted)}
    // onPageSizeChange={(pageSize, pageIndex) => handlePageSizeChange(pageSize, pageIndex)}
    getTrProps={(state, rowInfo) => ({
        onClick: () => ordersDisplay(rowInfo)
    })}
    className="-highlight"
/>
)