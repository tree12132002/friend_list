const indexURL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users/'

const userData = []
const user_per_page = 12
let filterList = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

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
            <a href="#" class="btn btn-secondary bg-light text-dark btn-add-favorite" data-id="${item.id}">+</a>
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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const user = userData.find((user) => user.id === id)

  if (list.some((user) => user.id === id)) {
    return alert('已經加過了喔！')
  }
  list.push(user)
  localStorage.setItem('favoriteUsers', JSON.stringify(list))
}

function getUsersByPage(page) {
  const data = filterList.length ? filterList : userData
  const startIndex = (page - 1) * user_per_page
  return data.slice(startIndex, startIndex + user_per_page)
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / user_per_page)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
    <li class="page-item">
      <a class="page-link" href="#" data-page="${page}">${page}</a>
    </li>
    `
  }
  paginator.innerHTML = rawHTML
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-modal')) {
    console.log(event.target.dataset)
    showDataModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filterList = userData.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  )

  if (filterList.length === 0) {
    return alert('查無此人！')
  }

  renderPaginator(filterList.length)
  renderUser(getUsersByPage(1))
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return

  const page = Number(event.target.dataset.page)

  renderUser(getUsersByPage(page))
})

axios.get(indexURL)
  .then(response => {
    userData.push(...response.data.results)
    renderPaginator(userData.length)
    renderUser(getUsersByPage(1))
  })