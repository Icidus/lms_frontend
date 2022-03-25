import React, { useState, useEffect, useReducer, Fragment } from 'react'
import { Row, Col, Table, Input, Form, FormGroup } from 'reactstrap'
import { vertical, verticalFieldDefinition, vendors } from '../util/db'
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

import { base } from '../config/endpoints'
function Instructions(){



    const [fields, setFields] = useState([])
    const [verticals, setVerticals] = useState([])
    const [vendor, setVendor] = useState([])
    const [selectVertical, setSelectVertical] = useState(0)
    const [selectVendor, setSelectVendor] = useState(0)
    const [vendorData, setVendorData] = useState([])

    useEffect(() => {
        requestVerticals()
    }, []);

    useEffect(() => {
        getFields()
    },[selectVertical])

    useEffect(() => {
        getVendorInfo()
    },[selectVendor])

    const requestVerticals = async () => {
        const results = await vertical()
        const vendorResults = await vendors('', 'search', '')
        setVerticals(results && results.items ? results.items : [])
        setVendor(vendorResults && vendorResults.items ? vendorResults.items : [])
    }

    const getFields = async () => {
        const get = await vertical('', 'fields', { 'id': selectVertical} )
        const { items } = get || []
        setFields(get)
    }

    const getVendorInfo = async () => {
        const get =  await vendors('', 'search', {'filter[id]': selectVendor})
        const { items } = get || []
        setVendorData(items)
    }

    const handleVerticalSelect = (value) => {
        setSelectVertical(value)
    }

    const handleVendorSelect = value => {
        setSelectVendor(value)
    }


    return(
        <div>
            <h3>Posting instructions</h3>
            {fields && fields.length ?
            <div>
                <PDFDownloadLink document={<PDFDocument base={base} fields={fields} post_key={vendorData && vendorData.length ? vendorData[0].post_key : ''} selectVertical={selectVertical} />} fileName="instructions.pdf">
                    {({ blob, url, loading, error }) => (loading ? <button type="button" className="btn btn-primary">Loading intructions...</button> : <button type="button" className="btn btn-primary">Download Instructions</button>)}
                </PDFDownloadLink>
            </div>
            : ''}
            <br />
            <InstructionsVendorForm
                vendor={vendor}
                handleVendorSelect={handleVendorSelect}
            />
            <br />
            <InstructionsVerticalForm
                verticals={verticals}
                handleVerticalSelect={handleVerticalSelect}
            />
            {selectVendor && selectVendor !== 0 && selectVertical && selectVertical !==0 ?
            <Fragment>
            <p>Url: {base}leads/post</p>
            <p>Ping must included the following information:</p>
            <dl className="row">
                <dt className="col-sm-3">Data type</dt>
                <dd class="col-sm-9">Current data types accepted: JSON.  Format: type=JSON</dd>
                <dt className="col-sm-3">Zipcode</dt>
                <dd class="col-sm-9">Format: zip_code=xxxxxx</dd>
                <dt className="col-sm-3">Post Key</dt>
                <dd class="col-sm-9">Format: post_key={vendorData && vendorData.length ? vendorData[0].post_key : ''}</dd>
                <dt className="col-sm-3">Vertical</dt>
                <dd class="col-sm-9">vertical={selectVertical}</dd>
                <dt className="col-sm-3">Required data below</dt>
                <dd class="col-sm-9">All required ping data must be included.  Format is "name"="value"</dd>
            </dl>
            <div className="table-responsive">     
            <Table>
                <thead>
                    <tr>
                        <th scope="col">Label</th>
                        <th scope="col">Name</th>
                        <th scope="col">Required Post</th>
                        <th scope="col">Required Ping</th>
                    </tr>
                </thead>
                <tbody>  
                {fields && fields.length ? Object.keys(fields).map((items, idx) => 
                        <tr key={idx}>
                            <td>{fields[items].label}</td>
                            <td>{fields[items].name}</td>
                            <td>{fields[items].required_post === "1" ? 'Required' : 'Not Required'}</td>
                            <td>{fields[items].required_ping === "1" ? "Required" : "Not Required"}</td>
                        </tr>
                    ): <tr><td></td></tr>}
                </tbody>    
            </Table>
            </div>  
            <br />
            <h4>Example</h4>
            <Example 
                fields={fields}
                base={base}
                post_key={vendorData && vendorData.length ? vendorData[0].post_key : ''}
                selectVertical={selectVertical}
            />
            <br />
            <h4>Respones</h4>
            <p>Responses are sent in JSON</p>
            <Table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Code</th>
                        <th>Message</th>
                    </tr>    
                </thead>   
                <tbody>
                    <tr>
                        <td>Success</td>
                        <td>201</td>
                        <td>Post successfully submitted</td>
                    </tr>    
                    <tr>
                        <td>Post key error</td>
                        <td>400</td>
                        <td>Post key missing</td>
                    </tr>  
                    <tr>
                        <td>Vertical Missing</td>
                        <td>400</td>
                        <td>Vertical missing</td>
                    </tr>  
                    <tr>
                        <td>Post field missing</td>
                        <td>400</td>
                        <td>Required post field missing [Missing fields]</td>
                    </tr>  
                    <tr>
                        <td>Duplicate</td>
                        <td>400</td>
                        <td>Duplicate</td>
                    </tr> 
                </tbody>     
            </Table>    
            </Fragment>
            : '' } 
        </div>    
    )
}

    const PDFDocument = props => {
        const styles = StyleSheet.create({
            body: {
              paddingTop: 35,
              paddingBottom: 65,
              paddingHorizontal: 35,
            },
            title: {
              fontSize: 24,
              textAlign: 'center'
            },
            author: {
              fontSize: 12,
              textAlign: 'center',
              marginBottom: 40
            },
            subtitle: {
              fontSize: 18,
              margin: 12
            },
            text: {
              margin: 12,
              fontSize: 14,
              textAlign: 'justify'
            },
            image: {
              marginVertical: 15,
              marginHorizontal: 100,
            },
            header: {
              fontSize: 12,
              marginBottom: 20,
              textAlign: 'center',
              color: 'grey',
            },
            pageNumber: {
              position: 'absolute',
              fontSize: 12,
              bottom: 30,
              left: 0,
              right: 0,
              textAlign: 'center',
              color: 'grey',
            },
            table: { 
                display: "table", 
                width: "auto", 
                borderStyle: "solid", 
                borderWidth: 1, 
                borderRightWidth: 0, 
                borderBottomWidth: 0 
              }, 
              tableRow: { 
                margin: "auto", 
                flexDirection: "row" 
              }, 
              tableCol: { 
                width: "25%", 
                borderStyle: "solid", 
                borderWidth: 1, 
                borderLeftWidth: 0, 
                borderTopWidth: 0 
              }, 
              tableCell: { 
                margin: "auto", 
                marginTop: 5, 
                fontSize: 10 
              },
              pre: { 
                  display: 'block',
                  padding: '10px 30px', 
                  margin: '0', 
                  overflow: 'scroll'
            }
            });

            let list = [
                {
                        type: "JSON",
                        zip_code: "90210",
                        post_key: props.post_key,
                        vertical: props.selectVertical
                
                }
            ]
            Object.keys(props.fields).map((items, idx) => 
                props.fields[items].name === 'zip_code' ?
                    list[0][props.fields[items].name] =  "90210"
                    :
                    list[0][props.fields[items].name] =  "test"
                )

        return(
        <Document>
            <Page style={styles.body}>
                <Text style={styles.subtitle}>Posting instructions</Text>
                <Text style={styles.text}>Ping must included the following information:</Text>
                <Text style={styles.text}>Data Type - Current data types accepted: JSON. Format: type=JSON</Text>
                <Text style={styles.text}>Zipcode - Format: zip_code=xxxxxx</Text>
                <Text style={styles.text}>Post key - Format: post_key={props.post_key}</Text>
                <Text style={styles.text}>Vertical - Format: vertical={props.selectVertical}</Text>
                <Text style={styles.text}>Required data below - All required ping data must be included. Format is "name"="value"</Text>
                <View style={styles.table}> 
                    <View style={styles.tableRow}> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>Label</Text> 
                        </View> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>Name</Text> 
                        </View> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>Required Post</Text> 
                        </View> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>Required Ping</Text> 
                        </View> 
                    </View>
                    {props.fields && props.fields.length ? Object.keys(props.fields).map((items, idx) => 
                        <View style={styles.tableRow}> 
                            <View style={styles.tableCol}> 
                                <Text style={styles.tableCell}>{props.fields[items].label}</Text> 
                            </View> 
                            <View style={styles.tableCol}> 
                                <Text style={styles.tableCell}>{props.fields[items].name}</Text> 
                            </View> 
                            <View style={styles.tableCol}> 
                                <Text style={styles.tableCell}>{props.fields[items].required_post === "1" ? 'Required' : 'Not Required'}</Text> 
                            </View>
                            <View style={styles.tableCol}> 
                                <Text style={styles.tableCell}>{props.fields[items].required_ping === "1" ? "Required" : "Not Required"}</Text> 
                            </View> 
                        </View>
                    ) : ''}        
                </View>   
                <View>
                    <Text style={styles.subtitle}>Example</Text>
                    <Text style={styles.text}>POST: {props.base}leads/post</Text>
                    <Text style={styles.pre}>{JSON.stringify(list, null, 2) }</Text>
                </View>  
                <View>
                    <Text style={styles.subtitle}>Error Codes</Text>
                </View>    
                <View style={styles.table}> 
                    <View style={styles.tableRow}> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>Type</Text> 
                        </View> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>Code</Text> 
                        </View> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>Message</Text> 
                        </View> 
                    </View>
                    <View style={styles.tableRow}> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>Success</Text> 
                        </View> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>201</Text> 
                        </View> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>Post successfully submitted</Text> 
                        </View>
                    </View>
                    <View style={styles.tableRow}> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>Post key error</Text> 
                        </View> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>400</Text> 
                        </View> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>Post key missing</Text> 
                        </View>
                    </View>
                    <View style={styles.tableRow}> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>Vertical Missing</Text> 
                        </View> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>400</Text> 
                        </View> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>Vertical missing</Text> 
                        </View>
                    </View>
                    <View style={styles.tableRow}> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>Post field missing</Text> 
                        </View> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>400</Text> 
                        </View> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>Required post field missing [Missing fields]</Text> 
                        </View>
                    </View>
                    <View style={styles.tableRow}> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>Duplicate</Text> 
                        </View> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>400</Text> 
                        </View> 
                        <View style={styles.tableCol}> 
                            <Text style={styles.tableCell}>Duplicate</Text> 
                        </View>
                    </View>
                </View>     
            </Page>
      </Document>
        )
    }

