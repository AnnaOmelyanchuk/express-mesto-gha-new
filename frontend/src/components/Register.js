import React from 'react';

function Register({ name, buttonText, title, onSubmit, setHeaderCaption }) {

    React.useEffect(() => {
        setHeaderCaption({
            text: 'Войти',
            link: '/sing-in',
            email: ''
        })
    }, []);

    return (
        <>
            <div className="popup__reletive-block_place_login-register">
                <div className="popup__container">
                    <form className="popup__form popup__form_edit" name={name} onSubmit={onSubmit}>
                        <h2 className="popup__title">{title}</h2>
                        <div>
                            <input className="popup__input popup__input_text_name popup_input_place_login-register" type="text"  value={name || ''}
                                name="name" placeholder='Email' required minLength={2} maxLength={40} />
                            <span className="popup__error-caption popup__error-caption_place_name" />
                        </div>
                        <div>
                            <input className="popup__input popup__input_text_caption popup_input_place_login-register" type="password" name="about" placeholder='Пароль' required minLength={2} maxLength={200}
                            />
                            <span className="popup__error-caption popup__error-caption_place_name" />
                        </div>
                        <button className="popup__save-btn popup__save-btn_place_login-register" type="submit">{buttonText}</button>
                        <a className='popup__caption popup__caption_place_register' href={'/sing-in'} >Уже зарегистрированы? Войти</a>
                    </form>

                </div>
            </div>
        </>
    );
}

export default Register;