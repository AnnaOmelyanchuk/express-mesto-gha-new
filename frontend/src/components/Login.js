import React from 'react';
import '../index.css';

function Login({ name, buttonText, title, onSubmit, setHeaderCaption }) {

    React.useEffect(() => {
        setHeaderCaption({
            text: 'Регистрация',
            link: '/sing-up',
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
                            <input className="popup__input popup__input_text_name popup_input_place_login-register" type="text" value={name || ''}
                                name="name" placeholder='Email ' required minLength={2} maxLength={40} />
                            <span className="popup__error-caption popup__error-caption_place_name" />
                        </div>
                        <div>
                            <input className="popup__input popup__input_text_caption popup_input_place_login-register" type="password" name="about" placeholder='О себе...' required minLength={2} maxLength={200}
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