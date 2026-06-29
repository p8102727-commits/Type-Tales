import { Area, Boss, Achievement } from './types';

export const AREAS: Area[] = [
  {
    id: 'whispering_forest',
    name: 'Whispering Forest',
    emoji: '🌳',
    description: 'A mystical woodland where trees murmur ancient secrets, currently covered by a dark fog.',
    bgColor: 'from-emerald-900 to-teal-950',
    primaryColor: 'emerald',
    accentColor: 'mint'
  },
  {
    id: 'sunflower_plains',
    name: 'Sunflower Plains',
    emoji: '🌼',
    description: 'A vast golden meadow of giant sunflowers that turn towards the light, wilted under a shadow curse.',
    bgColor: 'from-amber-900 to-yellow-950',
    primaryColor: 'amber',
    accentColor: 'sun_yellow'
  },
  {
    id: 'cozy_village',
    name: 'Cozy Village',
    emoji: '🏡',
    description: 'A charming, solarpunk settlement built around windmills and blooming vines, currently silent and shuttered.',
    bgColor: 'from-orange-950 to-amber-950',
    primaryColor: 'orange',
    accentColor: 'cream_white'
  },
  {
    id: 'cherry_garden',
    name: 'Cherry Blossom Garden',
    emoji: '🌸',
    description: 'A quiet sanctuary where sakura petals fall like soft pink rain, frozen in an eternal chill.',
    bgColor: 'from-rose-950 to-pink-950',
    primaryColor: 'rose',
    accentColor: 'coral'
  },
  {
    id: 'crystal_mountains',
    name: 'Crystal Mountains',
    emoji: '🏔',
    description: 'Breathtaking peaks of pure, musical quartz. Under a frost curse, their harmonies have gone silent.',
    bgColor: 'from-sky-950 to-indigo-950',
    primaryColor: 'sky',
    accentColor: 'sky_blue'
  },
  {
    id: 'floating_islands',
    name: 'Floating Islands',
    emoji: '☁',
    description: 'Islands sailing on the wind, anchored by massive solarpunk chains. The clouds around them are dark and heavy.',
    bgColor: 'from-violet-950 to-purple-950',
    primaryColor: 'violet',
    accentColor: 'lavender'
  },
  {
    id: 'coral_sea',
    name: 'Coral Sea',
    emoji: '🌊',
    description: 'An underwater forest of sparkling bioluminescent coral, darkened by an ocean spill of shadow energy.',
    bgColor: 'from-cyan-950 to-blue-950',
    primaryColor: 'cyan',
    accentColor: 'mint'
  },
  {
    id: 'mushroom_valley',
    name: 'Mushroom Valley',
    emoji: '🍄',
    description: 'A vibrant valley of glowing fungi and fairy rings, where the spores have turned grey and toxic.',
    bgColor: 'from-teal-900 to-emerald-950',
    primaryColor: 'teal',
    accentColor: 'coral'
  },
  {
    id: 'star_observatory',
    name: 'Star Observatory',
    emoji: '🌌',
    description: 'An ancient dome of glass and copper on the highest peak, unable to view the stars due to a dense cosmic haze.',
    bgColor: 'from-indigo-900 to-slate-950',
    primaryColor: 'indigo',
    accentColor: 'golden_light'
  },
  {
    id: 'ancient_library',
    name: 'Ancient Library',
    emoji: '🌿',
    description: 'A grand cathedral of books interwoven with living ivy, where pages are blank and memory itself is fading.',
    bgColor: 'from-stone-900 to-emerald-950',
    primaryColor: 'stone',
    accentColor: 'mint'
  }
];

