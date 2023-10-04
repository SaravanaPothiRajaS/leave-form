"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import Table from '../components/Table';
import DynamicForm from '../components/DynamicForm';
import { validateUserholiday } from '../components/ValidationSchema';
import { v4 as uuidv4 } from 'uuid';



const holiday = () => {

    const [addholiday, setAddHoliday] = useState(false)
    const [edit, setEdit] = useState(false)
    const [jsonData, setJsonData] = useState([]);
    const [selectedUpdateData, setSelectedUpdateData] = useState();
    const [changevalue, setChangeValue] = useState({
        id: selectedUpdateData?.id,
        Date: selectedUpdateData?.Date,
        Day: selectedUpdateData?.Day,
        Description: selectedUpdateData?.Description,
    });
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
    const deletebtn = (id) => {


        console.log(id);
        axios
            .post(`/api/holiday/delete`, { id })
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    displayJSON();
                }
            })
            .catch((error) => {
                console.error('Error updating JSON data:', error);
            });
    };


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

    const displayJSON = () => {

        axios.get("/api/holidayfetch")
            .then(res => {
                setJsonData(res.data)

            })
    }

    useEffect(() => {
        displayJSON();
    }, [])




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

    const submitbtn = () => {
        console.log('Changevalue', changevalue);
        axios
            .post(`/api/holiday/update`, { changevalue })
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    displayJSON();
                    setEdit(false);  // Added this to hide the edit form after submission
                }
            })
            .catch((error) => {
                console.error('Error updating JSON data:', error);
            });
    };



    return (
        <>

            <main className='add-holiday-parent'>
                <div className='add-holiday-btn'><button onClick={overlay}>Add Holiday</button></div>
                <Table columns={columns} data={data} className={'holiday-table'} />

                {addholiday && <div className='parent-add-holiday' >
                    <div className='add-holiday'>
                        <div className='exit-icon' onClick={() => setAddHoliday(false)}>    <i class="fa fa-times" aria-hidden="true" ></i></div>
                        <DynamicForm fields={fields} onSubmit={handleinsert} onChange={onChange} data={addValue} validate={validateUserholiday} />

                    </div>
                </div>}
                {edit && <div className='parent-add-holiday' >
                    <div className='add-holiday'>

                        <form>
                            <div className='exit-icon' onClick={() => setEdit(false)}>    <i className="fa fa-times" aria-hidden="true" ></i></div>
                            <h2>Edit Holiday</h2>

                            <div className='add-date'>
                                <label>Choose Date:</label>
                                <input type="date" onChange={(e) => editValue(e, "Date")}
                                    value={changevalue.Date || ''} />
                            </div>
                            <div className='add-day'>
                                <label >Day:</label>
                                <input type="text" onChange={(e) => editValue(e, "Day")}
                                    value={changevalue.Day || ''} />
                            </div>
                            <div className='add-description'>
                                <label>Description:</label>
                                <input
                                    type="text"
                                    onChange={(e) => editValue(e, "Description")}
                                    value={changevalue.Description || ''}

                                />
                            </div>
                            <div className='add-holiday-submit-btn'>
                                <button onClick={submitbtn}>Submit</button>
                            </div>

                        </form>
                    </div>
                </div>}
            </main>
        </>
    )
}

export default holiday




