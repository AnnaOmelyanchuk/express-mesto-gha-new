import '../index.css';
import successLogo from '../images/popup/success.svg';

function PopupInfo({ onClosePopupByAbroad, isOpen, onClosePopup, name, buttonText, title, children, onSubmit }) {

    return (
        <>
            <div className={`popup popup_edit popup_opened`} onClick={onClosePopupByAbroad}>
                <div className="popup__reletive-block">
                    <button className={`popup__close-btn popup__close-btn_place_form popup__close-btn_edit`} type="button" aria-label="закрыть" onClick={onClosePopup} />
                    <div className="popup__container">
                        <form className="popup__form popup__form_edit" name={name} onSubmit={onSubmit}>
                        <img  src={successLogo} alt="аватар" className="profile__avatar-img" />
                            <h2 className="popup__title">{title}</h2>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PopupInfo;