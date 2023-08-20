import React from 'react'
import PopupWithForm from './PopupWithForm'
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function EditProfilePopup({ onClosePopupByAbroad, isOpen, onClosePopup, onUpdateUser, buttonText, title }) {
    const currentUser = React.useContext(CurrentUserContext);
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');

    React.useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser, isOpen]);

    function handleChange(e) {
        e.target.name === "name" && setName(e.target.value)
        e.target.name === "about" && setDescription(e.target.value)
    }

    function handleSubmite(e) {
        e.preventDefault();
        onUpdateUser({
            name: name,
            about: description,
        });
    }

    return (
        <>
            <PopupWithForm buttonText={buttonText} name="edit" description="Редактировать профиль" isOpen={isOpen} onClosePopup={onClosePopup}
                onClosePopupByAbroad={onClosePopupByAbroad} onSubmit={handleSubmite} title={title}>
                <div>
                    <input className="popup__input popup__input_text_name" type="text" value={name || ''} onChange={handleChange}
                        name="name" placeholder='Введите Имя' required minLength={2} maxLength={40} />
                    <span className="popup__error-caption popup__error-caption_place_name" />
                </div>
                <div>
                    <input className="popup__input popup__input_text_caption" type="text" name="about" placeholder='О себе...' required minLength={2} maxLength={200}
                        value={description || ''} onChange={handleChange} />
                    <span className="popup__error-caption popup__error-caption_place_name" />
                </div>
            </PopupWithForm>
        </>
    );
}

export default EditProfilePopup;
