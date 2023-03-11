const baseUrl = 'https://tarmeezacademy.com/api/v1'

// Setup UI function
function setupUI(){
    const token = localStorage.getItem("token")

    const loginDiv = document.getElementById("login-div")
    const logoutDiv = document.getElementById("logout-div")
    const createPostBtn = document.getElementById("create-post-btn")

    if(token == null){
        logoutDiv.style.setProperty("display","none","important")
        if(createPostBtn != null){
            createPostBtn.style.setProperty("display","none","important")
        }
        loginDiv.style.setProperty("display","flex","important")
    }else{
        logoutDiv.style.setProperty("display","flex","important")
        if(createPostBtn != null){
            createPostBtn.style.setProperty("display","flex","important")
        }
        loginDiv.style.setProperty("display","none","important")

        const user = getCurrentUser()
        document.getElementById('nav-username').innerHTML = user.username
        document.getElementById('nav-profile-image').src = user.profile_image

    }
}

// login function
function login(e){
    const username = document.getElementById("username-input").value
    const password = document.getElementById("password-input").value

    const params = {
        "username" : username,
        "password" : password
    }
    const url = `${baseUrl}/login`
    toggleLoader()
    axios.post(url,params)
    .then((response)=>{
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        const modal = document.getElementById('login-modal')
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        setupUI()
        showAlert("Logged in successfully")


    }).catch((error) => {
        const message = error.response.data.message
        showAlert(message , "danger")
    }).finally(() => {
        toggleLoader(false)
    })
    // async function postLogin(){
    //     const response = await axios.post(url,params)
    //     localStorage.setItem('token', response.data.token)
    //     localStorage.setItem('user', JSON.stringify(response.data.user))
        
    // }
    // postLogin()
}
document.getElementById("login-button").addEventListener("click",login)

// logout function
function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem('user')
    setupUI()
    showAlert("Logged out successfully")
}
document.getElementById("logout-btn").addEventListener("click",logout)

// register function
function register(){
    const name = document.getElementById("register-name-input").value
    const username = document.getElementById("register-username-input").value
    const password = document.getElementById("register-password-input").value
    const image = document.getElementById("register-image-input").files[0]
    
    const formData = new FormData()
    formData.append("name", name)
    formData.append("username", username)
    formData.append("password", password)
    formData.append("image", image)

    const url = `${baseUrl}/register`
    toggleLoader()
    axios.post(url,formData)
    .then((response)=>{
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        const modal = document.getElementById('register-modal')
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()

        setupUI()
        showAlert("A new Register in successfully")

    }).catch((error) => {
        const message = error.response.data.message
        showAlert(message , "danger")
    }).finally(() => {
        toggleLoader(false)
    })
}
document.getElementById("register-button").addEventListener("click",register)

// Show Alert function
function showAlert(customMessage, type = "success"){
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

    const alert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }
    alert(customMessage, type)

    // todo : hide alert
    // setTimeout(()=>{
    //     const alertToHide = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
    //     alertToHide.close()
    // }, 2000)
}
// Get Current User Function 
function getCurrentUser(){
    let user = null
    let storageUser = localStorage.getItem('user')
    if(storageUser != null){
        user = JSON.parse(storageUser)
    }
    return user
}
// Create New Post function
function createNewPost(){
    let postId = document.getElementById("post-delete-id").value
    let isCreated = postId == null || postId == ''

    const title = document.getElementById("post-title-input").value
    const body = document.getElementById("post-body-input").value
    const image = document.getElementById("post-image-input").files[0]
    const token = localStorage.getItem("token")
    const header = {
        'Content-Type' : 'multipart/form-data',
        "authorization" : `Bearer ${token}`
    }
    const formData = new FormData()
    formData.append("title", title)
    formData.append("body", body)
    formData.append("image", image)

    
    toggleLoader()
    let url = ``
    if(isCreated){
        url = `${baseUrl}/posts`
    }
    else{
        formData.append("_method",'put')
        url = `${baseUrl}/posts/${postId}`
    }
    axios.post(url,formData, {
        headers : {
            'Content-Type' : 'multipart/form-data',
            "authorization" : `Bearer ${token}`
        }
    })
    .then((response)=>{
        const modal = document.getElementById('create-post-modal')
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        if(isCreated){
            showAlert("A New Post are Added Successfully")
        }
        else{
            showAlert("The Post Is Updated Successfully")
        }
        getPosts()
    })
    .catch((error) => {
        const message = error.response.data.message
        showAlert(message , "danger")
    }).finally(() => {
        toggleLoader(false)
    })
}
document.getElementById("create-post-button").addEventListener("click",createNewPost)

function editPostBtnClicked(postObject){
    let post = JSON.parse(decodeURIComponent(postObject))

    document.getElementById('create-post-button').innerHTML = 'Update'
    document.getElementById('create-post-title').innerHTML = 'Edit Post'
    document.getElementById('post-title-input').value = post.title
    document.getElementById('post-body-input').value = post.body
    document.getElementById('post-delete-id').value = post.id


    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"),{})
    postModal.toggle()
}

function addBtnClicked(){

    document.getElementById('create-post-button').innerHTML = 'Create'
    document.getElementById('create-post-title').innerHTML = 'Create A New Post'
    document.getElementById('post-title-input').value = ''
    document.getElementById('post-body-input').value = ''
    document.getElementById('post-delete-id').value = ''


    // let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"),{})
    // postModal.toggle()   
}
// document.getElementById("create-post-btn").addEventListener("click",addBtnClicked)

function deletePostBtnClicked(postObject){
    let post = JSON.parse(decodeURIComponent(postObject))

    document.getElementById("post-delete-id").value = post.id

    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"),{})
    postModal.toggle()
}

function deletePost(){
    let postId = document.getElementById("post-delete-id").value
    const token = localStorage.getItem("token")
    toggleLoader()
    url = `${baseUrl}/posts/${postId}`
    axios.delete(url, {
        headers : {
            "authorization" : `Bearer ${token}`
        }
    })
    .then((response)=>{

        const modal = document.getElementById('delete-post-modal')
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        setupUI()
        showAlert("The post has been deleted successfully")
        getPosts()

    })
    .catch((error) => {
        const message = error.response.data.message
        showAlert(message , "danger")
    }).finally(() => {
        toggleLoader(false)
    })

}
document.getElementById("delete-post-button").addEventListener("click",deletePost)

function profileClicked(){
    const user = getCurrentUser()
    const userId = user.id
    window.location = `profile.html?userId=${userId}`
}
function toggleLoader(show = true){
    if(show){
        document.getElementById("loader").style.visibility = "visible"
    }
    else{
        document.getElementById("loader").style.visibility = "hidden"
    }
}