document.addEventListener('DOMContentLoaded', () => {
  const dogBar = document.querySelector('#dog-bar')
  const dogInfo = document.querySelector('#dog-info')
  const dogForm = document.querySelector('#dog-form')
  const dogNameInput = document.querySelector('#dog-name-input')
  const dogImgInput = document.querySelector('#dog-img-input')
  const goodDogInput = document.querySelector('#good-dog-input')

// INITIAL FETCH
  fetch('http://localhost:3000/pups', { method: 'GET' })
    .then(/*function*/(resp) => resp.json())
    .then(/*function*/(dogDataJSON) => {
      dogDataJSON.forEach(/*function*/(dog) => {
        const newPup = new Dog(dog)
        dogBar.innerHTML += newPup.renderSpan()
      })
    })

// RENDER DETAILS OF CLICKED DOG
    dogBar.addEventListener('click', (e) => {
      const clickedDogId = parseInt(e.target.dataset.id)
      const foundDog = Dog.findDog(clickedDogId)
      dogInfo.innerHTML = foundDog.renderDetails()
    })

// CLICK EDIT DOG + PRE-FILL FORM
    dogInfo.addEventListener('click', (e) => {
      if (e.target.className === 'edit' || e.target.dataset.action === 'edit') {
        console.log(e.target)
        const clickedDogId = parseInt(e.target.dataset.id)
        const foundDog = Dog.findDog(clickedDogId) // Find the dog object based on the id found in the clicked edit button.
        // Pre-fill the form data.
        dogNameInput.value = foundDog.name
        dogImgInput.value = foundDog.image
        goodDogInput.checked = foundDog.isGoodDog
        dogForm.dataset.id = foundDog.id // Store the dog id in the form so we can PATCH with that id later.
      }
    })

// PATCH REQUEST TO UPDATE DOG
    dogForm.addEventListener('submit', (e) => {
      e.preventDefault()
      const updateDogId = e.target.dataset.id // We don't need to parseInt because we are interpolating the id into a URL string.
      fetch(`http://localhost:3000/pups/${updateDogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json' // MIME type we're sending to the server.
        },
        body: JSON.stringify({
          // The form inputs were stored in variables at the top of DOMContentLoaded event handler. (This is a callback function.)
          name: dogNameInput.value,
          image: dogImgInput.value,
          isGoodDog: goodDogInput.checked
        })
      })
      .then((r) => r.json())
      .then((updatedDogJSON) => {
        const updatedPup = Dog.updateDog(updatedDogJSON) // Delegate updating dogs to the Dog class.
        dogInfo.innerHTML = updatedPup.renderDetails() // Render the changes so the DOM is in sync with our data.
      })
    })
})
