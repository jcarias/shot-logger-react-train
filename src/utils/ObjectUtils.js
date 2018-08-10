export default class ObjectUtils {
  /**
   * Check if an object is empty
   * @param {Object} obj the object to check
   * @returns {boolean} "true" is object is empty, "false" otherwise
   */
  static isEmpty = obj => {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }

    return true;
  };
}
