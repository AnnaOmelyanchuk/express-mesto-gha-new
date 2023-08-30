import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as auth from '../utils/MestoAuth'

function Login({ setLoggedSuccess, setIsInfoPopupOpen, name, buttonText, title, setHeaderCaption, handleLogin }) {

    const [formValue, setFormValue] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormValue({
            ...formValue,
            [name]: value
        });

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        auth.authorize(formValue.password, formValue.email)
            .then((data) => {
                if (data.token) {
                    setHeaderCaption({
                        text: 'Выйти',
                        link: '/signin',
                        email: formValue.email
                    })
                    setFormValue({ email: '', password: '' });
                    handleLogin();
                    navigate('/mesto', { replace: true });
                }
            })
            .catch(() => {
                setLoggedSuccess(false)
                setIsInfoPopupOpen(true)
            });

    }

    React.useEffect(() => {
        setHeaderCaption({
            text: 'Регистрация',
            link: '/signup',
            email: ''
        })
    }, []);

    return (
        <>
            <div className="popup__reletive-block_place_login-register">
                <div className="popup__container">
                    <form className="popup__form popup__form_edit" name={name} onSubmit={handleSubmit}>
                        <h2 className="popup__title">{title}</h2>
                        <div>
                            <input className="popup__input popup__input_text_name popup_input_place_login-register" type="text"
                                name="email" value={formValue.email} placeholder='Email'
                                required minLength={2} maxLength={40} onChange={handleChange} />
                            <span className="popup__error-caption popup__error-caption_place_name" />
                        </div>
                        <div>
                            <input className="popup__input popup__input_text_caption popup_input_place_login-register" type="password"
                                name="password" placeholder='Пароль' required minLength={2} maxLength={200} onChange={handleChange}
                            />
                            <span className="popup__error-caption popup__error-caption_place_name" />
                        </div>
                        <button className="popup__save-btn popup__save-btn_place_login-register" type="submit">{buttonText}</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;