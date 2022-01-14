import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../utils/auth';

const Header = () => {
  //logout function
  const logout = event => {
    event.preventDefault();
    //execute .logout() method to remove token and bring user back to homepage 'logged out'
    Auth.logout();
  };

  return (
    <header className="bg-secondary mb-4 py-2 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <Link to ='/'>
          <h1>Deep Thoughts</h1>
        </Link>

        <nav className='text-center'>
          {/* IF logged in... */}
          {Auth.loggedIn() ? (
            //render "Me" & "Logout" on nav
            <>
            <Link to='/profile'>Me</Link>
            <a href='/' onClick={logout}>Logout</a>
            </>
          //IF not logged in, render Login and Signup on nav
          ) : (
            <>
          <Link to='/login'>Login</Link>
          <Link to='/signup'>Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
