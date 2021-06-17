(function() {
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];

  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame =
        window[vendors[x]+'CancelAnimationFrame']
        || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;

      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());

const doubleRequestAnimationFrame = (callback) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback)
  })
}

const forceNextTick = (callback) => {
  if (callback && typeof callback === 'function') {
    doubleRequestAnimationFrame(callback)
  } else {
    return new Promise(resolve => {
      doubleRequestAnimationFrame(resolve)
    })
  }
}

const VueForceNextTick = {
  install (Vue) {
    Vue.$forceNextTick = forceNextTick
    Vue.prototype.$forceNextTick = forceNextTick
  }
}

export default VueForceNextTick
