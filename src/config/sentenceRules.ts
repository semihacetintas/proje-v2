/**
 * PicSay - AI Cümle Üretim Kuralları ve Doğrulama Motoru (Sentence Rules Config)
 * Bütün Daily ve Unlimited AI cümlelerinin uyması gereken kesin standartlar.
 */

export interface SentenceRulesConfig {
  exactWordCount: number;
  minWordLength: number;
  maxWordLength: number;
  forbiddenWords: string[];
  grammarStructure: string;
  tone: string;
}

export const PICSAY_SENTENCE_RULES: SentenceRulesConfig = {
  exactWordCount: 5,
  minWordLength: 3,
  maxWordLength: 8,
  forbiddenWords: [
    'A', 'AN', 'THE', 'IN', 'ON', 'AT', 'TO', 'OF', 'BY', 'FOR', 'WITH', 'FROM', 'IS', 'AM', 'ARE'
  ],
  grammarStructure: 'Subject + Verb + Object + Preposition/Action + Place (Strictly 5 words)',
  tone: 'Absurd, Surreal, Visual, Fun, Family-Friendly (No NSFW, No Violence)',
};

/**
 * PicSay Canlı Sürüm Resmi AI Görsel Üretim Sanat Tarzı (3D Pixar)
 * TÜM görsel üretim çağrıları (server.ts) bu tek tanımı kullanmalı.
 */
export const OFFICIAL_IMAGE_STYLE = {
  id: '3d_pixar',
  name: '3D Pixar Animation Style',
  promptSuffix: '3D Pixar-style animated character render, centered full-body character, bright cheerful studio lighting, vivid saturated colors, soft rounded shapes, crisp clean focus, high-detail 3D CGI illustration, family-friendly',
};

export function buildVisualPrompt(sceneDescription: string): string {
  return `${sceneDescription.trim()}. ${OFFICIAL_IMAGE_STYLE.promptSuffix}. The main character must be fully visible, centered, and clearly holding or interacting with the key object from the scene. Wide shot, clean composition, no text or logos in the image.`;
}

const SENTENCE_EXAMPLE_BANK: string[] = [
  'ROBOT CARRIES BALLOONS ACROSS DESERT',
  'PENGUIN PAINTS SUNFLOWER INSIDE SUBWAY',
  'ASTRONAUT BAKES PIZZA ONTO MOON',
  'OCTOPUS DRIVES TRACTOR THROUGH FOREST',
  'WIZARD PLANTS CACTUS UNDER WATERFALL',
  'TURTLE READS NEWSPAPER ATOP MOUNTAIN',
  'CHEF GRILLS SANDWICH BESIDE VOLCANO',
  'BEAVER BUILDS SANDCASTLE NEXT LIGHTHOUSE',
  'DRAGON WATERS TULIPS WITHIN GREENHOUSE',
  'PIRATE FISHES TROPHY BENEATH ICEBERG',
  'RABBIT REPAIRS BICYCLE OUTSIDE CASTLE',
  'ZEBRA PAINTS FENCE AROUND FARMHOUSE',
  'MONKEY WASHES ELEPHANT DURING RAINSTORM',
  'KOALA SORTS LETTERS WITHIN POSTOFFICE',
  'SLOTH KNITS SWEATER BEFORE FIREPLACE',
  'HIPPO SELLS LEMONADE ALONG BOARDWALK',
  'FOX DELIVERS PACKAGE THROUGH BLIZZARD',
  'BEAR COLLECTS SEASHELLS ALONG SHORELINE',
  'ROBOTS BUTTER TOAST INSIDE VOLCANO',
  'WIZARDS POLISH MIRRORS BEHIND CASTLE',
  'ALIENS PLANT CARROTS ACROSS CRATERS',
  'PIRATES VACUUM CARPETS UNDER ICEBERGS',
  'SPACEMEN JUGGLE MELONS AROUND PLANETS',
  'NINJAS SCRAMBLE EGGS ATOP TOWERS',
  'CHEFS IRON PANCAKES BESIDE GLACIERS',
  'STATUES SIP LEMONADE INSIDE MUSEUMS',
  'GHOSTS FOLD BLANKETS NEAR WINDMILL',
  'KNIGHTS PAINT TEAPOTS ACROSS DUNGEONS',
  'CLOWNS WASH SCOOTERS UNDER BRIDGES',
  'MONSTERS BAKE MUFFINS INSIDE KITCHEN',
  'GNOMES STEER AIRSHIPS ABOVE FOREST',
  'DOCTORS TOSS DONUTS BEHIND PYRAMIDS',
  'DOLLS KNIT SWEATERS BESIDE CANYONS',
  'GIANTS BLOW BUBBLES ATOP MOUNTAIN',
  'DANCERS CATCH COMETS AROUND ORBIT',
  'MINERS FRY WAFFLES INSIDE CAVERNS',
  'CYBORGS FLY KITES ACROSS DESERT',
  'SAILORS PLAY VIOLINS UNDER RAINBOW',
];

