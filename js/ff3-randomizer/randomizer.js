'use strict';

var FF3 = (function(window, $, module, undefined) {

    var ROM;
    var item_pool, jobs_pool;
    
    function generateItemPool() {
        // array of items
        item_pool = [];
        for(var i=0;i<255;i++) item_pool.push(i);
        
        // remove banned-bad items
        item_pool = item_pool.removeArray(module.bad_items);
        
        if (!$('#chk-items-key').is(':checked'))
            item_pool = item_pool.removeArray(module.excluded_items.key);
        
        if (!$('#chk-items-ultimate').is(':checked'))
            item_pool = item_pool.removeArray(module.excluded_items.ultimate);
        
        if (!$('#chk-items-onion').is(':checked'))
            item_pool = item_pool.removeArray(module.excluded_items.onion);
        
        if (!$('#chk-items-lvl8').is(':checked'))
            item_pool = item_pool.removeArray(module.excluded_items.magic);
              
    };
    
    function generateJobsPool() {
        // array of jobs
        jobs_pool = [];
        for(var i=0;i<21;i++) jobs_pool.push(i);
        
        // remove jobs from pool
        if (!$('#chk-jobs-ok').is(':checked'))
            jobs_pool = jobs_pool.removeArray([0]); // no OK
        
        if (!$('#chk-jobs-1st').is(':checked'))
            jobs_pool = jobs_pool.removeArray([1,2,3,4,5]); // no jobs from 1st crystal
        
        if (!$('#chk-jobs-2nd').is(':checked'))
            jobs_pool = jobs_pool.removeArray([6,7,8,9]); // no jobs from 2nd crystal
        
        if (!$('#chk-jobs-3rd').is(':checked'))
            jobs_pool = jobs_pool.removeArray([10,11,12,13,14,15,16]); // no jobs from 3rd crystal
    
        if (!$('#chk-jobs-4th').is(':checked'))
            jobs_pool = jobs_pool.removeArray([17,18,19]); // no jobs from titan crystal
        
        if (!$('#chk-jobs-eureka').is(':checked'))
            jobs_pool = jobs_pool.removeArray([20,21]); // no eureka jobs
        
    };
    
    function balanceJobsStartingStats() {
        var factor_stats = 30; // Sum of stats to equalize to (corresponding to value of first crystal jobs)
            
        for(var i=1;i<21;i++) { // for all jobs except Onion Knights
            var stats = ROM.slice(module.address.jobBaseData+(i*8)+2, module.address.jobBaseData+(i*8)+7);
            var sum_stats = stats[0]+stats[1]+stats[2]+stats[3]+stats[4];
            
            if (factor_stats !== sum_stats) {
                var factor = 30 / sum_stats;
                stats[0] = Math.round(stats[0] * factor);
                stats[1] = Math.round(stats[1] * factor);
                stats[2] = Math.round(stats[2] * factor);
                stats[3] = Math.round(stats[3] * factor);
                stats[4] = Math.round(stats[4] * factor);
                ROM.set(stats, module.address.jobBaseData+(i*8)+2);
            };
            
        };
    };
    
    function shuffleJobs() {
        var jobs_data = [];//, shuffled_jobs = [];
        for(var i=0;i<jobs_pool.length;i++) {
            jobs_data.push(new module.Job().loadFromROM(ROM, jobs_pool[i]));
        };
        
        for(var i=0;i<jobs_pool.length;i++) {
            var next = parseInt(Math.random() * jobs_data.length);
            jobs_data[next].saveToROM(ROM, jobs_pool[i]);
            jobs_data.splice(next, 1);
            
        };
    };
    
    function handleMonsterRandomization() {
        var rSkill = $('#chk-monsters-skills').is(':checked');
        var rElems = $('#chk-monsters-elements').is(':checked');
        var rStats = $('#chk-monsters-stats').is(':checked');
        if (!(rSkill || rElems || rStats)) return null;
        
        
        var numEnemies = $('#chk-monsters-bosses').is(':checked') ? 0xE6 : 0xCC;
        for (var i=0;i<numEnemies;i++) {
            var thisMonsterPtr = module.address.monsterCombatData + (i*16);
            var thisMonsterLvl = ROM[thisMonsterPtr];
            
            if(rSkill) {
                // lvl/2% chance for normal enemies to have special attack rate
                // 95% for bosses
                if(Math.random() < ((i > 0xCC) ? 0.95 : (thisMonsterLvl/2) )) {
                    ROM[thisMonsterPtr+3] = parseInt(Math.random()*thisMonsterLvl+1);
                    ROM[thisMonsterPtr+14] = parseInt(Math.random()*0x3D+1);
                } else {
                    ROM[thisMonsterPtr+3] = 0;
                    ROM[thisMonsterPtr+14] = 0;
                };
                // lvl% chance for enemies to have a status on hit effect
                if(Math.random() < (thisMonsterLvl / 100)) {
                    ROM[thisMonsterPtr+10] = module.monster_on_hit[parseInt(Math.random()*module.monster_on_hit.length)];
                } else {
                    ROM[thisMonsterPtr+10] = 0;
                };
            };
            
            if(rElems) {
                // 50% chance for all enemies to have random elemental stuff
                if(Math.random() > 0.5) {
                    ROM[thisMonsterPtr+5] = parseInt(Math.random()*255);
                } else {
                    ROM[thisMonsterPtr+5] = 0;
                };
                if(Math.random() > 0.5) {
                    ROM[thisMonsterPtr+8] = parseInt(Math.random()*255);
                } else {
                    ROM[thisMonsterPtr+8] = 0;
                };
                if(Math.random() > 0.5) {
                    ROM[thisMonsterPtr+13] = parseInt(Math.random()*255);
                } else {
                    ROM[thisMonsterPtr+13] = 0;
                };
            };
            
            if (rStats) {
                ROM[thisMonsterPtr+7] = parseInt(Math.random()*255);
                ROM[thisMonsterPtr+4] = parseInt(Math.random()*99);
                ROM[thisMonsterPtr+6] = parseInt(Math.random()*0xA8);
                ROM[thisMonsterPtr+9] = parseInt(Math.random()*0xA8);
                ROM[thisMonsterPtr+12] = parseInt(Math.random()*0xA8);
            };
        };
    };
    
    function randomizeEquipment() {
        var elements = $('#chk-eq-elements').is(':checked');
        var bonuses = $('#chk-eq-bonuses').is(':checked');
        if (!(elements && bonuses)) return null;
        
        for (var i=1;i<0x97;i++) {
            if (elements) {
                var r = parseInt(Math.random() * 0xFFFF);
                ROM[module.address.equipmentData + (i << 3)] = (r & 0xFF) & (r >> 8);
            };
            if (bonuses) {
                var r = parseInt(Math.random() * 0xFFFF);
                ROM[module.address.equipmentData + (i << 3) + 6] = (r & 0xFF) & (r >> 8);
            };
        };
        
    };
    
    function randomizeWeaponShops() {
        var weapons = [];
        for (var i=1;i<0x56;i++) weapons.push(i);
        weapons = $.map(weapons, function(a){return $.inArray(a, item_pool) < 0 ? null : a; });
        for(var s=0;s<module.address.shops.weapon.length;s++) {
            var ptr = module.address.shops.weapon[s];
            while (ROM[++ptr] !== 0) {
                ROM[ptr] = weapons[parseInt(Math.random() * weapons.length)];
            };
        };
    };
    
    function randomizeArmorShops() {
        var armor = [];
        for (var i=0x58;i<0x97;i++) armor.push(i);
        armor = $.map(armor, function(a){return $.inArray(a, item_pool) < 0 ? null : a; });
        for(var s=0;s<module.address.shops.armor.length;s++) {
            var ptr = module.address.shops.armor[s];
            while (ROM[++ptr] !== 0) {
                ROM[ptr] = armor[parseInt(Math.random() * armor.length)];
            };
        };
    };
    
    function randomizeMagicShops() {
        var magic = [];
        for (var i=0xc8;i<0xff;i++) magic.push(i);
        magic = $.map(magic, function(a){return $.inArray(a, item_pool) < 0 ? null : a; });
        for(var s=0;s<module.address.shops.magic.length;s++) {
            var ptr = module.address.shops.magic[s];
            while (ROM[++ptr] !== 0) {
                ROM[ptr] = magic[parseInt(Math.random() * magic.length)];
            };
        };
    };
    
    function randomizeChests() {
        ROM.set(random_array_from(item_pool, 256), module.address.chestsData);
    };
    
    function randomizeDropsSteals() {
        ROM.set(random_array_from(item_pool, 256), module.address.dropsStealsData)
    };
    
    function randomizeEncounterGroupsByArea() {
        for(var i=0;i<512;i++) {
            if(ROM[module.address.encountersByArea+i] > 0) {
                ROM[module.address.encountersByArea+i]=module.encounter_lists[i >> 8][parseInt(Math.random() * module.encounter_lists[i >> 8].length)];
            };
        };
    };
    
    function boostExp() {
        ROM.randomize.boost16(module.address.monsterExpValues, 64, 2.5);
    };
    
    function boostGold() {
        ROM.randomize.boost16(module.address.monsterGoldValues, 230, 2.5);
    };
    
    function boostCapacity() {
        ROM.randomize.boost(module.address.formCPValues, 256, 2.5);
    };
    
    function randomizeMenuColor() {
        var bgClr = parseInt(Math.random()*12+1);
        var borderClr = bgClr + (parseInt(Math.random()*3+1) * 16);
        // Pause
        ROM[module.address.menuTextboxPalette+2] = bgClr;
        ROM[module.address.menuTextboxPalette+6] = bgClr;
        ROM[module.address.menuTextboxPalette+10] = bgClr;
        ROM[module.address.menuTextboxPalette+13] = borderClr;
        ROM[module.address.menuTextboxPalette+14] = bgClr;
        // Overworld
        ROM[module.address.owTextboxPalette+4] = borderClr;
        ROM[module.address.owTextboxPalette+9] = bgClr;
        // Battle
        ROM[module.address.battleTextboxPalette+1] = borderClr;
        ROM[module.address.battleTextboxPalette+2] = bgClr;
    };
    
    function randomizeMonsterPalettes() {
        for(var i=0;i<255;i++) {
            ROM[module.address.encounterLists+(i*6)] = parseInt(Math.random()*254+1);
            ROM[module.address.encounterLists+(i*6)+1] = parseInt(Math.random()*254+1);
        };
    };
    
    function randomizeWeaponAnimations() {
        for(var i=0;i<86;i++) {
            ROM[module.address.weaponGFX+(i*3)] = parseInt(Math.random() * 9);
            ROM[module.address.weaponGFX+(i*3)+1] = module.weapon_sprites[parseInt(Math.random() * module.weapon_sprites.length)];
        };
    };
    
    function randomizeWeaponPalettes() {
        for(var i=0;i<86;i++) {
            ROM[module.address.weaponGFX+(i*3)+2] = module.weapon_palettes[parseInt(Math.random() * module.weapon_palettes.length)];
        };
    };
    
    function randomizeStepTable() {
        var ord_table = [];
        var new_table = new Uint8Array(256);
        for (var i=0;i<255;i++) {
            ord_table.push(i);
        };
        for (var i=0;i<256;i++) {
            var newpos = parseInt(Math.random() * ord_table.length);
            new_table[i] = ord_table[newpos];
            ord_table.splice(newpos, 1);
        };
        ROM.set(new_table, module.address.stepTable);
    };
    
    function random_array_from(arr, size) {
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
            balanceJobsStartingStats();
        
        if ($('#chk-bal-jobs-commands').is(':checked')) {
            module.applyPatch("bard_improved_scare", ROM);
            module.applyPatch("bard_improved_cheer", ROM);
        };
        
        if ($('#chk-bal-not-so-defenseless').is(':checked')) {
            module.applyPatch("not_so_defenseless", ROM);
        }
        
        // Jobs
        generateJobsPool();
        if ($('#chk-jobs-shuffle').is(':checked'))
            shuffleJobs();
        
        // Items
        generateItemPool();
        if ($('#chk-items-chests').is(':checked'))
            randomizeChests();
        if ($('#chk-items-dropsteals').is(':checked'))
            randomizeDropsSteals();
        
        // Shops
        //giveMeShopPointers(ROM);
        if ($('#chk-shops-weapon').is(':checked'))
            randomizeWeaponShops();
        if ($('#chk-shops-armor').is(':checked'))
            randomizeArmorShops();
        if ($('#chk-shops-magic').is(':checked'))
            randomizeMagicShops();
        
        // Equipment
        randomizeEquipment();
        
        
        // Monsters
        handleMonsterRandomization();
        
        // Boosts
        if ($('#chk-boost-exp').is(':checked'))
            boostExp();
        if ($('#chk-boost-gold').is(':checked'))
            boostGold();
        if ($('#chk-boost-cap').is(':checked'))
            boostCapacity();
        if ($('#chk-boost-skill').is(':checked'))
            ROM[module.address.skillPointsPerLevel] = 40;
        
        // Hardcore
        if ($('#chk-hc-encounters').is(':checked'))
            randomizeEncounterGroupsByArea();
        
        // Visual
        if ($('#chk-ve-menu').is(':checked'))
            randomizeMenuColor();
        if ($('#chk-ve-monster-palettes').is(':checked'))
            randomizeMonsterPalettes();
        if ($('#chk-ve-weapon-animations').is(':checked'))
            randomizeWeaponAnimations();
        if ($('#chk-ve-weapon-palettes').is(':checked'))
            randomizeWeaponPalettes();
        
        
        
        // Misc
        if ($('#chk-misc-steptable').is(':checked'))
            randomizeStepTable(ROM);
        if ($('#chk-misc-movespeed').is(':checked')) {
            ROM[module.address.moveSpeed] = 2;
            ROM[module.address.moveSpeed2] = 2;
            ROM[module.address.moveSpeed3] = 2;
        };
        
        // Number of crystal jobs
        if ($('#chk-misc-morejobs').is(':checked')) {
            ROM[module.address.numOfCrystalJobs[0]] = 7;
            ROM[module.address.numOfCrystalJobs[1]] = 12;
            ROM[module.address.numOfCrystalJobs[2]] = 17;
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