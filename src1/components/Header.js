import '../index.css';
import headerLogo from '../images/logo/header-logo.svg';
import { Link, useNavigate } from 'react-router-dom'

function Header({ email, link, textHeader, handleSignOut }) {
    return (
        <>
            <header className="header">
                <img src={headerLogo} alt="Логотип" className="header__logo" />
                <div className='header__personal'>
                    <p className='header__user-email' >{email}</p>
                    <Link to={link} className='header__sing-in-button' onClick={handleSignOut} >{textHeader}</Link>
                </div>
            </header>
        </>
    );
}

export default Header;