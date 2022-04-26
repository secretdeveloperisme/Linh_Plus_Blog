import getQueryFromMUrl from "../utils/get_query_from_url.js";
import {formatDate} from '../utils/format_date.js';
$(()=>{
  const $querySearch = $("#querySearch");
  const $btnMore = $("#btnMore");
  const $postsList = $("#postsList");
  const $btnTabUser = $("#btnTabUser");
  const $userTabContent = $("#userTabContent");
  const $usersList = $(".users");
  const $btnTabTag = $("#btnTabTag");
  const $tagsList = $(".tags")
  // display query search 
  let querySearchValue = getQueryFromMUrl("query", window.location.search)
  $querySearch.html(querySearchValue)  
  // load more search posts
  let currentPage = 1;
  $btnMore.on("click", (event)=>{
    const amountOfPostsPerPage = 3;
    $btnMore.text("Loading ....");
    let typeOfLoad = $btnMore.data("type");
    let url = 
      `/search/get_posts?query=${querySearchValue}&page=${++currentPage}`;
    $.ajax({
      type: "GET",
      url,
      dataType: "json",
      success: function (response) {
        if(response.status === "success"){
          console.log(response)
          let posts = response.posts
          let lengthOfPost = posts.length - 1;
          if(posts.length <= amountOfPostsPerPage){
            lengthOfPost = posts.length;
            $btnMore.remove();
          }
          
          for(let i = 0; i < lengthOfPost; i++){
            let tags = posts[i].tags.map(tag=>{
              return `<a href="/tag/${tag.name}" class="tag-link"># ${tag.name}</a>`
            })
            let $postItem = $(`
              <div class="post-item shadow bg-white rounded p-2 mb-2">
              <a href="/post/${posts[i].slug}" class="text-decoration-none text-black">
                <div class="post-header d-flex">
                  <div class="icon-32 me-2" style="background-image: url('${posts[i].user_avatar}')"></div>
                  <div class="d-flex flex-column">
                    <h6>${ posts[i].user_username }</h6>
                    <span>${formatDate(posts[i].createdAt)}</span>
                  </div>
                </div>
                <div class="post-detail">
                  <h2 class="">${ posts[i].title }</h2>
                  <div class="post-tags">
                    ${tags.join("")}
                  </div>
                  <div class="d-flex">
                    <a href="/post/${ posts[i].slug }#btnLike" class="btn btn-link text-decoration-none text-black">
                      <i class="far fa-heart"></i>
                      <span>${ posts[i].amount_likes }</span>
                      reactions
                    </a>
                    <a href="/post/${ posts[i].slug }#commentEditor" class="btn btn-link text-decoration-none text-black">
                      <i class="far fa-comment"></i>
                      <span>${ posts[i].amount_comments }</span>
                      comment
                    </a>
                  </div>
                </div>
              </a>
            </div>
            `)
            $postsList.append($postItem)
          }
        }
        $btnMore.text("More")
      }
    });
  })
  // add event for tab user
  $btnTabUser.on("click", function (event){
    $.ajax({
      type: "GET",
      url: "/search/get_users",
      data: {
        username: querySearchValue
      },
      dataType: "json",
      success: function (response) {
        if(response.status ==="success"){
          $usersList.html("");
          console.log(response)
          let tagUsers = response.users.map(user=>{
            return (`
              <div class="col-xl-4">
                <a href="/user/${user.username}" class=" d-flex flex-column align-items-center bg-white py-2 shadow rounded">
                  <div class="icon-64" style="background-image: url('${user.avatar}');"></div>
                  <h3>${user.username}</h3>
                </a>
              </div>
            `)
          });
          $usersList.html(tagUsers.join(""));
        }
      }
    });
  })
  // add event for tab tag
  $btnTabTag.on("click", function (event){
    $.ajax({
      type: "GET",
      url: "/search/get_tags",
      data: {
        name: querySearchValue
      },
      dataType: "json",
      success: function (response) {
        if(response.status ==="success"){
          $tagsList.html("");
          console.log(response)
          let tags = response.tags.map(tag=>{
            return (`
              <div class="col-xl-4">
                <a href="/tag/${tag.name}" class=" d-flex flex-column align-items-center bg-white py-2 shadow rounded">
                  <h3>#${tag.name}</h3>
                </a>
              </div>
            `)
          });
          $tagsList.html(tags.join(""));
        }
      }
    });
  })
})