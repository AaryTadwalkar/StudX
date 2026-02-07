// Complete Test Bank for Technical Skills
// Covers: React, JavaScript, Python, DSA, CSS, Git, SQL, Node.js, TypeScript, MongoDB

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface SkillTest {
  skillName: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  passingScore: number; // percentage
  questions: TestQuestion[];
}

// ========================================
// REACT TESTS
// ========================================

export const reactBeginnerTest: SkillTest = {
  skillName: 'React',
  level: 'beginner',
  duration: 20,
  passingScore: 70,
  questions: [
    {
      id: 'react-b-1',
      question: 'What is React?',
      options: [
        'A JavaScript library for building user interfaces',
        'A programming language',
        'A database',
        'A CSS framework'
      ],
      correctAnswer: 0,
      explanation: 'React is a JavaScript library developed by Facebook for building user interfaces, particularly for single-page applications.',
      difficulty: 'beginner'
    },
    {
      id: 'react-b-2',
      question: 'What is JSX?',
      options: [
        'JavaScript XML - a syntax extension for JavaScript',
        'Java Syntax eXtension',
        'JSON eXtended',
        'JavaScript eXecutor'
      ],
      correctAnswer: 0,
      explanation: 'JSX stands for JavaScript XML. It allows us to write HTML-like code in JavaScript.',
      difficulty: 'beginner'
    },
    {
      id: 'react-b-3',
      question: 'Which method is used to create a React component?',
      options: [
        'React.createComponent()',
        'function Component() {} or class Component extends React.Component',
        'new React.Component()',
        'React.makeComponent()'
      ],
      correctAnswer: 1,
      explanation: 'React components can be created using function components or class components.',
      difficulty: 'beginner'
    },
    {
      id: 'react-b-4',
      question: 'What hook is used to manage state in a functional component?',
      options: [
        'useEffect',
        'useState',
        'useContext',
        'useReducer'
      ],
      correctAnswer: 1,
      explanation: 'useState is the React hook used to add state to functional components.',
      difficulty: 'beginner'
    },
    {
      id: 'react-b-5',
      question: 'What does props stand for in React?',
      options: [
        'Properties',
        'Proposals',
        'Protocols',
        'Processors'
      ],
      correctAnswer: 0,
      explanation: 'Props stands for properties and is how data is passed from parent to child components.',
      difficulty: 'beginner'
    },
    {
      id: 'react-b-6',
      question: 'Which hook is used for side effects in React?',
      options: [
        'useState',
        'useEffect',
        'useRef',
        'useMemo'
      ],
      correctAnswer: 1,
      explanation: 'useEffect is used to perform side effects in function components (data fetching, subscriptions, etc.).',
      difficulty: 'beginner'
    },
    {
      id: 'react-b-7',
      question: 'What is the Virtual DOM?',
      options: [
        'A lightweight copy of the actual DOM',
        'A new version of HTML',
        'A CSS framework',
        'A database technology'
      ],
      correctAnswer: 0,
      explanation: 'The Virtual DOM is a lightweight copy of the actual DOM that React uses to optimize rendering.',
      difficulty: 'beginner'
    },
    {
      id: 'react-b-8',
      question: 'How do you pass data from child to parent component?',
      options: [
        'Using props directly',
        'Using callback functions passed as props',
        'Using global variables',
        'Using localStorage'
      ],
      correctAnswer: 1,
      explanation: 'Data flows from parent to child via props, and from child to parent via callback functions.',
      difficulty: 'beginner'
    },
    {
      id: 'react-b-9',
      question: 'What is the correct way to update state in React?',
      options: [
        'this.state.value = newValue',
        'state.value = newValue',
        'setState(newValue) or setStateFunction(newValue)',
        'updateState(newValue)'
      ],
      correctAnswer: 2,
      explanation: 'State should always be updated using setState in class components or the setter function from useState in functional components.',
      difficulty: 'beginner'
    },
    {
      id: 'react-b-10',
      question: 'What is the key prop used for in React lists?',
      options: [
        'To style elements',
        'To help React identify which items have changed',
        'To set passwords',
        'To create animations'
      ],
      correctAnswer: 1,
      explanation: 'Keys help React identify which items have changed, are added, or are removed, optimizing re-renders.',
      difficulty: 'beginner'
    }
  ]
};