function pickRandomExamples(count: number): string[] {
  const shuffled = [...SENTENCE_EXAMPLE_BANK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const VERB_INSPIRATION_BANK: string[] = [
  'BUTTERS', 'POLISHES', 'VACUUMS', 'JUGGLES', 'SCRAMBLES', 'IRONS', 'SIPS',
  'FOLDS', 'TOSSES', 'KNITS', 'BLOWS', 'CATCHES', 'FRIES', 'STEERS', 'SHUFFLES',
  'STACKS', 'DUSTS', 'MOPS', 'SNIPS', 'GLUES', 'TAPES', 'STITCHES', 'CARVES',
  'SCRUBS', 'SPINS', 'STIRS', 'WHISKS', 'PEELS', 'TUNES', 'WRAPS', 'ROLLS',
  'TICKLES', 'CHASES', 'BALANCES', 'TRAINS', 'FEEDS', 'BRUSHES', 'STAMPS',
  'PARKS', 'PADDLES', 'PEDALS', 'FLOATS', 'HAMMERS', 'SCREWS', 'BOLTS',
  'CARRIES', 'DRIVES', 'PLANTS', 'PAINTS', 'BUILDS', 'WASHES', 'COOKS', 'BAKES',
  'GRILLS', 'READS', 'WRITES', 'DRAWS', 'SKETCHES', 'SCULPTS', 'WEAVES', 'SEWS',
  'REPAIRS', 'FIXES', 'CLEANS', 'SWEEPS', 'RINSES', 'DRAINS', 'FILLS', 'PUMPS',
  'PUSHES', 'PULLS', 'LIFTS', 'DRAGS', 'THROWS', 'CATCHES', 'KICKS', 'PUNCHES',
  'HUGS', 'WAVES', 'POINTS', 'CLAPS', 'DANCES', 'SINGS', 'HUMS', 'WHISTLES',
  'PLUCKS', 'STRUMS', 'BEATS', 'TAPS', 'CLICKS', 'ZOOMS', 'RACES', 'SPLASHES',
  'SWIMS', 'DIVES', 'SURFS', 'SKATES', 'SKIS', 'CLIMBS', 'CREEPS', 'CRAWLS',
  'HOPS', 'JUMPS', 'LEAPS', 'SPRINGS', 'BOUNCES', 'ROLLS', 'SLIDES', 'GLIDES',
  'FLIES', 'SOARS', 'LANDS', 'CRASHES', 'BREAKS', 'SMASHES', 'CRACKS', 'OPENS',
  'CLOSES', 'LOCKS', 'UNLOCKS', 'HIDES', 'FINDS', 'SEARCHES', 'DIGS', 'BURIES',
  'GATHERS', 'COLLECTS', 'SORTS', 'COUNTS', 'MEASURES', 'WEIGHS', 'CUTS', 'SLICES',
  'CHOPS', 'DICES', 'MIXES', 'BLENDS', 'POURS', 'SPILLS', 'DRIPS', 'DRIZZLES',
  'SPRINKLES', 'SPREADS', 'SLATHERS', 'SLATHER', 'RUBS', 'POLISHES', 'SHINES',
  'WAXES', 'OILS', 'GREASES', 'LUBES', 'WATERS', 'HARVESTS', 'PICKS', 'PLUCKS',
  'GROWS', 'TRIMS', 'PRUNES', 'MOWS', 'RAKES', 'HOES', 'TILLS', 'SOWS',
  'DELIVERS', 'DELIVERS', 'SHIPS', 'LOADS', 'UNLOADS', 'PACKS', 'UNPACKS',
  'WRAPS', 'UNWRAPS', 'TIES', 'UNTIES', 'KNOTS', 'LOOSENS', 'TIGHTENS', 'LOOSENS',
];

function pickVerbHints(count: number): string[] {
  const shuffled = [...VERB_INSPIRATION_BANK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const SUBJECT_BANK: string[] = [
  'ROBOT', 'WIZARD', 'PIRATE', 'KNIGHT', 'CHEF', 'NURSE', 'BARBER', 'CLOWN',
  'VIKING', 'SAMURAI', 'NINJA', 'ALIEN', 'GNOME', 'TROLL', 'MERMAID', 'FAIRY',
  'PIXIE', 'DRUID', 'MONK', 'SAILOR', 'RANGER', 'SCOUT', 'BAKER', 'TAILOR',
  'MINER', 'DIVER', 'SURFER', 'SKATER', 'SINGER', 'DANCER', 'ACTOR', 'POET',
  'ARTIST', 'PAINTER', 'FARMER', 'HUNTER', 'FISHER', 'WAITER', 'DRIVER', 'GARDENER',
  'FLORIST', 'BARISTA', 'BUILDER', 'PLUMBER', 'MECHANIC', 'PILOT', 'JESTER', 'GHOST',
  'GIANT', 'DWARF', 'PENGUIN', 'OCTOPUS', 'DOLPHIN', 'WALRUS', 'PARROT', 'TOUCAN',
  'FLAMINGO', 'PEACOCK', 'OSTRICH', 'GIRAFFE', 'ZEBRA', 'HIPPO', 'RHINO', 'CAMEL',
  'LLAMA', 'PANDA', 'KOALA', 'SLOTH', 'BEAVER', 'OTTER', 'FERRET', 'RABBIT',
  'HAMSTER', 'MOLE', 'BADGER', 'COYOTE', 'JACKAL', 'HYENA', 'LEMUR', 'BISON',
  'MOOSE', 'DEER', 'FOX', 'WOLF', 'BEAR', 'LION', 'TIGER', 'JAGUAR', 'LEOPARD',
  'CHEETAH', 'PANTHER', 'MONKEY', 'TURTLE', 'EAGLE', 'HAWK', 'FALCON', 'RAVEN',
  'SPIDER', 'LIZARD', 'GECKO', 'SNAKE', 'FROG', 'TOAD', 'CRAB', 'LOBSTER',
  'UNICORN', 'DRAGON', 'PHOENIX', 'GRIFFIN', 'CENTAUR', 'CYCLOPS', 'STATUE', 'DOLL',
  'PUPPET', 'CYBORG', 'ANDROID', 'COWBOY', 'MAGICIAN', 'SCIENTIST', 'INVENTOR',
  'DETECTIVE', 'ASTRONAUT', 'LUMBERJACK', 'JUGGLER', 'ACROBAT', 'CLOWN', 'MIMIC',
  'BUTLER', 'MAID', 'GUARD', 'HERO', 'HEROINE', 'PRINCE', 'PRINCESS', 'KING',
  'QUEEN', 'DUKE', 'BARON', 'COUNT', 'LORD', 'LADY', 'SAGE', 'ORACLE', 'PROPHET',
  'SHAMAN', 'WITCH', 'WARLOCK', 'SORCERER', 'ENCHANTER', 'ALCHEMIST', 'SCOUT',
];

/** Nesne havuzu — kesilmiş/bozuk kelimeler temizlendi (3–8 harf) */
const OBJECT_BANK: string[] = [
  'BALLOON', 'BALLOONS', 'UMBRELLA', 'BACKPACK', 'SUITCASE', 'HAMMER', 'WRENCH',
  'LADDER', 'SHOVEL', 'BUCKET', 'BASKET', 'CRATE', 'TRUNK', 'CHEST', 'CROWN',
  'SWORD', 'SHIELD', 'HELMET', 'GLOVES', 'SCARF', 'BLANKET', 'PILLOW', 'LAMP',
  'CANDLE', 'TORCH', 'LANTERN', 'MIRROR', 'TROPHY', 'MEDAL', 'FLAG', 'BANNER',
  'KITE', 'COMET', 'METEOR', 'PLANET', 'ROCKET', 'SCOPE', 'CAMERA', 'RADIO',
  'GUITAR', 'VIOLIN', 'DRUMS', 'FLUTE', 'TRUMPET', 'PIANO', 'HARP', 'CLOCK',
  'COMPASS', 'GLOBE', 'PUZZLE', 'DICE', 'CARDS', 'CHESS', 'BOOK', 'SCROLL',
  'LETTER', 'ENVELOPE', 'STAMP', 'KEY', 'LOCK', 'BOTTLE', 'JUG', 'PITCHER',
  'MUG', 'CUP', 'BOWL', 'PLATE', 'SPOON', 'FORK', 'KNIFE', 'PAN', 'POT',
  'OVEN', 'TOASTER', 'WAFFLE', 'PANCAKE', 'DONUT', 'MUFFIN', 'COOKIE', 'CAKE',
  'PIZZA', 'BURGER', 'TACO', 'SUSHI', 'NOODLE', 'SOUP', 'SALAD', 'SANDWICH',
  'TOAST', 'BREAD', 'BUTTER', 'HONEY', 'LEMON', 'MELON', 'APPLE', 'BANANA',
  'CHERRY', 'GRAPE', 'MANGO', 'PEACH', 'CARROT', 'TULIP', 'ROSE', 'DAISY',
  'CACTUS', 'BONSAI', 'SEED', 'FLOWER', 'BUBBLE', 'TEDDY', 'BLOCKS', 'TRAIN',
  'PLANE', 'BOAT', 'CANOE', 'KAYAK', 'SCOOTER', 'SKATES', 'BICYCLE', 'WAGON',
  'CART', 'WHEEL', 'TIRE', 'ENGINE', 'MOTOR', 'BATTERY', 'CABLE', 'WIRE',
  'ROPE', 'CHAIN', 'ANCHOR', 'SAIL', 'OAR', 'PADDLE', 'NET', 'HOOK', 'BAIT',
  'FISH', 'CORAL', 'SHELL', 'PEARL', 'GEM', 'RUBY', 'CRYSTAL', 'STONE', 'ROCK',
  'BOULDER', 'SNOWMAN', 'IGLOO', 'SLED', 'SKIS', 'RAFT', 'TENT', 'HOTDOG',
  'POPCORN', 'CANDY', 'LOLLIPOP', 'ICECREAM', 'PALETTE', 'EASEL', 'CANVAS',
  'CRAYON', 'PENCIL', 'ERASER', 'RULER', 'SCISSORS', 'STAPLER', 'TAPE', 'GLUE',
  'PAPER', 'ORIGAMI', 'PINWHEEL', 'WHISTLE', 'BELL', 'HORN',
  'SUNFLOWER', 'SANDCASTLE', 'CAMPFIRE', 'MARSHMALLOW',
  'PAINTBRUSH', 'MEGAPHONE', 'TELEPHONE', 'PHONE', 'MICROPHONE',
  'TELEVISION', 'COMPUTER', 'TABLET', 'KEYBOARD', 'MOUSEPAD',
  'HEADPHONES', 'SPEAKER', 'MICROSCOPE', 'TELESCOPE',
  'BINOCULAR', 'FLASHLIGHT', 'LANTERN', 'CANDLE', 'LANTERN',
];

/** Edat havuzu — kesilmiş/bozuk kelimeler temizlendi (3–8 harf) */
const PREPOSITION_BANK: string[] = [
  'ACROSS', 'THROUGH', 'BESIDE', 'BEHIND', 'BEFORE', 'WITHIN', 'UNDER', 'OVER',
  'ABOVE', 'BELOW', 'NEAR', 'PAST', 'INTO', 'OUTSIDE', 'INSIDE', 'AMONG',
  'ALONG', 'AROUND', 'BEYOND', 'BENEATH', 'BETWEEN', 'WITHOUT', 'AGAINST',
  'TOWARD', 'TOWARDS', 'DURING', 'AFTER', 'UNTIL',
  'SINCE', 'WHILE', 'NEARBY', 'ATOP', 'ONTO', 'DOWN', 'AWAY',
  'VIA', 'USING', 'CLOSE', 'NEXT', 'PAST', 'BELOW', 'ABOVE', 'UNDER',
];

/** Yer havuzu — kesilmiş/bozuk kelimeler temizlendi (3–8 harf) */
const PLACE_BANK: string[] = [
  'DESERT', 'FOREST', 'JUNGLE', 'MEADOW', 'VALLEY', 'CANYON', 'GORGE', 'CLIFF',
  'BEACH', 'SHORE', 'COAST', 'ISLAND', 'REEF', 'LAGOON', 'SWAMP', 'MARSH',
  'TUNDRA', 'GLACIER', 'VOLCANO', 'CRATER', 'CAVE', 'CAVERN', 'GROTTO', 'RUINS',
  'TEMPLE', 'SHRINE', 'MOSQUE', 'CHURCH', 'CHAPEL', 'CASTLE', 'TOWER', 'DUNGEON',
  'PALACE', 'MANSION', 'COTTAGE', 'CABIN', 'LODGE', 'HOTEL', 'MOTEL', 'GARAGE',
  'ATTIC', 'CELLAR', 'BASEMENT', 'ROOFTOP', 'BALCONY', 'PATIO', 'PORCH', 'GARDEN',
  'ORCHARD', 'VINEYARD', 'FARM', 'BARN', 'STABLE', 'CORRAL', 'RANCH', 'MARKET',
  'BAZAAR', 'PLAZA', 'SQUARE', 'STREET', 'ALLEY', 'ROAD', 'HIGHWAY', 'BRIDGE',
  'TUNNEL', 'SUBWAY', 'STATION', 'AIRPORT', 'HARBOR', 'DOCK', 'PIER', 'WHARF',
  'BEACON', 'MUSEUM', 'GALLERY', 'LIBRARY', 'SCHOOL', 'COLLEGE', 'CAMPUS', 'STADIUM',
  'ARENA', 'STAGE', 'STUDIO', 'KITCHEN', 'BAKERY', 'DINER', 'BOOTH', 'OFFICE',
  'FACTORY', 'WORKSHOP', 'SHOP', 'STORE', 'CLOSET', 'PANTRY', 'FREEZER', 'FORGE',
  'FOUNDRY', 'MILL', 'MINE', 'QUARRY', 'ZOO', 'AQUARIUM', 'PLANET', 'MOON',
  'COMET', 'NEBULA', 'GALAXY', 'ORBIT', 'SPACE', 'SKY', 'CLOUD', 'STORM',
  'RAINBOW', 'SUNSET', 'SUNRISE', 'DAWN', 'DUSK', 'NIGHT', 'MIDNIGHT', 'NOON',
  'MOUNTAIN', 'HILL', 'PEAK', 'SUMMIT', 'RIDGE', 'PLATEAU', 'BASIN', 'DELTA',
  'WATERFALL', 'RIVER', 'STREAM', 'CREEK', 'BROOK', 'POND', 'LAKE', 'OCEAN',
  'SEA', 'BAY', 'GULF', 'STRAIT', 'CHANNEL', 'MARINA', 'WINDMILL',
  'GREENHOUSE', 'PLAYGROUND', 'PARK', 'FIELD', 'COURTYARD', 'FOYER', 'LOBBY',
  'HALLWAY', 'CORRIDOR', 'STAIRWAY', 'ELEVATOR', 'ESCALATOR', 'PLATFORM',
  'DOCKYARD', 'SHIPYARD', 'HANGAR', 'BUNKER', 'ARCADE',
  'THEATRE', 'CINEMA', 'CONCERT', 'FESTIVAL', 'CARNIVAL', 'FAIR', 'CIRCUS',
  'TENT', 'CAMP', 'CAMPSITE', 'TRAIL', 'PATH', 'WOODS', 'GROVE', 'GLADE',
  'CLEARING', 'WETLAND', 'SAHARA', 'ARCTIC', 'TROPICS', 'EQUATOR',
  'PYRAMID', 'SPHINX', 'COLOSSEUM', 'LAB', 'CLINIC', 'HOSPITAL',
  'PHARMACY', 'DINER', 'BAKERY', 'BOUTIQUE', 'SHOWROOM', 'BARN',
  'POSTOFFICE', 'FIREHOUSE', 'COURTHOUSE',
  'CATHEDRAL', 'MONASTERY', 'OBSERVATORY',
  'PLANETARIUM', 'AQUARIUM', 'GREENHOUSE', 'BOARDWALK',
  'LIGHTHOUSE', 'WATERFALL', 'RAINFOREST', 'GRASSLAND',
  'SNOWFIELD', 'ICEBERG', 'ICECAP', 'GLACIER', 'OASIS',
];

function filterValidWords(words: string[]): string[] {
  const seen = new Set<string>();
  return words
    .map((w) => w.trim().toUpperCase())
    .filter((w) => {
      if (!w || w.length < 3 || w.length > 8) return false;
      if (PICSAY_SENTENCE_RULES.forbiddenWords.includes(w)) return false;
      if (seen.has(w)) return false;
      seen.add(w);
      return true;
    });
}

const SUBJECTS = filterValidWords(SUBJECT_BANK);
const OBJECTS = filterValidWords(OBJECT_BANK);
const PREPOSITIONS = filterValidWords(PREPOSITION_BANK);
const PLACES = filterValidWords(PLACE_BANK);
const VERBS = filterValidWords(VERB_INSPIRATION_BANK);

function pickFromBank(bank: string[], avoid: string[]): string {
  const avoidSet = new Set(avoid.map((w) => w.toUpperCase()));
  const fresh = bank.filter((w) => !avoidSet.has(w));
  const pool = fresh.length > 0 ? fresh : bank;
  return pool[Math.floor(Math.random() * pool.length)];
}

const recentSubjects: string[] = [];
const recentVerbs: string[] = [];
const recentObjects: string[] = [];
const recentPrepositions: string[] = [];
const recentPlaces: string[] = [];
const RECENT_WORD_LIMIT = 15;

function pushLimited(list: string[], word: string, limit: number) {
  if (!word) return;
  list.push(word.toUpperCase());
  if (list.length > limit) list.shift();
}

function rememberSentence(sentence: string) {
  const words = sentence.trim().split(' ').filter(Boolean);
  if (words.length !== 5) return;
  pushLimited(recentSubjects, words[0], RECENT_WORD_LIMIT);
  pushLimited(recentVerbs, words[1], RECENT_WORD_LIMIT);
  pushLimited(recentObjects, words[2], RECENT_WORD_LIMIT);
  pushLimited(recentPrepositions, words[3], RECENT_WORD_LIMIT);
  pushLimited(recentPlaces, words[4], RECENT_WORD_LIMIT);
}

export function composeRandomSentence(maxAttempts = 60): string | null {
  const recentAll = [
    ...recentSubjects,
    ...recentVerbs,
    ...recentObjects,
    ...recentPrepositions,
    ...recentPlaces,
  ];

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const usedInSentence: string[] = [];
    const subject = pickFromBank(SUBJECTS, [...recentAll, ...usedInSentence]);
    usedInSentence.push(subject);
    const verb = pickFromBank(VERBS, [...recentAll, ...usedInSentence]);
    usedInSentence.push(verb);
    const object = pickFromBank(OBJECTS, [...recentAll, ...usedInSentence]);
    usedInSentence.push(object);
    const prep = pickFromBank(PREPOSITIONS, [...recentAll, ...usedInSentence]);
    usedInSentence.push(prep);
    const place = pickFromBank(PLACES, [...recentAll, ...usedInSentence]);

    const sentence = [subject, verb, object, prep, place].join(' ');
    const validation = validateSentenceRules(sentence);
    if (validation.isValid) {
      rememberSentence(validation.cleanSentence);
      return validation.cleanSentence;
    }
  }

  return null;
}

export function buildSceneDescriptionFromSentence(sentence: string): string {
  const words = sentence.trim().split(' ').filter(Boolean);
  if (words.length !== 5) return sentence;

  const [subject, verb, object, prep, place] = words.map((w) => w.toLowerCase());
  return `A ${subject} ${verb} a ${object} ${prep} a ${place}.`;
}

function buildWordInspirationHint(): string {
  const subject = pickFromBank(SUBJECTS, recentSubjects);
  const verb = pickFromBank(VERBS, recentVerbs);
  const object = pickFromBank(OBJECTS, recentObjects);
  const prep = pickFromBank(PREPOSITIONS, recentPrepositions);
  const place = pickFromBank(PLACES, recentPlaces);

  return `Invent a NEW sentence — use fresh words like these for inspiration (do NOT copy verbatim unless it passes all rules): Subject="${subject}", Verb="${verb}", Object="${object}", Preposition="${prep}", Place="${place}".`;
}

export interface SentenceValidationResult {
  isValid: boolean;
  errors: string[];
  cleanSentence: string;
  wordCount: number;
  words: string[];
}

export function validateSentenceRules(sentence: string): SentenceValidationResult {
  const errors: string[] = [];
  const cleanSentence = sentence.trim().toUpperCase().replace(/\s+/g, ' ');
  const words = cleanSentence.split(' ').filter(Boolean);

  if (!/^[A-Z ]+$/.test(cleanSentence)) {
    errors.push('Cümle sadece A-Z İngilizce harfler ve boşluk içermelidir (Noktalama, rakam veya özel karakter yasak).');
  }

  if (words.length !== 5) {
    errors.push(`Cümle KESİNLİKLE 5 kelimeden oluşmalıdır (Mevcut: ${words.length} kelime).`);
  }

  for (const word of words) {
    if (word.length < 3) {
      errors.push(`'${word}' kelimesi çok kısa (En az 3 harfli anlamsal kelimeler kullanılmalıdır. 'A', 'IN', 'ON' gibi kısa bağlaçlar yasaktır).`);
    }
    if (word.length > 8) {
      errors.push(`'${word}' kelimesi çok uzun (Ekrana sığması için en fazla 8 harf olmalıdır).`);
    }
    if (PICSAY_SENTENCE_RULES.forbiddenWords.includes(word)) {
      errors.push(`'${word}' kelimesi yasaklı makale/bağlaç listesindedir. Sadece anlamlı anahtar kelimeler kullanılmalıdır.`);
    }
  }

  const uniqueWords = new Set(words);
  if (uniqueWords.size !== words.length) {
    errors.push('Cümle içinde aynı kelime birden fazla kez tekrarlanamaz.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanSentence,
    wordCount: words.length,
    words,
  };
}

export function buildAISentenceRulesPrompt(): string {
  const examples = pickRandomExamples(4);
  const examplesText = examples.map((s, i) => `   - Example ${i + 1}: "${s}" (5 words)`).join('\n');
  const verbHints = pickVerbHints(6).join(', ');
  const inspirationHint = buildWordInspirationHint();

  const avoidParts: string[] = [];
  if (recentSubjects.length > 0) {
    avoidParts.push(`Do NOT reuse these recent subjects: ${recentSubjects.join(', ')}.`);
  }
  if (recentVerbs.length > 0) {
    avoidParts.push(`Do NOT reuse these recent verbs: ${recentVerbs.join(', ')}.`);
  }
  if (recentObjects.length > 0) {
    avoidParts.push(`Do NOT reuse these recent objects: ${recentObjects.join(', ')}.`);
  }
  if (recentPrepositions.length > 0) {
    avoidParts.push(`Do NOT reuse these recent prepositions: ${recentPrepositions.join(', ')}.`);
  }
  if (recentPlaces.length > 0) {
    avoidParts.push(`Do NOT reuse these recent places: ${recentPlaces.join(', ')}. Mix indoor/outdoor, natural/man-made — avoid defaulting to volcanoes, mountains, deserts, forests.`);
  }

  const avoidText =
    avoidParts.length > 0
      ? `\n9. VARIETY (CRITICAL): ${avoidParts.join(' ')} Every slot must feel fresh — new character, new action, new object, new preposition, new place.`
      : '';

  return `
STRICT SENTENCE GENERATION RULES FOR PICSAY:
1. EXACT WORD COUNT: The sentence MUST contain EXACTLY 5 words.
2. NO SHORT ARTICLES/PREPOSITIONS: Do NOT use 1-letter or 2-letter filler words like 'A', 'AN', 'THE', 'IN', 'ON', 'AT', 'TO', 'OF', 'IS', 'FROM', 'FOR', 'WITH', 'BY'.
3. WORD LENGTH: Every word MUST be between 3 and 8 English uppercase letters (A-Z only, no punctuation, no numbers).
4. GRAMMAR STRUCTURE: Subject (Noun) + Action (Verb) + Target (Noun) + Modifier/Preposition + Context/Place (Noun).
${examplesText}
   - These examples are ONLY for grammar shape reference — do NOT reuse their subjects, verbs, objects, or places.
5. SURREAL & ABSURD TONE: Sentences MUST describe unusual, highly visual, absurd, memorable, and fun scenes that can be drawn as an image.
6. SAFETY & NSFW: Absolutely family-friendly, G-rated, no violence, no gore, no adult content.
7. NO REPEATED WORDS: All 5 words must be unique within the sentence.
8. WORD INSPIRATION: Consider verbs like: ${verbHints}. ${inspirationHint}${avoidText}
  `.trim();
}

export function registerGeneratedSentence(sentence: string) {
  rememberSentence(sentence);
}
