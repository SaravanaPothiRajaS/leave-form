"use client"
import React, { useState,useEffect } from 'react'

import Table from '../components/Table';
import axios from 'axios';



const Request = () => {

    const [selectedOption, setSelectedOption] = useState('request');
    const [jsonData,setJsonData]=useState([]);


    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
    };

    




    const columns = [
        {
            Header: "Name",
            accessor: "name"
        },
        {
            Header: "Role",
            accessor: "role"
        },
        {
            Header: "From Date",
            accessor: "from"
        },
        {
            Header: "To Date",
            accessor: "to"
        },
        {
            Header: "Total Days",
            accessor: "totalDays"
        },
        {
            Header: "Available Leave",
            accessor: "availableLeave"
        },
        {
            Header: "Reason",
            accessor: "reason"
        },
        {
            Header: "Status",
            accessor: "status"
        }
    ]



    let data = [];

    if (selectedOption === 'request') {
        data = jsonData.map((data, i) => ({
            name: data.name,
            role: data.role,
            from: data.fromDate,
            to: data.toDate,
            totalDays: data.totalDays,
            availableLeave: data.availableLeave,
            reason: data.reason,
            status: data.status==="pending"?
          
           <> <button className='edit-btn' onClick={() => Update(data.id, 'approved')} >Approve</button>
         <button className='reject-edit-btn' onClick={() => Update(data.id, 'rejected')} >Reject</button>
       </> : <span className={ data.status === 'approved' ?
            'approved' : data.status === 'rejected' ? 'rejected' : ""
        }>{data.status}</span>  ,
        //  <span className={data.status === 'pending' ? 'pending' : data.status === 'approved' ?
        //     'approved' : data.status === 'rejected' ? 'rejected' : ""
        // }>{data.status}</span>:'',
        
      
        id:data.id
        }));
    } else if (selectedOption === 'approved') {
        data = jsonData.filter(data => data.status === 'approved').map((data, i) => ({
            name: data.name,
            role: data.role,
            from: data.fromDate,
            to: data.toDate,
            totalDays: data.totalDays,
            availableLeave: data.availableLeave,
            reason: data.reason,
            status:<span className={data.status === 'pending' ? 'pending' : data.status === 'approved' ?
                'approved' : data.status === 'rejected' ? 'rejected' : ""
            } >{data.status}</span>,
            approve:'',
            id:data.id
        }));
    } else if (selectedOption === 'rejected') {
        data = jsonData.filter(data => data.status === 'rejected').map((data, i) => ({
            name: data.name,
            role: data.role,
            from: data.fromDate,
            to: data.toDate,
            totalDays: data.totalDays,
            availableLeave: data.availableLeave,
            reason: data.reason,
        
            status:<span className={data.status === 'pending' ? 'pending' : data.status === 'approved' ?
                'approved' : data.status === 'rejected' ? 'rejected' : ""
            } >{data.status}</span>,
            approve:'',
            id:data.id
        }));
    }

    const displayJSON=()=> {

        axios.get("/api/fetch")
            .then(res => {
                setJsonData(res.data.reverse())
              
            })
    }
    
    useEffect(()=>{
      displayJSON();
    },[])


    const Update = (id, status) => {
    
    axios
      .post(`/api/update`, { id, status })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          displayJSON();
          
        }
      });
  };
    




    return (
        <>
            <main>
                <div className='select-request'>
                    <label>Select a Option:</label>
                    <select onChange={handleSelectChange} value={selectedOption} >
                        <option value="request" > Requests</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <Table columns={columns} data={data} className={'status-table'}
                />


            </main>
        </>
    )
}

export default Request