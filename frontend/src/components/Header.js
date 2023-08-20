import '../index.css';
import headerLogo from '../images/logo/header-logo.svg';

function Header({email, link, textHeader }) {
    return (
        <>
            <header className="header">
                <img src={headerLogo} alt="Логотип" className="header__logo" />
                <div className='header__personal'>
                    <p className='header__user-email' >{email}</p>
                    <a className='header__sing-in-button' href={link} >{textHeader}</a>
                </div>
            </header>
        </>
    );
}

export default Header;