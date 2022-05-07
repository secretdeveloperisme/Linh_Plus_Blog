$(function () {
  $('#deleteUserModal').on('show.bs.modal', function (event) {
    let $button = $(event.relatedTarget);
    let id = $button.data('id');
    let $btnDeleteUser = $('#btnDeleteUser');
    $btnDeleteUser.on('click', function (event) {
      $.ajax({
        url: `/user/destroy`,
        type: 'DELETE',
        data: {
         id,
        },
        dataType: 'json',
        success: (response) => {
          if (response.status == 'success') {
            $button.parents().filter('tr').remove();
            $('#deleteUserModal').modal('hide');
          }
        },
      });
    });
  });
});
