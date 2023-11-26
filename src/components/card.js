// функции работы с карточками

import { setLikeCard } from '../components/api';

// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// Функция создания карточки
// функция, которая принимает в аргументах данные одной карточки и функцию-колбэки для удаления, лайка, открытия изображения, а возвращает подготовленный к выводу элемент карточки
// функция создания карточки переиспользуется при добавлении карточек из массива и при добавлении новых карточек через модальное окно.
// вызывается в renderCards, submitAddCardForm

export function createCard(cardData, handleDeleteCardBtn, likeFunction, imageExpandFunction, userId) {
  const cardTemplate = getCardTemplate();

  const cardImage = cardTemplate.querySelector('.card__image');
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  const card = cardTemplate.querySelector('.card');
  cardTemplate.querySelector('.card__title').textContent = cardData.name;
  cardTemplate.querySelector('.card__like-counter').textContent = cardData.likes.length;

  // закрашиваем лайк, если мы эту карточку лайкнули, то есть в карточке (массиве likes) есть id пользователя
  if (cardData.likes.some(card => card._id === userId)) {
    // закрасим лайк
    card.querySelector('.card__like-button').classList.add('card__like-button_is-active');
  }

  const likeCardButton = cardTemplate.querySelector('.card__like-button');
  likeCardButton.addEventListener('click', () => likeFunction(cardData._id, likeCardButton));

  // кнопка удаления карточки
  const cardDeleteButton = cardTemplate.querySelector('.card__delete-button');

  // показываем кнопку удаления и устанавливаем обработчик по кнопке удаления
  // если id создателя карточки === id пользователя
  if (cardData.owner._id === userId) {
    cardDeleteButton.addEventListener('click', () => handleDeleteCardBtn(cardData, cardDeleteButton));
  } else {
    // скрываем кнопку удаления карточки, если карточка создана не пользователем
    cardDeleteButton.classList.add('card__delete-button_inactive');
  }

  cardTemplate.querySelector('.card__image').addEventListener('click', () => imageExpandFunction(cardData));

  return cardTemplate;
}

function getCardTemplate() {
  return cardTemplate.cloneNode(true);
}

// функция лайка карточки
// вызов из renderCards/createCard, submitAddCardForm/uploadCard/createCard
export function likeCard(cardId, likeCardButton) {

  const card = likeCardButton.closest('.card');

  // 'card__like-button_is-active'
  if (!likeCardButton.classList.contains('card__like-button_is-active')) {
    setLikeCard(cardId, true)
      .then(res => {

        card.querySelector('.card__like-counter')
            .textContent = res.likes.length;

        likeCardButton.classList.add('card__like-button_is-active');
      }).catch(err => {
        // если ошибка
        console.log(`Ошибка лайка карточки: ${err}`);
      });
  } else {
    setLikeCard(cardId, false)
      .then(res => {

        card.querySelector('.card__like-counter')
            .textContent = res.likes.length;

        likeCardButton.classList.remove('card__like-button_is-active');
      }).catch(err => {
        // если ошибка
        console.log(`Ошибка дизлайка карточки: ${err}`);
      });
  }
}
