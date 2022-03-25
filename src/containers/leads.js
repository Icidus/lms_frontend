import React, { Component, useState, useEffect, Fragment, useRef } from 'react'
import { lead, orders, buyers, vertical, vendors, report, leadData, verticalFieldDefinition } from '../util/db'
import ReactTable from 'react-table'
import FoldableTableHOC from "react-table/lib/hoc/foldableTable";
import 'react-table/react-table.css'
import { UncontrolledTooltip, Container, Row, Col, Form, Label, Card, CardBody, Breadcrumb, BreadcrumbItem, Button, FormGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap'
import { Link } from 'react-router-dom'
import { CSVLink } from "react-csv";
import Alerts from '../controller/alerts'
import { withRouter } from 'react-router-dom'
import { display } from '../static/sidebar';
import { state } from '../static/states'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DatePicker from "react-datepicker";
import moment from 'moment'
import ReactDataGrid from "react-data-grid";
import queryString from 'query-string'
 
import "react-datepicker/dist/react-datepicker.css";
const FoldableTable = FoldableTableHOC(ReactTable);
const initialState = {
    data: [],
    pages: -1,
    total: 0,
    perPage: 20,
    lead_id: '',
    start_date: '',
    end_date: ''
}

function Leads(props){
    const csvLink = useRef()
    let typingTimer = null
    const [list, setList] = useState(initialState)
    const [ sortFilter, setSortFilter ] = useState({
        filter : [],
        sort: [],
        size: 0,
        page: 1
    })
    const [modal, setModal] = useState(false)
    const [returnModal, setReturnModal] = useState(false)
    const [displayStatus, setDisplayStatus] = useState([])
    const [leadId, setLeadId] = useState('')
    const [selectAll, setSelectAll] = useState(false)
    const [checked, setChecked] = useState([])
    const [itemsChecked, setItemsChecked] = useState([])
    const [loading, setLoading] = useState([])
    const [status, setStatus] = useState([])
    const [verticals, setVerticals] = useState([])

    const [filtered, setFiltered] = useState([])
    const [filter, setFilter] = useState([])
    const [sort, setSort] = useState([])
    const [sortPage, setSortPage] = useState(0)
    const [sortSize, setSortSize] = useState(0)

    const [vendor, setVendor] = useState([])
    const [buyer, setBuyers] = useState([])
    const [alertLoading, setAlertLoading] = useState(false)

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [leadIDs, setLeadIDs] = useState([])
    const [email, setEmail] = useState([])
    const [phone, setPhone] = useState([])
    const [showFilters, setShowFilters] = useState(true)
    const [exportData, setExportData] = useState([])
    const [exportListData, setExportListData] = useState([])
    const [exportInformation, setExportInformation] = useState('')

    const [quickEditModal, setQuickEditModal] = useState(false)
    const [quickEditID, setQuickEditID] = useState('')
    const [quickEditVertical, setQuickEditVertical] = useState('')

    useEffect(() => {
        getStatus()
        requestVerticals()
        getVendors()
        getBuyers()
    },[])

    useEffect(() => {
        if(props.history.location.search && props.history.location.search !== ""){
            const filters = queryString.parse(props.history.location.search)
            Object.keys(filters).map((items, idx) => {
                if(items === 'start_date'){
                    const momentObj = moment(filters[items]).toDate();
                    setStartDate(momentObj)
                }
                if(items === 'end_date'){
                    const momentObj = moment(filters[items]).toDate();
                    setEndDate(momentObj)
                }

                if(items !== 'start_date' && items !== 'end_date'){
                    const list = {
                        id: items,
                        value: filters[items]
                    }
                    setFilter(filter => [...filter, list])
                    setFiltered(filtered => [...filtered, list])
                }
            })
        } else {
            getAllLeads()
        }
    },[props.history.location.search])

    useEffect(() => {
        if(list && list.data && list.data.length){
            let checkedCopy = [];
            list.data.map(items =>
              checkedCopy.push(selectAll)
            )
            setChecked(checkedCopy)
            setSelectAll(selectAll)
            if(selectAll === true){
                let listId = []
                Object.keys(list.data).map(items =>
                listId.push(list.data[items].lead_id)
                )
                setItemsChecked(listId)
            }
            setLoading(false)
        }
    },[list])

    useEffect(() => {
        if(exportData && Object.keys(exportData).map(items => items).length > 0){
            const header = Object.keys(exportData).map((items, idx) => 
            Object.keys(exportData[items]).map((sets) => {
                return sets
            }))
    
        const exportLists = Object.keys(exportData).map((items, idx) => 
            Object.keys(exportData[items]).map((sets) => {
                return exportData[items][sets]
        }))
    
        const listExport = header && header.length > 0 ? header[0] : []    
        const lists = [listExport]
        const listData = lists.concat(exportLists)
        console.log(listData)

        setExportListData(listData)

        }
    },[exportData])

    useEffect(() => {
        setExportInformation('')
        if(exportListData && exportListData.length > 0 ){
            csvLink.current.link.click()
        }
    }, [exportListData])

    useEffect(() => {
        if(sortPage > 0){
            handleFilteredSearch()
        }
    }, [sortPage])

    useEffect(() => {
        if(sortSize > 0){
            handleFilteredSearch()
        }
    }, [sortSize])

    useEffect(() => {
        if(filter.length > 0){
            handleFilteredSearch()
        }
        
    }, [filter])

    useEffect(() => {
        if(sort.length > 0){
            handleFilteredSearch()
        }
    }, [sort])

    useEffect(() => {
        if(leadIDs.length > 0){
            handleFilteredSearch()
        }
    }, [leadIDs])

    // useEffect(() => {
    //     if(sortPage > 0 || sortSize > 0 || filter.length > 0 || sort.length > 0  || leadIDs.length > 0 || props.history.location.search !== ''){
    //             handleFilteredSearch()
    //         } else {
    //             getAllLeads()
    //         }
    //   },[sortPage, sortSize, filter, sort, props.history.location.search])

      useEffect(() => {
        return () => {
          clearTimeout(typingTimer);
        }
      }, [])

      useEffect(() => {
        if(startDate !== null && endDate !== null){
            handleFilteredSearch()
        }
    }, [startDate, endDate])


    const toggle = () => setModal(!modal);
    const returnToggle = () => setReturnModal(!returnModal);

    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }
    
    const getStatus = async () => {
        const stat = await lead('', 'status')
        let forDeletion = ["Sold", "Approved", "Returned"]
        let clear = stat
        if(stat && stat.length > 0){
            clear = stat.filter(item => !forDeletion.includes(item.name))
        }
        setStatus(clear)
        setDisplayStatus(stat)
    }

    const getVendors = async () => {
        const results = await vendors("", "search", "")
        setVendor(results && results.items ? results.items : [])
    }

    const getBuyers = async () => {
        const results = await buyers('', 'search', "")
        setBuyers(results && results.items ? results.items : [])
    }

    const getAllLeads = async () => {
        setAlertLoading(true)
        const results = await lead('', 'pivot')
        const stat = await lead('', 'status')
        const { items, _meta } = results || []
        setList({
            data: items,
            pages: _meta ? _meta.pageCount : -1,
            total: _meta ? _meta.totalCount : 0,
            perPage: _meta ? _meta.perPage : 20,
            loading: false,
            status: stat,
        })
        setAlertLoading(false)
    }

    const requestVerticals = async () => {
        const results = await vertical()
        const { items, _meta } = results || []
        setVerticals(items)
    }

    const handleFilteredChange = (filteredd, column) => {
      clearTimeout(typingTimer);
      setFiltered(filteredd)
      typingTimer = setTimeout(() => {
        if(filteredd){
          setFilter(filteredd)
        }
      }, 400)
    }

    const handlePageSizeChange = (pageSize,pageIndex) => {
        setSortSize(pageSize)
      }

      const handlePageChange = (pageUpdate) => {
        setSortPage(pageUpdate)
      }

    const handleSortedChange = newSorted => {
        setSort(newSorted)
      }

    const handleDisplayChange = e => {
        if(e.target.value === ''){
            Object.keys(filter).map((items,index) => {
                if(filter[items].id === e.target.name){
                    filter.splice(index, 1)
                    setFilter(filter)
                    setFiltered(filter)
                }
            })
            handleFilteredSearch()
        } else {
            const list = {
                id: e.target.name,
                value: e.target.value
            }
            setFilter(filter => [...filter, list])
            setFiltered(filtered => [...filtered, list])
        }
    }

    const handleFilteredSearch = async () => {
        setAlertLoading(true)
        const params = {
            "filter": filter,
            "sort": sort,
            "size": sortSize,
            "id": leadIDs,
            "email": email,
            "phone": phone,
            "start_date" : startDate && startDate !== '' ? moment(startDate).format('YYYY-MM-DD'): null,
            "end_date" : endDate && endDate !== '' ? moment(endDate).format('YYYY-MM-DD') : null
          }
        let  search = await lead(params, "filter", {
            'page' : sortPage,
            'size': sortSize
        })
        // if(filtered.length > 0 || sort.length > 0 || sortSize != 0 || startDate != null || leadIDs.length > 0 || email.length > 0 || props.history.location.search){
        //     search = await lead(params, "filter", {
        //         'page' : sortPage,
        //         'size': sortSize
        //     })
        // } else {
        //     search = await lead(params, "pivot", {
        //         'page' : sortPage,
        //         'size': sortSize
        //     })
        // }

        // if(props.history.location.search){
        //     const filters = queryString.parse(props.history.location.search)
        //     Object.keys(filters).map((items, idx) => {
        //         const list = {
        //             id: items,
        //             value: filters[items]
        //         }
        //         setFilter(filter => [...filter, list])
        //         setFiltered(filtered => [...filtered, list])
        //     })
        // }

        // const search = await lead(params, (filter.length > 0 || sort.length > 0 || sort.size != 0)? 'filter' : 'pivot', {
        //     'page' : sortPage,
        //     'size': sortSize
        // })
        const items = search && search.items ? search.items : []
        const _meta = search && search._meta ? search._meta : []
        setList({
            data: items,
            pages: _meta ? _meta.pageCount : -1,
            total: _meta ? _meta.totalCount : 0,
            perPage: _meta ? _meta.perPage : 20,
            loading: false
        })
        setAlertLoading(false)
    }

    const handleFilteredSearchUpdate = async (updateFilter, updateSortPage, updateSortSize, updateSort, updateLeadIDs, updateEmail, updatePhone) => {
        setAlertLoading(true)
        const params = {
            "filter": updateFilter,
            "sort": updateSort,
            "size": updateSortSize,
            "id": updateLeadIDs,
            "email": updateEmail,
            "phone": updatePhone,
            "start_date" : startDate && startDate !== '' ? moment(startDate).format('YYYY-MM-DD'): null,
            "end_date" : endDate && endDate !== '' ? moment(endDate).format('YYYY-MM-DD') : null
          }
        let  search = await lead(params, "filter", {
            'page' : sortPage,
            'size': sortSize
        })
        const items = search && search.items ? search.items : []
        const _meta = search && search._meta ? search._meta : []
        setList({
            data: items,
            pages: _meta ? _meta.pageCount : -1,
            total: _meta ? _meta.totalCount : 0,
            perPage: _meta ? _meta.perPage : 20,
            loading: false
        })
        setAlertLoading(false)
    }

    const leadsDisplay = (prop, e) => {
        e.preventDefault()
        props.history.push(`/leads/${prop.original.lead_id}`)
    }

    const quickEdit = (e, props) => {
        e.preventDefault()
        setQuickEditModal(!quickEditModal)
        setQuickEditID(props.original.lead_id)
        setQuickEditVertical(props.original.vertical_id)
    }

    const toggleQuickEdit = () => {
        setQuickEditModal(!quickEditModal)
        setQuickEditID('')
        setQuickEditVertical('')
    }

    const handleBulkSelect = e => {
        const select = !selectAll
        setSelectAll(select)
        let checkedCopy = []
        list.data.forEach(items => 
            checkedCopy.push(select)
        )
        if(select === true){
            let listId = []
            Object.keys(list.data).map(items =>
               listId.push(list.data[items].lead_id)
            )
             setItemsChecked(listId)
        } else {
            setItemsChecked([])
        }  
        setChecked(checkedCopy)
    }

    const handleAction = async (e, value) => {

        //If lead has been changed to sold
        if(e.target.value === '1'){
            setModal(true)
            setLeadId(value.original.lead_id)
        } else if(e.target.value === "5") {
            //if lead has been changed to returned
            setReturnModal(true)
            setLeadId(value.original.lead_id)
        } else {
            const leadStatusUpdate = {
                'id': value.original.lead_id,
                "status" : e.target.value
            }
            const update = await lead(leadStatusUpdate, 'update-status')
            if(update === true){
                Alerts.success('Lead status successfully updated')
                getAllLeads()
            } else {
                const error = {
                    name: "Error updating status",
                    message: "There was an error updating this lead."
                }
            }  

            // const results = [...list.data]
            // results[value.index]["status"] = e.target[e.target.selectedIndex].getAttribute('data-tag')
            // setList({...list, data: results })
        }
    }

   const handleBulkAction = (index, value) => {
        let checkedCopy = [...checked]
        checkedCopy[index] = !checked[index]
        setChecked(checkedCopy)
        if(checkedCopy[index] === false){
            setSelectAll(false)
        }
        const list = itemsChecked
        if(itemsChecked.includes(value.original.lead_id)){
            list[index] = null
            setItemsChecked(list)
        } else {
            list[index] = value.original.lead_id
            setItemsChecked(list)
        }
    }

    const resetFilters = e => {
        getAllLeads()
        setFilter([])
        setFiltered([])
        setSortFilter({
            filter : [],
            sort: [],
            size: 0,
            page: 1
        })
    }

    const handleBulkDelete = async e => {
        e.preventDefault()
        if(itemsChecked && itemsChecked.length > 0){
        const data = {
            "data" : itemsChecked,
            "process": 'delete'
        }
        const bulkActions = await lead(data, 'bulk')
        if(bulkActions && bulkActions["code"] == 201){
            Alerts.success(bulkActions["message"])
            setItemsChecked([])
            setChecked([])
            setSelectAll(false)
        }
        } else {
            const displayMessage = {
                name: "",
                message: "No leads were selected"
            }
            Alerts.error(displayMessage)
        }
    }

    const handleBulkApprove = async e => {
        e.preventDefault()
        if(itemsChecked && itemsChecked.length > 0){
        const data = {
            "data" : itemsChecked,
            "process": 'approve'
        }
        const bulkActions = await lead(data, 'bulk')
        if(bulkActions && bulkActions["code"] == 201){
            Alerts.success(bulkActions["message"])
            setItemsChecked([])
            setChecked([])
            setSelectAll(false)
        }
        } else {
            const displayMessage = {
                name: "",
                message: "No leads were selected"
            }
            Alerts.error(displayMessage)
        }
    }

    const handleBulkSold = async e => {
        if(itemsChecked && itemsChecked.length > 0){
        e.preventDefault()
        setModal(true)
        } else {
            const displayMessage = {
                name: "",
                message: "No leads were selected"
            }
            Alerts.error(displayMessage)
        }
    }

    const handleSell = async (orderId, buyerId, purchasePrice) => {
        if(itemsChecked && itemsChecked.length > 0){
        const data = {
            "order_id" : orderId,
            "price" : purchasePrice,
            "buyer_id" : buyerId,
            "data" : itemsChecked,
            "process": 'direct-sell'
        }
        const sell = await lead(data, 'bulk')
        if(sell && sell["code"] == 201){
            toggle(false)
            Alerts.success(sell["message"])
            setItemsChecked([])
            setChecked([])
            setSelectAll(false)
        }
        } else {
            const displayMessage = {
                name: "",
                message: "No leads were selected"
            }
            Alerts.error(displayMessage)
        }
    }

    const handleBulkReturn = async e => {
        if(itemsChecked && itemsChecked.length > 0){
            e.preventDefault()
            setReturnModal(true)
            } else {
                const displayMessage = {
                    name: "",
                    message: "No leads were selected"
                }
                Alerts.error(displayMessage)
            }
    }

 
    const handleReturn = async (buyer_id, return_email, return_reason, confirmation_number) => {
        if(itemsChecked && itemsChecked.length > 0){
            const data = {
                "buyer_id" : buyer_id,
                "return_email": return_email,
                "return_reason": return_reason,
                "confirmation_number": confirmation_number,
                "data" : itemsChecked,
                "process": 'return'
            }
            const returnLead = await lead(data, 'bulk')
            if(returnLead && returnLead["code"] === 201){
                setReturnModal(false)
                Alerts.success(returnLead["message"])
                setItemsChecked([])
                setChecked([])
                setSelectAll(false)
            } else {
                Alerts.error(returnLead)
            } 
        } else {
            const displayMessage = {
                name: "",
                message: "No leads were selected"
            }
            Alerts.error(displayMessage)
        }
    }



    const handleBulkStatusUpdate = async e => {
        if(itemsChecked && itemsChecked.length > 0){
        const data = {
            "data" : itemsChecked,
            "process": 'status-update',
            "status" : e.target.value
        }
        const bulkStatus = await lead(data, 'bulk')
        if( bulkStatus && bulkStatus["code"] == 201){
            toggle(false)
            Alerts.success(bulkStatus["message"])
            setItemsChecked([])
            setChecked([])
            setSelectAll(false)
        }
        } else {
            const displayMessage = {
                name: "",
                message: "No leads were selected"
            }
            Alerts.error(displayMessage)
        }
    }

    const removeFilter = (e, index) => {
        const update = filter.filter((_, i) => i !== index);
        setFilter(update)
        handleFilteredSearchUpdate(update, sortPage, sortSize, sort, leadIDs, email, phone)
    }

    const handleIDs = id => {
        const idArray = id.split(',')
        setLeadIDs(idArray)
    }

    const handleEmail = email => {
        const emailArray = email.split(',')
        setEmail(emailArray)
    }

    const handlePhone = phone => {
        const phoneArray = phone.split(",")
        setPhone(phoneArray)
    }

    const searchIDs = e => {
        e.preventDefault()
        handleFilteredSearch()
    }

    const searchEmail = e => {
        e.preventDefault()
        handleFilteredSearch()
    }

    const searchPhone = e => {
        e.preventDefault()
        handleFilteredSearch()
    }

    const clearIDs = () => {
        setLeadIDs([])
        handleFilteredSearchUpdate(filter, sortPage, sortSize, sort, [], email, phone) 

    }

    const clearEmail = () => {
        setEmail([])
        handleFilteredSearchUpdate(filter, sortPage, sortSize, sort, leadIDs, [], phone)

    }

    const clearPhone = () => {
        setPhone([])
        handleFilteredSearchUpdate(filter, sortPage, sortSize, sort, leadIDs, email, [])
    }

    const getExportData = async e => {
        setExportInformation('Building export list....')
        const params = {
            "filter": filter,
            "sort": sort,
            "id": leadIDs,
            "email": email,
            "phone" : phone,
            'export': 'y',
            "start_date" : startDate && startDate !== '' ? moment(startDate).format('YYYY-MM-DD'): null,
            "end_date" : endDate && endDate !== '' ? moment(endDate).format('YYYY-MM-DD') : null
          }
        const search = await lead(params, "filter")
        const allIds = search && search.items ? search.items : []
        let id = []
        if(allIds && allIds.length > 0){
            Object.keys(allIds).map(items => 
                id.push(allIds[items].lead_id)
            )
            const results = await report(id, 'lead-by-id')

            setExportData(results)
        }    
    }


    return(
        <div>
        <div>
            <Breadcrumb>
                <BreadcrumbItem active>Leads</BreadcrumbItem>
            </Breadcrumb>
        </div>   
        <Link className="btn btn-primary" to="/leads/new">Upload New Leads</Link>
        <br />
        <div>
            <SoldModal
                modal={modal}
                toggle={toggle}
                lead_id={leadId}
                getAllLeads={getAllLeads}
                handleSell={handleSell}
            />
            <ReturnModal
                modal={returnModal}
                toggle={returnToggle}
                lead_id={leadId}
                getAllLeads={getAllLeads}
                handleReturn={handleReturn}
            />
        </div>  
        <div style={{paddingBottom: "20px"}}>
            <Card>
                <CardBody>
                    <BulkOptions 
                        handleBulkSelect={handleBulkSelect}
                        displayStatus={displayStatus}
                        handleDisplayChange={handleDisplayChange}
                        selectAll={selectAll}
                        resetFilters={resetFilters}
                        handleBulkDelete={handleBulkDelete}
                        handleBulkApprove={handleBulkApprove}
                        handleBulkSold={handleBulkSold}
                        status={status}
                        verticals={verticals}
                        handleBulkStatusUpdate={handleBulkStatusUpdate}
                        handleBulkReturn={handleBulkReturn}
                        vendor={vendor}
                        buyer={buyer}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        startDate={startDate}
                        endDate={endDate}
                        handleIDs={handleIDs}
                        searchIDs={searchIDs}
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                        clearIDs={clearIDs}
                        leadIDs={leadIDs}
                        email={email}
                        searchEmail={searchEmail}
                        handleEmail={handleEmail}
                        clearEmail={clearEmail}
                        phone={phone}
                        searchPhone={searchPhone}
                        handlePhone={handlePhone}
                        clearPhone={clearPhone}
                    />
            </CardBody>
            </Card>
        </div> 
        <div>
            <span style={{paddingRight: "20px"}}>Applied filters:</span>
        {filter && filter.length > 0 ?
            Object.keys(filter).map((items, idx) => {
                return(
                    <Button outline style={{marginLeft: "20px"}}color="primary" onClick={e => removeFilter(e, idx)}>{filter[items].value} <FontAwesomeIcon icon={['fas', "times-circle"]}/></Button>
                )
            })
          : ''  
        }
        </div>
        <p><strong>Viewing {list.total} Leads</strong><br /> {alertLoading ? <Alert color="warning">Loading new content....</Alert>: ''}
        <Button color="primary" onClick={e =>getExportData(e)}>Export to CSV {exportInformation}</Button>
        </p>
        <CSVLink
          data={exportListData || []}
          filename={`leads-dataexport${Date.now()}.csv`}
          className="hidden"
          ref={csvLink}
          target="_blank" 
       />
       <Card>
           <CardBody>
           <BulkOptionsStatusUpdate
                        handleBulkSelect={handleBulkSelect}
                        displayStatus={displayStatus}
                        handleDisplayChange={handleDisplayChange}
                        selectAll={selectAll}
                        resetFilters={resetFilters}
                        handleBulkDelete={handleBulkDelete}
                        handleBulkApprove={handleBulkApprove}
                        handleBulkSold={handleBulkSold}
                        status={status}
                        verticals={verticals}
                        handleBulkStatusUpdate={handleBulkStatusUpdate}
                        handleBulkReturn={handleBulkReturn}
                        vendor={vendor}
                        buyer={buyer}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        startDate={startDate}
                        endDate={endDate}
                        handleIDs={handleIDs}
                        searchIDs={searchIDs}
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                        clearIDs={clearIDs}
                        leadIDs={leadIDs}
                        email={email}
                        searchEmail={searchEmail}
                        handleEmail={handleEmail}
                        clearEmail={clearEmail}
            />
            </CardBody>
       </Card>    
        {/* <br />
        <div className="d-flex justify-content-start" style={{marginBotton: "30px"}}>

        </div>  
        <div className="d-flex justify-content-end" style={{marginBotton: "30px"}}> */}
        {/* <CSVLink 
            data={list.data || []}
            filename={`leads-dataexport${Date.now()}.csv`}
            className="btn btn-primary"
            target="_blank"
            style={{marginRight: "20px"}}
        >
            Export data
        </CSVLink> */}
         {/* </div>
         <br />    */}
        <Card>
            <CardBody>
                <Display
                    data={list.data}
                    checked={checked}
                    pages={list.pages}
                    total={list.total}
                    perPage={list.perPage}
                    handleFilteredChange={handleFilteredChange}
                    handlePageChange={handlePageChange}
                    handleSortedChange={handleSortedChange}
                    handlePageSizeChange={handlePageSizeChange}
                    leadsDisplay={leadsDisplay}
                    handleAction={handleAction}
                    status={status}
                    handleBulkAction={handleBulkAction}
                    filtered={filtered}
                    loading={loading}
                    quickEdit={quickEdit}
                    toggleQuickEdit={toggleQuickEdit }
                />
            </CardBody>
        </Card>  
        {quickEditID && quickEditID !== '' ?
        <LeadDataDisplayEdit 
                quickEdit={quickEdit}
                id={quickEditID}
                vertical_id={quickEditVertical}
                toggleQuickEdit={toggleQuickEdit}
                quickEditModal={quickEditModal}
            />      
         : ''}   
    </div> 
    )
}

