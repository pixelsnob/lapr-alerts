
import actions from './actions';

actions.showLoginForm((username, password) => {
  fetch(`/login?username=${username}&password=${password}`)
    .then(res => res.json())
    .then(res =>connect(res.token))
    .catch(err => {
      // Login failed
    });
  return false;
});

function connect(token) {
  const socket = io.connect('', {
    query: 'token=' + token
  });
  socket.on('error', console.error);
  socket.on('connect', () => {
    actions.showMain({
      import: () => socket.emit('import', true),
      cancel: () => socket.emit('cancel', true),
      delete: () => socket.emit('delete', true),
      upload: file => {
        fetch('/upload', { method: 'post', body: file })
          .then(res => {
            if (res.status == 200) {
              actions.writeStatus('File uploaded');
            } else {
              actions.writeStatus('File upload failed!');
            }
          })
          .catch(err => {
            actions.writeStatus('File upload failed!');
          });
      }
    });
    socket.on('status', actions.writeStatus);
    socket.on('captcha', actions.showCaptcha({
      submit: (captcha_answer) => {
        socket.emit('captcha-answer', captcha_answer); 
      }
    }));
  });
}


