import React from 'react'
import PopupWithForm from './PopupWithForm'

function AddPlacePopup({ onClosePopupByAbroad, isOpen, onClosePopup, onAddPlace, buttonText, title }) {
    const [nameCard, setNameCard] = React.useState('');
    const [linkCard, setLinkCard] = React.useState('');

    React.useEffect(() => {
        setNameCard('')
        setLinkCard('')
    }, [isOpen]);

    function handleChange(e) {
        e.target.name === "name" && setNameCard(e.target.value)
        e.target.name === "link" && setLinkCard(e.target.value)
    }

    function handleAddPlaceSubmit(e) {
        e.preventDefault();
        onAddPlace({
            name: nameCard,
            link: linkCard,
        });
    }

    return (
        <>
            <PopupWithForm buttonText={buttonText} name="edit" description="Редактировать профиль" isOpen={isOpen} onClosePopup={onClosePopup}
                onClosePopupByAbroad={onClosePopupByAbroad} onSubmit={handleAddPlaceSubmit} title={title}>
                <div>
                    <input className="popup__input popup__input_img_name" type="text" name="name" placeholder='Имя места' required minLength={2} maxLength={30}
                        value={nameCard} onChange={handleChange} />
                    <span className="popup__error-caption popup__error-caption_place_name" />
                </div>
                <div>
                    <input className="popup__input popup__input_img_link" name="link" placeholder='Ссылка на картинку' required type="url"
                        value={linkCard} onChange={handleChange} />
                    <span className="popup__error-caption popup__error-caption_place_name" />
                </div>
            </PopupWithForm>
        </>
    );
}

export default AddPlacePopup;