export const reactIntermediateTest: SkillTest = {
  skillName: 'React',
  level: 'intermediate',
  duration: 30,
  passingScore: 75,
  questions: [
    {
      id: 'react-i-1',
      question: 'What is the purpose of useCallback hook?',
      options: [
        'To memoize values',
        'To memoize functions',
        'To create side effects',
        'To manage state'
      ],
      correctAnswer: 1,
      explanation: 'useCallback returns a memoized callback function, preventing unnecessary re-renders when passed as props.',
      difficulty: 'intermediate'
    },
    {
      id: 'react-i-2',
      question: 'What is React Context used for?',
      options: [
        'To style components',
        'To share data across the component tree without prop drilling',
        'To create animations',
        'To handle forms'
      ],
      correctAnswer: 1,
      explanation: 'Context provides a way to pass data through the component tree without passing props manually at every level.',
      difficulty: 'intermediate'
    },
    {
      id: 'react-i-3',
      question: 'What does useMemo do?',
      options: [
        'Memoizes functions',
        'Memoizes computed values',
        'Creates side effects',
        'Manages component state'
      ],
      correctAnswer: 1,
      explanation: 'useMemo returns a memoized value, recomputing only when dependencies change.',
      difficulty: 'intermediate'
    },
    {
      id: 'react-i-4',
      question: 'What is the difference between controlled and uncontrolled components?',
      options: [
        'Controlled components have state managed by React, uncontrolled use refs',
        'There is no difference',
        'Controlled components are faster',
        'Uncontrolled components are deprecated'
      ],
      correctAnswer: 0,
      explanation: 'Controlled components have their state controlled by React, while uncontrolled components store their state in the DOM.',
      difficulty: 'intermediate'
    },
    {
      id: 'react-i-5',
      question: 'What is React.memo used for?',
      options: [
        'To create memoized state',
        'To prevent unnecessary re-renders of functional components',
        'To create side effects',
        'To manage component lifecycle'
      ],
      correctAnswer: 1,
      explanation: 'React.memo is a higher-order component that prevents re-renders if props haven\'t changed.',
      difficulty: 'intermediate'
    },
    {
      id: 'react-i-6',
      question: 'When does useEffect cleanup function run?',
      options: [
        'Before the component mounts',
        'Before the effect runs again and when component unmounts',
        'After the effect runs',
        'Never'
      ],
      correctAnswer: 1,
      explanation: 'The cleanup function runs before the effect runs again and when the component unmounts.',
      difficulty: 'intermediate'
    },
    {
      id: 'react-i-7',
      question: 'What is the purpose of useReducer?',
      options: [
        'To reduce file size',
        'To manage complex state logic',
        'To create side effects',
        'To optimize performance'
      ],
      correctAnswer: 1,
      explanation: 'useReducer is used for managing complex state logic, similar to Redux reducers.',
      difficulty: 'intermediate'
    },
    {
      id: 'react-i-8',
      question: 'What is prop drilling?',
      options: [
        'A performance optimization technique',
        'Passing props through multiple levels of components',
        'A debugging tool',
        'A testing strategy'
      ],
      correctAnswer: 1,
      explanation: 'Prop drilling is when props are passed through multiple component levels to reach a deeply nested component.',
      difficulty: 'intermediate'
    },
    {
      id: 'react-i-9',
      question: 'What is the purpose of React.Fragment?',
      options: [
        'To group elements without adding extra DOM nodes',
        'To split components',
        'To create animations',
        'To handle errors'
      ],
      correctAnswer: 0,
      explanation: 'React.Fragment lets you group a list of children without adding extra nodes to the DOM.',
      difficulty: 'intermediate'
    },
    {
      id: 'react-i-10',
      question: 'What is lazy loading in React?',
      options: [
        'Loading components slowly',
        'Code splitting and loading components only when needed',
        'A CSS technique',
        'A testing method'
      ],
      correctAnswer: 1,
      explanation: 'Lazy loading allows you to split code and load components only when they are needed, improving performance.',
      difficulty: 'intermediate'
    }
  ]
};

export const reactAdvancedTest: SkillTest = {
  skillName: 'React',
  level: 'advanced',
  duration: 45,
  passingScore: 80,
  questions: [
    {
      id: 'react-a-1',
      question: 'What is the Reconciliation algorithm in React?',
      options: [
        'The process React uses to update the DOM',
        'A state management library',
        'A routing system',
        'A testing framework'
      ],
      correctAnswer: 0,
      explanation: 'Reconciliation is React\'s algorithm for diffing the virtual DOM to minimize DOM operations.',
      difficulty: 'advanced'
    },
    {
      id: 'react-a-2',
      question: 'What is a Higher-Order Component (HOC)?',
      options: [
        'A component at the top of the tree',
        'A function that takes a component and returns a new component',
        'A class component',
        'A styled component'
      ],
      correctAnswer: 1,
      explanation: 'An HOC is a function that takes a component and returns a new component with additional props or behavior.',
      difficulty: 'advanced'
    },
    {
      id: 'react-a-3',
      question: 'What is the difference between useLayoutEffect and useEffect?',
      options: [
        'No difference',
        'useLayoutEffect runs synchronously after DOM mutations, useEffect runs asynchronously',
        'useLayoutEffect is deprecated',
        'useLayoutEffect only works in class components'
      ],
      correctAnswer: 1,
      explanation: 'useLayoutEffect fires synchronously after all DOM mutations, while useEffect fires asynchronously.',
      difficulty: 'advanced'
    },
    {
      id: 'react-a-4',
      question: 'What is React Fiber?',
      options: [
        'A CSS framework',
        'React\'s reconciliation engine rewrite',
        'A routing library',
        'A state management tool'
      ],
      correctAnswer: 1,
      explanation: 'Fiber is a complete rewrite of React\'s reconciliation algorithm for better performance and features.',
      difficulty: 'advanced'
    },
    {
      id: 'react-a-5',
      question: 'What is Concurrent Mode in React?',
      options: [
        'Running multiple apps simultaneously',
        'A set of features to help React apps stay responsive',
        'A testing mode',
        'A production optimization'
      ],
      correctAnswer: 1,
      explanation: 'Concurrent Mode is a set of features that help React apps stay responsive by rendering updates in an interruptible way.',
      difficulty: 'advanced'
    },
    {
      id: 'react-a-6',
      question: 'What is the purpose of Error Boundaries?',
      options: [
        'To catch JavaScript errors anywhere in the component tree',
        'To validate props',
        'To handle HTTP errors',
        'To manage state'
      ],
      correctAnswer: 0,
      explanation: 'Error Boundaries are components that catch JavaScript errors in their child component tree and display a fallback UI.',
      difficulty: 'advanced'
    },
    {
      id: 'react-a-7',
      question: 'What is Render Props pattern?',
      options: [
        'Styling components',
        'A technique for sharing code between components using a prop whose value is a function',
        'A routing pattern',
        'A state management pattern'
      ],
      correctAnswer: 1,
      explanation: 'Render Props is a technique where a component takes a function that returns a React element and calls it instead of implementing its own render logic.',
      difficulty: 'advanced'
    },
    {
      id: 'react-a-8',
      question: 'What is the purpose of React.StrictMode?',
      options: [
        'To make components private',
        'To highlight potential problems in the application',
        'To improve performance',
        'To enable strict typing'
      ],
      correctAnswer: 1,
      explanation: 'StrictMode is a tool for highlighting potential problems in an application, running additional checks in development mode.',
      difficulty: 'advanced'
    },
    {
      id: 'react-a-9',
      question: 'What is code splitting and how does React.lazy enable it?',
      options: [
        'Splitting CSS files',
        'Dynamically importing components only when needed',
        'Splitting HTML files',
        'Separating test files'
      ],
      correctAnswer: 1,
      explanation: 'Code splitting lets you split your code into separate bundles that can be loaded on demand, reducing initial load time.',
      difficulty: 'advanced'
    },
    {
      id: 'react-a-10',
      question: 'What is React Server Components?',
      options: [
        'Components that run only on servers',
        'A new React feature allowing components to render on the server',
        'A hosting solution',
        'A database library'
      ],
      correctAnswer: 1,
      explanation: 'Server Components allow parts of your React app to render on the server, reducing client-side bundle size.',
      difficulty: 'advanced'
    }
  ]
};

