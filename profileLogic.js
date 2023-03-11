
setupUI()
getUser()
getPosts()

function getUser(){
    const id = getUserId()
    toggleLoader()
    axios.get(`${baseUrl}/users/${id}`)
    .then((response) => {
        let user = response.data.data
        console.log(user);
        document.getElementById("profile-image").src = user.profile_image
        document.getElementById("profile-name").innerHTML = user.name
        document.getElementById("profile-username").innerHTML = user.username
        document.getElementById("profile-posts-count").innerHTML = user.posts_count
        document.getElementById("profile-comments-count").innerHTML = user.comments_count
        document.getElementById("main-username").innerHTML = user.username
    }).catch((error) => {
        const message = error.response.data.message
        showAlert(message , "danger")
    }).finally(() => {
        toggleLoader(false)
    })
}

function getPosts(){
    const id = getUserId()
    axios.get(`${baseUrl}/users/${id}/posts`)
    .then((response) => {
        document.getElementById('user-posts').innerHTML = ''

        const posts = response.data.data
        for(let post of posts){
            const author = post.author
            let postTitle = ''
            if(post.title != null){
                postTitle = post.title
            }
            // show or hide edit post
            let user = getCurrentUser()
            let isMyPost = user != null && user.id == author.id
            let editBtnContent = ``

            if(isMyPost){
                editBtnContent = `
                <button class="btn btn-secondary float-end" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')"><i class="fa-regular fa-pen-to-square"></i>
                </button>
                <button class="btn btn-danger me-2 float-end" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')"><i class="fa-solid fa-trash-can"></i>
                </button>
                    `
            }
            
            let content = `
                <div  class="card shadow my-4" style = "cursor: pointer;">
                    <div class="card-header">
                        <img class="image rounded-circle" src="${author.profile_image}" alt="">
                        <b>${author.username}</b>
                        ${editBtnContent}
                    </div>
                    <div onClick="postClicked(${post.id})" id="card-body" class="card-body">
                        <img class="w-100" src="${post.image}" alt="">
                        <h6 class="text-secondary-emphasis mt-1">${post.created_at}</h6>
                        <h4>${post.title}</h4>
                        <p>${post.body}</p>
                        <hr>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                                </svg>
                            <span>(${post.comments_count}) Comments
                                <span id = 'post-tag-${post.id}'>
                                
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            `
            document.getElementById('user-posts').innerHTML += content
            let currentPostTagsID = `post-tag-${post.id}`
            document.getElementById(currentPostTagsID).innerHTML = ''
            for(tag of post.tags)
            {
                let tagsContent = 
                `
                    <button class = "btn btn-sm rounded-5 " style = "background-color: gray; color: white;">
                        ${tag.name}
                    </button>
                `
                document.getElementById(currentPostTagsID).innerHTML += tagsContent
                
            }
        }
    })
}

function getUserId(){
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('userId')
    return id
}