import React from 'react';
import './AdminMember.css';

export const AdminMember = ( {
    id,
    bot,
    firstName,
    lastName,
    rank,
    username
} ) => (
    <li id={ id } className='adminMember'>
        <span className='adminMemberInfo'>
            <span className='adminMemberName'>
                <span className={ `adminMemberNameWrapper ${ bot ? 'isBot' : '' }` }>
                    { firstName && `${ firstName }` }{ lastName && ` ${ lastName }` }
                </span>
            </span>
            <span className='adminMemberUsername'>
                <a
                    className='adminMemberLink linkStyle'
                    href={ `https://t.me/${ username }` }
                    target='_blank'
                >
                    @{ username }
                </a>
            </span>
            <span className='adminMemberRank'>
                { rank }
            </span>
        </span>
    </li>
);
