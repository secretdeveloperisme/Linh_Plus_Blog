$(()=>{
  const $updateForm = $("#updateForm");
  const $avatarInput = $("#avatar");
  const $avatarOutput = $("#displayAvatar");
  const $btnSave = $("#btnSave");
  const $avatarPath = $("#avatarPath");
  const $updateToast = $("#updateToast");
  const $oldPassword = $("#oldPassword")
  const $newPassword = $(".newPassword");
  const $changePasswordForm = $("#changePasswordForm");
  // add save event
  function toast(type, title, content){
    if(type == "success"){
      $updateToast.find(".toast-icon").attr("class","toast-icon fas fa-check text-primary")
    }
    else if(type == "failed"){
      $updateToast.find(".toast-icon").attr("class","toast-icon fas fa-exclamation-circle text-danger");
    }
    $updateToast.find(".toast-title").text(title);
    $updateToast.find(".toast-body").text(content);
    $updateToast.toast("show");
  }
  $updateForm.on("submit", function(event){
    event.preventDefault();
    const xhrAvatar = new XMLHttpRequest();
    xhrAvatar.open("POST","/me/upload/avatar",false);
    let form  = new FormData();
    if($avatarInput[0].files.length === 1){
      let avatarFile = $avatarInput[0].files[0];
      form.append("avatar", avatarFile);
      xhrAvatar.send(form);
      if(xhrAvatar.status == 200){    
        let response = JSON.parse(xhrAvatar.responseText);
        if(response.status === "success"){
          $avatarPath.val(response.filename);
        }
        else{
          $avatarPath.val($avatarOutput.attr("src"));
        }
      }
    }else{
      $avatarPath.val($avatarOutput.attr("src"));
    }
    let formUpdate = new FormData($updateForm[0]);
    $.ajax({
      type: "PATCH",
      url: "/user/update",
      data: $updateForm.serialize(),
      dataType: "json",
      success: function (response) {
        if(response.status === "success"){
          toast("success", "Success", "update user information successfully");
        }
        else{
          toast("failed", "Failed", "update user information Failed");
        }
      }
    });
  })
  
  $changePasswordForm.on("submit", function(event){
    event.preventDefault();
    const passwordRegex = /(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;
    if(!passwordRegex.test($oldPassword.val())){
      return toast("failed", "Failed", "your old password is a weak password")
    }
    console.log($($newPassword[0]))
    if(!passwordRegex.test($($newPassword[0]).val())){
      return toast("failed", "Failed", "your new password is a weak password")
    }
    $.ajax({
      type: "PATCH",
      url: "/user/update/password",
      data: $changePasswordForm.serialize(),
      dataType: "json",
      success: function (response) {
        toast(response.status, response.status, response.message);
      }
    });
  })
})