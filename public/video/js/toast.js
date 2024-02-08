const _toastBootstrap = bootstrap.Toast.getOrCreateInstance(
  document.getElementById('liveToast'),
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function toast(title, message) {
  _toastBootstrap.hide();
  $('#liveToastTitle').html(title);
  $('#liveToastBody').html(message);
  _toastBootstrap.show();
}