export default withRouter(Leads)

const BulkOptionsStatusUpdate = props => {
    return(
        <Row>
        <Col xs="1">
            <FormGroup check>
                <Input 
                    type="checkbox" 
                    onChange={e => props.handleBulkSelect(e)} 
                    checked={props.selectAll}
                />
            </FormGroup>
        </Col>
        <Col xs="3">
            <a href="#" id="approve" onClick={e => props.handleBulkApprove(e)}><FontAwesomeIcon icon={['fas', "check-circle"]} size="lg" style={{marginRight: "20px"}}/></a>
            <UncontrolledTooltip placement="top" target="approve">
                Approve these leads and try to sell
            </UncontrolledTooltip>
            <a href="#" id="sold" onClick={e => props.handleBulkSold(e)} ><FontAwesomeIcon icon={['fas', "dollar-sign"]} size="lg" style={{marginRight: "20px"}}/></a>
            <UncontrolledTooltip placement="top" target="sold">
                Sell all of these leads to a specific vendor. The system will not try to sell them, it assumes they have already been sold.
            </UncontrolledTooltip>
            <a href="#" id="delete" onClick={e => props.handleBulkDelete(e)}><FontAwesomeIcon icon={['fas', "trash"]} size="lg" style={{marginRight: "20px"}}/></a>
            <UncontrolledTooltip placement="top" target="delete">
                Delete all of these leads.  Becareful! These leads will be gone once you delete them.
            </UncontrolledTooltip>
            <a href="#" id="return" onClick={e => props.handleBulkReturn(e)}><FontAwesomeIcon icon={['fas', "share-square"]} size="lg" style={{marginRight: "20px"}}/></a>
            <UncontrolledTooltip placement="top" target="return">
                Return all of these leads.
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
        {/* <Col>    
            <Input onChange={(e) => props.handleBulkVerticalUpdate(e)} type="select" name="verticals">
                <option value="">Change verticals...</option>
                {props.verticals && props.verticals.length > 0 ? Object.keys(props.verticals).map((items,idx) => 
                    <option key={idx} data-tag={props.verticals[items].name} value={props.verticals[items].id}>{props.verticals[items].label}</option>
                ): <option></option>}
            </Input>
        </Col>  */}
    </Row> 
    )
}

