// Edit Modal Declarations
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editCloseBtn = editProfileModal.querySelector(".modal__close-btn");
// New Post Modal Declarations
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

// Event Listeners for edit profile modal
editProfileBtn.addEventListener("click", function () {
  editProfileModal.classList.add("modal_is-opened");
});

editCloseBtn.addEventListener("click", function () {
  editProfileModal.classList.remove("modal_is-opened");
});

// Event Listeners for new post modal
newPostBtn.addEventListener("click", function () {
  newPostModal.classList.add("modal_is-opened");
});

newPostCloseBtn.addEventListener("click", function () {
  newPostModal.classList.remove("modal_is-opened");
});
