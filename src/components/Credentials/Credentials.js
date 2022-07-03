import React from 'react';
import { CredentialsField } from '../CredentialsField/CredentialsField';
import { SubmitButton } from '../SubmitButton/SubmitButton';
import './Credentials.css';

export const Credentials = ( {
    botTokenInputValue,
    apiIdInputValue,
    apiHashInputValue,
    inputChangeHandler,
    submitHandler
} ) => (
    <form className='credentialsForm' onSubmit={ submitHandler }>
        <h2 className='credentialsTitle'>
            Enter your credentials
        </h2>
        <ul className='credentialsList'>
            <CredentialsField
                label='Bot Token'
                inputValue={ botTokenInputValue }
                id='botTokenInput'
                name='bot_token'
                placeholder='1234567890:AbcDEfghIJklmnOPQrsTUvwxYz123456789'
                isNumeric={ false }
                inputChangeHandler={ inputChangeHandler }
            />
            <CredentialsField
                label='API ID'
                inputValue={ apiIdInputValue }
                id='apiIdInput'
                name='api_id'
                placeholder='1234567'
                isNumeric={ true }
                inputChangeHandler={ inputChangeHandler }
            />
            <CredentialsField
                label='API Hash'
                inputValue={ apiHashInputValue }
                id='apiHashInput'
                name='api_hash'
                placeholder='12345abc67890def12345abc67890def'
                isNumeric={ false }
                inputChangeHandler={ inputChangeHandler }
            />
        </ul>
        <SubmitButton
            isDisabled={ ! botTokenInputValue || ! parseInt( apiIdInputValue ) || ! apiHashInputValue }
            name='Save'
        />
    </form>
);
