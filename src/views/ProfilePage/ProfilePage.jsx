import React, { Component } from 'react';
import './ProfilePage.scss';
import Header from '../../components/Header/Header';

export default class Profile extends Component {
   render() {
      return (
         <div className='profile page-content'>
            <Header />
            <h1>Profile</h1>
         </div>
      )
   }
}
