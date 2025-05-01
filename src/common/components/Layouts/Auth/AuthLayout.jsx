import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../../assets/Logo.svg';

function AuthLayout({children}) {
    const navigate = useNavigate();
    
  return (
    <div className="container">
        <header className="header">
            <Link to={{pathname: '/'}} className="header__logo"> <Logo/> </Link>
        </header>
        <main className="main">
            {children}
        </main>
    </div>
  )
}

export default AuthLayout;