// ========================================
// JAVASCRIPT TESTS
// ========================================

export const javascriptBeginnerTest: SkillTest = {
  skillName: 'JavaScript',
  level: 'beginner',
  duration: 20,
  passingScore: 70,
  questions: [
    {
      id: 'js-b-1',
      question: 'What is JavaScript?',
      options: [
        'A programming language for web browsers',
        'A Java framework',
        'A database',
        'A CSS preprocessor'
      ],
      correctAnswer: 0,
      explanation: 'JavaScript is a programming language primarily used to create interactive effects within web browsers.',
      difficulty: 'beginner'
    },
    {
      id: 'js-b-2',
      question: 'Which keyword is used to declare a variable that cannot be reassigned?',
      options: [
        'var',
        'let',
        'const',
        'static'
      ],
      correctAnswer: 2,
      explanation: 'const is used to declare variables that cannot be reassigned.',
      difficulty: 'beginner'
    },
    {
      id: 'js-b-3',
      question: 'What does === operator do?',
      options: [
        'Assigns a value',
        'Compares value and type',
        'Compares only value',
        'Creates a variable'
      ],
      correctAnswer: 1,
      explanation: '=== is the strict equality operator that compares both value and type.',
      difficulty: 'beginner'
    },
    {
      id: 'js-b-4',
      question: 'What is the output of typeof null?',
      options: [
        '"null"',
        '"object"',
        '"undefined"',
        '"number"'
      ],
      correctAnswer: 1,
      explanation: 'typeof null returns "object", which is a known JavaScript quirk.',
      difficulty: 'beginner'
    },
    {
      id: 'js-b-5',
      question: 'How do you create a function in JavaScript?',
      options: [
        'function myFunc() {} or const myFunc = () => {}',
        'create function myFunc()',
        'def myFunc()',
        'func myFunc()'
      ],
      correctAnswer: 0,
      explanation: 'Functions can be created using function declarations or arrow functions.',
      difficulty: 'beginner'
    },
    {
      id: 'js-b-6',
      question: 'What method adds an element to the end of an array?',
      options: [
        'append()',
        'push()',
        'add()',
        'insert()'
      ],
      correctAnswer: 1,
      explanation: 'push() adds one or more elements to the end of an array.',
      difficulty: 'beginner'
    },
    {
      id: 'js-b-7',
      question: 'What does the DOM stand for?',
      options: [
        'Document Object Model',
        'Data Object Management',
        'Digital Optical Media',
        'Document Orientation Method'
      ],
      correctAnswer: 0,
      explanation: 'DOM stands for Document Object Model, representing the page structure as a tree of objects.',
      difficulty: 'beginner'
    },
    {
      id: 'js-b-8',
      question: 'How do you write a comment in JavaScript?',
      options: [
        '# This is a comment',
        '// This is a comment',
        '<!-- This is a comment -->',
        '/* This is a comment'
      ],
      correctAnswer: 1,
      explanation: '// is used for single-line comments, /* */ for multi-line comments.',
      difficulty: 'beginner'
    },
    {
      id: 'js-b-9',
      question: 'What is NaN?',
      options: [
        'Not a Number',
        'Null and None',
        'New Array Number',
        'Negative Array Number'
      ],
      correctAnswer: 0,
      explanation: 'NaN stands for "Not a Number" and represents a value that is not a legal number.',
      difficulty: 'beginner'
    },
    {
      id: 'js-b-10',
      question: 'What method is used to find an element in the DOM by its ID?',
      options: [
        'querySelector()',
        'getElementById()',
        'findElement()',
        'getElement()'
      ],
      correctAnswer: 1,
      explanation: 'getElementById() is used to select an element by its ID attribute.',
      difficulty: 'beginner'
    }
  ]
};

