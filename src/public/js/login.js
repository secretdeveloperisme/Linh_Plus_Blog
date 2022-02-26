$(()=>{
  const $btnLogin = $("#btnLogin");
  const $btnSignup = $("#btnSignup");
  const $loginTab = $("#loginTab");
  const $signupTab = $("#signupTab");
  const $loginDialogModal = $("#loginDialogModal");
  const $avatarPath = $("#avatarPath");
  const $signupForm = $("#signupForm");
  // show age output 
  const $ageInput = $("#age");
  const $ageOutput = $("#ageOutput");
  // show avatar output
  const $avatarInput = $("#avatar");
  const $avatarOutput = $("#displayAvatar");
  // add events
  $btnLogin.on("click",function(event){
    $loginDialogModal.removeClass("modal-lg");
    $loginTab.click();
  })
  $btnSignup.on("click",function(event){
    $loginDialogModal.addClass("modal-lg");
    $signupTab.click()
  })
  $loginTab.on("click",function(event){
    $loginDialogModal.removeClass("modal-lg");
  })
  $signupTab.on("click", function(event){
    $loginDialogModal.addClass("modal-lg")
  })
  $ageInput.on("change", function(event){
    $ageOutput.text($ageInput.val());
  })
  // display avatar image
  $signupForm.on("submit", function(event){
    const xhrAvatar = new XMLHttpRequest();
    xhrAvatar.open("POST","/me/upload/avatar",false);
    let form  = new FormData();
    let avatarFile = $avatarInput[0].files[0];
    form.append("avatar", avatarFile);
    xhrAvatar.send(form);
    if(xhrAvatar.status == 200){    
      let response = JSON.parse(xhrAvatar.responseText);
      if(response.status === "success"){
        $avatarPath.val(response.filename)
      }
      else{
        event.preventDefault();
      }
    }
    else{ 
      event.preventDefault();
    }
  })
  $avatarInput.on("change", function(event){
    let avatarReader = new FileReader();
    avatarReader.onload = (event)=>{
      $avatarOutput.attr("src", event.target.result);
    }
    avatarReader.readAsDataURL(this.files[0]);
  })

})