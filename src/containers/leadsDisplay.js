import React, { useState, useEffect, Fragment } from 'react'
import { lead, buyers, orders, leadData, verticalFieldDefinition, vertical } from '../util/db'
import { UncontrolledTooltip,Alert, Table, Card, CardBody, CardHeader, Row, Col, Form, Input, Button, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Label, Breadcrumb, BreadcrumbItem, ButtonGroup } from 'reactstrap'
import { display } from '../static/sidebar';
import { withRouter, Link } from 'react-router-dom'
import Alerts from '../controller/alerts'
import ReactDataGrid from "react-data-grid";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { verticalFieldDefinitions } from '../config/endpoints';
import { areIntervalsOverlappingWithOptions } from 'date-fns/esm/fp';

function LeadDisplay(props){
    const [data, setData] = useState([])
    const [status, setStatus] = useState([])
    const [qcComments, setQcComments] = useState('')
    const [modal, setModal] = useState(false)
    const [returnModal, setReturnModal] = useState(false)
    const [compressDisplay, setCompressDisplay] = useState(true)
    const [returnData, setReturnData] = useState([{
        buyer_id: '',
        lead_id : '',
        return_email: '',
        return_reason: '',
        confirmation_number: ''
    }])
    const [potentialBuyers, setPotentialBuyers] = useState([])
    const [stack, setStack] = useState([])
    const [basic, setBasic] = useState([])
    const [currentStatus, setCurrentStatus] = useState('')
    const [displayStatus, setDisplayStatus] = useState([])
    const [leadUpdateSucces, setLeadUpdateSuccess] = useState(false)

    useEffect(() => {
        getLeads()
        getStatus()
        getLeadTablePivot()
        getStack()
        getStatusById()
    },[])

    useEffect(() => {
        if(data && data.length > 0){
            Object.keys(data["lead"]).map((items, idx) => 
                setQcComments(data["leads"][items].qc_comments)
            )
        }
    }, [data])

    useEffect(() => {
        if(data && data.lead){
            getBuyers()
        }    
    },[data])

    useEffect(() => {
        setInterval(() => {
            getStack()
            getStatusById()
        }, 3000);    
    },[])

    const toggle = () => setModal(!modal);
    const returnToggle = () => setReturnModal(!returnModal);
    const collapse = () => setCompressDisplay(!compressDisplay)

    const getLeads = async () => {
        const search = await lead('', 'by-id', {'id' : props.match.params.id})
        setData(search ? search : [])
        getReturn()
    }

    const getLeadTablePivot = async () => {
        const results = await lead('', 'pivot-lead', {'id': props.match.params.id})
        setBasic(results)
    }

    const getStatus = async () => {
        const stat = await lead('', 'status')
        setDisplayStatus(stat)
        let forDeletion = ["Sold", "Approved", "Returned"]
        let clear = stat
        if(stat && stat.length > 0){
            clear = stat.filter(item => !forDeletion.includes(item.name))
        }
        setStatus(clear)
    }

    const getStatusById = async () => {
        const statusId = await lead('', 'status-id', {'id': props.match.params.id})
        setCurrentStatus(statusId && statusId[0] && statusId[0].status ? statusId[0].status : '')
    }

    const getStack = async () => {
        const stackInfo = await lead('', 'stack-id', {'lead_id': props.match.params.id})
        setStack(stackInfo && stackInfo.items ? stackInfo.items : [])
    }

    const getReturn = async () => {
        const returnInfo = await lead('', 'get-return-lead', {'id': props.match.params.id})
        setReturnData(returnInfo && returnInfo[0] ? returnInfo[0] : [])
    }

    const getBuyers = async () => {
        const list = {
            'id': data["lead"]["id"],
            'vertical': data["lead"]["vertical_id"],
            'price': data["lead"]["price"],
            'zipcode': data["leadData"]["zip_code"],
            'vendor_id': data && data["lead"] ? data["lead"]["vendor_id"] : ''
        }
        const search = await lead(list, 'check-sell')
        setPotentialBuyers(search)
    }
    

    const updateQcComments = async () => {
        const update = await lead({'id': props.match.params.id, 'qc_comments': qcComments}, 'update-qccomments')
        if(update){
            Alerts.success('Qc Comments successfully updated')
            getLeads()
        } else {
            const error = {
                name: "Error",
                message: "There was a problem updating this lead"
            }
            Alerts.error(error)
        }
    }

    const handleAction = async (e, value) => {
        if(e.target.value === '1'){
            toggle()
        } else if(e.target.value === "5") {
            //if lead has been changed to returned
            setReturnModal(true)
        } else {
            const leadStatusUpdate = {
                'id': props.match.params.id,
                "status" : e.target.value
            }
            const update = await lead(leadStatusUpdate, 'update-status')
            if(update){
                Alerts.success('Lead status successfully updated')
                getLeads()
            } else {
                const error = {
                    name: "Error updating status",
                    message: "There was an error updating this lead."
                }
            }  
        }
    }

    const handleBulkDelete = async e => {
        e.preventDefault()
        const data = {
            "data" : [props.match.params.id],
            "process": 'delete'
        }
        const bulkActions = await lead(data, 'bulk')
        if(bulkActions && bulkActions["code"] == 201){
            Alerts.success(bulkActions["message"])
            props.history.push(`/leads/`)
        }
    }

    const handleBulkApprove = async e => {
        e.preventDefault()
        const data = {
            "data" : [props.match.params.id],
            "process": 'approve'
        }
        const bulkActions = await lead(data, 'bulk')
        if(bulkActions && bulkActions["code"] == 201){
            Alerts.success(bulkActions["message"])
            Alerts.info('Please wait a few moments while we update this leads status.')
        }
    }

    const handleBulkSold = async e => {
        e.preventDefault()
        setModal(true)
    }

    const handleSell = async (orderId, buyerId, purchasePrice) => {
        const data = {
            "order_id" : orderId,
            "price" : purchasePrice,
            "buyer_id" : buyerId,
            "data" : [props.match.params.id],
            "process": 'direct-sell'
        }
        const sell = await lead(data, 'bulk')
        if(sell && sell["code"] == 201){
            toggle(false)
            Alerts.success(sell["message"])
            Alerts.info('Please wait a few moments while we update this leads status.')
        }
    }

    const handleBulkReturn = async e => {
        e.preventDefault()
        setReturnModal(true)
    }

    const handleReturn = async (buyer_id, return_email, return_reason, confirmation_number) => {
            const data = {
                "buyer_id" : buyer_id,
                "return_email": return_email,
                "return_reason": return_reason,
                "confirmation_number": confirmation_number,
                "data" : [props.match.params.id],
                "process": 'return'
            }
            const returnLead = await lead(data, 'bulk')
            if(returnLead && returnLead["code"] === 201){
                setReturnModal(false)
                Alerts.success(returnLead["message"])
            } else {
                Alerts.error(returnLead)
            } 
    }

    const handleBulkStatusUpdate = async e => {
        const data = {
            "data" : [props.match.params.id],
            "process": 'status-update',
            "status" : e.target.value
        }
        const bulkStatus = await lead(data, 'bulk')
        if( bulkStatus && bulkStatus["code"] == 201){
            Alerts.success(bulkStatus["message"])
            Alerts.info('Please wait a few moments while we update this leads status.')
        }
    }


    const handleLeadUpdate = async e => {
        const update = await lead(data["lead"], 'update')
        if(update && update["code"] === 200){
            getLeads()
            getLeadTablePivot()
            setLeadUpdateSuccess(true)
            Alerts.success('Lead updated succesfully')
        } else {
            const error = {
                name: "Error",
                message: update
            }
            Alerts.error(error)
        }
    }

    const handleLeadChange = e => {
        setData({...data,  "lead": {
            ...data["lead"],
            [e.target.name]:e.target.value,
        }})
    }

    const Bread = (props) => {
        return (
          <div>
            <Breadcrumb>
              <BreadcrumbItem><Link to="/leads">Leads</Link></BreadcrumbItem>
              <BreadcrumbItem active>Edit Leads</BreadcrumbItem>
            </Breadcrumb>
          </div>
        );
      };

      const defaultColumnProperties = {
        sortable: true
      };
    
      const columns = [
        {
          key: "type",
          name: "Type",
        },
        {
          key: "message",
          name: "Message"
        },
        {
          key: "timestamp",
          name: "Timestamp"
        }
      ].map(c => ({ ...c, ...defaultColumnProperties }));
    
      const sortRows = (initialRows, sortColumn, sortDirection) => rows => {
        const comparer = (a, b) => {
          if (sortDirection === "ASC") {
            return a[sortColumn] > b[sortColumn] ? 1 : -1;
          } else if (sortDirection === "DESC") {
            return a[sortColumn] < b[sortColumn] ? 1 : -1;
          }
        };
        return sortDirection === "NONE" ? initialRows : [...rows].sort(comparer);
      };

    const refreshData = () => {
        getLeads()
        getLeadTablePivot()
    }  

    return(
        <div>
            <Bread />
            <SoldModal
                modal={modal}
                toggle={toggle}
                handleSell={handleSell}
            />
             <ReturnModal
                modal={returnModal}
                toggle={returnToggle}
                lead_id={props.match.params.id}
                handleReturn={handleReturn}
                basic={basic}
            />
                    <div style={{paddingBottom: "20px"}}>
            <Card>
                <CardBody>
                    <BulkOptions 
                        handleBulkDelete={handleBulkDelete}
                        handleBulkApprove={handleBulkApprove}
                        handleBulkSold={handleBulkSold}
                        handleBulkStatusUpdate={handleBulkStatusUpdate}
                        status={status}
                        handleBulkReturn={handleBulkReturn}
                    />
            </CardBody>
            </Card>
        </div> 
            {data && data["lead"]?
                <SoldStatus 
                    currentStatus={currentStatus} 
                    status={displayStatus}
                />
             : ''}   
            <Row>
            <Card style={{marginTop: "10px"}}>
                    <CardBody>
                    <FormGroup>
                        <Label>QC Comments</Label>    
                        <Form>
                                <Input value={qcComments} type="textarea" onChange={e => setQcComments(e.target.value)} /><br />
                                <Button color="primary" onClick={e => updateQcComments(e)}>Update Comments</Button>
                        </Form> 
                    </FormGroup>
                    <hr />
                    <FormGroup>
                        <h4><strong>Primary Information</strong></h4>
                        <dl>
                            <dt>Lead Id</dt>
                            <dd>{basic && basic[0] && basic[0]["lead_id"] ? basic[0]["lead_id"]  : ''}</dd>
                            <dt>Vendor</dt>
                            <dd>{basic && basic[0] && basic[0]["vendor"] ? basic[0]["vendor"]  : ''}</dd>
                            <dt>Vertical</dt>
                            <dd>{basic && basic[0] && basic[0]["vertical_label"] ? basic[0]["vertical_label"]  : ''}</dd>
                            <dt>Price</dt>
                            <dd>{basic && basic[0] && basic[0]["price"] ? basic[0]["price"]  : ''}</dd>
                            <dt>Buyer</dt>
                            <dd>{basic && basic[0] && basic[0]["buyer"] ? basic[0]["buyer"]  : 'none'}</dd>
                            <dt>Sold Price</dt>
                            <dd>{basic && basic[0] && basic[0]["sold_price"] ? basic[0]["sold_price"]  : 'none'}</dd>
                            <dt>Added</dt>
                            <dd>{basic && basic[0] && basic[0]["added"] ? basic[0]["added"]  : ''}</dd>
                            <dt>Updated</dt>
                            <dd>{basic && basic[0] && basic[0]["updated"] ? basic[0]["updated"]  : ''}</dd>
                            <dt>QC Comments</dt>
                            <dd>{basic && basic[0] && basic[0]["qc_comment"] ? basic[0]["qc_comment"]  : ''}</dd>
                        </dl>  
                    </FormGroup>   
                    </CardBody>
                </Card>
                <Col>
                {currentStatus && currentStatus !== "1" ?
                    potentialBuyers && potentialBuyers.length > 0 ?
                    <Card>
                        <CardHeader>Potential Buyers</CardHeader>
                        <CardBody>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Lead Price</th>
                                    <th>Credits</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(potentialBuyers).map(items => 
                                    <tr key={potentialBuyers[items].id}>
                                        <td>{potentialBuyers[items].company_name}</td>
                                        <td>{potentialBuyers[items].lead_price}</td>
                                        <td>{potentialBuyers[items].credits}</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table> 
                        </CardBody> 
                    </Card>
                    :  
                    <Alert color="primary">
                        We couldn't find any potential buyers for this lead
                    </Alert>
                    : ''}
                    <Card style={{height: "400px", overflowY: "auto", marginTop: "10px"}}>
                          <CardHeader>Previous attemps <button onClick={e => collapse()} className="close"><FontAwesomeIcon icon={['fas', "compress"]}/></button></CardHeader>
                          {compressDisplay ?
                          <Table size="sm">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Message</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stack && stack.length > 0 ? Object.keys(stack).map(items => 
                                    <tr key={stack[items].id}>
                                        <td>{stack[items].type}</td>
                                        <td style={{wordBreak: "break-all"}}>{stack[items].message}</td>
                                        <td>{stack[items].timestamp}</td>
                                    </tr>
                                ):  
                                    <tr>
                                        <td>No information abou this lead"</td>
                                    </tr>
                                }
                            </tbody>
                        </Table> 
                        : ''}
                    </Card>
                    <Display 
                        data={data && data["lead"] ? data["lead"] : []}
                        name="Lead Information"
                        status={displayStatus}
                        handleLeadUpdate={handleLeadUpdate}
                        handleLeadChange={handleLeadChange}
                        leadUpdateSucces={leadUpdateSucces}
                    />
                    <LeadDataDisplay 
                        data={data && data["leadData"] ? data["leadData"] : []}
                        id={data && data["lead"] && data["lead"]["id"] ? data["lead"]["id"] : ''}
                        vertical_id={data && data["lead"] && data["lead"]["vertical_id"] ? data["lead"]["vertical_id"] : ''}
                        name="Lead Data"
                        getLeads={getLeads}
                        refreshData={refreshData}
                    />
                    {returnData ?
                        <Card style={{marginTop: "10px"}}>
                            <CardHeader>Return Information</CardHeader>
                            <CardBody>
                                <Form>
                                    <FormGroup>
                                        <Label>Buyer Id</Label>
                                        <Input type="text" name="buyer_id" value={returnData["buyer_id"]} disabled  />
                                    </FormGroup>    
                                    <FormGroup>
                                        <Label>Lead Id</Label>
                                        <Input type="text" name="lead_id" value={returnData["lead_id"]} disabled />
                                    </FormGroup>  
                                    <FormGroup>
                                        <Label>Return Email</Label>
                                        <Input type="email" name="return_email" value={returnData["return_email"]} disabled />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Return Reason</Label>  
                                        <Input type="textarea" name="return_reason" value={returnData["return_reason"]} disabled/>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Confirmation Number</Label>  
                                        <Input type="text" name="confirmation_number" value={returnData["confirmation_number"]} disabled />
                                    </FormGroup>  
                                </Form> 
                            </CardBody>
                        </Card>
                        : ''}
                </Col>
            </Row>     
        </div>    
    )
}

