$(()=>{
  const $btnLogout = $("#btnLogout");
  $btnLogout.on("click", (event)=>{
    $.ajax({
      type: "POST",
      url: "/auth/logout",
      dataType: "json",
      success: function (response) {
        window.location = "/";
      }
    });
  })
})