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
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      // если ошибка, отклоняем промис
      return Promise.reject(`Ошибка получения инфо пользователя: ${res.status}`);
    });
}

export const setUserInfo = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      about: about
    })
  });
}

export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      // если ошибка, отклоняем промис
      return Promise.reject(`Ошибка загрузки массива карточек: ${res.status}`);
    });
}

export const uploadCard = ({name, link}) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      link: link,
    })
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      // если ошибка, отклоняем промис
      return Promise.reject(`Ошибка загрузки карточки: ${res.status}`);
    });
}

export const deleteCardFromServer = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
    // .then(res => {
    //   if (res.ok) {
    //     return res.json();
    //   }

    //   // если ошибка, отклоняем промис
    //   return Promise.reject(`Ошибка удаления карточки: ${res.status}`);
    // });
}

export const setLikeCard = (cardId, like) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: `${like ? 'PUT' : 'DELETE'}`,
    headers: config.headers
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      // если ошибка, отклоняем промис
      return Promise.reject(`Ошибка лайка карточки: ${res.status}`);
    });
}

export const uploadAvatar = (link) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: link,
    })
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      // если ошибка, отклоняем промис
      return Promise.reject(`Ошибка загрузки аватара: ${res.status}`);
    });
}

export const checkUrl = (link) => {
  return fetch(link, {
    method: 'HEAD'
  })
    .then(res => {
      if (res.ok) {
        return res.headers.get('Content-Type') === 'image/jpg';
      }

      // если ошибка (res !== 'ok'), отклоняем промис
      return Promise.reject(`Ошибка проверки ссылки аватара: ${res.status}`);
    })
    .catch(() => Promise.reject(`Ошибка проверки типа ссылки аватара`));
}
