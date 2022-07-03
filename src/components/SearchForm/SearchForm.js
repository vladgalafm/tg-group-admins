import React from 'react';
import { Spinner } from '../Spinner/Spinner';
import { SubmitButton } from '../SubmitButton/SubmitButton';
import './SearchForm.css';

export const SearchForm = ( {
    isFetching,
    formSubmitHandler,
    inputValue,
    isValidInput,
    inputChangeHandler,
    resetCredentialsHandler
} ) => (
    <div className={ `searchFormWrapper ${ isFetching ? 'fetching' : '' }` }>
        <button
            className='resetButton'
            title='Reset credentials and interrupt session'
            onClick={ resetCredentialsHandler }
        >
            Reset
        </button>
        <form
            className='searchForm'
            onSubmit={ formSubmitHandler }
        >
            <div className='searchTitleWrapper'>
                <h2 className='searchTitle'>
                    Paste group link* or group username**
                </h2>
                <span className='searchHint'>
                    * Use web-client <a className='linkStyle' href="https://webk.telegram.org" target='_blank'>
                        https://webk.telegram.org
                    </a> for getting group links, or paste shortened links looking like <span className='linkStyle'>
                        t.me/chatname
                    </span>
                </span>
                <span className='searchHint'>
                    ** Example: <span className='linkStyle'>
                        @chatname
                    </span>
                </span>
            </div>
            <label
                className='searchLabel'
                htmlFor='searchInput'
            >
                <input
                    className='searchInput'
                    id='searchInput'
                    name='tg_channel_link'
                    value={ inputValue }
                    placeholder='https://webk.telegram.org/#@chatname'
                    inputMode='search'
                    onChange={ inputChangeHandler }
                />
            </label>
            <SubmitButton
                isDisabled={ ! isValidInput }
                name='Search'
            />
        </form>
        { isFetching && <Spinner /> }
    </div>
);
