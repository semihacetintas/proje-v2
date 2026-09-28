/**
 * PicSentence Veri Seti (Sample Challenges)
 * 
 * Staj Notu: Tüm cümleler SIKICA belirtilen dilbilgisi kuralına uygundur:
 * Formula: Subject + Verb + Object + Preposition + Place
 * Örnek: "ROBOT CARRIES BALLOONS ACROSS DESERT"
 */

import { SentenceChallenge } from "./types";

export const SAMPLE_CHALLENGES: SentenceChallenge[] = [
  {
    id: "sc-1",
    targetSentence: "ROBOT CARRIES BALLOONS ACROSS DESERT",
    targetWords: ["ROBOT", "CARRIES", "BALLOONS", "ACROSS", "DESERT"],
    imageUrl: "https://image.pollinations.ai/prompt/a%20friendly%20silver%20robot%20carrying%20bright%20colorful%20balloons%20walking%20across%20a%20sunny%20sandy%20desert,%20vibrant%20digital%20vector%20art%20illustration,%20clean%20composition?width=800&height=800&seed=101&nologo=true",
    visualPrompt: "A robot carrying colorful balloons across a vast desert."
  },
  {
    id: "sc-2",
    targetSentence: "PIRATE COOKS SOUP INSIDE CASTLE",
    targetWords: ["PIRATE", "COOKS", "SOUP", "INSIDE", "CASTLE"],
    imageUrl: "https://image.pollinations.ai/prompt/a%20bearded%20pirate%20cooking%20hot%20soup%20in%20a%20large%20pot%20inside%20a%20stone%20castle,%20vibrant%20digital%20vector%20art%20illustration?width=800&height=800&seed=202&nologo=true",
    visualPrompt: "A pirate cooking hot soup inside a stone castle."
  },
  {
    id: "sc-3",
    targetSentence: "MONKEY RIDES BICYCLE THROUGH FOREST",
    targetWords: ["MONKEY", "RIDES", "BICYCLE", "THROUGH", "FOREST"],
    imageUrl: "https://image.pollinations.ai/prompt/a%20cheerful%20monkey%20riding%20a%20red%20bicycle%20through%20a%20dense%20green%20forest,%20vibrant%20digital%20vector%20art%20illustration?width=800&height=800&seed=303&nologo=true",
    visualPrompt: "A monkey riding a red bicycle through a green forest."
  },
  {
    id: "sc-4",
    targetSentence: "ASTRONAUT PLANTS FLOWERS NEAR ROCKET",
    targetWords: ["ASTRONAUT", "PLANTS", "FLOWERS", "NEAR", "ROCKET"],
    imageUrl: "https://image.pollinations.ai/prompt/an%20astronaut%20in%20a%20white%20spacesuit%20planting%20colorful%20flowers%20in%20the%20ground%20near%20a%20tall%20space%20rocket,%20vibrant%20digital%20vector%20art%20illustration?width=800&height=800&seed=404&nologo=true",
    visualPrompt: "An astronaut planting colorful flowers on the ground near a space rocket."
  },
  {
    id: "sc-5",
    targetSentence: "CAT DRINKS MILK BESIDE CHAIR",
    targetWords: ["CAT", "DRINKS", "MILK", "BESIDE", "CHAIR"],
    imageUrl: "https://image.pollinations.ai/prompt/an%20orange%20cat%20drinking%20a%20bowl%20of%20white%20milk%20while%20sitting%20beside%20a%20wooden%20chair,%20vibrant%20digital%20vector%20art%20illustration?width=800&height=800&seed=505&nologo=true",
    visualPrompt: "An orange cat drinking milk from a bowl beside a wooden chair."
  },
  {
    id: "sc-6",
    targetSentence: "DOG CHASES BALL ACROSS PARK",
    targetWords: ["DOG", "CHASES", "BALL", "ACROSS", "PARK"],
    imageUrl: "https://image.pollinations.ai/prompt/a%20happy%20dog%20chasing%20a%20bright%20yellow%20tennis%20ball%20across%20a%20green%20sunny%20park,%20vibrant%20digital%20vector%20art%20illustration?width=800&height=800&seed=606&nologo=true",
    visualPrompt: "A happy dog chasing a yellow ball across a green park."
  },
  {
    id: "sc-7",
    targetSentence: "GIRL READS BOOK INSIDE ROOM",
    targetWords: ["GIRL", "READS", "BOOK", "INSIDE", "ROOM"],
    imageUrl: "https://image.pollinations.ai/prompt/a%20young%20girl%20reading%20a%20large%20open%20book%20inside%20a%20cozy%20illuminated%20room,%20vibrant%20digital%20vector%20art%20illustration?width=800&height=800&seed=707&nologo=true",
    visualPrompt: "A young girl reading a book inside a cozy room."
  },
  {
    id: "sc-8",
    targetSentence: "WIZARD READS SPELL INSIDE TOWER",
    targetWords: ["WIZARD", "READS", "SPELL", "INSIDE", "TOWER"],
    imageUrl: "https://image.pollinations.ai/prompt/an%20old%20wise%20wizard%20reading%20a%20glowing%20magic%20spell%20book%20inside%20a%20tall%20stone%20tower,%20vibrant%20digital%20vector%20art%20illustration?width=800&height=800&seed=808&nologo=true",
    visualPrompt: "A wise wizard reading a glowing spell book inside a stone tower."
  },
  {
    id: "sc-9",
    targetSentence: "BEAR EATS HONEY UNDER TREE",
    targetWords: ["BEAR", "EATS", "HONEY", "UNDER", "TREE"],
    imageUrl: "https://image.pollinations.ai/prompt/a%20friendly%20brown%20bear%20eating%20sweet%20golden%20honey%20from%20a%20jar%20sitting%20under%20a%20large%20oak%20tree,%20vibrant%20digital%20vector%20art%20illustration?width=800&height=800&seed=909&nologo=true",
    visualPrompt: "A brown bear eating honey under a green tree."
  },
  {
    id: "sc-10",
    targetSentence: "CHEF BAKES PIZZA INSIDE KITCHEN",
    targetWords: ["CHEF", "BAKES", "PIZZA", "INSIDE", "KITCHEN"],
    imageUrl: "https://image.pollinations.ai/prompt/a%20happy%20chef%20wearing%20a%20tall%20white%20hat%20baking%20a%20delicious%20hot%20pizza%20inside%20a%20warm%20kitchen,%20vibrant%20digital%20vector%20art%20illustration?width=800&height=800&seed=1010&nologo=true",
    visualPrompt: "A chef baking a delicious pizza inside a bright kitchen."
  },
  {
    id: "sc-11",
    targetSentence: "DRAGON BREATHES FIRE ABOVE MOUNTAIN",
    targetWords: ["DRAGON", "BREATHES", "FIRE", "ABOVE", "MOUNTAIN"],
    imageUrl: "https://image.pollinations.ai/prompt/a%20majestic%20green%20dragon%20breathing%20bright%20red%20fire%20flying%20high%20above%20a%20snowy%20mountain,%20vibrant%20digital%20vector%20art%20illustration?width=800&height=800&seed=1111&nologo=true",
    visualPrompt: "A dragon breathing fire above a snowy mountain."
  },
  {
    id: "sc-12",
    targetSentence: "PENGUIN CATCHES FISH ATOP ICE",
    targetWords: ["PENGUIN", "CATCHES", "FISH", "ATOP", "ICE"],
    imageUrl: "https://image.pollinations.ai/prompt/a%20cute%20penguin%20catching%20a%20shiny%20silver%20fish%20standing%20atop%20white%20arctic%20ice,%20vibrant%20digital%20vector%20art%20illustration?width=800&height=800&seed=1212&nologo=true",
    visualPrompt: "A penguin catching a shiny fish atop snowy arctic ice."
  },
  {
    id: "sc-13",
    targetSentence: "ROBOT PLAYS GUITAR ATOP STAGE",
    targetWords: ["ROBOT", "PLAYS", "GUITAR", "ATOP", "STAGE"],
    imageUrl: "https://image.pollinations.ai/prompt/a%20cool%20futuristic%20robot%20playing%20an%20electric%20guitar%20atop%20a%20spotlit%20concert%20stage,%20vibrant%20digital%20vector%20art%20illustration?width=800&height=800&seed=1313&nologo=true",
    visualPrompt: "A futuristic robot playing an electric guitar atop a concert stage."
  },
  {
    id: "sc-14",
    targetSentence: "KNIGHT RIDES HORSE ACROSS BRIDGE",
    targetWords: ["KNIGHT", "RIDES", "HORSE", "ACROSS", "BRIDGE"],
    imageUrl: "https://image.pollinations.ai/prompt/a%20brave%20knight%20in%20shiny%20silver%20armor%20riding%20a%20white%20horse%20across%20a%20stone%20bridge,%20vibrant%20digital%20vector%20art%20illustration?width=800&height=800&seed=1414&nologo=true",
    visualPrompt: "A knight in silver armor riding a horse across a stone bridge."
  },
  {
    id: "sc-15",
    targetSentence: "OWL WATCHES STARS BELOW MOON",
    targetWords: ["OWL", "WATCHES", "STARS", "BELOW", "MOON"],
    imageUrl: "https://image.pollinations.ai/prompt/a%20cute%20wise%20owl%20watching%20twinkling%20bright%20stars%20below%20a%20glowing%20moon%20in%20the%20night%20sky,%20vibrant%20digital%20vector%20art%20illustration?width=800&height=800&seed=1515&nologo=true",
    visualPrompt: "An owl watching stars below a glowing moon in the night sky."
  },
  {
    id: "sc-16",
    targetSentence: "DIVER FINDS TREASURE UNDER SEA",
    targetWords: ["DIVER", "FINDS", "TREASURE", "UNDER", "SEA"],
    imageUrl: "https://image.pollinations.ai/prompt/a%20scuba%20diver%20finding%20a%20golden%20treasure%20chest%20deep%20underwater%20in%20the%20blue%20sea,%20vibrant%20digital%20vector%20art%20illustration?width=800&height=800&seed=1616&nologo=true",
    visualPrompt: "A scuba diver finding a treasure chest underwater in the blue sea."
  },
  {
    id: "sc-17",
    targetSentence: "FARMER DRIVES TRACTOR ACROSS FIELD",
    targetWords: ["FARMER", "DRIVES", "TRACTOR", "ACROSS", "FIELD"],
    imageUrl: "https://image.pollinations.ai/prompt/a%20cheerful%20farmer%20driving%20a%20bright%20red%20tractor%20across%20a%20sunny%20green%20farm%20field,%20vibrant%20digital%20vector%20art%20illustration?width=800&height=800&seed=1717&nologo=true",
    visualPrompt: "A farmer driving a red tractor across a green farm field."
  },
  {
    id: "sc-18",
    targetSentence: "SQUIRREL HIDES NUTS INSIDE HOLE",
    targetWords: ["SQUIRREL", "HIDES", "NUTS", "INSIDE", "HOLE"],
    imageUrl: "https://image.pollinations.ai/prompt/a%20fluffy%20squirrel%20hiding%20brown%20acorn%20nuts%20inside%20a%20hollow%20tree%20trunk%20hole,%20vibrant%20digital%20vector%20art%20illustration?width=800&height=800&seed=1818&nologo=true",
    visualPrompt: "A squirrel hiding nuts inside a hole in a tree trunk."
  },
  {
    id: "sc-19",
    targetSentence: "PAINTER CREATES PICTURE INSIDE STUDIO",
    targetWords: ["PAINTER", "CREATES", "PICTURE", "INSIDE", "STUDIO"],
    imageUrl: "https://image.pollinations.ai/prompt/an%20artist%20painter%20creating%20a%20colorful%20landscape%20picture%20on%20an%20easel%20inside%20a%20bright%20art%20studio,%20vibrant%20digital%20vector%20art%20illustration?width=800&height=800&seed=1919&nologo=true",
    visualPrompt: "An artist painting a picture on an easel inside a bright art studio."
  }
];

