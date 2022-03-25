import React, {useState, useEffect, Fragment} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Badge, Modal, ModalHeader, ModalBody, NavbarToggler, Navbar, NavbarBrand, Nav, NavItem, NavLink, Collapse } from 'reactstrap'
import { lead,buyers,report } from '../util/db'
import ReactTable from 'react-table'
import { display } from '../static/sidebar'
import FoldableTableHOC from "react-table/lib/hoc/foldableTable";
import 'react-table/react-table.css'
import { CSVLink } from "react-csv";
const FoldableTable = FoldableTableHOC(ReactTable);

export const Header = props => {
  const [modal, setModal] = useState(false)
  const [alertModal, setAlertModal] = useState(false)
  const [deliveryModal, setDeliveryModal] = useState(false)
  const toggle = () => setModal(!modal);
  const toggleAlert = () => setAlertModal(!alertModal)
  const toggleDelivery = () => setDeliveryModal(!deliveryModal)
  const [alertLength, setAlertLength] = useState(0)

  useEffect(() => {
    if(props.alertMessages && props.alertMessages.length){
      setAlertLength(props.alertMessages.length)
    }
  },[props])


  return(
       <Navbar color="light" fixed="top" light expand="lg">
      {/* <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-light">   */}
      {props.type === 3 || props.type === 4 ?
        <NavbarBrand href="/">  
          {/* <img className="img-fluid" width="60%" src="http://oconcomarketing.com/lms/images/backend_logo.png" /> */}
        </NavbarBrand>
      : ''}
      <DatabaseModal
        toggle={toggle}
        modal={modal}
      />
      <AlertModal
        toggleAlert={toggleAlert}
        alertModal={alertModal}
        setAlertLength={setAlertLength}
        alertLength={alertLength}
      />
      <DeliveryResponseModal
        toggleDelivery={toggleDelivery}
        deliveryModal={deliveryModal}
      />
       <NavbarToggler onClick={props.toggleMobile} />
            <Nav className="ml-auto mx-auto" style={{padding: "20px"}}/>
            <div className="d-flex justify-content-end">
              {props.type === 1 || props.type === 2 ?
                  <span className="fa-layers fa-fw" style={{marginRight: '20px', marginTop: "5px"}}>
                  <FontAwesomeIcon icon={['fas', "exclamation-circle"]} onClick={toggleDelivery} size="lg" />
                </span>
                : ''}
            {props.type === 1 || props.type === 2 ?   
              <span className="fa-layers fa-fw" style={{marginRight: '20px', marginTop: "5px"}}>
                <FontAwesomeIcon icon={['fas', "database"]}  onClick={toggle} size="lg" />
              </span>
              : ''}
              {props.type === 1 || props.type === 2 ?
              <span className="fa-layers fa-fw" style={{marginRight: '20px', marginTop: "5px"}}>
                <FontAwesomeIcon icon={['fas', "bell"]}  onClick={toggleAlert} size="lg" />
                <span className="fa-layers-counter" style={{fontSize: "2.2em", marginTop: "-10px", marginLeft: "10px"}}>{alertLength}</span>
              </span>
              : ''}
              <span style={{marginRight: '10px'}}>{props.first_name}</span>
              <span style={{marginRight: '10px'}} onClick={(e) => props.logOut(e)}>Log Out</span>
              {props.type === 1 || props.type === 2 ?
              <span style={{marginRight: '10px'}}><a href="https://docs.google.com/document/d/1u6cbXU8tpvmVIQ1geDYTN2054tAQE8M4L02Cj7wEhhM/edit?usp=sharing" target="_blank">Help</a></span>
              : ''}
              <span style={{marginRight: '10px'}}>Version (1.0.22)</span>
            </div> 
        </Navbar>   
)
}

