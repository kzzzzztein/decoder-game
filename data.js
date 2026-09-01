/*
  DECODE — Puzzle Data
  =====================================================================
  Each puzzle:
  {
    id:       unique string
    source:   who/what said it or where it's from (revealed after solving)
    quote:    the full line, written in normal words separated by spaces
    questions: exactly 5 { q: "dictionary-style definition clue", a: "ANSWER WORD" }

  How the blanking works (see app.js):
  The engine scans the quote word by word. Any word that exactly matches
  one of the 5 question answers (case-insensitive, punctuation ignored)
  gets turned into a blank. Everything else stays visible as a connector
  word. So the 5 answers MUST be spelled exactly as they appear in the
  quote (including apostrophes like YOU'RE, WON'T, CAN'T).

  Clue style: each clue is a plain-language DEFINITION of the answer word
  (like a crossword or dictionary clue) — e.g. for the word POWER: "the
  capacity or ability to direct or influence the behaviour of others or
  the course of events" → answer: POWER.

  TO EXPAND TO 50 PER CATEGORY: just add more objects to each array
  below, following the same shape. Nothing else in the code needs to
  change — the game engine, UI, and progress tracker all read from
  however many puzzles exist here.

  NOTE ON CONTENT: Music entries use short SPOKEN quotes from musicians
  (interviews, famous sayings) rather than song lyrics. Song lyrics are
  copyrighted, and reproducing them — even briefly, even though they're
  easy to find online — isn't something that belongs in an app you
  distribute to others. This keeps the game safe to ship anywhere,
  including the Play Store, without risk of a takedown.
*/

