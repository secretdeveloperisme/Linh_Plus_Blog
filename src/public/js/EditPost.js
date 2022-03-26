$(()=>{
  const $postImageWrapper = $("#postImageWrapper");
  const $postImage = $("#postImage");
  const $displayPostImage = $("#displayPostImage");
  const $tags = $("#tags");
  const $formUploadPost =  $("#formUploadPost");
  const $imagePath = $("#imagePath");
  const $content = $("#content");
  function imageHandler() {
    let input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();
    input.addEventListener('change', function (event) {
      let image = input.files[0];
      if (image != undefined) {
        let form = new FormData();
        form.append('image', image);
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/post/image');
        xhr.onload =  function (event) {
          let res = JSON.parse(this.responseText);
          if (res.status != 'fail') {
            let imagePath = res.imagePath;
            editor.insertEmbed(
              editor.getSelection().index,
              'image',
              imagePath,
            );
          }
        };
        xhr.send(form);
      }
    });
  }
  let toolbarOption = {
    container: "#toolbar", 
    handlers: {
      image : imageHandler
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
  let editor = new Quill("#editor", quillOptions)
  // add event listener 
  $postImage.on("change", function(event){
    let avatarReader = new FileReader();
    avatarReader.onload = (event)=>{
      $displayPostImage.attr("src", event.target.result);
    }
    avatarReader.readAsDataURL(this.files[0]);
  })
  function setCaretToEnd(target) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(target);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    target.focus();
    range.detach(); // optimization
    // set scroll to the end if multiline
    target.scrollTop = target.scrollHeight; 
  }
  function renderTags(){
    let text = $tags.text();
    let tags = text.match(/\w+/g);
    if(tags !== null){
      $tags.html("");
      tags.forEach((value,index)=>{
        // tag parent
        let tagSpan = document.createElement("span");
        $(tagSpan).attr("class","tag btn btn-sm btn-outline-info me-1 mb-1");
        $(tagSpan).attr("contenteditable", "false");
        let tagLabel = document.createElement("span");
        // tag label 
        $(tagLabel).text(value+" ");
        // tag remove button
        let tagRemove = document.createElement("span");
        $(tagRemove).attr("class","text-danger");
        $(tagRemove).html(`<i class="fas fa-times"></i>`);
        $(tagRemove).on("click",(event)=>{
          $(tagSpan).remove();
        });
        // input hidden
        let tagInput = document.createElement("input");
        $(tagInput).attr("type", "hidden");
        $(tagInput).attr("name", "tags");
        $(tagInput).val(value);
        // combine all
        $(tagSpan).append($(tagLabel));
        $(tagSpan).append($(tagRemove));
        $(tagSpan).append($(tagInput));
        $tags.append($(tagSpan));
        setCaretToEnd($tags[0]);
      })
    }
  }
  renderTags();
  $tags.on("keyup",(event)=>{
    if(event.which === 32){
      renderTags()
    }
  })
  $formUploadPost.on("submit",(event)=>{
    let postAvatar = $postImage[0].files[0];
    $content.val(editor.root.innerHTML);
    if(postAvatar){
      let avatarPostForm = new FormData();
      avatarPostForm.append("image", postAvatar);
      let xhrPostImage = new XMLHttpRequest();
      xhrPostImage.open("post","/post/image", false);
      xhrPostImage.send(avatarPostForm);
      if(xhrPostImage.status == 200){
        let res = JSON.parse(xhrPostImage.responseText);
        console.log(res);
        if(res.status === "success"){
          $imagePath.val(res.imagePath);
        }
        else{
          event.preventDefault();
        }
      }
      else
        event.preventDefault();
    }
  })  
})