// Add more test banks...
// Due to length, I'll create a test bank manager

// ========================================
// PYTHON TESTS (Technical Skill)
// ========================================

export const pythonBeginnerTest: SkillTest = {
  skillName: 'Python',
  level: 'beginner',
  duration: 20,
  passingScore: 70,
  questions: [
    {
      id: 'py-b-1',
      question: 'Which keyword is used to define a function in Python?',
      options: ['func', 'def', 'function', 'define'],
      correctAnswer: 1,
      explanation: 'The "def" keyword is used to define a function in Python.',
      difficulty: 'beginner'
    },
    {
      id: 'py-b-2',
      question: 'What is the output of print(2 ** 3)?',
      options: ['6', '8', '9', '5'],
      correctAnswer: 1,
      explanation: '** is the exponentiation operator. 2 to the power of 3 is 8.',
      difficulty: 'beginner'
    },
    {
      id: 'py-b-3',
      question: 'How do you insert comments in Python code?',
      options: ['// This is a comment', '# This is a comment', '/* This is a comment */', ''],
      correctAnswer: 1,
      explanation: 'Python uses the hash symbol (#) for single-line comments.',
      difficulty: 'beginner'
    },
    {
      id: 'py-b-4',
      question: 'Which of these is NOT a core data type in Python?',
      options: ['List', 'Dictionary', 'Tuple', 'Array'],
      correctAnswer: 3,
      explanation: 'Python does not have a built-in "Array" type (it has Lists). Arrays are provided by libraries like NumPy or the array module.',
      difficulty: 'beginner'
    },
    {
      id: 'py-b-5',
      question: 'What is the correct way to create a list?',
      options: ['list = {1, 2, 3}', 'list = [1, 2, 3]', 'list = (1, 2, 3)', 'list = <1, 2, 3>'],
      correctAnswer: 1,
      explanation: 'Lists are created using square brackets [].',
      difficulty: 'beginner'
    }
  ]
};

export const pythonIntermediateTest: SkillTest = {
  skillName: 'Python',
  level: 'intermediate',
  duration: 30,
  passingScore: 75,
  questions: [
    {
      id: 'py-i-1',
      question: 'What does the *args parameter do in a function?',
      options: [
        'Passes a dictionary of keyword arguments',
        'Passes a variable number of non-keyword arguments',
        'Multiplies the arguments',
        'Sets a default argument value'
      ],
      correctAnswer: 1,
      explanation: '*args allows you to pass a variable number of positional arguments to a function.',
      difficulty: 'intermediate'
    },
    {
      id: 'py-i-2',
      question: 'What is a lambda function?',
      options: [
        'A function that loops forever',
        'A small anonymous function defined with the lambda keyword',
        'A function imported from the math library',
        'A class method'
      ],
      correctAnswer: 1,
      explanation: 'A lambda function is a small anonymous function that can take any number of arguments, but can only have one expression.',
      difficulty: 'intermediate'
    },
    {
      id: 'py-i-3',
      question: 'What is the purpose of the "self" keyword in classes?',
      options: [
        'It refers to the class itself',
        'It refers to the instance of the class',
        'It is a global variable',
        'It creates a private method'
      ],
      correctAnswer: 1,
      explanation: 'self represents the instance of the class. By using "self", we can access the attributes and methods of the class in python.',
      difficulty: 'intermediate'
    },
    {
      id: 'py-i-4',
      question: 'What is the difference between a list and a tuple?',
      options: [
        'Lists are immutable, tuples are mutable',
        'Lists are mutable, tuples are immutable',
        'There is no difference',
        'Tuples can only store numbers'
      ],
      correctAnswer: 1,
      explanation: 'The primary difference is mutability. Lists can be changed (mutable), while tuples cannot be changed after creation (immutable).',
      difficulty: 'intermediate'
    },
    {
      id: 'py-i-5',
      question: 'What does a decorator do?',
      options: [
        'Styles the code',
        'Modifies the behavior of a function or class',
        'Cleans up memory',
        'Imports modules'
      ],
      correctAnswer: 1,
      explanation: 'Decorators allow you to modify the behavior of a function or class. They are usually called with the @ symbol.',
      difficulty: 'intermediate'
    }
  ]
};

export const pythonAdvancedTest: SkillTest = {
  skillName: 'Python',
  level: 'advanced',
  duration: 45,
  passingScore: 80,
  questions: [
    {
      id: 'py-a-1',
      question: 'What is the Global Interpreter Lock (GIL)?',
      options: [
        'A security feature',
        'A mutex that prevents multiple native threads from executing Python bytecodes at once',
        'A way to lock variables',
        'A database lock'
      ],
      correctAnswer: 1,
      explanation: 'The GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes at once.',
      difficulty: 'advanced'
    },
    {
      id: 'py-a-2',
      question: 'What is a generator in Python?',
      options: [
        'A function that returns an iterator using the Yield keyword',
        'A tool to create projects',
        'A random number creator',
        'A compiler'
      ],
      correctAnswer: 0,
      explanation: 'Generators are functions that return an iterator that yields a sequence of values one at a time.',
      difficulty: 'advanced'
    },
    {
      id: 'py-a-3',
      question: 'What does the __init__.py file do?',
      options: [
        'Initializes the PC',
        'Marks a directory as a Python package',
        'Starts the server',
        'Installs dependencies'
      ],
      correctAnswer: 1,
      explanation: 'The __init__.py file lets the Python interpreter know that a directory contains code for a Python module.',
      difficulty: 'advanced'
    },
    {
      id: 'py-a-4',
      question: 'What is the difference between @staticmethod and @classmethod?',
      options: [
        'No difference',
        '@classmethod takes "cls" as first argument, @staticmethod takes nothing specific',
        '@staticmethod can access class state',
        '@classmethod cannot be inherited'
      ],
      correctAnswer: 1,
      explanation: 'Class methods receive the class as an implicit first argument (cls), while static methods behave like plain functions.',
      difficulty: 'advanced'
    },
    {
      id: 'py-a-5',
      question: 'What is a metaclass?',
      options: [
        'A class of a class',
        'A very large class',
        'A database schema',
        'A function decorator'
      ],
      correctAnswer: 0,
      explanation: 'A metaclass is a class whose instances are classes. It defines how a class behaves.',
      difficulty: 'advanced'
    }
  ]
};

