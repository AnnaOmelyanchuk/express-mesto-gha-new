import '../index.css'
import { useEffect, useState } from 'react';
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
import ProtectedRouteElement from "./ProtectedRoute";
import * as auth from '../utils/MestoAuth';



function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [isInfoOpen, setIsInfoPopupOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [cardsForDelete, setCardsForDelete] = useState();
  const [loadingCaption, setLoadingCaption] = useState(true);
  const [headerCaption, setHeaderCaption] = useState({ text: '', link: '', email: '' });
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedSuccess, setLoggedSuccess] = useState(false);



  const handleLogin = () => {
    setLoggedIn(true);
  }

  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    navigate("/signin", { replace: true })
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
    const isLiked = card.likes.some(i => i === currentUser._id);
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

  useEffect(() => {
    handleTokenCheck();

console.log(loggedIn)
  }, [])

  const handleTokenCheck = () => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.checkToken(jwt).then((res) => {
        if (res) {
          setLoggedIn(true);
          setHeaderCaption({
            text: 'Выйти',
            link: '/signin',
            email: res.email
          })
          setCurrentUser(res)
          navigate("/mesto", { replace: true })
        }
      })
        .catch(err => console.log(`Ошибка.....: ${err}`))

    }
  }


  useEffect(() => {
    function handleEscClose(e) {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    }
    document.addEventListener('keydown', handleEscClose);
  }, []);

  useEffect(() => {
    handleGetUserAndCards();

  }, [loggedIn]);

  const handleGetUserAndCards = () => {
    Promise
      .all([api.getUserInformationMe(), api.getInitialCardsSection()])
      .then(([userData, cardsData]) => {
        setLoggedIn(true);
        setCurrentUser(userData)
        setCards(cardsData)

      })
      .catch(err => console.log(`Ошибка.....: ${err}`));
  }


  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <Header textHeader={headerCaption.text} link={headerCaption.link} email={headerCaption.email} handleSignOut={handleSignOut} />
        <Routes>

          <Route path="/" element={loggedIn ? <Navigate to="/mesto" replace /> : <Navigate to="/signin" replace />} />

          <Route path="/signup" element={<Register setLoggedSuccess={setLoggedSuccess} setIsInfoPopupOpen={setIsInfoPopupOpen} buttonText={loadingCaption ? 'Зарегистрироваться' : 'Регистрируюсь...'}
            onSubmit={handleCardConfirmDelete} setHeaderCaption={setHeaderCaption} title="Регистрация" handleLogin={handleLogin} />} />

          <Route path="/signin" element={<Login setLoggedSuccess={setLoggedSuccess} setIsInfoPopupOpen={setIsInfoPopupOpen} buttonText={loadingCaption ? 'Войти' : 'Вхожу...'} name="confirm" title="Вход"
            onSubmit={handleCardConfirmDelete} setHeaderCaption={setHeaderCaption} handleLogin={handleLogin} headerCaption={headerCaption} />} />

          <Route path="/mesto" element={<ProtectedRouteElement element={Main} loggedIn={loggedIn}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
            currentUser={currentUser}
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

        <PopupInfo loggedSuccess={loggedSuccess} isOpen={isInfoOpen} onClosePopup={closeAllPopups} onClosePopupByAbroad={closeAllPopupsByAbroad} title={''} ></PopupInfo>
        <Footer />

      </CurrentUserContext.Provider>
    </>
  );
}

export default App;