export const BOSSES: Boss[] = [
  {
    id: 'tree_spirit',
    name: 'Giant Tree Spirit',
    emoji: '🌳✨',
    description: 'The ancient heart of the Whispering Forest, corrupted by shadow vines that wrap around its bark.',
    areaId: 'whispering_forest',
    maxHp: 20
  },
  {
    id: 'ancient_fox',
    name: 'Ancient Fox',
    emoji: '🦊🔥',
    description: 'A majestic nine-tailed kitsune whose once-warm flames have turned into cold, violet corruption fires.',
    areaId: 'sunflower_plains',
    maxHp: 25
  },
  {
    id: 'crystal_turtle',
    name: 'Crystal Turtle',
    emoji: '🐢💎',
    description: 'A centuries-old guardian of the mountain passes, whose crystal shell is clouded with dark energy.',
    areaId: 'crystal_mountains',
    maxHp: 30
  },
  {
    id: 'sky_whale',
    name: 'Sky Whale',
    emoji: '🐋☁',
    description: 'A peaceful traveler of the upper currents, singing in sorrow as a cage of dark wind binds its fins.',
    areaId: 'floating_islands',
    maxHp: 35
  },
  {
    id: 'forest_guardian',
    name: 'Forest Guardian',
    emoji: '🦌🌿',
    description: 'A mighty stag with antlers made of living wood, charging in confusion due to a shadow brand on his forehead.',
    areaId: 'cozy_village',
    maxHp: 40
  },
  {
    id: 'moon_owl',
    name: 'Moon Owl',
    emoji: '🦉🌙',
    description: 'A giant scholarly owl with starry wings, currently blinded by a solar shadow curse.',
    areaId: 'star_observatory',
    maxHp: 45
  },
  {
    id: 'wind_dragon',
    name: 'Wind Dragon',
    emoji: '🐉🌪',
    description: 'An elemental dragon of the skies, whipping up destructive gales because its tail is pinned by crystal spikes.',
    areaId: 'cherry_garden',
    maxHp: 50
  },
  {
    id: 'coral_leviathan',
    name: 'Coral Leviathan',
    emoji: '🐉🌊',
    description: 'A sparkling serpentine dragon wrapped in heavy dark sludge that chokes its glowing bioluminescent horns.',
    areaId: 'coral_sea',
    maxHp: 40
  },
  {
    id: 'spore_golem',
    name: 'Spore Golem',
    emoji: '🗿🍄',
    description: 'A giant clay guardian with gray decayed moss and toxic mushrooms clogging its gears.',
    areaId: 'mushroom_valley',
    maxHp: 35
  },
  {
    id: 'book_wyrm',
    name: 'Book Wyrm',
    emoji: '🐉📚',
    description: 'A clever dragon made of floating parchment sheets, currently burning with smoldering black ashes.',
    areaId: 'ancient_library',
    maxHp: 45
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_adventure',
    title: 'First Adventure',
    description: 'Heal your first path and begin your magical journey.',
    iconName: 'Compass'
  },
  {
    id: 'words_1000',
    title: '1000 Words',
    description: 'Type a total of 1000 words to restore grand natural landscapes.',
    iconName: 'BookOpen'
  },
  {
    id: 'perfect_accuracy',
    title: 'Perfect Accuracy',
    description: 'Heal a full paragraph with 100% typing accuracy.',
    iconName: 'Sparkles'
  },
  {
    id: 'forest_savior',
    title: 'Forest Savior',
    description: 'Purify the Giant Tree Spirit and restore harmony to the Whispering Forest.',
    iconName: 'Heart'
  },
  {
    id: 'village_helper',
    title: 'Village Helper',
    description: 'Breathe life back into the Cozy Village and calm the Forest Guardian.',
    iconName: 'Home'
  },
  {
    id: 'sky_explorer',
    title: 'Sky Explorer',
    description: 'Reach the Floating Islands and free the majestic Sky Whale.',
    iconName: 'Cloud'
  },
  {
    id: 'story_master',
    title: 'Story Master',
    description: 'Read and complete 10 consecutive story segments.',
    iconName: 'Award'
  }
];

