import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as auth from '../utils/MestoAuth'

function Register({setLoggedSuccess, setIsInfoPopupOpen, name, buttonText, title, setHeaderCaption, handleLogin }) {

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
        const { password, email } = formValue;
        auth.register(password, email).then((res) => {
            setHeaderCaption({
                text: 'Выйти',
                link: '/signin',
                email: formValue.email
            })
            setLoggedSuccess(true)
            navigate("/signin", { replace: true })
            setIsInfoPopupOpen(true)
        }
        )
            .catch(() => {
                setLoggedSuccess(false)
                setIsInfoPopupOpen(true)
            });

    }

    React.useEffect(() => {
        setHeaderCaption({
            text: 'Войти',
            link: '/signin',
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
                                value={formValue.email} onChange={handleChange}
                                name="email" placeholder='Email' required minLength={2} maxLength={40} />
                            <span className="popup__error-caption popup__error-caption_place_name" />
                        </div>
                        <div>
                            <input className="popup__input popup__input_text_caption popup_input_place_login-register" type="password"
                                name="password" placeholder='Пароль' required minLength={2} maxLength={200}
                                value={formValue.password} onChange={handleChange}
                            />
                            <span className="popup__error-caption popup__error-caption_place_name" />
                        </div>
                        <button className="popup__save-btn popup__save-btn_place_login-register" type="submit">{buttonText}</button>
                        <Link to={'/signin'} className='popup__caption popup__caption_place_register' >Уже зарегистрированы? Войти</Link>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register;