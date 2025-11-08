export interface DocSection {
  heading: string;
  body: string[];
  code?: {
    language: string;
    content: string;
  };
  tips?: string[];
}

export interface DocTopic {
  slug: string;
  title: string;
  description: string;
  duration: string;
  sections: DocSection[];
  resources?: { label: string; url: string }[];
}

export interface DocLanguage {
  id: string;
  name: string;
  level: string;
  summary: string;
  topics: DocTopic[];
}

export const DOC_LANGUAGES: DocLanguage[] = [
  {
    id: 'javascript',
    name: 'JavaScript Essentials',
    level: 'Beginner Friendly',
    summary:
      'Learn the fundamentals of JavaScript with practical explanations, annotated snippets, and hands-on challenges tailored for first-time coders.',
    topics: [
      {
        slug: 'getting-started',
        title: 'Getting Started with JS',
        description: 'Understand how browsers execute JavaScript and write your first snippet.',
        duration: '15 min read',
        sections: [
          {
            heading: 'What is JavaScript?',
            body: [
              'JavaScript is the language of the web. Browsers ship with an engine that reads your JS code and updates the page without reloading it.',
              'Think of JavaScript as instructions you whisper to the browser to make things interactive—show a message, fetch some data, or animate a button.',
            ],
            tips: [
              'Use your browser DevTools (F12 → Console tab) as a scratchpad.',
              'Always start with descriptive comments—future you will say thanks.',
            ],
          },
          {
            heading: 'Writing Your First Script',
            body: [
              'Place a `<script>` tag right before `</body>` so the HTML is loaded before the browser executes your script.',
              'Use `console.log` to print anything—you will rely on it a lot while debugging.',
            ],
            code: {
              language: 'javascript',
              content: `<!DOCTYPE html>
<html lang="en">
  <body>
    <button id="hi">Say hi</button>

    <script>
      const button = document.getElementById('hi');
      button.addEventListener('click', () => {
        console.log('Hello from MathSolve 🚀');
        alert('Your first JS interaction!');
      });
    </script>
  </body>
</html>`,
            },
          },
        ],
        resources: [
          { label: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' },
          { label: 'MathSolve Playground', url: '/problems?category=javascript' },
        ],
      },
      {
        slug: 'variables-and-types',
        title: 'Variables & Types',
        description: 'Store data with `let`, `const`, and pick the right type for the job.',
        duration: '18 min read',
        sections: [
          {
            heading: 'Declaring Variables',
            body: [
              '`const` is for values that never change. `let` is for values that will be reassigned.',
              '`var` still exists but avoid it in new code because it behaves unexpectedly with scopes.',
            ],
            code: {
              language: 'javascript',
              content: `const appName = 'MathSolve';
let attempts = 0;

attempts += 1;
console.log(\`Welcome to \${appName}. Attempt \${attempts}\`);`,
            },
          },
          {
            heading: 'Primitive Types',
            body: [
              'JavaScript has 7 primitives: string, number, boolean, null, undefined, symbol, bigint.',
              'Use `typeof value` to inspect what you are working with.',
            ],
            code: {
              language: 'javascript',
              content: `const score = 42;
const label = 'points';
const isPassed = score > 30;

console.log(typeof score); // "number"
console.log(\`\${score} \${label}\`); // template strings`,
            },
          },
        ],
      },
      {
        slug: 'control-flow',
        title: 'Control Flow Superpowers',
        description: 'Branch logic with if/else, loops, and guard clauses.',
        duration: '20 min read',
        sections: [
          {
            heading: 'If / Else',
            body: [
              'Guard clauses help keep code flat: return early if something looks wrong.',
              'Use strict equality `===` so the type must also match.',
            ],
            code: {
              language: 'javascript',
              content: `function grade(score) {
  if (typeof score !== 'number') {
    throw new Error('Score must be numeric');
  }
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  return 'Keep going!';
}`,
            },
          },
          {
            heading: 'Loops & Iteration',
            body: [
              '`for..of` is excellent for arrays; `for..in` is made for object keys.',
              'Array helpers (`map`, `filter`, `reduce`) express intent better than manual counters.',
            ],
            code: {
              language: 'javascript',
              content: `const submissions = [78, 92, 56];

const curved = submissions.map((score) => Math.min(score + 5, 100));
const passed = curved.filter((score) => score >= 80);

console.log(curved, passed);`,
            },
          },
        ],
      },
      {
        slug: 'asynchronous-javascript',
        title: 'Async JavaScript',
        description: 'Promises, async/await, and handling API calls without freezing the UI.',
        duration: '25 min read',
        sections: [
          {
            heading: 'Promises in Practice',
            body: [
              'A promise represents a value that will exist later. Chain `.then()` to act on it.',
              'Always add `.catch()` to handle rejected promises.',
            ],
            code: {
              language: 'javascript',
              content: `fetch('/api/score')
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Oops', error));`,
            },
          },
          {
            heading: 'Async / Await',
            body: [
              '`async` functions allow you to `await` promises inside and write code that reads top-down.',
              'Wrap awaited calls in try/catch for real-world resilience.',
            ],
            code: {
              language: 'javascript',
              content: `async function loadScoreboard() {
  try {
    const response = await fetch('/api/scoreboard');
    if (!response.ok) throw new Error('Request failed');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}`,
            },
          },
        ],
      },
      {
        slug: 'project-structure',
        title: 'Modules & Project Structure',
        description: 'Organize code using ES modules, environment configs, and reusable utilities.',
        duration: '18 min read',
        sections: [
          {
            heading: 'ES Modules',
            body: [
              'Use `export` / `export default` to share code between files.',
              'Group helper functions by feature, not by type, for better discoverability.',
            ],
            code: {
              language: 'javascript',
              content: `// utils/math.ts
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// usage
import { clamp } from './utils/math';`,
            },
          },
          {
            heading: 'Environment Separation',
            body: [
              'Store configuration in `.env.local` / `.env.production` and never commit secrets.',
              'Use a `config.ts` helper that reads from `process.env` and centralizes defaults.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'python',
    name: 'Python Foundations',
    level: 'Beginner Friendly',
    summary:
      'Master Python syntax, data structures, and problem solving patterns with narrative explanations and annotated notebooks.',
    topics: [
      {
        slug: 'python-basics',
        title: 'Python Basics',
        description: 'Understand indentation, print statements, and how the REPL works.',
        duration: '15 min read',
        sections: [
          {
            heading: 'Hello from the REPL',
            body: [
              'Launch the Python REPL by typing `python` or `python3` in your terminal.',
              'Indentation matters—Python decides code blocks via spaces, not braces.',
            ],
            code: {
              language: 'python',
              content: `name = "MathSolve"
attempts = 0

while attempts < 3:
    attempts += 1
    print(f"Attempt {attempts} with {name}")`,
            },
          },
        ],
        resources: [
          { label: 'Python Official Tutorial', url: 'https://docs.python.org/3/tutorial/' },
          { label: 'Real Python Basics', url: 'https://realpython.com/python-first-steps/' },
        ],
      },
      {
        slug: 'data-structures',
        title: 'Core Data Structures',
        description: 'Lists, dictionaries, tuples, and when to use each one.',
        duration: '20 min read',
        sections: [
          {
            heading: 'Lists vs Tuples',
            body: [
              'Lists are mutable (changeable); tuples are lightweight immutable containers.',
              'Use slicing `values[start:stop:step]` to grab portions without loops.',
            ],
            code: {
              language: 'python',
              content: `scores = [72, 88, 91]
scores.append(99)
top_two = scores[-2:]

point = (43.6, 71.2)  # tuple
x, y = point`,
            },
          },
          {
            heading: 'Dictionaries',
            body: [
              'Dictionaries map keys to values. Keys must be immutable (strings, numbers, tuples).',
              'Use `.get(key, default)` to avoid `KeyError`.',
            ],
            code: {
              language: 'python',
              content: `profile = {"username": "math_mentor", "streak": 15}
profile["streak"] += 1
print(profile.get("rank", "rookie"))`,
            },
          },
        ],
      },
      {
        slug: 'functions-and-modules',
        title: 'Functions & Modules',
        description: 'Write reusable helpers and split code into tidy modules.',
        duration: '22 min read',
        sections: [
          {
            heading: 'Defining Functions',
            body: [
              'Use type hints to document expectations (`def total(points: list[int]) -> int`).',
              'Docstrings explain the why—triple quotes right under the definition.',
            ],
            code: {
              language: 'python',
              content: `def average(points: list[int]) -> float:
    """Return the arithmetic mean of the points list."""
    if not points:
        raise ValueError("points cannot be empty")
    return sum(points) / len(points)`,
            },
          },
          {
            heading: 'Modules & Imports',
            body: [
              'Group helper functions in a `utils.py` and import them as needed.',
              'Use `if __name__ == "__main__":` to create scripts that can both run and be imported.',
            ],
            code: {
              language: 'python',
              content: `# stats.py
def percentile(scores, pct):
    scores = sorted(scores)
    index = int(len(scores) * pct)
    return scores[index]

if __name__ == "__main__":
    demo = [30, 50, 90, 100]
    print(percentile(demo, 0.75))`,
            },
          },
        ],
      },
      {
        slug: 'testing-and-debugging',
        title: 'Testing & Debugging Fundamentals',
        description: 'Write tests, use breakpoints, and adopt a methodical debugging workflow.',
        duration: '20 min read',
        sections: [
          {
            heading: 'Unit Tests with Pytest',
            body: [
              'Install pytest (`pip install pytest`), create files that start with `test_`.',
              'Keep tests near the code: `math/average.py` → `tests/test_average.py`.',
            ],
            code: {
              language: 'python',
              content: `# tests/test_average.py
from stats import average

def test_average_handles_positive_numbers():
    assert average([2, 4, 6]) == 4

def test_average_empty_list():
    with pytest.raises(ValueError):
        average([])`,
            },
          },
          {
            heading: 'Debugging Tips',
            body: [
              'Use `breakpoint()` in Python 3.7+ to drop into the debugger at runtime.',
              'Log intent before logic: `logger.info("loading scoreboard", extra={"user_id": user.id})`.',
            ],
          },
        ],
      },
      {
        slug: 'advanced-data-structures',
        title: 'Advanced Data Structures',
        description: 'Work with sets, deque, heapq, and build intuition for algorithmic challenges.',
        duration: '24 min read',
        sections: [
          {
            heading: 'Sets & Deduplication',
            body: [
              'Sets are optimized for membership checks (`if value in seen`).',
              'Convert lists to sets to drop duplicates with zero loops.',
            ],
            code: {
              language: 'python',
              content: `seen_scores = {78, 92, 78, 88}
seen_scores.add(100)
print(seen_scores)`,
            },
          },
          {
            heading: 'Heaps & Priority Queues',
            body: [
              '`heapq` implements a min-heap. Push negatives to simulate a max-heap.',
              'Great for "top K" style interview problems.',
            ],
            code: {
              language: 'python',
              content: `import heapq

scores = [42, 99, 65, 75]
largest_two = heapq.nlargest(2, scores)
print(largest_two)`,
            },
          },
        ],
      },
    ],
  },
];

export const DOC_LANGUAGE_MAP = DOC_LANGUAGES.reduce<Record<string, DocLanguage>>((acc, lang) => {
  acc[lang.id] = lang;
  return acc;
}, {});
