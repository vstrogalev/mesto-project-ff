// функции работы с карточками

import { deleteCardFromServer, setLikeCard } from '../components/api';

// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// Функция создания карточки
// функция, которая принимает в аргументах данные одной карточки и функцию-колбэки для удаления, лайка, открытия изображения, а возвращает подготовленный к выводу элемент карточки
// функция создания карточки переиспользуется при добавлении карточек из массива и при добавлении новых карточек через модальное окно.

export function createCard(cardData, deleteFunction, likeFunction, imageExpandFunction, userId) {
  const cardTemplate = getCardTemplate();

  const cardImage = cardTemplate.querySelector('.card__image');
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  const card = cardTemplate.querySelector('.card');
  cardTemplate.querySelector('.card__title').textContent = cardData.name;
  cardTemplate.querySelector('.card__like-counter').textContent = cardData.likes.length;

  // закрашиваем лайк, если мы эту карточку лайкнули, то есть в карточке (массиве likes) есть id пользователя
  if (isCardLiked(cardData, userId)) {
    // установим атрибут лайк, чтобы потом при клике определять из html была ли лайкнута эта карточка
    card.dataset.liked = true;
    // закрасим лайк
    card.querySelector('.card__like-button').classList.add('card__like-button_is-active');
  } else {
    card.dataset.liked = false;
  }

  // сохраняем в дата атрибуте id карточки, чтобы потом либо лайкать ее либо при клике на кнопку ее удаления удалить ее с сервера
  card.dataset.id = cardData._id;

  // кнопка удаления карточки
  const cardDeleteButton = cardTemplate.querySelector('.card__delete-button');

  // показываем ее и навешиваем обработчки, если id создателя карточки === id пользователя
  if (cardData.owner._id === userId) {
    cardDeleteButton.addEventListener('click', deleteFunction);
  } else {
    // скрываем кнопку удаления карточки, если карточка создана не пользователем
    cardDeleteButton.classList.add('card__delete-button_inactive');
  }

  cardTemplate.querySelector('.card__like-button').addEventListener('click', likeFunction);
  cardTemplate.querySelector('.card__image').addEventListener('click', () => imageExpandFunction(cardData));

  return cardTemplate;
}

function getCardTemplate() {
  return cardTemplate.cloneNode(true);
}

// Функция удаления карточки
// В шаблоне карточек уже добавлена иконка удаления, при клике по ней выбранная карточка должна удаляться со страницы
export function deleteCard(evt) {
  const card = evt.target.closest('.card');

  // получаем id карточки из дата атрибута и удаляем ее с сервера по id
  deleteCardFromServer(card.dataset.id);

  // удаляем карточку со страницы
  card.remove();
}

// функция лайка карточки
export function likeCard(evt) {
  const likeButton = evt.target;

  const card = likeButton.closest('.card');
  const cardId = card.dataset.id;

  if (card.dataset.liked === 'false') {
    setLikeCard(cardId, true)
      .then(res => {

        card.querySelector('.card__like-counter')
            .textContent = res.likes.length;

        card.dataset.liked = true;
        likeButton.classList.add('card__like-button_is-active');
      });
  } else {
    setLikeCard(cardId, false)
      .then(res => {

        card.querySelector('.card__like-counter')
            .textContent = res.likes.length;

        card.dataset.liked = false;
        likeButton.classList.remove('card__like-button_is-active');
      });
  }

}

// функция определения, если ли id пользователя в массиве лайков карточки.
// параметры функции -  id пользователя и объект карточка
// likes[i]._id если равен id пользователя, то мы лайкнули эту карточку
// с помощью ее проверяем при создании карточки и если лайк есть, то закрашивать, иначе нет
export const isCardLiked = (card, userId) => {
  return card.likes.some(card => card._id === userId)
}
