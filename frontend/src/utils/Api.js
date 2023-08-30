class Api {
  constructor({ baseUrl, cardUrl, avatarUrl, headers, }) {
    this.baseUrl = baseUrl;
    this.cardUrl = cardUrl;
    this.avatarUrl = avatarUrl;
    this.headers = headers;
  }

  _checkResponse(res) {
    console.log(res);
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка ${res.status}`);
  }

  _request(url, options) {
    return fetch(url, options).then(this._checkResponse)
  }

  getUserInformationMe() {
    return this._request(this.baseUrl, {
      headers: {
     authorization: `Bearer ${localStorage.getItem('jwt')}` 
      }
    })
  }

  getInitialCardsSection() {
    return this._request(this.cardUrl, {
      headers: {
      authorization: `Bearer ${localStorage.getItem('jwt')}` 
        
      }
    })
  }

  setUserInfo(data) {
    return this._request(this.baseUrl, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}` ,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    })
  }

  setUserAvatar(data) {
    return this._request(this.avatarUrl, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}` ,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: data.avatar
      })
    })
  }

  deleteCard(data) {
    return this._request(`${this.cardUrl}/${data._id}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}` ,
        'Content-Type': 'application/json'
      },
    })
  }

  postCardNameLink(data) {
    return this._request(this.cardUrl, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}` ,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link
      })
    })
  }

  deleteLike(data) {
    return this._request(`${this.cardUrl}/${data._id}/likes`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}` ,
        'Content-Type': 'application/json'
      },
    })
  }

  putLike(data) {
    return this._request(`${this.cardUrl}/${data._id}/likes`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}` ,
        'Content-Type': 'application/json'
      },
    })
  }

  changeLikeCardStatus(data, isLiked) {
    if (isLiked) {
      return this.deleteLike(data);
    }
    else {
      return this.putLike(data);
    }
  }

}
/*
const api = new Api({
  baseUrl: 'http://localhost:3000/users/me',
  cardUrl: 'http://localhost:3000/cards',
  avatarUrl: `http://localhost:3000/users/me/avatar`,

});*/

const api = new Api({
  baseUrl: 'https://api.anyamesto.nomoreparties.co/users/me',
  cardUrl: 'https://api.anyamesto.nomoreparties.co/cards',
  avatarUrl: `https://api.anyamesto.nomoreparties.co/users/me/avatar`,
});

export { api };