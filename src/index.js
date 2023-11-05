import './pages/index.css';
import { createCard, deleteCard, likeCard } from './components/card';
import { openModal, closeModal } from './components/modal';
import initialCards from './components/cards';

// ul где отображаются карточки
export const placesList = document.querySelector('.places__list');

// кнопка редактирования профиля
const editProfileButton = document.querySelector('.profile__edit-button');

// обработка редактирования профиля
editProfileButton.addEventListener('click', function () {
  const editProfileModalWindow = document.querySelector('.popup.popup_type_edit');

  openModal(editProfileModalWindow);

  // имя и занятие на странице в области профиля
  const profileName = document.querySelector('.profile__title')
  const profileDescription = document.querySelector('.profile__description')

  // Находим форму на модальном окне
  const formElement = editProfileModalWindow.querySelector('form');

  // Прикрепляем обработчик к форме:
  formElement.addEventListener('submit', handleFormSubmit);

  // имя и занятие не форме
  const nameInput = formElement.querySelector('.popup__input_type_name');
  const jobInput = formElement.querySelector('.popup__input_type_description');

  // заполняем форму данными из профиля со страницы
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;

  // Обработчик «отправки» формы при редактировании профиля
  function handleFormSubmit(evt) {
    evt.preventDefault();

    // Получите значение полей jobInput и nameInput из свойства value
    profileName.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value;

    closeModal(editProfileModalWindow);
    formElement.removeEventListener('submit', handleFormSubmit);
  }

});

// кнопка добавления карточки
const addCardButton = document.querySelector('.profile__add-button');

// окно добавления карточки
const addCardWindow = document.querySelector('.popup.popup_type_new-card');

// обработчик добавления карточки
addCardButton.addEventListener('click', function () {
  openModal(addCardWindow);

  // Находим форму на модальном окне
  const formElement = addCardWindow.querySelector('form');

  // Прикрепляем обработчик к форме:
  formElement.addEventListener('submit', handleFormSubmit);

  // Обработчик «отправки» формы при добавлении карточки
  function handleFormSubmit(evt) {
    evt.preventDefault();

    // имя и занятие не форме
    const nameInput = formElement.querySelector('.popup__input_type_card-name');
    const urlInput = formElement.querySelector('.popup__input_type_url');

    // создаем объект карточку на основе значений полей jobInput и nameInput из свойства value
    const card = {
      name: nameInput.value,
      link: urlInput.value
    }

    initialCards.unshift(card);

    closeModal(addCardWindow);

    placesList.prepend(createCard(card, deleteCard, likeCard, handleImageClick));

    formElement.reset();
    formElement.removeEventListener('submit', handleFormSubmit);
  }
});

function handleImageClick(cardData) {
  // окно для просмотра изображения карточки
  const imagePopup = document.querySelector('.popup.popup_type_image');

  const image = imagePopup.querySelector('.popup__image');
  image.src = cardData.link;
  image.alt = cardData.name;

  const description = imagePopup.querySelector('.popup__caption');
  description.textContent = cardData.name;

  openModal(imagePopup);
}

// вывод всех карточек из массива на страницу в элемент .places__list
function renderCards() {
  initialCards.forEach(card => {
    placesList.append(createCard(card, deleteCard, likeCard, handleImageClick));
  });
}

// Вывести карточки на страницу
renderCards()