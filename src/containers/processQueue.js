import React, {useState, useEffect} from 'react'
import { Card, CardBody, Form, Input, Label, Button, FormGroup, CardHeader } from 'reactstrap'
import { processQueues } from '../util/db'
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
      key: "channel",
      name: "Channel"
    },
    {
      key: "job",
      name: "Job"
    },
    {
        key:"pushed_at",
        name: "Started"
    },
    {
        key:"priority",
        name: "Priority"    
    },
    {
        key:"attempt",
        name: "Attempt"
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

function ProcessQueue(){
    const [field, setField] = useState([])

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        const get = await processQueues('', 'search')
        setField(get)
    }


    return(
        <div>
            <Card style={{padding: '20px'}}>
            <CardBody>
            <p>Queued for Processing</p>  
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




export default ProcessQueue