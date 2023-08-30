import '../index.css'
import React from 'react'
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function Card({ card, onCardClick, onCardLike, onCardDelete }) {

    const currentUser = React.useContext(CurrentUserContext);
    const isOwn = card.owner._id === currentUser._id;
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    const cardLikeButtonClassName = (
        `photo-grid__caption-image ${isLiked && 'photo-grid__caption-image_background_active'}`
    );;

    function handleCardClick() {
        onCardClick(card)
    }

    function handleDeleteClick() {
        onCardDelete(card)
    }

    function handleLikeClick() {
        onCardLike(card)
    }

    return (
        <>
            <li className="photo-grid__item" >
                <img src={card.link} alt={card.name} className="photo-grid__image" onClick={handleCardClick} />
                {isOwn && <button className="photo-grid__button-delete" type="button" onClick={handleDeleteClick}></button>}
                <div className="photo-grid__captions">
                    <h2 className="photo-grid__caption">{card.name}</h2>
                    <div className="photo-grid__like-box">
                        <button className={cardLikeButtonClassName} onClick={handleLikeClick} type="button"></button>
                        <span className="photo-grid__quantity-like">{card.likes.length}</span>
                    </div>
                </div>
            </li>
        </>
    );
}

export default Card;


