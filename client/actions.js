
import $ from './selector';
import { innerHTML, html } from 'diffhtml';
import templates from './templates';

function writeStatus(msg) {
  $('#status').innerHTML += ('<br>' + msg);
}

function clearStatus() {
  $('#status').innerHTML = '';
  $('#captcha').innerHTML = '';
  $('#captcha-answer-form').innerHTML = '';
}

function showMainView($el) {
  innerHTML($('#app'), $el);
}

export default {
    
  writeStatus,

  showLoginForm: cb => {
    const $login_form = document.createElement('div');
    $login_form.innerHTML = templates.login_form;
    showMainView($login_form);
    $('input[type="submit"]', $login_form).onclick = ev => {
      cb($('input[name="username"]').value, $('input[name="password"]').value);
      return false;
    };
  },
  
  showMain: handlers => {
    showMainView(templates.main);
    $('#import').onclick = ev => {
      handlers.import();
      return false;
    };
    $('#delete').onclick = ev => {
      handlers.delete();
      return false;
    };
    $('#cancel').onclick = ev => {
      handlers.cancel();
      return false;
    };
    $('#clear-status').onclick = ev => {
      clearStatus();
      return false;
    };
    $('#upload-submit').onclick = ev => {
      const $file = $('input[type="file"]');
      if ($file.files) {
        const data = new FormData()
        data.append('alerts', $file.files[0]);
        handlers.upload(data);
      }
      return false;
    };
  },
  
  showCaptcha: handlers => img_data => {
    writeStatus('Captcha required: google says🖕');
    const img = new Image;
    img.src = img_data;
    img.onload = function() {
      $('#captcha').innerHTML = '';
      $('#captcha').appendChild(img);
    };
    const $form = $('#captcha-answer-form');
    $form.innerHTML = templates.captcha_answer_form;
    const $captcha_answer = $('input[name="captcha-answer"]');
    $captcha_answer.focus();
    $('input[name="submit"]', $form).onclick = ev => {
      handlers.submit($captcha_answer.value);
      $('#captcha').innerHTML = '';
      $('#captcha-answer-form').innerHTML = '';
      return false;
    };
  }


};


