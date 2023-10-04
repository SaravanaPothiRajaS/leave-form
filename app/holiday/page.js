"use client"
import React, { useState,useEffect } from 'react'
import 'font-awesome/css/font-awesome.min.css';
import Table from '../components/Table';
import axios from 'axios';
import DynamicForm from '../components/DynamicForm';
import { validateUserholiday } from '../components/ValidationSchema';
const { v4: uuidv4 } = require('uuid');



const holiday = () => {

    const [addholiday, setAddHoliday] = useState(false)
    const [edit, setEdit] = useState(false)
    const [jsonData,setJsonData]=useState([]);
    const [selectedRowData, setSelectedRowData] = useState(null);

    const[addValue,setaddValue]=useState({
        date:'',
        day:'',
      description:'',
      id:uuidv4(),
      });

      
      function overlay() {
        setAddHoliday((pre) => !pre)
    }


    function editbtn() {


            setSelectedRowData(data);
            setEdit(true);
          

    }
    //create appointment
    function handleinsert() {
        axios.post('/api/holidaycreate', { addValue: addValue})
          .then((res) => {
            console.log(res);
            if (res.status === 200) {
              displayJSON();
            setAddHoliday(false); 
            }
          })
          .catch(error => {
            console.error('Error updating JSON data:', error);
          });
      }
      

    const columns = [                    //ustable
        {
            Header: "Date",
            accessor: "date"
        },
        {
            Header: "Day",
            accessor: "day"
        },
        {
            Header: "Description",
            accessor: "description"
        },
        {
            Header: "Edit",
            accessor: "button"

        }
    ]

    const data = jsonData.map((data, i) => ({
        date: data.date,
        day: data.day,
        description: data.description,
        button: <button className='edit-btn' onClick={editbtn}>Edit</button>
    }));

    const displayJSON=()=> {

        axios.get("/api/holidayfetch")
            .then(res => {
                setJsonData(res.data)
              
            })
    }
    
    useEffect(()=>{
      displayJSON();
    },[])




    const fields = [
        {
          name: 'date',
          label: 'Date',
          type: 'date',
          placeholder: 'Enter Your Name',
        },
        {
          name: 'day',
          label: 'Day',
          type: 'text',
          
        },
        {
          name: 'description',
          label: 'Description',
          type: 'text',
        },
    ]
  
    const onChange = (name, value) => {
   
        setaddValue({
          ...addValue,
          [name]: value,
        });
      };



    return (
        <>

            <main className='add-holiday-parent'>
                <div className='add-holiday-btn'><button onClick={overlay}>Add Holiday</button></div>
                <Table columns={columns} data={data} className={'holiday-table'} />
              
                {addholiday && <div className='parent-add-holiday' >
                    <div className='add-holiday'>
                    <DynamicForm fields={fields} onSubmit={handleinsert} onChange={onChange} data={addValue}  validate={validateUserholiday}/>
                    <button type='button' onClick={()=>setAddHoliday(false)}>Back</button>
                    
                    </div>
                </div>}
                {edit && <div className='parent-add-holiday' >
                    <div className='add-holiday'>
                     
                      <form>
<div className='exit-icon' onClick={() => setEdit(false)}>    <i class="fa fa-times" aria-hidden="true" ></i></div>
<h2>Edit Holiday</h2>

<div className='add-date'>
    <label>Choose Date:</label>
    <input type='date' />
</div>
<div className='add-day'>
    <label >Day:</label>
    <input type='text' />
</div>
<div className='add-description'>
    <label>Description:</label>
    <input type='text' />
</div>
<div className='add-holiday-submit-btn'>
    <button >Submit</button>
</div>

</form> 
                    </div>
                </div>}
            </main>
        </>
    )
}

export default holiday




