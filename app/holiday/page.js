"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import 'font-awesome/css/font-awesome.min.css';
import Table from '../components/Table';
import DynamicForm from '../components/DynamicForm';
import { validateUserholiday } from '../components/ValidationSchema';

import * as XLSX from 'xlsx/xlsx.mjs';
import { useRouter } from "next/navigation";
import { useMyContext } from '../context/MyContext';

const { v4: uuidv4 } = require('uuid');




const holiday = () => {
    const route = useRouter();


    let { role, setRole } = useMyContext();

    const [addholiday, setAddHoliday] = useState(false)
    const [edit, setEdit] = useState(false)
    const [jsonData, setJsonData] = useState([]);
    const [deleteData, setDeleteData] = useState(false);
    const [dataId, setDataId] = useState();

    const [selectedUpdateData, setSelectedUpdateData] = useState();
    const [changevalue, setChangeValue] = useState({
        id: selectedUpdateData?.id,
        Date: selectedUpdateData?.Date,
        Day: selectedUpdateData?.Day,
        Description: selectedUpdateData?.Description,
    });

    const [selectedRowData, setSelectedRowData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [convertJsonData, setconvertJsonData] = useState(null);



    const [addValue, setaddValue] = useState({
        Date: '',
        Day: '',
        Description: '',
        id: uuidv4()
    });


    function overlay() {
        setAddHoliday((pre) => !pre)
    }


    function editbtn(e, data) {
        setSelectedUpdateData(data);
        setEdit(true);
    }



    function handleinsert(e) {
        e.preventDefault();

        let token = localStorage.token
        let headers = { authorization: token }
        if (token) {
            axios.post('/api/holidaycreate', { addValue: addValue }, { headers })
                .then((res) => {
                    if (res.status === 200) {
                        displayJSON();
                        setAddHoliday(false);
                    }
                })
                .catch(error => {
                    console.error('Error updating JSON data:', error);
                });
        } else { route.push('/login') }
    }


    const columns = [                    //ustable
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
        },
        {
            Header: "Edit",
            accessor: "button"

        }
    ]


    const data = jsonData.map((data, i) => ({
        id: data.id,
        Date: data.Date,
        Day: data.Day,
        Description: data.Description,
        button: (
            <>
                <button className="edit-btn" onClick={(e) => editbtn(e, data)}>
                    Edit
                </button>
                <button className="delete-btn" onClick={() => deletebtn(data.id)} >
                    Delete
                </button>
            </>
        )

    }));

    const userHolidayColumns = [
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

    const userHolidaydata = jsonData.map((data, i) => ({
        Date: data.Date,
        Day: data.Day,
        Description: data.Description,
    }));


    const deletebtn1 = (dataId) => {
        let token = localStorage.token
        let headers = { authorization: token }
        const id = dataId;
        if (token) {
            axios
                .post(`/api/holiday/delete`, { id }, { headers })
                .then((res) => {
                    if (res.status === 200) {
                        displayJSON();
                        setDeleteData(false)

                    }
                })
                .catch((error) => {
                    console.error('Error updating JSON data:', error);
                });
        } else { route.push('/login') }
    }

    const deletebtn = (id) => {

        setDeleteData(true)
        setDataId(id);

    };



    const displayJSON = () => {
        let token = localStorage?.token
        let headers = { authorization: token }
        if (token) {

            axios.post("/api/holidayfetch", {}, { headers })
                .then(res => {
                    if (res.status === 200) {
                        setJsonData(res.data)
                    } 
                    else if ((res.status === 403) || (res.status === 401)) {
                        route.push('/login')
                    }

                })
                // .catch(err => console.log(err))
        } else {
            route.push('/login')
        }
    }


    useEffect(() => {

        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
                if (sheetData.length > 0) {
                    const dataWithUUIDs = sheetData.map((item) => ({
                        ...item,
                        id: uuidv4(),
                    }));
                    setconvertJsonData(dataWithUUIDs);
                }
            };
            reader.readAsArrayBuffer(selectedFile);

        }
        displayJSON();

    }, [selectedFile])

    useEffect(() => {
        if (convertJsonData?.length > 0) {
            const requiredKeys = ["Date", "Day", "Description"];
            const keysExist = requiredKeys.every(key => Object.keys(convertJsonData[0]).includes(key));
            let token = localStorage.token
            let headers = { authorization: token }
            if (token) {
                if (keysExist) {
                    axios.post('/api/importholiday', { addValue: convertJsonData }, { headers }).then(res => {
                        if (res?.data === "imported") {
                            displayJSON();
                        }
                    })
                    // .catch((err) => { console.log(err); })

                } else { alert('Date ,Day, Description does not exist or change the column name like Date,Day,Description') }
            } else { route.push('/login') }
        }
    }, [convertJsonData])


    const fields = [
        {
            name: 'Date',
            label: 'Date',
            type: 'date',
            placeholder: 'Enter Your Name',
            disabled: false,
        },
        {
            name: 'Day',
            label: 'Day',
            type: 'text',
            disabled: true,

        },
        {
            name: 'Description',
            label: 'Description',
            type: 'text',
            disabled: false,
        },
    ]

    useEffect(() => {
        setChangeValue({
            id: selectedUpdateData?.id,
            Date: selectedUpdateData?.Date,
            Day: selectedUpdateData?.Day,
            Description: selectedUpdateData?.Description,
        });
    }, [selectedUpdateData]);

    function editValue(e, key) {
        setChangeValue((prev) => ({
            ...prev,
            [key]: e.target.value || undefined, // Set to undefined if it's an empty string
        }));
    }

    const onChange = (name, value) => {

        setaddValue({
            ...addValue,
            [name]: value,
        });
    };


    const submitbtn = (e) => {
        e.preventDefault();

        let token = localStorage.token
        let headers = { authorization: token }
        if (token) {
            axios
                .post('/api/holiday/update', { changevalue: changevalue }, { headers })
                .then((res) => {
                    if (res.status === 200) {
                        displayJSON();
                         setEdit(false);  // Added this to hide the edit form after submission
                    }
                })
                .catch((error) => {
                    console.error('Error updating JSON data:', error);
                });
        } else { route.push('/login') }
    };



    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);


    };



    function downloadExcelSample() {

        const jsonDataCopy = JSON.parse(JSON.stringify(jsonData));
        jsonDataCopy.forEach((item) => {
            delete item.id;
        });
        const headers = Object.keys(jsonDataCopy[0])
        const ws = XLSX.utils.json_to_sheet([{}], { header: headers, skipHeader: false });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'holidays.xlsx';
        a.click();

        URL.revokeObjectURL(url);
    }
    function downloadExcel(jsonData) {

        const jsonDataCopy = JSON.parse(JSON.stringify(jsonData));
        jsonDataCopy.forEach((item) => {
            delete item.id;
        });

        const ws = XLSX.utils.json_to_sheet(jsonDataCopy);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'holidays.xlsx';
        a.click();

        URL.revokeObjectURL(url);
    }

    useEffect(() => {
        if (addValue.Date.length > 0) {
            let date = new Date(addValue.Date);
            let day = date.toLocaleDateString("en-us", { weekday: 'long' });
            setaddValue({ ...addValue, Day: day })
        }
        if (changevalue?.Date?.length > 0) {
            let date = new Date(changevalue.Date);
            let day = date.toLocaleDateString("en-us", { weekday: 'long' });
            setChangeValue({ ...changevalue, Day: day })
        }
    }, [addValue.Date, changevalue.Date])
    return (
        <>

            <main className='add-holiday-parent mt-24'>
                {role === "admin" ? <div className='flex justify-between w-11/12 m-auto mt-10 items-center flex-wrap gap-7'>
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
                    <button className='add-holiday-btn' onClick={overlay}>Add Holiday</button>
                    <button className='add-holiday-btn' onClick={downloadExcelSample}>Sample Data</button>
                </div> : ""}
                <Table columns={role === "admin" ? columns : userHolidayColumns} data={role === "admin" ? data : userHolidaydata} className={'status-table'} />
                <div className='flex justify-between w-11/12 m-auto mt-10 flex-wrap'>

                    <button onClick={() => downloadExcel(jsonData)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                        <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
                        <span title='Download holidays as excel file'>Holiday(Excel)</span>
                    </button>
                </div> 
                {addholiday && <div className='parent-add-holiday' >
                    <div className='leave-border  d-animate-overlay lg:w-auto max-sm:w-11/12 md:w-3/5'>
                        <div className='heaed-and-close'>
                            <b> <h2 align="center " className='decoration-emerald-600'>Add Holiday</h2></b>
                            <i className="fa fa-times exit-icon " aria-hidden="true" onClick={() => setAddHoliday(false)} ></i>
                        </div>
                        <DynamicForm fields={fields} onSubmit={handleinsert} onChange={onChange} data={addValue} validate={validateUserholiday} />



                    </div>
                </div>}
                {edit && <div className='parent-add-holiday' >
                    <div className='leave-border  d-animate-overlay lg:w-auto max-sm:w-11/12 md:w-3/5'>

                        <form className='apply-leave-form' onSubmit={(e)=>submitbtn(e)}>

                            <div className='heaed-and-close'>
                                <b> <h2 align="center text-2xl">Edit Holiday</h2></b>
                                <i className="fa fa-times exit-icon " aria-hidden="true" onClick={() => setEdit(false)} ></i>
                            </div>

                            <div className='flex'>
                                <label className='w-1/2'>Choose Date:</label>

                                <input  className='w-1/2 border rounded p-1' type="date" onChange={(e) => editValue(e, "Date")}
                                    value={changevalue.Date || ''} />
                            </div>
                            <div className='flex'>
                                <label >Day:</label>
                                <input  className='w-1/2 border rounded p-1' type="text" onChange={(e) => editValue(e, "Day")}
                                    disabled={true}
                                    value={changevalue.Day || ''} />
                            </div>
                            <div className='flex'>
                                <label>Description:</label>
                                <input  className='w-1/2 border rounded p-1'
                                    type="text"
                                    onChange={(e) => editValue(e, "Description")}
                                    value={changevalue.Description || ''}

                                />
                            </div>
                            <div className='add-holiday-submit-btn flex w-1/2'>
                                <button className='border-2 border-blue-500 p-2 mt-5 text-blue-500 rounded' type='submit'>Submit</button>

                            </div>

                        </form>
                    </div>
                </div>}

                {deleteData && <div className=' flex justify-center mb-6 top-0  w-full  items-center fixed h-screen  bg-black bg-opacity-30	'>
                    <div className=' border-zinc-950 h-44 w-96  rounded-md  d-animate-overlay  bg-white p-2 lg:w-auto max-sm:w-11/12 md:w-3/5 '>
                        <div className='flex justify-between '>
                            <h1 className='ml-6 mt-4 font-bold text-red-800 '>Confirm !</h1>
                            <i className="fa fa-times mr-4 mt-4 text-red-800 cursor-pointer  " aria-hidden="true" onClick={() => setDeleteData(false)}  ></i>
                        </div>
                        <h2 className='flex justify-center mt-8 '>Are you sure, want to delete the data ?</h2>
                        <div className='flex justify-between mt-8'>
                            <button className='w-16 border ml-10 rounded text-green-600 ' onClick={() => deletebtn1(dataId)} >Yes</button>
                            <button className='w-16 border mr-10 rounded text-red-600' onClick={() => setDeleteData(false)}>No</button>
                        </div>
                    </div>
                </div>}
            </main>
        </>
    )
}

export default holiday








// function downloadExcel(jsonData) {

//     const jsonDataCopy = JSON.parse(JSON.stringify(jsonData));
//     jsonDataCopy.forEach((item) => {
//         delete item.id;
//     });

//     const ws = XLSX.utils.json_to_sheet(jsonDataCopy);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//     const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//     const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

//     const url = URL.createObjectURL(blob);

//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'holidays.xlsx';
//     a.click();

//     URL.revokeObjectURL(url);
// }
