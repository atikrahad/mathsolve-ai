
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'data', 'challenges.json');
const languages = ['javascript', 'typescript', 'python', 'java', 'cpp', 'c'];

const padSlug = (index) => (index + 1).toString().padStart(2, '0');

const starterCodeForExample = (exampleInput) => ({
  javascript: `export function solveProblem(input) {
  // Example input: ${exampleInput}
  return null;
}
`,
  typescript: `type ProblemInput = Record<string, unknown>;

export function solveProblem(input: ProblemInput): unknown {
  // Example input: ${exampleInput}
  return null;
}
`,
  python: `from typing import Any, Dict

"""Example input: ${exampleInput}"""

def solve_problem(data: Dict[str, Any]) -> Any:
    return None
`,
  java: `import java.util.*;

public class Solution {
    public static Object solveProblem(String inputJson) {
        // Example input: ${exampleInput}
        return null;
    }
}
`,
  cpp: `#include <string>
using namespace std;

string solveProblem(const string& inputJson) {
    // Example input: ${exampleInput}
    return "";
}
`,
  c: `#include <stdio.h>

void solveProblem(const char* input_json) {
    // Example input: ${exampleInput}
}
`,
});

const difficultyFromIndex = (index, total) => {
  const ratio = (index + 1) / total;
  if (ratio <= 0.34) return 'EASY';
  if (ratio <= 0.67) return 'MEDIUM';
  return 'HARD';
};

const twoSumIndices = (nums, target) => {
  const map = new Map();
  for (let i = 0; i < nums.length; i += 1) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [-1, -1];
};

const kadane = (nums) => {
  let best = nums[0];
  let current = nums[0];
  for (let i = 1; i < nums.length; i += 1) {
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
};

const longestUniqueLen = (s) => {
  const seen = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right += 1) {
    const ch = s[right];
    if (seen.has(ch) && seen.get(ch) >= left) {
      left = seen.get(ch) + 1;
    }
    seen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
};

const findAnagramIndices = (s, p) => {
  const need = new Array(26).fill(0);
  for (const ch of p) {
    need[ch.charCodeAt(0) - 97] += 1;
  }
  const window = new Array(26).fill(0);
  const result = [];
  for (let i = 0; i < s.length; i += 1) {
    window[s.charCodeAt(i) - 97] += 1;
    if (i >= p.length) {
      window[s.charCodeAt(i - p.length) - 97] -= 1;
    }
    if (i + 1 >= p.length) {
      let valid = true;
      for (let j = 0; j < 26; j += 1) {
        if (window[j] !== need[j]) {
          valid = false;
          break;
        }
      }
      if (valid) {
        result.push(i - p.length + 1);
      }
    }
  }
  return result;
};

const countIslands = (grid) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  let count = 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const dfs = (r, c) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (grid[r][c] !== '1' || visited[r][c]) return;
    visited[r][c] = true;
    for (const [dr, dc] of dirs) dfs(r + dr, c + dc);
  };
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r][c] === '1' && !visited[r][c]) {
        count += 1;
        dfs(r, c);
      }
    }
  }
  return count;
};

const spiralOrder = (matrix) => {
  const result = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c += 1) result.push(matrix[top][c]);
    top += 1;
    for (let r = top; r <= bottom; r += 1) result.push(matrix[r][right]);
    right -= 1;
    if (top <= bottom) {
      for (let c = right; c >= left; c -= 1) result.push(matrix[bottom][c]);
      bottom -= 1;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r -= 1) result.push(matrix[r][left]);
      left += 1;
    }
  }
  return result;
};

const climbStairs = (n) => {
  if (n <= 2) return n;
  let a = 1;
  let b = 2;
  for (let i = 3; i <= n; i += 1) {
    const c = a + b;
    a = b;
    b = c;
  }
  return b;
};

const coinChange = (coins, amount) => {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (const coin of coins) {
    for (let i = coin; i <= amount; i += 1) {
      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
};

const mergeIntervals = (intervals) => {
  if (!intervals.length) return [];
  const sorted = intervals.slice().sort((a, b) => a[0] - b[0]);
  const result = [sorted[0].slice()];
  for (let i = 1; i < sorted.length; i += 1) {
    const current = sorted[i];
    const last = result[result.length - 1];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      result.push(current.slice());
    }
  }
  return result;
};

const kthLargest = (nums, k) => {
  const sorted = nums.slice().sort((a, b) => b - a);
  return sorted[k - 1];
};

const shortestPath = (grid) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const queue = [[0, 0, 0]];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  if (grid[0][0] === 1 || grid[rows - 1][cols - 1] === 1) return -1;
  visited[0][0] = true;
  while (queue.length) {
    const [r, c, d] = queue.shift();
    if (r === rows - 1 && c === cols - 1) return d;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (grid[nr][nc] === 1 || visited[nr][nc]) continue;
      visited[nr][nc] = true;
      queue.push([nr, nc, d + 1]);
    }
  }
  return -1;
};

