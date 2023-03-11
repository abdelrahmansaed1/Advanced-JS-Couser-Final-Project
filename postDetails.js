setupUI()

const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('postId')


getPost()

// get post
function getPost(){
    toggleLoader()
    axios.get(`${baseUrl}/posts/${id}`)
    .then((response) => {
    toggleLoader(false)
        const post = response.data.data
        const author = post.author
        const comments = post.comments 

        document.getElementById("username-span").innerHTML = author.username
        let postTitle = ''
        if(post.title != null){
            postTitle = post.title
        }
        let commentContent = ``
        for(comment of comments){
            commentContent += `
            <div class="p-3" style="background-color: rgb(236, 236, 236);">
                <!-- PIC & USERNAME -->
                <div>
                    <img src="${comment.author.profile_image}" class="image rounded-circle" alt="">
                    <b>
                        ${comment.author.username}
                    </b>
                </div>
                <!--// PIC & USERNAME //-->
                <!-- COMMENT'S BODY -->
                <div>
                    ${comment.body}
                </div>
                <!--// COMMENT'S BODY //-->
            </div>
            `
        }
        let content = `
            <div  class="card shadow my-4" style = "cursor: pointer;">
                <div class="card-header">
                    <img class="image rounded-circle" src="${author.profile_image}" alt="">
                    <b>${author.username}</b>
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
                <div id="comments">
                    ${commentContent}
                </div>
                <div class="input-group mb-3" id="add-comment-div">
                    <input class="form-control" id='comment-input' type='text' placeholder='add your comment here...'>
                    <button class="btn btn-outline-primary" type="send" onclick="createCommentClicked()">send</button>
                </div>
            </div>
        `
        document.getElementById('post').innerHTML = content
    
    })
}

function createCommentClicked() {
    let commentBody =document.getElementById("comment-input").value
    let params = {
        "body": commentBody
    }
    let url = `${baseUrl}/posts/${id}/comments`
    let token = localStorage.getItem('token')
    toggleLoader()
    axios.post(url, params, {
        headers: {
            "authorization" : `Bearer ${token}`
        }
    })
    .then((response) => {
        showAlert("The Comment is Added Successfully")
        getPost()
    })
    .catch((error)=>{
        const errorMessage = error.response.data.message
        showAlert(errorMessage,"danger")
        console.log(error);
    })
    .finally(() => {
        toggleLoader(false)
    })

}
