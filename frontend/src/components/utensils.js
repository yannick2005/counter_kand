// function which allows to insert object at at given index
// eslint-disable-next-line
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};
