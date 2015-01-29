/**
 * A simple XHR library.
 * Requires RSVP -- https://github.com/tildeio/rsvp.js/
 */
manki.miscjs.Xhr = function() {
};


/**
 * Sends a GET request to {@code url} and returns an RSVP promise to the
 * response.
 * @param params An object or map of URL query parameters to pass.
 */
manki.miscjs.Xhr.prototype.get = function(url, params) {
  return this.send_('GET', url, params);
};


/**
 * Sends a POST request to {@code url} and returns an RSVP promise to the
 * response.
 * @param params An object or map of URL query parameters to pass.
 */
manki.miscjs.Xhr.prototype.post = function(url, params) {
  return this.send_('POST', url, params);
};


/**
 * Does the actual XHR.
 * @private
 */
manki.miscjs.Xhr.prototype.send_ = function(method, url, params) {
  var thisController = this;
  return new RSVP.Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onload = function() {
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(this.statusText);
      }
    };

    if (method === 'GET' || method === 'HEAD') {
      var element = document.createElement('a');
      element.href = url;
      if (element.search && params) {
        throw new Error('Cannot add params to a URL with query string');
      }
      xhr.open(method, url + '?' + thisController.asQueryString_(params), true);
      xhr.send();
    } else {
      xhr.open(method, url, true);
      xhr.send(thisController.asFormData_(params));
    }
  });
};
