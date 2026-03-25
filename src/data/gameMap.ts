export type NodeType = 'normal' | 'trap' | 'return' | 'bonus' | 'hidden' | 'start' | 'final' | 'cutscene' | 'waiting';

export interface StoryCutscene {
  title: string;
  frames: { text: string; emoji: string }[];
}

export interface GameNode {
  id: string;
  type: NodeType;
  title: string;
  storyText: string;
  question: string;
  correctAnswer: string;
  hint?: string;
  secretCode?: string;
  secretTarget?: string;
  nextOnCorrect: string;
  nextOnWrong?: string;
  nextOnWrong2?: string;
  cutscene?: StoryCutscene;
  round: 1 | 2;
  x: number;
  y: number;
}

// ===================== ROUND 1: 20 Main Nodes (No wrong routes, no secrets) =====================
// Topics: Programming, Logic, Tech GK
// Cutscene every 2 nodes

export const ROUND1_NODES: Record<string, GameNode> = {
  R1_START: {
    id: 'R1_START', type: 'start', round: 1,
    title: '🧙 THE SORTING HAT',
    storyText: 'Welcome to Hogwarts School of Witchcraft and Wizardry! The Sorting Hat has chosen you for a special quest. Dark forces have scattered magical artifacts across the castle. Only the cleverest witch or wizard can recover them all!',
    question: 'To prove you\'re worthy, tell me: What does "HTML" stand for?',
    correctAnswer: 'HYPERTEXT MARKUP LANGUAGE',
    nextOnCorrect: 'R1_N1', x: 50, y: 95,
  },
  R1_N1: {
    id: 'R1_N1', type: 'normal', round: 1,
    title: '📚 The Library',
    storyText: 'You enter the Hogwarts Library. Madam Pince eyes you suspiciously as you search the Restricted Section for clues.',
    question: 'Which programming language is known as the "language of the web"?',
    correctAnswer: 'JAVASCRIPT',
    nextOnCorrect: 'R1_N2', x: 40, y: 53,
  },
  R1_N2: {
    id: 'R1_N2', type: 'normal', round: 1,
    title: '🧪 Potions Class',
    storyText: 'Professor Snape glares at you. "Tell me... or I shall take 50 points from your house."',
    question: 'What does "CSS" stand for?',
    correctAnswer: 'CASCADING STYLE SHEETS',
    nextOnCorrect: 'R1_N3', x: 45.7, y: 62.5,
  },
  R1_N3: {
    id: 'R1_N3', type: 'normal', round: 1,
    title: '🪄 Charms Corridor',
    storyText: 'Professor Flitwick demonstrates the Levitation Charm. "Swish and flick! But first, prove your logic!"',
    question: 'What is the output of: print(2 ** 3)?',
    correctAnswer: '8',
    nextOnCorrect: 'R1_N4', x: 45.3, y: 67.7,
  },
  R1_N4: {
    id: 'R1_N4', type: 'normal', round: 1,
    title: '🏰 The Great Hall',
    storyText: 'The enchanted ceiling shows a stormy sky. A riddle floats above the staff table.',
    question: 'In Python, which keyword is used to define a function?',
    correctAnswer: 'DEF',
    nextOnCorrect: 'R1_N5', x: 35, y: 65.2,
  },
  R1_N5: {
    id: 'R1_N5', type: 'normal', round: 1,
    title: '🦉 Owlery',
    storyText: 'Hedwig hoots impatiently. An encrypted message is tied to her leg.',
    question: 'What does "API" stand for?',
    correctAnswer: 'APPLICATION PROGRAMMING INTERFACE',
    nextOnCorrect: 'R1_N6', x: 29.3, y: 60.9,
  },
  R1_N6: {
    id: 'R1_N6', type: 'normal', round: 1,
    title: '🐉 Dragon\'s Den',
    storyText: 'A Hungarian Horntail guards the next clue! You must answer quickly before it breathes fire!',
    question: 'What data structure uses FIFO (First In, First Out)?',
    correctAnswer: 'QUEUE',
    nextOnCorrect: 'R1_N7', x: 24.5, y: 54.6,
  },
  R1_N7: {
    id: 'R1_N7', type: 'normal', round: 1,
    title: '🌊 Black Lake',
    storyText: 'You dive into the Black Lake for the second task. Merpeople guard the answer.',
    question: 'What is the time complexity of binary search?',
    correctAnswer: 'O(LOG N)',
    nextOnCorrect: 'R1_N8', x: 27.7, y: 48.1,
  },
  R1_N8: {
    id: 'R1_N8', type: 'normal', round: 1,
    title: '🏠 Room of Requirement',
    storyText: 'The Room of Requirement transforms to show you exactly what you need — a coding challenge!',
    question: 'What does "SQL" stand for?',
    correctAnswer: 'STRUCTURED QUERY LANGUAGE',
    nextOnCorrect: 'R1_N9', x: 24.8, y: 45.3,
  },
  R1_N9: {
    id: 'R1_N9', type: 'normal', round: 1,
    title: '⚡ Defense Against Dark Arts',
    storyText: 'Professor Lupin teaches you the Patronus Charm. "Think of your happiest memory — and solve this!"',
    question: 'In Boolean algebra: TRUE AND FALSE = ?',
    correctAnswer: 'FALSE',
    nextOnCorrect: 'R1_N10', x: 28.1, y: 37.1,
  },
  R1_N10: {
    id: 'R1_N10', type: 'normal', round: 1,
    title: '🧊 The Pensieve',
    storyText: 'Dumbledore\'s Pensieve swirls with silver memories. You dive into a memory that holds a clue.',
    question: 'What protocol uses port 443?',
    correctAnswer: 'HTTPS',
    nextOnCorrect: 'R1_N11', x: 36.1, y: 32.7,
  },
  R1_N11: {
    id: 'R1_N11', type: 'normal', round: 1,
    title: '🗝️ Gringotts Vault',
    storyText: 'The goblins of Gringotts guard a magical artifact in Vault 713. Solve the riddle to open the vault!',
    question: 'What does "RAM" stand for?',
    correctAnswer: 'RANDOM ACCESS MEMORY',
    nextOnCorrect: 'R1_N12', x: 45.8, y: 31.3,
  },
  R1_N12: {
    id: 'R1_N12', type: 'normal', round: 1,
    title: '🪞 Mirror of Erised',
    storyText: 'The Mirror of Erised shows your deepest desire. But first, it demands an answer.',
    question: 'What is 0xFF in decimal?',
    correctAnswer: '255',
    nextOnCorrect: 'R1_N13', x: 52.5, y: 28,
  },
  R1_N13: {
    id: 'R1_N13', type: 'normal', round: 1,
    title: '🕸️ Forbidden Forest',
    storyText: 'Aragog\'s children surround you. Only a correct answer will make them retreat!',
    question: 'What data structure uses LIFO (Last In, First Out)?',
    correctAnswer: 'STACK',
    nextOnCorrect: 'R1_N14', x: 62.4, y: 31,
  },
  R1_N14: {
    id: 'R1_N14', type: 'normal', round: 1,
    title: '🧹 Quidditch Pitch',
    storyText: 'You soar on a broomstick over the Quidditch pitch. The Golden Snitch holds a riddle!',
    question: 'What keyword exits a loop in most programming languages?',
    correctAnswer: 'BREAK',
    nextOnCorrect: 'R1_N15', x: 73.5, y: 36,
  },
  R1_N15: {
    id: 'R1_N15', type: 'normal', round: 1,
    title: '🌙 Astronomy Tower',
    storyText: 'From the highest tower of Hogwarts, you can see the dark mark in the sky. A final series of challenges awaits.',
    question: 'What does "CPU" stand for?',
    correctAnswer: 'CENTRAL PROCESSING UNIT',
    nextOnCorrect: 'R1_N16', x: 77.9, y: 39.6,
  },
  R1_N16: {
    id: 'R1_N16', type: 'normal', round: 1,
    title: '🐍 Chamber Entrance',
    storyText: 'You stand before the Chamber of Secrets. The sink with the snake etching awaits your answer.',
    question: 'What logic gate outputs TRUE only when both inputs are TRUE?',
    correctAnswer: 'AND',
    nextOnCorrect: 'R1_N17', x: 83.8, y: 40.2,
  },
  R1_N17: {
    id: 'R1_N17', type: 'normal', round: 1,
    title: '💎 The Philosopher\'s Stone',
    storyText: 'You face the final protection — a logic puzzle set by Snape himself!',
    question: 'What is the default port for HTTP?',
    correctAnswer: '80',
    nextOnCorrect: 'R1_N18', x: 91.7, y: 46.5,
  },
  R1_N18: {
    id: 'R1_N18', type: 'normal', round: 1,
    title: '🔮 Divination Tower',
    storyText: 'Professor Trelawney peers into her crystal ball. "I see... a question in your near future!"',
    question: 'What does DNS stand for?',
    correctAnswer: 'DOMAIN NAME SYSTEM',
    nextOnCorrect: 'R1_N19', x: 89.4, y: 51.9,
  },
  R1_N19: {
    id: 'R1_N19', type: 'normal', round: 1,
    title: '🧬 The Time-Turner',
    storyText: 'Hermione\'s Time-Turner glows. "We need more time!" she says. Solve this to turn back time!',
    question: 'How many bits are in a byte?',
    correctAnswer: '8',
    nextOnCorrect: 'R1_N20', x: 85.8, y: 60.2,
  },
  R1_N20: {
    id: 'R1_N20', type: 'normal', round: 1,
    title: '⚡ The Elder Wand',
    storyText: 'You hold the Elder Wand! Cast the final spell to seal the dark forces away forever!',
    question: 'What is the answer to life, the universe, and everything? (Hint: Douglas Adams)',
    correctAnswer: '42',
    nextOnCorrect: 'R1_FINAL', x: 79.8, y: 69.8,
  },
  R1_FINAL: {
    id: 'R1_FINAL', type: 'waiting', round: 1,
    title: '🏆 ROUND 1 COMPLETE',
    storyText: '🎉 OUTSTANDING! You have completed Round 1!\n\n⚡ FLAG: HOGWARTS{R0UND_1_COMPLETE}\n\n🔮 Round 2 will be unlocked by the Headmaster (Admin). Please wait for further instructions...\n\nThe real battle is yet to come. Darker challenges, secret passages, and treacherous traps await in Round 2!',
    question: '', correctAnswer: '', nextOnCorrect: '',
    x: 95, y: 55,
  },
};

