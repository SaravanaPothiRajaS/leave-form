'use client';
import React, { useState, useEffect } from 'react'
import Table from '../components/Table';
import axios from 'axios'
import * as XLSX from 'xlsx/xlsx.mjs';
import { useMyContext } from '../context/MyContext';
import { useRouter } from 'next/navigation';


const Employee = () => {
const router=useRouter();
    let {role,setRole}=useMyContext();
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
            Header: "Compensatory Leave",
            accessor: "compOffLeave"
        },
        {
            Header: "Department",
            accessor: "department"
        },

    ]

    const data = jsonData?.map((data, i) => ({
        name: data?.name,
        availableLeave: data?.availableLeave,
        takenLeave: data?.takenLeave,
        compOffLeave: data?.compOffLeave,
        department: data?.department,
    }));

    const displayJSON = () => {
        let token=localStorage.token
        let headers={authorization:token}
        if(token){
        axios.post("/api/empfetch",{},{headers})
            .then(res => {
                setJsonData(res?.data)

            })
        }else{router.push('/login')}
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
            const requiredKeys = ["name", "email", "availableLeave", "takenLeave", "department"];
            const keysExist = requiredKeys.every(key => Object.keys(convertJsonData[0]).includes(key));
            let token=localStorage.token
            let headers={authorization:token}
            if(token){
            if (keysExist) {
                axios.post('/api/importEmployee', { addValue: convertJsonData },{headers}).then(res => {
                    if (res?.data === "imported") {
                        displayJSON();
                    }
                }).catch((err) => { console.log(err); })

                // console.log(1234567);
            } else { alert('Name ,Email, availableLeave , takenLeave, department does not exist or change the column name like that') }
        }else{router.push('/login')}
        }
    }, [convertJsonData])


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);


    };

    function downloadExcelSample() {

        const jsonDataCopy = JSON.parse(JSON.stringify(jsonData));
        const headers=Object.keys(jsonDataCopy[0])
        const ws = XLSX.utils.json_to_sheet([{}], { header: headers, skipHeader: false });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
        const url = URL.createObjectURL(blob);
    
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Employee Details Sample.xlsx';
        a.click();
    
        URL.revokeObjectURL(url);
    }

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


    return (role==="admin" || role==="approver") ?(
         <div className='mt-24'>
           {role === "admin" ? <div className='flex justify-between w-11/12 m-auto'>

                <div className='flex gap-5'>
                    <input type="file" accept=".xls, .xlsx" onChange={handleFileChange}
                        className='block text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100 border rounded-lg p-1 cursor-pointer'
                    />
                    {selectedFile && <button className='btn p-3 border'
                        onClick={() => {
                            setSelectedFile(null);
                            setconvertJsonData(null);
                        }}

                    >Cancel</button>}
                </div>
                <button className='add-holiday-btn' onClick={downloadExcelSample}>Sample Data</button>

                <button onClick={() => downloadExcel(jsonData)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
                    <span title='Download employee details as excel file'>Employee Details(Excel)</span>
                </button>
            </div>:''}

            <Table columns={columns} data={data} className={'emp-table'} />


        </div>

    ):("")
}

export default Employee
