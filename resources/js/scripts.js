if (window.location.hash === '#_=_') {
  window.history.replaceState
    ? window.history.replaceState(null, null, window.location.href.split('#')[0])
    : window.location.hash = ''
}
