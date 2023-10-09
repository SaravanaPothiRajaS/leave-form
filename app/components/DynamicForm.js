'use client';
import React from 'react';
import "./form.css";




function DynamicForm({ fields, onSubmit, onChange, data }) {

  

console.log(data);


  console.log(data);

  return (
    <form onSubmit={onSubmit}  className='form-data apply-leave-form'>
      {fields.map((field) => (
        <div key={field.name} >
          <label>{field.label}</label>
          {field.type === 'select' ? (
          <div className='in-err'>  
          <select
          required
          disabled={field?.disabled}
          value={data[field.name]}
      
              onChange={(e) => onChange( field.name, e.target.value)}
            >
                <option value={""}>--select--</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
         
            </div>
          ) : field.type === 'text' || field.type === 'date' ?(
           <div className='in-err'> <input  
           required
              type={field.type}
              value={data[field?.name]}
          disabled={field?.disabled}
           
              onChange={(e) => onChange(field.name, e.target.value)}
            />
       
            </div>
          ): field.type === 'textarea' ?
         (<textarea 
         type='text'
         disabled={field?.disabled}

         onChange={(e) => onChange(field.name, e.target.value)}
              className='leave-apply-textarea border'
         /> ):(
          <div className='in-err'> <input  
          className='border'
          required
             type={field.type}
             value={data[field.name]}
         disabled={field?.disabled}
          
             onChange={(e) => onChange(field.name, e.target.value)}
           />
      
           </div>
         )
          }

        </div>
      ))}
      <input type="submit" value="Apply"  className='button' />
    </form>
  );
}

export default DynamicForm;
