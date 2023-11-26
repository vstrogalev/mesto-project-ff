// модуль работы с модальными окнами

export function openModal(modalWindow) {
  modalWindow.classList.add('popup_is-animated');

  setTimeout(() => {
    modalWindow.classList.add('popup_is-opened');
  }, 0);


  // слушатель зарытия модального окна по клику на оверлей
  modalWindow.addEventListener('click', handleCloseModalOnOverlay)

  // слушатель клавиатуры для зарытия модального окна при нажатии на Esc
  document.addEventListener('keydown', handleCloseModalByEsc)
}

// обработчик зарытия модального окна по клику на оверлей
function handleCloseModalOnOverlay(evt) {
  if (evt.target === evt.currentTarget) closeModal(evt.currentTarget);
}

// обработчик зарытия модального окна при нажатии на Esc
function handleCloseModalByEsc(evt) {
  if (evt.key === "Escape") {
    const modalWindow = document.querySelector('.popup_is-opened');
    closeModal(modalWindow)
  };
}

export function closeModal(modalWindow) {
  modalWindow.classList.remove('popup_is-opened');

  setTimeout(() => {
    modalWindow.classList.remove('popup_is-animated');
  }, 600);

  modalWindow.removeEventListener('click', handleCloseModalOnOverlay);
  document.removeEventListener('keydown', handleCloseModalByEsc);
}

