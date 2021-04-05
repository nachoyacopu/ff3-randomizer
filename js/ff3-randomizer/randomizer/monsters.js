/*
 * Final Fantasy III (NES) Randomizer
 * by @NachoYacopu
 *
 * Randomizer methods - Monsters and encounters functions
 *
 */

var FF3 = (function (window, $, module, undefined) {
  "use strict";

  function handleMonsterRandomization(ROM) {
    var rSkill = $("#chk-monsters-skills").is(":checked");
    var rElems = $("#chk-monsters-elements").is(":checked");
    var rStats = $("#chk-monsters-stats").is(":checked");
    if (!(rSkill || rElems || rStats)) return null;

    var rDrops = $("#chk-items-dropsteals").is(":checked");

    var numEnemies = $("#chk-monsters-bosses").is(":checked") ? 0xe6 : 0xcc;

    var ENEMY_DEVIATION = 0.25;
    var BOSS_DEVIATION = 0.33;

    var i;

    var enemiesSkillset = [],
      bossesSkillset = [];

    var thisMonsterPtr, thisMonsterLvl;
    if (rSkill) {
      // create library of normal enemies and bosses skillsets
      for (i = 0; i < numEnemies; i++) {
        thisMonsterPtr = module.address.monsterCombatData + i * 16;
        var skillset = [ROM[thisMonsterPtr + 3], ROM[thisMonsterPtr + 14]];

        // prevent splitting enemies (skillset 0x10) to no skills (0x00)
        if (skillset[1] === 0x10) skillset[1] = 0x00;

        if (i > 0xcc) {
          bossesSkillset.push(skillset);
        } else {
          enemiesSkillset.push(skillset);
        }
      }
    }

    // var howManyEnemies = 0xCC, howManyBosses = 0xE6 - 0xCC;

    for (i = 0; i < numEnemies; i++) {
      thisMonsterPtr = module.address.monsterCombatData + i * 16;
      thisMonsterLvl = ROM[thisMonsterPtr];

      if (rDrops) {
        var droprategroup = parseInt(Math.random() * 0x8000);
        // byte: rrrggggg - r: drop rate, g: drop group
        var ggggg = droprategroup & 0x1f;
        var rrr = 7 - Math.floor(Math.cbrt((droprategroup & 0x7fe0) >> 5));
        if (rrr < 0) rrr = 0;
        ROM[thisMonsterPtr + 15] = (rrr << 5) + ggggg;
      }

      // quick fix: do not further randomize Goblin/LandTurtl/first Bahamut
      if (i === 0x00 || i === 0xcc || i === 0xc9) continue;

      if (rSkill) {
        var dev, sk;
        if (i > 0xcc) {
          // boss
          dev = Math.round(
            module.tanRandom(BOSS_DEVIATION * bossesSkillset.length)
          );
          sk = i - 0xcd + dev;
          if (sk < 0 || sk >= bossesSkillset.length) sk = i - 0xcd - dev;

          ROM[thisMonsterPtr + 3] = bossesSkillset[sk][0];
          ROM[thisMonsterPtr + 14] = bossesSkillset[sk][1];
        } else {
          // enemy
          dev = Math.round(
            module.tanRandom(ENEMY_DEVIATION * enemiesSkillset.length)
          );
          sk = i + dev;
          if (sk < 0 || sk >= enemiesSkillset.length) sk = i - dev;

          ROM[thisMonsterPtr + 3] = enemiesSkillset[sk][0];
          ROM[thisMonsterPtr + 14] = enemiesSkillset[sk][1];
        }

        // lvl%/2 chance for enemies to have a status on hit effect
        if (Math.random() < thisMonsterLvl / 200) {
          ROM[thisMonsterPtr + 10] =
            module.monster_on_hit[
              parseInt(Math.random() * module.monster_on_hit.length)
            ];
        } else {
          ROM[thisMonsterPtr + 10] = 0;
        }
      }

      if (rElems) {
        // 50% chance for all enemies to have random elemental stuff
        if (Math.random() > 0.5) {
          ROM[thisMonsterPtr + 5] = parseInt(Math.random() * 255);
        } else {
          ROM[thisMonsterPtr + 5] = 0;
        }
        if (Math.random() > 0.5) {
          ROM[thisMonsterPtr + 8] = parseInt(Math.random() * 255);
        } else {
          ROM[thisMonsterPtr + 8] = 0;
        }
        if (Math.random() > 0.5) {
          ROM[thisMonsterPtr + 13] = parseInt(Math.random() * 255);
        } else {
          ROM[thisMonsterPtr + 13] = 0;
        }
      }

      if (rStats) {
        ROM[thisMonsterPtr + 7] = parseInt(Math.random() * 255);
        ROM[thisMonsterPtr + 4] = parseInt(Math.random() * 99);
        ROM[thisMonsterPtr + 6] = parseInt(Math.random() * 0xa8);
        ROM[thisMonsterPtr + 9] = parseInt(Math.random() * 0xa8);
        ROM[thisMonsterPtr + 12] = parseInt(Math.random() * 0xa8);
      }
    }
  }

  function randomizeEncounterGroupsByArea(ROM) {
    for (var i = 0; i < 512; i++) {
      if (ROM[module.address.encountersByArea + i] > 0) {
        ROM[module.address.encountersByArea + i] =
          module.encounter_lists[i >> 8][
            parseInt(Math.random() * module.encounter_lists[i >> 8].length)
          ];
      }
    }
  }

  module.monsters = module.monsters || {
    handleMonsterRandomization: handleMonsterRandomization,
    randomizeEncounterGroupsByArea: randomizeEncounterGroupsByArea,
  };

  return module;
})(window, jQuery, FF3 || {});
