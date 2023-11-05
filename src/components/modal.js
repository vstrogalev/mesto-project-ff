// модуль работы с модальными окнами

export function openModal(modalWindow) {
  const popupCloseButton = modalWindow.querySelector('.popup__close');

  modalWindow.classList.add('popup_is-animated');

  setTimeout(() => {
    modalWindow.classList.add('popup_is-opened');
  }, 0);

  // обработчик зарытия модального окна по клику на закрывающий крекстик
  popupCloseButton.addEventListener('click', function() {
    closeModal(modalWindow);
  })

  // обработчик зарытия модального окна по клику на оверлей
  modalWindow.addEventListener('click', function(evt) {
    if (evt.target === modalWindow) closeModal(modalWindow);
  })

  // обработчик зарытия модального окна при нажатии на Esc
  document.addEventListener('keydown', function (evt) {
    if (evt.key === "Escape") closeModal(modalWindow);
  })

}

export function closeModal(modalWindow) {
  modalWindow.classList.remove('popup_is-opened');

  setTimeout(() => {
    modalWindow.classList.remove('popup_is-animated');
  }, 600);

}

