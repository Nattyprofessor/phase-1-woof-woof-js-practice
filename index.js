const dogBar = document.getElementById('dog-bar');
const dogInfo = document.getElementById('dog-info');
const goodDogFilterButton = document.getElementById('good-dog-filter');

let isGoodDogsFiltered = false; // Flag to track good dog filter state
let pups = []; // Array to store fetched pup data

// Fetch all pups on page load
fetch('http://localhost:3000/pups')
  .then(response => response.json())
  .then(data => {
    pups = data;
    displayDogBar(pups);
  })
  .catch(error => console.error('Error fetching pups:', error));

function displayDogBar(pups) {
  dogBar.innerHTML = ''; // Clear previous dog list
  pups.forEach(pup => {
    const dogSpan = document.createElement('span');
    dogSpan.textContent = pup.name;
    dogSpan.addEventListener('click', () => displayDogInfo(pup.id));
    dogBar.appendChild(dogSpan);
  });
}

function displayDogInfo(pupId) {
  const selectedPup = pups.find(pup => pup.id === pupId);
  if (selectedPup) {
    dogInfo.innerHTML = `
      <img src="${selectedPup.imageUrl}" alt="${selectedPup.name}" />
      <h2>${selectedPup.name}</h2>
      <button id="toggle-good-dog-btn">${selectedPup.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
    `;

    const toggleGoodDogButton = document.getElementById('toggle-good-dog-btn');
    toggleGoodDogButton.addEventListener('click', () => toggleGoodDog(pupId));
  } else {
    console.error('Pup with ID', pupId, 'not found');
  }
}

function toggleGoodDog(pupId) {
  const selectedPupIndex = pups.findIndex(pup => pup.id === pupId);
  if (selectedPupIndex !== -1) {
    pups[selectedPupIndex].isGoodDog = !pups[selectedPupIndex].isGoodDog;

    fetch(`http://localhost:3000/pups/${pupId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isGoodDog: pups[selectedPupIndex].isGoodDog })
    })
      .then(response => response.json())
      .then(updatedPup => {
        console.log('Pup updated:', updatedPup);
        const toggleButton = document.getElementById('toggle-good-dog-btn');
        toggleButton.textContent = updatedPup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
      })
      .catch(error => console.error('Error updating pup:', error));
  } else {
    console.error('Pup with ID', pupId, 'not found');
  }
}

goodDogFilterButton.addEventListener('click', () => {
  isGoodDogsFiltered = !isGoodDogsFiltered;
  goodDogFilterButton.textContent = isGoodDogsFiltered ? 'Filter good dogs: ON' : 'Filter good dogs: OFF';
  displayDogBar(isGoodDogsFiltered ? pups.filter(pup => pup.isGoodDog) : pups);
});
