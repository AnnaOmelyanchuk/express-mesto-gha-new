import '../index.css';
import successLogo from '../images/popup/success.svg';
import failLogo from '../images/popup/fail.svg';

function PopupInfo({ onClosePopupByAbroad, isOpen, onClosePopup, loggedSuccess }) {

    return (
        <>
            <div className={`popup popup_image-viewer ${isOpen ? 'popup_opened' : ''}`} onClick={onClosePopupByAbroad}>
                <div className="popup__reletive-block">
                    <button className={`popup__close-btn popup__close-btn_place_form popup__close-btn_edit`} type="button" aria-label="закрыть" onClick={onClosePopup} />
                    <div className="popup__container">
                        <img src={loggedSuccess ? successLogo : failLogo} 
                            alt="Успех" className="popup__tooltip-image " />
                        <h2 className="popup__title popup__title_place_popupinfo">{loggedSuccess ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте еще раз.'}</h2>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PopupInfo;