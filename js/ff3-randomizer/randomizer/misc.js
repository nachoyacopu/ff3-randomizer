/*
 * Final Fantasy III (NES) Randomizer
 * by @NachoYacopu
 *
 * Randomizer methods - Misc functions
 *
 */

var FF3 = (function (window, $, module, undefined) {
    'use strict';

    function boostExp(ROM) {
        //ROM.randomize.boost16(module.address.monsterExpValues, 64, 2.5);
        for (var i = 0; i < 64; i++) {
            var expVal = ROM.getInt16(module.address.monsterExpValues + (i << 1));
            expVal = Math.round(Math.pow(expVal, 1.15));
            // round numbers
            var expLog = Math.floor(Math.log10(expVal)) - 2;
            if (expLog > 0)
                expVal = Math.round(expVal / Math.pow(10, expLog)) * Math.pow(10, expLog);

            expVal = expVal - (expVal % 4);
            ROM.setInt16(expVal, module.address.monsterExpValues + (i << 1));

        }
    }

    function boostGold(ROM) {
        ROM.randomize.boost16(module.address.monsterGoldValues, 230, 2);
    }

    function boostCapacity(ROM) {
        ROM.randomize.boost(module.address.formCPValues, 256, 2);
    }


    function randomizeStepTable(ROM) {
        var ord_table = [];
        var new_table = new Uint8Array(256);
        var i;
        for (i = 0; i < 255; i++) {
            ord_table.push(i);
        }
        for (i = 0; i < 256; i++) {
            var newpos = parseInt(Math.random() * ord_table.length);
            new_table[i] = ord_table[newpos];
            ord_table.splice(newpos, 1);
        }
        ROM.set(new_table, module.address.stepTable);
    }

    function allEncountersRunnable(ROM) {
        for (var i = 0; i < 512; i++) {
            var encounterFlags = ROM[module.address.encounterSettings + (i << 1) + 1];
            // var oldEnc = encounterFlags;
            // flags: rbxx xxxx - r: if set, can't run, b: if set, is boss

            // check for first bahamut encounter
            if (i !== 0x055) {
                if (encounterFlags & 0x40) {
                    // is a boss? set as non runnable
                    encounterFlags = encounterFlags | 0x80;
                } else {
                    // else set as runnable
                    encounterFlags = encounterFlags & 0x7f;
                }
            } else {
                // Ensure first Bahamut encounter is always runnable and still flagged as a boss
                encounterFlags = (encounterFlags & 0x3F) | 0x40;
            }

            // reset flag
            ROM[module.address.encounterSettings + (i << 1) + 1] = encounterFlags;
        }
    }

    function halfEncounterRate(ROM) {
        for (var i = 0; i < 512; i++) {
            // Load and reduce threat by half (shift right 1)
            var threat = ROM[module.address.encounterThreatLevels + i] >> 1;
            ROM[module.address.encounterThreatLevels + i] = threat;
        }
    }

    module.misc = module.misc || {
        boostExp: boostExp,
        boostGold: boostGold,
        boostCapacity: boostCapacity,
        randomizeStepTable: randomizeStepTable,
        allEncountersRunnable: allEncountersRunnable,
        halfEncounterRate: halfEncounterRate
    };


    return module;
})(window, jQuery, FF3 || {});
