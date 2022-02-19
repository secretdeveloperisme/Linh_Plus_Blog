$(()=>{
  // handle change list mode 
  const $btnChangeListMode = $("#btnChangeListMode");
  const $postLists = $($(".post-list")[0]);
  const $postItems = $(".post-item");
  const $postItemParents = $postItems.parent();
  $btnChangeListMode.on("click",function(event){
    console.log($postItemParents);
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


})