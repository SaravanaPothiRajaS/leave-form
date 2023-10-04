'use client';
import React, { useState,useEffect } from 'react'
import Table from '../components/Table';
import axios from 'axios'


const Employee = () => {
    
    const [jsonData,setJsonData]=useState([]);
    const columns = [
        {
            Header: "Name",
            accessor: "name"
        },
        {
            Header: "Available Leave",
            accessor: "availableLeave"
        },
        {
            Header: "Role",
            accessor: "role"
        },
    
    ]
    
    const data = jsonData.map((data, i) => ({
        name: data.name,
        availableLeave: data.availableLeave,
        role: data.role,
    }));

    const displayJSON=()=> {

        axios.get("/api/empfetch")
            .then(res => {
                setJsonData(res.data)
              
            })
    }
    
    useEffect(()=>{
      displayJSON();
    },[])



    return (
        <>
            <Table columns={columns} data={data} className={'emp-table'} />


        </>

    )
}

export default Employee