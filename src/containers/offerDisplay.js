import React, { Component } from 'react'
import { offer, buyers } from '../util/db'
import { 
    Form, 
    FormGroup, 
    Label, 
    Input, 
    FormText 
} from 'reactstrap';
import Select from 'react-select'

export default class OfferDisplay extends Component {

    state = {
        offers: {},
        buyers: {},

    }

    componentDidMount = () => {
        this.getOfferData()
        this.getBuyers('', 'search', { 'filter[status]': 1}, 'active')
    }

    getOfferData = async () => {
        const get = await offer('', 'display', { 'id': this.props.match.params.id} )
        this.setState({
            offers: get
        })
    }

    getBuyers = async (content, type, params, status) => {
        const results = await buyers(content, type, params)
        this.setState({
            buyers: results
        })
    }

    handleOffersNewBuyerChange = value => {

    }

    handleNewBuyerAdd = (e) => {
        e.preventDefault()
        const buyers = this.state.offers
        const last = [...buyers].pop()
        console.log(parseInt(last.priority) + 1)

    }

    render(){
        const { offers, buyers } = this.state
        const buyerArray = buyers ? Object.keys(buyers).map(items => ({
            value: buyers[items].company_name,
            label: buyers[items].company_name
        })) : {}
        return(
            <div className="card" style={{padding: "20px"}}>
            <OfferNewForm
                buyerArray={buyerArray}
                handleOffersNewBuyerChange={this.handleOffersNewBuyerChange}
                handleNewBuyerAdd={this.handleNewBuyerAdd}
            />
                <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Priority</th>
                    </tr>
                </thead>
                <tbody>  
                        {offers ? Object.keys(offers).map((items, idx) => 
                            <tr key={idx}>
                                <td>{offers[items].company_name}</td>
                                <td>{offers[items].priority}</td>
                            </tr>
                        ) : '<tr></tr>'}
                    </tbody>    
                </table>
            </div>    
        )
    }
}

const styles = {
    control: (base) => ({
      ...base,
      minHeight: 32,
      width: 200
    })
  };

const OfferNewForm = ({ buyerArray, handleOffersNewBuyerChange, handleNewBuyerAdd }) => (
    <form className="form-inline">
        <FormGroup style={{paddingRight: "20px"}}>
        {Object.keys(buyerArray).length ? <Select
            styles={styles} 
            onChange={handleOffersNewBuyerChange}
            options={buyerArray}
        /> : ''}
        </FormGroup> 
        <button onClick={(e) =>  handleNewBuyerAdd(e)}className="btn btn-primary mb-2">Add</button>
    </form>
)