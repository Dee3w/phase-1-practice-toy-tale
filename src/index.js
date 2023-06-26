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
});

document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');

  // Fetch Andy's toys and render them in the DOM
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        const card = createToyCard(toy);
        const likeButton = card.querySelector('.like-btn');
        likeButton.addEventListener('click', handleLikeButtonClick);
        toyCollection.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });

  // Add event listener to the toy form
  const toyForm = document.getElementById('toy-form');
  toyForm.addEventListener('submit', event => {
    event.preventDefault();

    const nameInput = document.getElementById('name-input');
    const imageInput = document.getElementById('image-input');

    const newToy = {
      name: nameInput.value,
      image: imageInput.value,
      likes: 0
    };

    // Send a POST request to add a new toy
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(createdToy => {
        const card = createToyCard(createdToy);
        toyCollection.appendChild(card);

        // Clear the form inputs
        nameInput.value = '';
        imageInput.value = '';
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });

  // Add event listener to like buttons
  function handleLikeButtonClick(event) {
      const likeButton = event.target;
      const toyId = likeButton.dataset.toyId;
      const likesElement = likeButton.previousElementSibling;

      // Calculate the new number of likes
      const currentLikes = parseInt(likesElement.textContent);
      const newLikes = currentLikes + 1;

      // Send a PATCH request to update the number of likes
      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ likes: newLikes })
      })
        .then(response => response.json())
        .then(updatedToy => {
          likesElement.textContent = `${updatedToy.likes} Likes`;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  });

  // Function to create a toy card element
  function createToyCard(toy) {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" data-toy-id="${toy.id}">Like ❤️</button>
    `;

    return card;
  }