const InstructionsVendorForm = props => (
    <Form>
    <FormGroup>
        <Input onChange={(e) => props.handleVendorSelect(e.target.value)} className="form-control mb-2 mr-sm-2" type="select">
        <option>Select vendor..</option>
        {props.vendor && props.vendor.length ? Object.keys(props.vendor).map((items, idx) => 
            <option key={idx} value={props.vendor[items].id}>{props.vendor[items].company_name}</option>
        ) : ''}
        </Input>
    </FormGroup>
</Form>  
)

const Example = props => {
    let list = [
        {
                type: "JSON",
                zip_code: "90210",
                post_key: props.post_key,
                vertical: props.selectVertical
        
        }
    ]
    Object.keys(props.fields).map((items, idx) => 
        props.fields[items].name === 'zip_code' ?
            list[0][props.fields[items].name] =  "90210"
            :
            list[0][props.fields[items].name] =  "test"
        )

    return (    
    list && list.length ? 
    <div style={{background: 'white'}}>
        <p>POST: {props.base}leads/post</p>
        <pre>
            {JSON.stringify(list, null, 2) }
        </pre>
    </div>
    : ''
    )
}


const InstructionsVerticalForm = ({ verticals, handleVerticalSelect }) => {
    return (
        <Form>
        <FormGroup>
            <Input onChange={(e) => handleVerticalSelect(e.target.value)} className="form-control mb-2 mr-sm-2" type="select">
            <option>Select vertical for instructions..</option>
            {verticals && verticals.length ? Object.keys(verticals).map((items, idx) => 
                <option key={idx} value={verticals[items].id}>{verticals[items].label}</option>
            ) : ''}
            </Input>
        </FormGroup>
    </Form>   
    )
}


export default Instructions