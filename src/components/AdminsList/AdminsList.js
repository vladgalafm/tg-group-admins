import React from 'react';
import { AdminMember } from '../AdminMember/AdminMember';
import './AdminsList.css';

export const AdminsList = ( {
    adminsList,
    copyToClipboardHandler
} ) => (
    <section className='adminsListWrapper'>
        <div className='adminsListTitleWrapper'>
            <h1 className='adminsListTitle'>
                Group Admins list
            </h1>
            <button
                className='adminsListCopyButton'
                aria-label='Copy admins IDs'
                title='Copy admins IDs to clipboard'
                onClick={ copyToClipboardHandler }
            ></button>
        </div>
        <ol className='adminsList'>
            { adminsList.map( ( member, index ) => (
                <AdminMember
                    key={ index }
                    { ...member }
                />
            ) ) }
        </ol>
    </section>
);
