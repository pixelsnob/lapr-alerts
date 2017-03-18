
import $ from './selector';
import { innerHTML } from 'diffhtml';
import templates from './templates';

function writeStatus(msg) {
  const status_container = $('#status');
  status_container.innerHTML += ('<br>' + msg);
  status_container.scrollTop = status_container.scrollHeight;
}

function clearStatus() {
  $('#status').innerHTML = '';
  $('#captcha').innerHTML = '';
  $('#captcha-answer-form').innerHTML = '';
}

function showMainView(el) {
  innerHTML($('#app'), el);
}

export default {
    
  writeStatus,

  showLoginForm: handlers => {
    showMainView(templates.login_form({
      onSubmit: ev => {
        handlers.onSubmit($('input[name="username"]').value,
          $('input[name="password"]').value);
        return false;
      }
    }));
  },
  
  showMain: handlers => {
    showMainView(templates.main(Object.assign(handlers, {
      clearStatus,
      uploadSubmit: ev => {
        handlers.upload($('input[type="file"]').files[0]);
        return false;
      }
    })));
  },
  
  showCaptcha: handlers => img_data => {
    writeStatus('Captcha required: google says🖕');
    const captcha = $('#captcha'),
          img     = new Image;
    img.src = img_data;
    img.onload = function() {
      captcha.innerHTML = '';
      captcha.appendChild(img);
    };
    const form           = $('#captcha-answer-form'),
          captcha_answer = $('input[name="captcha-answer"]', form);
    innerHTML(form, templates.captcha_answer_form({
      onSubmit: ev => {
        handlers.submit(captcha_answer.value);
        captcha.innerHTML = '';
        form.innerHTML = '';
        return false;
      }
    }));
    captcha_answer.focus();
  }

};


