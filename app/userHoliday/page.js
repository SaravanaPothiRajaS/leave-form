'use client';
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Table from '../components/Table'



const Holiday = () => {

    const [jsonData, setJsonData] = useState([])

    const columns = [
        {
            Header: "Date",
            accessor: "Date"
        },
        {
            Header: "Day",
            accessor: "Day"
        },
        {
            Header: "Description",
            accessor: "Description"
        }
    ]

    const data = jsonData.map((data, i) => ({
        Date: data.Date,
        Day: data.Day,
        Description: data.Description,
    }));


    const displayJSON = () => {

        axios.get("/api/holidayfetch")
            .then(res => {
                setJsonData(res.data)

            })
    }

    useEffect(() => {
        displayJSON();
    }, [])



    const pageSizeOptions = [1, 2, 3];

    return (
        <>
            <div className='mt-16'>
                <Table columns={columns} data={data} className={'user-holiday-table'} pageSizeOptions={pageSizeOptions} />
            </div>

        </>
    )
}

export default Holiday
