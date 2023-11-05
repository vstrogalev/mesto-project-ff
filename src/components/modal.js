// модуль работы с модальными окнами

export function openModal(modalWindow) {
  modalWindow.classList.add('popup_is-opened');

  // слушатель зарытия модального окна по клику на оверлей
  modalWindow.addEventListener('click', handleCloseModalOnOverlay.bind(null, modalWindow))

  // слушатель клавиатуры для зарытия модального окна при нажатии на Esc
  document.addEventListener('keydown', handleCloseModalByEsc.bind(null, modalWindow))
}

// обработчик зарытия модального окна по клику на оверлей
function handleCloseModalOnOverlay(modalWindow, evt) {
  if (evt.target === modalWindow) closeModal(modalWindow);
}

// обработчик зарытия модального окна при нажатии на Esc
function handleCloseModalByEsc(modalWindow, evt) {
  if (evt.key === "Escape") closeModal(modalWindow);
}

export function closeModal(modalWindow) {
  modalWindow.classList.remove('popup_is-opened');

  modalWindow.removeEventListener('click', handleCloseModalOnOverlay);
  document.removeEventListener('keydown', handleCloseModalByEsc);
}

