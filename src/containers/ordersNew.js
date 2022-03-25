import React, { Component } from 'react'
import { Form, FormGroup, Label, Button, Input, Card, CardBody, CardHeader } from 'reactstrap'
import Select from 'react-select'
import { orders, buyers, vertical } from '../util/db'
import Alerts from '../controller/alerts'

export default class OrdersNew extends Component {

    state = {
        buyers: [],
        verticals: [],
        billing: '',
        buyer_id: '',
        payment: '',
        credits: 0,
        lead_price: 0,
        priority: 1,
        selectedVerticals: []
    }

    componentDidMount(){
        this.getBuyers()
        this.viewAllVerticals()
    }

    getBuyers = async () => {
        const buyer = await buyers('', 'search', { 'fields': 'id,company_name'}, '')
        const { items } = buyer || []
        this.setState({
            buyers: items
        })
    }

    viewAllVerticals = async () => {
        const results = await vertical()
        const { items } = results || []
        this.setState({
            verticals: items
        })
    }

    handleBuyerChange = item => {
        this.setState({
            buyer_id: item.value
        })
    }

    handleFormChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleMultiChange = (data, name) => {
        let id = []
        if(data && data.length > 0){
            Object.keys(data).map(items =>
                id.push(data[items].value)
            )
            this.setState({
                [name] : id
            })
        } else {
            this.setState({
                selectedVerticals: []
            })
        }
    }

    handleSubmit = async e => {
        e.preventDefault()
        const submitValues = {
            billing: this.state.billing,
            buyer_id: this.state.buyer_id,
            payment: this.state.payment,
            credits: this.state.credits,
            lead_price: this.state.lead_price,
            priority: this.state.priority,
            verticals: this.state.selectedVerticals
        }
        const add = await orders(submitValues, 'create')
        if(add){
            Alerts.success('New order successfully created')
            this.setState({ 
                billing: '',
                buyer_id: '',
                payment: '',
                credits: '',
                lead_price: '',
                priority: ''
            })
        }
    }

    render(){
        const { buyers, buyer_id, billing, payment, credits, lead_price, priority } = this.state
        return(
            <CardOrder
                data={this.state}
                handleFormChange={this.handleFormChange}
                handleBuyerChange={this.handleBuyerChange}
                handleSubmit={this.handleSubmit}
                handleMultiChange={this.handleMultiChange}
            />
        )
    }
}

const CardOrder = ({ data, handleFormChange, handleBuyerChange, handleSubmit, handleMultiChange }) => (
    <Card>
    <CardHeader>
        New Order
    </CardHeader>
    <CardBody>
        <NewForm
            data={data}
            handleFormChange={handleFormChange}
            handleBuyerChange={handleBuyerChange}
            handleSubmit={handleSubmit}
            handleMultiChange={handleMultiChange}
        />
    </CardBody>        
    </Card> 
)

const NewForm = ({ data, handleFormChange, handleBuyerChange, handleSubmit, handleMultiChange }) => {
    const buyerArray = data && data.buyers ? Object.keys(data.buyers).map(items => ({
        value: data.buyers[items].id,
        label: data.buyers[items].company_name
    })) : {}

    const verticalArray = data && data.verticals ? Object.keys(data.verticals).map(items => ({
        value: data.verticals[items].id,
        label: data.verticals[items].label
    })) : {}

    return(
    <Form onSubmit={(e) => handleSubmit(e)}>
    <FormGroup>
    <Label>Buyers</Label>
    {Object.keys(buyerArray).length ? <Select
        onChange={(e) => handleBuyerChange(e)}
        options={buyerArray}
    /> : ''}
    </FormGroup> 
    <FormGroup>
        <Label>Verticals</Label>
        {Object.keys(verticalArray).length ? <Select
            onChange={(e) => handleMultiChange(e, 'selectedVerticals')}
            options={verticalArray}
            isMulti
            closeMenuOnSelect={false}
        /> : ''}
    </FormGroup>      
    <FormGroup>
        <Label>Billing</Label>
        <Input type="select" value={data.billing} name="billing" onChange={(e) => handleFormChange(e)}>
        <option>Select billing...</option>
        <option>Weekly</option>
        <option>Biweekly</option>
      </Input>
    </FormGroup> 
    <FormGroup>
        <Label>Payment</Label>
        <Input type="select" value={data.payment} name="payment" onChange={(e) => handleFormChange(e)}>
        <option>Select payment...</option>
        <option>Prepaid</option>
        <option>Postpaid</option>
      </Input>
    </FormGroup>
    <FormGroup> 
    <Label>Credits</Label>
        <Input type="number" value={data.credits} name="credits" onChange={(e) => handleFormChange(e)}  />
    </FormGroup>  
    <FormGroup> 
    <Label>Priority</Label>
        <Input type="number" value={data.priority} name="priority" onChange={(e) => handleFormChange(e)}  />
    </FormGroup> 
    <FormGroup> 
    <Label>Lead Price</Label>
        <Input type="float" value={data.lead_price} name="lead_price" onChange={(e) => handleFormChange(e)}  />
    </FormGroup>   
    <Button color="primary">Submit</Button>
    </Form>  
    )
}