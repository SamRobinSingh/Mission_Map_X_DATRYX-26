export interface PoolQuestion {
  id: number;
  story: string;
  question: string;
  hint: string;
  correctAnswer: string;
}

export const ROUND1_QUESTION_POOL: PoolQuestion[] = [
  { id: 1, story: "Harry is coding.", question: "He wants to store multiple values of the same type in one place and access them using positions. What is this structure called?", hint: "Indexed collection.", correctAnswer: "ARRAY" },
  { id: 2, story: "Hermione is coding.", question: "She wants to run a block of code when the if condition is false. What keyword is used with if for this?", hint: "Works with if.", correctAnswer: "ELSE" },
  { id: 3, story: "Ron made a mistake.", question: "He forgot a semicolon and got an error before running the program. What type of error is this?", hint: "Before execution.", correctAnswer: "SYNTAX" },
  { id: 4, story: "Harry wrote a function.", question: "The function performs a task but does not return any value. What type of function is this?", hint: "No return.", correctAnswer: "VOID" },
  { id: 5, story: "Hermione is storing numbers.", question: "She needs to store decimal values like 3.14. What datatype should she use?", hint: "Fractional.", correctAnswer: "FLOAT" },
  { id: 6, story: "Ron is learning operators.", question: "He uses || where only one condition needs to be true. What type of operator is this?", hint: "Either condition.", correctAnswer: "LOGICAL" },
  { id: 7, story: "Harry wrote a loop.", question: "The loop keeps running forever and never stops. What type of loop is this called?", hint: "Never ends.", correctAnswer: "INFINITE" },
  { id: 8, story: "Hermione is debugging.", question: "She wants to immediately stop a loop when a condition is met. What does break do?", hint: "Stops loop.", correctAnswer: "TERMINATE" },
  { id: 9, story: "Ron is coding a loop.", question: "He wants to skip one iteration and continue the rest. What does continue do?", hint: "Skip iteration.", correctAnswer: "SKIP" },
  { id: 10, story: "Harry compares values.", question: "He uses the symbol > to compare two values. What type of operator is this?", hint: "Relation.", correctAnswer: "RELATIONAL" },

  { id: 11, story: "Hermione changes datatype.", question: "She converts an integer value into a decimal during execution. What is this process called?", hint: "Type change.", correctAnswer: "CASTING" },
  { id: 12, story: "Ron writes a function.", question: "The function keeps calling itself again and again. What is this concept called?", hint: "Calls itself.", correctAnswer: "RECURSION" },
  { id: 13, story: "Harry declares a variable.", question: "The variable is accessible only inside the function where it is declared. What scope is this?", hint: "Limited access.", correctAnswer: "LOCAL" },
  { id: 14, story: "Hermione declares a variable.", question: "The variable can be accessed anywhere in the program. What scope is this?", hint: "Accessible everywhere.", correctAnswer: "GLOBAL" },
  { id: 15, story: "Ron runs a program.", question: "Before execution, the code is converted into machine language. What is this process called?", hint: "Before execution.", correctAnswer: "COMPILATION" },
  { id: 16, story: "Harry runs code.", question: "The code is executed line by line instead of all at once. What is this process called?", hint: "Line by line.", correctAnswer: "INTERPRETATION" },
  { id: 17, story: "Hermione builds a structure.", question: "She creates a blueprint to define objects and their behavior. What is this concept called?", hint: "OOP blueprint.", correctAnswer: "CLASS" },
  { id: 18, story: "Ron uses a class.", question: "He creates a real instance from the class that can store data and perform actions. What is this called?", hint: "Instance.", correctAnswer: "OBJECT" },
  { id: 19, story: "Harry uses conditions.", question: "He uses an operator where all conditions must be true to proceed. What type of operator is this?", hint: "Both true.", correctAnswer: "LOGICAL" },
  { id: 20, story: "Hermione stores data.", question: "She stores values as key-value pairs for fast access. What data structure is this?", hint: "Key-value.", correctAnswer: "DICTIONARY" },

  { id: 21, story: "Ron processes data.", question: "He goes through each element one by one in a collection. What is this process called?", hint: "Visit elements.", correctAnswer: "TRAVERSAL" },
  { id: 22, story: "Harry joins text.", question: "He combines two strings into one. What is this process called?", hint: "Join strings.", correctAnswer: "CONCATENATION" },
  { id: 23, story: "Hermione arranges numbers.", question: "She puts numbers in increasing or decreasing order. What is this process called?", hint: "Order values.", correctAnswer: "SORTING" },
  { id: 24, story: "Ron finds data.", question: "He checks whether a value exists in a dataset. What is this process called?", hint: "Find value.", correctAnswer: "SEARCHING" },
  { id: 25, story: "Harry updates list.", question: "He adds a new value at a specific position in a list. What is this process called?", hint: "Add element.", correctAnswer: "INSERTION" },
  { id: 26, story: "Hermione removes data.", question: "She deletes an unwanted value from a list. What is this process called?", hint: "Remove element.", correctAnswer: "DELETION" },
  { id: 27, story: "Ron writes loop.", question: "The loop checks the condition before running even once. What type of loop is this?", hint: "Condition first.", correctAnswer: "WHILE" },
  { id: 28, story: "Harry uses memory.", question: "He stores frequently used data in very fast memory. What is this memory called?", hint: "Very fast.", correctAnswer: "CACHE" },
  { id: 29, story: "Hermione handles errors.", question: "She prevents the program from crashing using special blocks. What is this process called?", hint: "Error control.", correctAnswer: "HANDLING" },
  { id: 30, story: "Ron uses datatype.", question: "He uses a datatype that stores only true or false values. What is this datatype called?", hint: "True/False.", correctAnswer: "BOOLEAN" },

  { id: 31, story: "Harry organizes data.", question: "He stores data in rows and columns for easy access. What is this structure called?", hint: "Tabular.", correctAnswer: "TABLE" },
  { id: 32, story: "Hermione secures system.", question: "She verifies user identity before allowing access. What is this process called?", hint: "Security check.", correctAnswer: "AUTHENTICATION" },
  { id: 33, story: "Ron compresses file.", question: "He reduces the size of a file for easy storage and transfer. What is this process called?", hint: "Reduce size.", correctAnswer: "COMPRESSION" },
  { id: 34, story: "Harry assigns value.", question: "He uses a symbol to store a value in a variable. What is this operator called?", hint: "Stores value.", correctAnswer: "ASSIGNMENT" },
  { id: 35, story: "Hermione plans logic.", question: "She solves a problem step by step before coding. What is this approach called?", hint: "Planning steps.", correctAnswer: "ALGORITHM" },
  { id: 36, story: "Ron runs program.", question: "Instructions execute one after another in order. What is this flow called?", hint: "Default flow.", correctAnswer: "SEQUENTIAL" },
  { id: 37, story: "Harry returns value.", question: "He sends a value back from a function to the main program. What keyword is used?", hint: "Sends result.", correctAnswer: "RETURN" },
  { id: 38, story: "Hermione accesses data.", question: "She uses position numbers starting from zero to access elements. What is this position called?", hint: "Location.", correctAnswer: "INDEX" },
  { id: 39, story: "Ron checks value.", question: "He verifies whether a value exists before continuing. What is this process called?", hint: "Verify existence.", correctAnswer: "CHECK" },
  { id: 40, story: "Harry shows result.", question: "He displays the final result on the screen. What is this action called?", hint: "Show result.", correctAnswer: "OUTPUT" }
];

