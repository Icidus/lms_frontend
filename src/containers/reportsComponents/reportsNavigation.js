import React, {Fragment} from 'react'
import {Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, Card, CardBody, Modal, ModalHeader} from 'reactstrap'
import DisplayLeads from './displayLeads'
import VendorReport from './vendorReport'
import BuyerReport from './buyerReport'
import BuyerVendorsReport from './buyerVendorReport'
import classnames from 'classnames';

function ReportsNavigation(props){

    return(
    <Fragment>
        <Modal isOpen={props.showLeads} toggle={props.toggleShowLeads} size="xl">
            <ModalHeader toggle={props.toggleShowLeads}>Leads</ModalHeader>
            <Card>
                <DisplayLeads
                    leads={props.leads}
                    toggleShowLeads={props.toggleShowLeads}
                    setLeads={props.setLeads}
                    loading={props.loading}
                    history={props.history}
                />
            </Card>
        </Modal>   

        <Modal isOpen={props.showVendors} toggle={props.toggleShowVendors} size="xl">
            <ModalHeader toggle={props.toggleShowVendors}>Buyer - Vendors</ModalHeader>
            <Card>
                <BuyerVendorsReport
                    buyerVendors={props.buyerVendors}
                    toggleShowLeads={props.toggleShowVendors}
                    loading={props.loading}
                />
            </Card>
        </Modal>     
   <div>
   <Nav tabs>
   <NavItem>
     <NavLink
       className={classnames({ active: props.activeTab === 'vendor' })}
       onClick={() => { props.toggle('vendor'); }}
     >
       Vendor
     </NavLink>
   </NavItem>
   <NavItem>
     <NavLink
       className={classnames({ active: props.activeTab === 'buyer' })}
       onClick={() => { props.toggle('buyer'); }}
     >
       Buyer
     </NavLink>
   </NavItem>
   {/* <NavItem>
     <NavLink
       className={classnames({ active: props.activeTab === 'invoice' })}
       onClick={() => { props.toggle('invoice'); }}
     >
       Invoice
     </NavLink>
   </NavItem> */}
 </Nav>
 <TabContent activeTab={props.activeTab}>
   <TabPane tabId="vendor">
     <Row>
       <Col>
           <Card style={{marginTop: "10px"}}>
               <CardBody>
                   <VendorReport
                       activeTab={props.activeTab}
                       vertical={props.vertical}
                       getLeads={props.getLeads}
                   />
           </CardBody>
           </Card>
       </Col>
     </Row>
   </TabPane>
   <TabPane tabId="buyer">
   <Row>
       <Col>
           <Card style={{marginTop: "10px"}}>
               <CardBody>
                    <BuyerReport
                        activeTab={props.activeTab}
                        vertical={props.vertical}
                        getLeads={props.getLeads}
                        getVendors={props.getVendors}
                    />
                </CardBody>
           </Card>
       </Col>
     </Row>
   </TabPane>
   <TabPane tabId="invoice">
     <Row>
       <Col>

       </Col>
     </Row>
   </TabPane>
 </TabContent>
   </div>
 </Fragment>
    )
}

export default ReportsNavigation