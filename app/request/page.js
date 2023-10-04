"use client"
import React, { useState,useEffect } from 'react'

import Table from '../components/Table';
import axios from 'axios';
import { useSession }from "next-auth/react";



const Request = () => {
   
    const email_sess = useSession();
    const sess_email=email_sess?.data?.user?.email
    const [selectedOption, setSelectedOption] = useState('request');
    const [jsonData,setJsonData]=useState([]);
    const [jsoData,setJsoData]=useState([]);

    const [employeeData, setEmployeeData] = useState([]);

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



    const data1 = jsoData.map((data, i) => ({
        name: data.name,
        email:data.email,
        availableLeave: data.availableLeave,
        role: data.role,
    }));
 

    let data = [];

    if (selectedOption === 'request') {
        data = jsonData.map((data, i) => {
        
          const matchingData1 = data1.find((item) => item.email === data.email);
       
          let availableLeave = matchingData1 ? matchingData1.availableLeave : 0;

          console.log('Available Leave:', availableLeave);


          return {
            name: data.name,
            role: data.role,
            from: data.fromDate,
            to: data.toDate,
            totalDays: data.totalDays,
            availableLeave: availableLeave,
            reason: data.reason,
            status: data.status === 'pending' ? (
              <>
                <button className='edit-btn' onClick={() =>{ Update(data.id, 'approved'); 
                Updateemp(data.email,availableLeave,data.totalDays);}}>
                  Approve
                </button>
                <button className='reject-edit-btn' onClick={() => Update(data.id, 'rejected')}>
                  Reject
                </button>
              </>
            ) : (
              <span
                className={
                  data.status === 'approved' ? 'approved' : data.status === 'rejected' ? 'rejected' : ''
                }
              >
                {data.status}
              </span>
            ),
            id: data.id,
          };
        });
    } else if (selectedOption === 'approved') {
        data = jsonData.filter((data) => data.status === 'approved').map((data, i) => {
            const matchingData1 = data1.find((item) => item.email === data.email);
            let availableLeaves = matchingData1 ? matchingData1.availableLeave : 0;
        
            
            return {
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
                email:data.email,
                
                id:data.id,
             
                availableLeave: availableLeaves,
            };
        });
        
    } else if (selectedOption === 'rejected') {
        data = jsonData.filter((data) => data.status === 'rejected').map((data, i) => {
            const matchingData1 = data1.find((item) => item.email === data.email);
            let availableLeaves = matchingData1 ? matchingData1.availableLeave : 0;
        
            return {
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
                email:data.email,
                
                id:data.id,
             
                availableLeave: availableLeaves,
            };
        });
    }

    const displayJSON=()=> {

        axios.post("/api/fetch",{email:sess_email})
            .then(res => {
                setJsonData(res.data.reverse())
              
            })
    }
    
    useEffect(()=>{
      displayJSON();
      displayJSO();
    },[])



    const displayJSO=()=> {

        axios.get("/api/empfetch")
            .then(res => {
                setJsoData(res.data)
              
            })
    }
    


    const Update = (id, status) => {
    
    axios
      .post(`/api/update`, { id, status })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          displayJSON();
          displayJSO();
        }
      });
  };
    
  const Updateemp = (email, availableLeave,totalDays) => {
    
    axios
      .post(`/api/availableleave`, { email,availableLeave,totalDays })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          displayJSON();
          displayJSO();
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



