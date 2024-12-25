document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const chapter = urlParams.get('chapter');
    const recipe = urlParams.get('recipe');

    // Fetch recipe data
    const recipeData = getRecipeData(chapter, recipe);

    // Render recipe content
    renderRecipe(recipeData);
});

function renderRecipe(recipeData) {
    const recipeContent = document.getElementById('recipe-content');
    recipeContent.innerHTML = `
        <h1 class="pixel-font text-3xl text-coffee-dark mb-6">${recipeData.title}</h1>
        <p class="body-font text-lg text-coffee mb-8">${recipeData.description}</p>

        <div class="bg-white rounded-lg p-6 shadow-lg mb-8 hover:shadow-xl transition-shadow">
            <h2 class="pixel-font text-xl text-coffee-dark mb-4">Ingredients</h2>
            <ul class="body-font space-y-2">
                ${recipeData.ingredients.map(ingredient => `
                    <li class="flex items-center text-coffee">
                        <span class="mr-2 text-coffee-dark">•</span>
                        ${ingredient}
                    </li>
                `).join('')}
            </ul>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-lg mb-8 hover:shadow-xl transition-shadow">
            <h2 class="pixel-font text-xl text-coffee-dark mb-4">Steps</h2>
            <ol class="body-font space-y-4">
                ${recipeData.steps.map((step, index) => `
                    <li class="flex items-start text-coffee group">
                        <span class="pixel-font mr-4 text-coffee-dark group-hover:text-coffee transition-colors">${index + 1}.</span>
                        <span class="group-hover:text-coffee-dark transition-colors">${step}</span>
                    </li>
                `).join('')}
            </ol>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h2 class="pixel-font text-xl text-coffee-dark mb-4">Try it yourself!</h2>
            <div class="code-editor-container">
                <textarea id="code-editor">${recipeData.codeSnippet}</textarea>
            </div>
        </div>
    `;

    // Initialize CodeMirror
    const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        lineNumbers: true,
        mode: recipeData.language,
        theme: 'monokai',
        viewportMargin: Infinity,
        lineWrapping: true,
        tabSize: 2,
        scrollbarStyle: null,
        extraKeys: {"Ctrl-Space": "autocomplete"},
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        indentWithTabs: false,
    });

    // Adjust editor height based on content
    const lineCount = editor.lineCount();
    const editorHeight = Math.min(lineCount * 20, 400); // 20px per line, max 400px
    editor.setSize(null, editorHeight);

    addCopyCodeButton(editor);
    createToastContainer();
}

function addCopyCodeButton(editor) {
    const codeContainer = document.querySelector('.code-editor-container');
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy Code';
    copyButton.className = 'pixel-font bg-coffee hover:bg-coffee-dark text-white px-4 py-2 rounded-lg mt-4 transition-colors';
    copyButton.addEventListener('click', () => {
        const code = editor.getValue();
        navigator.clipboard.writeText(code).then(() => {
            showToast(getRandomCopyMessage());
        }).catch((err) => {
            console.error('Failed to copy text: ', err);
            showToast('Failed to copy code', 'error');
        });
    });
    codeContainer.appendChild(copyButton);
}

function createToastContainer() {
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-4 right-4 z-50';
        document.body.appendChild(container);
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `${type === 'success' ? 'bg-coffee' : 'bg-red-500'} text-white px-4 py-2 rounded-lg shadow-lg mb-2 transform transition-all duration-300 ease-in-out`;
    toast.textContent = message;
    container.appendChild(toast);

    // Animate the toast
    requestAnimationFrame(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(100%)';
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });
    });

    // Remove the toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(100%)';
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 3000);
}

