class Api {
  constructor({ baseUrl, headers }) {
    // constructor body
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then(this._checkResponse);
  }

  // other methods for working with the API
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then(this._checkResponse);
  }

  //editing user info
  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      // Send the data in the body as a JSON string.
      body: JSON.stringify({
        name,
        about,
      }),
    }).then(this._checkResponse);
  }

  //posting new card
  postNewCard({ name, link }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      // Send the data in the body as a JSON string.
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this._checkResponse);
  }

  // Editing Avatar
  editAvatarInfo(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      // Send the data in the body as a JSON string.
      body: JSON.stringify({
        avatar,
      }),
    }).then(this._checkResponse);
  }

  //Deleting Cards
  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._checkResponse);
  }

  //Add and Remove Likes

  handleLike(id, isLiked) {
    const method = isLiked ? "DELETE" : "PUT";

    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: method,
      headers: this._headers,
    }).then(this._checkResponse);
  }
}

export default Api;
