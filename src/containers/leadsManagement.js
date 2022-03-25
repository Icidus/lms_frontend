import React, {useState, useEffect} from 'react'
import { Button, Input, Table, Row, Col, FormGroup, Progress, Card, Alert, CardBody, CardTitle, Label} from 'reactstrap'
import XLSX from 'xlsx'
import { vertical, fieldDefinition, verticalFieldDefinition, vendors, lead, universalFieldDefinition } from '../util/db'
import Select from 'react-select'
import Alerts from '../controller/alerts'
import { compileFunction } from 'vm';
import { isExists } from 'date-fns';

function NewLead(){

    const [csv, setCSV] = useState([])
    const [jsonCSV, setJSONCSV] = useState([])
    const [loading, setLoading] = useState(false)
    const [fileSubmitList, setFileSubmitList] = useState([])
    const [fileProcessedList, setFileProcessedList] = useState([])
    const [fileName, setFileName] = useState('data')
    const [processLoading, setProcessLoading] = useState(false)

    
    useEffect(() => {
        getSubmitFiles()
        getProcessedFiles()
    },[])

    useEffect(() => {
        setInterval(() => {
            getSubmitFiles()
            getProcessedFiles()
            setProcessLoading(true)
        }, 10000);    
    },[])

    const getSubmitFiles = async () => {
        const results = await lead('', 'get-submit-files')
        setFileSubmitList(results)
    }

    const getProcessedFiles = async () => {
        const results = await lead('', 'get-processed-files')
        if(results){
            setFileProcessedList(results)
            setTimeout(()=>{
                setProcessLoading(false)
               }, 1000)
        }
    }

    const handleUploadProcessing = (e) => {
        e.preventDefault()
        setLoading(true)
        handleUpload(e)
    }
    
    const handleUpload = (e) => {
        e.preventDefault();
        var files = e.target.files, f = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            let readedData = XLSX.read(data, {type: 'binary',cellDates:true});
            const wsname = readedData.SheetNames[0];
            const ws = readedData.Sheets[wsname];
            /* Convert array to json*/
            const dataParse = XLSX.utils.sheet_to_json(ws, {header:1, raw: false});
            setCSV(dataParse)
            var first = dataParse[0].join()
            var headers = first.split(',');
            var jsonData = [];
            for (var i = 1, length = dataParse.length; i < length; i++) {
                var myRow = dataParse[i].join("%&%");
                var row = myRow.split('%&%');
                var data = {};
                for (var x = 0; x < row.length; x++) {
                  data[headers[x]] = row[x];
                }
                jsonData.push(data);
            }    
            setJSONCSV(jsonData)
        };
        reader.readAsBinaryString(f)
        setLoading(false)
    }  

    const deleteProcessFile = async filename => {
        const list = {
            data: filename
        }
        const results = await lead(list, 'delete-process-file')
        setFileSubmitList(results)
        getSubmitFiles()
    }

    const processFile = async file => {
        const list = {
            filename: file,
        }    
        const results = await lead(list, 'manual')
        if(results && results["code"] === 201){
            Alerts.success('Your list has been submitted for processing.')
            getSubmitFiles()
        } else {
            const error = {
                name: "Server error",
                message: results
            }
            Alerts.error(error)
        }
    }

    return(
        <div>
               <div>
                {
                    fileProcessedList && fileProcessedList.length > 0 ?
                    <Card>
                    <CardBody>
                    <CardTitle>Files Processed {processLoading ? <small>Updating...</small>: ''}</CardTitle>
                    <Row>
                    <Col>
                    <ul>
                        {fileProcessedList.map(items => 
                                        <li>{items}</li>
                        )}
                    </ul>
                    </Col>
                    </Row>   
                    </CardBody>        
                </Card>
                : ''}   
            </div>  
            <div>
                {
                    fileSubmitList && fileSubmitList.length > 0 ?
                    <Card>
                    <CardBody>
                    <CardTitle>Files available for processing</CardTitle>
                    {fileSubmitList.map(items => 
                                <div style={{paddingBottom: "5px"}}>
                                <Row>
                                    <Col>
                                        {items}
                                    </Col>
                                    <Col>
                                        <Button color="warning" onClick={e => processFile(items)}>Process File</Button>
                                    </Col>
                                    <Col>
                                        <Button color="danger" onClick={e => deleteProcessFile(items)}>Delete File</Button>
                                    </Col>
                                </Row>  
                                </div> 
                        )}
                    </CardBody>        
                    </Card>
                     : ''
                }    
            </div>  
           <br />
            <Card>
                <CardBody>
            <p>Load new leads file</p>
            <Input type="file" onChange={e => handleUpload(e)}>CSV upload</Input>
                </CardBody>
            </Card>    
            <br />
            <div className="container-fluid">
            {loading ? <Alert color="primary">Loading csv...</Alert> : ''}

                {csv && csv.length ? 
                    <HandleCSVDisplay
                        data={csv}
                        jsonCSV={jsonCSV}
                        setJSONCSV={setJSONCSV}
                        setCSV={setCSV}
                        getSubmitFiles={getSubmitFiles}
                        fileName={fileName}
                        setFileName={setFileName}
                    />
                : ''}
            </div>
        </div>    
    )
}

