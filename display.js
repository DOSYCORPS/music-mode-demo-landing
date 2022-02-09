let shown = false;

if ( document.readyState !== 'loading' ) {
  show();
} else {
  self.addEventListener('DOMContentLoaded', show);
  self.addEventListener('load', show);
}

function show() {
  if ( shown ) return;
  const message = new URL(location).searchParams.get('message');

  if ( message ) {
    document.querySelector('.message-box').innerText = message;
    shown = true;
  }
}
