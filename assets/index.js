//jQuery DOM element selectors
let zipcodeInput = $('input:text')
let searchButton = $('.search-button')
let ageInput = $('#ages')
let sizeInput = $('#size')
let genderInput = $('#gender')
let kidsInput = $('#kids')

const dataArray = [] //Takes API data and puts into array
let searchArray = []


//Api request for token using the general oauth url post request 

function getToken() {
  fetch('https://api.petfinder.com/v2/oauth2/token', {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&client_id=4qgBwPSpirb0sfhKy4fnxXnZYfXz3oxidw9zGBd5TNfHgu3LDH&client_secret=QtApSseMQP3RoSnLINI3xHaT5TRMRPA1wK7O3aRD'
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      getPetData(data)

    })
}

//Getting pet data in a json object format
function getPetData(data) {

  let zipCode = Number(zipcodeInput.val())
  let age = ageInput.val()
  let size = sizeInput.val()
  let gender = genderInput.val()
  let good_with_children = kidsInput.val()


  if (isNaN(zipCode) || zipcodeInput.val().length != 5) {
    alert("please input a proper zipcode")
    return
  }

  if (localStorage.search) {
    searchArray = []
  }

  searchArray.push(zipCode)
  searchArray.push(age)
  searchArray.push(size)
  searchArray.push(gender)
  searchArray.push(good_with_children)
  localStorage.setItem("search", JSON.stringify(searchArray));


  fetch(`https://api.petfinder.com/v2/animals?type=Dog&location=${zipCode}&age=${age}&size=${size}&gender=${gender}&good_with_children=${good_with_children}`, {
    headers: {                                          //passing access token using Bearer 
      Authorization: `Bearer ${data.access_token}`,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      dataArray.push(data.animals) //pushes API data to empty array
      localStorage.setItem("data", JSON.stringify(dataArray))
      window.location.replace("./results.html")

    })
}


function init() {
  let searchRetrieve = JSON.parse(localStorage.getItem("search")) || []
  zipcodeInput.val(searchRetrieve[0])
  ageInput.val(searchRetrieve[1])
  sizeInput.val(searchRetrieve[2])
  genderInput.val(searchRetrieve[3])
  kidsInput.val(searchRetrieve[4])
}

init()


//event listner on search button
searchButton.on('click', getToken)
