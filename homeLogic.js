let lastPage = 1
let currentPage = 1
setupUI()
// Pagination function 
function handleInfiniteScroll(){
    const endOfPage = window.innerHeight + window.pageYOffset  >= document.body.scrollHeight;
    if (endOfPage && currentPage < lastPage) {
        currentPage = currentPage + 1 
        getPosts(currentPage, false);
    }
};
window.addEventListener("scroll", handleInfiniteScroll);
getPosts()

// get posts
function getPosts(page = 1, reload = true){
    toggleLoader()

    axios.get(`${baseUrl}/posts?limit=5&page=${page}`)
    .then((response) => {
        toggleLoader(false)
        if(reload){
            document.getElementById('posts').innerHTML = ''
        }
        lastPage = response.data.meta.last_page
        const posts = response.data.data
        for(let post of posts){
            const author = post.author
            let postTitle = ''

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
            if(post.title != null){
                postTitle = post.title
            }
            let content = `
                <div  class="card shadow my-4" >
                    <div class="card-header">
                        <span onclick='userClicked(${author.id})' style = "cursor: pointer;">
                            <img class="image rounded-circle" src="${author.profile_image}" alt="">
                            <b>${author.username}</b>
                        </span>
                        ${editBtnContent}
                    </div>
                    <div onClick="postClicked(${post.id})" id="card-body" style="cursor: pointer;" class="card-body">
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
            document.getElementById('posts').innerHTML += content
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

// Send The ID To Another Page Function
function postClicked(postId){
    window.location = `postDetails.html?postId=${postId}`

}
// document.getElementById("card-body").addEventListener("click",postClicked)
function userClicked(userId){
    window.location = `profile.html?userId=${userId}`
}


