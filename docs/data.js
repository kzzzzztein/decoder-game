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
  NOT a dictionary definition.

  How the blanking works (see app.js):
  The engine scans the quote word by word. Any word that exactly matches
  one of the 5 answers becomes a row of letter boxes. Every letter also
  shares a cipher number (see CIPHER_MAP) with every other instance of
  that letter across the whole puzzle — solve one, they all reveal.

  TO ADD MORE LEVELS: append more objects to any array below, same shape.
  Currently 18 per category — goal is 50 per category (250 total).

  NOTE ON CONTENT: Music entries mix short SPOKEN quotes from musicians
  (interviews, sayings) with general music facts, rather than song
  lyrics — lyrics are copyrighted and shouldn't ship inside a
  distributed app.
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
    },
    {
      id: "movies_09",
      source: "Casablanca (1942)",
      quote: "HERE'S LOOKING AT YOU KID",
      questions: [
        { q: "Short way to say 'here is'.", a: "HERE'S" },
        { q: "Using your eyes to see.", a: "LOOKING" },
        { q: "A small word showing location or aim.", a: "AT" },
        { q: "The person someone is talking to.", a: "YOU" },
        { q: "A young child, or a friendly nickname for someone.", a: "KID" }
      ]
    },
    {
      id: "movies_10",
      source: "Dirty Harry (1971)",
      quote: "GO AHEAD MAKE MY DAY",
      questions: [
        { q: "To move or leave.", a: "GO" },
        { q: "Forward, in front.", a: "AHEAD" },
        { q: "To create or cause something.", a: "MAKE" },
        { q: "Belonging to me.", a: "MY" },
        { q: "24 hours, from morning to night.", a: "DAY" }
      ]
    },
    {
      id: "movies_11",
      source: "Field of Dreams (1989)",
      quote: "IF YOU BUILD IT HE WILL COME",
      questions: [
        { q: "To construct or make something.", a: "BUILD" },
        { q: "A word for a thing already mentioned.", a: "IT" },
        { q: "A word for a boy or man.", a: "HE" },
        { q: "A word for something that'll happen later.", a: "WILL" },
        { q: "To arrive or move toward.", a: "COME" }
      ]
    },
    {
      id: "movies_12",
      source: "Jurassic Park (1993)",
      quote: "HOLD ON TO YOUR BUTTS",
      questions: [
        { q: "To grip something tightly.", a: "HOLD" },
        { q: "Touching the top of, or turned active.", a: "ON" },
        { q: "A small word showing direction.", a: "TO" },
        { q: "Belonging to you.", a: "YOUR" },
        { q: "A funny word for the part you sit on.", a: "BUTTS" }
      ]
    },
    {
      id: "movies_13",
      source: "Back to the Future (1985)",
      quote: "WHERE WE'RE GOING WE DON'T NEED ROADS",
      questions: [
        { q: "Asking about a place.", a: "WHERE" },
        { q: "Short way to say 'we are'.", a: "WE'RE" },
        { q: "Moving toward somewhere.", a: "GOING" },
        { q: "Short way to say 'do not'.", a: "DON'T" },
        { q: "Paths that cars drive on.", a: "ROADS" }
      ]
    },
    {
      id: "movies_14",
      source: "The Matrix (1999)",
      quote: "WELCOME TO THE REAL WORLD",
      questions: [
        { q: "A friendly greeting when someone arrives.", a: "WELCOME" },
        { q: "A small word showing direction.", a: "TO" },
        { q: "Actually true, not fake.", a: "REAL" },
        { q: "The whole planet Earth.", a: "WORLD" },
        { q: "A small word before a noun.", a: "THE" }
      ]
    },
    {
      id: "movies_15",
      source: "Jerry Maguire (1996)",
      quote: "YOU HAD ME AT HELLO",
      questions: [
        { q: "The person someone is talking to.", a: "YOU" },
        { q: "The past form of 'have'.", a: "HAD" },
        { q: "A word for the speaker.", a: "ME" },
        { q: "A small word showing location.", a: "AT" },
        { q: "A friendly word said when greeting someone.", a: "HELLO" }
      ]
    },
    {
      id: "movies_16",
      source: "Gladiator (2000)",
      quote: "WHAT WE DO IN LIFE ECHOES IN ETERNITY",
      questions: [
        { q: "A word used to ask about a thing.", a: "WHAT" },
        { q: "Being alive.", a: "LIFE" },
        { q: "Sounds that repeat and bounce back.", a: "ECHOES" },
        { q: "Inside, not outside.", a: "IN" },
        { q: "Forever, a time that never ends.", a: "ETERNITY" }
      ]
    },
    {
      id: "movies_17",
      source: "Gone with the Wind (1939)",
      quote: "AFTER ALL TOMORROW IS ANOTHER DAY",
      questions: [
        { q: "Later than something, following it.", a: "AFTER" },
        { q: "Every single one.", a: "ALL" },
        { q: "The day that comes after today.", a: "TOMORROW" },
        { q: "One more, a different one.", a: "ANOTHER" },
        { q: "24 hours, from morning to night.", a: "DAY" }
      ]
    },
    {
      id: "movies_18",
      source: "Toy Story (1995)",
      quote: "THERE'S A SNAKE IN MY BOOT",
      questions: [
        { q: "Short way to say 'there is'.", a: "THERE'S" },
        { q: "A long, legless reptile.", a: "SNAKE" },
        { q: "Inside, not outside.", a: "IN" },
        { q: "Belonging to me.", a: "MY" },
        { q: "A tall shoe that covers your ankle.", a: "BOOT" }
      ]
    },
    {
      id: "movies_19",
      source: "The Princess Bride (1987)",
      quote: "MY NAME IS INIGO MONTOYA YOU KILLED MY FATHER PREPARE TO DIE",
      questions: [
        { q: "What people call you.", a: "NAME" },
        { q: "The first name of the famous swordsman in this movie.", a: "INIGO" },
        { q: "The swordsman's last name.", a: "MONTOYA" },
        { q: "Caused someone to die.", a: "KILLED" },
        { q: "To get ready for something.", a: "PREPARE" }
      ]
    },
    {
      id: "movies_20",
      source: "Ghostbusters (1984)",
      quote: "I AIN'T AFRAID OF NO GHOST",
      questions: [
        { q: "Casual way to say 'am not'.", a: "AIN'T" },
        { q: "Feeling scared.", a: "AFRAID" },
        { q: "Belonging to, or made from.", a: "OF" },
        { q: "The opposite of yes.", a: "NO" },
        { q: "A spooky spirit that haunts places.", a: "GHOST" }
      ]
    },
    {
      id: "movies_21",
      source: "Frozen (2013)",
      quote: "SOME PEOPLE ARE WORTH MELTING FOR",
      questions: [
        { q: "An amount that isn't all or none.", a: "SOME" },
        { q: "Human beings.", a: "PEOPLE" },
        { q: "Deserving or valuable enough.", a: "WORTH" },
        { q: "Turning from solid to liquid with heat.", a: "MELTING" },
        { q: "Intended for, meant for.", a: "FOR" }
      ]
    },
    {
      id: "movies_22",
      source: "Jurassic Park (1993)",
      quote: "AN ADVENTURE SEVENTY MILLION YEARS IN THE MAKING",
      questions: [
        { q: "An exciting journey or experience.", a: "ADVENTURE" },
        { q: "The number 70.", a: "SEVENTY" },
        { q: "A thousand thousand — 1,000,000.", a: "MILLION" },
        { q: "Long stretches of time, 365 days each.", a: "YEARS" },
        { q: "Creating something.", a: "MAKING" }
      ]
    },
    {
      id: "movies_23",
      source: "Home Alone (1990)",
      quote: "KEEP THE CHANGE YOU FILTHY ANIMAL",
      questions: [
        { q: "To hold onto something.", a: "KEEP" },
        { q: "Money given back, or to make something different.", a: "CHANGE" },
        { q: "The person someone is talking to.", a: "YOU" },
        { q: "Extremely dirty.", a: "FILTHY" },
        { q: "A living creature, like a dog or bird.", a: "ANIMAL" }
      ]
    },
    {
      id: "movies_24",
      source: "The Lion King (1994)",
      quote: "EVERYTHING YOU SEE EXISTS TOGETHER IN A DELICATE BALANCE",
      questions: [
        { q: "All things, without exception.", a: "EVERYTHING" },
        { q: "To look at with your eyes.", a: "SEE" },
        { q: "Is real, or is present.", a: "EXISTS" },
        { q: "Easily broken, needing careful handling.", a: "DELICATE" },
        { q: "A stable, even state between things.", a: "BALANCE" }
      ]
    },
    {
      id: "movies_25",
      source: "Shrek (2001)",
      quote: "ONIONS HAVE LAYERS OGRES HAVE LAYERS YOU GET IT",
      questions: [
        { q: "A strong-smelling vegetable that makes you cry when cut.", a: "ONIONS" },
        { q: "Levels stacked one on top of another.", a: "LAYERS" },
        { q: "Big, ugly, grumpy monster-like creatures.", a: "OGRES" },
        { q: "To understand, or to receive.", a: "GET" },
        { q: "A word for a thing already mentioned.", a: "IT" }
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
    },
    {
      id: "series_09",
      source: "How I Met Your Mother",
      quote: "NOTHING SUITS ME LIKE A SUIT",
      questions: [
        { q: "Not a single thing.", a: "NOTHING" },
        { q: "Fits well, or matches.", a: "SUITS" },
        { q: "A word for the speaker.", a: "ME" },
        { q: "Similar to.", a: "LIKE" },
        { q: "A matching jacket and pants outfit.", a: "SUIT" }
      ]
    },
    {
      id: "series_10",
      source: "Parks and Recreation",
      quote: "I'M NOT ANGRY I'M JUST PASSIONATE",
      questions: [
        { q: "A word used to say no.", a: "NOT" },
        { q: "Feeling really mad.", a: "ANGRY" },
        { q: "Short way to say 'I am'.", a: "I'M" },
        { q: "Only, simply.", a: "JUST" },
        { q: "Having really strong feelings about something.", a: "PASSIONATE" }
      ]
    },
    {
      id: "series_11",
      source: "Cheers",
      quote: "WHERE EVERYBODY KNOWS YOUR NAME",
      questions: [
        { q: "Asking about a place.", a: "WHERE" },
        { q: "Every single person.", a: "EVERYBODY" },
        { q: "Understands, or is aware of.", a: "KNOWS" },
        { q: "Belonging to you.", a: "YOUR" },
        { q: "What people call you.", a: "NAME" }
      ]
    },
    {
      id: "series_12",
      source: "Twin Peaks",
      quote: "THE OWLS ARE NOT WHAT THEY SEEM",
      questions: [
        { q: "Birds that hunt at night and say 'hoo'.", a: "OWLS" },
        { q: "Another way to say 'is', for many things.", a: "ARE" },
        { q: "A word used to say no.", a: "NOT" },
        { q: "A word used to ask about a thing.", a: "WHAT" },
        { q: "Appear to be a certain way.", a: "SEEM" }
      ]
    },
    {
      id: "series_13",
      source: "Grey's Anatomy",
      quote: "IT'S A BEAUTIFUL DAY TO SAVE LIVES",
      questions: [
        { q: "Short way to say 'it is'.", a: "IT'S" },
        { q: "Very pretty or lovely.", a: "BEAUTIFUL" },
        { q: "24 hours, from morning to night.", a: "DAY" },
        { q: "To rescue or keep safe.", a: "SAVE" },
        { q: "More than one life.", a: "LIVES" }
      ]
    },
    {
      id: "series_14",
      source: "Star Trek",
      quote: "TO BOLDLY GO WHERE NO ONE HAS GONE BEFORE",
      questions: [
        { q: "Bravely, without fear.", a: "BOLDLY" },
        { q: "To move or leave.", a: "GO" },
        { q: "Asking about a place.", a: "WHERE" },
        { q: "No longer here, left.", a: "GONE" },
        { q: "Earlier than now.", a: "BEFORE" }
      ]
    },
    {
      id: "series_15",
      source: "Community",
      quote: "SIX SEASONS AND A MOVIE",
      questions: [
        { q: "The number after five.", a: "SIX" },
        { q: "Parts of a TV show's run, like spring or summer.", a: "SEASONS" },
        { q: "A word that joins two things together.", a: "AND" },
        { q: "A small word before a noun.", a: "A" },
        { q: "A film you watch.", a: "MOVIE" }
      ]
    },
    {
      id: "series_16",
      source: "Ted Lasso",
      quote: "IT'S THE HOPE THAT KILLS YOU",
      questions: [
        { q: "Short way to say 'it is'.", a: "IT'S" },
        { q: "Wishing for something good to happen.", a: "HOPE" },
        { q: "A word pointing to a specific thing.", a: "THAT" },
        { q: "Ends the life of.", a: "KILLS" },
        { q: "The person someone is talking to.", a: "YOU" }
      ]
    },
    {
      id: "series_17",
      source: "Arrested Development",
      quote: "THERE'S ALWAYS MONEY IN THE BANANA STAND",
      questions: [
        { q: "Short way to say 'there is'.", a: "THERE'S" },
        { q: "Every single time.", a: "ALWAYS" },
        { q: "Cash you use to buy things.", a: "MONEY" },
        { q: "A long yellow fruit.", a: "BANANA" },
        { q: "A small booth, or to be on your feet.", a: "STAND" }
      ]
    },
    {
      id: "series_18",
      source: "Buffy the Vampire Slayer",
      quote: "INTO EVERY GENERATION A SLAYER IS BORN",
      questions: [
        { q: "Moving toward the inside of something.", a: "INTO" },
        { q: "Each one, without exception.", a: "EVERY" },
        { q: "A group of people born around the same time.", a: "GENERATION" },
        { q: "Someone who defeats monsters.", a: "SLAYER" },
        { q: "Coming into life.", a: "BORN" }
      ]
    },
    {
      id: "series_19",
      source: "Supernatural",
      quote: "SAVING PEOPLE HUNTING THINGS THE FAMILY BUSINESS",
      questions: [
        { q: "Rescuing, keeping safe.", a: "SAVING" },
        { q: "Searching for and chasing something.", a: "HUNTING" },
        { q: "Objects, or items.", a: "THINGS" },
        { q: "The people related to you, like parents and siblings.", a: "FAMILY" },
        { q: "Work, or a company; also means 'none of your ___'.", a: "BUSINESS" }
      ]
    },
    {
      id: "series_20",
      source: "I Love Lucy",
      quote: "LUCY YOU HAVE SOME SPLAINING TO DO",
      questions: [
        { q: "The first name of the main character in this classic sitcom.", a: "LUCY" },
        { q: "To own or hold.", a: "HAVE" },
        { q: "An amount that isn't all or none.", a: "SOME" },
        { q: "A playful short way to say 'explaining'.", a: "SPLAINING" },
        { q: "To perform an action.", a: "DO" }
      ]
    },
    {
      id: "series_21",
      source: "The Simpsons",
      quote: "TO ALCOHOL THE CAUSE OF AND SOLUTION TO ALL OF LIFE'S PROBLEMS",
      questions: [
        { q: "A drink like beer or wine that can make you tipsy.", a: "ALCOHOL" },
        { q: "The reason something happens.", a: "CAUSE" },
        { q: "An answer to a problem.", a: "SOLUTION" },
        { q: "Difficulties or issues.", a: "PROBLEMS" },
        { q: "Belonging to life.", a: "LIFE'S" }
      ]
    },
    {
      id: "series_22",
      source: "Rick and Morty",
      quote: "NOBODY EXISTS ON PURPOSE NOBODY BELONGS ANYWHERE",
      questions: [
        { q: "Is real, or is present.", a: "EXISTS" },
        { q: "The reason something is done.", a: "PURPOSE" },
        { q: "Has a proper or rightful place.", a: "BELONGS" },
        { q: "Any place at all.", a: "ANYWHERE" },
        { q: "Not a single person.", a: "NOBODY" }
      ]
    },
    {
      id: "series_23",
      source: "Avatar: The Last Airbender",
      quote: "LIFE HAPPENS WHEREVER YOU ARE WHETHER YOU MAKE IT OR NOT",
      questions: [
        { q: "Takes place, occurs.", a: "HAPPENS" },
        { q: "In any place that.", a: "WHEREVER" },
        { q: "A word used when there are two choices.", a: "WHETHER" },
        { q: "To create or cause.", a: "MAKE" },
        { q: "A word used to say no.", a: "NOT" }
      ]
    },
    {
      id: "series_24",
      source: "The Good Place",
      quote: "THIS IS THE BAD PLACE",
      questions: [
        { q: "A word pointing to something close by.", a: "THIS" },
        { q: "A word meaning 'exists'.", a: "IS" },
        { q: "A small word before a noun.", a: "THE" },
        { q: "Not good.", a: "BAD" },
        { q: "A spot or location.", a: "PLACE" }
      ]
    },
    {
      id: "series_25",
      source: "Doctor Who",
      quote: "FEAR MAKES COMPANIONS OF US ALL",
      questions: [
        { q: "Feeling scared.", a: "FEAR" },
        { q: "Creates or causes.", a: "MAKES" },
        { q: "Friends who travel or spend time with you.", a: "COMPANIONS" },
        { q: "A word for the speaker and others together.", a: "US" },
        { q: "Every single one.", a: "ALL" }
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
    },
    {
      id: "history_09",
      source: "Abraham Lincoln, Gettysburg Address",
      quote: "GOVERNMENT OF THE PEOPLE BY THE PEOPLE FOR THE PEOPLE SHALL NOT PERISH",
      questions: [
        { q: "The group that runs a country.", a: "GOVERNMENT" },
        { q: "Next to, or done through.", a: "BY" },
        { q: "Meant for, intended for.", a: "FOR" },
        { q: "An old-fashioned way to say 'will'.", a: "SHALL" },
        { q: "To die out or be destroyed.", a: "PERISH" }
      ]
    },
    {
      id: "history_10",
      source: "Thomas Edison",
      quote: "GENIUS IS ONE PERCENT INSPIRATION AND NINETY NINE PERCENT PERSPIRATION",
      questions: [
        { q: "Someone extremely smart.", a: "GENIUS" },
        { q: "A part out of a hundred.", a: "PERCENT" },
        { q: "A spark of a great idea.", a: "INSPIRATION" },
        { q: "The number 90.", a: "NINETY" },
        { q: "Sweat from hard work.", a: "PERSPIRATION" }
      ]
    },
    {
      id: "history_11",
      source: "Benjamin Franklin",
      quote: "EARLY TO BED AND EARLY TO RISE MAKES A MAN HEALTHY WEALTHY AND WISE",
      questions: [
        { q: "The furniture you sleep on.", a: "BED" },
        { q: "To get up, or to go higher.", a: "RISE" },
        { q: "In good physical shape, not sick.", a: "HEALTHY" },
        { q: "Having a lot of money.", a: "WEALTHY" },
        { q: "Having good judgment and knowledge.", a: "WISE" }
      ]
    },
    {
      id: "history_12",
      source: "Mahatma Gandhi",
      quote: "BE THE CHANGE YOU WISH TO SEE IN THE WORLD",
      questions: [
        { q: "To make something different.", a: "CHANGE" },
        { q: "To hope for something.", a: "WISH" },
        { q: "To look at with your eyes.", a: "SEE" },
        { q: "Inside, not outside.", a: "IN" },
        { q: "The whole planet Earth.", a: "WORLD" }
      ]
    },
    {
      id: "history_13",
      source: "Anne Frank",
      quote: "WHERE THERE IS HOPE THERE IS LIFE",
      questions: [
        { q: "Asking about a place.", a: "WHERE" },
        { q: "That spot, not here.", a: "THERE" },
        { q: "A word meaning 'exists'.", a: "IS" },
        { q: "Wishing for something good.", a: "HOPE" },
        { q: "Being alive.", a: "LIFE" }
      ]
    },
    {
      id: "history_14",
      source: "Theodore Roosevelt",
      quote: "SPEAK SOFTLY AND CARRY A BIG STICK",
      questions: [
        { q: "To talk out loud.", a: "SPEAK" },
        { q: "Quietly, gently.", a: "SOFTLY" },
        { q: "To hold and take something with you.", a: "CARRY" },
        { q: "Large in size.", a: "BIG" },
        { q: "A thin piece of wood.", a: "STICK" }
      ]
    },
    {
      id: "history_15",
      source: "George Washington",
      quote: "IT IS BETTER TO OFFER NO EXCUSE THAN A BAD ONE",
      questions: [
        { q: "More good than something else.", a: "BETTER" },
        { q: "To propose or give.", a: "OFFER" },
        { q: "A reason you give for something wrong.", a: "EXCUSE" },
        { q: "Not good.", a: "BAD" },
        { q: "The number 1.", a: "ONE" }
      ]
    },
    {
      id: "history_16",
      source: "Helen Keller",
      quote: "ALONE WE CAN DO SO LITTLE TOGETHER WE CAN DO SO MUCH",
      questions: [
        { q: "By yourself, with no one else.", a: "ALONE" },
        { q: "A small amount.", a: "LITTLE" },
        { q: "With others, as a group.", a: "TOGETHER" },
        { q: "A large amount.", a: "MUCH" },
        { q: "To be able to.", a: "CAN" }
      ]
    },
    {
      id: "history_17",
      source: "Confucius",
      quote: "IT DOES NOT MATTER HOW SLOWLY YOU GO AS LONG AS YOU DO NOT STOP",
      questions: [
        { q: "To be important.", a: "MATTER" },
        { q: "Not fast, taking your time.", a: "SLOWLY" },
        { q: "To move or leave.", a: "GO" },
        { q: "Taking a lot of time or distance.", a: "LONG" },
        { q: "To not move anymore.", a: "STOP" }
      ]
    },
    {
      id: "history_18",
      source: "Eleanor Roosevelt",
      quote: "NO ONE CAN MAKE YOU FEEL INFERIOR WITHOUT YOUR CONSENT",
      questions: [
        { q: "Feeling less important than others.", a: "INFERIOR" },
        { q: "Not having something.", a: "WITHOUT" },
        { q: "Giving permission.", a: "CONSENT" },
        { q: "To sense something inside you.", a: "FEEL" },
        { q: "To create or cause.", a: "MAKE" }
      ]
    },
    {
      id: "history_19",
      source: "Julius Caesar",
      quote: "THE DIE HAS BEEN CAST",
      questions: [
        { q: "A small word before a noun.", a: "THE" },
        { q: "A small cube used in games, or to stop living.", a: "DIE" },
        { q: "Owns or holds.", a: "HAS" },
        { q: "Past participle of 'be'.", a: "BEEN" },
        { q: "Thrown, or a group of actors.", a: "CAST" }
      ]
    },
    {
      id: "history_20",
      source: "Napoleon Bonaparte",
      quote: "ABLE WAS I ERE I SAW ELBA",
      questions: [
        { q: "Capable of doing something.", a: "ABLE" },
        { q: "The past form of 'is'.", a: "WAS" },
        { q: "An old-fashioned word meaning 'before'.", a: "ERE" },
        { q: "The past form of 'see'.", a: "SAW" },
        { q: "The island Napoleon was exiled to.", a: "ELBA" }
      ]
    },
    {
      id: "history_21",
      source: "Sun Tzu, The Art of War",
      quote: "KNOW YOUR ENEMY AND KNOW YOURSELF",
      questions: [
        { q: "To understand or be aware of.", a: "KNOW" },
        { q: "Belonging to you.", a: "YOUR" },
        { q: "Someone who opposes or fights against you.", a: "ENEMY" },
        { q: "A word that joins two things together.", a: "AND" },
        { q: "You, and nobody else.", a: "YOURSELF" }
      ]
    },
    {
      id: "history_22",
      source: "Marie Curie",
      quote: "NOTHING IN LIFE IS TO BE FEARED IT IS ONLY TO BE UNDERSTOOD",
      questions: [
        { q: "Not a single thing.", a: "NOTHING" },
        { q: "Being alive.", a: "LIFE" },
        { q: "Was afraid of.", a: "FEARED" },
        { q: "Just, solely.", a: "ONLY" },
        { q: "Grasped the meaning of something.", a: "UNDERSTOOD" }
      ]
    },
    {
      id: "history_23",
      source: "Albert Einstein",
      quote: "IMAGINATION IS MORE IMPORTANT THAN KNOWLEDGE",
      questions: [
        { q: "The ability to picture things in your mind.", a: "IMAGINATION" },
        { q: "A greater amount.", a: "MORE" },
        { q: "Mattering a lot.", a: "IMPORTANT" },
        { q: "Used to compare two things.", a: "THAN" },
        { q: "Information and understanding gained through learning.", a: "KNOWLEDGE" }
      ]
    },
    {
      id: "history_24",
      source: "Harriet Tubman",
      quote: "EVERY GREAT DREAM BEGINS WITH A DREAMER",
      questions: [
        { q: "Each one, without exception.", a: "EVERY" },
        { q: "Very good, or very large.", a: "GREAT" },
        { q: "Starts.", a: "BEGINS" },
        { q: "Together, alongside.", a: "WITH" },
        { q: "Someone who imagines big hopes for the future.", a: "DREAMER" }
      ]
    },
    {
      id: "history_25",
      source: "Booker T. Washington",
      quote: "SUCCESS IS TO BE MEASURED NOT SO MUCH BY THE POSITION ONE HAS REACHED",
      questions: [
        { q: "Achieving your goals.", a: "SUCCESS" },
        { q: "Judged or evaluated.", a: "MEASURED" },
        { q: "A large amount.", a: "MUCH" },
        { q: "A place or rank someone holds.", a: "POSITION" },
        { q: "Arrived at, or got to.", a: "REACHED" }
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
    },
    {
      id: "animals_09",
      source: "Animal Fact File",
      quote: "A BUTTERFLY TASTES WITH ITS FEET",
      questions: [
        { q: "A colorful flying insect.", a: "BUTTERFLY" },
        { q: "Senses flavor.", a: "TASTES" },
        { q: "Together, alongside.", a: "WITH" },
        { q: "Belonging to it.", a: "ITS" },
        { q: "The parts you stand on.", a: "FEET" }
      ]
    },
    {
      id: "animals_10",
      source: "Animal Fact File",
      quote: "A GROUP OF FROGS IS CALLED AN ARMY",
      questions: [
        { q: "A bunch of things together.", a: "GROUP" },
        { q: "Small green jumping animals that say 'croak'.", a: "FROGS" },
        { q: "Given this name.", a: "CALLED" },
        { q: "A small word before a word starting with a vowel.", a: "AN" },
        { q: "The surprising name for a group of frogs.", a: "ARMY" }
      ]
    },
    {
      id: "animals_11",
      source: "Animal Fact File",
      quote: "A GIRAFFE'S TONGUE CAN BE UP TO TWENTY INCHES LONG",
      questions: [
        { q: "Belongs to the tall, spotted animal.", a: "GIRAFFE'S" },
        { q: "The part in your mouth used for tasting.", a: "TONGUE" },
        { q: "The number 20.", a: "TWENTY" },
        { q: "Small units used to measure length.", a: "INCHES" },
        { q: "Taking up a lot of length.", a: "LONG" }
      ]
    },
    {
      id: "animals_12",
      source: "Animal Fact File",
      quote: "PENGUINS CAN'T FLY BUT THEY ARE EXCELLENT SWIMMERS",
      questions: [
        { q: "Black and white birds that live near ice.", a: "PENGUINS" },
        { q: "Short way to say 'cannot'.", a: "CAN'T" },
        { q: "To move through the air.", a: "FLY" },
        { q: "Really, really good.", a: "EXCELLENT" },
        { q: "People or animals that move through water well.", a: "SWIMMERS" }
      ]
    },
    {
      id: "animals_13",
      source: "Animal Fact File",
      quote: "A GROUP OF OWLS IS CALLED A PARLIAMENT",
      questions: [
        { q: "A bunch of things together.", a: "GROUP" },
        { q: "Belonging to, or made from.", a: "OF" },
        { q: "Birds that hunt at night.", a: "OWLS" },
        { q: "Given this name.", a: "CALLED" },
        { q: "The fancy name for a group of owls.", a: "PARLIAMENT" }
      ]
    },
    {
      id: "animals_14",
      source: "Animal Fact File",
      quote: "KANGAROOS CANNOT WALK BACKWARDS BECAUSE OF THEIR TAILS",
      questions: [
        { q: "Hopping animals from Australia.", a: "KANGAROOS" },
        { q: "To move by putting one foot in front of the other.", a: "WALK" },
        { q: "In the reverse direction.", a: "BACKWARDS" },
        { q: "Belonging to them.", a: "THEIR" },
        { q: "The long parts at the back of many animals.", a: "TAILS" }
      ]
    },
    {
      id: "animals_15",
      source: "Animal Fact File",
      quote: "A SHRIMP'S HEART IS IN ITS HEAD",
      questions: [
        { q: "Belongs to a small sea creature.", a: "SHRIMP'S" },
        { q: "The part that pumps blood.", a: "HEART" },
        { q: "Inside, not outside.", a: "IN" },
        { q: "Belonging to it.", a: "ITS" },
        { q: "The top part of a body.", a: "HEAD" }
      ]
    },
    {
      id: "animals_16",
      source: "Animal Fact File",
      quote: "A GROUP OF RHINOS IS CALLED A CRASH",
      questions: [
        { q: "A bunch of things together.", a: "GROUP" },
        { q: "Belonging to, or made from.", a: "OF" },
        { q: "Big gray animals with a horn on their nose.", a: "RHINOS" },
        { q: "Given this name.", a: "CALLED" },
        { q: "The loud name for a group of rhinos.", a: "CRASH" }
      ]
    },
    {
      id: "animals_17",
      source: "Animal Fact File",
      quote: "SEA OTTERS HOLD HANDS WHILE THEY SLEEP",
      questions: [
        { q: "Cute furry animals that swim in water.", a: "OTTERS" },
        { q: "To grip something.", a: "HOLD" },
        { q: "The parts at the end of your arms.", a: "HANDS" },
        { q: "During the same time as.", a: "WHILE" },
        { q: "To rest with your eyes closed.", a: "SLEEP" }
      ]
    },
    {
      id: "animals_18",
      source: "Animal Fact File",
      quote: "A DOG'S NOSE PRINT IS AS UNIQUE AS A HUMAN FINGERPRINT",
      questions: [
        { q: "Belongs to a common pet that barks.", a: "DOG'S" },
        { q: "The part of your face used for smelling.", a: "NOSE" },
        { q: "One of a kind, not like anything else.", a: "UNIQUE" },
        { q: "Having to do with people.", a: "HUMAN" },
        { q: "The tiny pattern on the tip of your finger.", a: "FINGERPRINT" }
      ]
    },
    {
      id: "animals_19",
      source: "Animal Fact File",
      quote: "A HUMMINGBIRD CAN FLY BACKWARDS",
      questions: [
        { q: "A small word before a noun.", a: "A" },
        { q: "A tiny, fast-flying bird known for hovering.", a: "HUMMINGBIRD" },
        { q: "To be able to.", a: "CAN" },
        { q: "To move through the air.", a: "FLY" },
        { q: "In the reverse direction.", a: "BACKWARDS" }
      ]
    },
    {
      id: "animals_20",
      source: "Animal Fact File",
      quote: "A GROUP OF JELLYFISH IS CALLED A SMACK",
      questions: [
        { q: "A bunch of things together.", a: "GROUP" },
        { q: "Belonging to, or made from.", a: "OF" },
        { q: "A soft, see-through sea creature that can sting.", a: "JELLYFISH" },
        { q: "Given this name.", a: "CALLED" },
        { q: "The funny name for a group of jellyfish.", a: "SMACK" }
      ]
    },
    {
      id: "animals_21",
      source: "Animal Fact File",
      quote: "SLOTHS ONLY POOP ONCE A WEEK",
      questions: [
        { q: "Very slow-moving animals that hang from trees.", a: "SLOTHS" },
        { q: "Just, solely.", a: "ONLY" },
        { q: "Waste that comes out of the body.", a: "POOP" },
        { q: "One single time.", a: "ONCE" },
        { q: "Seven days.", a: "WEEK" }
      ]
    },
    {
      id: "animals_22",
      source: "Animal Fact File",
      quote: "A BABY KANGAROO IS CALLED A JOEY",
      questions: [
        { q: "A very young animal or person.", a: "BABY" },
        { q: "A hopping animal from Australia.", a: "KANGAROO" },
        { q: "Given this name.", a: "CALLED" },
        { q: "The cute name for a baby kangaroo.", a: "JOEY" },
        { q: "A small word before a noun.", a: "A" }
      ]
    },
    {
      id: "animals_23",
      source: "Animal Fact File",
      quote: "TIGERS HAVE STRIPED SKIN NOT JUST STRIPED FUR",
      questions: [
        { q: "Big orange and black striped cats.", a: "TIGERS" },
        { q: "The outer layer covering your body.", a: "SKIN" },
        { q: "A word used to say no.", a: "NOT" },
        { q: "Only, simply.", a: "JUST" },
        { q: "The soft hair covering many animals.", a: "FUR" }
      ]
    },
    {
      id: "animals_24",
      source: "Animal Fact File",
      quote: "A GROUP OF PORCUPINES IS CALLED A PRICKLE",
      questions: [
        { q: "A bunch of things together.", a: "GROUP" },
        { q: "Belonging to, or made from.", a: "OF" },
        { q: "Spiky animals covered in sharp quills.", a: "PORCUPINES" },
        { q: "Given this name.", a: "CALLED" },
        { q: "The pointy name for a group of porcupines.", a: "PRICKLE" }
      ]
    },
    {
      id: "animals_25",
      source: "Animal Fact File",
      quote: "DOLPHINS SLEEP WITH ONE EYE OPEN",
      questions: [
        { q: "Smart, playful sea mammals known for clicking sounds.", a: "DOLPHINS" },
        { q: "To rest with your eyes closed.", a: "SLEEP" },
        { q: "The number 1.", a: "ONE" },
        { q: "The part of your face you see with.", a: "EYE" },
        { q: "Not closed.", a: "OPEN" }
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
    },    {
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
    },
    {
      id: "music_09",
      source: "Music Fact File",
      quote: "THE PIANO HAS EIGHTY EIGHT KEYS",
      questions: [
        { q: "A big instrument you play with black and white keys.", a: "PIANO" },
        { q: "Owns or holds.", a: "HAS" },
        { q: "The number 80.", a: "EIGHTY" },
        { q: "The number after seven.", a: "EIGHT" },
        { q: "The black and white parts you press on a piano.", a: "KEYS" }
      ]
    },
    {
      id: "music_10",
      source: "Music Fact File",
      quote: "THE VIOLIN IS THE SMALLEST STRING INSTRUMENT IN AN ORCHESTRA",
      questions: [
        { q: "A small instrument played with a bow.", a: "VIOLIN" },
        { q: "The tiniest one.", a: "SMALLEST" },
        { q: "A thin wire you can pluck or bow.", a: "STRING" },
        { q: "A tool used to make music.", a: "INSTRUMENT" },
        { q: "A big group of musicians playing together.", a: "ORCHESTRA" }
      ]
    },
    {
      id: "music_11",
      source: "Louis Armstrong, in interview",
      quote: "IF YOU HAVE TO ASK WHAT JAZZ IS YOU WILL NEVER KNOW",
      questions: [
        { q: "To own or hold.", a: "HAVE" },
        { q: "To say a question out loud.", a: "ASK" },
        { q: "A music style with a lot of improvising.", a: "JAZZ" },
        { q: "Not even one time.", a: "NEVER" },
        { q: "To understand or be aware of.", a: "KNOW" }
      ]
    },
    {
      id: "music_12",
      source: "Music Fact File",
      quote: "A GROUP OF MUSICIANS IS CALLED A BAND",
      questions: [
        { q: "A bunch of things together.", a: "GROUP" },
        { q: "Belonging to, or made from.", a: "OF" },
        { q: "People who play instruments or sing.", a: "MUSICIANS" },
        { q: "Given this name.", a: "CALLED" },
        { q: "A small group of musicians who play together.", a: "BAND" }
      ]
    },
    {
      id: "music_13",
      source: "Aretha Franklin, in interview",
      quote: "MUSIC DOES A LOT OF THINGS FOR A LOT OF PEOPLE",
      questions: [
        { q: "Sounds and songs you listen to.", a: "MUSIC" },
        { q: "Performs or carries out.", a: "DOES" },
        { q: "Objects or items.", a: "THINGS" },
        { q: "A large amount.", a: "LOT" },
        { q: "Human beings.", a: "PEOPLE" }
      ]
    },
    {
      id: "music_14",
      source: "Music Fact File",
      quote: "THE DRUM IS ONE OF THE OLDEST INSTRUMENTS IN THE WORLD",
      questions: [
        { q: "An instrument you hit to make a beat.", a: "DRUM" },
        { q: "The one that's been around the longest.", a: "OLDEST" },
        { q: "Tools used to make music.", a: "INSTRUMENTS" },
        { q: "The whole planet Earth.", a: "WORLD" },
        { q: "The number 1.", a: "ONE" }
      ]
    },
    {
      id: "music_15",
      source: "Duke Ellington, in interview",
      quote: "IF IT SOUNDS GOOD YOU ARE PLAYING IT RIGHT",
      questions: [
        { q: "Makes a certain kind of noise.", a: "SOUNDS" },
        { q: "The opposite of bad.", a: "GOOD" },
        { q: "Performing music.", a: "PLAYING" },
        { q: "Correct, not wrong.", a: "RIGHT" },
        { q: "A word for a thing already mentioned.", a: "IT" }
      ]
    },
    {
      id: "music_16",
      source: "Music Fact File",
      quote: "GUITARS USUALLY HAVE SIX STRINGS",
      questions: [
        { q: "Instruments you strum or pluck.", a: "GUITARS" },
        { q: "Most of the time.", a: "USUALLY" },
        { q: "To own or hold.", a: "HAVE" },
        { q: "The number after five.", a: "SIX" },
        { q: "Thin wires you pluck or strum.", a: "STRINGS" }
      ]
    },
    {
      id: "music_17",
      source: "Stevie Wonder, in interview",
      quote: "MUSIC IS A WORLD WITHIN ITSELF WITH A LANGUAGE WE ALL UNDERSTAND",
      questions: [
        { q: "The whole planet, or a whole space of its own.", a: "WORLD" },
        { q: "Inside of.", a: "WITHIN" },
        { q: "A way of communicating with words.", a: "LANGUAGE" },
        { q: "Every single one.", a: "ALL" },
        { q: "To know the meaning of something.", a: "UNDERSTAND" }
      ]
    },
    {
      id: "music_18",
      source: "Music Fact File",
      quote: "THE WORD ORCHESTRA COMES FROM AN ANCIENT GREEK WORD",
      questions: [
        { q: "A single unit of language, like this one.", a: "WORD" },
        { q: "A big group of musicians.", a: "ORCHESTRA" },
        { q: "Arrives, or originates.", a: "COMES" },
        { q: "Extremely old, from a long time ago.", a: "ANCIENT" },
        { q: "Related to Greece.", a: "GREEK" }
      ]
    },
    {
      id: "music_19",
      source: "Music Fact File",
      quote: "A CHOIR IS A GROUP OF SINGERS PERFORMING TOGETHER",
      questions: [
        { q: "A group that sings together, often in a church or school.", a: "CHOIR" },
        { q: "A bunch of things together.", a: "GROUP" },
        { q: "People who use their voice to make music.", a: "SINGERS" },
        { q: "Presenting a show for an audience.", a: "PERFORMING" },
        { q: "With others, as a group.", a: "TOGETHER" }
      ]
    },
    {
      id: "music_20",
      source: "Ella Fitzgerald, in interview",
      quote: "THE ONLY THING BETTER THAN SINGING IS MORE SINGING",
      questions: [
        { q: "Just, solely.", a: "ONLY" },
        { q: "An object, or something you don't need to name.", a: "THING" },
        { q: "More good than something else.", a: "BETTER" },
        { q: "Used to compare two things.", a: "THAN" },
        { q: "Using your voice to make music.", a: "SINGING" }
      ]
    },
    {
      id: "music_21",
      source: "Music Fact File",
      quote: "A TRIO IS A GROUP OF THREE MUSICIANS",
      questions: [
        { q: "A group made of exactly three.", a: "TRIO" },
        { q: "A bunch of things together.", a: "GROUP" },
        { q: "The number after two.", a: "THREE" },
        { q: "People who play instruments or sing.", a: "MUSICIANS" },
        { q: "Belonging to, or made from.", a: "OF" }
      ]
    },
    {
      id: "music_22",
      source: "Music Fact File",
      quote: "THE SAXOPHONE WAS INVENTED IN THE EIGHTEEN FORTIES",
      questions: [
        { q: "A curvy brass-like instrument common in jazz.", a: "SAXOPHONE" },
        { q: "The past form of 'is'.", a: "WAS" },
        { q: "Created for the first time.", a: "INVENTED" },
        { q: "The number 18.", a: "EIGHTEEN" },
        { q: "The decade after the thirties.", a: "FORTIES" }
      ]
    },
    {
      id: "music_23",
      source: "Elton John, in interview",
      quote: "MY MUSIC IS MY MEDICINE MY THERAPY",
      questions: [
        { q: "Sounds and songs you listen to.", a: "MUSIC" },
        { q: "A word meaning 'exists'.", a: "IS" },
        { q: "Something that helps heal or treat illness.", a: "MEDICINE" },
        { q: "Treatment meant to help someone feel better.", a: "THERAPY" },
        { q: "Belonging to me.", a: "MY" }
      ]
    },
    {
      id: "music_24",
      source: "Music Fact File",
      quote: "A CAPPELLA MEANS SINGING WITHOUT ANY INSTRUMENTS",
      questions: [
        { q: "The musical term for singing with no instruments.", a: "CAPPELLA" },
        { q: "Signifies, or refers to.", a: "MEANS" },
        { q: "Using your voice to make music.", a: "SINGING" },
        { q: "Not having something.", a: "WITHOUT" },
        { q: "Tools used to make music.", a: "INSTRUMENTS" }
      ]
    },
    {
      id: "music_25",
      source: "Music Fact File",
      quote: "A METRONOME HELPS MUSICIANS KEEP A STEADY BEAT",
      questions: [
        { q: "A ticking device that keeps a steady musical tempo.", a: "METRONOME" },
        { q: "Assists, or makes something easier.", a: "HELPS" },
        { q: "People who play instruments or sing.", a: "MUSICIANS" },
        { q: "To hold onto, or to maintain.", a: "KEEP" },
        { q: "Even and consistent, not shaky.", a: "STEADY" }
      ]
    }
  ],

  marvel: [
    {
      id: "marvel_01",
      source: "The Avengers (2012)",
      quote: "THAT'S MY SECRET CAPTAIN I'M ALWAYS ANGRY",
      questions: [
        { q: "Belonging to me.", a: "MY" },
        { q: "Something kept hidden from others.", a: "SECRET" },
        { q: "The leader of a team, or a super soldier's title.", a: "CAPTAIN" },
        { q: "Every single time, no exceptions.", a: "ALWAYS" },
        { q: "Feeling really mad.", a: "ANGRY" }
      ]
    },
    {
      id: "marvel_02",
      source: "Avengers: Infinity War (2018)",
      quote: "FINE I'LL DO IT MYSELF",
      questions: [
        { q: "Okay, acceptable.", a: "FINE" },
        { q: "Short way to say 'I will'.", a: "I'LL" },
        { q: "To perform an action.", a: "DO" },
        { q: "A word for a thing already mentioned.", a: "IT" },
        { q: "Me, and nobody else.", a: "MYSELF" }
      ]
    },
    {
      id: "marvel_03",
      source: "Captain America: Civil War (2016)",
      quote: "I CAN DO THIS ALL DAY",
      questions: [
        { q: "To be able to.", a: "CAN" },
        { q: "To perform an action.", a: "DO" },
        { q: "A word pointing to something close by.", a: "THIS" },
        { q: "Every single one.", a: "ALL" },
        { q: "24 hours, from morning to night.", a: "DAY" }
      ]
    },
    {
      id: "marvel_04",
      source: "Avengers: Infinity War (2018)",
      quote: "IN MY CULTURE DEATH IS NOT THE END",
      questions: [
        { q: "The traditions and beliefs of a group of people.", a: "CULTURE" },
        { q: "When life ends.", a: "DEATH" },
        { q: "A word used to say no.", a: "NOT" },
        { q: "A small word before a noun.", a: "THE" },
        { q: "The finish, or the last part.", a: "END" }
      ]
    },
    {
      id: "marvel_05",
      source: "Spider-Man: Into the Spider-Verse (2018)",
      quote: "ANYONE CAN WEAR THE MASK",
      questions: [
        { q: "Any person at all.", a: "ANYONE" },
        { q: "To be able to.", a: "CAN" },
        { q: "To put clothes on your body.", a: "WEAR" },
        { q: "A small word before a noun.", a: "THE" },
        { q: "A covering for your face.", a: "MASK" }
      ]
    },
    {
      id: "marvel_06",
      source: "Thor: Ragnarok (2017)",
      quote: "HE'S A FRIEND FROM WORK",
      questions: [
        { q: "Short way to say 'he is'.", a: "HE'S" },
        { q: "A small word before a noun.", a: "A" },
        { q: "Someone you like and trust.", a: "FRIEND" },
        { q: "Starting at, or originating at.", a: "FROM" },
        { q: "A job, or the place you do a job.", a: "WORK" }
      ]
    },
    {
      id: "marvel_07",
      source: "Avengers: Infinity War (2018)",
      quote: "WE'RE IN THE ENDGAME NOW",
      questions: [
        { q: "Short way to say 'we are'.", a: "WE'RE" },
        { q: "Inside, not outside.", a: "IN" },
        { q: "A small word before a noun.", a: "THE" },
        { q: "The final stage of a plan.", a: "ENDGAME" },
        { q: "At this moment, not later.", a: "NOW" }
      ]
    },
    {
      id: "marvel_08",
      source: "Amazing Fantasy #15 (Spider-Man's origin)",
      quote: "WITH GREAT POWER COMES GREAT RESPONSIBILITY",
      questions: [
        { q: "Together with, alongside.", a: "WITH" },
        { q: "Very good, or very large.", a: "GREAT" },
        { q: "Strength or the ability to control things.", a: "POWER" },
        { q: "Arrives, or follows after.", a: "COMES" },
        { q: "A duty you're in charge of.", a: "RESPONSIBILITY" }
      ]
    },
    {
      id: "marvel_09",
      source: "X-Men (2000)",
      quote: "MUTATION IT IS THE KEY TO OUR EVOLUTION",
      questions: [
        { q: "A change in genes that can create new traits.", a: "MUTATION" },
        { q: "A word for a thing already mentioned.", a: "IT" },
        { q: "The metal tool that opens locks, or something very important.", a: "KEY" },
        { q: "Belonging to us.", a: "OUR" },
        { q: "The gradual change of living things over time.", a: "EVOLUTION" }
      ]
    },
    {
      id: "marvel_10",
      source: "Avengers: Endgame (2019)",
      quote: "AND I AM IRON MAN",
      questions: [
        { q: "A word that joins two things together.", a: "AND" },
        { q: "A word for the speaker.", a: "I" },
        { q: "The word for 'to be', used with 'I'.", a: "AM" },
        { q: "A strong gray metal.", a: "IRON" },
        { q: "An adult male person.", a: "MAN" }
      ]
    },
    {
      id: "marvel_11",
      source: "Black Widow (2021)",
      quote: "SOME OF US ARE MADE OF MORE STUBBORN MATERIAL",
      questions: [
        { q: "An amount that isn't all or none.", a: "SOME" },
        { q: "A word for the speaker and others together.", a: "US" },
        { q: "Created or built.", a: "MADE" },
        { q: "Refusing to give up or change.", a: "STUBBORN" },
        { q: "The substance something is made from.", a: "MATERIAL" }
      ]
    },
    {
      id: "marvel_12",
      source: "Captain America: The Winter Soldier (2014)",
      quote: "THAT SHIELD DOES NOT BELONG TO YOU",
      questions: [
        { q: "A round piece of protective gear, like Captain America's.", a: "SHIELD" },
        { q: "Performs or carries out.", a: "DOES" },
        { q: "Properly relates to or is owned by.", a: "BELONG" },
        { q: "A small word showing direction.", a: "TO" },
        { q: "The person someone is talking to.", a: "YOU" }
      ]
    },
    {
      id: "marvel_13",
      source: "Thor (2011)",
      quote: "I AM LOKI OF ASGARD AND I AM BURDENED WITH GLORIOUS PURPOSE",
      questions: [
        { q: "The trickster god from Norse myth and Marvel films.", a: "LOKI" },
        { q: "The realm of the Norse gods in Marvel.", a: "ASGARD" },
        { q: "Weighed down by a heavy responsibility.", a: "BURDENED" },
        { q: "Wonderful and impressive.", a: "GLORIOUS" },
        { q: "The reason something is done.", a: "PURPOSE" }
      ]
    },
    {
      id: "marvel_14",
      source: "The Avengers (2012)",
      quote: "THERE WAS AN IDEA TO BRING TOGETHER A GROUP OF REMARKABLE PEOPLE",
      questions: [
        { q: "A thought or plan.", a: "IDEA" },
        { q: "To carry or lead something somewhere.", a: "BRING" },
        { q: "With others, as a group.", a: "TOGETHER" },
        { q: "Extraordinary, worth noticing.", a: "REMARKABLE" },
        { q: "Human beings.", a: "PEOPLE" }
      ]
    },
    {
      id: "marvel_15",
      source: "WandaVision (2021)",
      quote: "WHAT IS GRIEF IF NOT LOVE PERSEVERING",
      questions: [
        { q: "Deep sadness, especially after a loss.", a: "GRIEF" },
        { q: "A word used for a possible condition.", a: "IF" },
        { q: "A word used to say no.", a: "NOT" },
        { q: "A deep feeling of caring for someone.", a: "LOVE" },
        { q: "Continuing on despite difficulty.", a: "PERSEVERING" }
      ]
    },
    {
      id: "marvel_16",
      source: "Guardians of the Galaxy (2014)",
      quote: "WE ARE THE GUARDIANS OF THE GALAXY",
      questions: [
        { q: "A word for the speaker and others together.", a: "WE" },
        { q: "Protectors who watch over something.", a: "GUARDIANS" },
        { q: "Belonging to, or made from.", a: "OF" },
        { q: "A huge group of stars and planets in space.", a: "GALAXY" },
        { q: "Another way to say 'is', for many things.", a: "ARE" }
      ]
    },
    {
      id: "marvel_17",
      source: "Avengers: Age of Ultron (2015)",
      quote: "A THING IS NOT BEAUTIFUL BECAUSE IT LASTS",
      questions: [
        { q: "An object, or something you don't need to name.", a: "THING" },
        { q: "A word used to say no.", a: "NOT" },
        { q: "Very pretty or lovely.", a: "BEAUTIFUL" },
        { q: "A word used to explain why.", a: "BECAUSE" },
        { q: "Continues to exist over time.", a: "LASTS" }
      ]
    }
  ],

  games: [
    {
      id: "games_01",
      source: "Game Fact File — Persona 5",
      quote: "JOKER IS THE CODENAME OF THE PHANTOM THIEVES LEADER",
      questions: [
        { q: "A playing card, and this hero's alias in Persona 5.", a: "JOKER" },
        { q: "A secret nickname used instead of a real name.", a: "CODENAME" },
        { q: "A ghost, or something that seems to vanish and reappear.", a: "PHANTOM" },
        { q: "People who steal things.", a: "THIEVES" },
        { q: "The person in charge of a group.", a: "LEADER" }
      ]
    },
    {
      id: "games_02",
      source: "Game Fact File — Super Mario",
      quote: "MARIO IS A PLUMBER WHO WEARS A RED HAT",
      questions: [
        { q: "The mustached hero of a famous video game series.", a: "MARIO" },
        { q: "Someone who fixes pipes and sinks for a job.", a: "PLUMBER" },
        { q: "Puts clothes on their body.", a: "WEARS" },
        { q: "The color of a stop sign.", a: "RED" },
        { q: "A piece of clothing worn on your head.", a: "HAT" }
      ]
    },
    {
      id: "games_03",
      source: "Game Fact File — Devil May Cry",
      quote: "DANTE IS A DEMON HUNTER WITH A GIANT SWORD",
      questions: [
        { q: "The stylish demon-slaying hero of Devil May Cry.", a: "DANTE" },
        { q: "An evil supernatural creature.", a: "DEMON" },
        { q: "Someone who tracks down and catches things.", a: "HUNTER" },
        { q: "Really, really big.", a: "GIANT" },
        { q: "A long bladed weapon.", a: "SWORD" }
      ]
    },
    {
      id: "games_04",
      source: "Game Fact File — Grand Theft Auto",
      quote: "GRAND THEFT AUTO IS SET IN OPEN WORLD CITIES",
      questions: [
        { q: "Impressively large or important.", a: "GRAND" },
        { q: "The act of stealing.", a: "THEFT" },
        { q: "Not closed, free to explore.", a: "OPEN" },
        { q: "The whole planet, or a game's whole map.", a: "WORLD" },
        { q: "Large towns full of buildings and people.", a: "CITIES" }
      ]
    },
    {
      id: "games_05",
      source: "Game Fact File — Five Nights at Freddy's",
      quote: "FREDDY IS AN ANIMATRONIC BEAR WHO COMES ALIVE AT NIGHT",
      questions: [
        { q: "The bear mascot and namesake of a horror pizzeria game.", a: "FREDDY" },
        { q: "A robotic figure built to move like it's alive.", a: "ANIMATRONIC" },
        { q: "A big furry forest animal.", a: "BEAR" },
        { q: "Living, not turned off or gone.", a: "ALIVE" },
        { q: "The dark hours between evening and morning.", a: "NIGHT" }
      ]
    },
    {
      id: "games_06",
      source: "Game Fact File — The Legend of Zelda",
      quote: "LINK MUST RESCUE PRINCESS ZELDA FROM AN EVIL WIZARD",
      questions: [
        { q: "The green-clad hero of a famous adventure game series.", a: "LINK" },
        { q: "To save someone from danger.", a: "RESCUE" },
        { q: "The princess this game series is named after.", a: "ZELDA" },
        { q: "Very bad, wicked.", a: "EVIL" },
        { q: "A person who uses magic.", a: "WIZARD" }
      ]
    },
    {
      id: "games_07",
      source: "Game Fact File — Sonic the Hedgehog",
      quote: "SONIC IS A BLUE HEDGEHOG WHO RUNS SUPER FAST",
      questions: [
        { q: "The speedy blue video game mascot.", a: "SONIC" },
        { q: "The color of a clear sky.", a: "BLUE" },
        { q: "A small spiky-backed animal.", a: "HEDGEHOG" },
        { q: "Moves quickly on foot.", a: "RUNS" },
        { q: "Moving at high speed.", a: "FAST" }
      ]
    },
    {
      id: "games_08",
      source: "Game Fact File — Pokémon",
      quote: "TRAINERS CATCH AND BATTLE CREATURES CALLED POKEMON",
      questions: [
        { q: "People who raise and command these creatures.", a: "TRAINERS" },
        { q: "To grab hold of something.", a: "CATCH" },
        { q: "A fight or contest between two sides.", a: "BATTLE" },
        { q: "Living beings, especially unusual or fantastical ones.", a: "CREATURES" },
        { q: "The pocket monsters players collect and train.", a: "POKEMON" }
      ]
    },
    {
      id: "games_09",
      source: "Game Fact File — Minecraft",
      quote: "PLAYERS MINE BLOCKS TO BUILD ANYTHING THEY IMAGINE",
      questions: [
        { q: "People who play a game.", a: "PLAYERS" },
        { q: "To dig materials out of the ground.", a: "MINE" },
        { q: "Square-shaped building pieces.", a: "BLOCKS" },
        { q: "To construct something.", a: "BUILD" },
        { q: "To picture something in your mind.", a: "IMAGINE" }
      ]
    },
    {
      id: "games_10",
      source: "Game Fact File — Persona 5",
      quote: "PERSONA FIVE FOLLOWS A GROUP OF STUDENTS BY NIGHT",
      questions: [
        { q: "A mask-wearing alter-ego summoned in this game's battles.", a: "PERSONA" },
        { q: "Comes after, or tells the story of.", a: "FOLLOWS" },
        { q: "A bunch of people together.", a: "GROUP" },
        { q: "People who attend school.", a: "STUDENTS" },
        { q: "The dark hours between evening and morning.", a: "NIGHT" }
      ]
    },
    {
      id: "games_11",
      source: "Game Fact File — Halo",
      quote: "MASTER CHIEF IS A SUPER SOLDIER IN GREEN ARMOR",
      questions: [
        { q: "Someone highly skilled, or in charge.", a: "MASTER" },
        { q: "The leader of a group.", a: "CHIEF" },
        { q: "Extremely powerful or great.", a: "SUPER" },
        { q: "A person who serves in an army.", a: "SOLDIER" },
        { q: "Protective gear worn in battle.", a: "ARMOR" }
      ]
    },
    {
      id: "games_12",
      source: "Game Fact File — Call of Duty",
      quote: "CALL OF DUTY IS A POPULAR MILITARY SHOOTER GAME",
      questions: [
        { q: "A responsibility or task someone must do.", a: "DUTY" },
        { q: "Liked by a lot of people.", a: "POPULAR" },
        { q: "Having to do with soldiers and armies.", a: "MILITARY" },
        { q: "A game focused on aiming and firing weapons.", a: "SHOOTER" },
        { q: "Something you play for fun.", a: "GAME" }
      ]
    },
    {
      id: "games_13",
      source: "Game Fact File — Animal Crossing",
      quote: "PLAYERS DECORATE ISLANDS AND BEFRIEND CUTE VILLAGERS",
      questions: [
        { q: "To make a place look nicer with items.", a: "DECORATE" },
        { q: "Pieces of land surrounded by water.", a: "ISLANDS" },
        { q: "To become friends with someone.", a: "BEFRIEND" },
        { q: "Adorable, charming to look at.", a: "CUTE" },
        { q: "Residents of a small town or village.", a: "VILLAGERS" }
      ]
    },
    {
      id: "games_14",
      source: "Game Fact File — Among Us",
      quote: "ONE PLAYER SECRETLY BECOMES THE IMPOSTOR",
      questions: [
        { q: "Someone taking part in a game.", a: "PLAYER" },
        { q: "In a hidden way, without others knowing.", a: "SECRETLY" },
        { q: "Turns into, or starts being.", a: "BECOMES" },
        { q: "Someone secretly pretending to be someone else.", a: "IMPOSTOR" },
        { q: "The number 1.", a: "ONE" }
      ]
    },
    {
      id: "games_15",
      source: "Game Fact File — Fortnite",
      quote: "A HUNDRED PLAYERS DROP ONTO ONE ISLAND",
      questions: [
        { q: "The number 100.", a: "HUNDRED" },
        { q: "People who play a game.", a: "PLAYERS" },
        { q: "To fall or descend suddenly.", a: "DROP" },
        { q: "Moving to a position on top of something.", a: "ONTO" },
        { q: "A piece of land surrounded by water.", a: "ISLAND" }
      ]
    },
    {
      id: "games_16",
      source: "Game Fact File — Street Fighter",
      quote: "FIGHTERS FROM AROUND THE WORLD BATTLE FOR GLORY",
      questions: [
        { q: "People who fight, especially in combat games.", a: "FIGHTERS" },
        { q: "Surrounding, or in various parts of.", a: "AROUND" },
        { q: "The whole planet Earth.", a: "WORLD" },
        { q: "A fight or contest between two sides.", a: "BATTLE" },
        { q: "Great honor or fame.", a: "GLORY" }
      ]
    },
    {
      id: "games_17",
      source: "Game Fact File — Persona 5",
      quote: "THE PROTAGONISTS AWAKEN THEIR PERSONAS TO FIGHT SHADOWS",
      questions: [
        { q: "The main heroes of a story.", a: "PROTAGONISTS" },
        { q: "To wake up, or bring something to life.", a: "AWAKEN" },
        { q: "The masked alter-egos summoned in this game's battles.", a: "PERSONAS" },
        { q: "To battle or struggle against something.", a: "FIGHT" },
        { q: "Dark shapes, or the monsters in this game's world.", a: "SHADOWS" }
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
  music:   { label: "Music",   icon: "🎵", color: "#E4507E" },
  marvel:  { label: "Marvel",  icon: "🦸", color: "#C23570" },
  games:   { label: "Games",   icon: "🎮", color: "#B4569E" }
};