const BulkOptions = props => {
    return(
    <div>
        <Row style={{width: "100%"}}>
        <Col>
        <div>
            <Row>
                <Col xs="5">
                    <a href="#" id="approve" onClick={e => props.handleBulkApprove(e)}><FontAwesomeIcon icon={['fas', "check-circle"]} size="lg" style={{marginRight: "20px"}}/></a>
                    <UncontrolledTooltip placement="top" target="approve">
                        Approve this lead and try to sell
                    </UncontrolledTooltip>
                    <a href="#" id="sold" onClick={e => props.handleBulkSold(e)} ><FontAwesomeIcon icon={['fas', "dollar-sign"]} size="lg" style={{marginRight: "20px"}}/></a>
                    <UncontrolledTooltip placement="top" target="sold">
                        Sell this lead to a specific vendor. The system will not try to sell them, it assumes they have already been sold.
                    </UncontrolledTooltip>
                    <a href="#" id="delete" onClick={e => props.handleBulkDelete(e)}><FontAwesomeIcon icon={['fas', "trash"]} size="lg" style={{marginRight: "20px"}}/></a>
                    <UncontrolledTooltip placement="top" target="delete">
                        Delete this lead.  Becareful! This lead will be gone once you delete them.
                    </UncontrolledTooltip>
                    <a href="#" id="return" onClick={e => props.handleBulkReturn(e)}><FontAwesomeIcon icon={['fas', "share-square"]} size="lg" style={{marginRight: "20px"}}/></a>
                    <UncontrolledTooltip placement="top" target="return">
                        Return this lead.
                    </UncontrolledTooltip>
                </Col>
                <Col>    
                    <Input onChange={(e) => props.handleBulkStatusUpdate(e)} type="select" name="status">
                        <option value="">Additional status updates...</option>
                        {props.status && props.status.length > 0 ? Object.keys(props.status).map((items,idx) => 
                            <option key={idx} data-tag={props.status[items].name} value={props.status[items].id}>{props.status[items].name}</option>
                        ): <option></option>}
                    </Input>
                </Col>
            </Row> 
        </div>
        </Col>
        </Row>
        </div>
    )
}

