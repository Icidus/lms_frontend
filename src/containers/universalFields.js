import React, {useState, useEffect} from 'react'
import { Card, CardBody, Form, Input, Label, Button, FormGroup, CardHeader } from 'reactstrap'
import { universalFieldDefinition } from '../util/db'
import ReactDataGrid from "react-data-grid";

const defaultColumnProperties = {
    sortable: true
  };

  const columns = [
    {
      key: "id",
      name: "ID",
      sortDescendingFirst: true
    },
    {
      key: "label",
      name: "Label"
    },
    {
      key: "name",
      name: "Name"
    },
    {
        key:"type",
        name: "type"
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

function UniversalFields(){
    const [field, setField] = useState([])

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        const get = await universalFieldDefinition('', 'search')
        const { items } = get || []
        setField(items)
    }


    return(
        <div>
            <Card style={{padding: '20px'}}>
            <CardBody>
            <p>Fixed fields</p>
            {/* <div style={{paddingBottom: "10px"}}>
                <FieldForm 
                    fetchData={fetchData}
                />
            </div>     */}
            <div style={{paddingRight: "20px"}}>
                {field && field.length > 0 ?
                <ReactDataGrid
                    columns={columns}
                    rowGetter={i => field[i]}
                    rowsCount={field && field.length > 0 ? field.length : 0}
                    onGridSort={(sortColumn, sortDirection) =>
                        setField(sortRows(field, sortColumn, sortDirection))
                    }
                />   
                : "No data available"}   
            </div>    
                </CardBody>    
            </Card>   
        </div>    
    )
}

const FieldForm = props => {
    const [label, setLabel] = useState('')
    const [name, setName] = useState('')

    const addNewField = async e => {
        e.preventDefault()
        const data = {
            'label': label,
            'name' : name,
        }
        const add = await universalFieldDefinition(data, 'create')
        if(add){ props.fetchData() }   
    }

    return(
        <Form inline onSubmit={e => addNewField(e)}>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Input type="text" onChange={e => setLabel(e.target.value)} value={label} name="label" placeholder="add a label" />
        </FormGroup>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Input type="text" onChange={e => setName(e.target.value)} value={name} name="name"  placeholder="add a name" />
        </FormGroup>
        <Button>Submit</Button>
      </Form> 
    )
}



export default UniversalFields