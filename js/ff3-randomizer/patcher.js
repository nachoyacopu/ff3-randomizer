'use strict';

var FF3 = (function(window, $, module, undefined) {
    
    // All of the patches:
    
    var patches_data = {
        
        /* Improved Scare:
         *
         *  ...from: Scare reduces enemies level by 3
         *  ...to: Scare reduces enemies level by (Bard Level - 1) / 2
         */
        "bard_improved_scare": {
            address: 0x6AD43,
            data: [0xB1, 0x6E, 0x4A, 0x85, 0x24]
        },
        
        /* Improved Cheer:
         *
         *  ...from: Cheer increases party attack power by 10
         *  ...to: Cheer increases party attack power by (Bard Level + 1)
         */
        "bard_improved_cheer": {
            address: 0x6AD8E,
            data: [0xA0, 0x00, 0xB1, 0x6E, 0x0A, 0xA0, 0x19, 0x18, 0x71, 0x18, 0x90, 0x02, 0xA9, 0xFF]
        }
        
    };
    
    
    // Function to apply patches
    
    module.applyPatch = function (patchId, ROM) {
        
        // Find if patch exists
        if (patchId in patches_data) {
            // Convert data to Uint8Array and apply to ROM
            ROM.set(new Uint8Array(patches_data[patchId].data), patches_data[patchId].address);
            module.log("Patch [" + patchId + "] applied!");
            
        } else {
            module.log("Patch [" + patchId + "] does not exist!");
        };
        
    };
    
    
    
    return module;
})(window, jQuery, FF3 || {});