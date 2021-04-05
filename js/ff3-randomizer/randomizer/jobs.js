/*
 * Final Fantasy III (NES) Randomizer
 * by @NachoYacopu
 *
 * Randomizer methods - Job shuffling functions
 *
 */

var FF3 = (function (window, $, module, undefined) {
  "use strict";

  var jobs_pool;

  function generateJobsPool() {
    // array of jobs
    jobs_pool = [];
    for (var i = 0; i < 21; i++) jobs_pool.push(i);

    // remove jobs from pool
    if (!$("#chk-jobs-ok").is(":checked"))
      jobs_pool = jobs_pool.removeArray([0]); // no OK

    if (!$("#chk-jobs-1st").is(":checked"))
      jobs_pool = jobs_pool.removeArray([1, 2, 3, 4, 5]); // no jobs from 1st crystal

    if (!$("#chk-jobs-2nd").is(":checked"))
      jobs_pool = jobs_pool.removeArray([6, 7, 8, 9]); // no jobs from 2nd crystal

    if (!$("#chk-jobs-3rd").is(":checked"))
      jobs_pool = jobs_pool.removeArray([10, 11, 12, 13, 14, 15, 16]); // no jobs from 3rd crystal

    if (!$("#chk-jobs-4th").is(":checked"))
      jobs_pool = jobs_pool.removeArray([17, 18, 19]); // no jobs from titan crystal

    if (!$("#chk-jobs-eureka").is(":checked"))
      jobs_pool = jobs_pool.removeArray([20, 21]); // no eureka jobs
  }

  function shuffleJobs(ROM) {
    var jobs_data = [],
      i; //, shuffled_jobs = [];
    for (i = 0; i < jobs_pool.length; i++) {
      jobs_data.push(new module.Job().loadFromROM(ROM, jobs_pool[i]));
    }

    var canUseWhiteMagic = 0;
    var numberOfJobsFromFirstCrystal = 5;
    if ($("#chk-misc-morejobs").is(":checked"))
      numberOfJobsFromFirstCrystal = 7;

    var shufflingOnionKnightSlot = $("#chk-jobs-ok").is(":checked");

    for (i = 0; i < jobs_pool.length; i++) {
      var next,
        mustPickAnotherJob = false;
      do {
        next = parseInt(Math.random() * jobs_data.length);

        // check for white magic requirement
        if ($.inArray(jobs_data[next]._id, module.white_magic_jobs) > 0)
          canUseWhiteMagic++;

        // If we're at the limit and no selected job can use white magic, pick another job
        if (canUseWhiteMagic === 0 && i >= numberOfJobsFromFirstCrystal - 1)
          mustPickAnotherJob = true;

        // If this is the first job, OKs are being randomized and we selected bard, pick another job
        if (i === 0 && shufflingOnionKnightSlot && jobs_data[next]._id === 0x10)
          mustPickAnotherJob = true;
      } while (mustPickAnotherJob);

      //console.log(jobs_data[next]._id.toString(16), canUseWhiteMagic);
      jobs_data[next].saveToROM(ROM, jobs_pool[i]);
      jobs_data.splice(next, 1);
    }
  }

  module.jobs = module.jobs || {
    generateJobsPool: generateJobsPool,
    shuffleJobs: shuffleJobs,
  };

  return module;
})(window, jQuery, FF3 || {});
