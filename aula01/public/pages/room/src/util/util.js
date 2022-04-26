class Util {
  static sleep(ms) {
    return new Promise((r) => setInterval(r, ms));
  }
}
