import React from 'react'
import PopupWithForm from './PopupWithForm'
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function EditAvatarPopup({ onClosePopupByAbroad, isOpen, onClosePopup, onUpdateAvatar, buttonText }) {
    const currentUser = React.useContext(CurrentUserContext);
    const avatarInput = React.useRef();
    const [avatar, setAvatar] = React.useState('');

    React.useEffect(() => {
        setAvatar(currentUser.avatar);
    }, [currentUser, isOpen]);

    React.useEffect(() => {
        setAvatar('');
    }, [isOpen]);

    function handleSubmite(e) {
        e.preventDefault();
        onUpdateAvatar({
            avatar: avatarInput.current.value,
        });
    }
    function handleChange() {
        setAvatar(avatarInput.current.value)
    }

    return (
        <>
            <PopupWithForm buttonText={buttonText} name="edit-avatar" title="Обновить аватар" isOpen={isOpen} onClosePopup={onClosePopup} onClosePopupByAbroad={onClosePopupByAbroad} onSubmit={handleSubmite}>
                <div>
                    <input className="popup__input popup__input_text_name" ref={avatarInput} value={avatar} onChange={handleChange} type="text" name="name"
                        placeholder='Ссылка на картинку' required minLength={2} />
                    <span className="popup__error-caption popup__error-caption_place_name" />
                </div>
            </PopupWithForm>
        </>
    );
}

export default EditAvatarPopup;

