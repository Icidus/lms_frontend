import React, {useState} from 'react'
import {Button, Alert} from 'reactstrap'
import ReactDataGrid from "react-data-grid";
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function DisplayLeads(props){
        const [fields, setFields] = useState([])
    
        const defaultColumnProperties = {
            sortable: true
          };
    
        const header = Object.keys(props.leads).map((items, idx) => 
            Object.keys(props.leads[items]).map((sets) => {
                return sets
            }))
    
        const exportLists = Object.keys(props.leads).map((items, idx) => 
            Object.keys(props.leads[items]).map((sets) => {
                if(props.leads[items][sets]){
                    return props.leads[items][sets]
                } else {
                    return "NULL"
                }
            }))
    
        const list = header && header.length > 0 ? header[0] : []    
        const lists = [list]
        const exportList = lists.concat(exportLists)
    
    
        const set = Object.keys(list).map((items, idx) => {
            return { 
                key: list[items], 
                name: list[items], 
                sortDescendingFirst: true,          
                sortable: true,
                width: 120,
                filterable: true,
                width: 160
            }
        })
    
        const data = Object.keys(props.leads).map((items, idx) => props.leads[items])
    
        const columns = set
    
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
 
    
        const getCellActions = (column, row) => {
            const cellActions = {
              lead_id: [{
                icon: <FontAwesomeIcon icon={['fas', "eye"]} size="lg" style={{marginRight: "20px"}}/>,
                callback: () => {
                    props.history.push(`/leads/${row.lead_id}`)
                }
              }]
            };
            return cellActions[column.key]
          }

        return(
            <div>
                <div style={{margin: "20px"}}>
                    <CSVLink 
                        data={exportList || []}
                        filename={`leads-dataexport${Date.now()}.csv`}
                        className="btn btn-primary"
                        target="_blank"
                        style={{marginRight: "20px"}}
                    >
                        Export Leads
                    </CSVLink>{' '}
                    <Button color="success" onClick={e => props.toggleShowLeads()}>Close</Button>

               </div>   
               <div style={{margin: "20px"}}>
                {props.loading ? <Alert color="warning">Loading data.  One moment...</Alert>: <p>Displaying {data.length} leads</p>}
               </div>
               <br />
                <div>
                    <ReactDataGrid
                        columns={columns}
                        rowGetter={i => fields && fields.length > 0 ? fields[i] : data[i]}
                        rowsCount={data.length} 
                        getCellActions={getCellActions}
                        onGridSort={(sortColumn, sortDirection) =>
                            setFields(sortRows(fields && fields.length > 0 ? fields : data, sortColumn, sortDirection))
                        }
                    />  
                </div>     
            </div>
        )
}

export default DisplayLeads
