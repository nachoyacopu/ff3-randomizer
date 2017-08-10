/*
 * Final Fantasy III (NES) Randomizer
 * by @NachoYacopu
 *
 * Randomizer methods - Visual functions
 *
 */

var FF3 = (function(window, $, module, undefined) {
    'use strict';
    
    function randomizeMenuColor(ROM) {
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
    
    function randomizeMonsterPalettes(ROM) {
        for(var i=0;i<255;i++) {
            ROM[module.address.encounterLists+(i*6)] = parseInt(Math.random()*254+1);
            ROM[module.address.encounterLists+(i*6)+1] = parseInt(Math.random()*254+1);
        };
    };
    
    function randomizeWeaponAnimations(ROM) {
        for(var i=0;i<86;i++) {
            ROM[module.address.weaponGFX+(i*3)] = parseInt(Math.random() * 9);
            ROM[module.address.weaponGFX+(i*3)+1] = module.weapon_sprites[parseInt(Math.random() * module.weapon_sprites.length)];
        };
    };
    
    function randomizeWeaponPalettes(ROM) {
        for(var i=0;i<86;i++) {
            ROM[module.address.weaponGFX+(i*3)+2] = module.weapon_palettes[parseInt(Math.random() * module.weapon_palettes.length)];
        };
    };
    
    module.visual = module.visual || {
        randomizeMenuColor: randomizeMenuColor,
        randomizeMonsterPalettes: randomizeMonsterPalettes,
        randomizeWeaponAnimations: randomizeWeaponAnimations,
        randomizeWeaponPalettes: randomizeWeaponPalettes
    };
    
    
    return module;
})(window, jQuery, FF3 || {});