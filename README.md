# Final Fantasy III Randomizer
Web app to randomize Final Fantasy III (NES) Roms.
You can find it [here!](http://yacopu.neocities.org/pages/ff3-randomizer/)

## How to use
- Click the "Select ROM file" button. A dialog will popup asking you for a ROM file that you must provide.
  - Be aware the randomizer doesn't have (yet) a way to verify you uploaded an actual FF3 ROM so be nice.
  - So far both the original (J) version and the English Patch v1.1 done by Neil Corlett+A.W.Jackson+SoM2Freak have been tested to work.
- Go through the options selecting what do you want to randomize/change. A more detailed explanation on what each option does is available on this document.
- Optionally, enter a seed to use. If you don't, one will be assigned randomly.
- Then hit the "Randomize" button. If everything went right, the "Download" button will be enabled shortly.
- Hit the "Download" button and get your randomized ROM.

## Options
There's plenty of different options to change different aspects of the game that can be selected when using the randomizer

### Randomize Jobs
- **Include ___ Jobs** - These options determine which jobs will be added to the job pool to be randomized.
- **Shuffle Jobs** - The meat of the randomized, this changes which jobs you will get from each crystal.

### Randomize Items
- **Randomize chests contents** - Gives all item chests random items from the item pool - and all gold chests random amounts of gold.
- **Randomize enemy drops and steals** - Gives all enemies random drops and steals from the item pool
- **Include ___ in item pool** - Determines whether or not you want certain sets of items in the item pool - items excluded will not be considered to appear on any of the randomizer options

### Randomize Shops
- **Randomize ___ shops** - Changes all shops of a certain type to sell random items of that type.

### Randomize Monsters
- **Randomize skill/status effects** - Gives all enemies random status ailments they can inflict on hit as well as a random skillset.
- **Randomize elemental properties** - Gives all enemies random elemental resistances and weaknesses.
- **Randomize stats** - Slightly alters enemies stats - trying to keep in line with every enemy's actual level (so you won't see Goblins hitting you like 2-headed Dragon or something).
- **Include bosses** - Determines whether to also randomize bosses according to the properties specified above.

### Hardcore Options
- **Randomize encounter group areas** - Shuffles around all encounter zones.

### Balancing
- **Equalize starting stats across all jobs** - This options will assign the same amount of stat points (30) to all jobs on level 1, so no jobs are too overpowered at the start of the game. Note that this only changes starting stats, not stat growth.
- **Improve subpar job commands** - This changes the way some commands work to make them (and their jobs) more appealing:
  - Bard's Scare reduces all enemies levels by ((Bard's Level - 1) / 2)
  - Bard's Cheer increases your entire party's attack power by ((Bard's Level - 1) / 2)

### Boosts
- **Boost ___ gains (2.5x)** - Increases exp/gold/capacity points/job skill points gained after battle. Do note that there's still a cap of one level up/skill level up per encounter.


## Special Thanks

- Thanks to [Data Crystal's FF3 Page](http://datacrystal.romhacking.net/wiki/Final_Fantasy_III) for providing me with all of the relevant ROM addresses to create this randomizer.

## Contact me

You can also find me on [Twitter](https://twitter.com/NachoYacopu), if you have suggestions or bugs to report!