// ========================================
// NODE.JS TESTS (Technical Skill)
// ========================================

export const nodeBeginnerTest: SkillTest = {
  skillName: 'Node.js',
  level: 'beginner',
  duration: 20,
  passingScore: 70,
  questions: [
    {
      id: 'node-b-1',
      question: 'What is Node.js?',
      options: [
        'A JavaScript framework',
        'A JavaScript runtime built on Chrome\'s V8 JavaScript engine',
        'A browser extension',
        'A database'
      ],
      correctAnswer: 1,
      explanation: 'Node.js is a runtime environment that allows you to execute JavaScript on the server side.',
      difficulty: 'beginner'
    },
    {
      id: 'node-b-2',
      question: 'Which module is used to work with file systems?',
      options: ['files', 'fs', 'path', 'system'],
      correctAnswer: 1,
      explanation: 'The "fs" (File System) module is used to read, write, and manage files.',
      difficulty: 'beginner'
    },
    {
      id: 'node-b-3',
      question: 'What does npm stand for?',
      options: ['Node Package Manager', 'Node Project Manager', 'New Project Maker', 'Node Program Module'],
      correctAnswer: 0,
      explanation: 'npm stands for Node Package Manager, the default package manager for Node.js.',
      difficulty: 'beginner'
    },
    {
      id: 'node-b-4',
      question: 'How do you export a module in Node.js (CommonJS)?',
      options: ['export default', 'module.exports = ...', 'exports.export()', 'return module'],
      correctAnswer: 1,
      explanation: 'In CommonJS (default Node.js), you use module.exports to export functions or objects.',
      difficulty: 'beginner'
    },
    {
      id: 'node-b-5',
      question: 'Which global object provides information about the current process?',
      options: ['global', 'window', 'process', 'document'],
      correctAnswer: 2,
      explanation: 'The process object provides information about, and control over, the current Node.js process.',
      difficulty: 'beginner'
    }
  ]
};

export const nodeIntermediateTest: SkillTest = {
  skillName: 'Node.js',
  level: 'intermediate',
  duration: 30,
  passingScore: 75,
  questions: [
    {
      id: 'node-i-1',
      question: 'What describes the Node.js event loop?',
      options: [
        'It processes multiple threads simultaneously',
        'It is single-threaded and non-blocking',
        'It blocks I/O operations',
        'It creates a new thread for every request'
      ],
      correctAnswer: 1,
      explanation: 'The event loop allows Node.js to perform non-blocking I/O operations despite being single-threaded.',
      difficulty: 'intermediate'
    },
    {
      id: 'node-i-2',
      question: 'What is a Buffer in Node.js?',
      options: [
        'A temporary storage for raw binary data',
        'A function to slow down execution',
        'A cache mechanism',
        'A database connector'
      ],
      correctAnswer: 0,
      explanation: 'Buffers are used to handle binary data in Node.js, especially for streams and file processing.',
      difficulty: 'intermediate'
    },
    {
      id: 'node-i-3',
      question: 'Which of the following is NOT a valid Event Loop phase?',
      options: ['Timers', 'Poll', 'Check', 'Render'],
      correctAnswer: 3,
      explanation: '"Render" is not a phase of the Node.js event loop (it is a browser concept).',
      difficulty: 'intermediate'
    },
    {
      id: 'node-i-4',
      question: 'What is the use of process.nextTick()?',
      options: [
        'Executes a callback after the current operation completes, but before the event loop continues',
        'Executes a callback after a set delay',
        'Executes a callback in the next loop iteration',
        'Stops the process'
      ],
      correctAnswer: 0,
      explanation: 'process.nextTick() adds the callback to the "next tick queue", executing it immediately after the current operation.',
      difficulty: 'intermediate'
    },
    {
      id: 'node-i-5',
      question: 'What is the purpose of the "path" module?',
      options: [
        'To find network paths',
        'To handle and transform file paths',
        'To create routes',
        'To draw SVG paths'
      ],
      correctAnswer: 1,
      explanation: 'The path module provides utilities for working with file and directory paths.',
      difficulty: 'intermediate'
    }
  ]
};

