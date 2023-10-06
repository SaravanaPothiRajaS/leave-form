'use client';
import React, { useState, useEffect } from 'react'
import Table from '../components/Table';
import axios from 'axios'
import * as XLSX from 'xlsx/xlsx.mjs';


const Employee = () => {

    const [jsonData, setJsonData] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [convertJsonData, setconvertJsonData] = useState(null);
    const columns = [
        {
            Header: "Name",
            accessor: "name"
        },
        {
            Header: "Taken Leave",
            accessor: "takenLeave"
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

    const data = jsonData?.map((data, i) => ({
        name: data?.name,
        availableLeave: data?.availableLeave,
        takenLeave: data?.takenLeave,
        role: data?.role,
    }));

    const displayJSON = () => {

        axios.get("/api/empfetch")
            .then(res => {
                setJsonData(res?.data)

            })
    }



    useEffect(() => {

        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);

                setconvertJsonData(sheetData);
            };
            reader.readAsArrayBuffer(selectedFile);

        }
        displayJSON();

    }, [selectedFile])

    useEffect(() => {
        if (convertJsonData?.length > 0) {
            const requiredKeys = ["name", "email", "availableLeave", "takenLeave", "role"];
            const keysExist = requiredKeys.every(key => Object.keys(convertJsonData[0]).includes(key));
            if (keysExist) {
                axios.post('/api/importEmployee', { addValue: convertJsonData }).then(res => {
                    if (res?.data === "imported") {
                        displayJSON();
                    }
                }).catch((err) => { console.log(err); })

                // console.log(1234567);
            } else { alert('Name ,Email, availableLeave , takenLeave, role does not exist or change the column name like that') }
        }
    }, [convertJsonData])


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);


    };



    function downloadExcel(jsonData) {



        const ws = XLSX.utils.json_to_sheet(jsonData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'Employee Details.xlsx';
        a.click();

        URL.revokeObjectURL(url);
    }


    return (
        <> <main className='mt-20'>
            <input type="file" accept=".xls, .xlsx" onChange={handleFileChange}
                className='block  text-sm text-slate-500 mt-16 flex ml-16
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100'
            />
            {selectedFile && <button className='btn p-3 border-l-rose-700'
                onClick={() => {
                    setSelectedFile(null);
                    setconvertJsonData(null);
                }}

            >Cancel</button>}

            <Table columns={columns} data={data} className={'emp-table'} />

            <button onClick={() => downloadExcel(jsonData)} className="bg-gray-300 ml-16 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
                <span>Download Excel</span>
            </button>
        </main>
        </>

    )
}

export default Employee