const DeliveryResponseModal = props => {
  let typingTimer = null
  const [data, setData] = useState([])
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [perPage, setPerPage] = useState(20)
  const [loading, setLoading] = useState(true)
  const [filtered, setFiltered] = useState([])
  const [filter, setFilter] = useState([])
  const [sort, setSort] = useState([])
  const [sortPage, setSortPage] = useState(0)
  const [sortSize, setSortSize] = useState(0)
 
  useEffect(() => {
    if(props.deliveryModal === true){
    const fetchData = async () => {
        const search = await buyers('', 'buyer-delivery-response')
        const items = search && search.items ? search.items : []
        const _meta = search && search._meta ? search._meta : []
        setData(items)
        setPages(_meta ? _meta.pageCount : -1)
        setTotal(_meta ? _meta.totalCount : 0)
        setPerPage(_meta ? _meta.perPage : 20)
        setLoading(false)
    }
    fetchData()
    }
    }, [props.deliveryModal])

    useEffect(() => {
      if(props.deliveryModal === true && (sortPage > 0 || sortSize > 0 || filter.length > 0 || sort.length > 0)){
        handleFilteredSearch()
      }
    },[sortPage, sortSize, filter, sort, props.deliveryModal])

    useEffect(() => {
      return () => {
        clearTimeout(typingTimer);
      }
    }, [])

    const handlePageChange = (pageUpdate) => {
      setSortPage(pageUpdate)
    }

    const handleFilteredChange = (filteredd, column) => {
      clearTimeout(typingTimer);
      setFiltered(filteredd)
      typingTimer = setTimeout(() => {
        if(filteredd){
          setFilter(filteredd)
        }
      }, 900)
    }

    const handleSortedChange = newSorted => {
      setSort(newSorted)
    }

    const handlePageSizeChange = (pageSize,pageIndex) => {
      setSortSize(pageSize)
    }

    const handleFilteredSearch = async () => {
      const params = {
        "filter": filter,
        "sort": sort,
        "size": sortSize
      }

      const search = await buyers(params, 'buyer-delivery-response-filter',{
        'page' : sortPage,
        'size': sortSize
      })
      const items = search && search.items ? search.items : []
      const _meta = search && search._meta ? search._meta : []
      setData(items)
      setPages(_meta ? _meta.pageCount : -1)
      setTotal(_meta ? _meta.totalCount : 0)
      setPerPage(_meta ? _meta.perPage : 20)
      setLoading(false)
    }

  return(
  <Modal size="xl" isOpen={props.deliveryModal} toggle={props.toggleDelivery}>
  <ModalHeader toggle={props.toggleDelivery}>Lead Delivery Response<br />
        <CSVLink 
            data={data|| []}
            filename={`delivery-response${Date.now()}.csv`}
            className="justify-content-end btn btn-primary"
            target="_blank"
            style={{marginRight: "20px"}}
        >
            Export data
        </CSVLink>
    </ModalHeader>
  <ModalBody>
  <FoldableTable
    data={data}
    columns={
      [
        {
          Header: "Lead Id",
          accessor: "lead_id",
          id: "lead_id"
        },
        {
          Header: "Vendor ID",
          accessor: "vendor_id",
          id: "vendor_id"
        },
        {
          Header: "Vendor",
          accessor: "vendor",
          id: "vendor",
          style: { 'whiteSpace': 'unset' }
        },
        {
          Header: "Server Response",
          accessor: "server_response",
          id: "server_response",
          style: { 'whiteSpace': 'unset' },
          Cell: function(props){
            return <div className="text-wrap">{props.value}</div>
          }  
        },
        {
          Header: "Type",
          accessor: "type",
          id: "type"
        },
        {
          Header: "Timestamp",
          accessor: "timestamp",
          id: "timestamp",
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
    filterable={true}
    filtered={filtered}
    onSortedChange={(newSorted, column, shiftKey) => handleSortedChange(newSorted)}
    onPageSizeChange={(pageSize, pageIndex) => handlePageSizeChange(pageSize, pageIndex)}
    pageSizeOptions={[5, 10, 20, 25, 50, 100, 200, 500, 1000]}
    // getTrProps={(state, rowInfo) => ({
    //     onClick: () => leadsDisplay(rowInfo)
    // })}
    className="-highlight"
   />   
  </ModalBody>
  </Modal>
  )
}

const AlertModal = props => {
  let typingTimer = null
  const [data, setData] = useState([])
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [perPage, setPerPage] = useState(20)
  const [loading, setLoading] = useState(true)
  const [filtered, setFiltered] = useState([])
  const [filter, setFilter] = useState([])
  const [sort, setSort] = useState([])
  const [sortPage, setSortPage] = useState(0)
  const [sortSize, setSortSize] = useState(0)
  const [display, setDisplay] = useState('read')
 
  useEffect(() => {
    if(props.alertModal === true){
        fetchData()
    }
    }, [props.alertModal])

    const fetchData = async () => {
      const search = await report('', 'alert')
      const items = search && search.items ? search.items : []
      const _meta = search && search._meta ? search._meta : []
      setData(items)
      setPages(_meta ? _meta.pageCount : -1)
      setTotal(_meta ? _meta.totalCount : 0)
      setPerPage(_meta ? _meta.perPage : 20)
      setLoading(false)
    }

    const fetchAll = async () => {
      const search = await report('', 'alert-all')
      const items = search && search.items ? search.items : []
      const _meta = search && search._meta ? search._meta : []
      setData(items)
      setPages(_meta ? _meta.pageCount : -1)
      setTotal(_meta ? _meta.totalCount : 0)
      setPerPage(_meta ? _meta.perPage : 20)
      setLoading(false)
    }

    useEffect(() => {
      if(props.alertModal === true && (sortPage > 0 || sortSize > 0 || filter.length > 0 || sort.length > 0)){
        handleFilteredSearch()
      }
    },[sortPage, sortSize, filter, sort, props.alertModal])

    useEffect(() => {
      return () => {
        clearTimeout(typingTimer);
      }
    }, [])

    const handlePageChange = (pageUpdate) => {
      setSortPage(pageUpdate)
    }

    const handleFilteredChange = (filteredd, column) => {
      clearTimeout(typingTimer);
      setFiltered(filteredd)
      typingTimer = setTimeout(() => {
        if(filteredd){
          setFilter(filteredd)
        }
      }, 900)
    }

    const handleSortedChange = newSorted => {
      setSort(newSorted)
    }

    const handlePageSizeChange = (pageSize,pageIndex) => {
      setSortSize(pageSize)
    }

    const handleFilteredSearch = async () => {
      const params = {
        "filter": filter,
        "sort": sort,
        "size": sortSize
      }

      const search = await report(params, 'alert-filter',{
        'page' : sortPage,
        'size': sortSize
      })
      const items = search && search.items ? search.items : []
      const _meta = search && search._meta ? search._meta : []
      setData(items)
      setPages(_meta ? _meta.pageCount : -1)
      setTotal(_meta ? _meta.totalCount : 0)
      setPerPage(_meta ? _meta.perPage : 20)
      setLoading(false)
    }

    const handleAlertUpdate = async id => {
      const data = {
        "id" : id
      }
      const update = await report(data, 'alert-update')
      if(update && update["code"] == 201){
          fetchData()
          props.setAlertLength(props.alertLength - 1)
      }
    }

    const toggleDisplay = display => {
        setDisplay(display)
        if(display === 'all'){
            fetchAll()
        } else {
            fetchData()
        }
    }

  return(
  <Modal size="xl" isOpen={props.alertModal} toggle={props.toggleAlert}>
  <ModalHeader toggle={props.toggleDelivery}>Alerts<br />
        <CSVLink 
            data={data|| []}
            filename={`alerts${Date.now()}.csv`}
            className="justify-content-end btn btn-primary"
            target="_blank"
            style={{marginRight: "20px"}}
        >
            Export data
        </CSVLink>
    </ModalHeader>
  <ModalBody>
  <div className="d-flex justify-content-end" style={{padding: "10px"}}>
  {display === 'read' ? <Button color="secondary" onClick={e => toggleDisplay('all')}>Display All</Button> : <Button onClick={e => toggleDisplay('read')}color="secondary">Messages not read</Button> }
  </div>
  <FoldableTable
    data={data}
    columns={
      [
        {
          Header: "Lead ID",
          accessor: "lead_id",
          id: "lead_id"
        },
        {
          Header: "Vendor ID",
          accessor: "vendor_id",
          id: "vendor_id"
        },
        {
          Header: "Vendor",
          accessor: "vendor",
          id: "vendor",
          style: { 'whiteSpace': 'unset' }
        },
        {
          Header: "Name",
          accessor: "name",
          id: "name"
        },
        {
          Header: "Message",
          accessor: "message",
          id: "message",
          style: { 'whiteSpace': 'unset' },
          Cell: function(props){
            return <div className="text-wrap">{props.value}</div>
          }  
        },
        {
            Header: "Read",
            accessor: "select",
            foldable: false,
            sortable: false,
            filterable: false,
            maxWidth: 50,
            Cell: function(props){
                return(
                    <input 
                        type="checkbox"  
                        onChange={(e) => handleAlertUpdate(props.original.id)}
                    />
                )
            }    
        },
        {
          Header: "Timestamp",
          accessor: "timestamp",
          id: "timestamp",
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
    filterable={true}
    filtered={filtered}
    onSortedChange={(newSorted, column, shiftKey) => handleSortedChange(newSorted)}
    pageSizeOptions={[5, 10, 20, 25, 50, 100, 200, 500, 1000]}
    onPageSizeChange={(pageSize, pageIndex) => handlePageSizeChange(pageSize, pageIndex)}
    // getTrProps={(state, rowInfo) => ({
    //     onClick: () => leadsDisplay(rowInfo)
    // })}
    className="-highlight"
   />   
  </ModalBody>
  </Modal>
  )
}

const DatabaseModal = props => {
  let typingTimer = null
  const [data, setData] = useState([])
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [perPage, setPerPage] = useState(20)
  const [loading, setLoading] = useState(true)
  const [filtered, setFiltered] = useState([])
  const [filter, setFilter] = useState([])
  const [sort, setSort] = useState([])
  const [sortPage, setSortPage] = useState(0)
  const [sortSize, setSortSize] = useState(0)
 
  useEffect(() => {
    if(props.modal === true){
    const fetchData = async () => {
        const search = await lead('', 'stack')
        const items = search && search.items ? search.items : []
        const _meta = search && search._meta ? search._meta : []
        setData(items)
        setPages(_meta ? _meta.pageCount : -1)
        setTotal(_meta ? _meta.totalCount : 0)
        setPerPage(_meta ? _meta.perPage : 20)
        setLoading(false)
    }
    fetchData()
    }
}, [props.modal])

useEffect(() => {
  if(props.modal === true && (sortPage > 0 || sortSize > 0 || filter.length > 0 || sort.length > 0)){
    handleFilteredSearch()
  }
},[sortPage, sortSize, filter, sort])

useEffect(() => {
  return () => {
    clearTimeout(typingTimer);
  }
}, [])

const handlePageChange = (pageUpdate) => {
  setSortPage(pageUpdate)
}

const handleFilteredChange = (filteredd, column) => {
  clearTimeout(typingTimer);
  setFiltered(filteredd)
  typingTimer = setTimeout(() => {
    if(filteredd){
      setFilter(filteredd)
    }
  }, 900)
}

const handleSortedChange = newSorted => {
  setSort(newSorted)
}

const handlePageSizeChange = (pageSize,pageIndex) => {
  setSortSize(pageSize)
}

const handleFilteredSearch = async () => {
  const params = {
    "filter": filter,
    "sort": sort,
    "size": sortSize
  }

  const search = await lead(params, 'stack-filter',{
    'page' : sortPage,
    'size': sortSize
  })
  const items = search && search.items ? search.items : []
  const _meta = search && search._meta ? search._meta : []
  setData(items)
  setPages(_meta ? _meta.pageCount : -1)
  setTotal(_meta ? _meta.totalCount : 0)
  setPerPage(_meta ? _meta.perPage : 20)
  setLoading(false)
}

  return(
  <Modal size="xl" isOpen={props.modal} toggle={props.toggle}>
  <ModalHeader toggle={props.toggle}>Stack Trace<br />
  <CSVLink 
            data={data|| []}
            filename={`stack-trace${Date.now()}.csv`}
            className="btn btn-primary"
            target="_blank"
            style={{marginRight: "20px"}}
        >
            Export data
  </CSVLink>
  </ModalHeader>
  <ModalBody>
  <FoldableTable
    data={data}
    columns={
      [
        {
          Header: "Lead Id",
          accessor: "lead_id",
          id: "lead_id"
        },
        {
          Header: "Vendor ID",
          accessor: "vendor_id",
          id: "vendor_id"
        },
        {
          Header: "Vendor",
          accessor: "vendor",
          id: "vendor",
          style: { 'whiteSpace': 'unset' }
        },
        {
          Header: "Type",
          accessor: "type",
          id: "type"
        },
        {
          Header: "Message",
          accessor: "message",
          id: "message",
          style: { 'whiteSpace': 'unset' }
        },
        {
          Header: "Timestamp",
          accessor: "timestamp",
          id: "timestamp",
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
    filterable={true}
    filtered={filtered}
    onSortedChange={(newSorted, column, shiftKey) => handleSortedChange(newSorted)}
    pageSizeOptions={[5, 10, 20, 25, 50, 100, 200, 500, 1000]}
    onPageSizeChange={(pageSize, pageIndex) => handlePageSizeChange(pageSize, pageIndex)}
    // getTrProps={(state, rowInfo) => ({
    //     onClick: () => leadsDisplay(rowInfo)
    // })}
    className="-highlight"
   />   
  </ModalBody>
  </Modal>
  )

}