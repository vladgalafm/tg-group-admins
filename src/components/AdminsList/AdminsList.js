import React from 'react';
import { AdminMember } from '../AdminMember/AdminMember';
import './AdminsList.css';

export const AdminsList = ( {
    adminsList
} ) => (
    <section className='adminsListWrapper'>
        <h1 className='adminsListTitle'>
            Group Admins list
        </h1>
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