const rangeSums = (nums, queries) => {
  const prefix = [0];
  for (const num of nums) {
    prefix.push(prefix[prefix.length - 1] + num);
  }
  return queries.map(([l, r]) => prefix[r + 1] - prefix[l]);
};

const createJson = (value) => JSON.stringify(value);

const families = [
  {
    slugBase: 'pair-with-target-sum',
    title: 'Pair With Target Sum',
    category: 'Arrays',
    topics: ['arrays', 'hash-map', 'two-pointers'],
    tags: ['warmup', 'interview'],
    variantCount: 12,
    buildVariant: (index, total) => {
      const length = 6 + (index % 5);
      const step = (index % 3) + 2;
      const offset = index + 2;
      const nums = Array.from({ length }, (_, idx) => offset + idx * step);
      const samplePair = [1, length - 2];
      const sample = { nums, target: nums[samplePair[0]] + nums[samplePair[1]] };
      const altNums = nums.map((value, idx) => value + (idx % 2 === 0 ? 3 : -1));
      const alt = { nums: altNums, target: altNums[0] + altNums[altNums.length - 1] };
      const thirdNums = nums.map((value, idx) => value + 5 + idx);
      const third = { nums: thirdNums, target: thirdNums[2] + thirdNums[thirdNums.length - 3] };
      const difficulty = difficultyFromIndex(index, total);
      return {
        difficulty,
        prompt: 'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`. Variation ' + (index + 1) + ' focuses on larger arrays where a hash map or two-pointer approach is required.',
        constraints: `2 <= nums.length <= ${length * 800}
-${length * 1200} <= nums[i] <= ${length * 1200}
-${length * 1200} <= target <= ${length * 1200}`,
        sampleInput: createJson(sample),
        sampleOutput: createJson(twoSumIndices(sample.nums, sample.target)),
        testCases: [
          { isSample: true, input: createJson(sample), output: createJson(twoSumIndices(sample.nums, sample.target)), score: 5 },
          { isSample: false, input: createJson(alt), output: createJson(twoSumIndices(alt.nums, alt.target)), score: 10 },
          { isSample: false, input: createJson(third), output: createJson(twoSumIndices(third.nums, third.target)), score: 10 },
        ],
      };
    },
  },
  {
    slugBase: 'maximum-subarray-sum',
    title: 'Maximum Subarray Sum',
    category: 'Arrays',
    topics: ['arrays', 'dynamic-programming', 'prefix-sum'],
    tags: ['kadane', 'sliding-window'],
    variantCount: 12,
    buildVariant: (index, total) => {
      const length = 7 + (index % 6);
      const nums = Array.from({ length }, (_, idx) => ((idx % 2 === 0 ? 1 : -1) * (idx + 2 + index)));
      nums[2] *= -1;
      nums[3] = Math.abs(nums[3]);
      const alt = nums.map((value, idx) => value + (idx % 3 === 0 ? 2 : -2));
      const third = nums.map((value, idx) => (idx % 2 === 0 ? value + 3 : value - 3));
      const difficulty = difficultyFromIndex(index, total);
      const makeInput = (arr) => ({ nums: arr });
      const sample = makeInput(nums);
      return {
        difficulty,
        prompt: 'Given an integer array `nums`, find the contiguous subarray with the largest sum and return that sum. Variation ' + (index + 1) + ' introduces longer negative streaks, so efficient dynamic programming is required.',
        constraints: `1 <= nums.length <= ${length * 1000}
-10^5 <= nums[i] <= 10^5`,
        sampleInput: createJson(sample),
        sampleOutput: createJson(kadane(nums)),
        testCases: [
          { isSample: true, input: createJson(sample), output: createJson(kadane(nums)), score: 5 },
          { isSample: false, input: createJson({ nums: alt }), output: createJson(kadane(alt)), score: 10 },
          { isSample: false, input: createJson({ nums: third }), output: createJson(kadane(third)), score: 10 },
        ],
      };
    },
  },
  {
    slugBase: 'longest-unique-substring',
    title: 'Longest Unique Substring',
    category: 'Strings',
    topics: ['strings', 'sliding-window'],
    tags: ['hash-map', 'two-pointers'],
    variantCount: 10,
    buildVariant: (index, total) => {
      const alpha = 'abcdefghijklmnopqrstuvwxyz';
      const block = 5 + (index % 5);
      let s = '';
      for (let i = 0; i < 3; i += 1) {
        const start = (index * 3 + i * 2) % (alpha.length - block);
        s += alpha.slice(start, start + block);
      }
      s += alpha.slice(0, block - 1);
      const alt = s.split('').reverse().join('').slice(0, block * 2) + alpha.slice(0, 4);
      const third = alpha.slice(block, block * 2) + alpha.slice(0, block) + alpha.slice(block - 2, block + 2);
      const difficulty = difficultyFromIndex(index, total);
      return {
        difficulty,
        prompt: 'Given a string `s`, find the length of the longest substring without repeating characters. Variation ' + (index + 1) + ' stresses long repeating windows to push the sliding-window implementation.',
        constraints: `1 <= s.length <= ${500 + index * 40}`,
        sampleInput: createJson({ s }),
        sampleOutput: createJson(longestUniqueLen(s)),
        testCases: [
          { isSample: true, input: createJson({ s }), output: createJson(longestUniqueLen(s)), score: 5 },
          { isSample: false, input: createJson({ s: alt }), output: createJson(longestUniqueLen(alt)), score: 10 },
          { isSample: false, input: createJson({ s: third }), output: createJson(longestUniqueLen(third)), score: 10 },
        ],
      };
    },
  },
  {
    slugBase: 'anagram-start-indices',
    title: 'Anagram Start Indices',
    category: 'Strings',
    topics: ['strings', 'sliding-window', 'hash-map'],
    tags: ['frequency-counter', 'pattern-matching'],
    variantCount: 10,
    buildVariant: (index, total) => {
      const alpha = 'abcdefghijklmnopqrstuvwxyz';
      const patternLength = 3 + (index % 3);
      const start = (index * 2) % (alpha.length - patternLength - 1);
      const pattern = alpha.slice(start, start + patternLength);
      const reversed = pattern.split('').reverse().join('');
      const filler = alpha.slice(start + 1, start + 1 + patternLength);
      const s = pattern + filler + reversed + pattern + filler.slice(0, patternLength) + reversed;
      const alt = filler + pattern + filler.split('').reverse().join('') + pattern;
      const third = reversed + filler + pattern + filler;
      const difficulty = difficultyFromIndex(index, total);
      const buildCase = (str) => ({ s: str, p: pattern });
      return {
        difficulty,
        prompt: 'Given two strings `s` and `p`, return all start indices of `p`\'s anagrams in `s`. Variation ' + (index + 1) + ' adds dense repeating zones that require careful frequency tracking.',
        constraints: `1 <= s.length <= ${600 + index * 30}
1 <= p.length <= ${patternLength + 2}`,
        sampleInput: createJson(buildCase(s)),
        sampleOutput: createJson(findAnagramIndices(s, pattern)),
        testCases: [
          { isSample: true, input: createJson(buildCase(s)), output: createJson(findAnagramIndices(s, pattern)), score: 5 },
          { isSample: false, input: createJson(buildCase(alt)), output: createJson(findAnagramIndices(alt, pattern)), score: 10 },
          { isSample: false, input: createJson(buildCase(third)), output: createJson(findAnagramIndices(third, pattern)), score: 10 },
        ],
      };
    },
  },
  {
    slugBase: 'number-of-islands',
    title: 'Number of Islands',
    category: 'Graphs',
    topics: ['graph', 'dfs', 'bfs'],
    tags: ['grid', 'flood-fill'],
    variantCount: 10,
    buildVariant: (index, total) => {
      const rows = 3 + (index % 3);
      const cols = 4 + ((index + 1) % 3);
      const grid = Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => ((r + c + index) % 3 === 0 ? '1' : '0')).join('')
      );
      const alt = grid.map((row, r) => row.split('').map((ch, c) => ((r * c + index) % 4 === 0 ? '1' : ch)).join(''));
      const third = grid.map((row, r) => row.split('').map((ch, c) => ((r + 2 * c + index) % 5 === 0 ? '1' : ch)).join(''));
      const difficulty = difficultyFromIndex(index, total);
      return {
        difficulty,
        prompt: 'Given a 2D grid map of `1`s (land) and `0`s (water), count the number of islands. Variation ' + (index + 1) + ' uses grids with tricky diagonals, so be careful to only traverse four directions.',
        constraints: `1 <= grid.length <= ${rows * 5}
1 <= grid[0].length <= ${cols * 5}`,
        sampleInput: createJson({ grid }),
        sampleOutput: createJson(countIslands(grid)),
        testCases: [
          { isSample: true, input: createJson({ grid }), output: createJson(countIslands(grid)), score: 5 },
          { isSample: false, input: createJson({ grid: alt }), output: createJson(countIslands(alt)), score: 10 },
          { isSample: false, input: createJson({ grid: third }), output: createJson(countIslands(third)), score: 10 },
        ],
      };
    },
  },
  {
    slugBase: 'matrix-spiral-traversal',
    title: 'Matrix Spiral Traversal',
    category: 'Matrices',
    topics: ['matrix', 'simulation'],
    tags: ['implementation'],
    variantCount: 10,
    buildVariant: (index, total) => {
      const rows = 3 + (index % 3);
      const cols = 3 + ((index + 2) % 3);
      let value = 1 + index * rows;
      const matrix = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => value++)
      );
      const flipHorizontal = matrix.map((row) => row.slice().reverse());
      const flipVertical = matrix.slice().reverse();
      const difficulty = difficultyFromIndex(index, total);
      return {
        difficulty,
        prompt: 'Given an `m x n` matrix, return all elements in spiral order. Variation ' + (index + 1) + ' introduces rectangles where height and width differ greatly.',
        constraints: `1 <= m, n <= ${rows + cols + 4}`,
        sampleInput: createJson({ matrix }),
        sampleOutput: createJson(spiralOrder(matrix)),
        testCases: [
          { isSample: true, input: createJson({ matrix }), output: createJson(spiralOrder(matrix)), score: 5 },
          { isSample: false, input: createJson({ matrix: flipVertical }), output: createJson(spiralOrder(flipVertical)), score: 10 },
          { isSample: false, input: createJson({ matrix: flipHorizontal }), output: createJson(spiralOrder(flipHorizontal)), score: 10 },
        ],
      };
    },
  },
  {
    slugBase: 'climbing-stairs-ways',
    title: 'Climbing Stairs Ways',
    category: 'Dynamic Programming',
    topics: ['dynamic-programming'],
    tags: ['fibonacci'],
    variantCount: 8,
    buildVariant: (index, total) => {
      const n = 5 + index;
      const difficulty = difficultyFromIndex(index, total);
      const sample = { n };
      const alt = { n: n + 2 };
      const third = { n: n + 4 };
      return {
        difficulty,
        prompt: 'Given `n` steps, you can climb 1 or 2 steps at a time. Return the number of distinct ways to reach the top. Variation ' + (index + 1) + ' bumps `n` higher to emphasize memoization.',
        constraints: `1 <= n <= ${n + 40}`,
        sampleInput: createJson(sample),
        sampleOutput: createJson(climbStairs(sample.n)),
        testCases: [
          { isSample: true, input: createJson(sample), output: createJson(climbStairs(sample.n)), score: 5 },
          { isSample: false, input: createJson(alt), output: createJson(climbStairs(alt.n)), score: 10 },
          { isSample: false, input: createJson(third), output: createJson(climbStairs(third.n)), score: 10 },
        ],
      };
    },
  },
  {
    slugBase: 'coin-change-min-coins',
    title: 'Coin Change Minimum Coins',
    category: 'Dynamic Programming',
    topics: ['dynamic-programming', 'greedy'],
    tags: ['coin-change'],
    variantCount: 8,
    buildVariant: (index, total) => {
      const coinSets = [
        [1, 2, 5],
        [1, 3, 4],
        [2, 5, 10],
        [1, 5, 7],
      ];
      const coins = coinSets[index % coinSets.length];
      const amount = 11 + index;
      const difficulty = difficultyFromIndex(index, total);
      const sample = { coins, amount };
      const alt = { coins, amount: amount + 3 };
      const third = { coins, amount: amount + 5 };
      return {
        difficulty,
        prompt: 'You are given coins of different denominations and a total amount. Compute the fewest coins needed to make up the amount or return -1 if not possible. Variation ' + (index + 1) + ' mixes dense and sparse coin systems.',
        constraints: `1 <= amount <= ${amount + 100}
1 <= coins.length <= ${coins.length + 3}`,
        sampleInput: createJson(sample),
        sampleOutput: createJson(coinChange(coins, amount)),
        testCases: [
          { isSample: true, input: createJson(sample), output: createJson(coinChange(coins, amount)), score: 5 },
          { isSample: false, input: createJson(alt), output: createJson(coinChange(alt.coins, alt.amount)), score: 10 },
          { isSample: false, input: createJson(third), output: createJson(coinChange(third.coins, third.amount)), score: 10 },
        ],
      };
    },
  },
  {
    slugBase: 'merge-overlapping-intervals',
    title: 'Merge Overlapping Intervals',
    category: 'Intervals',
    topics: ['sorting', 'intervals'],
    tags: ['greedy', 'scheduling'],
    variantCount: 8,
    buildVariant: (index, total) => {
      const intervals = [];
      let start = index + 1;
      for (let i = 0; i < 5; i += 1) {
        const length = 2 + (i % 3);
        intervals.push([start, start + length]);
        start += i % 2 === 0 ? length - 1 : length + 1;
      }
      const alt = intervals.map(([a, b]) => [a + 1, b + 2]);
      const third = intervals.map(([a, b]) => [a + (index % 2), b + (index % 3)]);
      const difficulty = difficultyFromIndex(index, total);
      return {
        difficulty,
        prompt: 'Given an array of intervals, merge all overlapping intervals and return an array of the non-overlapping intervals. Variation ' + (index + 1) + ' injects tight overlaps to stress sorting correctness.',
        constraints: `1 <= intervals.length <= ${30 + index * 5}`,
        sampleInput: createJson({ intervals }),
        sampleOutput: createJson(mergeIntervals(intervals)),
        testCases: [
          { isSample: true, input: createJson({ intervals }), output: createJson(mergeIntervals(intervals)), score: 5 },
          { isSample: false, input: createJson({ intervals: alt }), output: createJson(mergeIntervals(alt)), score: 10 },
          { isSample: false, input: createJson({ intervals: third }), output: createJson(mergeIntervals(third)), score: 10 },
        ],
      };
    },
  },
  {
    slugBase: 'kth-largest-stream',
    title: 'Kth Largest Stream Value',
    category: 'Heaps',
    topics: ['heap', 'priority-queue'],
    tags: ['selection'],
    variantCount: 8,
    buildVariant: (index, total) => {
      const length = 6 + (index % 5);
      const nums = Array.from({ length }, (_, idx) => (idx + 3) * (index % 4 + 2));
      const k = (index % 3) + 2;
      const shuffled = nums.slice().reverse();
      const third = nums.map((value, idx) => value + (idx % 2 === 0 ? 5 : -3));
      const difficulty = difficultyFromIndex(index, total);
      const buildCase = (arr) => ({ nums: arr, k });
      return {
        difficulty,
        prompt: 'Given a stream represented by array `nums` and an integer `k`, return the k-th largest element at the end of the stream. Variation ' + (index + 1) + ' uses changing ranges so a heap-based approach is ideal.',
        constraints: `1 <= k <= ${k + 3}
1 <= nums.length <= ${length * 200}`,
        sampleInput: createJson(buildCase(nums)),
        sampleOutput: createJson(kthLargest(nums, k)),
        testCases: [
          { isSample: true, input: createJson(buildCase(nums)), output: createJson(kthLargest(nums, k)), score: 5 },
          { isSample: false, input: createJson(buildCase(shuffled)), output: createJson(kthLargest(shuffled, k)), score: 10 },
          { isSample: false, input: createJson(buildCase(third)), output: createJson(kthLargest(third, k)), score: 10 },
        ],
      };
    },
  },
  {
    slugBase: 'shortest-path-grid',
    title: 'Shortest Path on Grid',
    category: 'Graphs',
    topics: ['graph', 'bfs'],
    tags: ['grid', 'shortest-path'],
    variantCount: 8,
    buildVariant: (index, total) => {
      const size = 3 + (index % 3);
      const grid = Array.from({ length: size }, (_, r) =>
        Array.from({ length: size }, (_, c) => ((r + c + index) % 4 === 0 ? 1 : 0))
      );
      grid[0][0] = 0;
      grid[size - 1][size - 1] = 0;
      const alt = grid.map((row, r) => row.map((cell, c) => ((r * 2 + c + index) % 5 === 0 ? 1 : cell)));
      alt[0][0] = 0;
      alt[size - 1][size - 1] = 0;
      const third = grid.map((row, r) => row.map((cell, c) => ((r + 2 * c + index) % 6 === 0 ? 1 : cell)));
      third[0][0] = 0;
      third[size - 1][size - 1] = 0;
      const difficulty = difficultyFromIndex(index, total);
      return {
        difficulty,
        prompt: 'Given a grid of `0`s (open) and `1`s (blocked), return the length of the shortest path from `(0,0)` to `(m-1,n-1)` moving in four directions, or -1 if impossible. Variation ' + (index + 1) + ' introduces mazes that require BFS.',
        constraints: `2 <= grid.length, grid[0].length <= ${size * 10}`,
        sampleInput: createJson({ grid }),
        sampleOutput: createJson(shortestPath(grid)),
        testCases: [
          { isSample: true, input: createJson({ grid }), output: createJson(shortestPath(grid)), score: 5 },
          { isSample: false, input: createJson({ grid: alt }), output: createJson(shortestPath(alt)), score: 10 },
          { isSample: false, input: createJson({ grid: third }), output: createJson(shortestPath(third)), score: 10 },
        ],
      };
    },
  },
  {
    slugBase: 'range-sum-queries',
    title: 'Range Sum Queries',
    category: 'Arrays',
    topics: ['prefix-sum'],
    tags: ['queries', 'math'],
    variantCount: 8,
    buildVariant: (index, total) => {
      const length = 6 + (index % 5);
      const nums = Array.from({ length }, (_, idx) => idx + index);
      const queries = [
        [0, Math.min(length - 1, 2 + (index % 3))],
        [1, Math.min(length - 1, 3 + (index % 4))],
        [Math.max(0, length - 4), length - 1],
      ];
      const altQueries = queries.map(([l, r]) => [Math.max(0, l - 1), Math.min(length - 1, r)]);
      const thirdQueries = queries.map(([l, r]) => [l, Math.min(length - 1, r + (index % 2))]);
      const difficulty = difficultyFromIndex(index, total);
      return {
        difficulty,
        prompt: 'Given an integer array `nums` and multiple range queries `[l, r]`, return the sum for each query. Variation ' + (index + 1) + ' pushes for fast prefix-sum precomputation.',
        constraints: `1 <= nums.length <= ${length * 200}
1 <= queries.length <= 10^4`,
        sampleInput: createJson({ nums, queries }),
        sampleOutput: createJson(rangeSums(nums, queries)),
        testCases: [
          { isSample: true, input: createJson({ nums, queries }), output: createJson(rangeSums(nums, queries)), score: 5 },
          { isSample: false, input: createJson({ nums, queries: altQueries }), output: createJson(rangeSums(nums, altQueries)), score: 10 },
          { isSample: false, input: createJson({ nums, queries: thirdQueries }), output: createJson(rangeSums(nums, thirdQueries)), score: 10 },
        ],
      };
    },
  },
];

