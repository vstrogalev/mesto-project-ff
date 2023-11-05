// функции работы с карточками

// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// Функция создания карточки
// функция, которая принимает в аргументах данные одной карточки и функцию-колбэки для удаления, лайка, открытия изображения, а возвращает подготовленный к выводу элемент карточки
// функция создания карточки переиспользуется при добавлении карточек из массива и при добавлении новых карточек через модальное окно.

export function createCard(cardData, deleteFunction, likeFunction, imageExpandFunction) {
  const card = getCardTemplate();

  const cardImage = card.querySelector('.card__image');
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  card.querySelector('.card__title').textContent = cardData.name;
  card.querySelector('.card__delete-button').addEventListener('click', deleteFunction);
  card.querySelector('.card__like-button').addEventListener('click', likeFunction);
  card.querySelector('.card__image').addEventListener('click', () => imageExpandFunction(cardData));

  return card;
}

function getCardTemplate() {
  return cardTemplate.cloneNode(true);
}

// Функция удаления карточки
// В шаблоне карточек уже добавлена иконка удаления, при клике по ней выбранная карточка должна удаляться со страницы
export function deleteCard(evt) {
  const card = evt.target.closest('.card');
  card.remove();
}

// функция лайка карточки
export function likeCard(evt) {
  const card = evt.target;
  card.classList.toggle('card__like-button_is-active');
}
