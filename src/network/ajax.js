// 'use strict';

export default {
  install(Vue, options) {
    // console.log(process.env);
    Vue.prototype.$ajax = function(options) {
      return ajax({
        baseUrl: process.env.HTTP_BASE || "",
        ...options,
      });
    };
  },
};

function checkCompleteUrl(url) {
  let reg = new RegExp('((^http)|(^https)|(^ftp))://(\\w)+.(\\w)+');
  return reg.test(url);
}

function ajax(optionsP) {
  let methods = ['get', 'post', 'put', 'delete'];
  let options = optionsP || {};
  options.baseUrl = checkCompleteUrl(options.url) ? '' : options.baseUrl;
  if (options.method && options.url) {
    return xhrConnection(
      options.method,
      options.baseUrl + options.url,
      maybeData(options.data),
      options
    );
  }
  return methods.reduce(function(acc, method) {
    acc[method] = function(url, data) {
      return xhrConnection(
        method,
        options.baseUrl + url,
        maybeData(data),
        options
      );
    };
    return acc;
  }, {});
}

function maybeData(data) {
  return data || null;
}

function xhrConnection(type, url, data, options) {
  let returnMethods = ['then', 'catch', 'always'];
  let promiseMethods = returnMethods.reduce(function(promise, method) {
    promise[method] = function(callback) {
      promise[method] = callback;
      return promise;
    };
    return promise;
  }, {});
  let xhr = new XMLHttpRequest();
  xhr.open(type, url, true);
  let formRequest = setHeaders(xhr, options.headers);
  xhr.addEventListener('readystatechange', ready(promiseMethods, xhr), false);
  xhr.send(objectToQueryString(data, formRequest));
  promiseMethods.abort = function() {
    return xhr.abort();
  };
  return promiseMethods;
}

function setHeaders(xhr, headersP) {
  let headers = headersP || {};
  let formRequest = false;
  if (!hasContentType(headers)) {
    formRequest = true;
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }
  Object.keys(headers).forEach(function(name) {
    headers[name] && xhr.setRequestHeader(name, headers[name]);
  });
  return formRequest;
}

function hasContentType(headers) {
  return Object.keys(headers).some(function(name) {
    return name.toLowerCase() === 'content-type';
  });
}

function ready(promiseMethods, xhr) {
  return function handleReady() {
    if (xhr.readyState === xhr.DONE) {
      xhr.removeEventListener('readystatechange', handleReady, false);
      promiseMethods.always.apply(promiseMethods, parseResponse(xhr));

      if (xhr.status >= 200 && xhr.status < 300) {
        promiseMethods.then.apply(promiseMethods, parseResponse(xhr));
      } else {
        promiseMethods.catch.apply(promiseMethods, parseResponse(xhr));
      }
    }
  };
}

function parseResponse(xhr) {
  let result;
  try {
    result = JSON.parse(xhr.responseText);
  } catch (e) {
    result = xhr.responseText;
  }
  return [result, xhr];
}

function objectToQueryString(data, formRequest) {
  if (!formRequest) return isObject(data) ? JSON.stringify(data) : data;
  return isObject(data) ? getQueryString(data) : data;
}

function isObject(data) {
  return Object.prototype.toString.call(data) === '[object Object]';
}

function getQueryString(object) {
  return Object.keys(object).reduce(function(acc, item) {
    let prefix = !acc ? '' : acc + '&';
    return prefix + encode(item) + '=' + encode(object[item]);
  }, '');
}

function encode(value) {
  return encodeURIComponent(value);
}
