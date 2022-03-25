import React, { useState, useEffect } from 'react'
import { Table, Button, Row, Col, Form, Input, Label, FormGroup, TabContent, TabPane, Nav, NavItem,NavLink, Card, Breadcrumb, BreadcrumbItem, BreadCrumbNavigation,Modal, ModalHeader, ModalBody, ModalFooter, CardTitle, CardText } from 'reactstrap'
import ReactDataGrid from "react-data-grid";
import classnames from 'classnames';

function AdminTools(){
    const [activeTab, setActiveTab] = useState('order');
    const toggle = tab => {
        if(activeTab !== tab) setActiveTab(tab);
      }

    return(
        <div>
        <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'search' })}
            onClick={() => { toggle('search'); }}
          >
            Search
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'batch' })}
            onClick={() => { toggle('batch'); }}
          >
            Batch Update
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === 'return' })}
            onClick={() => { toggle('return'); }}
          >
            Returns Batch Update 
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="order">
          <Row>
            <Col>
                <Card body>
                    <CardTitle>Order Information</CardTitle>
                    <CardText>
                    {data ? data.map((items, index) => 
                    <div key={index}>
                        <dl>
                            {Object.keys(items).map((key) => 
                                <span key={key}>
                                    <dt>{key}</dt>
                                    {edit 
                                        ? key === 'open' 
                                            ? 
                                                <Input type="select" name="open" defaultValue={items[key]} onChange={(e) => handleOrderEdit(e, index)}>
                                                    <option value="0">False</option>
                                                    <option value="1">True</option>
                                                </Input>

                                             : <Input type="text" onChange={(e) => handleOrderEdit(e, index)} name={key} value={items[key]} />
                                    : key === 'open' 
                                        ? items[key] === 1 ? <dd>true</dd> : <dd>false</dd>
                                        : <dd>{items[key]}</dd>
                                    }                        
                                </span>    
                            )}
                        </dl>
                        <Button color="primary" onClick={(e) => handleEdit('orderEdit')}>Edit</Button>{' '}
                        {edit ? <Button color="success" onClick={(e) => handleEditSubmit(e)}>Save Changes</Button> : ''}
                    </div>   
                    ) : ''}
                    </CardText>    
                </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="buyer">
          <Row>
            <Col>
              <Card body>
                <CardTitle>Buyer</CardTitle>
                <CardText>
                {data && data.length ? data.map((items, index) => 
                    <dl key={index}>
                        {Object.keys(items).map((key) => 
                            <span key={key}>
                                <dt>{key}</dt>
                                <dd>{items[key]}</dd>
                            </span>    
                        )}
                    </dl>
                ) : ''}
                </CardText>
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="sold">
          <Row>
            <Col>
                <Card body>
                <Table>
                    <thead>
                        <tr>
                            <th>Vendor Name</th>
                            <th>Vertical</th>
                            <th>Sold Price</th>
                            <th>Sold Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>   
                        {leads && leads.length > 0 ?Object.keys(leads).map((items,idx) => 
                            <tr key={idx}>
                                <td>{leads[items].vendor_name}</td>
                                <td>{leads[items].vertical_label}</td>
                                <td>{leads[items].sold_price}</td>
                                <td>{leads[items].sold_date}</td>
                                <td><Button color="success" onClick={e => viewLead(e, leads[items].lead_id)}>View Lead</Button></td>
                            </tr>
                        ): <tr><td>No leads purchased</td></tr>}
                    </tbody>     
                </Table> 
                </Card>   
            </Col>
          </Row>
        </TabPane>
      </TabContent>
      </div>   
    )
}

export default AdminTools