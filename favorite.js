const indexURL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users/'

const userData = JSON.parse(localStorage.getItem('favoriteUsers')) || []

const dataPanel = document.querySelector('#data-panel')

function renderUser(data) {
  let dataHTML = ''

  data.forEach((item) => {
    // name,avatar
    dataHTML += `
    <div class="col-sm-2 rounded-lg">
      <div class="mb-2 mt-3">
        <div class="card border-light mb-3" style="max-width: 18rem">
          <div class="card-header font-weight-bolder">${item.name}</div>
          <div class="card">
            <img src="${item.avatar}" alt="photo" class="user-photo">
          </div>
          <div class="card-footer">
            <a href="#" class="btn btn-secondary btn-show-modal bg-light text-dark" data-toggle="modal" data-target="#userModal" data-id="${item.id}">More</a>
            <a href="#" class="btn btn-secondary bg-light text-dark btn-remove-favorite" data-id="${item.id}">X</a>
          </div>
        </div>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = dataHTML
}

function showDataModal(id) {
  const modalName = document.querySelector('#user-modal-name')
  const modalGender = document.querySelector('#user-modal-gender')
  const modalAge = document.querySelector('#user-modal-age')
  const modalBirthday = document.querySelector('#user-modal-birthday')
  const modalRegion = document.querySelector('#user-modal-region')
  const modalEmail = document.querySelector('#user-modal-email')
  const modalImage = document.querySelector('#user-modal-image')

  axios.get(indexURL + id)
    .then(response => {
      const modalData = response.data
      console.log(modalData)
      modalName.innerText = `${modalData.name} ${modalData.surname}`
      modalGender.innerText = 'Gender: ' + modalData.gender
      modalAge.innerText = 'Age: ' + modalData.age
      modalBirthday.innerText = 'Birthday: ' + modalData.birthday
      modalRegion.innerText = 'Region: ' + modalData.region
      modalEmail.innerText = 'Email: ' + modalData.email
      modalImage.innerHTML = `<img src="${modalData.avatar}" alt="" class="img-fuid rounded-circle">`
    })
}

function removeFromFavorite (id) {
  if(!userData) return
  const userIndex = userData.findIndex((user) => user.id === id)
  
  if (userIndex === -1) return

  userData.splice(userIndex, 1)
  localStorage.setItem('favoriteUsers', JSON.stringify(userData))
  renderUser(userData)
}

dataPanel.addEventListener('click', function onPanelClick(event) {
  if (event.target.matches('.btn-show-modal')) {
    console.log(event.target.dataset)
    showDataModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

renderUser(userData)