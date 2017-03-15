/**
 * Array shuffler/randomizer
 * 
 */
module.exports = function(arr) {
  var i = arr.length, temp, rand;
  // While there remain elements to shuffle...
  while (0 !== i) {
    // Pick a remaining element...
    rand = Math.floor(Math.random() * i);
    i -= 1;
    // And swap it with the current element.
    temp = arr[i];
    arr[i] = arr[rand];
    arr[rand] = temp;
  }
  return arr;

};