const PUZZLE_DATA = {
  movies: [
    {
      id: "movies_01",
      source: "Forrest Gump (1994)",
      quote: "LIFE IS LIKE A BOX OF CHOCOLATES YOU NEVER KNOW WHAT YOU ARE GOING TO GET",
      questions: [
        { q: "The condition that distinguishes living organisms from dead ones; existence in general.", a: "LIFE" },
        { q: "A container with a flat base and sides, typically square or rectangular.", a: "BOX" },
        { q: "Sweet, edible treats made from roasted, ground cacao seeds.", a: "CHOCOLATES" },
        { q: "At no time in the past or future; not on any occasion.", a: "NEVER" },
        { q: "To come to have or hold something; to receive.", a: "GET" }
      ]
    },
    {
      id: "movies_02",
      source: "The Wizard of Oz (1939)",
      quote: "THERE IS NO PLACE LIKE HOME",
      questions: [
        { q: "In, at, or to that particular spot or position; the opposite of 'here'.", a: "THERE" },
        { q: "A word used to give a negative response; not any.", a: "NO" },
        { q: "A particular position, point, or area in space.", a: "PLACE" },
        { q: "Having similar qualities or characteristics to something else.", a: "LIKE" },
        { q: "The place where one lives permanently, especially with one's family.", a: "HOME" }
      ]
    },
    {
      id: "movies_03",
      source: "Jaws (1975)",
      quote: "YOU'RE GONNA NEED A BIGGER BOAT",
      questions: [
        { q: "A contraction meaning 'you are'.", a: "YOU'RE" },
        { q: "An informal, spoken-style contraction of 'going to'.", a: "GONNA" },
        { q: "To require something because it is essential or very important.", a: "NEED" },
        { q: "Of greater size than another; the comparative form of 'big'.", a: "BIGGER" },
        { q: "A small vessel used for traveling across water.", a: "BOAT" }
      ]
    },
    {
      id: "movies_04",
      source: "The Godfather (1972)",
      quote: "I'M GONNA MAKE HIM AN OFFER HE CAN'T REFUSE",
      questions: [
        { q: "An informal, spoken-style contraction of 'going to'.", a: "GONNA" },
        { q: "To form or create something by combining parts.", a: "MAKE" },
        { q: "A proposal to give, provide, or do something for someone.", a: "OFFER" },
        { q: "A contraction meaning 'cannot'.", a: "CAN'T" },
        { q: "To indicate that one is not willing to accept or do something.", a: "REFUSE" }
      ]
    }
  ],

  series: [
    {
      id: "series_01",
      source: "Game of Thrones",
      quote: "A LANNISTER ALWAYS PAYS HIS DEBTS",
      questions: [
        { q: "A powerful, wealthy noble house in a famous fantasy saga, known for its pride.", a: "LANNISTER" },
        { q: "At all times; on every occasion, without exception.", a: "ALWAYS" },
        { q: "Gives someone money that is owed for goods, work, or a debt.", a: "PAYS" },
        { q: "A possessive word meaning 'belonging to a male person'.", a: "HIS" },
        { q: "Sums of money that are owed to someone else.", a: "DEBTS" }
      ]
    },
    {
      id: "series_02",
      source: "Breaking Bad",
      quote: "I AM THE ONE WHO KNOCKS",
      questions: [
        { q: "The first-person singular present form of the verb 'to be'.", a: "AM" },
        { q: "The definite article, used to refer to one specific thing already known.", a: "THE" },
        { q: "The number equal to a single unit.", a: "ONE" },
        { q: "A pronoun used to ask about a person's identity.", a: "WHO" },
        { q: "Strikes a surface, typically a door, to get someone's attention.", a: "KNOCKS" }
      ]
    },
    {
      id: "series_03",
      source: "Friends",
      quote: "WE WERE ON A BREAK",
      questions: [
        { q: "A pronoun referring to the speaker together with one or more others.", a: "WE" },
        { q: "The past tense of 'are'.", a: "WERE" },
        { q: "Currently active, in progress, or — in this case — paused.", a: "ON" },
        { q: "The indefinite article used before a word starting with a consonant sound.", a: "A" },
        { q: "A pause, interval, or temporary suspension of a relationship.", a: "BREAK" }
      ]
    },
    {
      id: "series_04",
      source: "The Office",
      quote: "I'M NOT SUPERSTITIOUS BUT I AM A LITTLE STITIOUS",
      questions: [
        { q: "A word used to express negation or denial.", a: "NOT" },
        { q: "Having an excessive belief in luck, omens, or the supernatural.", a: "SUPERSTITIOUS" },
        { q: "A conjunction used to introduce a contrasting idea.", a: "BUT" },
        { q: "Small in amount or degree.", a: "LITTLE" },
        { q: "Michael Scott's own playful, shortened version of the word for believing in omens.", a: "STITIOUS" }
      ]
    }
  ],

  history: [
    {
      id: "history_01",
      source: "Neil Armstrong, 1969 Moon landing",
      quote: "THAT'S ONE SMALL STEP FOR MAN ONE GIANT LEAP FOR MANKIND",
      questions: [
        { q: "Of a size that is less than normal or usual.", a: "SMALL" },
        { q: "A single movement made by lifting the foot and putting it down elsewhere.", a: "STEP" },
        { q: "Of very great size, force, or importance; enormous.", a: "GIANT" },
        { q: "A large, sudden jump or spring from one place to another.", a: "LEAP" },
        { q: "Human beings considered collectively; the human race.", a: "MANKIND" }
      ]
    },
    {
      id: "history_02",
      source: "Franklin D. Roosevelt, 1933",
      quote: "THE ONLY THING WE HAVE TO FEAR IS FEAR ITSELF",
      questions: [
        { q: "And nothing or no one else; solely.", a: "ONLY" },
        { q: "An object or matter that does not need to be named specifically.", a: "THING" },
        { q: "To possess, hold, or own something.", a: "HAVE" },
        { q: "An unpleasant emotion caused by the belief that something is dangerous or threatening.", a: "FEAR" },
        { q: "A reflexive pronoun referring back to a thing already mentioned.", a: "ITSELF" }
      ]
    },
    {
      id: "history_03",
      source: "Martin Luther King Jr., 1963",
      quote: "I HAVE A DREAM THAT MY FOUR CHILDREN WILL ONE DAY LIVE",
      questions: [
        { q: "A cherished hope, ambition, or aspiration.", a: "DREAM" },
        { q: "The number equal to three plus one.", a: "FOUR" },
        { q: "Young human beings who are not yet fully grown.", a: "CHILDREN" },
        { q: "The number equal to a single unit.", a: "ONE" },
        { q: "To remain alive; to exist.", a: "LIVE" }
      ]
    },
    {
      id: "history_04",
      source: "Winston Churchill, 1940",
      quote: "NEVER IN THE FIELD OF HUMAN CONFLICT WAS SO MUCH OWED BY SO MANY TO SO FEW",
      questions: [
        { q: "An open area of land, or figuratively, an area of activity or endeavor.", a: "FIELD" },
        { q: "Relating to people or mankind in general.", a: "HUMAN" },
        { q: "A serious, often prolonged, disagreement or struggle.", a: "CONFLICT" },
        { q: "The past tense of 'owe'; required to give in return for something received.", a: "OWED" },
        { q: "A small number of; not many.", a: "FEW" }
      ]
    }
  ],

  animals: [
    {
      id: "animals_01",
      source: "Animal Fact File",
      quote: "THE BLUE WHALE IS THE LARGEST ANIMAL ON EARTH",
      questions: [
        { q: "A color that lies between green and violet on the spectrum, like a clear sky.", a: "BLUE" },
        { q: "A very large marine mammal with a streamlined body and no external ears.", a: "WHALE" },
        { q: "The superlative of 'large'; the biggest in size.", a: "LARGEST" },
        { q: "A living organism, other than a plant, capable of voluntary movement.", a: "ANIMAL" },
        { q: "The planet on which we live, third in distance from the sun.", a: "EARTH" }
      ]
    },
    {
      id: "animals_02",
      source: "Animal Fact File",
      quote: "CHEETAHS ARE THE FASTEST LAND ANIMALS IN THE WORLD",
      questions: [
        { q: "Large, slender, spotted cats built for extreme bursts of speed.", a: "CHEETAHS" },
        { q: "The superlative of 'fast'; the quickest.", a: "FASTEST" },
        { q: "The solid part of the earth's surface, as opposed to sea or sky.", a: "LAND" },
        { q: "Living organisms, other than plants, capable of voluntary movement.", a: "ANIMALS" },
        { q: "The earth, together with all its countries, peoples, and features.", a: "WORLD" }
      ]
    },
    {
      id: "animals_03",
      source: "Animal Fact File",
      quote: "OCTOPUSES HAVE THREE HEARTS AND BLUE BLOOD",
      questions: [
        { q: "Soft-bodied sea creatures with eight arms lined with suckers.", a: "OCTOPUSES" },
        { q: "The number equal to two plus one.", a: "THREE" },
        { q: "Muscular organs that pump blood through a circulatory system.", a: "HEARTS" },
        { q: "A color that lies between green and violet on the spectrum.", a: "BLUE" },
        { q: "The liquid, usually red, that circulates through the bodies of most animals.", a: "BLOOD" }
      ]
    },
    {
      id: "animals_04",
      source: "Animal Fact File",
      quote: "A LARGE GROUP OF FLAMINGOS IS OFFICIALLY CALLED A FLAMBOYANCE",
      questions: [
        { q: "Of considerable or greater than usual size.", a: "LARGE" },
        { q: "A number of things or people gathered or classed together.", a: "GROUP" },
        { q: "Tall, long-necked wading birds known for their pink or reddish feathers.", a: "FLAMINGOS" },
        { q: "In a formal, authorized, or recognized way.", a: "OFFICIALLY" },
        { q: "The whimsical collective noun used for a group of pink wading birds.", a: "FLAMBOYANCE" }
      ]
    }
  ],

  music: [
    {
      id: "music_01",
      source: "Bob Marley, in interview",
      quote: "ONE GOOD THING ABOUT MUSIC IS WHEN IT HITS YOU FEEL NO PAIN",
      questions: [
        { q: "To be desired, approved of, or having positive qualities.", a: "GOOD" },
        { q: "Vocal or instrumental sounds combined to produce beauty of form and emotional expression.", a: "MUSIC" },
        { q: "Strikes forcefully, or in this context, affects someone strongly.", a: "HITS" },
        { q: "To experience or become aware of an emotion or physical sensation.", a: "FEEL" },
        { q: "Physical or emotional suffering.", a: "PAIN" }
      ]
    },
    {
      id: "music_02",
      source: "Freddie Mercury, Queen",
      quote: "I WON'T BE A ROCK STAR I WILL BE A LEGEND",
      questions: [
        { q: "A contraction meaning 'will not'.", a: "WON'T" },
        { q: "A genre of popular music with a strong beat, often built around electric guitars.", a: "ROCK" },
        { q: "A famous or celebrated person, especially in entertainment.", a: "STAR" },
        { q: "A word expressing future intention or certainty.", a: "WILL" },
        { q: "An extremely famous person whose reputation endures long after their time.", a: "LEGEND" }
      ]
    },
    {
      id: "music_03",
      source: "Ludwig van Beethoven",
      quote: "MUSIC IS A HIGHER REVELATION THAN ALL WISDOM AND PHILOSOPHY",
      questions: [
        { q: "The comparative form of 'high'; greater in rank or degree.", a: "HIGHER" },
        { q: "A surprising fact or truth that is made known, especially in a striking way.", a: "REVELATION" },
        { q: "The quality of having experience, knowledge, and good judgment.", a: "WISDOM" },
        { q: "The academic study of the fundamental nature of knowledge, reality, and existence.", a: "PHILOSOPHY" },
        { q: "A word referring to the whole quantity or entirety of something.", a: "ALL" }
      ]
    },
    {
      id: "music_04",
      source: "Bob Dylan",
      quote: "HE NOT BUSY BEING BORN IS BUSY DYING",
      questions: [
        { q: "A pronoun referring to a male person previously mentioned.", a: "HE" },
        { q: "Occupied with a great deal of activity; having a lot to do.", a: "BUSY" },
        { q: "The present participle of the verb 'to be'; currently existing.", a: "BEING" },
        { q: "To come into life or existence.", a: "BORN" },
        { q: "The process of a life coming to an end.", a: "DYING" }
      ]
    }
  ]
};

// Fixed substitution cipher used purely for visual flavor under each blank
// letter (a nod to classic cryptograms). A=1..Z=26 shuffled, with P=7 as
// specced. Not required to solve the puzzle — just adds the "decoder" feel.
const CIPHER_MAP = {
  A: 5, B: 19, C: 2, D: 14, E: 1, F: 22, G: 9, H: 17, I: 3, J: 26,
  K: 11, L: 6, M: 20, N: 8, O: 15, P: 7, Q: 23, R: 4, S: 18, T: 12,
  U: 25, V: 10, W: 21, X: 13, Y: 24, Z: 16
};

const CATEGORY_META = {
  movies:  { label: "Movies",  icon: "🎬", color: "#7C5CFF" },
  series:  { label: "Series",  icon: "📺", color: "#29E7CD" },
  history: { label: "History", icon: "🏛️", color: "#FFC857" },
  animals: { label: "Animals", icon: "🐾", color: "#5CD6A9" },
  music:   { label: "Music",   icon: "🎵", color: "#FF5470" }
};
