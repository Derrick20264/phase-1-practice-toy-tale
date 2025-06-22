let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
    const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");
  const TOYS_URL = "http://localhost:3000/toys";

  // Fetch and display toys
  fetch(TOYS_URL)
    .then(res => res.json())
    .then(toys => toys.forEach(renderToyCard));

  function renderToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => handleLike(toy, card));

    toyCollection.appendChild(card);
  }

  toyForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;

    fetch(TOYS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name,
        image,
        likes: 0
      })
    })
      .then(res => res.json())
      .then(newToy => {
        renderToyCard(newToy);
        toyForm.reset();
      });
  });

  function handleLike(toy, card) {
    const newLikes = toy.likes + 1;

    fetch(`${TOYS_URL}/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
      .then(res => res.json())
      .then(updatedToy => {
        toy.likes = updatedToy.likes;
        const likeText = card.querySelector("p");
        likeText.textContent = `${updatedToy.likes} Likes`;
      });
  }

});