const BulkOptions = props => {

    return(
    <div>
        <div className="d-flex justify-content-end" style={{padding: "10px"}}>
            <Button onClick={e => props.setShowFilters(!props.showFilters)}>Hide Filters</Button>
        </div>    
        {props.showFilters ?
        <Fragment>
        <Row>
           <Label><strong>Filters</strong></Label>
            <Col>
            <FormGroup>
                <Input type="select" name="status" onChange={e => props.handleDisplayChange(e)}>
                    <option value="">All Status</option>
                    {props.displayStatus ? Object.keys(props.displayStatus).map((items,idx) => 
                        <option key={idx} value={props.displayStatus[items].name}>{props.displayStatus[items].name}</option>
                    ): <option></option>}
                </Input>
            </FormGroup> 
            <FormGroup>
                <Input type="select" name="state"  onChange={e => props.handleDisplayChange(e)}>
                    <option value="">All States</option>
                        {Object.keys(state).map(items => 
                            <option key={items} value={items}>{state[items]}</option>
                        )}
                    </Input>
            </FormGroup>
            <FormGroup>
                    <Input type="select" name="vendor"  onChange={e => props.handleDisplayChange(e)}>
                        <option value="">All Vendors</option>
                            {Object.keys(props.vendor).map(items => 
                                <option key={props.vendor[items].id} value={props.vendor[items].company_name}>{props.vendor[items].company_name}</option>
                            )}
                        </Input>
            </FormGroup>
            <FormGroup>
                    <Input type="select" name="buyer"  onChange={e => props.handleDisplayChange(e)}>
                        <option value="">All Buyers</option>
                            {Object.keys(props.buyer).map(items => 
                                <option key={props.buyer[items].id} value={props.buyer[items].company_name}>{props.buyer[items].company_name}</option>
                            )}
                        </Input>
            </FormGroup>
            <FormGroup>
                    <Input type="select" name="vertical_name"  onChange={e => props.handleDisplayChange(e)}>
                        <option value="">All Verticals</option>
                            {props.verticals ? Object.keys(props.verticals).map(items => 
                                <option key={props.verticals[items].id} value={props.verticals[items].name}>{props.verticals[items].label}</option>
                            ): ''}
                        </Input>
            </FormGroup>
            <Label>Start Date</Label>
            <FormGroup>
            <DatePicker
                selected={props.startDate}
                onChange={date => props.setStartDate(date)}
                selectsStart
                startDate={props.startDate}
                endDate={props.endDate}
                dateFormat="yyyy-MM-dd"
            />
            {' '}
            </FormGroup> 
            <Label>End Date </Label>
            <FormGroup>
            <DatePicker
                selected={props.endDate}
                onChange={date => props.setEndDate(date)}
                selectsEnd
                startDate={props.startDate}
                endDate={props.endDate}
                dateFormat="yyyy-MM-dd"
            />
            </FormGroup>  
        </Col>
        <Col>
        <Form>
        <Label><strong>ID search</strong></Label>    
            <FormGroup>
                <Input type="textarea" value={props.leadIds} onChange={e => props.handleIDs(e.target.value)} />
                <Button color="primary" onClick={e => props.searchIDs(e)}>Search IDs</Button>{' '}
                <Button color="warning" onClick={e => props.clearIDs(e)}>Clear</Button>{' '}
            </FormGroup>    
        </Form>   
        <Label><strong>Email search</strong></Label>
        <Form>
            <FormGroup>
                <Input type="textarea" value={props.email} onChange={e => props.handleEmail(e.target.value)} />
                <Button color="primary" onClick={e => props.searchEmail(e)}>Search Email</Button>{' '}
                <Button color="warning" onClick={e => props.clearEmail(e)}>Clear</Button>{' '}
            </FormGroup>    
        </Form> 
        <Label><strong>Phone search</strong></Label>
        <Form>
            <FormGroup>
                <Input type="textarea" value={props.phone} onChange={e => props.handlePhone(e.target.value)} />
                <Button color="primary" onClick={e => props.searchPhone(e)}>Search Phone</Button>{' '}
                <Button color="warning" onClick={e => props.clearPhone(e)}>Clear</Button>{' '}
            </FormGroup>    
        </Form>   
        </Col> 
        {/* <Col>
        <Link className="btn btn-primary" to="/leads/new">Add Leads</Link>
        </Col>
        <Col>
            <Button color="warning" onClick={e => props.resetFilters(e)}>Reset Filters</Button>
        </Col>     */}
        </Row>   
        <Button color="warning" onClick={e => props.resetFilters(e)}>Reset Filters</Button>
        </Fragment>
        : '' } 
        </div>
    )
}

