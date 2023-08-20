import '../index.css'
import React from 'react'
import Card from '../components/Card'
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function Main({headerCaption, onEditAvatar, onEditProfile, onAddPlace, onCardClick, onCardLike, cards, onCardDelete, setHeaderCaption }) {

    React.useEffect(() => {
        setHeaderCaption(headerCaption)
    }, []);

    const currentUser = React.useContext(CurrentUserContext);

    return (
        <>
            <main>
                <section aria-label="Профиль" className="profile" >
                    <div className="profile__avatar">
                        <img src={currentUser.avatar} alt="аватар" className="profile__avatar-img" onClick={onEditAvatar} />
                    </div>
                    <div className="profile__info">
                        <h1 className="profile__name">{currentUser.name}</h1>
                        <button className="profile__edit-button" type="button" aria-label="редактировать" onClick={onEditProfile} />
                        <p className="profile__caption">{currentUser.about}</p>
                    </div>
                    <button className="profile__add-button" type="button" aria-label="добавить" onClick={onAddPlace} />
                </section>

                <section aria-label="Фото мест" className="photo-grid">
                    <ul className="photo-grid__list">
                        {cards.map((card) => <Card key={card._id} card={card} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete} />)}
                    </ul>
                </section>
            </main>
        </>
    );
}

export default Main;

