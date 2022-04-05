$(() => {
  const $btnFollow = $("#btnFollow");
  $btnFollow.on("click", event => {
    let action = $btnFollow.attr("data-action");
    let tagId = $btnFollow.data("tag-id");
    console.log(tagId);
    $.ajax({
      type: "POST",
      url: "/tag/follow",
      data: {
        action,
        tagId
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

})