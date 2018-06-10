# Final Fantasy III Randomizer
Web app to randomize Final Fantasy III (NES) Roms.
Current version: 0.33
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
- **Shuffle Jobs** - The meat of the randomizer, this changes which jobs you will get from each crystal.

### Randomize Items
- **Randomize chests contents** - Gives all item chests random items from the item pool - and all gold chests random amounts of gold.
- **Randomize enemy drops and steals** - Gives all enemies random drops and steals from the item pool
- **Include ___ in item pool** - Determines whether or not you want certain sets of items in the item pool - items excluded will not be considered to appear on any of the randomizer options

### Randomize Equipment
- **Randomize equipment elemental properties** - Both weapons and armor have random multiple elemental properties.
- **Randomize equipment stat bonuses** - Both weapons and armor get random boosts when equipped such as +5 to a stat or increased elemental damage.

### Randomize Shops
- **Randomize ___ shops** - Changes all shops of a certain type to sell random items of that type.

### Randomize Monsters
- **Randomize skill/status effects** - Gives all enemies random status ailments they can inflict on hit as well as a random skillset (except for split). There's a weighting in this randomization to prevent weak enemies/bosses to get skillset from endgame enemies/bosses and viceversa. 
- **Randomize elemental properties** - Gives all enemies random elemental resistances and weaknesses.
- **Randomize stats** - Slightly alters enemies stats - trying to keep in line with every enemy's actual level (so you won't see Goblins hitting you like 2-headed Dragon or something).
- **Include bosses** - Determines whether to also randomize bosses according to the properties specified above.

### Hardcore Options
- **Randomize encounter group areas** - Shuffles around all encounter zones.

### Patches
- **Boulderless** - This removes the boulder that blocks you from exploring the entire Floating Continent at the start of the game.
Keep in mind this is still an extremely experimental idea yet since I still don't know for sure exactly how certain game flags will behave when you don't complete the Jinn quest and destroy the boulder yourself. For now, use at your own risk!
As of now, I've noticed the following things you need to be aware of:
- You cannot access the Road to the Summit - you will just keep walking and end at the Bahamut's Nest, at which point you will lose access to your airship, since you cannot leave that area!

### Balancing
- **Equalize starting stats across all jobs** - This options will assign the same amount of stat points (30) to all jobs at level 1, so no jobs are too overpowered at the start of the game. Note that this only changes starting stats, not stat growth.
- **Improve subpar job commands** - This changes the way some commands work to make them (and their jobs) more appealing:
  - Bard's Scare reduces all enemies levels by ((Bard's Level - 1) / 2)
  - Bard's Cheer increases your entire party's attack power by ((Bard's Level - 1) / 2)
- **Reduce penalties of "defenseless" state** - This option changes the "defenseless" state (that is applied when attempting to run away or using BuildUp), to go from setting your Defense to 0, to setting your Defense to half its original value (plus 1).
- **Balance items** - This attempts to balance items to make them better or fairer:
  - The buying cost of Ribbon has been increased from 10G to 60000G (Ribbons are broken, you shouldn't be able to acquire 4 of them that easily just by stumbling upon a lucky shop that sells them)

### Boosts
- **Exponential experience boost** - This increases experience from enemies by a power of 1.15. This means roughly that the experience boost starts at roughly 1.5x and grows up to nearly 4x~. This is meant to reduce the grinding required to reach enough HP for the final dungeons. 
- **Boost ___ gains (2x)** - Increases gold/capacity points/job skill points gained after battle. Do note that there's still a cap of one level up/skill level up per encounter.

### Miscellaneous
- **Enable save anywhere** - This options gives you access to the "Save" option even inside towns, caves and dungeons. This will save your progress regarding character growth, items acquired/used and bosses defeated, however when reloading a save it will always place you by default on the last overworld position you were in before entering the town/cave/dungeon you are in.
  - Caveat 1: Saving inside the Altar Cave before defeating the Land Turtle will put you next to Argass Castle with no way to progress, so start a new game if this happens.
  - Caveat 2: You can use the save anywhere feature essentially as an infinite Exit spell - just save after you're done exploring a place, then reset - you'll be placed back in the overworld when you reload your save.
- **Randomize step counter table** - This shuffles the encounter table, which means you'll get encounter at random step values.
- **Cut encounter rate by half** - Halves encounter rate in all areas where random encounters can happen.
- **Make all non-boss encounters runnable** - Enables running away on all random encounters, including those pesky formations in the Cave of Darkness or the lower floors of the Ancient Ruins.
- **Can stash key items in the Fat Chocobo** - Allows you to stash items such as the elemental fangs and keys in the Fat Chocobo - very handy if you get extra copies of these and you want them to stop cluttering your inventory. Put those Carrots to good use!
- **Balance the number of jobs you get from each crystal** - Changes how many jobs you get from each crystal - this options sets it to 7 new jobs from the first crystal, and 4 from each succesive one, except for the Eureka Crystal which gives 2 still.

## Special Thanks

- Thanks to [Data Crystal's FF3 Page](http://datacrystal.romhacking.net/wiki/Final_Fantasy_III) for providing me with all of the relevant ROM addresses to create this randomizer.

## Contact me

You can also find me on [Twitter](https://twitter.com/NachoYacopu), if you have suggestions or bugs to report!