export const INITIAL_STORIES: Record<string, string[]> = {
  whispering_forest: [
    "Enter the Whispering Forest, a sacred canopy of towering oak and glowing pine. A violet smog has descended, silencing the gentle sighs of the ancient flora. Let your fingers move gracefully to channel healing auras.",
    "Deep within the thicket, corrupted wood-vines wrap tightly around the heart of the mother tree. Type with soft rhythm to ignite cleansing embers that break the dark embrace and restore natural green.",
    "A soft rain of starlight begins to fall as you restore the forest floor. Moss uncurls beneath your touch, releasing sweet floral scents that fill the crisp, cool mountain air with pure harmony.",
    "Watch the ancient leaves whisper of old legends. A family of spectral deer watches you from the clearing, their eyes shining with gratitude as the shadow fog recedes from their home.",
    "The giant roots of the Elder Tree spirit shudder, shedding layers of stone-hard corruption. Every key you press sends a wave of gold-dusted butterflies to heal the wounded branches above.",
    "Sunlight pierces the thick woodland ceiling, creating emerald pillars of hope. The forest path slowly clears of thorns, welcoming cozy travelers back to the whispering green sanctuary.",
    "A beautiful hum ripples through the damp soil as ancient stone runes ignite. Solarpunk crystal shards embedded in the trees begin to glow, absorbing the remaining darkness from the air.",
    "The giant Tree Spirit bows its heavy crown, eyes changing from crimson rage to peaceful golden light. The forest is safe once more, wrapped in a blanket of warm solarpunk hope."
  ],
  sunflower_plains: [
    "Wander into the gorgeous Sunflower Plains, once an endless ocean of golden light. Under the heavy shadow curse, the tall flowers hang low, their petals withered and gray.",
    "Let your words flow like warm solar wind across the wilted meadow. Feel the keys pulse with energy as vibrant gold beams lance outwards, turning gray petals into glowing sunshine.",
    "The giant sunflower discs begin to creak and turn back toward the sky. They follow your steps, catching the warm morning rays as the dark clouds scatter above the horizon.",
    "A wild breeze ripples through the golden stems, creating waves of orange-cream light. A majestic nine-tailed Kitsune stands in the clearing, its tails wrapped in cold violet fire.",
    "Type with gentle precision to quench the frost bounding the Ancient Fox. Golden sparks burst from your fingertips, weaving a soft thermal blanket that melts the shadow chains.",
    "Small field mice and bumblebees emerge from their nests, dancing around the freshly healed petals. The solar energy is thick in the air, humming with cozy, peaceful warmth.",
    "A giant bronze wind-catcher on the ridge begins to hum, capturing the solar-wind and channeling it into the ground, sparking mini-rainbows of energy across the plains.",
    "With a joyous bark, the Ancient Fox leaps into the sky, its tails trailing behind like golden banners of spring. The plains have risen from the dark winter of corruption."
  ],
  cozy_village: [
    "Arrive at the gates of the Cozy Village, a peaceful solarpunk town of windmills and blooming gardens. The sails are frozen, and the beautiful light-vines are silent and dark.",
    "Let us breathe life back into the wooden gears. Type with steady tempo to release the wind! A warm, fragrant breeze rises, making the windmill blades spin with a comforting creak.",
    "Vibrant ivy races up the cobblestone walls, blooming with glowing sun-lantern flowers that cast a warm peach-colored light across the empty streets and cozy porches.",
    "A mighty stag, the Forest Guardian, approaches down the lane, its wooden antlers tangled in thorns. Let us type soothing lullabies to dissolve the crimson mark on its forehead.",
    "The heavy copper pipes of the village water-mill begin to chime, pumping fresh purified water into the canals. Small paper boats crafted by children drift down the clean streams.",
    "Warm light-vines wrap around the solar balconies, illuminating the path with soft, eye-safe gold. Villagers peek through their shutters, smiling as the cozy atmosphere returns.",
    "The giant town-square clock, powered by geothermal heat, ticks back to life. Its brass hands spin, releasing a wave of sparkling mechanical dandelion seeds into the air.",
    "The Forest Guardian stops and bows, nuzzling your shoulder with a soft green nose. The village doors swing open, filled with the aroma of hot cider and community celebration."
  ]
};

