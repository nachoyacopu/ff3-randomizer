/*
 * Final Fantasy III (NES) Randomizer
 * by @NachoYacopu
 *
 * Randomizer methods - Item and equipment functions
 *
 */

var FF3 = (function(window, $, module, undefined) {
    'use strict';
    
    var item_pool;
    
    
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
    
    function randomizeEquipment(ROM) {
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
    
    function randomizeWeaponShops(ROM) {
        var weapons = [];
        // Create array with all weapon IDs
        for (var i=1;i<0x56;i++) weapons.push(i);
        // Filter "banned" weapons
        weapons = $.map(weapons, function(a){return $.inArray(a, item_pool) < 0 ? null : a; });
        for(var s=0;s<module.address.shops.weapon.length;s++) {
            var ptr = module.address.shops.weapon[s];
            var stock = 0;
            while ((ROM[++ptr] !== 0) && (stock <= 7)) {
                ROM[ptr] = weapons[parseInt(Math.random() * weapons.length)];
                stock++;
            };
        };
    };
    
    function randomizeArmorShops(ROM) {
        var armor = [];
        // Create array with all armors IDs
        for (var i=0x58;i<0x97;i++) armor.push(i);
        // Filter "banned" armors
        armor = $.map(armor, function(a){return $.inArray(a, item_pool) < 0 ? null : a; });
        for(var s=0;s<module.address.shops.armor.length;s++) {
            var ptr = module.address.shops.armor[s];
            var stock = 0;
            while ((ROM[++ptr] !== 0) && (stock <= 7)) {
                ROM[ptr] = armor[parseInt(Math.random() * armor.length)];
                stock++;
            };
        };
    };
    
    function randomizeMagicShops(ROM) {
        var magic = [];
        // Create array wth all magic spell IDs
        for (var i=0xc8;i<0xff;i++) magic.push(i);
        // Filter "banned" spells
        magic = $.map(magic, function(a){return $.inArray(a, item_pool) < 0 ? null : a; });
        for(var s=0;s<module.address.shops.magic.length;s++) {
            var ptr = module.address.shops.magic[s];
            var stock = 0;
            while ((ROM[++ptr] !== 0) && (stock <= 7)) {
                ROM[ptr] = magic[parseInt(Math.random() * magic.length)];
                stock++;
            };
        };
    };
    
    function randomizeItemShops(ROM) {
        var items = [];
        // Create array with all item IDs
        for (var i=0xa6;i<0xc7;i++) items.push(i);
        // Filter "banned" items
        for(var s=0;s<module.address.shops.item.length;s++) {
            var ptr = module.address.shops.item[s];
            var stock = 0;
            while ((ROM[++ptr] !== 0) && (stock <= 7)) {
                // Antidote hack - ensures Tozas "bread" shop always has Antidotes
                if (ptr === 0x59cd2) {
                    ROM[ptr] = 0xAF;
                // Preserve magic keys on Gisahl shop
                } else if (ptr === 0x59d04) {
                    ROM[ptr] = 0x98;
                } else {
                    ROM[ptr] = items[parseInt(Math.random() * items.length)];
                };
                stock++;
            }
        }
    };
    
    function randomizeChests(ROM) {
        ROM.set(module.random_array_from(item_pool, 512), module.address.chestsData);
    };
    
    function randomizeDropsSteals(ROM) {
        ROM.set(module.random_array_from(item_pool, 256), module.address.dropsStealsData)
    };
    
    module.items = module.items || {
        generateItemPool: generateItemPool,
        randomizeEquipment: randomizeEquipment,
        randomizeWeaponShops: randomizeWeaponShops,
        randomizeArmorShops: randomizeArmorShops,
        randomizeMagicShops: randomizeMagicShops,
        randomizeItemShops: randomizeItemShops,
        randomizeChests: randomizeChests,
        randomizeDropsSteals: randomizeDropsSteals
    };
    
    
    return module;
})(window, jQuery, FF3 || {});