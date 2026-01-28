import "./index.css";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/Helper.js";
import {
  enableValidation,
  settings,
  resetValidation,
  disabledButton,
} from "../scripts/validation.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "6fd43f20-07ec-4b21-9c27-20d4478151bc",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    //setting profile up
    profileAvatarEl.src = user.avatar;
    profileNameEl.textContent = user.name;
    profileDescriptionEl.textContent = user.about;
  })
  .catch(console.error);

// Edit Modal Declarations
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const editProfileSaveBtn = editProfileModal.querySelector(".modal__submit-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");

// New Post Modal Declarations
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostSubmitBtn = document.querySelector(".modal__submit-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");
const cardSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const newPostLinkInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#image-caption-input");

// Selectors of Profile information
const profileEl = document.querySelector(".profile");
const profileNameEl = profileEl.querySelector(".profile__name");
const profileAvatarEl = profileEl.querySelector(".profile__avatar");
const profileDescriptionEl = profileEl.querySelector(".profile__description");

// Preview Modal Selectors
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
// Template Selectors
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

// All Modals Selectors
const allModals = document.querySelectorAll(".modal");

const modal = document.querySelector(".modal");
const modal__button = modal.querySelector(".modal__btn");

// Avatar Modal Selectors
const avatarModal = document.querySelector("#avatar-modal");
const avatarModalForm = avatarModal.querySelector(".modal__form");

const avatarModalSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

// Delete Modal Selectors
const deleteModal = document.querySelector("#delete-modal");
const deleteModalForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteModalCancelBtn = deleteModal.querySelector(".modal__btn");

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});
deleteModalCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

//Selected Delete Cards
let selectedCard, selectedCardId;

function handleDeleteCard(cardElement, cardId) {
  // evt.target.closest(".card").remove();
  selectedCard = cardElement;
  selectedCardId = cardId;

  openModal(deleteModal);
}

function handleCardLike(evt, id) {
  // evt.target.classList.toggle("card__like-btn_active");

  //1. check whether card is currenlty liked or not
  // const isLiked = ??
  const isLiked = evt.target.classList.contains("card__like-btn_active")
    ? true
    : false;
  //2. call the handleCardLike method, passing it the appropriate arguments

  api
    .handleLike(id, isLiked)
    .then((data) => {
      console.log(data);
      evt.target.classList.toggle("card__like-btn_active");
    })
    //3. handle the response (.then and .catch)
    //.4 in he .then toggle active class
    .catch(console.error);
}

// Get card template function
function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeEl = cardElement.querySelector(".card__like-btn");
  const cardDeleteEl = cardElement.querySelector(".card__delete-btn");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;
  if (data.isLiked) {
    cardLikeEl.classList.add("card__like-btn_active");
  } else {
    cardLikeEl.classList.remove("card__like-btn_active");
  }

  cardLikeEl.addEventListener("click", (evt) => handleCardLike(evt, data._id));

  cardDeleteEl.addEventListener("click", (evt) =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaption.textContent = data.name;

    openModal(previewModal);
  });

  return cardElement;
}

// Creating opening and closing modal functions
let activeModal = null;

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  activeModal = modal;

  window.addEventListener("keydown", escapeKeyEnabled);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  activeModal = null;

  window.removeEventListener("keydown", escapeKeyEnabled);
}

// Event Listeners for edit profile modal
editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
  openModal(editProfileModal);
});
editCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

editProfileSaveBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

//Handler for Edit form submission
function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  //Change text content to loading
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      console.log(data);
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      disabledButton(cardSubmitBtn, settings);
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

// Event Listeners for new post modal
newPostBtn.addEventListener("click", function () {
  // resetValidation(
  //   newPostForm,
  //   [newPostLinkInput, newPostCaptionInput],
  //   settings
  // );
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

// Event Listeners for preview modal
previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

//Handler for New Post form submission
function handleNewPostSubmit(evt) {
  evt.preventDefault();

  //Change text content to loading
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .postNewCard({
      name: newPostCaptionInput.value,
      link: newPostLinkInput.value,
    })
    .then((data) => {
      console.log(data);
      const cardElement = getCardElement(data);
      const inputValues = {
        name: data.name,
        link: data.link,
      };
      // const cardElement = getCardElement(inputValues);
      cardsList.prepend(cardElement);
      newPostForm.reset();
      disabledButton(cardSubmitBtn, settings);
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

newPostForm.addEventListener("submit", handleNewPostSubmit);

avatarModalForm.addEventListener("submit", handleAvatarSubmit);

deleteModalForm.addEventListener("submit", handleDeleteSubmit);

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  //Change text content to loading
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  // closeModal(avatarModal)

  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      profileAvatarEl.src = data.avatar;

      avatarModalForm.reset();
      disabledButton(avatarModalBtn, settings);
      closeModal(avatarModal, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  //Change text content to loading
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
}

// Refining UX for Modals to close when clicked outside Modals using loop and eventListener
allModals.forEach((modal) => {
  modal.addEventListener("click", function (evt) {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

// Function that will enable the Escape Key functionality when modals are open
function escapeKeyEnabled(evt) {
  if (evt.key === "Escape" && activeModal) {
    closeModal(activeModal);
  }
}
