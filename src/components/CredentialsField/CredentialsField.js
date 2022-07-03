import React from 'react';
import './CredentialsField.css';

export const CredentialsField = ( {
    label,
    inputValue,
    id,
    name,
    placeholder,
    isNumeric,
    inputChangeHandler
} ) => (
    <li className='credentialsFieldItem'>
        <label className='credentialsLabel' htmlFor={ id }>
            { label }
        </label>
        <input
            className='credentialsInput'
            id={ id }
            name={ name }
            value={ inputValue }
            placeholder={ placeholder }
            inputMode={ isNumeric ? 'numeric' : 'text' }
            onChange={ inputChangeHandler }
        />
    </li>
);
