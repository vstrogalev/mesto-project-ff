import './index.css';
import { createCard, likeCard } from '../components/card';
import { openModal, closeModal } from '../components/modal';
import { enableValidation, clearValidation } from '../components/validation';
import {
  getInitialCards,
  getUser,
  setUserInfo,
  uploadCard,
  uploadAvatar,
  deleteCardFromServer } from '../components/api';
import { showInputError } from '../components/validation';

// ********************************
// загрузка и отображение профиля и карточек

// ul где отображаются карточки
const placesList = document.querySelector('.places__list');

// id пользователя
let userId;

const profileImage = document.querySelector('.profile__image'),
      profileName = document.querySelector('.profile__title'),
      profileDescription = document.querySelector('.profile__description');

// ждем информацию по пользователю и карточкам с сервера, чтобы только после этого отобразить их
Promise.all([getUser(), getInitialCards()])
  .then(res => {
    profileImage.style.backgroundImage = `url(${res[0].avatar})`;

    profileName.textContent = res[0].name;
    profileDescription.textContent = res[0].about;

    // заполняем id пользователя от сервера
    userId = res[0]._id;

    // Вывести карточки на страницу
    renderCards(userId, res[1]);
  })
  .catch(err => console.log(`Ошибка загрузки данных (карточки и профиль) с сервера ${err}`));

// вывод всех карточек из массива на страницу в элемент .places__list
function renderCards(userId, initialCards) {
  initialCards.forEach(card => {
    placesList.append(createCard(card, handleDeleteCardBtn, likeCard, handleImageClick, userId));
  });
}


// ********************************
// валидация форм


// включение валидации вызовом enableValidation
// все настройки передаются при вызове
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// включаем валидацию во всех формах
enableValidation(validationConfig);


// ********************************
// изменение аватара

const avatar = document.querySelector('.profile__image');

// Находим объект модального окна редактирования профиля
const changeAvatarModalWindow = document.querySelector('.popup_type_avatar');
// Находим форму на модальном окне
const formAvatar = changeAvatarModalWindow.querySelector('form');
// ссылка на картинку не форме
const urlAvatar = formAvatar.querySelector('.popup__input_type_url');

// Прикрепляем обработчик сохранения формы:
formAvatar.addEventListener('submit', submitChangeAvatarForm);

// Кнопка сохранения
const popupAvatarButton = formAvatar.querySelector('.popup__button');

// Устанавливаем обработчик закрытия окна по крестику
handleCloseModalByCross(changeAvatarModalWindow);

// Обработчик «отправки» формы при смене аватара
function submitChangeAvatarForm(evt) {
  evt.preventDefault();

  // меняем сообщение в кнопке на Сохранение...
  popupAvatarButton.textContent = 'Сохранение...';

  // выгружаем ссылку на сервер, получаем подтверждение, закрываем окно, отображаем аватар, полученную как подтверждение от сервера
  uploadAvatar(urlAvatar.value)
    .then(avatarUploaded => {
      closeModal(changeAvatarModalWindow);


      // меняем аватар
      avatar.style.backgroundImage = `url(${avatarUploaded.avatar})`;

      formAvatar.reset();
    })
    .catch(() => {
      showInputError(formAvatar, urlAvatar, 'Введите URL картинки', validationConfig)
    })
    .finally(() => {
      // восстановим текст кнопки сохранения формы
      popupAvatarButton.textContent = 'Сохранить';
    });
}


// обработка редактирования профиля
avatar.addEventListener('click', function () {
  openModal(changeAvatarModalWindow);

  // очистим валидацию формы
  clearValidation(changeAvatarModalWindow, validationConfig);
});



// ********************************
// редактирование профиля

// кнопка редактирования профиля
const editProfileButton = document.querySelector('.profile__edit-button');

// обработка редактирования профиля
editProfileButton.addEventListener('click', function () {
  openModal(editProfileModalWindow);

  // заполняем форму данными из профиля со страницы
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;

  // очистим валидацию формы
  clearValidation(editProfileModalWindow,validationConfig);
});

// Находим объект модального окна редактирования профиля
const editProfileModalWindow = document.querySelector('.popup.popup_type_edit');
// Находим форму на модальном окне
const formElement = editProfileModalWindow.querySelector('form');

// имя и занятие не форме
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');
// Прикрепляем обработчик к форме:
formElement.addEventListener('submit', submitEditProfileForm);
// Устанавливаем обработчик закрытия окна по крестику
handleCloseModalByCross(editProfileModalWindow);
// Кнопка сохранения
const popupProfileButton = formElement.querySelector('.popup__button');

