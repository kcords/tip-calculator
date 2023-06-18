const STATE = {
  tipMultiplier: 0,
  tipTotal: 0,
  subtotal: 0,
  sessionId: crypto.randomUUID(),
  sessionDate: new Date().toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  }),
};

const subtotalSelect = document.querySelector("#subtotal");
const calculateBySelect = document.querySelector("#calculateBy");
const percentageSelect = document.querySelector("#percentage");
const percentageDisplayedInput = document.querySelector(
  "#percentage-displayed"
);
const qualityOfServiceSelect = document.querySelector("#qualityOfService");
const qualityOfServiceElements = document.querySelectorAll(
  ".quality-of-service"
);
const percentageGroupElements = document.querySelectorAll(".percentage-group");
const roundToInput = document.querySelector("#roundTo");
const tipInput = document.querySelector("#tip");
const totalInput = document.querySelector("#total");
const tipCalculatorForm = document.querySelector("#tipCalculatorForm");

const qualityOfServiceValues = {
  incredible: { value: 25, emoji: "&#x1F929" },
  good: { value: 20, emoji: "&#x1F603" },
  okay: { value: 18, emoji: "&#x1F610" },
  poor: { value: 12, emoji: "&#x1F61E" },
};

percentageDisplayedInput.value = percentageSelect.value;

for (const qualityOfServiceOption in qualityOfServiceValues) {
  const option = document.createElement("option");
  option.value = qualityOfServiceOption;
  option.innerHTML = `${qualityOfServiceValues[qualityOfServiceOption].emoji} ${qualityOfServiceOption}`;
  if (qualityOfServiceOption === "good") option.setAttribute("selected", "");
  option.classList.add("capitalized");
  qualityOfServiceSelect.appendChild(option);
}

subtotalSelect.addEventListener("input", () => {
  updateSubtotal();
  updateTipMultiplier();
});

calculateBySelect.addEventListener("change", ({ target: { value } }) => {
  toggleCalculateByElementsVisibility(value);
  updateTipMultiplier();
});

qualityOfServiceSelect.addEventListener("change", () => {
  updateTipMultiplier();
});

percentageSelect.addEventListener("input", ({ target: { value } }) => {
  percentageDisplayedInput.value = value;
  updateTipMultiplier();
});

roundToInput.addEventListener("change", () => {
  formatAndSaveSessionData();
  updateTipTotal();
});

tipCalculatorForm.addEventListener("reset", () => {
  formatAndSaveSessionData();
  generateNewSessionId();
});

function toggleCalculateByElementsVisibility(value) {
  for (const element of qualityOfServiceElements) {
    value === "service-quality"
      ? element.removeAttribute("hidden")
      : element.setAttribute("hidden", "");
  }

  for (const element of percentageGroupElements) {
    value === "percentage"
      ? element.removeAttribute("hidden")
      : element.setAttribute("hidden", "");
  }
}

function calculatePercentageMultiplier(percentValue) {
  return percentValue * 0.01;
}

function updateTipMultiplier() {
  const newTipPercentage =
    calculateBySelect.value === "percentage"
      ? percentageSelect.value
      : qualityOfServiceValues[qualityOfServiceSelect.value].value;

  STATE.tipMultiplier = calculatePercentageMultiplier(newTipPercentage);
  updateTipTotal();
}

function calculateRoundedOffset() {
  const { value } = roundToInput;
  const total = calculateTotal();
  let prevOffset = 0;
  let nextOffset = 0;
  switch (value) {
    case "quarter":
      prevOffset = +((total % 0.25) * 100).toFixed(2);
      nextOffset = 25 - prevOffset;
      return prevOffset < nextOffset && prevOffset < 0.15
        ? -prevOffset / 100
        : nextOffset / 100;
    case "dollar":
      prevOffset = +(total - Math.floor(total)).toFixed(2);
      nextOffset = +(Math.ceil(total) - total).toFixed(2);
      return prevOffset < nextOffset && prevOffset <= 0.2
        ? -prevOffset
        : nextOffset;
    default:
      return 0;
  }
}

function calculateTipTotal() {
  return +(STATE.subtotal * STATE.tipMultiplier).toFixed(2);
}

function updateTipTotal() {
  STATE.tipTotal = calculateTipTotal();
  STATE.tipTotal += calculateRoundedOffset();
  updateTipInput();
  updateTotalInput();
}

function updateTipInput() {
  tipInput.value = `$${STATE.tipTotal.toFixed(2)}`;
  formatAndSaveSessionData();
}

function updateSubtotal() {
  STATE.subtotal = Number(subtotalSelect.value);
  updateTipInput();
  updateTotalInput();
}

function calculateTotal() {
  return +(STATE.subtotal + STATE.tipTotal).toFixed(2);
}

function updateTotalInput() {
  totalInput.value = `$${calculateTotal().toFixed(2)}`;
  formatAndSaveSessionData();
}

function formatAndSaveSessionData() {
  const formattedData = {
    id: STATE.sessionId,
    date: STATE.sessionDate,
    tipAmount: calculateTipTotal(),
    totalAmount: calculateTotal(),
  };
  saveSessionData(formattedData);
}

function generateNewSessionId() {
  STATE.sessionId = crypto.randomUUID();
}
