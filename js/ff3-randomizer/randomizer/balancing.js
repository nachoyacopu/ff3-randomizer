/*
 * Final Fantasy III (NES) Randomizer
 * by @NachoYacopu
 *
 * Randomizer methods - Balancing functions
 *
 */

var FF3 = (function(window, $, module, undefined) {
    'use strict';
    
    function balanceJobsStartingStats(ROM) {
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
    
    module.balancing = module.balancing || {
        balanceJobsStartingStats: balanceJobsStartingStats
    };
    
    
    return module;
})(window, jQuery, FF3 || {});