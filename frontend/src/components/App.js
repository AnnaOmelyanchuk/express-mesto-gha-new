import '../index.css'
import React from 'react'
import Header from './Header'
import Main from './Main'
import Footer from './Footer'
import PopupWithForm from './PopupWithForm'
import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup'
import ImagePopup from './ImagePopup'
import PopupInfo from './PopupInfo'
import { api as api } from '../utils/Api'
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import { Routes, Route } from 'react-router-dom'
import Register from './Register'
import Login from './Login'


function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = React.useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [cardsForDelete, setCardsForDelete] = React.useState();
  const [loadingCaption, setLoadingCaption] = React.useState(true);
  const [headerCaption, setHeaderCaption] = React.useState({ text: '', link: '', email: '' });

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  function closeAllPopupsByAbroad(e) {
    if (e.target.classList.contains('popup_opened')) {
      closeAllPopups(e)
    }
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsEditProfilePopupOpen(false)
    setIsConfirmPopupOpen(false)
    setImagePopupOpen(false)
    setSelectedCard({})
  }

  function handleCardClick(e) {
    setSelectedCard(e)
    setImagePopupOpen(true)
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card, isLiked).then((newCard) => {
      setCards((cards) => cards.map((c) => c._id === card._id ? newCard : c));
    })
      .catch(err => console.log(`Ошибка.....: ${err}`));
  }

  function handleCardDelete(card) {
    setIsConfirmPopupOpen(true)
    setCardsForDelete(card)
  }

  function handleCardConfirmDelete(e) {
    setLoadingCaption(false)
    e.preventDefault();
    api.deleteCard(cardsForDelete).then(() => {
      setCards((cards) => cards.filter((c) => c._id != cardsForDelete._id));
      setIsConfirmPopupOpen(false)
      setLoadingCaption(true)
      setCardsForDelete(null)
    })
      .catch(err => console.log(`Ошибка.....: ${err}`));
  }

  function handleUpdateUser(data) {
    setLoadingCaption(false)
    api.setUserInfo(data).then((UserInfo) => {
      setCurrentUser({
        ...currentUser,
        name: UserInfo.name,
        about: UserInfo.about
      })
      setIsEditProfilePopupOpen(false)
      setLoadingCaption(true)
    })
      .catch(err => console.log(`Ошибка.....: ${err}`));
  }

  function handleUpdateAvatar(data) {
    setLoadingCaption(false)
    api.setUserAvatar(data).then((UserInfo) => {
      setCurrentUser({
        ...currentUser,
        avatar: UserInfo.avatar
      })
      setIsEditAvatarPopupOpen(false)
      setLoadingCaption(true)
    })
      .catch(err => console.log(`Ошибка.....: ${err}`));
  }

  function handleAddPlace(data) {
    setLoadingCaption(false)
    api.postCardNameLink(data).then((dataCard) => {
      setCards([dataCard, ...cards])
      setIsAddPlacePopupOpen(false)
      setLoadingCaption(true)
    })
      .catch(err => console.log(`Ошибка.....: ${err}`));
  }

  React.useEffect(() => {
    function handleEscClose(e) {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    }
    document.addEventListener('keydown', handleEscClose);
  }, []);

  React.useEffect(() => {
    Promise
      .all([api.getUserInformationMe(), api.getInitialCardsSection()])
      .then(([userData, cardsData]) => {
        setCurrentUser(userData)
        setCards(cardsData)
      })
      .catch(err => console.log(`Ошибка.....: ${err}`));
  }, []
  );

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <Header textHeader={headerCaption.text} link={headerCaption.link} email={headerCaption.email} />
        <Routes>

          <Route path="/sing-up" element={<Register buttonText={loadingCaption ? 'Зарегистрироваться' : 'Регистрируюсь...'}
            onSubmit={handleCardConfirmDelete} setHeaderCaption={setHeaderCaption}  title="Регистрация" />} />

          <Route path="/sing-in" element={<Login buttonText={loadingCaption ? 'Войти' : 'Вхожу...'} name="confirm" title="Вход"
            onSubmit={handleCardConfirmDelete} setHeaderCaption={setHeaderCaption} />} />

          <Route path="/" element={<Main
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
          />}
          />

        </Routes>
        <EditProfilePopup buttonText={loadingCaption ? null : 'Сохранение...'} name="edit" title="Редактировать профиль" isOpen={isEditProfilePopupOpen}
          onClosePopup={closeAllPopups} onClosePopupByAbroad={closeAllPopupsByAbroad} onUpdateUser={handleUpdateUser} />

        <AddPlacePopup buttonText={loadingCaption ? null : 'Сохранение...'} name="edit" description="Редактировать профиль"
          isOpen={isAddPlacePopupOpen} onClosePopup={closeAllPopups} title="Новое место"
          onClosePopupByAbroad={closeAllPopupsByAbroad} cards={cards} setCards={setCards} onAddPlace={handleAddPlace} />

        <EditAvatarPopup buttonText={loadingCaption ? null : 'Сохранение...'} name="edit-avatar" title="Обновить аватар"
          isOpen={isEditAvatarPopupOpen} onClosePopup={closeAllPopups}
          onClosePopupByAbroad={closeAllPopupsByAbroad} onUpdateAvatar={handleUpdateAvatar} />

        <PopupWithForm buttonText={loadingCaption ? 'Да' : 'Удаление...'} name="confirm" title="Вы уверены?" isOpen={isConfirmPopupOpen} onClosePopup={closeAllPopups}
          onClosePopupByAbroad={closeAllPopupsByAbroad} onSubmit={handleCardConfirmDelete} />

        <ImagePopup isOpen={isImagePopupOpen} onClosePopup={closeAllPopups} card={selectedCard} onClosePopupByAbroad={closeAllPopupsByAbroad} />

<PopupInfo Вы успешно title="Вы успешно зарегистрировались!"></PopupInfo>
        <Footer />

      </CurrentUserContext.Provider>
    </>
  );
}

export default App;
