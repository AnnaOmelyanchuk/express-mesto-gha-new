import '../index.css';

function ImagePopup({ isOpen, onClosePopupByAbroad, card, onClosePopup }) {

  return (
    <>
      <div className={`popup popup_image-viewer ${isOpen ? 'popup_opened' : ''}`} onClick={onClosePopupByAbroad}>
        <div className="popup__reletive-block">
          <figure>
            <img src={card.link} alt={card.name} className="popup__image" />
            <figcaption className="popup__caption">{card.name}</figcaption>
          </figure>
          <button className="popup__close-btn popup__close-btn_place_image popup__close-btn_image-viewer" type="button"
            aria-label="закрыть" onClick={onClosePopup}></button>
        </div>
      </div>
    </>
  );
}

export default ImagePopup;