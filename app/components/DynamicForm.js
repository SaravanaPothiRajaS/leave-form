'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import "./form.css";




function DynamicForm({ fields, onSubmit, onChange, data,validate }) {

  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }, 
  } = useForm({
    defaultValues: "",
  
  });

console.log(data);

  const handleFormSubmit = async (data) => {

    try {

      const validatedData = await validate(data);
      
  
      onSubmit(validatedData);
      reset();
    } catch (error) {
 
      console.error('Validation failed:', error.errors);
      const validationErrors = error.inner.reduce((acc, validationError) => {
        return {
          ...acc,
          [validationError.path]: validationError.message,
        };
      }, {});

      
      errorsRef.current = validationErrors;
    }
  };
 
  const errorsRef = React.useRef({});
  console.log(data);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}  className='form-data apply-leave-form'>
      {fields.map((field) => (
        <div key={field.name} >
          <label>{field.label}</label>
          {field.type === 'select' ? (
          <div className='in-err'>  <select
              {...register(field.name)}
              onChange={(e) => onChange( field.name, e.target.value)}
            >
                <option>--select--</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errorsRef.current[field.name] && (
            <p className="error-message">{errorsRef.current[field.name]}</p>
          )}
            </div>
          ) : (
           <div className='in-err'> <input  
              type={field.type}
              {...register(field.name)}
              onChange={(e) => onChange(field.name, e.target.value)}
            />
             {errorsRef.current[field.name] && (
            <p className="error-message">{errorsRef.current[field.name]}</p>
          )}
            </div>
          )}

        </div>
      ))}
      <input type="submit" value="Apply"  className='button' />
    </form>
  );
}

export default DynamicForm;
