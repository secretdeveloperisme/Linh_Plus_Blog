import {formatDate} from "./utils/format_date.js";
$(()=>{
  // handle change list mode 
  const $btnChangeListMode = $("#btnChangeListMode");
  const $postLists = $($(".post-list")[0]);
  const $btnMore = $("#btnMore");
  $btnChangeListMode.on("click",function(event){
    let $postItems = $(".post-item");
    let $postItemParents = $postItems.parent();
    if(!$postLists.hasClass("grid-mode")){
      $postLists.addClass("grid-mode");
      $postItemParents.addClass("col-xl-4")
      $postItemParents.removeClass("col-xl-12")
      $btnChangeListMode.find("span").text("List")
      $btnChangeListMode.find("i").attr("class","fas fa-bars")
    }
    else{
      $postLists.removeClass("grid-mode");
      $postItemParents.addClass("col-xl-12");
      $postItemParents.removeClass("col-xl-4");
      $btnChangeListMode.find("span").text("Grid");
      $btnChangeListMode.find("i").attr("class","fas fa-th-large");
    }
  })
  let currentPage = 1;
  $btnMore.on("click", (event)=>{
    const amountOfPostsPerPage = 3;
    $btnMore.text("Loading ....");
    let typeOfLoad = $btnMore.data("type");
    let url = typeOfLoad ==`guest`?`/post/get_all_posts?page=${++currentPage}`:`/post/get_followed_posts?page=${++currentPage}`;
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
            let tags = posts[i].Tags.map(tag=>{
              return `<a href="/tag/${tag.name}" class="tag-link"># ${tag.name}</a>`
            })
            let wrapperMode = "";
            if($postLists.hasClass("grid-mode"))
              wrapperMode = "col-xl-4";
            else
              wrapperMode = "col-xl-12";
            let $postItem = $(`
              <div class="${wrapperMode}">
                <div class="post-item container-fluid d-flex shadow rounded py-2">
                  <div class="post-item-thumbnail me-3">
                    <a href="/post/${posts[i].slug}" class="text-decoration-none rounded" style="background-image: url('${posts[i].image }');">
                    </a>
                  </div>
                  <div class="post-content">
                    <div class="post-tag">
                      ${tags.join("\n")}
                    </div>
                    <h6 class="post-title">
                      <a href="/post/${posts[i].slug}" class="text-decoration-none text-dark">${posts[i].title } </a>
                    </h6>
                    <div class="post-info ">
                      <div class="post-author">
                        <a href="/user/${posts[i].User.username}" class="text-decoration-none text-secondary">${posts[i].User.username} </a>
                      </div>
                      <div class="post-published">
                      ${formatDate(posts[i].createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `)
            $postLists.append($postItem)
          }
        }
        $btnMore.text("More")
      }
    });
  })

})