import { firebaseDatabase } from "./firebaseUtils";
/**
 * Firebase service to handle basic CRUD operations
 */
export default class FirebaseService {
  /**
   * Gets a list of items from a specific node path
   * @param {String} nodePath the path to the node being queried.
   * @param {function} callback a callback function to handle the results fetched.
   * @param {Number} [size] the optional limit to the results size.
   * @returns {firebase.database.Reference} a reference to the query generated.
   */
  static getDataList = (nodePath, callback, size) => {
    let query = firebaseDatabase.ref(nodePath);
    if (size && !isNaN(Number(size))) {
      query = firebaseDatabase.ref(nodePath).limitToLast(size);
    }

    query.on("value", dataSnapshot => {
      let items = [];
      dataSnapshot.forEach(childSnapshot => {
        let item = childSnapshot.val();
        item["key"] = childSnapshot.key;
        items.push(item);
      });
      callback(items);
    });

    return query;
  };

  /**
   * Gets the data on the given path
   * @param {String} nodePath the path to the node data.
   * @param {function} callback the callback function to be executed when the data is available having the data object passed as an argument.
   */
  static fetchDataNode = (nodePath, callback) => {
    firebaseDatabase.ref(nodePath).on("value", dataSnapshot => {
      callback(dataSnapshot.val());
    });
  };

  /**
   * Adds an element to a specified node.
   * @param {String}node the node identifier.
   * @param {any} objToSubmit the new object data.
   * @returns {String} the newly created Id.
   */
  static pushData = (node, objToSubmit) => {
    const ref = firebaseDatabase.ref(node).push();
    const id = firebaseDatabase.ref(node).push().key;
    ref.set(objToSubmit);
    return id;
  };

  /**
   * Removes an element from the specified node.
   * @param {String}node the node identifier.
   * @param {String}key the element unique key.
   */
  static remove = (node, key) => {
    return firebaseDatabase.ref(node + "/" + key).remove();
  };

  /**
   * Gets an element by id from the specified node.
   * @param {String}node the node identifier.
   * @param {String}id the element unique key.
   * @param {Function}callback a function to handle the data returned.
   */
  static getUniqueDataBy = (node, id, callback) => {
    firebaseDatabase.ref("/" + node + "/" + id).once("value", snapshot => {
      callback(snapshot.val());
    });
  };

  /**
   * Updates an element in the specified node.
   * @param {String}node the node identifier.
   * @param {String}key the element unique key.
   * @param {any} objToSubmit updated object.
   */
  static updateData = (node, key, objToSubmit) => {
    firebaseDatabase.ref("/" + node + "/" + key).update(objToSubmit);
  };

  /**
   * Converts a map into an array. The map keys are added to the objects under the key 'key'.
   * @param {object} dataSnapshot the data retrieved from Firebase.
   * @returns {Array} the data as an array.
   */
  static buildDataArray = dataSnapshot => {
    let items = [];
    dataSnapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item["key"] = childSnapshot.key;
      items.push(item);
    });
    return items;
  };
}
