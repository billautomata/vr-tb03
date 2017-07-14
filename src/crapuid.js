module.exports = function crapuid() {
  return Number(Math.random()).toString(16).split('.')[1]
}
