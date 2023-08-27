class Api {
  constructor({ baseUrl, cardUrl, avatarUrl, headers, }) {
    this.baseUrl = baseUrl;
    this.cardUrl = cardUrl;
    this.avatarUrl = avatarUrl;
    this.headers = headers;
  }

  _checkResponse(res) {
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
        authorization: this.headers.authorization
      }
    })
  }

  getInitialCardsSection() {
    return this._request(this.cardUrl, {
      headers: {
        authorization: this.headers.authorization,
      }
    })
  }

  setUserInfo(data) {
    return this._request(this.baseUrl, {
      method: 'PATCH',
      headers: {
        authorization: this.headers.authorization,
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
        authorization: this.headers.authorization,
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
        authorization: this.headers.authorization,
        'Content-Type': 'application/json'
      },
    })
  }

  postCardNameLink(data) {
    return this._request(this.cardUrl, {
      method: 'POST',
      headers: {
        authorization: this.headers.authorization,
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
        authorization: this.headers.authorization,
        'Content-Type': 'application/json'
      },
    })
  }

  putLike(data) {
    return this._request(`${this.cardUrl}/${data._id}/likes`, {
      method: 'PUT',
      headers: {
        authorization: this.headers.authorization,
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

const api = new Api({
  baseUrl: 'https://api.Anyamesto.nomoreparties.co/users/me',
  cardUrl: 'https://api.Anyamesto.nomoreparties.co/cards',
  avatarUrl: `https://api.Anyamesto.nomoreparties.co/users/me/avatar`,
  baseUrl: 'https://api.Anyamesto.nomoreparties.co/users/me',
  headers: { authorization: `Bearer ${localStorage.getItem('jwt')}` }
});

export { api };