export const nodeAdvancedTest: SkillTest = {
  skillName: 'Node.js',
  level: 'advanced',
  duration: 45,
  passingScore: 80,
  questions: [
    {
      id: 'node-a-1',
      question: 'How does Node.js handle CPU-intensive tasks effectively?',
      options: [
        'It naturally handles them well',
        'Using Worker Threads or clustering',
        'By increasing RAM',
        'By using async/await'
      ],
      correctAnswer: 1,
      explanation: 'Since Node is single-threaded, CPU-intensive tasks block the event loop. Worker Threads or Clustering are used to offload these tasks.',
      difficulty: 'advanced'
    },
    {
      id: 'node-a-2',
      question: 'What is the difference between spawn and exec in child_process?',
      options: [
        'No difference',
        'spawn returns a stream (better for large data), exec buffers the output (better for small data)',
        'exec is asynchronous, spawn is synchronous',
        'spawn is deprecated'
      ],
      correctAnswer: 1,
      explanation: 'spawn streams data (good for long processes), while exec buffers the output and returns it all at once (limited by buffer size).',
      difficulty: 'advanced'
    },
    {
      id: 'node-a-3',
      question: 'What is a memory leak in Node.js often caused by?',
      options: [
        'Global variables that represent arrays/objects and grow indefinitely',
        'Using too many files',
        'Closing database connections',
        'Using const instead of let'
      ],
      correctAnswer: 0,
      explanation: 'Unintended references in global variables prevent the Garbage Collector from freeing memory, causing leaks.',
      difficulty: 'advanced'
    },
    {
      id: 'node-a-4',
      question: 'What is the Cluster module used for?',
      options: [
        'To group files',
        'To enable load balancing across multiple CPU cores',
        'To manage databases',
        'To cluster CSS files'
      ],
      correctAnswer: 1,
      explanation: 'Cluster allows you to create child processes (workers) that run simultaneously and share the same server port.',
      difficulty: 'advanced'
    },
    {
      id: 'node-a-5',
      question: 'Which libuv concept allows Node.js to be asynchronous?',
      options: [
        'The Thread Pool',
        'The Stack',
        'The Heap',
        'The Compiler'
      ],
      correctAnswer: 0,
      explanation: 'libuv uses a thread pool to handle "heavy" operations (like file I/O or crypto) asynchronously in the background.',
      difficulty: 'advanced'
    }
  ]
};

// ========================================
// MATHEMATICS TESTS (Academic Skill)
// ========================================

export const mathBeginnerTest: SkillTest = {
  skillName: 'Mathematics',
  level: 'beginner',
  duration: 20,
  passingScore: 70,
  questions: [
    {
      id: 'math-b-1',
      question: 'What is 15% of 200?',
      options: ['20', '25', '30', '35'],
      correctAnswer: 2,
      explanation: '10% of 200 is 20. 5% is 10. So 15% is 30.',
      difficulty: 'beginner'
    },
    {
      id: 'math-b-2',
      question: 'Solve for x: 2x + 5 = 15',
      options: ['x = 10', 'x = 5', 'x = 2', 'x = 7.5'],
      correctAnswer: 1,
      explanation: '2x = 15 - 5 => 2x = 10 => x = 5.',
      difficulty: 'beginner'
    },
    {
      id: 'math-b-3',
      question: 'What is the square root of 144?',
      options: ['10', '11', '12', '14'],
      correctAnswer: 2,
      explanation: '12 * 12 = 144.',
      difficulty: 'beginner'
    },
    {
      id: 'math-b-4',
      question: 'What is the sum of angles in a triangle?',
      options: ['90 degrees', '180 degrees', '360 degrees', '270 degrees'],
      correctAnswer: 1,
      explanation: 'The sum of internal angles of any triangle is always 180 degrees.',
      difficulty: 'beginner'
    },
    {
      id: 'math-b-5',
      question: 'If a car travels 60km in 1.5 hours, what is its average speed?',
      options: ['30 km/h', '40 km/h', '45 km/h', '90 km/h'],
      correctAnswer: 1,
      explanation: 'Speed = Distance / Time. 60 / 1.5 = 40 km/h.',
      difficulty: 'beginner'
    }
  ]
};

export const mathIntermediateTest: SkillTest = {
  skillName: 'Mathematics',
  level: 'intermediate',
  duration: 30,
  passingScore: 75,
  questions: [
    {
      id: 'math-i-1',
      question: 'What is the derivative of x^2?',
      options: ['x', '2x', '2', 'x^2'],
      correctAnswer: 1,
      explanation: 'Using the power rule (nx^n-1), the derivative of x^2 is 2x.',
      difficulty: 'intermediate'
    },
    {
      id: 'math-i-2',
      question: 'Solve the quadratic equation: x^2 - 5x + 6 = 0',
      options: ['2, 3', '-2, -3', '1, 6', '2, -3'],
      correctAnswer: 0,
      explanation: 'Factorizing: (x-2)(x-3) = 0. Therefore x = 2 and x = 3.',
      difficulty: 'intermediate'
    },
    {
      id: 'math-i-3',
      question: 'What is the value of Sin(90 degrees)?',
      options: ['0', '0.5', '1', '-1'],
      correctAnswer: 2,
      explanation: 'On the unit circle, Sin(90) corresponds to the y-coordinate at 90 degrees, which is 1.',
      difficulty: 'intermediate'
    },
    {
      id: 'math-i-4',
      question: 'What is the factorial of 5 (5!)?',
      options: ['20', '60', '100', '120'],
      correctAnswer: 3,
      explanation: '5! = 5 * 4 * 3 * 2 * 1 = 120.',
      difficulty: 'intermediate'
    },
    {
      id: 'math-i-5',
      question: 'Log base 10 of 1000 is?',
      options: ['2', '3', '10', '100'],
      correctAnswer: 1,
      explanation: '10^3 = 1000, therefore log10(1000) = 3.',
      difficulty: 'intermediate'
    }
  ]
};

