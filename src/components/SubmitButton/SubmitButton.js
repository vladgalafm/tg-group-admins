import React from 'react';
import './SubmitButton.css';

export const SubmitButton = ( {
    isDisabled,
    name
} ) => (
    <button
        className='submitButton'
        disabled={ isDisabled }
    >
        { name }
    </button>
);
