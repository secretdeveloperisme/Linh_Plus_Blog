$(()=>{
  const $commentReplyBtns = $(".comment-reply-btn");
  const $btnLike = $("#btnLike");
  const $btnDisLike = $("#btnDislike");
  const $btnBookmark = $("#btnBookmark");
  const $btnCopy = $("#btnCopy");
  const $amountOfLikes = $("#amountOfLike");
  const $amountOfDisLikes = $("#amountOfDislike")
  const $amountOfBookmark = $("#amountOfBookmark");
  const $btnFollow = $("#btnFollow");
  let container = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
  ];
  let toolbarOption = {
    container: container, 
    handlers: {
      image : ""
    }
  }
  let quillOptions = {
    modules: {
      toolbar: toolbarOption,
    },
    placeholder: "Write your post here!",
    readOnly: false,
    theme: "snow",
  }
  let editor = new Quill("#commentEditor", quillOptions)

  // let commentEditor = new Quill("#commentReplyEditor", quillOptions)
  // comment reply events
  $commentReplyBtns.on("click",function (index, commentReplyBtn){
    $(this).parents(".comment-action").slideUp();
    let $formReply = $("<form method='post'></form>").attr("action", "/post/comment/"+$(this).data("comment-id")).addClass("py-2");
    let $editorReply = $("<div></div>");
    let $btnActionGroup = $("<div class='d-flex align-items-center mt-2'></div>");
    let $btnReplySubmit = $("<button class='btn btn-primary'>submit</button>");
    let $bntDismiss = $("<button class='btn btn-secondary ms-2'>Dismiss</button>");
    $btnActionGroup.append($btnReplySubmit).append($bntDismiss);
    $bntDismiss.on("click",(event)=>{
      event.preventDefault();
      $(this).parents(".comment-action").slideDown();
      $formReply.slideUp();
    })
    $(this).parents(".comment-detail").append($formReply);
    $formReply.append($editorReply).append($btnActionGroup);
    let quillReply = new Quill($editorReply[0], quillOptions);
    $formReply.on("submit", event=>{
      let $commentContent = $("<input type='hidden' name='content'>").val(quillReply.root.innerHTML);
      let $parentId = $("<input type='hidden' name='parentId'>").val($(this).data('comment-id'));
      let $postSlug = $("<input type='hidden' name='postSlug'>").val($(this).data('post-slug'));
      $formReply.append($commentContent).append($parentId).append($postSlug);
    })
  })
  // add events : Like, Dislike, Bookmark, Copy
  $btnLike.on("click", function(event){
    let postId = $(this).data("post-id");
    $.ajax({
      url : "/react",
      type : "POST",
      data : {
        type : "like",
        postId
      },
      dataType : "json",
      success : (response)=>{
        if(response.status === "success"){
          
          if(response.isLike){
            $btnLike.addClass("active");
            if($btnDisLike.hasClass("active")){
              $btnDisLike.removeClass("active");
            }
          }
          else{
            $btnLike.removeClass("active");
          }
          $amountOfLikes.text(response.amountOfLikes);
          $amountOfDisLikes.text(response.amountOfDisLikes);
        }
      }
    })
  }) 
  $btnDisLike.on("click", function(event){
    let postId = $(this).data("post-id");
    $.ajax({
      url : "/react",
      type : "POST",
      data : {
        type : "dislike",
        postId
      },
      dataType : "json",
      success : (response)=>{
        if(response.status === "success"){
          if(response.isDisLike){
            $btnDisLike.addClass("active");
            if($btnLike.hasClass("active")){
              $btnLike.removeClass("active");
            }
          }
          else{
            $btnDisLike.removeClass("active");
          }
          console.log(response);
          $amountOfLikes.text(response.amountOfLikes);
          $amountOfDisLikes.text(response.amountOfDisLikes);
        }
      }
    })
  }) 
  $btnBookmark.on("click", function(event){
    let postId = $(this).data("post-id");
    $.ajax({
      url : "/react",
      type : "POST",
      data : {
        type : "bookmark",
        postId
      },
      dataType : "json",
      success : (response)=>{
        if(response.status === "success"){
          if(response.isBookmark){
            $btnBookmark.addClass("active");
          }
          else{
            $btnBookmark.removeClass("active");
          }
          $amountOfBookmark.text(response.amountOfBookmarks);
        }
      }
    })
  }) 
  $btnCopy.on("click", (event)=>{
    navigator.clipboard.writeText(location.href);
  })
  // add event for follow button
  $btnFollow.on("click", event=>{
    let action = $btnFollow.attr("data-action");
    let userId = $btnFollow.data("user-id");
    $.ajax({
      type: "POST",
      url: "/follow",
      data: {
        action, 
        userId
      },
      dataType: "json",
      success: function (response) {
        if(response.status === "success"){
          if(action === "follow"){
            $btnFollow.attr("data-action","unfollow");
            $btnFollow.addClass("btn-secondary").removeClass("btn-primary");
            $btnFollow.text("unfollow");
          }
          else if (action === "unfollow"){
            $btnFollow.attr("data-action","follow");
            $btnFollow.addClass("btn-primary").removeClass("btn-secondary");
            $btnFollow.text("follow");
          }
        }
      }
    });
  })
})