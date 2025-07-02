const toggleIcon = document.getElementById("toggleIcon");

toggleIcon.addEventListener("click", () => {
  // Check if the icon currently has the 'fa-moon' class
  if (toggleIcon.classList.contains("fa-moon")) {
    // If it's a moon, change to sun and activate bright mode
    toggleIcon.classList.remove("fa-moon");
    toggleIcon.classList.add("fa-sun");
    toggleIcon.style.color = "#facc15"; // Yellow for sun
    brightMode(); // Call the bright mode function
  } else {
    // If it's a sun, change to moon and activate dark mode
    toggleIcon.classList.remove("fa-sun");
    toggleIcon.classList.add("fa-moon");
    toggleIcon.style.color = "aliceblue"; // Slate for moon
    darkMode(); // Call the dark mode function
  }
});

//leftDiv
const canvas = document.getElementById("sortCanvas");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const messageBox = document.getElementById("messageBox");

//rightDiv
const sortSelector = document.getElementById("sortName");
const algoPreview = document.getElementById("algoPreview");
const numElements = document.getElementById("numElements");
const animationSpeedSelector = document.getElementById("speed");

//main logic
let array = [];
let numElementsInput = parseInt(numElements.value);
const maxValue = 100;
let barWidth;

const speedMap = {
  'Fast': 100,
  'Medium': 500,
  'Slow': 1000,
};

let animationDelayMs = 500;

let isSorting = false;

function generateRandomArray() {
  numElementsInput = parseInt(numElements.value);

  if (numElementsInput < parseInt(numElements.min)) {
    numElementsInput = parseInt(numElements.min);
    numElements.value = numElementsInput;
  } else if (numElementsInput > parseInt(numElements.max)) {
    numElementsInput = parseInt(numElements.max);
    numElements.value = numElementsInput;
  }

  barWidth = canvas.width / numElementsInput; // Recalculate barWidth

  array = [];
  for (let i = 0; i < numElementsInput; i++) {
    array.push(Math.floor(Math.random() * maxValue) + 1); // Values from 1 to maxValue
  }
}

//canvas logic

function drawArray(
  highlightIndex1 = -1,
  highlightIndex2 = -1,
  color1 = "#ef4444",
  color2 = "#3b82f6"
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  for (let i = 0; i < numElementsInput; i++) {
    const barHeight = (array[i] / maxValue) * canvas.height; // Scale height to canvas height
    const x = i * barWidth;
    const y = canvas.height - barHeight; // Draw from bottom up

    // Set bar color
    if (i === highlightIndex1) {
      ctx.fillStyle = color1; // Highlight color 1
    } else if (i === highlightIndex2) {
      ctx.fillStyle = color2; // Highlight color 2
    } else {
      ctx.fillStyle = "#6366f1"; // Default bar color (Indigo 500)
    }

    // Draw the bar
    ctx.fillRect(x, y, barWidth - 2, barHeight); // -2 for a small gap between bars

    // Draw the number on top of the bar, adjust font size for more elements
    ctx.fillStyle = "#1e293b"; // Text color (Slate 800)
    ctx.font = `${Math.max(8, 16 - numElementsInput * 0.2)}px Inter`; // Dynamic font size
    ctx.textAlign = "center";
    ctx.fillText(array[i], x + barWidth / 2, y - 5); // Position text slightly above bar
  }
}


//delay
function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

//Sortings

async function insertionSort() {
            isSorting = true;
            startButton.disabled = true; // Disable start button during sort
            resetButton.disabled = true; // Disable reset button during sort
            sortSelector.disabled = true; // Disable selector during sort
            numElementsInput.disabled = true; // Disable number input during sort
            animationSpeedSelector.disabled = true; // Disable speed selector during sort
            messageBox.textContent = "Sorting in progress...";

            const n = array.length;
            for (let i = 1; i < n; i++) {
                let current = array[i]; // Element to be inserted
                let j = i - 1; // Last element of the sorted subarray

                // Highlight the element being picked for insertion
                messageBox.textContent = `Picking element ${current} at index ${i}.`;
                drawArray(i, -1, '#facc15'); // Yellow 500 for current element
                await delay(animationDelayMs * 2); // Longer delay for picking

                // Move elements of array[0..i-1], that are greater than current,
                // to one position ahead of their current position
                while (j >= 0 && array[j] > current) {
                    messageBox.textContent = `Comparing ${array[j]} (index ${j}) with ${current} (being inserted).`;
                    drawArray(j, i, '#ef4444', '#facc15'); // Red for compared, Yellow for current
                    await delay(animationDelayMs);

                    array[j + 1] = array[j]; // Shift element to the right
                    j--;

                    messageBox.textContent = `Shifting ${array[j+2]} to index ${j+2}.`; // Corrected index for message
                    drawArray(j + 1, i, '#60a5fa', '#facc15'); // Blue for shifted, Yellow for current
                    await delay(animationDelayMs);
                }
                array[j + 1] = current; // Place current element in its correct position

                messageBox.textContent = `Inserting ${current} at index ${j + 1}.`;
                drawArray(j + 1, -1, '#22c55e'); // Green 500 for inserted element
                await delay(animationDelayMs * 2); // Longer delay for insertion
            }

            messageBox.textContent = "Sorting complete! Array is sorted.";
            drawArray(); // Draw final sorted array without highlights
            isSorting = false;
            startButton.disabled = false; // Re-enable buttons
            resetButton.disabled = false;
            sortSelector.disabled = false; // Re-enable selector
            numElementsInput.disabled = false; // Re-enable number input
            animationSpeedSelector.disabled = false; // Re-enable speed selector
        }