const timeByDifficulty = {
  EASY: 1500,
  MEDIUM: 2000,
  HARD: 2500,
};

const challenges = [];

for (const family of families) {
  for (let i = 0; i < family.variantCount; i += 1) {
    const variant = family.buildVariant(i, family.variantCount);
    const slug = `${family.slugBase}-${padSlug(i)}`;
    const exampleInput = variant.sampleInput;
    challenges.push({
      slug,
      title: `${family.title} #${i + 1}`,
      prompt: `${variant.prompt}

Return the answer according to the description.`,
      difficulty: variant.difficulty,
      category: family.category,
      topics: family.topics,
      languages,
      tags: family.tags,
      constraints: variant.constraints,
      sampleInput: variant.sampleInput,
      sampleOutput: variant.sampleOutput,
      starterCode: starterCodeForExample(exampleInput),
      solutionOutline: 'Use the canonical approach for this problem class (hash map, dynamic programming, BFS, prefix sums, or greedy sorting) and pay attention to the constraints described in the prompt.',
      editorialUrl: null,
      timeLimitMs: timeByDifficulty[variant.difficulty],
      memoryLimitKb: 262144,
      testCases: variant.testCases,
    });
  }
}

fs.writeFileSync(outputPath, JSON.stringify(challenges, null, 2));
console.log(`Generated ${challenges.length} challenges at ${outputPath}`);
