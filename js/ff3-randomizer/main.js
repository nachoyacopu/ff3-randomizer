/*
 * Final Fantasy III (NES) Randomizer
 * by @NachoYacopu
 *
 * Main file - entry point
 *
 */

var FF3 = (function (window, $, module, undefined) {
  "use strict";

  var ROM_FILE, seed, blob;
  var ENABLED = true;

  var VERSION = "0.6";

  module.log = function (msg) {
    window.console.log(msg);
  };

  function featureDetection() {
    var errors = [],
      warnings = [];

    // look for slice() property in ByteArray (Uint8Array)
    if (!("slice" in Uint8Array.prototype))
      errors.push(
        "This browser does not support the slice method for typed arrays."
      );

    if (errors.length) {
      ENABLED = false;
      module.log(errors, warnings);
    }

    return ENABLED;
  }

  function doRandomizer(buffer) {
    var result = module.randomizeROM(buffer);
    blob = new Blob([new Uint8Array(result)], {
      type: "application/octet-stream",
    });
    $("#btn-send-file").prop("disabled", false);
  }

  function sendFile() {
    if (blob === undefined) return -1;

    var filename = "ff3-v" + VERSION.toString() + "_" + seed + ".nes";
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  function generateRandomSeed() {
    // random stuff
    var personalities = [
      "agile",
      "amazon",
      "quick",
      "silly",
      "twisted",
      "weepy",
      "fearless",
      "romantic",
      "eager",
      "logical",
      "ordinary",
      "carefree",
      "sharp",
      "kindly",
      "unique",
      "happy",
      "macho",
      "ironman",
      "careless",
      "lazy",
      "solitary",
      "lewd",
      "naive",
      "lucky",
      "jock",
      "meddler",
      "stubborn",
      "selfish",
      "valiant",
      "diligent",
      "ladylike",
      "foolish",
      "vain",
      "timid",
      "alert",
      "lonesome",
      "defiant",
      "helpless",
      "honest",
      "bully",
      "tomboy",
      "tough",
      "sexy",
      "cowardly",
      "smart",
    ];
    var colors = [
      "white",
      "black",
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "indigo",
      "violet",
      "gray",
      "dark",
      "light",
      "time",
      "mystic",
    ];
    var nouns = [
      "onionkid",
      "fighter",
      "monk",
      "wizard",
      "thief",
      "knight",
      "ranger",
      "geomancer",
      "scholar",
      "viking",
      "dragoon",
      "conjurer",
      "bard",
      "karateka",
      "devout",
      "summoner",
      "ninja",
      "sage",
      "berserker",
      "mime",
      "beastmaster",
      "samurai",
      "dancer",
      "chemist",
    ];

    // build a string with these random things
    return (
      personalities[parseInt(Math.random() * personalities.length)] +
      colors[parseInt(Math.random() * colors.length)] +
      nouns[parseInt(Math.random() * nouns.length)]
    );
  }

  // Initialize on document ready
  $(document).ready(function () {
    // set Version
    $("#text-version").text("v" + VERSION.toString());

    // Initialize bootstrap tooltips (opt-in)
    $('[data-toggle="tooltip"]').tooltip();

    // Bind button events
    $("#btn-load-rom").on("click", function () {
      $("#file-rom").trigger("click");
    });

    $("#btn-view-changelog").on("click", function () {
      $("#modal-changelog").modal("show");
    });

    // Detect if user browser has the needed features
    if (featureDetection()) {
      $("#file-rom").on("change", function (e) {
        ROM_FILE = e.target.files[0];
        // TODO: add validations for rom
        $("#btn-randomize").prop("disabled", false);
      });

      $("#btn-randomize").on("click", function () {
        // Get seed (words for now)
        //seed = $('#txt-seed').val() || new Date().toString().replace(/[^A-Z0-9]+/ig, '').split('GMT')[0];
        seed = $("#txt-seed").val() || generateRandomSeed();

        // Set random seed
        Math.seedrandom(seed);

        // Load ROM and send to the randomizer
        var reader = new FileReader();
        reader.onloadend = function () {
          doRandomizer(reader.result);
        };
        reader.readAsArrayBuffer(ROM_FILE);

        $("#txt-seed").attr("value", seed);
        $("#btn-randomize").prop("disabled", true);
      });

      $("#btn-send-file").on("click", function () {
        sendFile();
      });
      //$('#download').on('click', sendFile);
    } else {
      // Warn the user
      window.alert(
        "The randomizer is not supported by this browser! \n Please use Chrome or Firefox!"
      );

      // Disable buttons
      $("#btn-load-rom").prop("disabled", true);
      $("#file-rom").prop("disabled", true);
    }
  });

  return module;
})(window, jQuery, FF3 || {});
