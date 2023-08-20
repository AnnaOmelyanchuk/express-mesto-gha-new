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
import { api } from '../utils/Api'
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Register from './Register'
import Login from './Login'
import ProtectedRouteElement from "./ProtectedRoute"; // импортируем HOC
import * as auth from '../MestoAuth';



function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = React.useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = React.useState(false);
  const [isInfoOpen, setIsInfoPopupOpen] = React.useState(false);
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [cardsForDelete, setCardsForDelete] = React.useState();
  const [loadingCaption, setLoadingCaption] = React.useState(true);
  const [headerCaption, setHeaderCaption] = React.useState({ text: '', link: '', email: '' });
  const [loggedIn, setLoggedIn] = React.useState(false);
  const handleLogin = () => {
    setLoggedIn(true);
  }

  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    navigate("/singin", { replace: true })
    setLoggedIn(false)
  }


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
    setIsInfoPopupOpen(false)
    setIsConfirmPopupOpen(false)
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
    handleTokenCheck();
  }, [])

  const handleTokenCheck = () => {
    if (localStorage.getItem('jwt')) {
      const jwt = localStorage.getItem('jwt');
      auth.checkToken(jwt).then((res) => {
        if (res) {
          setHeaderCaption({
            text: 'Выйти',
            link: '/signin',
            email: res.data.email
          })
          setLoggedIn(true);
          navigate("/mesto", { replace: true })
        }

      });
    }
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
        {console.log(headerCaption)}
        <Header textHeader={headerCaption.text} link={headerCaption.link} email={headerCaption.email} handleSignOut={handleSignOut} />
        <Routes>

          <Route path="/" element={loggedIn ? <Navigate to="/mesto" replace /> : <Navigate to="/signin" replace />} />

          <Route path="/signup" element={<Register buttonText={loadingCaption ? 'Зарегистрироваться' : 'Регистрируюсь...'}
            onSubmit={handleCardConfirmDelete} setHeaderCaption={setHeaderCaption} title="Регистрация" />} />

          <Route path="/signin" element={<Login buttonText={loadingCaption ? 'Войти' : 'Вхожу...'} name="confirm" title="Вход"
            onSubmit={handleCardConfirmDelete} setHeaderCaption={setHeaderCaption} handleLogin={handleLogin} />} />

          <Route path="/mesto" element={<ProtectedRouteElement element={Main} loggedIn={loggedIn} setHeaderCaption={setHeaderCaption} headerCaption={headerCaption}
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

        <PopupInfo isOpen={isInfoOpen} onClosePopup={closeAllPopups} onClosePopupByAbroad={closeAllPopupsByAbroad} title="Вы успешно зарегистрировались!"></PopupInfo>
        <Footer />

      </CurrentUserContext.Provider>
    </>
  );
}

export default App;