const ReturnModal = props => {

    const initialState = {
        buyer_id: '',
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
                  <Input type="select" name="buyer_id" onChange={e => updateForm(e)}>
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


const Display = ({ data, pages, loading, handleFilteredChange, handlePageChange, handleSortedChange, handlePageSizeChange, leadsDisplay, handleAction, status, handleBulkAction, checked, filtered, quickEdit }) => {
    const [hoveredRow, setHoveredRow] = useState(null)
    const [fields, setFields] = useState([])
    
    const defaultColumnProperties = {
        sortable: true
      };
   
    const header = Object.keys(data).map((items, idx) => 
    Object.keys(data[items]).map((sets) => {
        return sets
    }))

    const list = header && header.length > 0 ? header[0] : []    

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
    
    return(
    //     <div>
    //     <ReactDataGrid
    //         columns={columns}
    //         rowGetter={i => fields && fields.length > 0 ? fields[i] : data[i]}
    //         rowsCount={data.length} 
    //         // getCellActions={getCellActions}
    //         onGridSort={(sortColumn, sortDirection) =>
    //             setFields(sortRows(fields && fields.length > 0 ? fields : data, sortColumn, sortDirection))
    //         }
    //     />  
    // </div>       
    <FoldableTable
    data={data}
    columns={
        [
            {
                Header: "",
                accessor: "select",
                foldable: false,
                sortable: false,
                filterable: false,
                maxWidth: 50,
                Cell: function(props){
                    return(
                        <input 
                            type="checkbox"  
                            checked={checked[props.index]}
                            onChange={(e) => handleBulkAction(props.index, props)}
                        />
                    )
                }    
        },
        {
            Header: "View",
            accessor: "view",
            foldable: false,
            sortable: false,
            filterable: false,
            maxWidth: 50,
            Cell: function(props){
                return (
                    <Fragment>
                    <a href="#" id="view" onClick={(e) => leadsDisplay(props, e)}><FontAwesomeIcon icon={['fas', "eye"]} size="lg" style={{marginRight: "20px"}}/></a>
                    <Button color="success" onClick={(e) => leadsDisplay(props, e)}>View Lead</Button>
                    </Fragment>
                )  
            }   
        },
        {
            Header: "Edit",
            accessor: 'quick',
            foldable: false,
            sortable: false,
            filterable: false,
            maxWidth: 50,
            Cell: function(props){
                return (
                    <Fragment>
                    <a href="#" id="edit" onClick={e => quickEdit(e, props)}><FontAwesomeIcon icon={['fas', "edit"]} size="lg" style={{marginRight: "20px"}}/></a>
                    <Button color="success" onClick={e => quickEdit(e, props)}>Quick Edit</Button>
                    </Fragment>
                )  
            }  
        },
        // {
        //     Header: "Action",
        //     accessor: "action",
        //     foldable: false,
        //     sortable: false,
        //     filterable: false,
        //     Cell: function(props){
        //         return(
        //             <FormGroup>
        //             <Input onChange={(e) => handleAction(e, props)} type="select" name="status">
        //             <option value="">Select an option...</option>
        //             {status && status.length > 0 ? Object.keys(status).map((items,idx) => 
        //                 <option key={idx} data-tag={status[items].name} value={status[items].id}>{status[items].name}</option>
        //             ): <option></option>}
        //             </Input>
        //             </FormGroup>
        //         )
        //     }    
        // },
        {
            Header: "Vendor",
            accessor: "vendor",
            id: "vendor",
            foldable: true,
            style: { 'whiteSpace': 'unset' }
        },
        {
            Header: "Status",
            accessor: 'status',
            id: "status",
            foldable: true,
            style: { 'whiteSpace': 'unset' }
        },
        {
            Header: "Vertical",
            accessor: 'vertical_label',
            id: "vertical_label",
            foldable: true,
            style: { 'whiteSpace': 'unset' }
        },{
            Header: "Lead Id",
            accessor: "lead_id",
            id: "lead_id",
            foldable: true,
            style: { 'whiteSpace': 'unset' }
        },{
            Header: "Added date",
            accessor: "added",
            id: "added",
            foldable: true,
            style: { 'whiteSpace': 'unset' }
        },{
            Header: "Updated date",
            accessor: "updated",
            id: "updated",
            foldable: true,
            style: { 'whiteSpace': 'unset' }
        },{
            Header: "QC Comment",
            accessor: "qc_comment",
            id: "qc_comment",
            foldable: true,
            style: { 'whiteSpace': 'unset' }
        },{
            Header: "First Name",
            accessor: "first_name",
            id: "first_name",
            foldable: true ,
            style: { 'whiteSpace': 'unset' }
        },{
            Header: "Last Name",
            accessor: "last_name",
            id: "last_name",
            foldable: true ,
            style: { 'whiteSpace': 'unset' }
        },{
            Header: "Email",
            accessor: "email",
            id: "email",
            foldable: true ,
            style: { 'whiteSpace': 'unset' }
        },
        {
            Header: "Phone",
            accessor: "phone",
            id: "phone",
            foldable: true ,
            style: { 'whiteSpace': 'unset' }
        },
        {
            Header: "State",
            accessor: "state",
            id: "state",
            foldable: true ,
            style: { 'whiteSpace': 'unset' }
        },{
            Header: "Buyer",
            accessor: "buyer",
            id: "buyer",
            foldable: true ,
            style: { 'whiteSpace': 'unset' }
        },{
            Header: "Sold date",
            accessor: "sold_date",
            id: "sold_date",
            foldable: true,
            style: { 'whiteSpace': 'unset' }
        }
    ]
    }
    manual
    pages={pages}
    loading={loading}
    pageSize={data ? data.length : 20}
    onPageChange={(pageIndex) => handlePageChange(pageIndex + 1)}
    onFilteredChange={(filtered, column) => handleFilteredChange(filtered, column)}
    filtered={filtered}
    pageSizeOptions={[5, 10, 20, 25, 50, 100, 200, 500, 1000]}
    onSortedChange={(newSorted, column, shiftKey) => handleSortedChange(newSorted)}
    onPageSizeChange={(pageSize, pageIndex) => handlePageSizeChange(pageSize, pageIndex)}
    // getTrProps={(state, rowInfo) => ({
    //     onClick: () => leadsDisplay(rowInfo)
    // })}
    className="-highlight"
/>
    )
}

const LeadDataDisplayEdit = props => {
    const [data, setData] = useState([])
    const [leadDataValues, setLeadData] = useState([])
    const [field, setField] = useState([])
    const [newField, setNewField] = useState('')
    const [newValue, setNewValue] = useState('')
    const [verticals, setVerticals] = useState([])
    const [status, setStatus] = useState([])
    const [returnData, setReturnData] = useState([{
        buyer_id: '',
        lead_id : '',
        return_email: '',
        return_reason: '',
        confirmation_number: ''
    }])
    const [displayStatus, setDisplayStatus] = useState([])



    useEffect(() => {
        getData()
        getField()
        getVerticals()
        getLeads()
        getStatus()
    },[])

    const getLeads = async () => {
        const search = await lead('', 'by-id', {'id' : props.id})
        setLeadData(search ? search : [])
        getReturn()
    }

    const getReturn = async () => {
        const returnInfo = await lead('', 'get-return-lead', {'id': props.id})
        setReturnData(returnInfo && returnInfo[0] ? returnInfo[0] : [])
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

    const getVerticals = async () => {
        const results = await vertical()
        const { items, _meta } = results || []
        setVerticals(items)
    }   

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

    const handleLeadChange = e => {
        setLeadData({...leadDataValues,  "lead": {
            ...leadDataValues["lead"],
            [e.target.name]:e.target.value,
        }})
    }

    const handleLeadUpdate = async e => {
        const update = await lead(leadDataValues["lead"], 'update')
        if(update && update["code"] === 200){
            getLeads()
            Alerts.success('Lead updated succesfully')
        } else {
            const error = {
                name: "Error",
                message: update
            }
            Alerts.error(error)
        }
    }


    const leadDisplayValues = leadDataValues && leadDataValues["lead"] ? leadDataValues["lead"] :[]
    return(
        <Modal size="xl" isOpen={props.quickEditModal} toggle={props.toggleQuickEdit}>
        <ModalHeader toggle={props.toggleQuickEdit}>Edit Lead Data</ModalHeader>
        <ModalBody>
            <Row>
                <Col>
                 <br />  
                 <div className="menu sticky-top p-3 bg-light">
                <Button color="primary" onClick={e => handleLeadUpdate(e)}>Update Primary Lead</Button>{' '}
                </div>
                <br />
                {leadDisplayValues ? Object.keys(leadDisplayValues).map((items,idx) => 
                    <Form key={idx}> 
                        {items !== "lead_id" ?
                        <Fragment>
                                {!(items == 'first_name' || items == 'last_name' || items == 'email' || items == 'state') ?
                                    <Label>{items}</Label>
                                : ''}    
                                {items === "status" ?
                                    <Input name={items} type="select" onChange={e => handleLeadChange(e)} value={leadDisplayValues[items]}>
                                        {Object.keys(status).map((items,idx) =>
                                            <option key={idx} value={status[items].id}>{status[items].name}</option>
                                        )}
                                    </Input>
                                : items === "vertical_id" ?
                                <Input name={items} type="select" value={leadDisplayValues[items]} onChange={e => handleLeadChange(e)}>
                                    {verticals && verticals.length > 0 ? Object.keys(verticals).map((items,idx) =>
                                        <option key={idx} value={verticals[items].id}>{verticals[items].label}</option>
                                    ) : ''}
                                </Input>

                                :
                                !(items == 'first_name' || items == 'last_name' || items == 'email' || items == 'state') ?
                                <Input 
                                    onChange={e => handleLeadChange(e)}
                                    type="text" 
                                    name={items}
                                    value={leadDisplayValues[items] || ''} 
                                    disabled={items === "id" ? "disabled" : ''}
                                />
                                : ''
                                }
                          </Fragment>      
                        : ''}     
                    </Form>
                ) : '' }  
                </Col>
                <Col>
                <div className="menu sticky-top p-3 bg-light">
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
                <Button onClick={e => addNewField(e)}>Add Field</Button> { ' '}
                <Button color="primary" onClick={e => handleLeadDataUpdate(e)}>Update Lead Data</Button>{' '}
                <br />
                </div>
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
                </Col> 
            </Row>    
        </ModalBody>
      </Modal>
    )
}