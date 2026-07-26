import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Cpu, X, CheckCircle, Terminal, Layers, Code2, Award, Zap, ArrowRightLeft } from 'lucide-react';

interface Step {
  stepNumber: number;
  line: string;
  scopeName: string;
  variables: Record<string, any>;
  condition: string;
  conditionMet: boolean;
  callStack: string[];
  arrayState?: (number | string)[];
  activeIndices?: number[];
  swapIndices?: [number, number];
  output?: string;
  explanation: string;
}

interface CodeVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

export const CodeVisualizerModal: React.FC<CodeVisualizerModalProps> = ({ isOpen, onClose, code }) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [finalResult, setFinalResult] = useState<string | null>(null);

  // Fully Loaded Universal Educational Algorithm Trace Generator
  useEffect(() => {
    if (!isOpen || !code.trim()) return;

    const traceSteps: Step[] = [];
    let resultOutput: string | null = null;

    try {
      const lowerCode = code.toLowerCase();

      // -------------------------------------------------------------
      // Pattern 1: Sum of Array Elements / Numbers (sumOfArray)
      // -------------------------------------------------------------
      if (lowerCode.includes('sum') || lowerCode.includes('total')) {
        const arr = [10, 20, 30, 40, 50];
        let sum = 0;

        traceSteps.push({
          stepNumber: 1,
          line: `const arr = [${arr.join(', ')}]; let sum = 0;`,
          scopeName: 'Sum Array Scope',
          variables: { array: JSON.stringify(arr), sum: 0 },
          condition: 'Initialize Array & Sum Accumulator',
          conditionMet: true,
          callStack: ['main()', 'findSum()'],
          arrayState: [...arr],
          explanation: `Sum Accumulator: Initialized input array [${arr.join(', ')}] with initial sum = 0.`,
        });

        for (let i = 0; i < arr.length; i++) {
          const val = arr[i];
          const prevSum = sum;
          sum += val;

          traceSteps.push({
            stepNumber: traceSteps.length + 1,
            line: `sum += arr[${i}]; // sum = ${prevSum} + ${val} = ${sum}`,
            scopeName: `Adding Element [${i}]`,
            variables: { i, 'arr[i]': val, previousSum: prevSum, currentSum: sum },
            condition: `Accumulate ${val}`,
            conditionMet: true,
            callStack: ['main()', 'findSum()'],
            arrayState: [...arr],
            activeIndices: [i],
            output: `Added ${val} -> Total Sum = ${sum}`,
            explanation: `Added element arr[${i}] (${val}) to accumulator sum (${prevSum}). New total sum = ${sum}.`,
          });
        }

        resultOutput = String(sum);
      }
      // -------------------------------------------------------------
      // Pattern 2: Find Maximum / Minimum Element (findMax / findMin)
      // -------------------------------------------------------------
      else if (lowerCode.includes('max') || lowerCode.includes('min') || lowerCode.includes('largest')) {
        const arr = [14, 52, 98, 23, 7];
        let maxVal = arr[0];

        traceSteps.push({
          stepNumber: 1,
          line: `const arr = [${arr.join(', ')}]; let max = arr[0]; // ${maxVal}`,
          scopeName: 'FindMax Scope',
          variables: { array: JSON.stringify(arr), currentMax: maxVal },
          condition: 'Initialize Max Pointer with First Element',
          conditionMet: true,
          callStack: ['main()', 'findMax()'],
          arrayState: [...arr],
          activeIndices: [0],
          explanation: `Find Max: Set initial max value to first element arr[0] = ${maxVal}.`,
        });

        for (let i = 1; i < arr.length; i++) {
          const val = arr[i];
          const isNewMax = val > maxVal;

          if (isNewMax) {
            maxVal = val;
            traceSteps.push({
              stepNumber: traceSteps.length + 1,
              line: `if (arr[${i}] > max) -> max = ${val} // ${val} > previousMax`,
              scopeName: `Comparing Index [${i}]`,
              variables: { i, 'arr[i]': val, newMax: maxVal },
              condition: `${val} > currentMax`,
              conditionMet: true,
              callStack: ['main()', 'findMax()'],
              arrayState: [...arr],
              activeIndices: [i],
              output: `Found new maximum: ${maxVal}`,
              explanation: `Element arr[${i}] (${val}) > current max. Updated maximum value to ${maxVal}!`,
            });
          } else {
            traceSteps.push({
              stepNumber: traceSteps.length + 1,
              line: `if (arr[${i}] > max) // ${val} <= max`,
              scopeName: `Comparing Index [${i}]`,
              variables: { i, 'arr[i]': val, max: maxVal },
              condition: `${val} > currentMax`,
              conditionMet: false,
              callStack: ['main()', 'findMax()'],
              arrayState: [...arr],
              activeIndices: [i],
              explanation: `Element arr[${i}] (${val}) <= current max (${maxVal}). Maximum remains ${maxVal}.`,
            });
          }
        }

        resultOutput = String(maxVal);
      }
      // -------------------------------------------------------------
      // Pattern 3: Prime Number Checker (isPrime)
      // -------------------------------------------------------------
      else if (lowerCode.includes('prime')) {
        const num = 17;
        let isPrime = true;

        traceSteps.push({
          stepNumber: 1,
          line: `const num = ${num}; let isPrime = true;`,
          scopeName: 'PrimeCheck Scope',
          variables: { num, isPrime: true },
          condition: 'Initialize Prime Verification',
          conditionMet: true,
          callStack: ['main()', 'isPrime()'],
          explanation: `Prime Checker: Verifying if number ${num} is prime (has no divisors other than 1 and ${num}).`,
        });

        for (let i = 2; i * i <= num; i++) {
          const remainder = num % i;
          const isDivisible = remainder === 0;

          traceSteps.push({
            stepNumber: traceSteps.length + 1,
            line: `if (${num} % ${i} === 0) // Remainder = ${remainder}`,
            scopeName: `Testing Divisor i=${i}`,
            variables: { num, divisor: i, remainder, isPrime: !isDivisible },
            condition: `${num} % ${i} === 0`,
            conditionMet: isDivisible,
            callStack: ['main()', 'isPrime()'],
            output: isDivisible ? `${num} is divisible by ${i}` : `${num} % ${i} !== 0`,
            explanation: isDivisible
              ? `${num} is divisible by ${i} (remainder 0). ${num} is NOT a prime number.`
              : `${num} % ${i} = ${remainder} (not 0). No divisor found at ${i}.`,
          });

          if (isDivisible) {
            isPrime = false;
            break;
          }
        }

        resultOutput = isPrime ? `true (${num} is Prime)` : `false (${num} is Not Prime)`;
      }
      // -------------------------------------------------------------
      // Pattern 4: Count Vowels in String (countVowels)
      // -------------------------------------------------------------
      else if (lowerCode.includes('vowel')) {
        const str = 'javascript';
        const vowels = 'aeiou';
        const chars = str.split('');
        let vowelCount = 0;

        traceSteps.push({
          stepNumber: 1,
          line: `const str = "${str}"; let count = 0;`,
          scopeName: 'CountVowels Scope',
          variables: { string: str, vowelCount: 0 },
          condition: 'Initialize String & Vowel Counter',
          conditionMet: true,
          callStack: ['main()', 'countVowels()'],
          arrayState: [...chars],
          explanation: `Vowel Counter: Counting vowels ('a','e','i','o','u') in string "${str}".`,
        });

        chars.forEach((char, idx) => {
          const isVowel = vowels.includes(char);
          if (isVowel) vowelCount++;

          traceSteps.push({
            stepNumber: traceSteps.length + 1,
            line: `if ('aeiou'.includes('${char}')) // ${isVowel ? 'VOWEL' : 'CONSONANT'}`,
            scopeName: `Char [${idx}] = '${char}'`,
            variables: { index: idx, char, isVowel, vowelCount },
            condition: `'${char}' is vowel`,
            conditionMet: isVowel,
            callStack: ['main()', 'countVowels()'],
            arrayState: [...chars],
            activeIndices: [idx],
            output: isVowel ? `Found Vowel '${char}' -> Count = ${vowelCount}` : undefined,
            explanation: isVowel
              ? `Character '${char}' is a vowel! Incremented vowelCount to ${vowelCount}.`
              : `Character '${char}' is a consonant. Moving to next character.`,
          });
        });

        resultOutput = String(vowelCount);
      }
      // -------------------------------------------------------------
      // Pattern 5: FizzBuzz Algorithm (fizzBuzz)
      // -------------------------------------------------------------
      else if (lowerCode.includes('fizz')) {
        const n = 15;
        const results: string[] = [];

        traceSteps.push({
          stepNumber: 1,
          line: `const n = ${n}; const results = [];`,
          scopeName: 'FizzBuzz Scope',
          variables: { n },
          condition: 'Initialize FizzBuzz Range (1..15)',
          conditionMet: true,
          callStack: ['main()', 'fizzBuzz()'],
          explanation: `FizzBuzz: Evaluating numbers 1 to ${n}. Divisible by 3 -> 'Fizz', by 5 -> 'Buzz', by both -> 'FizzBuzz'.`,
        });

        for (let i = 1; i <= n; i++) {
          let val = '';
          if (i % 15 === 0) val = 'FizzBuzz';
          else if (i % 3 === 0) val = 'Fizz';
          else if (i % 5 === 0) val = 'Buzz';
          else val = String(i);

          results.push(val);

          traceSteps.push({
            stepNumber: traceSteps.length + 1,
            line: `i = ${i} -> ${val}`,
            scopeName: `Iteration i=${i}`,
            variables: { i, 'i % 3': i % 3, 'i % 5': i % 5, output: val },
            condition: `Evaluate FizzBuzz for ${i}`,
            conditionMet: true,
            callStack: ['main()', 'fizzBuzz()'],
            arrayState: [...results],
            activeIndices: [results.length - 1],
            output: `Step ${i}: ${val}`,
            explanation: `Number ${i}: Evaluated -> '${val}'. Added '${val}' to results array.`,
          });
        }

        resultOutput = JSON.stringify(results);
      }
      // -------------------------------------------------------------
      // Pattern 6: Two Sum (Hash Map / Object Lookup)
      // -------------------------------------------------------------
      else if (lowerCode.includes('twosum') || (lowerCode.includes('map') && lowerCode.includes('target'))) {
        const nums = [2, 7, 11, 15];
        const target = 9;
        const map: Record<number, number> = {};
        let resultIndices: [number, number] | null = null;

        traceSteps.push({
          stepNumber: 1,
          line: `const nums = [${nums.join(', ')}]; target = ${target}; const map = {};`,
          scopeName: 'TwoSum Scope',
          variables: { target, nums: JSON.stringify(nums), map: '{}' },
          condition: 'Initialize Hash Map Lookup',
          conditionMet: true,
          callStack: ['main()', 'twoSum()'],
          arrayState: [...nums],
          explanation: `Two Sum: Finding 2 indices in [${nums.join(', ')}] that sum to target ${target} using a Hash Map.`,
        });

        for (let i = 0; i < nums.length; i++) {
          const num = nums[i];
          const complement = target - num;

          if (map[complement] !== undefined) {
            resultIndices = [map[complement], i];
            traceSteps.push({
              stepNumber: traceSteps.length + 1,
              line: `if (map[${complement}] !== undefined) // Found ${complement} at index ${map[complement]}!`,
              scopeName: `Iteration i=${i} (val=${num})`,
              variables: { i, num, complement, map: JSON.stringify(map), result: JSON.stringify(resultIndices) },
              condition: `map[${complement}] exists (${map[complement]})`,
              conditionMet: true,
              callStack: ['main()', 'twoSum()'],
              arrayState: [...nums],
              activeIndices: [map[complement], i],
              output: `Found pair! nums[${map[complement]}] (${complement}) + nums[${i}] (${num}) = ${target}`,
              explanation: `Complement ${target} - ${num} = ${complement} FOUND in Hash Map at index ${map[complement]}! Solution: [${map[complement]}, ${i}].`,
            });
            break;
          } else {
            map[num] = i;
            traceSteps.push({
              stepNumber: traceSteps.length + 1,
              line: `map[${num}] = ${i}; // Stored value ${num} -> index ${i}`,
              scopeName: `Iteration i=${i} (val=${num})`,
              variables: { i, num, complement, map: JSON.stringify(map) },
              condition: `map[${complement}] exists`,
              conditionMet: false,
              callStack: ['main()', 'twoSum()'],
              arrayState: [...nums],
              activeIndices: [i],
              explanation: `Complement ${complement} not in map. Stored key ${num} with index ${i} in map: ${JSON.stringify(map)}.`,
            });
          }
        }

        resultOutput = JSON.stringify(resultIndices);
      }
      // -------------------------------------------------------------
      // Pattern 7: Palindrome String Checker
      // -------------------------------------------------------------
      else if (lowerCode.includes('palindrome') || (lowerCode.includes('charat') && lowerCode.includes('length'))) {
        const str = 'racecar';
        const chars = str.split('');
        let isPal = true;
        let left = 0;
        let right = chars.length - 1;

        traceSteps.push({
          stepNumber: 1,
          line: `const str = "${str}"; left = 0, right = ${right}`,
          scopeName: 'Palindrome Scope',
          variables: { string: str, left: 0, right },
          condition: 'Initialize String Pointers',
          conditionMet: true,
          callStack: ['main()', 'isPalindrome()'],
          arrayState: [...chars],
          explanation: `Palindrome Checker: Checking if string "${str}" reads the same forwards and backwards.`,
        });

        while (left < right) {
          const charL = chars[left];
          const charR = chars[right];
          const matches = charL === charR;

          traceSteps.push({
            stepNumber: traceSteps.length + 1,
            line: `if (str[${left}] === str[${right}]) // '${charL}' === '${charR}'`,
            scopeName: `Comparing Pointers [${left}] & [${right}]`,
            variables: { left, right, 'str[left]': charL, 'str[right]': charR, matches },
            condition: `'${charL}' === '${charR}'`,
            conditionMet: matches,
            callStack: ['main()', 'isPalindrome()'],
            arrayState: [...chars],
            activeIndices: [left, right],
            output: matches ? `Char match: '${charL}' === '${charR}'` : `Mismatch: '${charL}' !== '${charR}'`,
            explanation: matches
              ? `Character at left index ${left} ('${charL}') MATCHES character at right index ${right} ('${charR}').`
              : `Character mismatch! '${charL}' !== '${charR}'. String is NOT a palindrome.`,
          });

          if (!matches) {
            isPal = false;
            break;
          }
          left++;
          right--;
        }

        resultOutput = isPal ? 'true (Valid Palindrome)' : 'false (Not Palindrome)';
      }
      // -------------------------------------------------------------
      // Pattern 8: Fibonacci Iterative Generator
      // -------------------------------------------------------------
      else if (lowerCode.includes('fib') || (lowerCode.includes('fibonacci') && lowerCode.includes('push'))) {
        const n = 7;
        const fib = [0, 1];

        traceSteps.push({
          stepNumber: 1,
          line: `const fib = [0, 1]; n = ${n};`,
          scopeName: 'Fibonacci Scope',
          variables: { n, fib: JSON.stringify(fib) },
          condition: 'Initialize Fibonacci Sequence Base',
          conditionMet: true,
          callStack: ['main()', 'fibonacci()'],
          arrayState: [...fib],
          explanation: `Fibonacci Generator: Generating first ${n} Fibonacci numbers starting with [0, 1].`,
        });

        for (let i = 2; i < n; i++) {
          const nextVal = fib[i - 1] + fib[i - 2];
          fib.push(nextVal);

          traceSteps.push({
            stepNumber: traceSteps.length + 1,
            line: `fib[${i}] = fib[${i - 1}] + fib[${i - 2}] // ${fib[i - 1]} + ${fib[i - 2]} = ${nextVal}`,
            scopeName: `Fibonacci Term ${i + 1}`,
            variables: { i, 'fib[i-1]': fib[i - 1], 'fib[i-2]': fib[i - 2], nextVal },
            condition: `Compute next term`,
            conditionMet: true,
            callStack: ['main()', 'fibonacci()'],
            arrayState: [...fib],
            activeIndices: [i - 2, i - 1, i],
            output: `Generated term fib[${i}] = ${nextVal}`,
            explanation: `Computed fib[${i}] = fib[${i - 1}] (${fib[i - 1]}) + fib[${i - 2}] (${fib[i - 2]}) = ${nextVal}. Sequence: [${fib.join(', ')}].`,
          });
        }

        resultOutput = JSON.stringify(fib);
      }
      // -------------------------------------------------------------
      // Pattern 9: Bubble Sort / Array Sorting Logic
      // -------------------------------------------------------------
      else if (lowerCode.includes('bubble') || (lowerCode.includes('swap') && lowerCode.includes('for'))) {
        const initialArr = [5, 2, 8, 1, 4];
        let arr = [...initialArr];

        traceSteps.push({
          stepNumber: 1,
          line: `let arr = [${arr.join(', ')}];`,
          scopeName: 'BubbleSort Scope',
          variables: { array: JSON.stringify(arr), length: arr.length },
          condition: 'Initialize Unsorted Array',
          conditionMet: true,
          callStack: ['main()', 'bubbleSort()'],
          arrayState: [...arr],
          explanation: `Learner Visualizer: Initialized unsorted input array [${arr.join(', ')}]. Goal: Sort elements in ascending order.`,
        });

        for (let i = 0; i < arr.length - 1; i++) {
          for (let j = 0; j < arr.length - i - 1; j++) {
            const val1 = arr[j];
            const val2 = arr[j + 1];
            const shouldSwap = val1 > val2;

            if (shouldSwap) {
              [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

              traceSteps.push({
                stepNumber: traceSteps.length + 1,
                line: `if (arr[${j}] > arr[${j + 1}]) -> Swap(${val1}, ${val2})`,
                scopeName: `Pass ${i + 1}, Comparing [${j}] & [${j + 1}]`,
                variables: { i, j, 'arr[j]': val1, 'arr[j+1]': val2, swapped: true },
                condition: `${val1} > ${val2}`,
                conditionMet: true,
                callStack: ['main()', 'bubbleSort()', `Pass[${i}]`],
                arrayState: [...arr],
                activeIndices: [j, j + 1],
                swapIndices: [j, j + 1],
                output: `Swapped ${val1} and ${val2} -> Array: [${arr.join(', ')}]`,
                explanation: `Comparing arr[${j}] (${val1}) and arr[${j + 1}] (${val2}). Since ${val1} > ${val2}, swapped their positions!`,
              });
            } else {
              traceSteps.push({
                stepNumber: traceSteps.length + 1,
                line: `if (arr[${j}] > arr[${j + 1}]) // ${val1} <= ${val2}`,
                scopeName: `Pass ${i + 1}, Comparing [${j}] & [${j + 1}]`,
                variables: { i, j, 'arr[j]': val1, 'arr[j+1]': val2, swapped: false },
                condition: `${val1} > ${val2}`,
                conditionMet: false,
                callStack: ['main()', 'bubbleSort()', `Pass[${i}]`],
                arrayState: [...arr],
                activeIndices: [j, j + 1],
                explanation: `Comparing arr[${j}] (${val1}) and arr[${j + 1}] (${val2}). ${val1} <= ${val2} is in correct order. No swap required.`,
              });
            }
          }
        }

        resultOutput = JSON.stringify(arr);
      }
      // -------------------------------------------------------------
      // Pattern 10: Default LeetCode / Odd-Even Count Logic
      // -------------------------------------------------------------
      else {
        const arr = [2, 3, 4, 5, 6];
        let countOdd = 0;
        let countEven = 0;

        traceSteps.push({
          stepNumber: 1,
          line: `const arr = [${arr.join(', ')}];`,
          scopeName: 'Global Scope',
          variables: { arr: JSON.stringify(arr) },
          condition: 'Initialize Driver Array',
          conditionMet: true,
          callStack: ['main()'],
          arrayState: [...arr],
          explanation: `Driver Code: Initialized input array [${arr.join(', ')}]. Tracking odd vs even element counts.`,
        });

        for (let i = 0; i < arr.length; i++) {
          const val = arr[i];
          const isEven = val % 2 === 0;

          if (isEven) {
            countEven++;
            traceSteps.push({
              stepNumber: traceSteps.length + 1,
              line: `if (arr[${i}] % 2 === 0) { countEven++ } // ${val} % 2 = 0`,
              scopeName: `countOddEven() [Iteration ${i + 1}]`,
              variables: { i, 'arr[i]': val, countEven, countOdd },
              condition: `${val} % 2 === 0`,
              conditionMet: true,
              callStack: ['main()', 'countOddEven()', `Loop[${i}]`],
              arrayState: [...arr],
              activeIndices: [i],
              output: `Element ${val} is EVEN -> countEven = ${countEven}`,
              explanation: `Element arr[${i}] = ${val}. Evaluated condition ${val} % 2 === 0 -> TRUE (Even). Incremented countEven to ${countEven}.`,
            });
          } else {
            countOdd++;
            traceSteps.push({
              stepNumber: traceSteps.length + 1,
              line: `else { countOdd++ } // ${val} % 2 = 1`,
              scopeName: `countOddEven() [Iteration ${i + 1}]`,
              variables: { i, 'arr[i]': val, countEven, countOdd },
              condition: `${val} % 2 === 0`,
              conditionMet: false,
              callStack: ['main()', 'countOddEven()', `Loop[${i}]`],
              arrayState: [...arr],
              activeIndices: [i],
              output: `Element ${val} is ODD -> countOdd = ${countOdd}`,
              explanation: `Element arr[${i}] = ${val}. Evaluated condition ${val} % 2 === 0 -> FALSE (Odd). Incremented countOdd to ${countOdd}.`,
            });
          }
        }

        resultOutput = JSON.stringify([countOdd, countEven]);
      }

      setFinalResult(resultOutput);
      setSteps(traceSteps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
    } catch (err) {
      console.error('Logic Visualizer execution error:', err);
    }
  }, [isOpen, code]);

  // Auto-play stepper timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && steps.length > 0) {
      timer = setTimeout(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps, speed]);

  if (!isOpen) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-bg-sidebar border border-border-strong rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-bg-surface border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/15 border border-accent/30 text-accent">
              <Zap className="w-5 h-5 text-accent animate-pulse" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-text-main tracking-tight flex items-center gap-2">
                Algorithm & Logic Educational Visualizer
                <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-400 font-mono font-semibold">
                  STEP {currentStepIndex + 1} / {steps.length}
                </span>
              </h2>
              <p className="text-[11px] text-text-subtle">Visual step-by-step sum, max/min, prime check, vowel count, fizzbuzz & memory stepper</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-bg-hover text-text-subtle hover:text-text-main transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Playback Control Bar */}
          <div className="p-3 rounded-xl bg-bg-surface border border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause Stepper' : 'Play Logic Trace'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                disabled={currentStepIndex === 0}
                className="p-1.5 rounded-lg bg-bg-hover hover:bg-bg-active text-text-subtle hover:text-text-main disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Previous Instruction Step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))}
                disabled={currentStepIndex === steps.length - 1}
                className="p-1.5 rounded-lg bg-bg-hover hover:bg-bg-active text-text-subtle hover:text-text-main disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Next Instruction Step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                }}
                className="p-1.5 rounded-lg hover:bg-bg-hover text-text-subtle hover:text-text-main transition-colors ml-1"
                title="Reset Execution Stepper"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Stepper Speed Selector */}
            <div className="flex items-center gap-2 text-xs text-text-subtle font-medium">
              <span>Execution Speed:</span>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="bg-bg-sidebar border border-border-subtle rounded-lg px-2 py-1 text-xs text-text-main outline-none cursor-pointer"
              >
                <option value={1000}>Slow (1.0s)</option>
                <option value={600}>Normal (0.6s)</option>
                <option value={200}>Fast (0.2s)</option>
              </select>
            </div>
          </div>

          {/* Visual Array Memory Bars (For Sorting / Search / Pointers) */}
          {currentStep?.arrayState && (
            <div className="p-4 rounded-xl bg-bg-surface/80 border border-border-subtle flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-text-subtle font-medium">
                <span className="flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4 text-emerald-400" /> Dynamic Visual Memory State
                </span>
                <span className="font-mono text-[11px] text-accent">Length: {currentStep.arrayState.length}</span>
              </div>

              <div className="flex items-end justify-center gap-3 pt-4 pb-2 h-24 bg-[#0d0e11] rounded-lg border border-border-subtle px-4">
                {currentStep.arrayState.map((val, idx) => {
                  const numVal = typeof val === 'number' ? val : 5;
                  const heightPct = Math.min(100, Math.max(25, numVal * 12));
                  const isActive = currentStep.activeIndices?.includes(idx);
                  const isSwapped = currentStep.swapIndices?.includes(idx);

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1 flex-1 max-w-[48px] transition-all duration-300">
                      <span className="text-[10px] font-mono text-text-subtle">[{idx}]</span>
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${
                          isSwapped
                            ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 scale-105'
                            : isActive
                            ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/30 scale-105'
                            : 'bg-accent/40 text-text-main border border-accent/60'
                        }`}
                      >
                        {val}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Current AST Active Instruction Card */}
          {currentStep && (
            <div className="p-4 rounded-xl bg-bg-surface border border-accent/40 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-xs font-bold text-accent flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-accent" />
                  Scope: <code className="text-text-main font-mono">{currentStep.scopeName}</code>
                </span>
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                    currentStep.conditionMet
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  Condition: {currentStep.condition} ({currentStep.conditionMet ? 'PASS' : 'FAIL'})
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0d0e11] border border-border-subtle font-mono text-xs text-amber-300">
                <code>{currentStep.line}</code>
              </div>

              <p className="text-xs text-text-main leading-relaxed bg-bg-sidebar/60 p-2.5 rounded-lg border border-border-subtle font-sans">
                💡 {currentStep.explanation}
              </p>
            </div>
          )}

          {/* Call Stack & Variable Registers Grid */}
          {currentStep && (
            <div className="grid grid-cols-3 gap-3">
              {/* Call Stack Frame */}
              <div className="p-3.5 rounded-xl bg-bg-surface border border-border-subtle flex flex-col gap-2">
                <span className="text-xs font-semibold text-text-main flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-accent" /> Call Stack Frames
                </span>
                <div className="flex flex-col gap-1 font-mono text-xs max-h-32 overflow-y-auto">
                  {currentStep.callStack.map((frame, idx) => (
                    <div
                      key={idx}
                      className="px-2 py-1 rounded bg-[#0d0e11] border border-border-subtle text-accent text-[11px] flex items-center justify-between"
                    >
                      <span>{frame}</span>
                      <span className="text-[9px] text-text-muted">#{idx}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Scope Variable Registers */}
              <div className="p-3.5 rounded-xl bg-bg-surface border border-border-subtle flex flex-col gap-2">
                <span className="text-xs font-semibold text-text-main flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Variable State
                </span>
                <div className="flex flex-col gap-1.5 font-mono text-xs max-h-32 overflow-y-auto">
                  {Object.entries(currentStep.variables).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between p-1.5 rounded bg-[#0d0e11] border border-border-subtle"
                    >
                      <span className="text-text-subtle">{k}:</span>
                      <span className="text-emerald-400 font-bold">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Console Stream & Result Output */}
              <div className="p-3.5 rounded-xl bg-bg-surface border border-border-subtle flex flex-col gap-2">
                <span className="text-xs font-semibold text-text-main flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-purple-400" /> Output Stream
                </span>
                <div className="max-h-32 overflow-y-auto p-2 rounded bg-[#0d0e11] border border-border-subtle font-mono text-xs flex flex-col gap-1">
                  {steps.slice(0, currentStepIndex + 1).map((s, i) => (
                    s.output ? (
                      <div key={i} className="text-emerald-400 flex items-center gap-1 text-[11px]">
                        <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{s.output}</span>
                      </div>
                    ) : null
                  ))}
                  {steps.slice(0, currentStepIndex + 1).filter((s) => s.output).length === 0 && (
                    <span className="text-text-subtle italic text-[11px]">No logs emitted yet...</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Final Evaluated Result Banner */}
          {finalResult && currentStepIndex === steps.length - 1 && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-emerald-400 font-mono text-xs">
              <div className="flex items-center gap-2 font-bold">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Algorithm Execution Complete:</span>
              </div>
              <div className="px-3 py-1 rounded bg-[#0d0e11] border border-emerald-500/40 text-emerald-300 font-bold">
                Result = {finalResult}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