// Обработчик «отправки» формы при редактировании профиля
function submitEditProfileForm(evt) {
  evt.preventDefault();

  // отправляем данные пользователя на сервер
  setUserInfo(nameInput.value, jobInput.value)
    .then(() => {
      // меняем текст кнопки сохранения на время сохранения на сервере
      popupProfileButton.textContent = 'Сохранение...';

      // Получите значение полей jobInput и nameInput из свойства value
      profileName.textContent = nameInput.value;
      profileDescription.textContent = jobInput.value;

      closeModal(editProfileModalWindow);
    })
    .catch((err) => console.log(`Ошибка сохранения данных профиля ${err}`))
    .finally(() => {
      // восстанавливаем текст кнопки на Сохранить
      popupProfileButton.textContent = 'Сохранить';
    });

}



// ********************************
// добавление карточки

// кнопка добавления карточки
const addCardButton = document.querySelector('.profile__add-button');

// окно добавления карточки
const addCardWindow = document.querySelector('.popup.popup_type_new-card');
// Находим форму на модальном окне
const addCardForm = addCardWindow.querySelector('form');
// название места и ссылка на картинку не форме
const description = addCardForm.querySelector('.popup__input_type_card-name');
const urlInput = addCardForm.querySelector('.popup__input_type_url');

// Прикрепляем обработчик к кнопке сохранения карточки
addCardForm.addEventListener('submit', submitAddCardForm);

// Кнопка сохранения
const popupCardButton = addCardForm.querySelector('.popup__button');

// Устанавливаем обработчик закрытия окна по крестику
handleCloseModalByCross(addCardWindow);

// Обработчик отправки данных формы при добавлении карточки
function submitAddCardForm(evt) {
  evt.preventDefault();

  // меняем текст кнопки на Сохранение...
  popupCardButton.textContent = 'Сохранение...';

  // создаем объект карточку на основе значений полей urlInput и description из свойства value
  const card = {
    name: description.value,
    link: urlInput.value
  }

  // выгружаем карточку на сервер, закрываем окно, отображаем карточку, полученную как подтверждение от сервера на страницу
  uploadCard(card)
    .then(cardUploaded => {
      closeModal(addCardWindow);

      placesList.prepend(
        createCard(
          cardUploaded,
          handleDeleteCardBtn, // deleteCard
          likeCard,
          handleImageClick,
          userId
        )
      );

      addCardForm.reset();
    })
    .catch((err) => console.log(`Ошибка при сохранении карточки на сервере ${err}`))
    .finally(() => {
      // восстанавливаем текст кнопки на Сохранить
      popupCardButton.textContent = 'Сохранить';
    })
}

// обработчик открытия окна добавления карточки
addCardButton.addEventListener('click', function () {
  description.value = '';
  urlInput.value = '';

  openModal(addCardWindow);

  // очистим валидацию формы
  clearValidation(addCardWindow, validationConfig);
});

// ********************************
// раскрытие изображение карточки по клику

// окно для просмотра изображения карточки
const imagePopup = document.querySelector('.popup.popup_type_image');
// находим img объект для записи в него url и alt
const image = imagePopup.querySelector('.popup__image');
// находим p для записи в него текста описания картинки
const imageDescription = imagePopup.querySelector('.popup__caption');
// Устанавливаем обработчик закрытия окна по крестику
handleCloseModalByCross(imagePopup);

// обработчик раскрытия изображения в попап окне
function handleImageClick(cardData) {

  image.src = cardData.link;
  image.alt = cardData.name;

  imageDescription.textContent = cardData.name;

  openModal(imagePopup);
}



// ********************************
// обработка подтверждения удаления карточки через попап

// окно для просмотра изображения карточки
const deletePopup = document.querySelector('.popup.popup_type_delete-card');
// Устанавливаем обработчик закрытия окна по крестику
handleCloseModalByCross(deletePopup);


// функция удаления карточки
// вызов в renderCards/createCard, submitAddCardForm/uploadCard/createCard
function handleDeleteCardBtn(cardData, cardDeleteButton) {
  // ставим слушатель на закрытие с подтверждением
  deletePopup.addEventListener('submit', (evt) => {
    evt.preventDefault();
    // удаляем карточку на сервере, затем на странице, затем закрываем окно
    deleteCardFromServer(cardData._id)
    .then(() => {
        cardDeleteButton.closest('.card').remove();
        closeModal(deletePopup);
      })
      .catch(err => {
        // если ошибка
        console.log(`Ошибка удаления карточки: ${err}`);
      })
  });

  // открываем попап подтверждения удаления карточки
  openModal(deletePopup);
}

// обработчик зарытия модального окна по клику на закрывающий крекстик
function handleCloseModalByCross(modalWindow) {
  const popupCloseButton = modalWindow.querySelector('.popup__close');

  popupCloseButton.addEventListener('click', function() {
    closeModal(modalWindow);
  })
}