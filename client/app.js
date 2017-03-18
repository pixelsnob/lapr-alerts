
import views from './views';

views.showLoginForm({
  onSubmit: (username, password) => {
    fetch(`/login?username=${username}&password=${password}`)
      .then(res => res.json())
      .then(res => connect(res.token))
      .catch(err => {
        alert('Login failed!');
      });
    return false;
  }
});

function connect(token) {
  const socket = io.connect('', {
    query: 'token=' + token
  });
  socket.on('error', console.error);
  socket.on('connect', () => {
    views.showMain({
      import: () => socket.emit('import', true),
      cancel: () => socket.emit('cancel', true),
      delete: () => socket.emit('delete', true),
      upload: file => socket.emit('upload', file)
    });
    socket.on('status', views.writeStatus);
    socket.on('upload-success', () => views.writeStatus('File upload succeeded'))
    socket.on('upload-fail', () => views.writeStatus('File upload failed!'));
    socket.on('captcha', views.showCaptcha({
      submit: captcha_answer => socket.emit('captcha-answer', captcha_answer)
    }));
  });
}