export const ROUND2_NODES: Record<string, GameNode> = {
  R2_START: {
    id: 'R2_START', type: 'start', round: 2,
    title: '🌑 THE DARK MARK',
    storyText: 'The Dark Mark blazes in the sky! Voldemort has returned! Round 2 begins with darker, harder challenges. For each wrong answer, you will be forced to complete TWO trap rooms consecutively to proceed.',
    question: 'What sorting algorithm has O(n log n) average time complexity and is commonly used?',
    correctAnswer: 'MERGE SORT',
    hint: 'Think divide and conquer',
    nextOnCorrect: 'R2_N2',
    nextOnWrong: 'R2_T1_1', x: 40.0, y: 82.0,
  },
  R2_T1_1: {
    id: 'R2_T1_1', type: 'trap', round: 2,
    title: '⚠️ TRAP 1.1: Whomping Willow',
    storyText: '💥 The Whomping Willow smashes you for your wrong answer! Solve this to proceed to the next trap!',
    question: 'What is 2^10?',
    correctAnswer: '1024',
    nextOnCorrect: 'R2_T1_2', x: 46, y: 90,
  },
  R2_T1_2: {
    id: 'R2_T1_2', type: 'trap', round: 2,
    title: '⚠️ TRAP 1.2: Dementor Attack',
    storyText: '❄️ Dementors swarm you! Think of a happy memory and solve this to return to your path!',
    question: 'What command shows current directory in terminal?',
    correctAnswer: 'PWD',
    nextOnCorrect: 'R2_N2', x: 54, y: 90,
  },

  R2_N2: {
    id: 'R2_N2', type: 'normal', round: 2,
    title: '🏚️ Shrieking Shack',
    storyText: 'The most haunted building in Britain holds a terrible secret. Crack the code to proceed!',
    question: 'In networking, what does TCP stand for?',
    correctAnswer: 'TRANSMISSION CONTROL PROTOCOL',
    nextOnCorrect: 'R2_N3',
    nextOnWrong: 'R2_T2_1', x: 33.9, y: 74.9,
  },
  R2_T2_1: {
    id: 'R2_T2_1', type: 'trap', round: 2,
    title: '⚠️ TRAP 2.1: Basilisk Stare',
    storyText: '🐍 The Basilisk\'s gaze petrifies you!',
    question: 'What is the largest planet in our solar system?',
    correctAnswer: 'JUPITER',
    nextOnCorrect: 'R2_T2_2', x: 54, y: 84,
  },
  R2_T2_2: {
    id: 'R2_T2_2', type: 'trap', round: 2,
    title: '⚠️ TRAP 2.2: Devil\'s Snare',
    storyText: '🌿 Devil\'s Snare wraps around you! Relax!',
    question: 'What year was the World Wide Web invented?',
    correctAnswer: '1989',
    nextOnCorrect: 'R2_N3', x: 62, y: 84,
  },

  R2_N3: {
    id: 'R2_N3', type: 'normal', round: 2,
    title: '📿 Horcrux: The Locket',
    storyText: 'Slytherin\'s Locket whispers dark temptations. Only truth can destroy it!',
    question: 'What design pattern ensures a class has only one instance?',
    correctAnswer: 'SINGLETON',
    nextOnCorrect: 'R2_N4',
    nextOnWrong: 'R2_T3_1', x: 38.7, y: 68.1,
  },
  R2_T3_1: {
    id: 'R2_T3_1', type: 'trap', round: 2,
    title: '⚠️ TRAP 3.1: Inferi Lake',
    storyText: '🧟 The Inferi drag you underwater!',
    question: 'What does JSON stand for?',
    correctAnswer: 'JAVASCRIPT OBJECT NOTATION',
    nextOnCorrect: 'R2_T3_2', x: 59, y: 78,
  },
  R2_T3_2: {
    id: 'R2_T3_2', type: 'trap', round: 2,
    title: '⚠️ TRAP 3.2: Cursed Fire',
    storyText: '🔥 Fiendfyre erupts around you!',
    question: 'What is the hexadecimal for decimal 255?',
    correctAnswer: 'FF',
    nextOnCorrect: 'R2_N4', x: 67, y: 78,
  },

  R2_N4: {
    id: 'R2_N4', type: 'normal', round: 2,
    title: '👑 Horcrux: The Diadem',
    storyText: 'Rowena Ravenclaw\'s lost diadem is hidden in the Room of Requirement!',
    question: 'What is the difference between "==" and "===" in JavaScript?',
    correctAnswer: 'TYPE COERCION',
    hint: '"===" checks type too',
    nextOnCorrect: 'R2_N5',
    nextOnWrong: 'R2_T4_1', x: 35.1, y: 64.1,
  },
  R2_T4_1: {
    id: 'R2_T4_1', type: 'trap', round: 2,
    title: '⚠️ TRAP 4.1: Vanishing Cabinet',
    storyText: '🚪 You\'re transported to Borgin & Burkes!',
    question: 'What does CRUD stand for?',
    correctAnswer: 'CREATE READ UPDATE DELETE',
    nextOnCorrect: 'R2_T4_2', x: 61, y: 73,
  },
  R2_T4_2: {
    id: 'R2_T4_2', type: 'trap', round: 2,
    title: '⚠️ TRAP 4.2: Boggart!',
    storyText: '👻 Riddikulus! The Boggart takes your worst fear!',
    question: 'What HTTP status code means "Not Found"?',
    correctAnswer: '404',
    nextOnCorrect: 'R2_N5', x: 69, y: 73,
  },

  R2_N5: {
    id: 'R2_N5', type: 'normal', round: 2,
    title: '🐍 Horcrux: Nagini',
    storyText: 'Voldemort\'s snake Nagini slithers before you. One strike with the sword will destroy this Horcrux!',
    question: 'In Git, what command creates a new branch?',
    correctAnswer: 'GIT BRANCH',
    nextOnCorrect: 'R2_N6',
    nextOnWrong: 'R2_T5_1', x: 45.3, y: 53.3,
  },
  R2_T5_1: {
    id: 'R2_T5_1', type: 'trap', round: 2,
    title: '⚠️ TRAP 5.1: Nagini Strike',
    storyText: '🐍 Nagini strikes! You barely dodge!',
    question: 'What Linux command lists files?',
    correctAnswer: 'LS',
    nextOnCorrect: 'R2_T5_2', x: 67, y: 67,
  },
  R2_T5_2: {
    id: 'R2_T5_2', type: 'trap', round: 2,
    title: '⚠️ TRAP 5.2: Crucio!',
    storyText: '⚡ The Cruciatus Curse hits you!',
    question: 'What does "OOP" stand for?',
    correctAnswer: 'OBJECT ORIENTED PROGRAMMING',
    nextOnCorrect: 'R2_N6', x: 59, y: 67,
  },

  R2_N6: {
    id: 'R2_N6', type: 'normal', round: 2,
    title: '🏆 Horcrux: The Cup',
    storyText: 'Helga Hufflepuff\'s Cup gleams with dark magic in the depths of Gringotts!',
    question: 'What is the Big O notation for accessing an element in an array by index?',
    correctAnswer: 'O(1)',
    nextOnCorrect: 'R2_N7',
    nextOnWrong: 'R2_T6_1', x: 41.3, y: 49.9,
  },
  R2_T6_1: {
    id: 'R2_T6_1', type: 'trap', round: 2,
    title: '⚠️ TRAP 6.1: Dragon Guard',
    storyText: '🐉 The Gringotts dragon breathes fire!',
    question: 'What protocol is used for sending emails?',
    correctAnswer: 'SMTP',
    nextOnCorrect: 'R2_T6_2', x: 62, y: 61,
  },
  R2_T6_2: {
    id: 'R2_T6_2', type: 'trap', round: 2,
    title: '⚠️ TRAP 6.2: Goblin Alarm',
    storyText: '🔔 The alarm sounds! Goblins swarm!',
    question: 'What does HTTPS stand for?',
    correctAnswer: 'HYPERTEXT TRANSFER PROTOCOL SECURE',
    nextOnCorrect: 'R2_N7', x: 54, y: 61,
  },

  R2_N7: {
    id: 'R2_N7', type: 'normal', round: 2,
    title: '📓 Horcrux: The Diary',
    storyText: 'Tom Riddle\'s diary drips with dark ink. Prove you\'re worthy, or be consumed!',
    question: 'What is the purpose of a "foreign key" in a database?',
    correctAnswer: 'REFERENCE ANOTHER TABLE',
    hint: 'It links tables together',
    nextOnCorrect: 'R2_N8',
    nextOnWrong: 'R2_T7_1', x: 49.1, y: 44.4,
  },
  R2_T7_1: {
    id: 'R2_T7_1', type: 'trap', round: 2,
    title: '⚠️ TRAP 7.1: Memory Trap',
    storyText: '📓 Tom Riddle traps you in a memory!',
    question: 'What year was JavaScript created?',
    correctAnswer: '1995',
    nextOnCorrect: 'R2_T7_2', x: 54, y: 55,
  },
  R2_T7_2: {
    id: 'R2_T7_2', type: 'trap', round: 2,
    title: '⚠️ TRAP 7.2: Ink Storm',
    storyText: '🖋️ Dark ink engulfs you!',
    question: 'What does "REST" stand for in REST API?',
    correctAnswer: 'REPRESENTATIONAL STATE TRANSFER',
    nextOnCorrect: 'R2_N8', x: 46, y: 55,
  },

  R2_N8: {
    id: 'R2_N8', type: 'normal', round: 2,
    title: '💍 Horcrux: The Ring',
    storyText: 'The Gaunt Ring sits on a cracked stone. The Resurrection Stone calls to you!',
    question: 'What is a "closure" in programming?',
    correctAnswer: 'FUNCTION WITH ACCESS TO OUTER SCOPE',
    nextOnCorrect: 'R2_N9',
    nextOnWrong: 'R2_T8_1', x: 54.3, y: 46.9,
  },
  R2_T8_1: {
    id: 'R2_T8_1', type: 'trap', round: 2,
    title: '⚠️ TRAP 8.1: Cursed Ring',
    storyText: '💀 The ring\'s curse spreads up your arm!',
    question: 'What CSS property makes elements flexible?',
    correctAnswer: 'DISPLAY FLEX',
    nextOnCorrect: 'R2_T8_2', x: 46, y: 49,
  },
  R2_T8_2: {
    id: 'R2_T8_2', type: 'trap', round: 2,
    title: '⚠️ TRAP 8.2: Dark Spell',
    storyText: '⚡ A dark curse rebounds!',
    question: 'What does "DOM" stand for?',
    correctAnswer: 'DOCUMENT OBJECT MODEL',
    nextOnCorrect: 'R2_N9', x: 38, y: 49,
  },

  R2_N9: {
    id: 'R2_N9', type: 'normal', round: 2,
    title: '🧙 Snape\'s Office',
    storyText: 'Among Snape\'s potions, you find a clue to destroy the final Horcruxes.',
    question: 'What is "recursion" in programming?',
    correctAnswer: 'FUNCTION CALLING ITSELF',
    nextOnCorrect: 'R2_N10',
    nextOnWrong: 'R2_T9_1', x: 59.1, y: 50.5,
  },
  R2_T9_1: {
    id: 'R2_T9_1', type: 'trap', round: 2,
    title: '⚠️ TRAP 9.1: Poison Potion',
    storyText: '☠️ You drank the wrong potion!',
    question: 'What does "MVC" stand for?',
    correctAnswer: 'MODEL VIEW CONTROLLER',
    nextOnCorrect: 'R2_T9_2', x: 41, y: 44,
  },
  R2_T9_2: {
    id: 'R2_T9_2', type: 'trap', round: 2,
    title: '⚠️ TRAP 9.2: Petrification',
    storyText: '🗿 You\'ve been petrified!',
    question: 'What is the purpose of "middleware" in web development?',
    correctAnswer: 'PROCESS REQUESTS BETWEEN CLIENT AND SERVER',
    nextOnCorrect: 'R2_N10', x: 33, y: 44,
  },

  R2_N10: {
    id: 'R2_N10', type: 'normal', round: 2,
    title: '🔥 Fiendfyre Chamber',
    storyText: 'Cursed fire rages! Only the correct answer can quench it!',
    question: 'What is the difference between GET and POST in HTTP?',
    correctAnswer: 'GET RETRIEVES POST SENDS DATA',
    nextOnCorrect: 'R2_N11',
    nextOnWrong: 'R2_T10_1', x: 70.6, y: 49.2,
  },
  R2_T10_1: {
    id: 'R2_T10_1', type: 'trap', round: 2,
    title: '⚠️ TRAP 10.1: Fire Spiral',
    storyText: '🔥 Flames close in!',
    question: 'What does "API gateway" do?',
    correctAnswer: 'ROUTES API REQUESTS',
    nextOnCorrect: 'R2_T10_2', x: 39, y: 38,
  },
  R2_T10_2: {
    id: 'R2_T10_2', type: 'trap', round: 2,
    title: '⚠️ TRAP 10.2: Smoke Screen',
    storyText: '💨 You can\'t see anything!',
    question: 'What is "responsive design"?',
    correctAnswer: 'ADAPTS TO SCREEN SIZE',
    nextOnCorrect: 'R2_N11', x: 31, y: 38,
  },

  R2_N11: {
    id: 'R2_N11', type: 'normal', round: 2,
    title: '🚪 The Locked Room',
    storyText: 'A heavy iron door blocks your path to the dungeons.',
    question: 'Which HTTP method is used to update an existing resource entirely?',
    correctAnswer: 'PUT',
    nextOnCorrect: 'R2_N12',
    nextOnWrong: 'R2_T11_1', x: 62.8, y: 56.6,
  },
  R2_T11_1: {
    id: 'R2_T11_1', type: 'trap', round: 2,
    title: '⚠️ TRAP 11.1: Collapsing Ceiling',
    storyText: '🧱 The ceiling starts coming down!',
    question: 'What does "ORM" stand for in database architecture?',
    correctAnswer: 'OBJECT RELATIONAL MAPPING',
    nextOnCorrect: 'R2_T11_2', x: 33, y: 32,
  },
  R2_T11_2: {
    id: 'R2_T11_2', type: 'trap', round: 2,
    title: '⚠️ TRAP 11.2: Moving Armor',
    storyText: '⚔️ Suits of armor swing their swords at you!',
    question: 'What specifies the layout of a flexbox container?',
    correctAnswer: 'FLEX DIRECTION',
    nextOnCorrect: 'R2_N12', x: 41, y: 32,
  },

  R2_N12: {
    id: 'R2_N12', type: 'normal', round: 2,
    title: '🌲 The Forbidden Edge',
    storyText: 'You\'ve reached the edge of the dark forest. Glimmers of deadly shadows await.',
    question: 'What is the term for a function passed as an argument to another function?',
    correctAnswer: 'CALLBACK',
    nextOnCorrect: 'R2_N13',
    nextOnWrong: 'R2_T12_1', x: 68.3, y: 63.8,
  },
  R2_T12_1: {
    id: 'R2_T12_1', type: 'trap', round: 2,
    title: '⚠️ TRAP 12.1: Acromantula Web',
    storyText: '🕸️ Huge spiders spin webs around you!',
    question: 'What is the default port for HTTPS?',
    correctAnswer: '443',
    nextOnCorrect: 'R2_T12_2', x: 38, y: 26,
  },
  R2_T12_2: {
    id: 'R2_T12_2', type: 'trap', round: 2,
    title: '⚠️ TRAP 12.2: Warning Howl',
    storyText: '🐺 A werewolf howls in the distance!',
    question: 'What does "DNS" stand for?',
    correctAnswer: 'DOMAIN NAME SYSTEM',
    nextOnCorrect: 'R2_N13', x: 46, y: 26,
  },

  R2_N13: {
    id: 'R2_N13', type: 'normal', round: 2,
    title: '🦅 Room of Requirement - D.A.',
    storyText: 'You find the remnants of Dumbledore\'s Army. The power of unity is key!',
    question: 'What data structure is typically used to implement a cache (like LRU)?',
    correctAnswer: 'HASH MAP AND DOUBLY LINKED LIST',
    nextOnCorrect: 'R2_N14',
    nextOnWrong: 'R2_T13_1', x: 80.5, y: 58.8,
  },
  R2_T13_1: {
    id: 'R2_T13_1', type: 'trap', round: 2,
    title: '⚠️ TRAP 13.1: Lost Artifacts',
    storyText: 'The room floods with forgotten objects hiding the exit!',
    question: 'What does "SSH" stand for?',
    correctAnswer: 'SECURE SHELL',
    nextOnCorrect: 'R2_T13_2', x: 46, y: 20,
  },
  R2_T13_2: {
    id: 'R2_T13_2', type: 'trap', round: 2,
    title: '⚠️ TRAP 13.2: Mirror of No Return',
    storyText: 'The mirrors trap your reflection!',
    question: 'What does "JWT" stand for?',
    correctAnswer: 'JSON WEB TOKEN',
    nextOnCorrect: 'R2_N14', x: 54, y: 20,
  },

  R2_N14: {
    id: 'R2_N14', type: 'normal', round: 2,
    title: '⚡ Courtyard Battle',
    storyText: 'The final battle is raging in the courtyard. Spells fly everywhere!',
    question: 'Which sorting algorithm repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order?',
    correctAnswer: 'BUBBLE SORT',
    nextOnCorrect: 'R2_N15',
    nextOnWrong: 'R2_T14_1', x: 82.2, y: 50.2,
  },
  R2_T14_1: {
    id: 'R2_T14_1', type: 'trap', round: 2,
    title: '⚠️ TRAP 14.1: Stray Jinx',
    storyText: '⚡ Ouch! You took a stray jinx to the knee.',
    question: 'What does "XML" stand for?',
    correctAnswer: 'EXTENSIBLE MARKUP LANGUAGE',
    nextOnCorrect: 'R2_T14_2', x: 54, y: 15,
  },
  R2_T14_2: {
    id: 'R2_T14_2', type: 'trap', round: 2,
    title: '⚠️ TRAP 14.2: Giant\'s Footstep',
    storyText: '👢 A giant almost stomps on you!',
    question: 'What is the command to initialize a new git repository?',
    correctAnswer: 'GIT INIT',
    nextOnCorrect: 'R2_N15', x: 62, y: 15,
  },

  R2_N15: {
    id: 'R2_N15', type: 'normal', round: 2,
    title: '💀 The Final Duel',
    storyText: 'Voldemort stands before you. EXPELLIARMUS vs AVADA KEDAVRA!',
    question: 'What is the time complexity of a perfectly balanced binary search tree lookup?',
    correctAnswer: 'O(LOG N)',
    nextOnCorrect: 'R2_FINAL',
    nextOnWrong: 'R2_T15_1', x: 76.9, y: 38.8,
  },
  R2_T15_1: {
    id: 'R2_T15_1', type: 'trap', round: 2,
    title: '⚠️ TRAP 15.1: Avada Kedavra Dodge',
    storyText: '⚡ You barely dodged the killing curse!',
    question: 'What defines a block of code in Python?',
    correctAnswer: 'INDENTATION',
    nextOnCorrect: 'R2_T15_2', x: 59, y: 9,
  },
  R2_T15_2: {
    id: 'R2_T15_2', type: 'trap', round: 2,
    title: '⚠️ TRAP 15.2: Wand Lock',
    storyText: '✨ Priori Incantatem! Your wands connect!',
    question: 'What symbol is used for strict equality in JavaScript?',
    correctAnswer: '===',
    nextOnCorrect: 'R2_FINAL', x: 67, y: 9,
  },

  R2_FINAL: {
    id: 'R2_FINAL', type: 'final', round: 2,
    title: '🏆 ROUND 2 COMPLETE',
    storyText: '🎉 OUTSTANDING! You have defeated Voldemort! The wizarding world is safe from the Dark Arts.',
    question: '', correctAnswer: '', nextOnCorrect: '',
    x: 60, y: 5,
  },
};

