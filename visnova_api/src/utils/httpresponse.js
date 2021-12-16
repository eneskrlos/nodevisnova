class httpresponse {
    code = 0;
    message = '';
    data = null;
    serverError = "";

    /* constructor () {
        this.code = 0;
        this.message = "";
        this.data = null;
        this.serverError = "";
  } */

    constructor ( _code,_message,_data,_serverError) {
          this.code = _code;
          this.message = _message;
          this.data = _data;
          this.serverError = _serverError;
    }
}

module.exports = httpresponse;