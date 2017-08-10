/*
 * Final Fantasy III (NES) Randomizer
 * by @NachoYacopu
 *
 * Randomizer manager
 *
 */

var FF3 = (function(window, $, module, undefined) {
    'use strict';
    
    var ROM;
    
    // Some "global" utility functions
    
    // tan random is a weighted random function that gives numbers between [-range to +range]
    // its weighted to be more likely to give numbers closer to 0 (less deviation)
    module.tanRandom = function(range) {
        var r = (Math.random() - 0.5) * (3.1415296 / 2);
        return Math.pow(Math.tan(r), 2) * Math.sign(r) * range;
    };
    
    module.random_array_from = function(arr, size) {
        var newArray = [];
        for(var i=0;i<size;i++) {
            newArray.push(arr[parseInt(Math.random() * arr.length)]);
        };
        return newArray;
    };
    
    /*
    function giveMeShopPointers() {
        var shopsPtrA = 0x583D6;
        var shopsPtrB = 0x585D6;
        var itemShops = [];
        var weapShops = [];
        var armrShops = [];
        var magiShops = [];
        for (var i=0;i<25;i++) {
            var ptr = [ROM.getInt16(shopsPtrA+i*2), ROM.getInt16(shopsPtrB+i*2)]
            console.log("Shops ID "+(i+0xE3).toString(16)+": 0x"+(ptr[0]+0x50010).toString(16)+", 0x"+(ptr[1]+0x50010).toString(16) );
        
            for(var j=0;j<2;j++){
                var shty = ROM[ptr[j]+0x50010];
                if(shty==7)
                    weapShops.push(ptr[j]+0x50010);
                if(shty==8)
                    armrShops.push(ptr[j]+0x50010);
                if(shty==9)
                    itemShops.push(ptr[j]+0x50010);
                if(shty==10)
                    magiShops.push(ptr[j]+0x50010);
            };
        
        };
        function prettifyAddresses(arr) {
            var str = "[";
            for (var i=0;i<arr.length;i++){
                str += "0x"+arr[i].toString(16)+", ";
            };
            str += "];";
            console.log(str);
        };
        
        prettifyAddresses(weapShops);
        prettifyAddresses(armrShops);
        prettifyAddresses(itemShops);
        prettifyAddresses(magiShops);
    };*/
    
    
    
    module.randomizeROM = function(buffer) {
        
        // Convert buffer to array of bytes
        //var ROM = new Uint8Array(buffer);
        ROM = new ByteArray(buffer).injectRandomizerMethods();
        
        // Balancing
        if ($('#chk-bal-jobs-stats').is(':checked'))
            module.balancing.balanceJobsStartingStats(ROM);
            //balanceJobsStartingStats();
        
        if ($('#chk-bal-jobs-commands').is(':checked')) {
            module.applyPatch("bard_improved_scare", ROM);
            module.applyPatch("bard_improved_cheer", ROM);
        };
        
        if ($('#chk-bal-not-so-defenseless').is(':checked'))
            module.applyPatch("not_so_defenseless", ROM);
        
        
        if ($('#chk-bal-items').is(':checked')) {
            // Ribbon price: 60000
            ROM.setInt16(60000, 0x21EF2);
        };
        
        // Jobs
        //generateJobsPool();
        module.jobs.generateJobsPool();
        if ($('#chk-jobs-shuffle').is(':checked'))
            module.jobs.shuffleJobs(ROM);
            //shuffleJobs();
        
        // Items
        module.items.generateItemPool();
        if ($('#chk-items-chests').is(':checked'))
            module.items.randomizeChests(ROM);
        if ($('#chk-items-dropsteals').is(':checked'))
            module.items.randomizeDropsSteals(ROM);
        
        // Shops
        //giveMeShopPointers(ROM);
        if ($('#chk-shops-weapon').is(':checked'))
            module.items.randomizeWeaponShops(ROM);
        if ($('#chk-shops-armor').is(':checked'))
            module.items.randomizeArmorShops(ROM);
        if ($('#chk-shops-magic').is(':checked'))
            module.items.randomizeMagicShops(ROM);
        
        // Equipment
        module.items.randomizeEquipment(ROM);
        
        
        // Monsters
        module.monsters.handleMonsterRandomization(ROM);
        
        // Boosts
        if ($('#chk-boost-exp').is(':checked'))
            module.misc.boostExp(ROM);
        if ($('#chk-boost-gold').is(':checked'))
            module.misc.boostGold(ROM);
        if ($('#chk-boost-cap').is(':checked'))
            module.misc.boostCapacity(ROM);
        if ($('#chk-boost-skill').is(':checked'))
            ROM[module.address.skillPointsPerLevel] = 50;
        
        // Hardcore
        if ($('#chk-hc-encounters').is(':checked'))
            module.monsters.randomizeEncounterGroupsByArea(ROM);
        
        // Visual
        if ($('#chk-ve-menu').is(':checked'))
            module.visual.randomizeMenuColor(ROM);
        if ($('#chk-ve-monster-palettes').is(':checked'))
            module.visual.randomizeMonsterPalettes(ROM);
        if ($('#chk-ve-weapon-animations').is(':checked'))
            module.visual.randomizeWeaponAnimations(ROM);
        if ($('#chk-ve-weapon-palettes').is(':checked'))
            module.visual.randomizeWeaponPalettes(ROM);
        
        
        
        // Misc
        if ($('#chk-misc-saveanywhere').is(':checked'))
            ROM[0x7A5B5] = 0x00;
        
        if ($('#chk-misc-steptable').is(':checked'))
            module.misc.randomizeStepTable(ROM);
        
        if ($('#chk-half-encounter-rate').is(':checked'))
            module.misc.halfEncounterRate(ROM);
        
        if ($('#chk-all-encounters-runnable').is(':checked'))
            module.misc.allEncountersRunnable(ROM);
        
        if ($('#chk-misc-movespeed').is(':checked')) {
            ROM[module.address.moveSpeed] = 0x02;
            ROM[module.address.moveSpeed2] = 0x02;
            ROM[module.address.moveSpeed3] = 0x02;
        };
        
        if ($('#chk-misc-movespeed-battle').is(':checked')) {
            ROM[module.address.moveSpeedBattle] = 0xFE;
            ROM[module.address.moveSpeedBattle2] = 0x02;
        };
        
        if ($('#chk-misc-fatchocobo').is(':checked'))
            ROM[0x7B4D2] = 0x0D;
        
        // Number of crystal jobs
        if ($('#chk-misc-morejobs').is(':checked')) {
            ROM[module.address.numOfCrystalJobs[0]] = 7;
            ROM[module.address.numOfCrystalJobs[1]] = 11;
            ROM[module.address.numOfCrystalJobs[2]] = 15;
            ROM[module.address.numOfCrystalJobs[3]] = 19;
        };
        
        // Debug
        if ($('#chk-debug-feoks').is(':checked')) {
            ROM.setInt16(9999, 0x73BE8);
            ROM[0x73C00] = 0x63;
            ROM[0x73C01] = 0x74;
            ROM[0x73C02] = 0x8C;
            ROM[0x73C03] = 0x39;
            ROM[0x73C04] = 0x01;
            ROM[0x73C05] = 0x59;
            ROM[0x73C06] = 0x01;
        };
        
        return ROM;
        
    };
    
    return module;
})(window, jQuery, FF3 || {});