// Combined nodes for both rounds
export const GAME_NODES: Record<string, GameNode> = {
  ...ROUND1_NODES,
  ...ROUND2_NODES,
};

// Get main nodes per round for progress tracking
export const ROUND1_MAIN_NODES = Object.values(ROUND1_NODES).filter(n => n.type === 'normal' || n.type === 'start' || n.type === 'waiting').map(n => n.id);
export const ROUND2_MAIN_NODES = Object.values(ROUND2_NODES).filter(n => n.type === 'normal' || n.type === 'start' || n.type === 'final').map(n => n.id);

export interface MapEdge {
  from: string;
  to: string;
  type: 'normal' | 'trap' | 'bonus' | 'return';
}

export const MAP_EDGES: MapEdge[] = (() => {
  const edges: MapEdge[] = [];
  Object.values(GAME_NODES).forEach(node => {
    if (node.nextOnCorrect && GAME_NODES[node.nextOnCorrect]) {
      const type = node.type === 'bonus' ? 'bonus' : node.type === 'trap' ? 'trap' : node.type === 'return' ? 'return' : 'normal';
      edges.push({ from: node.id, to: node.nextOnCorrect, type });
    }
    if (node.nextOnWrong && GAME_NODES[node.nextOnWrong]) {
      edges.push({ from: node.id, to: node.nextOnWrong, type: 'trap' });
    }
    if (node.nextOnWrong2 && GAME_NODES[node.nextOnWrong2]) {
      edges.push({ from: node.id, to: node.nextOnWrong2, type: 'trap' });
    }
    if (node.secretTarget && GAME_NODES[node.secretTarget]) {
      edges.push({ from: node.id, to: node.secretTarget, type: 'bonus' });
    }
  });
  return edges;
})();
