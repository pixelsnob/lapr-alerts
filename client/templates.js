
import { html } from 'diffhtml';

export default {

  login_form: handlers => html`
      <form action="/login" method="post">
        <input type="text" name="username"/>
        <input type="text" name="password"/>
        <input type="submit" onclick=${handlers.onSubmit} value="Submit"/>
      </form>
  `,
  
  main: handlers => html`
    <div id="main">
      <form action="/upload" method="post" enctype="multipart/form-data" id="upload-form">
        <input type="file" name="alerts"/>
        <input id="upload-submit" type="submit" onclick=${handlers.uploadSubmit} value="Submit"/>
      </form>
      <ul id="nav">
        <li><a href="#" onclick=${handlers.import}>Import</a></li>
        <li><a href="#" onclick=${handlers.delete}>Delete All</a></li>
        <li><a href="#" onclick=${handlers.cancel}>Stop Process</a></li>
        <li><a href="#" onclick=${handlers.clearStatus}>Clear Status Messages</a></li>
      </ul>
      <div id="status"></div>
      <div id="captcha"></div>
      <div id="captcha-answer-form"></div>
    </div>
  `,

  captcha_answer_form: handlers => html`
    <form>
      <input type="text" name="captcha-answer"/>
      <input type="submit" onclick=${handlers.onSubmit} value="Submit"/>
    </form>
  `
};