function resetVisualization() {
            if (isSorting) {
                messageBox.textContent = "Cannot reset while sorting is in progress.";
                return;
            }
            generateRandomArray(); // Generates array using current numElementsInput value
            drawArray();
            messageBox.textContent = "Array reset. Click 'Start Sort' to visualize again.";
        }

function updateAnimationSpeed() {
            const selectedSpeed = animationSpeedSelector.value;
            animationDelayMs = speedMap[selectedSpeed];
        }


startButton.addEventListener('click', () => {
            if (!isSorting) {
                // In a full implementation, you'd call the appropriate sort function here
                // based on sortSelector.value (e.g., if (sortSelector.value === 'Insertion Sort') insertionSort();)
                insertionSort(); // Currently only Insertion Sort is implemented
            } else {
                messageBox.textContent = "Sorting is already in progress!";
            }
        });

        resetButton.addEventListener('click', resetVisualization);

        animationSpeedSelector.addEventListener('change', updateAnimationSpeed);

//algoPreview
const pseudocodes = {
  "Insertion Sort": `
FUNCTION InsertionSort(array)
  FOR i FROM 1 TO length(array) - 1
    key = array[i]
    j = i - 1
    WHILE j >= 0 AND array[j] > key
      array[j + 1] = array[j]
      j = j - 1
    array[j + 1] = key
  END FOR
END FUNCTION
            `,
  "Selection Sort": `
FUNCTION SelectionSort(array)
  n = length(array)
  FOR i FROM 0 TO n - 2
    min_idx = i
    FOR j FROM i + 1 TO n - 1
      IF array[j] < array[min_idx]
        min_idx = j
      END IF
    END FOR
    SWAP array[min_idx] AND array[i]
  END FOR
END FUNCTION
            `,
  "Bubble Sort": `
FUNCTION BubbleSort(array)
  n = length(array)
  FOR i FROM 0 TO n - 2
    FOR j FROM 0 TO n - i - 2
      IF array[j] > array[j + 1]
        SWAP array[j] AND array[j + 1]
      END IF
    END FOR
  END FOR
END FUNCTION
            `,
  "Quick Sort": `
FUNCTION QuickSort(array, low, high)
  IF low < high
    pivot_index = Partition(array, low, high)
    QuickSort(array, low, pivot_index - 1)
    QuickSort(array, pivot_index + 1, high)
  END IF
END FUNCTION

FUNCTION Partition(array, low, high)
  pivot = array[high]
  i = low - 1
  FOR j FROM low TO high - 1
    IF array[j] <= pivot
      i = i + 1
      SWAP array[i] AND array[j]
    END IF
  END FOR
  SWAP array[i + 1] AND array[high]
  RETURN i + 1
END FUNCTION
            `,
  "Merge Sort": `
FUNCTION MergeSort(array)
  n = length(array)
  IF n <= 1
    RETURN array
  END IF

  mid = floor(n / 2)
  left_half = array[0 TO mid - 1]
  right_half = array[mid TO n - 1]

  left_sorted = MergeSort(left_half)
  right_sorted = MergeSort(right_half)

  RETURN Merge(left_sorted, right_sorted)
END FUNCTION

FUNCTION Merge(left, right)
  result = empty array
  i = 0, j = 0
  WHILE i < length(left) AND j < length(right)
    IF left[i] <= right[j]
      ADD left[i] TO result
      i = i + 1
    ELSE
      ADD right[j] TO result
      j = j + 1
    END IF
  END WHILE
  WHILE i < length(left)
    ADD left[i] TO result
    i = i + 1
  END WHILE
  WHILE j < length(right)
    ADD right[j] TO result
    j = j + 1
  END WHILE
  RETURN result
END FUNCTION
            `,
};

sortSelector.addEventListener("change", updatePseudocode);

function updatePseudocode() {
  const selectedSort = sortSelector.value;
  algoPreview.textContent =
    pseudocodes[selectedSort] || "Pseudocode not available for this sort.";
  console.log(sortSelector.value);
}

window.onload = function () {
  resetVisualization(); // Generate and draw initial array
            updatePseudocode(); // Display pseudocode for the default selected sort
            updateAnimationSpeed(); // Set initial animation speed
};
