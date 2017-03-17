
export default {

  login_form: `
    <form action="/login" method="post">
      <input type="text" name="username"/>
      <input type="text" name="password"/>
      <input type="submit" name="submit" value="Submit"/>
    </form>
  `,
  
  main: `
    <div id="main">
      <form action="/upload" method="post" enctype="multipart/form-data" id="upload-form">
        <input type="file" name="alerts"/>
        <input id="upload-submit" type="submit" name="submit" value="Submit"/>
      </form>
      <ul id="nav">
        <li><a href="#" id="import">Import</a></li>
        <li><a href="#" id="delete">Delete All</a></li>
        <li><a href="#" id="cancel">Stop Process</a></li>
        <li><a href="#" id="clear-status">Clear Status Messages</a></li>
      </ul>
      <div id="status"></div>
      <div id="captcha"></div>
      <div id="captcha-answer-form"></div>
    </div>
  `,

  captcha_answer_form: `
    <form>
      <input type="text" name="captcha-answer"/>
      <input type="submit" name="submit" value="Submit"/>
    </form>
  `
};


