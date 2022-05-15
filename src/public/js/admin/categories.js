$(function () {
  let $btnAddCategory = $("#btnAddCategory");
  let $addInput = $("#addInput");
  let $categoryList = $("#categoryList");
  let $btnEditCategory = $('#btnEditCategory');
  $('#deleteCategoryModal').on('show.bs.modal', function (event) {
    let $button = $(event.relatedTarget);
    let id = $button.data('id');
    let $btnDeleteCategory = $('#btnDeleteCategory');
    $btnDeleteCategory.on('click', function (event) {
      $.ajax({
        url: `/category/destroy`,
        type: 'DELETE',
        data: {
         id,
        },
        dataType: 'json',
        success: (response) => {
          if (response.status == 'success') {
            $button.parents().filter('tr').remove();
            $('#deleteCategoryModal').modal('hide');
          }
        },
      });
    });
  });
  $('#editCategoryModal').on('show.bs.modal', function (event) {
    let $button = $(event.relatedTarget);
    let id = $button.data('id');
    let name = $button.data('name');
    let $categoryNameCell = $button.parents("tr").find(".category-name")
    let $editInput = $("#editInput");
    $editInput.val(name)
    $btnEditCategory.on('click', function (event) {
      $.ajax({
        url: `/category/update`,
        type: 'PATCH',
        data: {
          id,
          name : $editInput.val()
        },
        dataType: 'json',
        success: (response) => {
          if (response.status == 'success') {
            $categoryNameCell.html(`
              <a href="/Category/${$editInput.val()}">${$editInput.val()}</a>
            `)
            $('#editCategoryModal').modal('hide');
          }
        },
      });
    });
  });
  $('#editCategoryModal').on('hide.bs.modal',event=>{
    $btnEditCategory.off("click");
  })
  $btnAddCategory.on("click", event=>{
    let name = $addInput.val();
    $.ajax({
      type: "POST",
      url: "/category/create",
      data: {name},
      dataType: "json",
      success: function (response) {
        let category = response.category;
        $categoryList.html((index, html)=>{
          return (
            html +
            `
            <tr>
              <td scope="row">${category.id}</td>
              <td scope="row" class="category-name"><a href="/category/${category.name}">${category.name}</a></td>
              <td scope="row" class="">
                <a  data-bs-target="#editCategoryModal" data-bs-toggle="modal" class="btn btn-secondary" data-id="${category.id}" data-name="${category.name}">edit</a>
                <a class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteCategoryModal" data-id="${category.id}">delete</a>
              </td>
            </tr>
            `
          )
        })
        $("#addCategoryModal").modal("hide")
      }
    });
  })
});
