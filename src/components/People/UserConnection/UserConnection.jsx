import React from 'react';
import './UserConnection.scss';
import Avatar from '../../Avatar/Avatar';

export default function UserConnection(props) {
   const { user, avatarColor } = props;
   const firstInitial = user.first_name.split('')[0];
   const lastInitial = user.last_name.split('')[0];
   const userInitials = firstInitial + lastInitial;

   return (
      <div className='user-connection'>
         <div className='connection-info-container'>
            <div className='connection-avatar-container'>
               <Avatar initials={userInitials} color={avatarColor}/>
            </div>
            <div className='connection-name-email-container'>
               <p>{user.first_name} {user.last_name}</p>
               <p>{user.email}</p>
            </div>
         </div>
      </div>
   )
}