function getRandomCopyMessage() {
    const messages = [
        "Code copied faster than you can say 'bug'!",
        "Congratulations! You've just cloned a masterpiece.",
        "Code acquired! Time to sprinkle some magic.",
        "Copied! Now go forth and create chaos... I mean, code!",
        "Success! You're now the proud owner of some borrowed brilliance.",
        "Code snatched! Use it wisely, young padawan.",
        "Voila! The code is now at your fingertips. No pressure!",
        "Code duplicated! Remember, with great power comes great compile time.",
        "Yoink! That code is yours now. Good luck explaining it later!",
        "Code successfully assimilated into your clipboard collective."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function getRecipeData(chapter, recipe) {
    const recipes = {
        'git': {
            'what-is-git': {
                title: 'What is Git?',
                description: 'Learn about Git, the distributed version control system.',
                ingredients: ['Git installed on your computer', 'A terminal or command prompt'],
                steps: [
                    'Open your terminal or command prompt.',
                    'Type "git --version" to check if Git is installed.',
                    'If not installed, download and install Git from git-scm.com.',
                    'Configure Git with your name and email using the commands below.'
                ],
                codeSnippet: `git --version
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"`,
                language: 'shell'
            },
            'git-init': {
                title: 'Git Init',
                description: 'Learn how to initialize a new Git repository.',
                ingredients: ['Git installed on your computer', 'A terminal or command prompt', 'A directory for your project'],
                steps: [
                    'Open your terminal or command prompt.',
                    'Navigate to your project directory using the cd command.',
                    'Run the git init command to initialize a new Git repository.',
                    'Verify that the repository was created by checking for the .git directory.'
                ],
                codeSnippet: `cd /path/to/your/project
git init
ls -la  # On Unix-like systems
dir /a  # On Windows`,
                language: 'shell'
            },
            'git-commit': {
                title: 'Git Commit',
                description: 'Learn how to commit changes to your Git repository.',
                ingredients: ['Git repository', 'Changes to commit', 'A terminal or command prompt'],
                steps: [
                    'Open your terminal and navigate to your Git repository.',
                    'Use git status to see which files have been modified.',
                    'Add files to the staging area using git add.',
                    'Commit the changes with a descriptive message using git commit.'
                ],
                codeSnippet: `git status
git add .
git commit -m "Add a descriptive commit message here"`,
                language: 'shell'
            }
        },
        'python': {
            'variables': {
                title: 'Python Variables',
                description: 'Learn how to create and use variables in Python.',
                ingredients: ['Python installed on your computer', 'A text editor or IDE'],
                steps: [
                    'Open your Python environment (IDLE, Jupyter Notebook, or a text editor).',
                    'Declare variables using meaningful names.',
                    'Assign values to variables using the "=" operator.',
                    'Print variables to see their values.'
                ],
                codeSnippet: `# Declaring and assigning variables
name = "Alice"
age = 30
height = 1.75

# Printing variables
print("Name:", name)
print("Age:", age)
print("Height:", height)

# Modifying variables
age = age + 1
print("New age:", age)`,
                language: 'python'
            },
            'functions': {
                title: 'Python Functions',
                description: 'Learn how to define and use functions in Python.',
                ingredients: ['Python installed on your computer', 'A text editor or IDE'],
                steps: [
                    'Open your Python environment.',
                    'Define a function using the def keyword.',
                    'Add parameters to your function if needed.',
                    'Write the function body, indented under the definition.',
                    'Call the function to execute it.'
                ],
                codeSnippet: `def greet(name):
    return f"Hello, {name}!"

# Calling the function
message = greet("Alice")
print(message)

def add_numbers(a, b):
    return a + b

result = add_numbers(5, 3)
print("Sum:", result)`,
                language: 'python'
            },
            'loops': {
                title: 'Python Loops',
                description: 'Learn how to use for and while loops in Python.',
                ingredients: ['Python installed on your computer', 'A text editor or IDE'],
                steps: [
                    'Open your Python environment.',
                    'Write a for loop to iterate over a sequence.',
                    'Write a while loop to repeat an action while a condition is true.',
                    'Use break and continue statements to control loop execution.'
                ],
                codeSnippet: `# For loop
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# While loop
count = 0
while count < 5:
    print(count)
    count += 1

# Using break and continue
for i in range(10):
    if i == 3:
        continue  # Skip 3
    if i == 7:
        break  # Stop at 7
    print(i)`,
                language: 'python'
            }
        },
        'javascript': {
            'variables': {
                title: 'JavaScript Variables',
                description: 'Learn how to declare and use variables in JavaScript.',
                ingredients: ['A web browser or Node.js environment', 'A text editor or IDE'],
                steps: [
                    'Open your JavaScript environment (browser console or Node.js).',
                    'Declare variables using let, const, or var keywords.',
                    'Assign values to variables using the "=" operator.',
                    'Use console.log() to print variable values.'
                ],
                codeSnippet: `// Declaring and assigning variables
let name = "Bob";
const age = 25;
var height = 1.80;

// Printing variables
console.log("Name:", name);
console.log("Age:", age);
console.log("Height:", height);

// Modifying variables
name = "Robert";
console.log("New name:", name);`,
                language: 'javascript'
            },
            'functions': {
                title: 'JavaScript Functions',
                description: 'Learn how to define and use functions in JavaScript.',
                ingredients: ['A web browser or Node.js environment', 'A text editor or IDE'],
                steps: [
                    'Open your JavaScript environment.',
                    'Define a function using the function keyword or arrow syntax.',
                    'Add parameters to your function if needed.',
                    'Write the function body.',
                    'Call the function to execute it.'
                ],
                codeSnippet: `// Function declaration
function greet(name) {
    return \`Hello, \${name}!\`;
}

// Arrow function
const add = (a, b) => a + b;

// Calling functions
console.log(greet("Alice"));
console.log(add(5, 3));

// Function with default parameter
function welcome(name = "Guest") {
    console.log(\`Welcome, \${name}!\`);
}

welcome();
welcome("Bob");`,
                language: 'javascript'
            },
            'dom-manipulation': {
                title: 'DOM Manipulation',
                description: 'Learn how to interact with the Document Object Model (DOM) using JavaScript.',
                ingredients: ['A web browser', 'A text editor', 'Basic HTML knowledge'],
                steps: [
                    'Create an HTML file with some elements.',
                    'Use JavaScript to select DOM elements.',
                    'Modify element content and attributes.',
                    'Create new elements and add them to the DOM.',
                    'Handle events like clicks and form submissions.'
                ],
                codeSnippet: `// Selecting elements
const title = document.getElementById('title');
const paragraphs = document.getElementsByTagName('p');
const buttons = document.querySelectorAll('.btn');

// Modifying elements
title.textContent = 'New Title';
paragraphs[0].style.color = 'blue';

// Creating and adding elements
const newDiv = document.createElement('div');
newDiv.textContent = 'New Element';
document.body.appendChild(newDiv);

// Event handling
buttons.forEach(button => {
    button.addEventListener('click', () => {
        console.log('Button clicked!');
    });
});`,
                language: 'javascript'
            }
        },
        'nvim': {
            'modes': {
                title: 'Vim Modes',
                description: 'Learn about the different modes in Vim and Neovim.',
                ingredients: ['Vim or Neovim installed on your computer', 'A terminal'],
                steps: [
                    'Open Vim or Neovim in your terminal by typing "vim" or "nvim".',
                    'Start in Normal mode (default when you open Vim).',
                    'Press "i" to enter Insert mode.',
                    'Press "Esc" to return to Normal mode.',
                    'Press "v" to enter Visual mode.',
                    'Press ":" in Normal mode to enter Command-line mode.'
                ],
                codeSnippet: `# This is a text file
# Practice switching between modes:
# - Normal mode: navigate and edit
# - Insert mode: type text
# - Visual mode: select text
# - Command-line mode: enter commands

Hello, Vim world!`,
                language: 'plaintext'
            },
            'navigation': {
                title: 'Vim Navigation',
                description: 'Learn how to navigate efficiently in Vim and Neovim.',
                ingredients: ['Vim or Neovim installed on your computer', 'A terminal', 'A text file to practice on'],
                steps: [
                    'Open a file in Vim or Neovim.',
                    'Use h, j, k, l keys for basic left, down, up, right movement.',
                    'Use w to move forward by word, b to move backward by word.',
                    'Use 0 to move to the start of a line, $ to move to the end.',
                    'Use gg to go to the top of the file, G to go to the bottom.',
                    'Combine numbers with movements, e.g., 5j to move down 5 lines.'
                ],
                codeSnippet: `# Practice these movements:
# h - move left
# j - move down
# k - move up
# l - move right
# w - move to next word
# b - move to previous word
# 0 - move to start of line
# $ - move to end of line
# gg - go to top of file
# G - go to bottom of file`,
                language: 'plaintext'
            },
            'plugins': {
                title: 'Vim Plugins',
                description: 'Learn how to enhance Vim or Neovim with plugins.',
                ingredients: ['Vim or Neovim installed on your computer', 'A terminal', 'Internet connection'],
                steps: [
                    'Choose a plugin manager (e.g., vim-plug for Vim, packer.nvim for Neovim).',
                    'Install the plugin manager.',
                    'Edit your Vim/Neovim configuration file.',
                    'Add plugins to your configuration.',
                    'Install the plugins.',
                    'Configure and use the installed plugins.'
                ],
                codeSnippet: `" Example Vim configuration with vim-plug
call plug#begin('~/.vim/plugged')

" Fuzzy finder
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
Plug 'junegunn/fzf.vim'

" File explorer
Plug 'preservim/nerdtree'

" Status line
Plug 'vim-airline/vim-airline'

call plug#end()

" Plugin configurations
nnoremap <C-n> :NERDTreeToggle<CR>
nnoremap <C-p> :Files<CR>`,
                language: 'vim'
            }
        }
    };

    if (!recipes[chapter] || !recipes[chapter][recipe]) {
        return {
            title: "Recipe Not Found",
            description: "Sorry, the requested recipe could not be found.",
            ingredients: [],
            steps: [],
            codeSnippet: "",
            language: "plaintext"
        };
    }

    return recipes[chapter][recipe];
}
