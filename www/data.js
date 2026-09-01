/*
  DECODE — Puzzle Data
  =====================================================================
  Each puzzle:
  {
    id:       unique string
    source:   who/what said it or where it's from (revealed after solving)
    quote:    the full line, written in normal words separated by spaces
    questions: exactly 5 { q: "simple, casual clue", a: "ANSWER WORD" }

  Clue style: short and simple, like you'd explain it to a friend —
  NOT a dictionary definition. e.g. for ANIMAL: "a type of living
  thing" — not "a living organism that feeds on organic matter...".

  How the blanking works (see app.js):
  The engine scans the quote word by word. Any word that exactly matches
  one of the 5 question answers (case-insensitive, punctuation ignored)
  becomes a blank made of individual letter boxes. Every blank letter is
  also tied to a shared cipher number (see CIPHER_MAP) — get one letter
  right anywhere in the puzzle, and every box sharing that same letter,
  in every word, reveals instantly.

  TO ADD MORE LEVELS: append more objects to any array below, same shape.
  Nothing else in the code needs to change.

  NOTE ON CONTENT: Music entries use short SPOKEN quotes from musicians
  (interviews, famous sayings) rather than song lyrics, since lyrics are
  copyrighted and shouldn't ship inside a distributed app.
*/

const PUZZLE_DATA = {
  movies: [
    {
      id: "movies_01",
      source: "Forrest Gump (1994)",
      quote: "LIFE IS LIKE A BOX OF CHOCOLATES YOU NEVER KNOW WHAT YOU ARE GOING TO GET",
      questions: [
        { q: "Being alive, all the days you live.", a: "LIFE" },
        { q: "A container shaped like a cube.", a: "BOX" },
        { q: "Sweet brown candy you eat.", a: "CHOCOLATES" },
        { q: "Not even one single time.", a: "NEVER" },
        { q: "To receive something.", a: "GET" }
      ]
    },
    {
      id: "movies_02",
      source: "The Wizard of Oz (1939)",
      quote: "THERE IS NO PLACE LIKE HOME",
      questions: [
        { q: "That spot, not here.", a: "THERE" },
        { q: "The opposite of yes.", a: "NO" },
        { q: "A spot or location.", a: "PLACE" },
        { q: "Similar to, the same as.", a: "LIKE" },
        { q: "Where you live.", a: "HOME" }
      ]
    },
    {
      id: "movies_03",
      source: "Jaws (1975)",
      quote: "YOU'RE GONNA NEED A BIGGER BOAT",
      questions: [
        { q: "Short way to say 'you are'.", a: "YOU'RE" },
        { q: "Casual way to say 'going to'.", a: "GONNA" },
        { q: "To really have to have something.", a: "NEED" },
        { q: "More large than something else.", a: "BIGGER" },
        { q: "A small thing that floats and carries you on water.", a: "BOAT" }
      ]
    },
    {
      id: "movies_04",
      source: "The Godfather (1972)",
      quote: "I'M GONNA MAKE HIM AN OFFER HE CAN'T REFUSE",
      questions: [
        { q: "Casual way to say 'going to'.", a: "GONNA" },
        { q: "To create or put together.", a: "MAKE" },
        { q: "A deal you propose to someone.", a: "OFFER" },
        { q: "Short way to say 'cannot'.", a: "CAN'T" },
        { q: "To say no to something.", a: "REFUSE" }
      ]
    },
    {
      id: "movies_05",
      source: "Titanic (1997)",
      quote: "A WOMAN'S HEART IS A DEEP OCEAN OF SECRETS",
      questions: [
        { q: "Belongs to a lady.", a: "WOMAN'S" },
        { q: "The part inside you that pumps blood; also means love.", a: "HEART" },
        { q: "Very far down.", a: "DEEP" },
        { q: "A huge body of salty water.", a: "OCEAN" },
        { q: "Things kept hidden from others.", a: "SECRETS" }
      ]
    },
    {
      id: "movies_06",
      source: "Finding Nemo (2003)",
      quote: "FISH ARE FRIENDS NOT FOOD",
      questions: [
        { q: "An animal that swims and breathes underwater.", a: "FISH" },
        { q: "Another way to say 'is', but for more than one.", a: "ARE" },
        { q: "People you like and trust.", a: "FRIENDS" },
        { q: "A word used to say no.", a: "NOT" },
        { q: "What you eat.", a: "FOOD" }
      ]
    },
    {
      id: "movies_07",
      source: "Star Wars",
      quote: "MAY THE FORCE BE WITH YOU",
      questions: [
        { q: "A word for wishing someone luck.", a: "MAY" },
        { q: "A push or pull; also the Jedi's power.", a: "FORCE" },
        { q: "To exist.", a: "BE" },
        { q: "Together, alongside.", a: "WITH" },
        { q: "The person someone is talking to.", a: "YOU" }
      ]
    },
    {
      id: "movies_08",
      source: "Rocky (1976)",
      quote: "IT AIN'T ABOUT HOW HARD YOU HIT",
      questions: [
        { q: "Casual way to say 'is not'.", a: "AIN'T" },
        { q: "On the subject of.", a: "ABOUT" },
        { q: "Not easy, tough.", a: "HARD" },
        { q: "The person someone is talking to.", a: "YOU" },
        { q: "To strike something.", a: "HIT" }
      ]
    }
  ],

  series: [
    {
      id: "series_01",
      source: "Game of Thrones",
      quote: "A LANNISTER ALWAYS PAYS HIS DEBTS",
      questions: [
        { q: "A rich, proud family name from a fantasy show.", a: "LANNISTER" },
        { q: "Every single time, no exceptions.", a: "ALWAYS" },
        { q: "Gives money that's owed.", a: "PAYS" },
        { q: "Belongs to him.", a: "HIS" },
        { q: "Money you owe someone.", a: "DEBTS" }
      ]
    },
    {
      id: "series_02",
      source: "Breaking Bad",
      quote: "I AM THE ONE WHO KNOCKS",
      questions: [
        { q: "The word for 'to be', used with 'I'.", a: "AM" },
        { q: "A small word that goes before a noun.", a: "THE" },
        { q: "The number 1.", a: "ONE" },
        { q: "A word you use to ask about a person.", a: "WHO" },
        { q: "Taps on a door to get attention.", a: "KNOCKS" }
      ]
    },
    {
      id: "series_03",
      source: "Friends",
      quote: "WE WERE ON A BREAK",
      questions: [
        { q: "You and me together.", a: "WE" },
        { q: "The past form of 'are'.", a: "WERE" },
        { q: "Touching the top of something, or currently happening.", a: "ON" },
        { q: "A small word before a noun, like '__ dog'.", a: "A" },
        { q: "A pause, or a split in a relationship.", a: "BREAK" }
      ]
    },
    {
      id: "series_04",
      source: "The Office",
      quote: "I'M NOT SUPERSTITIOUS BUT I AM A LITTLE STITIOUS",
      questions: [
        { q: "A word used to say no.", a: "NOT" },
        { q: "Believing weird things bring luck or bad luck.", a: "SUPERSTITIOUS" },
        { q: "A word used to show a difference.", a: "BUT" },
        { q: "Small, not much.", a: "LITTLE" },
        { q: "Michael Scott's silly made-up shortcut word.", a: "STITIOUS" }
      ]
    },
    {
      id: "series_05",
      source: "SpongeBob SquarePants",
      quote: "THE BEST TIME TO WEAR A STRIPED SWEATER IS ALL THE TIME",
      questions: [
        { q: "Better than every other one.", a: "BEST" },
        { q: "To put clothes on your body.", a: "WEAR" },
        { q: "Having lines of color, like a zebra.", a: "STRIPED" },
        { q: "A warm piece of clothing for your top half.", a: "SWEATER" },
        { q: "Every single one, no exceptions.", a: "ALL" }
      ]
    },
    {
      id: "series_06",
      source: "Scooby-Doo",
      quote: "AND I WOULD HAVE GOTTEN AWAY WITH IT TOO IF IT WASN'T FOR YOU MEDDLING KIDS",
      questions: [
        { q: "The past form of 'got'.", a: "GOTTEN" },
        { q: "Not here, far off.", a: "AWAY" },
        { q: "Short way to say 'was not'.", a: "WASN'T" },
        { q: "Poking your nose into other people's business.", a: "MEDDLING" },
        { q: "Young children.", a: "KIDS" }
      ]
    },
    {
      id: "series_07",
      source: "Seinfeld",
      quote: "NOT THAT THERE'S ANYTHING WRONG WITH THAT",
      questions: [
        { q: "A word used to say no.", a: "NOT" },
        { q: "Short way to say 'there is'.", a: "THERE'S" },
        { q: "Any single thing at all.", a: "ANYTHING" },
        { q: "Not correct, or not okay.", a: "WRONG" },
        { q: "Together, alongside.", a: "WITH" }
      ]
    },
    {
      id: "series_08",
      source: "The X-Files",
      quote: "THE TRUTH IS OUT THERE",
      questions: [
        { q: "A small word before a noun.", a: "THE" },
        { q: "Something that's really true, not a lie.", a: "TRUTH" },
        { q: "A word that means 'exists', like 'she __ happy'.", a: "IS" },
        { q: "Not inside — the opposite of 'in'.", a: "OUT" },
        { q: "A place, not here.", a: "THERE" }
      ]
    }
  ],

  history: [
    {
      id: "history_01",
      source: "Neil Armstrong, 1969 Moon landing",
      quote: "THAT'S ONE SMALL STEP FOR MAN ONE GIANT LEAP FOR MANKIND",
      questions: [
        { q: "Not big, tiny.", a: "SMALL" },
        { q: "One movement of your foot when walking.", a: "STEP" },
        { q: "Really, really big.", a: "GIANT" },
        { q: "A big jump.", a: "LEAP" },
        { q: "All people on Earth together.", a: "MANKIND" }
      ]
    },
    {
      id: "history_02",
      source: "Franklin D. Roosevelt, 1933",
      quote: "THE ONLY THING WE HAVE TO FEAR IS FEAR ITSELF",
      questions: [
        { q: "Just one, nothing more.", a: "ONLY" },
        { q: "An object, or something you don't need to name.", a: "THING" },
        { q: "To own or hold.", a: "HAVE" },
        { q: "Feeling scared.", a: "FEAR" },
        { q: "The thing, all alone.", a: "ITSELF" }
      ]
    },
    {
      id: "history_03",
      source: "Martin Luther King Jr., 1963",
      quote: "I HAVE A DREAM THAT MY FOUR CHILDREN WILL ONE DAY LIVE",
      questions: [
        { q: "A hope for the future, or what happens while you sleep.", a: "DREAM" },
        { q: "The number after three.", a: "FOUR" },
        { q: "Kids, young people.", a: "CHILDREN" },
        { q: "The number 1.", a: "ONE" },
        { q: "To be alive.", a: "LIVE" }
      ]
    },
    {
      id: "history_04",
      source: "Winston Churchill, 1940",
      quote: "NEVER IN THE FIELD OF HUMAN CONFLICT WAS SO MUCH OWED BY SO MANY TO SO FEW",
      questions: [
        { q: "An open grassy area, or an area of work.", a: "FIELD" },
        { q: "Having to do with people.", a: "HUMAN" },
        { q: "A big disagreement or fight.", a: "CONFLICT" },
        { q: "The past form of 'owe' — money you had to pay back.", a: "OWED" },
        { q: "Not many.", a: "FEW" }
      ]
    },
    {
      id: "history_05",
      source: "John F. Kennedy, 1961",
      quote: "ASK NOT WHAT YOUR COUNTRY CAN DO FOR YOU ASK WHAT YOU CAN DO FOR YOUR COUNTRY",
      questions: [
        { q: "To say a question out loud.", a: "ASK" },
        { q: "A nation, a place with its own government.", a: "COUNTRY" },
        { q: "To be able to do something.", a: "CAN" },
        { q: "To perform an action.", a: "DO" },
        { q: "The person someone is talking to.", a: "YOU" }
      ]
    },
    {
      id: "history_06",
      source: "Rosa Parks",
      quote: "I WAS TIRED OF GIVING IN",
      questions: [
        { q: "The past form of 'is'.", a: "WAS" },
        { q: "Feeling sleepy or worn out.", a: "TIRED" },
        { q: "Belonging to, or made from.", a: "OF" },
        { q: "Handing something over.", a: "GIVING" },
        { q: "Inside, not outside.", a: "IN" }
      ]
    },
    {
      id: "history_07",
      source: "Nelson Mandela",
      quote: "EDUCATION IS THE MOST POWERFUL WEAPON WHICH YOU CAN USE TO CHANGE THE WORLD",
      questions: [
        { q: "Learning at school, gaining knowledge.", a: "EDUCATION" },
        { q: "Having a lot of strength or influence.", a: "POWERFUL" },
        { q: "A tool used for fighting.", a: "WEAPON" },
        { q: "To make something different.", a: "CHANGE" },
        { q: "The whole planet Earth.", a: "WORLD" }
      ]
    },
    {
      id: "history_08",
      source: "Amelia Earhart",
      quote: "ADVENTURE IS WORTHWHILE IN ITSELF",
      questions: [
        { q: "An exciting journey or experience.", a: "ADVENTURE" },
        { q: "A word that means 'exists', like 'he __ happy'.", a: "IS" },
        { q: "Good enough to be worth the time.", a: "WORTHWHILE" },
        { q: "Inside, not outside.", a: "IN" },
        { q: "The thing, all alone.", a: "ITSELF" }
      ]
    }
  ],

  animals: [
    {
      id: "animals_01",
      source: "Animal Fact File",
      quote: "THE BLUE WHALE IS THE LARGEST ANIMAL ON EARTH",
      questions: [
        { q: "The color of the sky on a clear day.", a: "BLUE" },
        { q: "A huge animal that lives in the ocean.", a: "WHALE" },
        { q: "The biggest one.", a: "LARGEST" },
        { q: "A living creature, like a dog or bird.", a: "ANIMAL" },
        { q: "The planet we live on.", a: "EARTH" }
      ]
    },
    {
      id: "animals_02",
      source: "Animal Fact File",
      quote: "CHEETAHS ARE THE FASTEST LAND ANIMALS IN THE WORLD",
      questions: [
        { q: "Spotted big cats known for running super fast.", a: "CHEETAHS" },
        { q: "The quickest one.", a: "FASTEST" },
        { q: "Solid ground, not water or sky.", a: "LAND" },
        { q: "Living creatures, like dogs and birds.", a: "ANIMALS" },
        { q: "The whole planet Earth.", a: "WORLD" }
      ]
    },
    {
      id: "animals_03",
      source: "Animal Fact File",
      quote: "OCTOPUSES HAVE THREE HEARTS AND BLUE BLOOD",
      questions: [
        { q: "Sea animals with eight arms.", a: "OCTOPUSES" },
        { q: "The number after two.", a: "THREE" },
        { q: "The parts inside you that pump blood.", a: "HEARTS" },
        { q: "The color of a clear sky.", a: "BLUE" },
        { q: "The red liquid inside your body.", a: "BLOOD" }
      ]
    },
    {
      id: "animals_04",
      source: "Animal Fact File",
      quote: "A LARGE GROUP OF FLAMINGOS IS OFFICIALLY CALLED A FLAMBOYANCE",
      questions: [
        { q: "Big in size.", a: "LARGE" },
        { q: "A bunch of things together.", a: "GROUP" },
        { q: "Tall pink birds that stand on one leg.", a: "FLAMINGOS" },
        { q: "In a real, formal way.", a: "OFFICIALLY" },
        { q: "The fancy name for a group of flamingos.", a: "FLAMBOYANCE" }
      ]
    },
    {
      id: "animals_05",
      source: "Animal Fact File",
      quote: "A GROUP OF CROWS IS CALLED A MURDER",
      questions: [
        { q: "A bunch of things together.", a: "GROUP" },
        { q: "Belonging to, or made from.", a: "OF" },
        { q: "Big black birds that say 'caw'.", a: "CROWS" },
        { q: "Given this name.", a: "CALLED" },
        { q: "The spooky name for a group of crows.", a: "MURDER" }
      ]
    },
    {
      id: "animals_06",
      source: "Animal Fact File",
      quote: "A SNAIL CAN SLEEP FOR THREE YEARS",
      questions: [
        { q: "A slow little creature with a shell.", a: "SNAIL" },
        { q: "To be able to.", a: "CAN" },
        { q: "To rest with your eyes closed.", a: "SLEEP" },
        { q: "The number after two.", a: "THREE" },
        { q: "Long stretches of time, 365 days each.", a: "YEARS" }
      ]
    },
    {
      id: "animals_07",
      source: "Animal Fact File",
      quote: "ELEPHANTS ARE THE ONLY ANIMALS THAT CANNOT JUMP",
      questions: [
        { q: "Huge gray animals with long trunks.", a: "ELEPHANTS" },
        { q: "Just one, nothing else.", a: "ONLY" },
        { q: "Living creatures, like dogs and cats.", a: "ANIMALS" },
        { q: "Not able to.", a: "CANNOT" },
        { q: "To leap up off the ground.", a: "JUMP" }
      ]
    },
    {
      id: "animals_08",
      source: "Animal Fact File",
      quote: "A GROUP OF LIONS IS CALLED A PRIDE",
      questions: [
        { q: "A bunch of things together.", a: "GROUP" },
        { q: "Belonging to, or made from.", a: "OF" },
        { q: "Big wild cats known as kings of the jungle.", a: "LIONS" },
        { q: "Given this name.", a: "CALLED" },
        { q: "The name for a group of lions; also means feeling proud.", a: "PRIDE" }
      ]
    }
  ],

  music: [
    {
      id: "music_01",
      source: "Bob Marley, in interview",
      quote: "ONE GOOD THING ABOUT MUSIC IS WHEN IT HITS YOU FEEL NO PAIN",
      questions: [
        { q: "The opposite of bad.", a: "GOOD" },
        { q: "Sounds and songs you listen to.", a: "MUSIC" },
        { q: "Strikes, or affects strongly.", a: "HITS" },
        { q: "To sense something inside you.", a: "FEEL" },
        { q: "Hurting, physically or emotionally.", a: "PAIN" }
      ]
    },
    {
      id: "music_02",
      source: "Freddie Mercury, Queen",
      quote: "I WON'T BE A ROCK STAR I WILL BE A LEGEND",
      questions: [
        { q: "Short way to say 'will not'.", a: "WON'T" },
        { q: "A loud music style with guitars.", a: "ROCK" },
        { q: "A famous, well-known person.", a: "STAR" },
        { q: "A word for something that'll happen later.", a: "WILL" },
        { q: "Someone people will remember forever.", a: "LEGEND" }
      ]
    },
    {
      id: "music_03",
      source: "Ludwig van Beethoven",
      quote: "MUSIC IS A HIGHER REVELATION THAN ALL WISDOM AND PHILOSOPHY",
      questions: [
        { q: "More up, or greater than.", a: "HIGHER" },
        { q: "A surprising truth you just found out.", a: "REVELATION" },
        { q: "Good judgment that comes from experience.", a: "WISDOM" },
        { q: "Deep thinking about life and truth.", a: "PHILOSOPHY" },
        { q: "Every single one.", a: "ALL" }
      ]
    },
    {
      id: "music_04",
      source: "Bob Dylan",
      quote: "HE NOT BUSY BEING BORN IS BUSY DYING",
      questions: [
        { q: "A word for a boy or man.", a: "HE" },
        { q: "Having a lot to do.", a: "BUSY" },
        { q: "Existing right now.", a: "BEING" },
        { q: "Coming into life.", a: "BORN" },
        { q: "Life coming to an end.", a: "DYING" }
      ]
    },
    {
      id: "music_05",
      source: "Elvis Presley",
      quote: "TRUTH IS LIKE THE SUN YOU CAN SHUT IT OUT FOR A TIME BUT IT AIN'T GOING AWAY",
      questions: [
        { q: "Something that's really true, not a lie.", a: "TRUTH" },
        { q: "The big bright star that lights up the day.", a: "SUN" },
        { q: "To close something.", a: "SHUT" },
        { q: "Minutes, hours, and days passing.", a: "TIME" },
        { q: "Not here, gone somewhere else.", a: "AWAY" }
      ]
    },
    {
      id: "music_06",
      source: "Michael Jackson, in interview",
      quote: "IF YOU WANT TO MAKE THE WORLD A BETTER PLACE TAKE A LOOK AT YOURSELF",
      questions: [
        { q: "To wish for something.", a: "WANT" },
        { q: "More good than before.", a: "BETTER" },
        { q: "A spot or location.", a: "PLACE" },
        { q: "To use your eyes to see.", a: "LOOK" },
        { q: "You, and nobody else.", a: "YOURSELF" }
      ]
    },
    {
      id: "music_07",
      source: "John Lennon",
      quote: "LIFE IS WHAT HAPPENS WHEN YOU ARE BUSY MAKING OTHER PLANS",
      questions: [
        { q: "Being alive, existing.", a: "LIFE" },
        { q: "Takes place, occurs.", a: "HAPPENS" },
        { q: "Having a lot to do.", a: "BUSY" },
        { q: "Creating something.", a: "MAKING" },
        { q: "Ideas for what you'll do later.", a: "PLANS" }
      ]
    },
    {
      id: "music_08",
      source: "Taylor Swift, in interview",
      quote: "I WRITE SONGS BECAUSE I HAVE TO",
      questions: [
        { q: "To put words down on paper.", a: "WRITE" },
        { q: "Music you can sing along to.", a: "SONGS" },
        { q: "A word used to explain why.", a: "BECAUSE" },
        { q: "To own or hold something.", a: "HAVE" },
        { q: "A small word showing direction, like 'going __ school'.", a: "TO" }
      ]
    }
  ]
};

// Fixed substitution cipher used for the "cryptogram" mechanic: every
// letter on screen shows this number underneath it. Get one letter right
// anywhere, and every box sharing that same number (same letter) reveals
// across the whole puzzle. A=1..Z=26 shuffled, with P=7 as specced.
const CIPHER_MAP = {
  A: 5, B: 19, C: 2, D: 14, E: 1, F: 22, G: 9, H: 17, I: 3, J: 26,
  K: 11, L: 6, M: 20, N: 8, O: 15, P: 7, Q: 23, R: 4, S: 18, T: 12,
  U: 25, V: 10, W: 21, X: 13, Y: 24, Z: 16
};

const CATEGORY_META = {
  movies:  { label: "Movies",  icon: "🎬", color: "#E8578D" },
  series:  { label: "Series",  icon: "📺", color: "#F0709A" },
  history: { label: "History", icon: "🏛️", color: "#D9668F" },
  animals: { label: "Animals", icon: "🐾", color: "#EE7CA6" },
  music:   { label: "Music",   icon: "🎵", color: "#E4507E" }
};