export const DEFAULT_STORIES: Record<string, string[]> = {
  cherry_garden: [
    "Step onto the red wooden bridge of the Cherry Blossom Garden. A frozen spell has locked the delicate pink canopy in absolute ice, halting the natural cycle of spring.",
    "Type each letter to send gentle waves of thermal energy through the cold air. Watch the frost melt from the branches, letting pink sakura petals drift lazily onto the frozen pond.",
    "Beneath the stone lantern, a crystal geyser is blocked by heavy dark crystals. Cast a purification spell through your typing to let the sweet water bubble up once more.",
    "The air grows warm and sweet with the scent of cherry blossoms. A majestic Sky Dragon, colored in soft pink and white scales, circles above, trapped in cold winter winds.",
    "Guide your words to untangle the icy currents binding the dragon's tail. Every correct phrase lances through the violet storm, restoring the natural flow of spring breeze.",
    "Small floating lanterns of paper and copper light up along the garden paths, cast in a warm rosy pink. The petals form a soft, thick carpet that glows gently under your feet.",
    "A beautiful tea house by the waterfall opens its wooden doors. The hearth inside crackles with clean flame, welcoming the garden spirits to share stories of your magic.",
    "The Sky Dragon lets out a soft, musical purr, showering the garden in a blizzard of glowing pink petals. The winter curse is broken, and eternal spring has returned."
  ],
  crystal_mountains: [
    "Scale the majestic Crystal Mountains, where towering peaks of pure quartz pierce the indigo sky. Currently, the rocks are dark and cracked, their famous singing hum gone.",
    "Type the ancient runes of resonance to mend the broken quartz pillars. Feel the vibration rise through your keyboard as the crystals heal, singing sweet, high-pitched tones.",
    "A giant Crystal Turtle walks slowly onto the icy pass, its ancient shell clouded with black ooze. Type with steady rhythm to polish its quartz shell with warm starlight.",
    "Beautiful blue aurora bands begin to dance across the sky, reflecting off the polished mountain peaks. The cold mountain wind turns into a gentle, singing breeze of hope.",
    "Under your touch, deep mineral veins of sapphire and amethyst ignite, shining through the snow. The mountain paths glow with safe, bioluminescent guides for cozy hikers.",
    "Little rock spirits made of round pebbles climb onto the ledges, chirping happily in tune with the crystalline melodies. The heavy fog below begins to melt away.",
    "A beautiful solarpunk cable car, decorated with brass and glass, starts to move along its line, carrying warm blankets and hot chocolate to the mountain sanctuaries.",
    "The Crystal Turtle thumps its heavy tail, sending a shockwave of musical harmony that shatters the remaining dark shards. The mountains are alive with the sound of music."
  ],
  floating_islands: [
    "Ascend into the sky where islands float like ships, anchored by heavy copper chains. The atmosphere is thick with dark storm clouds, blocking the beautiful sun rays.",
    "Let your typing create warm, upward thermal currents that lift the heavy damp air. Watch the storm clouds part, allowing glorious beams of golden light to touch the green grass.",
    "A majestic Sky Whale glides through the lower currents, crying out in pain as chains of dark wind bind its fins. Type with precision to unravel the violet vortex.",
    "Vibrant yellow sky-vines climb down the solarpunk anchor chains, blooming with floating air-lanterns that drift around the islands like friendly starlight spirits.",
    "The islands sway gently on the warm breeze as the dark pressure lifts. Small wooden sky-boats set sail from the docks, their white solar sails catching the clean wind.",
    "Cascading waterfalls flow from the floating islands, falling into the clouds below like ribbons of liquid silver. Colorful sky-birds chirp happily as they join your journey.",
    "The central floating lighthouse ignites, spinning its giant amber lens and casting a warm, guiding light through the clear sky, welcoming sky-travelers home.",
    "With a joyous splash of its tail, the Sky Whale dives into a bank of golden clouds, singing a deep, resonant song of freedom. The sky islands are floating in pure joy."
  ],
  coral_sea: [
    "Dive into the deep, sparkling waters of the Coral Sea. The gorgeous reef is covered in a heavy blanket of black oil, choking the bioluminescent life below.",
    "Type with smooth, fluid strokes to release gentle bubbles of cleansing foam. Watch the bubbles sweep across the ocean floor, dissolving the dark grease in seconds.",
    "A majestic Coral Leviathan, covered in bioluminescent horns, swims around the deep trench, its eyes burning with shadow fire. Let us type sweet sea melodies to calm it.",
    "The reef begins to wake up. Coral branches light up in brilliant shades of turquoise, cyan, and deep pink, changing colors in rhythm with your typing speed.",
    "Schools of tiny glass fish swim in playful spirals around your typing bot, leaving trails of glowing neon bubbles that illuminate the beautiful sandy ocean floor.",
    "Solarpunk water-turbines on the seafloor begin to turn smoothly, filtering the currents and releasing pure oxygen that makes the kelp forests sway in happy rhythm.",
    "An ancient underwater temple made of pearlescent stone opens its gates, releasing a wave of golden warm currents that heat the chilly ocean depths with cozy light.",
    "The Coral Leviathan sings a deep ocean lullaby, its body glowing with peaceful sea-foam green. The Coral Sea is restored to its glorious, glowing sanctuary."
  ],
  mushroom_valley: [
    "Walk among the towering, umbrella-like fungi of Mushroom Valley. A toxic gray rot has settled over the mossy ground, turning the magical spores into choking ash.",
    "Type with swift, crisp keys to release cleansing lavender spores. Watch the gray dust turn into beautiful glowing lavender particles that dance through the cool air.",
    "A giant Spore Golem, carved from clay and covered in moss, blocks the forest path. Type with steady heart to clear the violet corruption clogging its ancient earthen gears.",
    "Little forest sprites peek out from under the giant caps, their eyes wide with wonder. They wave tiny glowing mushrooms to cheer you on as the air grows sweet.",
    "Every word you complete makes a giant mushroom cap light up with soft neon purple, casting cozy shadows over the velvet grass and safe stone paths.",
    "Fairy rings of small glowing toadstools begin to pop up, humming a quiet musical scale. The toxic decay dissolves, leaving behind the rich, fresh smell of damp earth.",
    "The central mother-shroom releases a massive wave of golden spores that sweep across the valley, forming a protective warm dome that shields the valley from future shadow.",
    "The Spore Golem lets out a rumble of laughter, offering you a glowing flower from its shoulder. Mushroom Valley is once again a glowing, whimsical wonderland."
  ],
  star_observatory: [
    "Reach the grand copper dome of the Star Observatory on the highest peak. A thick, dark cosmic fog has blanketed the night sky, hiding the beautiful constellations.",
    "Let your typing realign the massive brass gears of the stellar telescope. Type with absolute focus to clear the rust and allow the lenses to slide into perfect place.",
    "The Scholar Owl, guardian of the celestial map, rests on the brass dome, blinded by a cosmic eclipse. Let us type starlight runes to restore its deep purple vision.",
    "A brilliant beam of concentrated light ignites inside the dome, shooting high into the dark sky. The heavy cosmic haze parts in a perfect, wide circle of clean space.",
    "Breathtaking constellations of golden stars, violet nebulae, and twin dancing auroras appear in the clear sky, reflecting in the glass panels of the observatory.",
    "The ancient charts on the walls begin to glow, mapping the safe pathways through the solar systems. The heavy metal telescope hums with quiet planetary power.",
    "Small mechanical star-fairies buzz around the telescope, polishing the brass wheels and singing old space shanties that fill the dome with cozy cosmic warmth.",
    "The Scholar Owl lets out a wise hoot, its starry wings flapping as it takes flight into the aurora-filled sky. The gates to the cosmos are wide open once more."
  ],
  ancient_library: [
    "Step into the grand cathedrals of the Ancient Library, where books fly on paper wings. Under a shadow curse, the ink is fading, leaving pages blank and silent.",
    "Type each word to restock the library with beautiful, glowing stories. Watch the blank sheets fill with elegant handwritten scripts and colorful illustrations of old.",
    "The Book Wyrm, a dragon made of floating parchment sheets, circles the central archive in distress. Type with deep focus to heal the burning embers on its pages.",
    "Lush green ivy races up the wooden bookshelves, blooming with white star-flowers that fill the grand reading halls with the scent of old books and spring.",
    "Glowing alphabets float in the air, swirling into the open books like fireflies finding their homes. The books fly happily in organized patterns around the high arches.",
    "Cozy reading nooks light up with warm, amber gas-lamps. The heavy wooden tables gleam under the soft light, welcoming scholars back to the restored memory vaults.",
    "The great central tree, whose roots drink ink and leaves grow pages, shudders with joy, spreading a fresh, crisp aroma of parchment and cedar through the halls.",
    "The Book Wyrm lands peacefully, folding its parchment wings and offering you a glowing pen of golden ink. The library's memory is safe for eternity."
  ]
};
