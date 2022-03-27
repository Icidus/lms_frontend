import React from 'react'
import { Row, Col, Form, FormGroup, Table, Button, Label, Alert, Input} from 'reactstrap'
import { report, vendors } from '../../util/db'

function BuyerVendorReport(props){
        return(
            <div style={{padding: "30px"}}>
                {props.loading ? <Alert color="warning">Loading data.  One moment...</Alert>: ''}
                <Table>
                    <thead>
                        <tr>
                            <th>Vendor ID</th>
                            <th>Vendor</th>
                            <th>Buyer Id</th>
                            <th>Company Name</th>
                            <th>Vertical</th>
                            <th>Leads Sold</th>
                            <th>Sold Price</th>
                            <th>Lead Cost</th>
                            <th>Returns</th>
                            <th>Returns Price</th>
                            <th>Sold Price - Return Price</th>
                            <th>Payable</th>
                        </tr>   
                    </thead>  
                    <tbody>
                        {props.buyerVendors && props.buyerVendors.length > 0 ? Object.keys(props.buyerVendors).map((items,idx) => {
                            const payable = (Number(props.buyerVendors[items].lead_sold)) - (props.buyerVendors[items].return_leads !== null ? Number(props.buyerVendors[items].return_leads) : 0)
                            const soldPrice = (Number(props.buyerVendors[items].amt)) - (props.buyerVendors[items].return_price !== null ? Number(props.buyerVendors[items].return_price) : 0)
                            return(
                            <tr key={idx}>
                                <td>{props.buyerVendors[items].vendor_id}</td>
                                <td>{props.buyerVendors[items].vendor}</td>
                                <td>{props.buyerVendors[items].buyer_id}</td>
                                <td>{props.buyerVendors[items].company_name}</td>
                                <td>{props.buyerVendors[items].vertical}</td>
                                <td>{props.buyerVendors[items].lead_sold}</td>
                                <td>{props.buyerVendors[items].amt}</td>
                                <td>{props.buyerVendors[items].lead_cost}</td>
                                <td>{props.buyerVendors[items].return_leads !== null ? props.buyerVendors[items].return_leads : 0}</td>
                                <td>{props.buyerVendors[items].return_price !== null ? props.buyerVendors[items].return_price : 0}</td>
                                <td>{soldPrice}</td>
                                <td>{payable}</td>
                            </tr>
                            )
                        }): []}
                    </tbody>  
                </Table>   
            </div>
        )
    
}

export default BuyerVendorReport