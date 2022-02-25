$(()=>{
  const $btnLogin = $("#btnLogin");
  const $btnSignup = $("#btnSignup");
  const $loginTab = $("#loginTab");
  const $signupTab = $("#signupTab");
  const $loginDialogModal = $("#loginDialogModal");
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
  let avatarReader = new FileReader();
  avatarReader.onloadend = function(event){
    $avatarOutput.attr("src", this.result);
  }
  $avatarInput.on("change", function(event){
    avatarReader.readAsDataURL(this.files[0]);
  })

})