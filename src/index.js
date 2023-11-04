import './pages/index.css';
import initialCards from './cards';

// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// DOM узлы
const placesList = document.querySelector('.places__list');

// Функция создания карточки
// функция, которая принимает в аргументах данные одной карточки и функцию-колбэк для удаления, а возвращает подготовленный к выводу элемент карточки
// клонировать шаблон,
// установить значения вложенных элементов,
// добавить к иконке удаления обработчик клика, по которому будет вызван переданный в аргументах колбэк.

function createCard(cardData, deleteCardFunction) {
  const card = cardTemplate.cloneNode(true);

  card.querySelector('.card__image').src = cardData.link;
  card.querySelector('.card__image').alt = cardData.name;
  card.querySelector('.card__title').textContent = cardData.name;
  card.querySelector('.card__delete-button').addEventListener('click', deleteCardFunction);

  return card;
}

// Функция удаления карточки
// В шаблоне карточек уже добавлена иконка удаления, при клике по ней выбранная карточка должна удаляться со страницы
function deleteCard(evt) {
  const card = evt.target.closest('.card');
  card.remove();
}

// Вывести карточки на страницу
// вывод всех карточек из массива на страницу в элемент .places__list
function renderCards() {
  initialCards.forEach(card => {
    placesList.append(createCard(card, deleteCard));
  });
}

// отображаем на странице
renderCards();