export const ROUND2_QUESTION_POOL: PoolQuestion[] = [

  { 
    id: 1, 
    story: "Inside the grand library of Hogwarts School of Witchcraft and Wizardry, Hermione Granger searches for a spell in a perfectly arranged list of magical books. Instead of checking each book one by one, she repeatedly checks the middle book and eliminates half of the remaining options each time, making the search much faster.", 
    question: "What is this searching technique called?", 
    hint: "Divide search space.", 
    correctAnswer: "BINARY SEARCH" 
  },

  { 
    id: 2, 
    story: "Inside the restricted section of Hogwarts School of Witchcraft and Wizardry, Hermione Granger searches for a specific spell in a huge magical database using a special query-based language.", 
    question: "What is this command language called?", 
    hint: "Database queries.", 
    correctAnswer: "SQL" 
  },

  { 
    id: 3, 
    story: "A wizard notices that the same magical data is stored in multiple places across the system, causing confusion and inconsistency.", 
    question: "What is this problem called?", 
    hint: "Duplicate data.", 
    correctAnswer: "DATA REDUNDANCY" 
  },

  { 
    id: 4, 
    story: "At Hogwarts, multiple spells are waiting to be executed, but the most urgent spells are always executed first based on their importance.", 
    question: "What scheduling technique is this called?", 
    hint: "Urgent first.", 
    correctAnswer: "PRIORITY SCHEDULING" 
  },

  { 
    id: 5, 
    story: "A wizard converts a secret message into a coded form before sending it to ensure that no one else can understand it.", 
    question: "What is this process called?", 
    hint: "Secure message.", 
    correctAnswer: "ENCRYPTION" 
  },

  { 
    id: 6, 
    story: "Before accessing a magical system, a wizard must verify their identity using credentials.", 
    question: "What is this process called?", 
    hint: "Verify user.", 
    correctAnswer: "AUTHENTICATION" 
  },

  { 
    id: 7, 
    story: "A magical system improves its performance automatically by learning patterns from previous spell usage without being explicitly programmed.", 
    question: "What is this called?", 
    hint: "Learns patterns.", 
    correctAnswer: "MACHINE LEARNING" 
  },

  { 
    id: 8, 
    story: "While sending a magical message across a network, the message is divided into smaller pieces before transmission to ensure faster delivery.", 
    question: "What is each piece called?", 
    hint: "Small unit.", 
    correctAnswer: "PACKET" 
  },

  { 
    id: 9, 
    story: "A magical message must travel from one castle to another across a large network. There are multiple paths, and the system automatically selects the best and shortest path for faster delivery.", 
    question: "What is this process called?", 
    hint: "Best path.", 
    correctAnswer: "ROUTING" 
  },

  { 
    id: 10, 
    story: "At Hogwarts School of Witchcraft and Wizardry, Hermione Granger uses a Time Turner. One full turn takes 2 hours. She turns it 3 times forward and then 1 time backward.", 
    question: "How many hours ahead is she now?", 
    hint: "Forward minus backward.", 
    correctAnswer: "4" 
  },

  { 
    id: 11, 
    story: "In Potions class, Severus Snape prepares a mixture where ingredients are in the ratio 2:3. The total mixture weighs 50 grams.", 
    question: "How much of the second ingredient is needed?", 
    hint: "Ratio share.", 
    correctAnswer: "30" 
  },

  { 
    id: 12, 
    story: "At Hogwarts, Gryffindor earns 10 points per task. They complete 8 tasks but lose 15 points due to a mistake.", 
    question: "What is their final score?", 
    hint: "Earn minus loss.", 
    correctAnswer: "65" 
  },

  { 
    id: 13, 
    story: "Harry Potter can cast 5 spells in 10 seconds. His speed remains constant during practice.", 
    question: "How many spells can he cast in 1 minute?", 
    hint: "Scale time.", 
    correctAnswer: "30" 
  },

  { 
    id: 14, 
    story: "While practicing a loop spell, Hermione Granger writes a program to print numbers from 1 to 3, but accidentally places a semicolon immediately after the loop declaration, causing unexpected behavior.", 
    question: "What is the mistake in the loop?", 
    hint: "Extra symbol.", 
    correctAnswer: "SEMICOLON" 
  },

  { 
    id: 15, 
    story: "While running a loop in Hogwarts, Harry Potter writes a while loop but forgets to update the loop variable, causing the loop to run endlessly.", 
    question: "What type of loop is this?", 
    hint: "Never ends.", 
    correctAnswer: "INFINITE" 
  }

];

