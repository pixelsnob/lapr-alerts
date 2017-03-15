
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
  const socket = io.connect('http://localhost:3007', {
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
          //.then(res => { console.log(res); })
          .then(res => {
            actions.writeStatus('File uploaded');
          })
          .catch(err => {
            console.log(err);
            // file upload failed
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


