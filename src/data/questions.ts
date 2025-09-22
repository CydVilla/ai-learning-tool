import { Question, CodeExercise, LearningTrack, DifficultyLevel } from '../types';

// HTML Questions
export const htmlQuestions: Question[] = [
  {
    id: 'html_001',
    content: 'What does HTML stand for?',
    options: [
      'HyperText Markup Language',
      'High-level Text Markup Language',
      'Home Tool Markup Language',
      'Hyperlink and Text Markup Language'
    ],
    correctAnswer: 'HyperText Markup Language',
    explanation: 'HTML stands for HyperText Markup Language, which is the standard markup language for creating web pages and web applications.',
    codeExample: null,
    difficulty: 'beginner',
    track: 'html',
    points: 10,
    feedback: {
      correct: 'Excellent! HTML is indeed HyperText Markup Language.',
      incorrect: 'Not quite. HTML stands for HyperText Markup Language, which is the foundation of web development.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'html_002',
    content: 'Which HTML tag is used to create a hyperlink?',
    options: ['<link>', '<a>', '<href>', '<url>'],
    correctAnswer: '<a>',
    explanation: 'The <a> tag is used to create hyperlinks in HTML. It requires an href attribute to specify the destination URL.',
    codeExample: '<a href="https://example.com">Visit Example</a>',
    difficulty: 'beginner',
    track: 'html',
    points: 10,
    feedback: {
      correct: 'Perfect! The <a> tag creates hyperlinks.',
      incorrect: 'The <a> tag is used for hyperlinks. Remember: <a> for anchor links!'
    },
    type: 'multiple-choice'
  },
  {
    id: 'html_003',
    content: 'What is the correct HTML structure for a basic webpage?',
    options: [
      '<html><head><body></body></head></html>',
      '<html><body><head></head></body></html>',
      '<html><head></head><body></body></html>',
      '<head><html><body></body></html></head>'
    ],
    correctAnswer: '<html><head></head><body></body></html>',
    explanation: 'The correct HTML structure has the <html> tag as the root, containing <head> and <body> elements in that order.',
    codeExample: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`,
    difficulty: 'beginner',
    track: 'html',
    points: 15,
    feedback: {
      correct: 'Great! You understand the basic HTML document structure.',
      incorrect: 'The correct structure is <html><head></head><body></body></html>. The head comes before the body.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'html_004',
    content: 'Which HTML tag is used to create a line break?',
    options: ['<br>', '<break>', '<lb>', '<line>'],
    correctAnswer: '<br>',
    explanation: 'The <br> tag creates a line break in HTML. It is a self-closing tag.',
    codeExample: 'This is line 1<br>This is line 2',
    difficulty: 'beginner',
    track: 'html',
    points: 10,
    feedback: {
      correct: 'Correct! <br> creates a line break.',
      incorrect: 'The <br> tag is used for line breaks. It\'s a self-closing tag.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'html_005',
    content: 'What is the purpose of the <meta> tag?',
    options: [
      'To create metadata about the HTML document',
      'To create a table',
      'To create a form',
      'To create a link'
    ],
    correctAnswer: 'To create metadata about the HTML document',
    explanation: 'The <meta> tag provides metadata about the HTML document, such as character encoding, viewport settings, and SEO information.',
    codeExample: '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    difficulty: 'intermediate',
    track: 'html',
    points: 15,
    feedback: {
      correct: 'Exactly! Meta tags provide important document metadata.',
      incorrect: 'Meta tags are used for document metadata, not for creating visible content.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'html_006',
    content: 'Which HTML5 semantic element is used for navigation?',
    options: ['<nav>', '<navigation>', '<menu>', '<link>'],
    correctAnswer: '<nav>',
    explanation: 'The <nav> element is used to define a set of navigation links in HTML5.',
    codeExample: '<nav>\n  <a href="/home">Home</a>\n  <a href="/about">About</a>\n</nav>',
    difficulty: 'intermediate',
    track: 'html',
    points: 15,
    feedback: {
      correct: 'Perfect! <nav> is the semantic element for navigation.',
      incorrect: 'The <nav> element is specifically designed for navigation links in HTML5.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'html_007',
    content: 'What is the difference between <div> and <span>?',
    options: [
      '<div> is block-level, <span> is inline',
      '<div> is inline, <span> is block-level',
      'They are identical',
      '<div> is for text, <span> is for images'
    ],
    correctAnswer: '<div> is block-level, <span> is inline',
    explanation: '<div> is a block-level element that takes up the full width, while <span> is an inline element that only takes up the space it needs.',
    codeExample: '<div>This is a block element</div>\n<span>This is an inline element</span>',
    difficulty: 'intermediate',
    track: 'html',
    points: 20,
    feedback: {
      correct: 'Excellent! You understand the difference between block and inline elements.',
      incorrect: '<div> is block-level (full width) and <span> is inline (content width only).'
    },
    type: 'multiple-choice'
  },
  {
    id: 'html_008',
    content: 'Which attribute is used to make an input field required?',
    options: ['required', 'mandatory', 'must', 'needed'],
    correctAnswer: 'required',
    explanation: 'The "required" attribute makes an input field mandatory for form submission.',
    codeExample: '<input type="text" name="email" required>',
    difficulty: 'intermediate',
    track: 'html',
    points: 15,
    feedback: {
      correct: 'Correct! The "required" attribute makes fields mandatory.',
      incorrect: 'Use the "required" attribute to make input fields mandatory.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'html_009',
    content: 'What is the purpose of the <article> element?',
    options: [
      'To define independent, self-contained content',
      'To create a sidebar',
      'To create a header',
      'To create a footer'
    ],
    correctAnswer: 'To define independent, self-contained content',
    explanation: 'The <article> element represents a complete, self-contained composition that could be distributed independently.',
    codeExample: '<article>\n  <h2>Blog Post Title</h2>\n  <p>Blog post content...</p>\n</article>',
    difficulty: 'advanced',
    track: 'html',
    points: 20,
    feedback: {
      correct: 'Perfect! <article> is for self-contained content.',
      incorrect: '<article> is used for independent, self-contained content like blog posts or news articles.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'html_010',
    content: 'Which HTML5 element is used for audio content?',
    options: ['<audio>', '<sound>', '<music>', '<mp3>'],
    correctAnswer: '<audio>',
    explanation: 'The <audio> element is used to embed sound content in HTML5.',
    codeExample: '<audio controls>\n  <source src="audio.mp3" type="audio/mpeg">\n</audio>',
    difficulty: 'advanced',
    track: 'html',
    points: 20,
    feedback: {
      correct: 'Excellent! <audio> is the HTML5 element for sound content.',
      incorrect: 'The <audio> element is used to embed audio content in HTML5.'
    },
    type: 'multiple-choice'
  }
];

// CSS Questions
export const cssQuestions: Question[] = [
  {
    id: 'css_001',
    content: 'What does CSS stand for?',
    options: [
      'Cascading Style Sheets',
      'Computer Style Sheets',
      'Creative Style Sheets',
      'Colorful Style Sheets'
    ],
    correctAnswer: 'Cascading Style Sheets',
    explanation: 'CSS stands for Cascading Style Sheets, which is used to style and layout web pages.',
    codeExample: null,
    difficulty: 'beginner',
    track: 'css',
    points: 10,
    feedback: {
      correct: 'Perfect! CSS is Cascading Style Sheets.',
      incorrect: 'CSS stands for Cascading Style Sheets, which control the visual presentation of web pages.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'css_002',
    content: 'Which CSS property is used to change the text color?',
    options: ['text-color', 'color', 'font-color', 'text-style'],
    correctAnswer: 'color',
    explanation: 'The color property is used to set the color of text in CSS.',
    codeExample: 'p { color: red; }',
    difficulty: 'beginner',
    track: 'css',
    points: 10,
    feedback: {
      correct: 'Correct! The "color" property sets text color.',
      incorrect: 'Use the "color" property to change text color in CSS.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'css_003',
    content: 'What is the correct way to apply CSS to an HTML element?',
    options: [
      'style="color: red;"',
      'css="color: red;"',
      'class="color: red;"',
      'id="color: red;"'
    ],
    correctAnswer: 'style="color: red;"',
    explanation: 'Inline CSS is applied using the style attribute with CSS properties and values.',
    codeExample: '<p style="color: red;">Red text</p>',
    difficulty: 'beginner',
    track: 'css',
    points: 15,
    feedback: {
      correct: 'Exactly! The style attribute is used for inline CSS.',
      incorrect: 'Use the "style" attribute to apply inline CSS to HTML elements.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'css_004',
    content: 'Which CSS property is used to change the background color?',
    options: ['bg-color', 'background-color', 'background', 'color-background'],
    correctAnswer: 'background-color',
    explanation: 'The background-color property sets the background color of an element.',
    codeExample: 'body { background-color: lightblue; }',
    difficulty: 'beginner',
    track: 'css',
    points: 10,
    feedback: {
      correct: 'Perfect! background-color sets the background color.',
      incorrect: 'Use "background-color" to change the background color of elements.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'css_005',
    content: 'What is the CSS box model?',
    options: [
      'Content, padding, border, margin',
      'Width, height, color, font',
      'Top, right, bottom, left',
      'Header, body, footer, sidebar'
    ],
    correctAnswer: 'Content, padding, border, margin',
    explanation: 'The CSS box model consists of content, padding, border, and margin layers.',
    codeExample: '.box {\n  width: 200px;\n  padding: 20px;\n  border: 2px solid black;\n  margin: 10px;\n}',
    difficulty: 'intermediate',
    track: 'css',
    points: 20,
    feedback: {
      correct: 'Excellent! You understand the CSS box model.',
      incorrect: 'The CSS box model includes content, padding, border, and margin layers.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'css_006',
    content: 'Which CSS property is used to center text horizontally?',
    options: ['text-center', 'align-center', 'text-align', 'center'],
    correctAnswer: 'text-align',
    explanation: 'The text-align property is used to align text horizontally (left, center, right, justify).',
    codeExample: 'h1 { text-align: center; }',
    difficulty: 'intermediate',
    track: 'css',
    points: 15,
    feedback: {
      correct: 'Correct! text-align centers text horizontally.',
      incorrect: 'Use "text-align: center" to center text horizontally.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'css_007',
    content: 'What is the difference between margin and padding?',
    options: [
      'Margin is outside the border, padding is inside',
      'Padding is outside the border, margin is inside',
      'They are the same',
      'Margin is for text, padding is for images'
    ],
    correctAnswer: 'Margin is outside the border, padding is inside',
    explanation: 'Margin creates space outside the element\'s border, while padding creates space inside the border.',
    codeExample: '.element {\n  margin: 20px; /* Outside border */\n  padding: 10px; /* Inside border */\n}',
    difficulty: 'intermediate',
    track: 'css',
    points: 20,
    feedback: {
      correct: 'Perfect! Margin is outside, padding is inside the border.',
      incorrect: 'Margin creates space outside the border, padding creates space inside the border.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'css_008',
    content: 'Which CSS property is used to make text bold?',
    options: ['font-weight', 'text-weight', 'bold', 'font-style'],
    correctAnswer: 'font-weight',
    explanation: 'The font-weight property controls the thickness of text (normal, bold, 100-900).',
    codeExample: 'strong { font-weight: bold; }',
    difficulty: 'intermediate',
    track: 'css',
    points: 15,
    feedback: {
      correct: 'Exactly! font-weight controls text thickness.',
      incorrect: 'Use "font-weight: bold" to make text bold in CSS.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'css_009',
    content: 'What is CSS Flexbox?',
    options: [
      'A layout method for arranging items in a container',
      'A way to create animations',
      'A method for styling text',
      'A way to create gradients'
    ],
    correctAnswer: 'A layout method for arranging items in a container',
    explanation: 'Flexbox is a CSS layout method that allows you to design flexible responsive layouts.',
    codeExample: '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}',
    difficulty: 'advanced',
    track: 'css',
    points: 25,
    feedback: {
      correct: 'Excellent! Flexbox is a powerful layout method.',
      incorrect: 'Flexbox is a CSS layout method for arranging items in flexible containers.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'css_010',
    content: 'Which CSS property is used to create rounded corners?',
    options: ['border-radius', 'corner-radius', 'round-corners', 'border-round'],
    correctAnswer: 'border-radius',
    explanation: 'The border-radius property creates rounded corners on elements.',
    codeExample: '.button {\n  border-radius: 10px;\n}',
    difficulty: 'advanced',
    track: 'css',
    points: 20,
    feedback: {
      correct: 'Perfect! border-radius creates rounded corners.',
      incorrect: 'Use "border-radius" to create rounded corners on elements.'
    },
    type: 'multiple-choice'
  }
];

// JavaScript Questions
export const javascriptQuestions: Question[] = [
  {
    id: 'js_001',
    content: 'Which keyword is used to declare a variable in JavaScript?',
    options: ['var', 'let', 'const', 'All of the above'],
    correctAnswer: 'All of the above',
    explanation: 'JavaScript supports three ways to declare variables: var, let, and const, each with different scoping rules.',
    codeExample: 'var name = "John";\nlet age = 25;\nconst city = "New York";',
    difficulty: 'beginner',
    track: 'javascript',
    points: 15,
    feedback: {
      correct: 'Excellent! JavaScript has var, let, and const for variable declaration.',
      incorrect: 'JavaScript supports var, let, and const for variable declaration, each with different scoping rules.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'js_002',
    content: 'What is the result of 5 + "5" in JavaScript?',
    options: ['10', '55', 'Error', 'undefined'],
    correctAnswer: '55',
    explanation: 'JavaScript performs type coercion, converting the number 5 to a string and concatenating it with "5" to result in "55".',
    codeExample: 'console.log(5 + "5"); // Output: "55"',
    difficulty: 'beginner',
    track: 'javascript',
    points: 15,
    feedback: {
      correct: 'Correct! JavaScript converts the number to a string and concatenates.',
      incorrect: 'JavaScript performs type coercion: 5 + "5" = "55" (string concatenation).'
    },
    type: 'multiple-choice'
  },
  {
    id: 'js_003',
    content: 'Which method is used to add an element to the end of an array?',
    options: ['push()', 'pop()', 'shift()', 'unshift()'],
    correctAnswer: 'push()',
    explanation: 'The push() method adds one or more elements to the end of an array and returns the new length.',
    codeExample: 'let fruits = ["apple"];\nfruits.push("banana");\nconsole.log(fruits); // ["apple", "banana"]',
    difficulty: 'beginner',
    track: 'javascript',
    points: 15,
    feedback: {
      correct: 'Perfect! push() adds elements to the end of an array.',
      incorrect: 'Use push() to add elements to the end of an array.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'js_004',
    content: 'What is the correct way to create a function in JavaScript?',
    options: [
      'function myFunction() {}',
      'myFunction = function() {}',
      'const myFunction = () => {}',
      'All of the above'
    ],
    correctAnswer: 'All of the above',
    explanation: 'JavaScript supports multiple ways to create functions: function declarations, function expressions, and arrow functions.',
    codeExample: 'function myFunction() {}\nconst myFunction = function() {}\nconst myFunction = () => {}',
    difficulty: 'beginner',
    track: 'javascript',
    points: 20,
    feedback: {
      correct: 'Excellent! JavaScript supports multiple function declaration methods.',
      incorrect: 'JavaScript supports function declarations, expressions, and arrow functions.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'js_005',
    content: 'What is the difference between == and === in JavaScript?',
    options: [
      '== compares values, === compares values and types',
      '=== compares values, == compares values and types',
      'They are identical',
      '== is faster than ==='
    ],
    correctAnswer: '== compares values, === compares values and types',
    explanation: '== performs type coercion and compares values, while === compares both values and types without coercion.',
    codeExample: '5 == "5"  // true (type coercion)\n5 === "5" // false (strict comparison)',
    difficulty: 'intermediate',
    track: 'javascript',
    points: 20,
    feedback: {
      correct: 'Perfect! == does type coercion, === is strict comparison.',
      incorrect: '== compares values with type coercion, === compares values and types strictly.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'js_006',
    content: 'Which method is used to iterate over an array?',
    options: ['forEach()', 'for loop', 'map()', 'All of the above'],
    correctAnswer: 'All of the above',
    explanation: 'JavaScript provides multiple ways to iterate over arrays: forEach(), for loops, map(), and other array methods.',
    codeExample: 'arr.forEach(item => console.log(item));\nfor(let i = 0; i < arr.length; i++) {}\narr.map(item => item * 2);',
    difficulty: 'intermediate',
    track: 'javascript',
    points: 20,
    feedback: {
      correct: 'Excellent! JavaScript offers many ways to iterate over arrays.',
      incorrect: 'JavaScript provides forEach(), for loops, map(), and other methods for array iteration.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'js_007',
    content: 'What is a closure in JavaScript?',
    options: [
      'A function that has access to variables in its outer scope',
      'A way to close a function',
      'A method to stop execution',
      'A type of loop'
    ],
    correctAnswer: 'A function that has access to variables in its outer scope',
    explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function returns.',
    codeExample: 'function outer() {\n  let count = 0;\n  return function inner() {\n    return ++count;\n  };\n}',
    difficulty: 'advanced',
    track: 'javascript',
    points: 25,
    feedback: {
      correct: 'Perfect! Closures allow functions to access outer scope variables.',
      incorrect: 'A closure is a function that retains access to variables from its outer scope.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'js_008',
    content: 'What is the purpose of the this keyword in JavaScript?',
    options: [
      'It refers to the current object context',
      'It creates a new object',
      'It refers to the parent object',
      'It refers to the global object'
    ],
    correctAnswer: 'It refers to the current object context',
    explanation: 'The this keyword refers to the object that is currently executing the function, and its value depends on how the function is called.',
    codeExample: "const person = {\\n  name: 'John',\\n  greet() {\\n    console.log('Hello, I\\'m ' + this.name);\\n  }\\n};",
    difficulty: 'advanced',
    track: 'javascript',
    points: 25,
    feedback: {
      correct: 'Excellent! this refers to the current object context.',
      incorrect: 'The this keyword refers to the current object context where the function is being executed.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'js_009',
    content: 'What is the difference between let and var?',
    options: [
      'let has block scope, var has function scope',
      'var has block scope, let has function scope',
      'They are identical',
      'let is faster than var'
    ],
    correctAnswer: 'let has block scope, var has function scope',
    explanation: 'let has block scope (limited to the block where it\'s declared), while var has function scope (accessible throughout the function).',
    codeExample: 'if (true) {\n  let blockVar = "block scope";\n  var functionVar = "function scope";\n}\n// blockVar is not accessible here\n// functionVar is accessible here',
    difficulty: 'advanced',
    track: 'javascript',
    points: 25,
    feedback: {
      correct: 'Perfect! let has block scope, var has function scope.',
      incorrect: 'let variables are block-scoped, var variables are function-scoped.'
    },
    type: 'multiple-choice'
  },
  {
    id: 'js_010',
    content: 'What is a Promise in JavaScript?',
    options: [
      'An object representing the eventual completion of an asynchronous operation',
      'A way to create loops',
      'A method to stop execution',
      'A type of function'
    ],
    correctAnswer: 'An object representing the eventual completion of an asynchronous operation',
    explanation: 'A Promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value.',
    codeExample: 'const promise = new Promise((resolve, reject) => {\n  setTimeout(() => resolve("Success!"), 1000);\n});',
    difficulty: 'advanced',
    track: 'javascript',
    points: 30,
    feedback: {
      correct: 'Excellent! Promises handle asynchronous operations.',
      incorrect: 'A Promise represents the eventual completion of an asynchronous operation.'
    },
    type: 'multiple-choice'
  }
];

// Code Exercises
export const htmlCodeExercises: CodeExercise[] = [
  {
    id: 'html_code_001',
    content: 'Create a basic HTML page with a title, heading, and paragraph.',
    starterCode: `<!DOCTYPE html>
<html>
<head>
  <title></title>
</head>
<body>
  
</body>
</html>`,
    testCases: [
      { input: 'Page title', expectedOutput: 'Title element present' },
      { input: 'Main heading', expectedOutput: 'H1 element present' },
      { input: 'Paragraph text', expectedOutput: 'P element present' }
    ],
    explanation: 'A basic HTML page should include a DOCTYPE declaration, html, head, and body elements, with a title in the head and content in the body.',
    difficulty: 'beginner',
    track: 'html',
    points: 25,
    hints: [
      'Add a title inside the <title> tags',
      'Create an <h1> element for the main heading',
      'Add a <p> element for the paragraph'
    ],
    type: 'code-exercise'
  },
  {
    id: 'html_code_002',
    content: 'Create a simple form with name and email fields.',
    starterCode: `<form>
  
</form>`,
    testCases: [
      { input: 'Name field', expectedOutput: 'Input field with name attribute' },
      { input: 'Email field', expectedOutput: 'Input field with email type' },
      { input: 'Submit button', expectedOutput: 'Submit button present' }
    ],
    explanation: 'Forms use input elements with appropriate types and attributes. The name field should be text type, email should be email type.',
    difficulty: 'intermediate',
    track: 'html',
    points: 30,
    hints: [
      'Use <input> elements for form fields',
      'Set type="text" for the name field',
      'Set type="email" for the email field',
      'Add a submit button with type="submit"'
    ],
    type: 'code-exercise'
  }
];

export const cssCodeExercises: CodeExercise[] = [
  {
    id: 'css_code_001',
    content: 'Style a button with blue background, white text, and rounded corners.',
    starterCode: `<button class="styled-button">Click me</button>`,
    testCases: [
      { input: 'Background color', expectedOutput: 'Blue background' },
      { input: 'Text color', expectedOutput: 'White text' },
      { input: 'Border radius', expectedOutput: 'Rounded corners' }
    ],
    explanation: 'Use CSS properties like background-color, color, and border-radius to style the button.',
    difficulty: 'beginner',
    track: 'css',
    points: 25,
    hints: [
      'Use background-color: blue for the background',
      'Use color: white for the text',
      'Use border-radius for rounded corners'
    ],
    type: 'code-exercise'
  },
  {
    id: 'css_code_002',
    content: 'Create a centered container with a shadow effect.',
    starterCode: `<div class="container">Content here</div>`,
    testCases: [
      { input: 'Centered positioning', expectedOutput: 'Container is centered' },
      { input: 'Shadow effect', expectedOutput: 'Box shadow applied' },
      { input: 'Fixed width', expectedOutput: 'Container has defined width' }
    ],
    explanation: 'Use margin: 0 auto for centering, box-shadow for shadow effects, and set a specific width.',
    difficulty: 'intermediate',
    track: 'css',
    points: 30,
    hints: [
      'Use margin: 0 auto to center the container',
      'Use box-shadow for the shadow effect',
      'Set a specific width for the container'
    ],
    type: 'code-exercise'
  }
];

export const javascriptCodeExercises: CodeExercise[] = [
  {
    id: 'js_code_001',
    content: 'Write a function that takes two numbers and returns their sum.',
    starterCode: `function add(a, b) {
  // Your code here
}`,
    testCases: [
      { input: 'add(2, 3)', expectedOutput: '5' },
      { input: 'add(10, 5)', expectedOutput: '15' },
      { input: 'add(-1, 1)', expectedOutput: '0' }
    ],
    explanation: 'Create a function that takes two parameters and returns their sum using the + operator.',
    difficulty: 'beginner',
    track: 'javascript',
    points: 25,
    hints: [
      'Use the + operator to add the parameters',
      'Return the result of the addition',
      'Make sure to return the value, not just log it'
    ],
    type: 'code-exercise'
  },
  {
    id: 'js_code_002',
    content: 'Create a function that checks if a number is even.',
    starterCode: `function isEven(number) {
  // Your code here
}`,
    testCases: [
      { input: 'isEven(4)', expectedOutput: 'true' },
      { input: 'isEven(7)', expectedOutput: 'false' },
      { input: 'isEven(0)', expectedOutput: 'true' }
    ],
    explanation: 'Use the modulo operator (%) to check if a number is divisible by 2. If the remainder is 0, the number is even.',
    difficulty: 'intermediate',
    track: 'javascript',
    points: 30,
    hints: [
      'Use the modulo operator % to check remainder',
      'If number % 2 === 0, the number is even',
      'Return true for even numbers, false for odd'
    ],
    type: 'code-exercise'
  }
];

// Combined question banks
export const allQuestions: Question[] = [
  ...htmlQuestions,
  ...cssQuestions,
  ...javascriptQuestions
];

export const allCodeExercises: CodeExercise[] = [
  ...htmlCodeExercises,
  ...cssCodeExercises,
  ...javascriptCodeExercises
];

// Question bank by track
export const questionsByTrack: { [key in LearningTrack]: Question[] } = {
  html: htmlQuestions,
  css: cssQuestions,
  javascript: javascriptQuestions
};

export const codeExercisesByTrack: { [key in LearningTrack]: CodeExercise[] } = {
  html: htmlCodeExercises,
  css: cssCodeExercises,
  javascript: javascriptCodeExercises
};

// Question bank by difficulty
export const questionsByDifficulty: { [key in DifficultyLevel]: Question[] } = {
  beginner: allQuestions.filter(q => q.difficulty === 'beginner'),
  intermediate: allQuestions.filter(q => q.difficulty === 'intermediate'),
  advanced: allQuestions.filter(q => q.difficulty === 'advanced')
};

export const codeExercisesByDifficulty: { [key in DifficultyLevel]: CodeExercise[] } = {
  beginner: allCodeExercises.filter(e => e.difficulty === 'beginner'),
  intermediate: allCodeExercises.filter(e => e.difficulty === 'intermediate'),
  advanced: allCodeExercises.filter(e => e.difficulty === 'advanced')
};

// Utility functions
export const getQuestionsByTrackAndDifficulty = (
  track: LearningTrack,
  difficulty: DifficultyLevel
): Question[] => {
  return questionsByTrack[track].filter(q => q.difficulty === difficulty);
};

export const getCodeExercisesByTrackAndDifficulty = (
  track: LearningTrack,
  difficulty: DifficultyLevel
): CodeExercise[] => {
  return codeExercisesByTrack[track].filter(e => e.difficulty === difficulty);
};

export const getRandomQuestions = (
  track: LearningTrack,
  difficulty: DifficultyLevel,
  count: number
): Question[] => {
  const questions = getQuestionsByTrackAndDifficulty(track, difficulty);
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getRandomCodeExercises = (
  track: LearningTrack,
  difficulty: DifficultyLevel,
  count: number
): CodeExercise[] => {
  const exercises = getCodeExercisesByTrackAndDifficulty(track, difficulty);
  const shuffled = [...exercises].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getQuestionById = (id: string): Question | undefined => {
  return allQuestions.find(q => q.id === id);
};

export const getCodeExerciseById = (id: string): CodeExercise | undefined => {
  return allCodeExercises.find(e => e.id === id);
};

export const getTotalQuestionsCount = (): number => {
  return allQuestions.length;
};

export const getTotalCodeExercisesCount = (): number => {
  return allCodeExercises.length;
};

export const getQuestionsCountByTrack = (track: LearningTrack): number => {
  return questionsByTrack[track].length;
};

export const getCodeExercisesCountByTrack = (track: LearningTrack): number => {
  return codeExercisesByTrack[track].length;
};

export const getQuestionsCountByDifficulty = (difficulty: DifficultyLevel): number => {
  return questionsByDifficulty[difficulty].length;
};

export const getCodeExercisesCountByDifficulty = (difficulty: DifficultyLevel): number => {
  return codeExercisesByDifficulty[difficulty].length;
};