export const EXTRA_NODE_QUESTION_POOL: PoolQuestion[] = [
  // ===== SET 1 (1–50) =====
  { id: 1, story: "Harry is coding.", question: "He wants to store only one character like 'A'. What datatype should he use?", hint: "Single letter.", correctAnswer: "CHAR" },
  { id: 2, story: "Hermione writes code.", question: "She wants to repeat a block of code 5 times. What concept should she use?", hint: "Repeat.", correctAnswer: "LOOP" },
  { id: 3, story: "Ron tests code.", question: "He gets an error while the program is running. What type of error is this?", hint: "During execution.", correctAnswer: "RUNTIME" },
  { id: 4, story: "Harry writes a program.", question: "He wants to take input from the user in C. What function is used?", hint: "Input function.", correctAnswer: "SCANF" },
  { id: 5, story: "Hermione displays output.", question: "She prints text on the screen in C. What function is used?", hint: "Display.", correctAnswer: "PRINTF" },
  { id: 6, story: "Ron uses condition.", question: "He checks if two values are equal using a symbol. What symbol is used?", hint: "Equal check.", correctAnswer: "==" },
  { id: 7, story: "Harry works with values.", question: "He stores text like 'Hello'. What datatype is used?", hint: "Text.", correctAnswer: "STRING" },
  { id: 8, story: "Hermione uses loops.", question: "She wants the loop to run at least once before checking condition. What loop is this?", hint: "Runs once.", correctAnswer: "DO-WHILE" },
  { id: 9, story: "Ron writes code.", question: "He forgets to declare a variable before using it. What type of error is this?", hint: "Code mistake.", correctAnswer: "SYNTAX" },
  { id: 10, story: "Harry calculates.", question: "He subtracts two numbers. What operation is this?", hint: "Minus.", correctAnswer: "SUBTRACTION" },

  { id: 11, story: "Hermione checks condition.", question: "She wants to check multiple conditions and all must be true. Which operator is used?", hint: "Both true.", correctAnswer: "AND" },
  { id: 12, story: "Ron checks condition.", question: "He wants only one condition to be true. Which operator is used?", hint: "Either.", correctAnswer: "OR" },
  { id: 13, story: "Harry uses loop.", question: "He knows how many times the loop should run. Which loop is best?", hint: "Count loop.", correctAnswer: "FOR" },
  { id: 14, story: "Hermione stores data.", question: "She stores values in rows and columns in a file. What is this called?", hint: "Table.", correctAnswer: "TABLE" },
  { id: 15, story: "Ron saves program.", question: "He stores his code file permanently. What is this called?", hint: "Save.", correctAnswer: "STORAGE" },
  { id: 16, story: "Harry checks number.", question: "He checks if number is less than another using <. What type of operator is this?", hint: "Compare.", correctAnswer: "RELATIONAL" },
  { id: 17, story: "Hermione repeats code.", question: "She uses a loop that runs until condition becomes false. What is this?", hint: "Condition loop.", correctAnswer: "WHILE" },
  { id: 18, story: "Ron edits code.", question: "He removes mistakes from his program. What is this process called?", hint: "Fix.", correctAnswer: "DEBUGGING" },
  { id: 19, story: "Harry organizes code.", question: "He writes reusable blocks of code. What are these called?", hint: "Reusable.", correctAnswer: "FUNCTION" },
  { id: 20, story: "Hermione works on logic.", question: "She creates step-by-step solution before coding. What is this called?", hint: "Steps.", correctAnswer: "ALGORITHM" },

  { id: 21, story: "Ron uses array.", question: "He accesses elements using position numbers. What is this position called?", hint: "Location.", correctAnswer: "INDEX" },
  { id: 22, story: "Harry uses memory.", question: "He uses temporary memory while program runs. What is this memory called?", hint: "Temporary.", correctAnswer: "RAM" },
  { id: 23, story: "Hermione writes code.", question: "She writes notes inside code for explanation. What is this called?", hint: "Notes.", correctAnswer: "COMMENT" },
  { id: 24, story: "Ron checks value.", question: "He checks if value is not equal using !=. What is this operator?", hint: "Not equal.", correctAnswer: "RELATIONAL" },
  { id: 25, story: "Harry uses keyboard.", question: "He enters data into the program. What is this process called?", hint: "Enter.", correctAnswer: "INPUT" },
  { id: 26, story: "Hermione sees result.", question: "She views result on screen. What is this called?", hint: "Display.", correctAnswer: "OUTPUT" },
  { id: 27, story: "Ron connects system.", question: "He connects to global network. What is this called?", hint: "Worldwide.", correctAnswer: "INTERNET" },
  { id: 28, story: "Harry protects system.", question: "He uses a secret code to secure account. What is this called?", hint: "Security.", correctAnswer: "PASSWORD" },
  { id: 29, story: "Hermione sends message.", question: "She hides message before sending. What is this called?", hint: "Secret.", correctAnswer: "ENCRYPTION" },
  { id: 30, story: "Ron checks user.", question: "He verifies identity before access. What is this called?", hint: "Verify.", correctAnswer: "AUTHENTICATION" },

  { id: 31, story: "Harry uses browser.", question: "He opens websites using software. What is this software called?", hint: "Web app.", correctAnswer: "BROWSER" },
  { id: 32, story: "Hermione stores many values.", question: "She uses a structure to store multiple values. What is this?", hint: "Collection.", correctAnswer: "ARRAY" },
  { id: 33, story: "Ron sorts data.", question: "He arranges numbers in order. What is this called?", hint: "Arrange.", correctAnswer: "SORTING" },
  { id: 34, story: "Harry finds data.", question: "He looks for a value in list. What is this called?", hint: "Find.", correctAnswer: "SEARCHING" },
  { id: 35, story: "Hermione removes value.", question: "She deletes an element from list. What is this called?", hint: "Remove.", correctAnswer: "DELETION" },
  { id: 36, story: "Ron adds value.", question: "He inserts new element in list. What is this called?", hint: "Add.", correctAnswer: "INSERTION" },
  { id: 37, story: "Harry joins text.", question: "He combines two strings. What is this called?", hint: "Join.", correctAnswer: "CONCATENATION" },
  { id: 38, story: "Hermione uses true/false.", question: "She uses datatype with only two values. What is this?", hint: "Yes/No.", correctAnswer: "BOOLEAN" },
  { id: 39, story: "Ron runs program.", question: "Instructions execute one after another. What is this flow called?", hint: "Order.", correctAnswer: "SEQUENTIAL" },
  { id: 40, story: "Harry shows output.", question: "He prints result on screen. What function is used in C?", hint: "Display.", correctAnswer: "PRINTF" },

  { id: 41, story: "Hermione reads input.", question: "She takes user input in C. What function is used?", hint: "Input.", correctAnswer: "SCANF" },
  { id: 42, story: "Ron writes program.", question: "He writes instructions for computer. What is this called?", hint: "Code.", correctAnswer: "PROGRAM" },
  { id: 43, story: "Harry uses symbol.", question: "He uses symbols like +, -, *. What are these called?", hint: "Math signs.", correctAnswer: "OPERATORS" },
  { id: 44, story: "Hermione uses condition.", question: "She checks if value is greater or smaller. What is this called?", hint: "Compare.", correctAnswer: "RELATIONAL" },
  { id: 45, story: "Ron stores number.", question: "He stores data in a named location. What is this called?", hint: "Storage name.", correctAnswer: "VARIABLE" },
  { id: 46, story: "Harry uses fast memory.", question: "He uses very fast small memory in CPU. What is this called?", hint: "Fast.", correctAnswer: "CACHE" },
  { id: 47, story: "Hermione fixes code.", question: "She corrects errors in program. What is this called?", hint: "Fix.", correctAnswer: "DEBUGGING" },
  { id: 48, story: "Ron plans steps.", question: "He solves problem step by step. What is this called?", hint: "Steps.", correctAnswer: "ALGORITHM" },
  { id: 49, story: "Harry uses flowchart.", question: "He draws diagram of logic. What is this called?", hint: "Diagram.", correctAnswer: "FLOWCHART" },
  { id: 50, story: "Hermione saves data.", question: "She stores data permanently. What is this called?", hint: "Long term.", correctAnswer: "STORAGE" },

  // ===== SET 2 (51–100) =====
  { id: 51, story: "Harry is thinking.", question: "What is the capital of India?", hint: "City.", correctAnswer: "NEW DELHI" },
  { id: 52, story: "Hermione studies science.", question: "Which planet is known as the Red Planet?", hint: "Space.", correctAnswer: "MARS" },
  { id: 53, story: "Ron solves math.", question: "What is 15 + 5?", hint: "Add.", correctAnswer: "20" },
  { id: 54, story: "Harry looks at time.", question: "How many seconds are in a minute?", hint: "Time.", correctAnswer: "60" },
  { id: 55, story: "Hermione studies animals.", question: "Which animal is known as the fastest land animal?", hint: "Speed.", correctAnswer: "CHEETAH" },

  { id: 56, story: "Ron studies coding.", question: "What do we call a value that can change during a program?", hint: "Change.", correctAnswer: "VARIABLE" },
  { id: 57, story: "Harry uses logic.", question: "What is 10 × 2?", hint: "Multiply.", correctAnswer: "20" },
  { id: 58, story: "Hermione studies geography.", question: "Which is the largest ocean in the world?", hint: "Water.", correctAnswer: "PACIFIC" },
  { id: 59, story: "Ron studies body.", question: "Which organ helps us think?", hint: "Mind.", correctAnswer: "BRAIN" },
  { id: 60, story: "Harry studies weather.", question: "What do we call water falling from clouds?", hint: "Rain.", correctAnswer: "RAIN" },

  { id: 61, story: "Hermione uses data.", question: "What do we call storing multiple values in one structure using positions?", hint: "Indexed.", correctAnswer: "ARRAY" },
  { id: 62, story: "Ron studies history.", question: "Who is known as the Father of the Nation in India?", hint: "Leader.", correctAnswer: "GANDHI" },
  { id: 63, story: "Harry studies shapes.", question: "How many sides does a square have?", hint: "Shape.", correctAnswer: "4" },
  { id: 64, story: "Hermione studies food.", question: "Which vitamin do we get from sunlight?", hint: "Sun.", correctAnswer: "VITAMIN D" },
  { id: 65, story: "Ron studies tech.", question: "What is the brain of the computer called?", hint: "Main part.", correctAnswer: "CPU" },

  { id: 66, story: "Harry uses loop.", question: "What do we call repeating a block of code?", hint: "Repeat.", correctAnswer: "LOOP" },
  { id: 67, story: "Hermione studies math.", question: "What is 100 ÷ 10?", hint: "Divide.", correctAnswer: "10" },
  { id: 68, story: "Ron studies world.", question: "Which country is known as the Land of Rising Sun?", hint: "Asia.", correctAnswer: "JAPAN" },
  { id: 69, story: "Harry studies transport.", question: "Which vehicle flies in the sky?", hint: "Air.", correctAnswer: "AIRPLANE" },
  { id: 70, story: "Hermione studies logic.", question: "What is a step-by-step solution to a problem called?", hint: "Steps.", correctAnswer: "ALGORITHM" },

  { id: 71, story: "Ron studies animals.", question: "Which animal is called the Ship of the Desert?", hint: "Desert.", correctAnswer: "CAMEL" },
  { id: 72, story: "Harry studies coding.", question: "What do we call fixing errors in a program?", hint: "Fix.", correctAnswer: "DEBUGGING" },
  { id: 73, story: "Hermione studies time.", question: "How many days are there in a week?", hint: "Week.", correctAnswer: "7" },
  { id: 74, story: "Ron studies numbers.", question: "What is 9 × 9?", hint: "Multiply.", correctAnswer: "81" },
  { id: 75, story: "Harry studies nature.", question: "What gas do plants take in from air?", hint: "Plants.", correctAnswer: "CARBON DIOXIDE" },

  { id: 76, story: "Hermione uses condition.", question: "What do we call checking a condition in a program?", hint: "Decision.", correctAnswer: "CONDITIONAL" },
  { id: 77, story: "Ron studies sports.", question: "How many players are there in a cricket team?", hint: "Team.", correctAnswer: "11" },
  { id: 78, story: "Harry studies space.", question: "What is the natural satellite of Earth?", hint: "Night.", correctAnswer: "MOON" },
  { id: 79, story: "Hermione studies computer.", question: "What device is used to display output?", hint: "Screen.", correctAnswer: "MONITOR" },
  { id: 80, story: "Ron studies internet.", question: "What is a global network of computers called?", hint: "Web.", correctAnswer: "INTERNET" },

  { id: 81, story: "Harry studies math.", question: "What is 50 + 25?", hint: "Add.", correctAnswer: "75" },
  { id: 82, story: "Hermione studies geography.", question: "Which is the largest continent?", hint: "Land.", correctAnswer: "ASIA" },
  { id: 83, story: "Ron studies body.", question: "Which organ pumps blood?", hint: "Body.", correctAnswer: "HEART" },
  { id: 84, story: "Harry studies coding.", question: "What do we call storing value using = ?", hint: "Store.", correctAnswer: "ASSIGNMENT" },
  { id: 85, story: "Hermione studies shapes.", question: "What shape has no corners?", hint: "Round.", correctAnswer: "CIRCLE" },

  { id: 86, story: "Ron studies world.", question: "Which is the longest river in the world?", hint: "River.", correctAnswer: "NILE" },
  { id: 87, story: "Harry studies logic.", question: "What do we call combining two strings into one?", hint: "Join.", correctAnswer: "CONCATENATION" },
  { id: 88, story: "Hermione studies animals.", question: "Which animal is known as man's best friend?", hint: "Pet.", correctAnswer: "DOG" },
  { id: 89, story: "Ron studies math.", question: "What is 12 × 4?", hint: "Multiply.", correctAnswer: "48" },
  { id: 90, story: "Harry studies program.", question: "What do we call a set of instructions for a computer?", hint: "Code.", correctAnswer: "PROGRAM" },

  { id: 91, story: "Hermione studies food.", question: "Which fruit is known for keeping doctors away?", hint: "Health.", correctAnswer: "APPLE" },
  { id: 92, story: "Ron studies tech.", question: "What do we call temporary memory in a computer?", hint: "Temp.", correctAnswer: "RAM" },
  { id: 93, story: "Harry studies time.", question: "How many months are in a year?", hint: "Year.", correctAnswer: "12" },
  { id: 94, story: "Hermione studies security.", question: "What do we call verifying user identity?", hint: "Verify.", correctAnswer: "AUTHENTICATION" },
  { id: 95, story: "Ron studies coding.", question: "What do we call storing true or false values?", hint: "Yes/No.", correctAnswer: "BOOLEAN" },

  { id: 96, story: "Harry studies geography.", question: "Which is the smallest continent?", hint: "Small.", correctAnswer: "AUSTRALIA" },
  { id: 97, story: "Hermione studies logic.", question: "What do we call arranging data in order?", hint: "Arrange.", correctAnswer: "SORTING" },
  { id: 98, story: "Ron studies search.", question: "What do we call finding a value in data?", hint: "Find.", correctAnswer: "SEARCHING" },
  { id: 99, story: "Harry studies tech.", question: "What software is used to open websites?", hint: "Web.", correctAnswer: "BROWSER" },
  { id: 100, story: "Hermione studies storage.", question: "What do we call saving data permanently?", hint: "Save.", correctAnswer: "STORAGE" }
];
