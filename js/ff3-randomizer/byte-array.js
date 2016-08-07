'use strict';

// Original Code by Ben Nadel
// from http://www.bennadel.com/blog/2292-extending-javascript-arrays-while-keeping-native-bracket-notation-functionality.htm

window.ByteArray = (function() {
    
    function ByteArray() {
        var byteArray;
        // hack to accept arraybuffer as argument
        // (only array buffer - other arguments are ignored)
        if (arguments[0] instanceof ArrayBuffer) {
            byteArray = new Uint8Array(arguments[0]);
        } else {
            byteArray = Object.create(Uint8Array.prototype);
            byteArray = (Array.apply(byteArray, arguments) || byteArray);
        }
        ByteArray.injectClassMethods(byteArray);
        return byteArray;
    };
    
    ByteArray.injectClassMethods = function(byteArray) {
        for (var method in ByteArray.prototype) {
            if (ByteArray.prototype.hasOwnProperty(method)) {
                byteArray[method] = ByteArray.prototype[method];
            };
        };
        return(byteArray);
    };
    
    ByteArray.fromArray = function (array) {
        var collection = ByteArray.apply(null, array);
        return collection;
    };
    
    ByteArray.isArray = function (value) {
        var stringValue = Object.prototype.toString.call(value);
        return (stringValue.toLowerCase() === "[object array]");
    };
    
    // Class methods
    ByteArray.prototype = {
        
        injectRandomizerMethods: function() {
            this.randomize = ByteArray.randomize;
            this.randomize.parent = this;
            return this;
        },
        
        getInt16: function(position) {
            return (this[position] + (this[position + 1] << 8)); 
        },
        
        setInt16: function(value, position) {
            this[position] = value & 0xFF;
            this[position + 1] = (value & 0xFF00) >>> 8;
            return this;
        }
        
    };
    
    // Randomizer methods (only to be injected in the ROM file ByteArray)
    ByteArray.randomize = {
        isInjected: function() {
            return true;
        },
        
        setRandomFrom: function(array, position, size) {
        },
        
        boost: function(position, size, mult) {
            for(var i=0;i<size;i++) {
                this.parent[position+i] =
                    (this.parent[position + i] * mult) <= 0xFF ?
                    this.parent[position + i] * mult : 0xFF;
            };
        },
        
        boost16: function(position, size, mult) {
            for(var i=0;i<size;i++) {
                var value = this.parent.getInt16(position+(i<<1));
                value = ((value * mult) <= 0xFFFF) ? (value * mult) : 0xFFFF;
                this.parent.setInt16(value, position+(i<<1));
            };
            return this;
        }
    };
    
    return ByteArray;
    
    
}).call({});