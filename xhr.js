if (!window.manki) { window.manki = {}; }
if (!manki.miscjs) { manki.miscjs = {}; }


/**
 * A simple XHR library.
 * Requires RSVP -- https://github.com/tildeio/rsvp.js/
 *
 * @param responseType Expected response type. See responseType at
 *     https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties
 *     for valid values.
 *
 * @constructor
 */
manki.miscjs.Xhr = function(responseType) {
  this.responseType = responseType;
};


/**
 * Creates an Xhr object for making JSON requests.
 */
manki.miscjs.Xhr.json = function() {
  return new manki.miscjs.Xhr('json');
};


/**
 * Creates an Xhr object for making plain text requests.
 */
manki.miscjs.Xhr.text = function() {
  return new manki.miscjs.Xhr('text');
};


/**
 * Sends a GET request to {@code url} and returns an RSVP promise to the
 * response.
 * @param opt_params An object or map of URL query parameters to pass.
 */
manki.miscjs.Xhr.prototype.get = function(url, opt_params) {
  return this.send_('GET', url, opt_params);
};


/**
 * Sends a POST request to {@code url} and returns an RSVP promise to the
 * response.
 * @param opt_params An object or map of URL query parameters to pass.
 */
manki.miscjs.Xhr.prototype.post = function(url, opt_params) {
  return this.send_('POST', url, opt_params);
};


/**
 * Does the actual XHR.
 * @private
 */
manki.miscjs.Xhr.prototype.send_ = function(method, url, opt_params) {
  var thisXhr = this;
  return new RSVP.Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = thisXhr.responseType;
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
      if (element.search && opt_params) {
        throw new Error('Cannot add params to a URL with query string');
      }
      var fullUrl = opt_params ?
          url + '?' + thisXhr.asQueryString_(opt_params) :
          url;
      xhr.open(method, fullUrl, true);
      xhr.send();
    } else {
      xhr.open(method, url, true);
      xhr.send(thisXhr.asFormData_(opt_params));
    }
  });
};

/**
 * Makes URL query string from data in opt_params.
 * @param opt_params An object or map of URL query parameters to pass.
 * @private
 */
// Source: https://stackoverflow.com/a/1714899/13326
manki.miscjs.Xhr.prototype.asQueryString_ = function(opt_params) {
  var qsParts = [];
  if (opt_params) {
    for (p in opt_params) {
      if (opt_params.hasOwnProperty(p)) {
        qsParts.push(
            encodeURIComponent(p) + '=' + encodeURIComponent(opt_params[p]));
      }
    }
  }
  return qsParts.join('&');
};


/**
 * Makes FormData object with data in opt_params.
 * @param opt_params An object or map of URL query parameters to pass.
 * @private
 */
manki.miscjs.Xhr.prototype.asFormData_ = function(opt_params) {
  var form = new FormData();
  if (opt_params) {
    for (p in opt_params) {
      if (opt_params.hasOwnProperty(p)) {
        form.append(p, opt_params[p]);
      }
    }
  }
  return form;
};