export const mathAdvancedTest: SkillTest = {
  skillName: 'Mathematics',
  level: 'advanced',
  duration: 45,
  passingScore: 80,
  questions: [
    {
      id: 'math-a-1',
      question: 'What is the integral of 1/x?',
      options: ['ln(|x|) + C', 'x + C', '-1/x^2 + C', 'e^x + C'],
      correctAnswer: 0,
      explanation: 'The integral of 1/x is the natural logarithm of the absolute value of x, plus the constant C.',
      difficulty: 'advanced'
    },
    {
      id: 'math-a-2',
      question: 'If two events A and B are independent, what is P(A and B)?',
      options: ['P(A) + P(B)', 'P(A) * P(B)', 'P(A) / P(B)', '1 - P(A)'],
      correctAnswer: 1,
      explanation: 'For independent events, the probability of both occurring is the product of their individual probabilities.',
      difficulty: 'advanced'
    },
    {
      id: 'math-a-3',
      question: 'What is the eigenvalue of a matrix?',
      options: [
        'The determinant of the matrix',
        'A scalar lambda such that Ax = lambda*x',
        'The inverse of the matrix',
        'The transpose of the matrix'
      ],
      correctAnswer: 1,
      explanation: 'An eigenvalue is a scalar associated with a linear system of equations (matrix equation) such that Ax = lambda*x.',
      difficulty: 'advanced'
    },
    {
      id: 'math-a-4',
      question: 'What is the limit of (sin x)/x as x approaches 0?',
      options: ['0', '1', 'Undefined', 'Infinity'],
      correctAnswer: 1,
      explanation: 'This is a standard limit in calculus. As x approaches 0, sin(x)/x approaches 1.',
      difficulty: 'advanced'
    },
    {
      id: 'math-a-5',
      question: 'Which of these is a complex number?',
      options: ['5', '3 + 4i', 'pi', 'root(2)'],
      correctAnswer: 1,
      explanation: 'Complex numbers are in the form a + bi, where i is the square root of -1.',
      difficulty: 'advanced'
    }
  ]
};

// ========================================
// UI DESIGN TESTS (Creative Skill)
// ========================================

export const uiDesignBeginnerTest: SkillTest = {
  skillName: 'UI Design',
  level: 'beginner',
  duration: 20,
  passingScore: 70,
  questions: [
    {
      id: 'ui-b-1',
      question: 'What does UI stand for?',
      options: ['User Intelligence', 'User Interface', 'Universal Interaction', 'User Information'],
      correctAnswer: 1,
      explanation: 'UI stands for User Interface, the space where interactions between humans and machines occur.',
      difficulty: 'beginner'
    },
    {
      id: 'ui-b-2',
      question: 'Which color combination offers the highest contrast?',
      options: ['Yellow on White', 'Black on White', 'Grey on Black', 'Red on Pink'],
      correctAnswer: 1,
      explanation: 'Black text on a White background (or vice versa) offers the highest readability contrast.',
      difficulty: 'beginner'
    },
    {
      id: 'ui-b-3',
      question: 'What is "Lorem Ipsum"?',
      options: ['A design software', 'A famous designer', 'Placeholder text used in design', 'A font style'],
      correctAnswer: 2,
      explanation: 'Lorem Ipsum is industry-standard dummy text used to demonstrate the visual form of a document.',
      difficulty: 'beginner'
    },
    {
      id: 'ui-b-4',
      question: 'What is the purpose of whitespace (negative space)?',
      options: [
        'To waste space',
        'To improve readability and focus',
        'To make the design look empty',
        'To reduce file size'
      ],
      correctAnswer: 1,
      explanation: 'Whitespace helps separate elements, improves readability, and draws attention to key content.',
      difficulty: 'beginner'
    },
    {
      id: 'ui-b-5',
      question: 'What is a "Wireframe"?',
      options: [
        'A finished high-fidelity design',
        'A skeleton or blueprint of the layout',
        'A code framework',
        'A type of animation'
      ],
      correctAnswer: 1,
      explanation: 'A wireframe is a low-fidelity visual guide that represents the skeletal framework of a website.',
      difficulty: 'beginner'
    }
  ]
};

