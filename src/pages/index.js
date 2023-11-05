import './index.css';
import { createCard, deleteCard, likeCard } from '../components/card';
import { openModal, closeModal } from '../components/modal';
import initialCards from '../components/cards';

// ul где отображаются карточки
const placesList = document.querySelector('.places__list');

// кнопка редактирования профиля
const editProfileButton = document.querySelector('.profile__edit-button');

// Находим объект модального окна
const editProfileModalWindow = document.querySelector('.popup.popup_type_edit');
// Находим форму на модальном окне
const formElement = editProfileModalWindow.querySelector('form');
// имя и занятие на странице в области профиля
const profileName = document.querySelector('.profile__title')
const profileDescription = document.querySelector('.profile__description')
// имя и занятие не форме
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');
// Прикрепляем обработчик к форме:
formElement.addEventListener('submit', submitEditProfileForm);

// Обработчик «отправки» формы при редактировании профиля
function submitEditProfileForm(evt) {
  evt.preventDefault();

  // Получите значение полей jobInput и nameInput из свойства value
  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closeModal(editProfileModalWindow);
  formElement.removeEventListener('submit', submitEditProfileForm);
}

// обработка редактирования профиля
editProfileButton.addEventListener('click', function () {
  openModal(editProfileModalWindow);

  handleCloseModalByCross(editProfileModalWindow);

  // заполняем форму данными из профиля со страницы
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
});

// кнопка добавления карточки
const addCardButton = document.querySelector('.profile__add-button');

// окно добавления карточки
const addCardWindow = document.querySelector('.popup.popup_type_new-card');
// Находим форму на модальном окне
const addCardForm = addCardWindow.querySelector('form');
// имя и занятие не форме
const description = addCardForm.querySelector('.popup__input_type_card-name');
const urlInput = addCardForm.querySelector('.popup__input_type_url');

// Прикрепляем обработчик к форме:
addCardForm.addEventListener('submit', submitAddCardForm);

// Обработчик «отправки» формы при добавлении карточки
function submitAddCardForm(evt) {
  evt.preventDefault();

  // создаем объект карточку на основе значений полей urlInput и description из свойства value
  const card = {
    name: description.value,
    link: urlInput.value
  }

  closeModal(addCardWindow);

  placesList.prepend(createCard(card, deleteCard, likeCard, handleImageClick));

  addCardForm.reset();
  addCardForm.removeEventListener('submit', submitAddCardForm);
}

// обработчик добавления карточки
addCardButton.addEventListener('click', function () {
  openModal(addCardWindow);

  handleCloseModalByCross(addCardWindow);
});

// окно для просмотра изображения карточки
const imagePopup = document.querySelector('.popup.popup_type_image');
// находим img объект для записи в него url и alt
const image = imagePopup.querySelector('.popup__image');
// находим p для записи в него текста описания картинки
const imageDescription = imagePopup.querySelector('.popup__caption');

// обработчик раскрытия изображения в попап окне
function handleImageClick(cardData) {

  image.src = cardData.link;
  image.alt = cardData.name;

  imageDescription.textContent = cardData.name;

  openModal(imagePopup);
  handleCloseModalByCross(imagePopup);
}

// обработчик зарытия модального окна по клику на закрывающий крекстик
function handleCloseModalByCross(modalWindow) {
  const popupCloseButton = modalWindow.querySelector('.popup__close');

  popupCloseButton.addEventListener('click', function() {
    closeModal(modalWindow);
  })
}

// вывод всех карточек из массива на страницу в элемент .places__list
function renderCards() {
  initialCards.forEach(card => {
    placesList.append(createCard(card, deleteCard, likeCard, handleImageClick));
  });
}

// Вывести карточки на страницу
renderCards()