const HandleCSVDisplay = ({data, jsonCSV, setJSONCSV, setCSV, getSubmitFiles, fileName, setFileName}) => {
    const [fullData, setFullData] = useState(false)
    const [verticalList, setVerticalList] = useState([])
    const [vendorList, setVendorList] = useState([])
    const [verticalID, setVerticalID] = useState()
    const [vendorID, setVendorID] = useState()
    const [fields, setFields] = useState([])
    const [universalFields, setUniversalFields] = useState([])
    const [total, setTotal] = useState(0)
    const [percentage, setPercentage] = useState(0)
    const [start, setStart] = useState(false)
    const [finish, setFinish] = useState(false)
    const [loading, setLoading] = useState(false)
    const header = data[0]
    const body = data.slice(0)
    const toggle = () => setFullData(!fullData);

    useEffect(() => {
        getVertical()
        getVendors()
        fetchUniversalData()
    }, []);
    
    const getVertical = async () => {
        const get = await vertical()
        const { items } = get || []
        setVerticalList(items)
    }

    const getFields = async (id) => {
        const get = await verticalFieldDefinition('', 'mapping', { 'vertical_id': id})
        setFields(get)
        setVerticalID(id)
    }

    const fetchUniversalData = async () => {
        const get = await universalFieldDefinition('', 'search')
        const { items } = get || []
        setUniversalFields(items)
    }

    const handleMapping = (e, header) => {
        const items = jsonCSV
        for (var i = 0; i < items.length; i++) {
            if(e.value === 'ignore'){
                delete items[i][header];
            } else {
                if(items[i][e.value] !== items[i][header]){
                    items[i][e.value] = items[i][header]
                    delete items[i][header];
                }
            }
        }
    }

    const getVendors = async () => {
        const get = await vendors('', 'search', '')
        const { items } = get || []
        setVendorList(items)
    }

    const processUpload = async () => {
        const list = {
                filename: fileName,
                vertical_id: verticalID,
                data: jsonCSV
        }    
        const results = await lead(list, 'send-file')
        if(results && results["code"] === 201){
            Alerts.success('Your list has been sent to the server')
            setCSV([])
            setJSONCSV([])
            getSubmitFiles()
        } else {
            Alerts.error(results)
        }

        // setStart(true)
        // let count = 0
        // for (let index = 0; index < jsonCSV.length; index++) {
        //     const list = {
        //         vertical_id: verticalID,
        //         data: jsonCSV[index]
        //     }    
        //     const results = await lead(list, 'manual')
        //     if(results === true){
        //         setPercentage(Math.ceil((100 * count++) / jsonCSV.length ))
        //     } else {
        //         setPercentage(Math.ceil((100 * count++) / jsonCSV.length ))
        //         Alerts.error(results)
        //     }
        //     // if(results === true){
        //     //     setPercentage(Math.floor((100 * index++) / jsonCSV.length ))
        //     // } else {
        //     //     setPercentage(Math.floor((100 * index++) / jsonCSV.length ))
        //     //     Alerts.error(results)
        //     // }    
        // }
        // setFinish(true)
    }

    const allField = fields.concat(universalFields)
    const allFields = allField.concat([{name: 'ignore', label: "Ignore"}])

    // console.log(jsonCSV)

    const fieldArray = allFields ? Object.keys(allFields).map(items => ({
        value: allFields[items].name,
        label: allFields[items].label
    })) : {}
    
    return(
        
        <div>
            <h3>Map the table headings to vertical values</h3>
            <p>Please choose a vertical to map</p>
            <br />
            <Label>Name file</Label>
            <Input onChange={e => setFileName(e.target.value)} />
            <Input type="select" onChange={e => getFields(e.target.value)} >
                        <option value="">Select a vertical</option>
                        {verticalList && verticalList.length ? Object.keys(verticalList).map((items,idx) => 
                            <option key={idx} value={verticalList[items].id}>{verticalList[items].label}</option>
                        ): ''}
            </Input>
            <br />
            {/* <Input type="select" onChange={e =>setVendorID(e.target.value)}>
                        <option value="">Select a Vendor</option>
                        {vendorList && vendorList.length ? Object.keys(vendorList).map(items => 
                            <option value={vendorList[items].id}>{vendorList[items].name}</option>
                        ): ''}
            </Input>
            <br /> */}
            {start === true ?
            <Card>
                <div className="text-center">{percentage}% Complete</div>
                <Progress value={percentage} />
                <br />
                {finish === true ?
                <Button color="success" onClick={e => setStart(false)}>Upload Complete</Button>
                :
                <Button color="secondary">Please wait for the upload to finish...</Button>
                }
            </Card>    
            :
            <Row>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Headers from data load</th>
                            <th scope="col">Fields to map</th>
                        </tr>    
                    </thead>  
                    <tbody>   
                    {header.map((items,idx) =>
                        <tr>
                            <td key={idx}>{items}</td>
                            {allFields && allFields.length ? 
                                Object.keys(fieldArray).length ? 
                                <td>
                                <Select
                                    onChange={e => handleMapping(e, items)}
                                    options={fieldArray}
                                /> 
                                </td>
                                : ''
                            : '' }
                        </tr> 
                    )} 
                    </tbody> 
                </table>
            </Row>
            }
            <br />
            {header && header.length ? <Button onClick={e => processUpload(e)}>Submit</Button> : ''}
            <br />
            <Button color="primary" onClick={toggle}>Show all imported data</Button>
            {fullData ?
            <div className="table-responsive">
                <Table striped responsive>
                    <thead>
                        <tr>
                        {header.map((items,idx) =>
                            <th key={idx}>{items}</th>
                        )}    
                        </tr>
                    </thead>
                    <tbody>
                        {body.map((items,idx) =>
                            <tr key={idx}>
                                {items.map(set =>
                                    <td>{set}</td>
                                )}
                            </tr>   
                            )}   
                    </tbody>    
                </Table>  
            </div>   
            : ''}
       </div>    
    )
}

export default NewLead