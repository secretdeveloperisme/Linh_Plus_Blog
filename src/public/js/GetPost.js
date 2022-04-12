import {formatDate} from "../js/utils/format_date.js";

$(() => {
  const $btnLike = $("#btnLike");
  const $btnDisLike = $("#btnDislike");
  const $btnBookmark = $("#btnBookmark");
  const $btnCopy = $("#btnCopy");
  const $amountOfLikes = $("#amountOfLike");
  const $amountOfDisLikes = $("#amountOfDislike")
  const $amountOfBookmark = $("#amountOfBookmark");
  const $btnFollow = $("#btnFollow");
  const $btnLikeComments = $(".comment-like-btn");
  const $commentReplyBtns = $(".comment-reply-btn");
  const $btnComment = $("#btnComment");
  const $comments = $(".comments");
  const $btnEditComments= $(".btn-edit-comment");
  const $btnDeleteComments = $(".btn-delete-comment");
  const $modalCheckDeleteComment = $("#checkDeleteComment");
  const $totalOfComments = $("#totalOfComments");
  let container = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
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
      image: ""
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
  let commentEditor = new Quill("#commentEditor", quillOptions)
  // update total Of Comments
  function updateTotalOfComments(amount){
    $totalOfComments.text(Number.parseInt($totalOfComments.text()) + amount)
  }
  // comment reply events
  function replyComment() {
    let $target = $(this);
    $(this).parents(".comment-action").slideUp();
    let $formReply = $("<form method='post'></form>").attr("action", "/post/comment/" + $(this).data("comment-id")).addClass("py-2");
    let $editorReply = $("<div></div>");
    let $btnActionGroup = $("<div class='d-flex align-items-center mt-2'></div>");
    let $btnReplySubmit = $("<button class='btn btn-primary'>submit</button>");
    let $bntDismiss = $("<button class='btn btn-secondary ms-2'>Dismiss</button>");
    $btnActionGroup.append($btnReplySubmit).append($bntDismiss);
    $bntDismiss.on("click", (event) => {
      event.preventDefault();
      $(this).parents(".comment-action").slideDown();
      $formReply.slideUp().remove();
    })
    $(this).parents(".comment-detail").append($formReply);
    $formReply.append($editorReply).append($btnActionGroup);
    let quillReply = new Quill($editorReply[0], quillOptions);
    $formReply.on("submit", event => {
      let $commentContent = $("<input type='hidden' name='content'>").val(quillReply.root.innerHTML);
      let $parentId = $("<input type='hidden' name='parentId'>").val($(this).data('comment-id'));
      let $postSlug = $("<input type='hidden' name='postId'>").val($(this).data('post-id'));
      $formReply.append($commentContent).append($parentId).append($postSlug);
      event.preventDefault()
      $.ajax({
        type: "POST",
        url: "/comment/create",
        data: $formReply.serialize(),
        dataType: "json",
        success: (response) => {
          if (response.status === "success") {
            $bntDismiss.click();
            let $commentInner = $target.parents(".comment-inner").eq(0);
            console.log($commentInner);
            $commentInner.append(`
              <div class="comment mt-2" data-comment-node="0">
                <div class="d-flex comment-wrapper--deep-0">
                  <div class="icon-32 me-2"
                    style="background-image: url('${response.commentOwner.avatar}');"></div>
                  <div class="w-100 comment-inner">
                  <div class="comment-detail p-3 border border-bold w-100 mb-2">
                    <div class="comment-header d-flex">
                      <h5 class="comment__author-name me-2">
                        ${response.commentOwner.username}
                      </h5>
                      <div class="comment-createdAt">
                        ${formatDate(response.comment.createdAt)}
                      </div>
                      <div class="comment-action dropdown ms-auto">
                        <button class="btn btn-link" type="button" data-bs-toggle="dropdown"><i class="fas fa-ellipsis-h"></i></button>
                        <div class="dropdown-menu">
                          <li class="dropdown-item btn-edit-comment" id="edit-comment-id-${response.comment.id}" data-comment-id="${response.comment.id}">Edit</li>
                          <li class="dropdown-item btn-delete-comment" id="delete-comment-id-${response.comment.id}" data-comment-id="${response.comment.id}">Delete</li>
                        </div>
                      </div>
                    </div>
                    <div class="comment-content ql-snow">
                      <div class="ql-editor" style="white-space: normal">
                        ${response.comment.content}
                      </div>
                    </div>
                    <div class="comment-action">
                      <button class="btn comment-like-btn" data-comment-id="${response.comment.id}" id="like-comment-id-${response.comment.id}"><i class="far fa-heart"></i> <span>0</span> Likes</button>
                      <button class="btn comment-reply-btn" id="reply-comment-id-${response.comment.id}" data-post-id="${response.post.id}" data-comment-id="${response.comment.id}"><i class="far fa-comment"></i> Reply</button>
                    </div>
                  </div>
                </div>
              </div>
            `);
            let $btnEditComment = $(`#edit-comment-id-${response.comment.id}`);
            let $btnDeleteComment = $(`#delete-comment-id-${response.comment.id}`);
            $btnEditComment.on("click", editComment);
            $btnDeleteComment.on("click", deleteComment);
            let $btnLikeComment = $(`#like-comment-id-${response.comment.id}`);
            let $amountOfCommentLikes = $btnLikeComment.find("span");
            $btnLikeComment.on("click", event => {
              let commentId = $btnLikeComment.data("comment-id");
              let type = $btnLikeComment.hasClass("active") ? "unlike" : "like";
              $.ajax({
                url: "/comment/like",
                type: "POST",
                data: {
                  type,
                  commentId
                },
                dataType: "json",
                success: (response) => {
                  console.log(response);
                  if (response.status === "success") {
                    if (type === "like") {
                      $btnLikeComment.addClass("active");
                    }
                    else {
                      $btnLikeComment.removeClass("active");
                    }
                    $amountOfCommentLikes.text(response.amountOfCommentLikes);
                  }
                }
              })
            })
            let $btnReplyComment = $(`#reply-comment-id-${response.comment.id}`);
            $btnReplyComment.on("click", replyComment);
            updateTotalOfComments(1);
          }
        }
      });
    })
  }
  function editComment(event){
    let commentId = $(this).data("comment-id");
    let $editEditor = $(this).parents(".comment-detail").eq(0).find(".ql-editor");
    let $btnWrapper = $("<div><div>").addClass("py-3");
    let $btnSubmitEdit = $("<button>Edit</button>").addClass("btn btn-primary");
    let $btnDismissEdit = $("<button>Dismiss</button>").addClass("btn btn-secondary ms-2");
    $btnWrapper.append($btnSubmitEdit).append($btnDismissEdit);
    $editEditor.after($btnWrapper);
    let editQuill  = new Quill($editEditor[0], quillOptions);
    $btnDismissEdit.on("click", function (event){
      $editEditor.closest(".comment-content")
        .html(`<div class="ql-editor">${editQuill.root.innerHTML}<div>`);
    })
    $btnSubmitEdit.on("click", function(event){
      $.ajax({
        type: "PATCH",
        url: "/comment",
        data: {
          commentId,
          content: editQuill.root.innerHTML
        },
        dataType: "json",
        success: function (response) {
          if(response.status === "success"){
           $editEditor.closest(".comment-content")
           .html(`<div class="ql-editor">${editQuill.root.innerHTML}<div>`);
          }
        }
      });
    })
  }
  function deleteComment(event){
    let $btnDeleteComment = $(this);
    $modalCheckDeleteComment.modal("show");
    let commentId = $(this).data("comment-id");
    let $btnConfirmDelete = $modalCheckDeleteComment.find(".btn-confirm-delete");
    $btnConfirmDelete.on("click", function(event){
      $.ajax({
        type: "DELETE",
        url: "/comment",
        data: {
          commentId
        },
        dataType: "json",
        success: function (response) {
          if(response.status === "success"){
            $modalCheckDeleteComment.modal("hide");
            $btnDeleteComment.closest(".comment").slideUp();
            updateTotalOfComments(-1);
          }
        }
      });
    })
  }
  $commentReplyBtns.on("click", replyComment);
  // add events : Like, Dislike, Bookmark, Copy
  $btnLike.on("click", function (event) {
    let postId = $(this).data("post-id");
    $.ajax({
      url: "/react",
      type: "POST",
      data: {
        type: "like",
        postId
      },
      dataType: "json",
      success: (response) => {
        if (response.status === "success") {

          if (response.isLike) {
            $btnLike.addClass("active");
            if ($btnDisLike.hasClass("active")) {
              $btnDisLike.removeClass("active");
            }
          }
          else {
            $btnLike.removeClass("active");
          }
          $amountOfLikes.text(response.amountOfLikes);
          $amountOfDisLikes.text(response.amountOfDisLikes);
        }
      }
    })
  })
  $btnDisLike.on("click", function (event) {
    let postId = $(this).data("post-id");
    $.ajax({
      url: "/react",
      type: "POST",
      data: {
        type: "dislike",
        postId
      },
      dataType: "json",
      success: (response) => {
        if (response.status === "success") {
          if (response.isDisLike) {
            $btnDisLike.addClass("active");
            if ($btnLike.hasClass("active")) {
              $btnLike.removeClass("active");
            }
          }
          else {
            $btnDisLike.removeClass("active");
          }
          console.log(response);
          $amountOfLikes.text(response.amountOfLikes);
          $amountOfDisLikes.text(response.amountOfDisLikes);
        }
      }
    })
  })
  $btnBookmark.on("click", function (event) {
    let postId = $(this).data("post-id");
    $.ajax({
      url: "/react",
      type: "POST",
      data: {
        type: "bookmark",
        postId
      },
      dataType: "json",
      success: (response) => {
        if (response.status === "success") {
          if (response.isBookmark) {
            $btnBookmark.addClass("active");
          }
          else {
            $btnBookmark.removeClass("active");
          }
          $amountOfBookmark.text(response.amountOfBookmarks);
        }
      }
    })
  })
  $btnCopy.on("click", (event) => {
    navigator.clipboard.writeText(location.href);
  })
  // add event for follow button
  $btnFollow.on("click", event => {
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
        if (response.status === "success") {
          if (action === "follow") {
            $btnFollow.attr("data-action", "unfollow");
            $btnFollow.addClass("btn-secondary").removeClass("btn-primary");
            $btnFollow.text("unfollow");
          }
          else if (action === "unfollow") {
            $btnFollow.attr("data-action", "follow");
            $btnFollow.addClass("btn-primary").removeClass("btn-secondary");
            $btnFollow.text("follow");
          }
        }
      }
    });
  })
  // create like comment event 
  $btnLikeComments.on("click", function(event){
    let commentId = $(this).data("comment-id");
    let type = $(this).hasClass("active") ? "unlike" : "like";
    let $amountOfCommentLikes = $(this).find("span");
    $.ajax({
      url: "/comment/like",
      type: "POST",
      data: {
        type,
        commentId
      },
      dataType: "json",
      success: (response) => {
        console.log(response);
        if (response.status === "success") {
          if (type === "like") {
            $(this).addClass("active");
          }
          else {
            $(this).removeClass("active");
          }
          $amountOfCommentLikes.text(response.amountOfCommentLikes);
        }
      }
    })
  })
  // create comment event
  $btnComment.on("click", event => {
    let postId = $btnComment.data("post-id");
    let content = commentEditor.root.innerHTML;
    $.ajax({
      type: "POST",
      url: "/comment/create",
      data: {
        postId,
        content
      },
      dataType: "json",
      success: function (response) {
        if (response.status === "success") {
          commentEditor.setContents("");
          $comments.prepend(`
            <div class="comment mt-2" data-comment-node="0">
              <div class="d-flex comment-wrapper--deep-0">
                <div class="icon-32 me-2"
                  style="background-image: url('${response.commentOwner.avatar}');"></div>
                <div class="w-100 comment-inner">
                <div class="comment-detail p-3 border border-bold w-100 mb-2">
                  <div class="comment-header d-flex">
                    <h5 class="comment__author-name me-2">
                      ${response.commentOwner.username}
                    </h5>
                    <div class="comment-createdAt">
                      ${formatDate(response.comment.createdAt)}
                    </div>
                    <div class="comment-action dropdown ms-auto">
                      <button class="btn btn-link" type="button" data-bs-toggle="dropdown"><i class="fas fa-ellipsis-h"></i></button>
                      <div class="dropdown-menu">
                        <li class="dropdown-item btn-edit-comment" id="edit-comment-id-${response.comment.id}" data-comment-id="${response.comment.id}">Edit</li>
                        <li class="dropdown-item btn-delete-comment" id="delete-comment-id-${response.comment.id}" data-comment-id="${response.comment.id}">Delete</li>
                      </div>
                    </div>
                  </div>
                  <div class="comment-content ql-snow">
                    <div class="ql-editor" style="white-space: normal">
                      ${response.comment.content}
                    </div>
                  </div>
                  <div class="comment-action">
                    <button class="btn comment-like-btn" data-comment-id="${response.comment.id}" id="like-comment-id-${response.comment.id}"><i class="far fa-heart"></i> <span>0</span> Likes</button>
                    <button class="btn comment-reply-btn" id="reply-comment-id-${response.comment.id}" data-post-id="${response.post.id}" data-comment-id="${response.comment.id}"><i class="far fa-comment"></i> Reply</button>
                  </div>
                </div>
              </div>
            </div>
          `);
          let $btnEditComment = $(`#edit-comment-id-${response.comment.id}`);
          let $btnDeleteComment = $(`#delete-comment-id-${response.comment.id}`);
          $btnEditComment.on("click", editComment);
          $btnDeleteComment.on("click", deleteComment);
          let $btnLikeComment = $(`#like-comment-id-${response.comment.id}`);
          let $amountOfCommentLikes = $btnLikeComment.find("span");
          $btnLikeComment.on("click", event => {
            let commentId = $btnLikeComment.data("comment-id");
            let type = $btnLikeComment.hasClass("active") ? "unlike" : "like";
            $.ajax({
              url: "/comment/like",
              type: "POST",
              data: {
                type,
                commentId
              },
              dataType: "json",
              success: (response) => {
                console.log(response);
                if (response.status === "success") {
                  if (type === "like") {
                    $btnLikeComment.addClass("active");
                  }
                  else {
                    $btnLikeComment.removeClass("active");
                  }
                  $amountOfCommentLikes.text(response.amountOfCommentLikes);
                }
              }
            })
          })
          let $btnReplyComment = $(`#reply-comment-id-${response.comment.id}`);
          $btnReplyComment.on("click", replyComment);
          updateTotalOfComments(1);
        }
      }
    });
  })
  // add event for edit comment
  $btnEditComments.on("click", editComment)
  // add event for delete comment
  $btnDeleteComments.on("click",deleteComment);
})