'use strict';

var FF3 = (function(window, $, module, undefined) {
    
    var ROM_FILE;
    var seed;
    var blob;
    var ENABLED = true;
    
    var VERSION = 0.3;
    
    module.log = function(msg) {
        console.log(msg);
    }
    
    function featureDetection() {
        var errors = [], warnings = [];
        
        // look for slice() property in ByteArray (Uint8Array)
        if (!('slice' in Uint8Array.prototype)) errors.push("This browser does not support the slice method for typed arrays.");
        
        if (errors.length) {
            ENABLED = false;
            module.log(errors, warnings);
        };
        
        return ENABLED;
    };
    
    function doRandomizer(buffer) {
        var result = module.randomizeROM(buffer);
        blob = new Blob([new Uint8Array(result)], {type: 'application/octet-stream'});
        $('#btn-send-file').prop('disabled', false);
    };
    
    function sendFile() {
        if (blob === undefined) return -1;
        
        var filename = "ff3-["+seed+"].nes";
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };
    
    function setTimeSeed() {
        var d = new Date().getTime();
        var seedStr = "";
        while (d > 0) {
            var char = 48 + parseInt(d % 32);
            if ((char > 57) & (char < 65)) char =+ 22;
            seedStr += String.fromCharCode(char);
            d = parseInt(d / 32) + ((d > 3)?(d && 3):0);
        };
        
        console.log("generated seed: " + seedStr);
        return(seedStr);
    };
    
    // Initialize on document ready
    $(document).ready(function() {
        
        // Initialize bootstrap tooltips (opt-in)
        $('[data-toggle="tooltip"]').tooltip();
        
        // Bind button events
        $('#btn-load-rom').on('click', function(e) {
            $('#file-rom').trigger('click');
        });
        
        $('#btn-view-changelog').on('click', function(e) {
            $('#modal-changelog').modal('show');
        });
        
        // Detect if user browser has the needed features
        if (featureDetection()) {
        
            $('#file-rom').on('change', function(e) {
                ROM_FILE = e.target.files[0];
                // TODO: add validations for rom
                $('#btn-randomize').prop('disabled', false);
            });
        
            $('#btn-randomize').on('click', function(e) {
            
                // Get seed (words for now)
                seed = $('#txt-seed').val() || setTimeSeed();
                
                // Set random seed
                Math.seedrandom(seed);
            
                // Load ROM and send to the randomizer
                var reader = new FileReader();
                reader.onloadend = function(e) { doRandomizer(reader.result); };
                reader.readAsArrayBuffer(ROM_FILE);
                
                $('#txt-seed').attr('value', seed);
            
            });
        
            $("#btn-send-file").on('click', function() {
                sendFile();
            });
            //$('#download').on('click', sendFile);
            
        } else {
            // Warn the user
            alert("The randomizer is not supported by this browser! \n Please use Chrome or Firefox!");
            
            // Disable buttons
            $('#btn-load-rom').prop('disabled', true);
            $('#file-rom').prop('disabled', true);
                
        }
        
    });
    
    
    return module;
})(window, jQuery, FF3 || {});