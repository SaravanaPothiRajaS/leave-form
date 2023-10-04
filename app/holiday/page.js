"use client"
import React, { useState, useEffect } from 'react'
import 'font-awesome/css/font-awesome.min.css';
import Table from '../components/Table';
import axios from 'axios';
import DynamicForm from '../components/DynamicForm';
import { validateUserholiday } from '../components/ValidationSchema';
import * as XLSX from 'xlsx/xlsx.mjs';

const { v4: uuidv4 } = require('uuid');



const holiday = () => {

    const [addholiday, setAddHoliday] = useState(false)
    const [edit, setEdit] = useState(false)
    const [jsonData, setJsonData] = useState([]);
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


    function editbtn() {


        setSelectedRowData(data);
        setEdit(true);


    }
    //create api
    function handleinsert() {
        axios.post('/api/holidaycreate', { addValue: addValue })
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

    const data = jsonData?.map((data, i) => ({
        Date: data?.Date,
        Day: data?.Day,
        Description: data?.Description,
        button: <button className='edit-btn' onClick={editbtn}>Edit</button>
    }));

    const displayJSON = () => {

        axios.get("/api/holidayfetch")
            .then(res => {
                setJsonData(res.data)

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
                const dataWithUUIDs = sheetData.map((item) => ({
                    ...item,
                    uuid: uuidv4(),
                }));
                setconvertJsonData(dataWithUUIDs);
            };
            reader.readAsArrayBuffer(selectedFile);

        }
        displayJSON();

    }, [selectedFile])

    useEffect(() => {
        if (convertJsonData?.length > 0) {
            const requiredKeys = ["Date", "Day", "Description"];
            const keysExist = requiredKeys.every(key => Object.keys(convertJsonData[0]).includes(key));
            if (keysExist) {
                axios.post('/api/importholiday', { addValue: convertJsonData }).then(res => {
                    if (res?.data === "imported") {
                        displayJSON();
                    }
                }).catch((err) => { console.log(err); })

                // console.log(1234567);
            } else { alert('Date ,Day, Description does not exist or change the column name like Date,Day,Description') }
        }
    }, [convertJsonData])


    const fields = [
        {
            name: 'Date',
            label: 'Date',
            type: 'date',
            placeholder: 'Enter Your Name',
        },
        {
            name: 'Day',
            label: 'Day',
            type: 'text',

        },
        {
            name: 'Description',
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



    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

    };


    function downloadExcel(jsonData) {

        const jsonDataCopy = JSON.parse(JSON.stringify(jsonData));
        jsonDataCopy.forEach((item) => {
            delete item.uuid;
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


    return (
        <>

            <main className='add-holiday-parent'>
                <div className='add-holiday-btn'><button onClick={overlay}>Add Holiday</button></div>
                <input type="file" accept=".xls, .xlsx" onChange={handleFileChange}
                    className='block w-full text-sm text-slate-500
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
                <Table columns={columns} data={data} className={'holiday-table'} />

                <button onClick={() => downloadExcel(jsonData)} class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
                    <span>Download Excel</span>
                </button>

                {addholiday && <div className='parent-add-holiday' >
                    <div className='add-holiday'>
                        <DynamicForm fields={fields} onSubmit={handleinsert} onChange={onChange} data={addValue} validate={validateUserholiday} />
                        <button className='btn p-3 border-neutral-950' type='button' onClick={() => setAddHoliday(false)}>Back</button>

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




{/* <form>
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
    <button>Submit</button>
</div>

</form> */}