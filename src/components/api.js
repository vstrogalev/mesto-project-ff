const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-1',
  headers: {
    authorization: 'ac3450cb-5c4e-4a3e-9264-27166909578b',
    'Content-Type': 'application/json'
  }
}

export const getUser = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  }).then(getResponseData);
}

export const setUserInfo = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      about: about
    })
  }).then(getResponseData);
}

export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  }).then(getResponseData)
}

export const uploadCard = ({name, link}) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      link: link,
    })
  }).then(getResponseData);
}

export const deleteCardFromServer = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  }).then(getResponseData);
}

export const setLikeCard = (cardId, like) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: `${like ? 'PUT' : 'DELETE'}`,
    headers: config.headers
  }).then(getResponseData);
}

export const uploadAvatar = (link) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: link,
    })
  }).then(getResponseData);
}


function getResponseData(res) {
  if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
  }
  return res.json();
}