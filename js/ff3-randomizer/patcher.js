/*
 * Final Fantasy III (NES) Randomizer
 * by @NachoYacopu
 *
 * Patcher utility
 *
 */

var FF3 = (function (window, $, module, undefined) {
  "use strict";

  // All of the patches:

  var patches_data = {
    /* Improved Scare:
     *
     *  ...from: Scare reduces enemies level by 3
     *  ...to: Scare reduces enemies level by (Bard Level - 1) / 2
     */
    bard_improved_scare: {
      address: 0x6ad43,
      data: [0xb1, 0x6e, 0x4a, 0x85, 0x24],
    },

    /* Improved Cheer:
     *
     *  ...from: Cheer increases party attack power by 10
     *  ...to: Cheer increases party attack power by (Bard Level + 1)
     */
    bard_improved_cheer: {
      address: 0x6ad9e,
      data: [
        0xa0,
        0x00,
        0xb1,
        0x6e,
        0x0a,
        0xa0,
        0x19,
        0x18,
        0x71,
        0x18,
        0x90,
        0x02,
        0xa9,
        0xff,
      ],
    },

    /* Not So Defenseless:
     *
     *  ...from: Defenseless sets your defense to 0
     *  ...to: Defenseless sets your defense to (Defense / 2) + 1
     */
    not_so_defenseless: {
      address: 0x62083,
      data: [0x46, 0x26, 0xe6, 0x26],
    },

    /* Instant Invincible:
     *
     *  Sets up a brand new invincible at the entrance of the starting cave
     * TODO: some logic breaks - properly document what can cause softlocks so it can be fixed
     */
    instant_invincible: {
      address: 0x74e98,
      data: [
        0xa9,
        0x01,
        0x8d,
        0x04,
        0x60,
        0xa9,
        0x5f,
        0x8d,
        0x05,
        0x60,
        0xa9,
        0x58,
        0x8d,
        0x09,
        0x60,
        0xa9,
        0x23,
        0x8d,
        0x06,
        0x60,
        0xa9,
        0x1c,
        0x8d,
        0x0a,
        0x60,
        0xa9,
        0x10,
        0x8d,
        0x28,
        0x60,
      ],
    },
  };

  // Function to apply patches

  module.applyPatch = function (patchId, ROM) {
    // Find if patch exists
    if (patchId in patches_data) {
      var patch = patches_data[patchId];
      // if patch is an array, then it contains multiple patches to iterate through
      if (Array.isArray(patch)) {
        for (var index in patch) {
          var subpatch = patch[index];
          // Convert data to Uint8Array and apply to ROM
          ROM.set(new Uint8Array(subpatch.data), subpatch.address);
        }
      } else {
        // if it is an object, its just one patch, apply it
        // Convert data to Uint8Array and apply to ROM
        ROM.set(new Uint8Array(patch.data), patch.address);
      }
      module.log("Patch [" + patchId + "] applied!");
    } else {
      module.log("Patch [" + patchId + "] does not exist!");
    }
  };

  return module;
})(window, jQuery, FF3 || {});
