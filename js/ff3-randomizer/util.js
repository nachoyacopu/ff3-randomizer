'use strict';

// Extend array
// Bad practice but it will do for now
Array.prototype.removeArray = function (toRemove) {
    return $.grep(this, function (value) {
        return $.inArray(value, toRemove) === -1;
    });
};

// cloneSlice now part of ByteArray class
/*
FF3.deep_slice = function (ROM, start, size) {
    var result = new Uint8Array(size);
    for(var i=0;i<size;i++) {
        result[i] = parseInt(ROM[start+i]);
    };
    return result;
};
*/