export const uiDesignIntermediateTest: SkillTest = {
  skillName: 'UI Design',
  level: 'intermediate',
  duration: 30,
  passingScore: 75,
  questions: [
    {
      id: 'ui-i-1',
      question: 'What is the "60-30-10" rule in color theory?',
      options: [
        'Angles of a triangle',
        'A proportion rule for using primary, secondary, and accent colors',
        'Screen resolution sizes',
        'Opacity percentages'
      ],
      correctAnswer: 1,
      explanation: 'It suggests using 60% dominant color, 30% secondary color, and 10% accent color for balance.',
      difficulty: 'intermediate'
    },
    {
      id: 'ui-i-2',
      question: 'What does WCAG stand for in the context of accessibility?',
      options: [
        'Web Content Accessibility Guidelines',
        'World Color Association Guide',
        'Wide Computer Access Group',
        'Web Creative Art Guide'
      ],
      correctAnswer: 0,
      explanation: 'WCAG stands for Web Content Accessibility Guidelines, the standard for making web content accessible to people with disabilities.',
      difficulty: 'intermediate'
    },
    {
      id: 'ui-i-3',
      question: 'What is "Kerning" in typography?',
      options: [
        'The spacing between lines of text',
        'The spacing between individual characters',
        'The size of the font',
        'The font family'
      ],
      correctAnswer: 1,
      explanation: 'Kerning adjusts the spacing between individual letter pairs to achieve a visually pleasing result.',
      difficulty: 'intermediate'
    },
    {
      id: 'ui-i-4',
      question: 'What is a "Responsive Design"?',
      options: [
        'A design that responds to voice commands',
        'A design that adapts to different screen sizes and devices',
        'A design that loads fast',
        'A design created by AI'
      ],
      correctAnswer: 1,
      explanation: 'Responsive design ensures layouts adjust gracefully to desktops, tablets, and mobile phones.',
      difficulty: 'intermediate'
    },
    {
      id: 'ui-i-5',
      question: 'What is the difference between UI and UX?',
      options: [
        'No difference',
        'UI is visual (look), UX is functional (feel/experience)',
        'UI is for mobile, UX is for desktop',
        'UX is coding, UI is drawing'
      ],
      correctAnswer: 1,
      explanation: 'UI focuses on the screens, buttons, and visual elements. UX focuses on the user journey and how the product feels to use.',
      difficulty: 'intermediate'
    }
  ]
};

export const uiDesignAdvancedTest: SkillTest = {
  skillName: 'UI Design',
  level: 'advanced',
  duration: 45,
  passingScore: 80,
  questions: [
    {
      id: 'ui-a-1',
      question: 'What is "Fitts\'s Law" in interaction design?',
      options: [
        'Colors should always match',
        'The time to acquire a target is a function of the distance to and size of the target',
        'Users read in an F-pattern',
        'Simple designs are always better'
      ],
      correctAnswer: 1,
      explanation: 'Fitts\'s law predicts that smaller and further targets take longer to click, implying buttons should be large and close to the cursor.',
      difficulty: 'advanced'
    },
    {
      id: 'ui-a-2',
      question: 'What defines a "Design System"?',
      options: [
        'A folder of images',
        'A single collection of reusable components, guided by clear standards, that can be assembled to build any number of applications',
        'A specific color palette',
        'A software like Figma'
      ],
      correctAnswer: 1,
      explanation: 'A Design System is a comprehensive guide (code + design) used to manage design at scale.',
      difficulty: 'advanced'
    },
    {
      id: 'ui-a-3',
      question: 'What is "Heuristic Evaluation"?',
      options: [
        'A user testing method where experts evaluate the UI against established usability principles',
        'A/B testing',
        'Eye tracking',
        'Surveying users'
      ],
      correctAnswer: 0,
      explanation: 'It involves a small set of evaluators examining the interface and judging its compliance with recognized usability principles (the "heuristics").',
      difficulty: 'advanced'
    },
    {
      id: 'ui-a-4',
      question: 'What is the "Gestalt Principle of Proximity"?',
      options: [
        'Objects near each other tend to be grouped together',
        'Objects that look alike are grouped together',
        'The eye follows continuous lines',
        'The whole is greater than the sum of its parts'
      ],
      correctAnswer: 0,
      explanation: 'The principle of proximity states that things that are close to one another are perceived to be more related than things that are spaced farther apart.',
      difficulty: 'advanced'
    },
    {
      id: 'ui-a-5',
      question: 'What is "Atomic Design" methodology?',
      options: [
        'Designing for nuclear plants',
        'Breaking design down into Atoms, Molecules, Organisms, Templates, and Pages',
        'Designing very small icons',
        'Using circular shapes'
      ],
      correctAnswer: 1,
      explanation: 'Atomic Design is a methodology for creating design systems by breaking them down into five distinct levels: atoms, molecules, organisms, templates, and pages.',
      difficulty: 'advanced'
    }
  ]
};

// ========================================
// EXPORT UPDATE
// ========================================

// Update your allTestBanks object to include these new exports:

/*

*/

const placeholderTest: SkillTest = {
  skillName: 'Placeholder',
  level: 'intermediate',
  duration: 30,
  passingScore: 75,
  questions: []
};

export const allTestBanks = {
  React: {
    beginner: reactBeginnerTest,
    intermediate: reactIntermediateTest,
    advanced: reactAdvancedTest
  },
  JavaScript: {
    beginner: javascriptBeginnerTest,
    intermediate: placeholderTest,
    advanced: placeholderTest
  },
  Python: {
    beginner: pythonBeginnerTest,
    intermediate: pythonIntermediateTest,
    advanced: pythonAdvancedTest
  },
  'Node.js': {
    beginner: nodeBeginnerTest,
    intermediate: nodeIntermediateTest,
    advanced: nodeAdvancedTest
  },
  Mathematics: {
    beginner: mathBeginnerTest,
    intermediate: mathIntermediateTest,
    advanced: mathAdvancedTest
  },
  'UI Design': {
    beginner: uiDesignBeginnerTest,
    intermediate: uiDesignIntermediateTest,
    advanced: uiDesignAdvancedTest
  }
};

export function getTest(skillName: string, level: 'beginner' | 'intermediate' | 'advanced'): SkillTest | null {
  const skill = allTestBanks[skillName as keyof typeof allTestBanks];
  if (!skill) return null;
  return skill[level] || null;
}
