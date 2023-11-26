// объект конфигурации валидации форм
// {
//   formSelector: '.popup__form',
//   inputSelector: '.popup__input',
//   submitButtonSelector: '.popup__button',
//   inactiveButtonClass: 'popup__button_disabled',
//   inputErrorClass: 'popup__input_type_error',
//   errorClass: 'popup__error_visible'
// }

export function enableValidation(validationConfig) {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));

  formList.forEach((formElement) => {

    const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
    const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

    toggleButtonState(inputList, buttonElement, validationConfig.inactiveButtonClass);

    inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', function () {
        checkInputValidity(formElement, inputElement, validationConfig);
        toggleButtonState(inputList, buttonElement, validationConfig.inactiveButtonClass);
      });
    });
  });
}

export function clearValidation(formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  inputList.forEach(inputElement => {
    hideInputError(formElement, inputElement, validationConfig);
  })

  // делаем кнопку не активной
  toggleButtonState(inputList, buttonElement, validationConfig.inactiveButtonClass);
}

function checkInputValidity(formElement, inputElement, validationConfig) {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
  } else {
    hideInputError(formElement, inputElement, validationConfig);
  }
};

export function showInputError(formElement, inputElement, errorMessage, validationConfig) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);

  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationConfig.errorClass);
};

function hideInputError(formElement, inputElement, validationConfig) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);

  errorElement.classList.remove(validationConfig.errorClass);
  errorElement.textContent = '';
};

function toggleButtonState(inputList, buttonElement, inactiveButtonClass) {
  if (inputList.some(input => !input.validity.valid)) {
    buttonElement.classList.add(inactiveButtonClass);
    buttonElement.setAttribute('disabled', 'disabled');
  } else {
    buttonElement.classList.remove(inactiveButtonClass);
    buttonElement.removeAttribute('disabled');
  }
}