const Display = props => {
    const [edit, setEdit] = useState(false)
    const toggle = () => setEdit(!edit)

    useEffect(() => {
        if(props.leadUpdateSucces){
            toggle()
        }
    },[props.leadUpdateSucces])

    return(
        <Card style={{height: "300px", overflowY: "auto", marginTop: "10px"}}>
         {edit === true ?
            <LeadEdit 
                modal={edit}
                toggle={toggle}
                data={props.data}
                status={props.status}
                handleLeadUpdate={props.handleLeadUpdate}
                handleLeadChange={props.handleLeadChange}
            />
            : ''}
        <CardHeader>{props.name}<button onClick={e => toggle()} className="close"><FontAwesomeIcon icon={['fas', "edit"]}/></button></CardHeader>
            <CardBody>
                    {Object.keys(props.data).map((items,idx) => 
                        // edit === true ?
                        //     <Form key={items.id}>
                        //         <Label>{items}</Label>
                        //         <Input type="text" value={props.data[items]} />
                        //     </Form>    
                        // :    
                        <dl key={idx}>
                            <dt>{items}</dt>
                            <dd>{props.data[items]}</dd>
                        </dl>
                        
                    )}
            </CardBody>
        </Card> 
    )
}

const LeadEdit = props => {
    const [verticals, setVerticals] = useState([])

    useEffect(() => {
        getVerticals()
    },[])

    const getVerticals = async () => {
        const results = await vertical()
        const { items, _meta } = results || []
        setVerticals(items)
    }    
    return (
        <Modal isOpen={props.modal} toggle={props.toggle}>
        <ModalHeader toggle={props.toggle}>Edit Lead</ModalHeader>
        <ModalBody>
                {Object.keys(props.data).map((items,idx) => 
                    
                    <Form key={idx}> 
                        {items !== "lead_id" ?
                        <Fragment>
                                {!(items == 'first_name' || items == 'last_name' || items == 'email' || items == 'state') ?
                                    <Label>{items}</Label>
                                : ''}    
                                {items === "status" ?
                                    <Input name={items} type="select" onChange={e => props.handleLeadChange(e)} value={props.data[items]}>
                                        {Object.keys(props.status).map((items,idx) =>
                                            <option key={idx} value={props.status[items].id}>{props.status[items].name}</option>
                                        )}
                                    </Input>
                                : items === "vertical_id" ?
                                <Input name={items} type="select" value={props.data[items]} onChange={e => props.handleLeadChange(e)}>
                                    {verticals && verticals.length > 0 ? Object.keys(verticals).map((items,idx) =>
                                        <option key={idx} value={verticals[items].id}>{verticals[items].label}</option>
                                    ) : ''}
                                </Input>

                                :
                                !(items == 'first_name' || items == 'last_name' || items == 'email' || items == 'state') ?
                                <Input 
                                    onChange={e => props.handleLeadChange(e)}
                                    type="text" 
                                    name={items}
                                    value={props.data[items] || ''} 
                                    disabled={items === "id" ? "disabled" : ''}
                                />
                                : ''
                                }
                          </Fragment>      
                        : ''}          
                    </Form>
                )}   
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={e => props.handleLeadUpdate(e)}>Update Lead</Button>{' '}
          <Button color="secondary" onClick={props.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
}

const LeadDataDisplay = props => {
    const [edit, setEdit] = useState(false)
    const toggle = () => setEdit(!edit)

    const toggleUpdate = () => {
        setEdit(!edit)
        props.getLeads()
    }

    return(
        <Card style={{height: "300px", overflowY: "auto", marginTop: "10px"}}>
            {edit === true ?
            <LeadDataDisplayEdit 
                modal={edit}
                toggle={toggle}
                id={props.id}
                vertical_id={props.vertical_id}
                toggleUpdate={toggleUpdate}
                refreshData={props.refreshData}
            />
            : ''}
            <CardHeader>{props.name}
            <span className="d-flex justify-content-end"> <button onClick={e => toggle()} className="close"><FontAwesomeIcon icon={['fas', "edit"]}/></button></span>
            </CardHeader>
                <CardBody>
                    {Object.keys(props.data).map((items,idx) => 
                        // edit === true ?
                        //     <Form key={idx}>
                        //         <Label>{items}</Label>
                        //         <Input type="text" name={items} value={props.data[items]} onChange={e => props.handleLeadData(e)} />
                        //     </Form>    
                        // :    
                        <dl key={idx}>
                            <dt>{items}</dt>
                            <dd>{props.data[items]}</dd>
                        </dl>
                        
                    )}
                </CardBody>
        </Card> 
    )
}

const LeadDataDisplayEdit = props => {
    const [data, setData] = useState([])
    const [field, setField] = useState([])
    const [newField, setNewField] = useState('')
    const [newValue, setNewValue] = useState('')

    useEffect(() => {
        getData()
        getField()
    },[])

    const getData = async () =>{
        const search = await leadData('','by-id', {id: props.id})
        if(search && search["code"] === 200){
            setData(search["data"])
        }
    }

    const getField = async () => {
        const search = await verticalFieldDefinition('', 'mapping', { 'vertical_id': props.vertical_id})
        setField(search)
    }

    const addNewField = async (e) => {
        e.preventDefault()
        const data = {
            id: props.id,
            vertical_id: props.vertical_id,
            field_id: newField,
            data: newValue
        }
        const update = await leadData(data, 'updateData')
        if(update && update["code"] === 200){
            getData()
            props.refreshData()
            Alerts.success('New field successfully added')
        } else {
            const error = {
                name: "Error",
                message: "There was a problem updating this lead"
            }
            Alerts.error(error)
        }
    }

    const handleUpdate = (e, id, index) => {
        let update = [...data]
        update[index]["data"] = e.target.value
        setData(update)
    }

    const handleFieldUpdate = (e, index) => {
        let update = [...data]
        update[index]["field_id"] = e.target.value
        setData(update)
    }

    const handleLeadDataUpdate = async (e) => {
        e.preventDefault()
        const update = await leadData(data, 'update')
        if(update && update["code"] === 200){
            props.toggleUpdate()
            Alerts.success('Lead Data updated successfully')
        }
    }

    return(
        <Modal size="lg" isOpen={props.modal} toggle={props.toggle}>
        <ModalHeader toggle={props.toggle}>Edit Lead Data</ModalHeader>
        <ModalBody>
                <div className="jumbotron">
                <Label>Add a new field</Label>    
                <Input type="select" value={newField} onChange={e => setNewField(e.target.value)}>
                        <option value="">Select a field...</option>
                        {Object.keys(field).map((items,idx) => 
                            <option key={idx} value={field[items].field_id}>{field[items].label}</option>
                        )}
                </Input>
                <br />
                <Input value={newValue} onChange={e => setNewValue(e.target.value)}></Input>
                </div>
                <Button onClick={e => addNewField(e)}>Add Field</Button>
                <br />
                {Object.keys(data).map((items, idx) => 
                    <Form key={data.id} style={{border: "1px solid", backgroundColor: "#eee", padding: "7px", margin: "8px"}}> 
                        <FormGroup>
                            <Input type="select" value={data[items].field_id} onChange={e => handleFieldUpdate(e, idx)}>
                                {Object.keys(field).map((items,idx) => 
                                    <option key={idx} value={field[items].field_id}>{field[items].label}</option>
                                )}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Input value={data[items].data} onChange={e => handleUpdate(e, data.id, idx)} />
                        </FormGroup>    
                    </Form>
                )}   
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={e => handleLeadDataUpdate(e)}>Update Lead Data</Button>{' '}
          <Button color="secondary" onClick={props.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
}



const SoldStatus = props => {

    const statusColor = {
        1: "success",
        2: "primary",
        3: "warning",
        4: "danger",
        5: "warning",
        6: "info",
        7: "danger",
        8: "light",
        9: "light",
        10: "light",
        11: "light",
        12: 'light'
    }

    const statusName = props.status && props.status.length > 0 ? Object.keys(props.status).map(items => {
        if(parseInt(props.status[items].id) === parseInt(props.currentStatus)){
            return props.status[items].name
        }
    })  : []
    
    return(
        <Alert color={statusColor[props.currentStatus]}>{statusName}</Alert>
    )
}

const SoldModal = props => {
    const [order, setOrder] = useState([])
    const [buyer, setBuyer] = useState([])
    const [buyerId, setBuyerId] = useState(0)
    const [orderId, setOrderId] = useState('')
    const [purchasePrice, setPurchasePrice] = useState(0)
    const [buyerCompany, setBuyerCompany] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            const buyerSearch = await buyers('', 'search')
            setBuyer(buyerSearch && buyerSearch.items ? buyerSearch.items : [])
        }
        fetchData()
    }, [])

    useEffect(() => {
        if(buyerId !== 0){
            const orderFetch = async () => {
                const orderSearch = await orders('', 'by-id', {'id' : buyerId})
                setOrder(orderSearch)
            }
            orderFetch()
        }
    }, [buyerId])


  
    return (
      <div>
        <Modal isOpen={props.modal} toggle={props.toggle}>
          <ModalHeader toggle={props.toggle}>Sell lead</ModalHeader>
          <ModalBody>
              <Form>
                    <Input type="select" onChange={e => setBuyerId(e.target.value)}>
                        <option value="">Select buyer to sell to...</option>
                        {buyer && buyer.length > 0 ?
                            Object.keys(buyer).map((items,idx) => 
                                <option key={idx} value={buyer[items].id}>{buyer[items].company_name}</option>
                            )
                            : <option></option>}
                    </Input>
                    <br />
                    {order && order.length > 0 ?
                    <Input type="select" onChange={e => setOrderId(e.target.value)}>
                        <option value="">Select purchase order number...</option>
                            {Object.keys(order).map((items,idx) => 
                                <option key={idx} value={order[items].id}>{order[items].po_number}</option>
                            )}
                    </Input>
                    : ''}
                    <br />
                    {orderId !== '' ?
                        <Fragment>
                         <Label>Purchase Price</Label> 
                        <Input type="number" min="1" step="any" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} />
                        <br />
                        {Object.keys(order).map((items,idx) => {
                            if(order[items].id === parseInt(orderId)){
                                return(
                                    <dl key={idx}>
                                        <dt>Credits remaining</dt>
                                        <dd>{order[items].credits}</dd>
                                        <dt>Lead purchase price</dt>
                                        <dd>{order[items].lead_price}</dd>
                                    </dl>   
                                )
                            }
                        })}
                        </Fragment>
                    : ''}
               </Form>   
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={e => props.handleSell(orderId, buyerId, purchasePrice)}>Sell these lead</Button>{' '}
            <Button color="secondary" onClick={props.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }

  const ReturnModal = props => {

    const initialState = {
        buyer_id: '',
        lead_id: '',
        return_email: '',
        return_reason: '',
        confirmation_number: new Date().valueOf()
    }
    const [buyer, setBuyer] = useState([])
    const [data, setData] = useState(initialState)

    useEffect(() => {
        const fetchData = async () => {
            const buyerSearch = await buyers('', 'search')
            setBuyer(buyerSearch && buyerSearch.items ? buyerSearch.items : [])
        }
        fetchData()
    }, [])

    const updateForm = e => {
        setData({...data,
            [e.target.name]: e.target.value,
            lead_id: props.lead_id
        })
    }

    return(
        <Modal isOpen={props.modal} toggle={props.toggle}>
        <ModalHeader toggle={props.toggle}>Return lead</ModalHeader>
        <ModalBody>
            <Form>
                  <Input type="select" name="buyer_id" value={props.basic && props.basic[0] && props.basic[0]["buyer_id"] ? props.basic[0]["buyer_id"] : data.buyer_id} onChange={e => updateForm(e)}>
                      <option value="">Buyer</option>
                      {buyer && buyer.length > 0 ?
                          Object.keys(buyer).map((items,idx) => 
                              <option key={idx} value={buyer[items].id}>{buyer[items].company_name}</option>
                          )
                          : <option></option>}
                  </Input>
                  <br />
                  <FormGroup>
                    <Label>Return Email</Label>
                    <Input type="email" name="return_email" value={data.return_email} onChange={e => updateForm(e)}/>
                  </FormGroup>
                  <FormGroup>
                    <Label>Return Reason</Label>  
                    <Input type="textarea" name="return_reason" value={data.return_reason} onChange={e => updateForm(e)}/>
                  </FormGroup>
                  <FormGroup>
                    <Label>Confirmation Number</Label>  
                    <Input type="text" name="confirmation_number" value={data.confirmation_number} disabled onChange={e => updateForm(e)}/>
                  </FormGroup>  
             </Form>   
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={e => props.handleReturn(data.buyer_id, data.return_email, data.return_reason, data.confirmation_number)}>Return Lead</Button>{' '}
          <Button color="secondary" onClick={props.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
}

export default withRouter(LeadDisplay)
