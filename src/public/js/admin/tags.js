$(function () {
  let $btnAddTag = $("#btnAddTag");
  let $addInput = $("#addInput");
  let $tagList = $("#tagList");
  let $btnEditTag = $('#btnEditTag');
  $('#deleteTagModal').on('show.bs.modal', function (event) {
    let $button = $(event.relatedTarget);
    let id = $button.data('id');
    let $btnDeleteTag = $('#btnDeleteTag');
    $btnDeleteTag.on('click', function (event) {
      $.ajax({
        url: `/tag/destroy`,
        type: 'DELETE',
        data: {
         id,
        },
        dataType: 'json',
        success: (response) => {
          if (response.status == 'success') {
            $button.parents().filter('tr').remove();
            $('#deleteTagModal').modal('hide');
          }
        },
      });
    });
  });
  $('#editTagModal').on('show.bs.modal', function (event) {
    let $button = $(event.relatedTarget);
    let id = $button.data('id');
    let name = $button.data('name');
    let $tagNameCell = $button.parents("tr").find(".tag-name")
    let $editInput = $("#editInput");
    $editInput.val(name)
    $btnEditTag.on('click', function (event) {
      console.log("ksdjf")
      $.ajax({
        url: `/tag/update`,
        type: 'PATCH',
        data: {
          id,
          name : $editInput.val()
        },
        dataType: 'json',
        success: (response) => {
          if (response.status == 'success') {
            $tagNameCell.html(`
              <a href="/tag/${$editInput.val()}">${$editInput.val()}</a>
            `)
            $('#editTagModal').modal('hide');
          }
        },
      });
    });
  });
  $('#editTagModal').on('hide.bs.modal', function (event) {
    $btnEditTag.off("click")
  })
  $btnAddTag.on("click", event=>{
    let name = $addInput.val();
    $.ajax({
      type: "POST",
      url: "/tag/create",
      data: {name},
      dataType: "json",
      success: function (response) {
        let tag = response.tag;
        $tagList.html((index, html)=>{
          return (
            html +
            `
            <tr>
              <td scope="row">${tag.id}</td>
              <td scope="row" class="tag-name"><a href="/tag/${tag.name}">${tag.name}</a></td>
              <td scope="row" class="">
                <a  data-bs-target="#editTagModal" data-bs-toggle="modal" class="btn btn-secondary" data-id="${tag.id}" data-name="${tag.name}">edit</a>
                <a class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteTagModal" data-id="${tag.id}">delete</a>
              </td>
            </tr>
            `
          )
        })
        $("#addTagModal").modal("hide")
      }
    });
  })
});
