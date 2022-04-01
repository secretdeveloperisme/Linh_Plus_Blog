$(function () {
  let $cbxAll = $("#formCheckboxAll");
  let $chxPosts = $(".checkbox-post");
  let $btnSubmitAll = $("#btnSubmitAll");
  let $selectAction = $("#selectAction");
  let $modalValidForm = $("#modalValidForm");
  let $postAmount = $("#postAmount");
  let $trashPostAmount = $("#trashPostAmount");
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
  $chxPosts.on("change", function(event){
    let isCheckAll = $(".checkbox-post").length === $(".checkbox-post:checked").length;
    $cbxAll.prop("checked", isCheckAll)
    renderSubmitAllBtn();
  })
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
        url: `/post`,
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
});
