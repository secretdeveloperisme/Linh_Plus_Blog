import pagination from "../utils/pagination.js";
$(function () {
  const amountOfPostsPerPage = 4;
  let $cbxAll = $("#formCheckboxAll");
  let $chxPosts = $(".checkbox-post");
  let $btnSubmitAll = $("#btnSubmitAll");
  let $selectAction = $("#selectAction");
  let $modalValidForm = $("#modalValidForm");
  let $postAmount = $("#postAmount");
  let $trashPostAmount = $("#trashPostAmount");
  let $pageItems = $(".page-item");
  let $postList = $("#postList");
  let $pagination = $(".pagination");
  function changePostAmount(amountPost = 0, amountTrashPost = 0){
    $postAmount.text(parseInt($postAmount.text()) + amountPost)
    $trashPostAmount.text(parseInt($trashPostAmount.text()) + amountTrashPost) 
  }
  $modalValidForm.find("button").on("click", function(e){
    $modalValidForm.modal("hide")
  })
  $cbxAll.on("change",function(event){
    let isCheckAll = $cbxAll.prop("checked");
    $chxPosts.prop("checked", isCheckAll)
    renderSubmitAllBtn();
  })
  function checkboxEvent(event){
    let isCheckAll = $(".checkbox-post").length === $(".checkbox-post:checked").length;
    $cbxAll.prop("checked", isCheckAll)
    renderSubmitAllBtn();
  }
  $chxPosts.on("change",checkboxEvent);
  $btnSubmitAll.on("click", function(event){
    if(!$(this).hasClass("disabled")){
      if(isValidFormAll()){
        let action = $($selectAction).val();
        let postIds  = [];
        $(".checkbox-post:checked").each((index, element)=>{
          postIds.push($(element).data('id'));
        })
        $.ajax({
          url: "/post/handle_action",
          type: "POST",
          data: {
            action: action,
            postIds
          },
          dataType: "json",
          success: function(response){
            if(response.status === "success"){
              $(".checkbox-post").each((index, element)=>{
                if(postIds.includes($(element).data("id"))){
                  changePostAmount(-1,1);
                  $(element).parents().filter("tr").remove();
                }
              })
            }
          }
          
        })
      }
    }  
  });
  $('#deletePostModal').on('show.bs.modal', function (event) {
    let $button = $(event.relatedTarget);
    let id = $button.data('id');
    let $btnDeletePost = $('#btnDeletePost');
    $btnDeletePost.on('click', function (event) {
      $.ajax({
        url: `/post/destroy`,
        type: 'DELETE',
        data: {
         id,
        },
        dataType: 'json',
        success: (response) => {
          if (response.status == 'success') {
            $button.parents().filter('tr').remove();
            changePostAmount(-1, 1);
            $('#deletePostModal').modal('hide');
          }
        },
      });
    });
  });
  function renderSubmitAllBtn(){
    if($(".checkbox-post:checked").length > 0){
      $btnSubmitAll.removeClass("disabled");
    }
    else{
      $btnSubmitAll.addClass("disabled");
    }
  }
  function isValidFormAll(){
    if($selectAction.val() === ""){
      $modalValidForm.modal("show");
      return false;
    }
    return true;
  }
  let $previousPage = $(".page-item").eq(0);
  function renderPageNumber(pageNumbers,currentPage){
    $pagination.html(
      pageNumbers.map(pageNumber=>{
        return ( `
          <li class="page-item ${pageNumber==currentPage?"active":""}" data-page="${pageNumber}">
            <span class="page-link " href="#">${pageNumber}</span>
          </li>
        `
      )
      }).join("")
    )
    $pageItems = $(".page-item");
    $pageItems.on("click", pageNumberEvent)
  }
  function pageNumberEvent(event){
    if($(this).data("page")==="...")
      return 
    let $currentPage = $(this);
    if($previousPage[0] == $currentPage[0])
      return 
    let page = $(this).data("page")
    console.log(page)
    $.ajax({
      type: "GET",
      url: "/post/get_all_posts",
      data: {
        page
      },
      dataType: "json",
      success: function (response) {
        if(response.status == "success"){
          $currentPage.addClass("active");
          let targetPage = Number.parseInt($currentPage.data("page"));
          renderPageNumber(pagination(targetPage,response.amountOfPages), targetPage)
          $previousPage.removeClass("active");
          $previousPage = $currentPage;
          $postList.html("");
          let posts = response.posts
          if(posts.length = amountOfPostsPerPage )
            posts.splice(posts.length-1,1)
          posts.forEach(post=>{
            let statusSpan =  post.status_id == 1?'<span class="badge bg-success">Public</span>':post.status_id === 2?'<span class="badge bg-danger">private</span>':"none";
            let postItem = `
            <tr>
              <td scope="row"><input type="checkbox" name="" id="" data-id="${post.id}" class="form-check-input checkbox-post"></td>
              <td scope="row">${post.id}</td>
              <td scope="row"><a href="/post/${post.slug}">${post.title}</a></td>
              <td scope="row">${statusSpan}</td>
              <td scope="row" class="">
                <a href="/post/edit/${post.slug}" class="btn btn-secondary">edit</a>
                <a class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deletePostModal" data-id="${post.id}">delete</a>
              </td>
            </tr>
            `
            $postList.html((index, old)=>{
              return old + postItem;
            })
          })
          $chxPosts = $(".checkbox-post");
          $chxPosts.on("change", checkboxEvent)
        }
      }
    });
  }
  $pageItems.on("click", pageNumberEvent)
});
