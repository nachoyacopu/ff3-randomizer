'use strict';

var FF3 = (function(window, $, module, undefined) {
    
    var ROM_FILE;
    var seed;
    var blob;
    
    module.log = function(msg) {
        console.log(msg);
    }
    
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
        
        $('#file-rom').on('change', function(e) {
            ROM_FILE = e.target.files[0];
            // TODO: add validations for rom
            $('#btn-randomize').prop('disabled', false);
        });
        
        $('#btn-randomize').on('click', function(e) {
            
            // Get seed (words for now)
            seed = $('#txt-seed').val() || "bahamut";
            
            // Set random seed
            Math.seedrandom(seed);
            
            // Load ROM and send to the randomizer
            var reader = new FileReader();
            reader.onloadend = function(e) { doRandomizer(reader.result); };
            reader.readAsArrayBuffer(ROM_FILE);
            
        });
        
        $("#btn-send-file").on('click', function() {
            sendFile();
        });
        //$('#download').on('click', sendFile);
        
    });
    
    
    return module;
})(window, jQuery, FF3 || {});