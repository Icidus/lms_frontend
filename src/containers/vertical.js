import React, { useState, useEffect } from 'react'
import { vertical } from '../util/db'
import { Link } from 'react-router-dom'
import { Card, CardBody, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import ReactTable from 'react-table'
import FoldableTableHOC from "react-table/lib/hoc/foldableTable";
import {CSVLink} from "react-csv";
import 'react-table/react-table.css'
const FoldableTable = FoldableTableHOC(ReactTable);


function Vertical(props){
    const [data, setData] = useState([])
    const [pages, setPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [perPage, setPerPage] = useState(20)
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState([])
    const [sort, setSort] = useState([])
    const [size, setSize] = useState(0)

    useEffect(() => {
        requestVerticals()
    }, []);

    const requestVerticals = async () => {
        const results = await vertical()
        const { items, _meta } = results || []
        setData(items)
        setPages(_meta ? _meta.pageCount : -1)
        setTotal(_meta ? _meta.totalCount : 0)
        setPerPage(_meta ? _meta.perPage : 0)
        setLoading(false)
    }

    const verticalDisplay = row => {
        props.history.push(`/vertical/${row.original.id}`)
    }

    const handleFilteredChange = (filtered, column) => {
        setFilter(filtered)
        handleFilteredSearch({'filter': filtered})
    }

    const handlePageChange = (page) => {
        setPages(page)
        handleFilteredSearch({'filter': filter}, page)
    }

    const handleSortedChange = (newSorted) => {
        setSort(newSorted)
        handleFilteredSearch({'sort': newSorted })
    }

    const handlePageSizeChange = (pageSize, pageIndex) => {
        setSize(pageSize)
        handleFilteredSearch({'size': pageSize})
    }

    const handleFilteredSearch = async (filtered, page=1) => {
        const search = await vertical(filtered, 'filter', {'page' : page})
        const { items, _meta } = search || []
        setData(items)
        setPages(_meta ? _meta.pageCount : -1)
        setTotal(_meta ? _meta.totalCount : 0)
        setPerPage(_meta ? _meta.perPage : 0)
        setLoading(false)
    }
    
    const Bread = (props) => {
        return (
          <div>
            <Breadcrumb>
              <BreadcrumbItem active>Vertical</BreadcrumbItem>
            </Breadcrumb>
          </div>
        );
      };
  
      console.log(data)
    return(
        <div>
            <div>   
                <Bread />
            </div>     
            <div className="d-flex justify-content-end" style={{marginBotton: "30px"}}>
                <CSVLink 
                    data={data || []}
                    filename={`vertical-dataexport${Date.now()}.csv`}
                    className="btn btn-primary"
                    target="_blank"
                    style={{marginRight: "20px"}}
                >
                    Export data
                </CSVLink>
                <Link className="btn btn-primary" to="/vertical/new">New Vertical</Link>
            </div>  
            <br />
            <Display 
                data={data}
                pages={pages}
                loading={loading}
                total={total}
                perPage={perPage}
                verticalDisplay={verticalDisplay}
                handleFilteredChange={handleFilteredChange}
                handlePageChange={handlePageChange}
                handleSortedChange={handleSortedChange}
                handlePageSizeChange={handlePageSizeChange}
            />
        </div> 
    )
}

export default Vertical


/**
    * @desc Handles the table display

*/

const Display = ({data, pages, loading, verticalDisplay, handleFilteredChange, handlePageChange, handleSortedChange, handlePageSizeChange }) => (
    <Card>
        <CardBody>
        <FoldableTable
        data={data}
        columns={
        [{
            Header: "ID",
            accessor: "id",
            id: "id",
            foldable: true
        }
        ,{
            Header: "Label",
            accessor: "label",
            id: "label",
            foldable: true
        },{
            Header: "Name",
            accessor: "name",
            id: "name",
            foldable: true
        },{
            Header: "Group",
            accessor: "group",
            id: "group",
            foldable: true
        },{
            Header: "Added",
            id: "timestamp",
            accessor: "timestamp",
            foldable: true
        }]
    }
    manual
    pages={pages}
    loading={loading}
    pageSize={data ? data.length : 20}
    onPageChange={(pageIndex) => handlePageChange(pageIndex + 1)}
    onFilteredChange={(filtered, column) => handleFilteredChange(filtered, column)}
    filterable={true}
    onSortedChange={(newSorted, column, shiftKey) => handleSortedChange(newSorted)}
    onPageSizeChange={(pageSize, pageIndex) => handlePageSizeChange(pageSize, pageIndex)}
    getTrProps={(state, rowInfo) => ({
        onClick: () => verticalDisplay(rowInfo)
    })}
    className="-highlight"
/>
</CardBody>
</Card>
)
