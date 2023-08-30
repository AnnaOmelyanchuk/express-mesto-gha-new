import '../index.css';

function PopupWithForm({ onClosePopupByAbroad, isOpen, onClosePopup, name, buttonText, title, children, onSubmit}) {

    return (
        <>
            <div className={`popup popup_edit ${isOpen ? 'popup_opened' : ''}`} onClick={onClosePopupByAbroad}>
                <div className="popup__reletive-block">
                    <button className={`popup__close-btn popup__close-btn_place_form popup__close-btn_edit`} type="button" aria-label="закрыть" onClick={onClosePopup} />
                    <div className="popup__container">
                        <form className="popup__form popup__form_edit" name={name} onSubmit={onSubmit}>
                            <h2 className="popup__title">{title}</h2>
                            {children}
                            <button className="popup__save-btn" type="submit">{buttonText || 'Сохранить'}</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PopupWithForm;

