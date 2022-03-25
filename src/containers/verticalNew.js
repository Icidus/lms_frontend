import React, { Component, useState } from 'react'
import { Form, FormGroup, Label, Input, Button, Card, CardHeader, CardBody, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { vertical } from '../util/db'
import Alerts from '../controller/alerts'
import { vendors } from '../util/db'
import { Link } from 'react-router-dom'

function VerticalNew(){
    const name = useFormInput("")
    const label = useFormInput("")
    const group = useFormInput("")

    const formSubmit = async (e) => {
        e.preventDefault()
        const data = {name: name.value, label: label.value, group: group.value}
        const add = await vertical(data, 'create')
        if(add){
            Alerts.success('New vertical successfully created')
            name.onReset()
            label.onReset()
            group.onReset()
        } else {
            const error = {
                name: 'Submitting error',
                message: 'There was a problem submitting your vertical'
            }
            Alerts.error(error)
        }
    }

    const Bread = (props) => {
        return (
          <div>
            <Breadcrumb>
                <BreadcrumbItem><Link to="/vertical">Vertical</Link></BreadcrumbItem>
                <BreadcrumbItem active>New Vertical</BreadcrumbItem>
            </Breadcrumb>
          </div>
        );
      };

    return(
        <div>
            <div>
                <Bread />
            </div>    
            <Card>
                <CardHeader>
                    New Vertical
                </CardHeader>
                <CardBody>    
                    <Form onSubmit={e => formSubmit(e)}>      
                    <FormGroup>    
                    <Label>Label (example: Auto Loan.  Can use upper case and spaces)</Label>
                        <Input type="text" name="label" {...label} required />
                    </FormGroup>  
                    <FormGroup> 
                    <Label>Name (example: auto_loan. Use all lowercase and dashes between words)</Label>
                        <Input type="text" name="name" {...name} required />
                    </FormGroup> 
                    <FormGroup> 
                    <Label>Group (example: Auto. Can use upper case and spaces.  Used to group verticals together.)</Label>
                        <Input type="text" name="group" {...group} required />
                    </FormGroup>   
                    <Button color="primary">Submit</Button>
                    </Form>  
                </CardBody>
            </Card> 
        </div>
    )
}

export default VerticalNew

function useFormInput(initialValue) {
    const [value, setValue] = useState(initialValue);
  
    function handleChange(e) {
      setValue(e.target.value);
    }
  
    function handleReset() {
      setValue("");
    }
  
    return {
      value,
      onChange: handleChange,
      onReset: handleReset
    };
  }

// export default class VerticalNew extends Component {

//     state = {
//         name: '',
//         label: '',
//         group: ''
//     }

//     handleFormChange = e => {
//         this.setState({
//             [e.target.name]: e.target.value
//         })
//     }

//     formSubmit = async e => {
//         e.preventDefault()
//         const data = {
//             name: this.state.name,
//             label: this.state.label,
//             group: this.state.group,

//         }
//         const add = await vertical(data, 'create')
//         if(add){
//             Alerts.success('New vertical successfully created')
//             this.setState({
//                 name: '',
//                 group: '',
//                 label: ''
//             })
//         }
//     }

//     render(){
//         const { name, label, group } = this.state
//         return(
//             <div>
//                 <Card>
//                     <CardHeader>
//                         New Vertical
//                     </CardHeader>
//                     <CardBody>    
//                     <Form onSubmit={(e) => this.formSubmit(e)}>      
//                     <FormGroup>    
//                     <Label>Label</Label>
//                         <Input type="text" value={label} name="label" onChange={(e) => this.handleFormChange(e)}  />
//                     </FormGroup>  
//                     <FormGroup> 
//                     <Label>Name</Label>
//                         <Input type="text" value={name} name="name" onChange={(e) => this.handleFormChange(e)}  />
//                     </FormGroup> 
//                     <FormGroup> 
//                     <Label>Group</Label>
//                         <Input type="text" value={group} name="group" onChange={(e) => this.handleFormChange(e)}  />
//                     </FormGroup>   
//                     <Button color="primary">Submit</Button>
//                     </Form>  
//                     </CardBody>
//                 </Card>     
//             </div>    
//         )
//     }
// }