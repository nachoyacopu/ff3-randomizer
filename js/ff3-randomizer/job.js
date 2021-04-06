/*
 * Final Fantasy III (NES) Randomizer
 * by @NachoYacopu
 *
 * Job Class definition
 *
 */

var FF3 = (function (window, $, module, undefined) {
  "use strict";

  module.Job = function () {
    this._id = null;
    this.commands = null;
    this.base = null;
    this.growth = null;
    this.namePtr = null;
    this.data1 = null;
    this.paletteOverworld = null;
    this.spritesOverworld = null;
    this.paletteIndexBattle = null;
    this.spritesBattle = null;
    this.equipabilitySet = null;
    return this;
  };

  module.Job.prototype.loadFromROM = function (ROM, id) {
    this._id = id;
    this.commands = ROM.slice(
      module.address.jobCommands + id * 4,
      module.address.jobCommands + id * 4 + 4
    );
    this.base = ROM.slice(
      module.address.jobBaseData + id * 8,
      module.address.jobBaseData + id * 8 + 8
    );
    this.growth = ROM.slice(
      module.address.jobGrowth + id * 196,
      module.address.jobGrowth + id * 196 + 196
    );
    this.namePtr = ROM.slice(
      module.address.jobNamePtr + id * 2,
      module.address.jobNamePtr + id * 2 + 2
    );
    this.data1 = ROM.slice(
      module.address.jobData1 + id * 5,
      module.address.jobData1 + id * 5 + 5
    );
    this.paletteOverworld = ROM.slice(
      module.address.palettesOverworld + id * 4,
      module.address.palettesOverworld + id * 4 + 4
    );
    this.spritesOverworld = ROM.slice(
      module.address.spritesOverworld + id * 256,
      module.address.spritesOverworld + id * 256 + 256
    );
    this.paletteIndexBattle = ROM.slice(
      module.address.paletteIndexBattle + id + 4,
      module.address.paletteIndexBattle + id + 5
    );
    this.spritesBattle = ROM.slice(
      module.address.spritesBattle + id * 672,
      module.address.spritesBattle + id * 672 + 672
    );

    this.equipabilitySet = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
    for (var i = 0; i < 64; i++) {
      var equadd = getEquipability(ROM, id, i) << (i & 7);
      this.equipabilitySet[i >> 3] += equadd;
    }
    return this;
  };

  module.Job.prototype.saveToROM = function (ROM, id) {
    // If this job model is Knight then rewrite new Knight id to cover logic
    if (this._id === 7) ROM[module.address.jobCover] = id;

    // If this job model is Thief then rewrite new Thief id to door unlocking logic
    if (this._id === 8) ROM[module.address.jobUnlockDoors] = id;

    // If this job model is Summoner or Sage then rewrite new ids to summon magic logic
    if (this._id === 19) ROM[module.address.jobSummonMagic1] = id;
    if (this._id === 20) ROM[module.address.jobSummonMagic2] = id;

    this.base[1] = 0; // Remove level requirement to change into this job
    ROM.set(this.commands, module.address.jobCommands + id * 4);
    ROM.set(this.base, module.address.jobBaseData + id * 8);
    ROM.set(this.growth, module.address.jobGrowth + id * 196);
    ROM.set(this.namePtr, module.address.jobNamePtr + id * 2);
    ROM.set(this.data1, module.address.jobData1 + id * 5);
    ROM.set(this.paletteOverworld, module.address.palettesOverworld + id * 4);
    ROM.set(this.spritesOverworld, module.address.spritesOverworld + id * 256);
    ROM.set(
      this.paletteIndexBattle,
      module.address.paletteIndexBattle + id + 4
    );
    ROM.set(this.paletteIndexBattle, module.address.paletteIndexMenu + id);
    ROM.set(this.spritesBattle, module.address.spritesBattle + id * 672);

    for (var i = 0; i < 64; i++) {
      setEquipability(
        ROM,
        id,
        i,
        this.equipabilitySet[i >> 3] & (1 << (i & 7))
      );
    }
    //console.log("SAVE " + id + ": "+arr2hex64(this.equipabilitySet));

    return this;
  };

  function getEquipability(ROM, jobId, equipSet) {
    return (ROM[
      module.address.equipabilitySets + equipSet * 3 + (2 - (jobId >> 3))
    ] &
      (1 << (jobId & 7))) !==
      0
      ? 1
      : 0;
  }

  function setEquipability(ROM, jobId, equipSet, value) {
    if (value === 0) {
      ROM[
        module.address.equipabilitySets + equipSet * 3 + (2 - (jobId >> 3))
      ] &= ~(1 << (jobId & 7));
    } else {
      ROM[
        module.address.equipabilitySets + equipSet * 3 + (2 - (jobId >> 3))
      ] |= 1 << (jobId & 7);
    }
  }

  /*
    function arr2hex64(arr) {
        return (arr[7].toString(16) + " " + arr[6].toString(16) + " " +
               arr[5].toString(16) + " " + arr[4].toString(16) + " " +
               arr[3].toString(16) + " " + arr[2].toString(16) + " " +
               arr[1].toString(16) + " " + arr[0].toString(16));
    }
    */

  return module;
})(window, jQuery, FF3 || {});
