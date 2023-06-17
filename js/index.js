let tipMultiplier = 0;
let subtotal = 0;
let tipTotal = 0;

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
  //TODO
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

  tipMultiplier = calculatePercentageMultiplier(newTipPercentage);
  console.log({ tipMultiplier });
  updateTipTotal();
}

function calculateTipTotal() {
  return subtotal * tipMultiplier;
}

function updateTipTotal() {
  tipTotal = calculateTipTotal();
  console.log({ tipTotal }, typeof tipTotal);
  updateTipInput();
  updateTotalInput();
}

function updateSubtotal() {
  subtotal = parseInt(subtotalSelect.value);
  console.log({ subtotal }, typeof subtotal);
  updateTipInput();
  updateTotalInput();
}

function updateTipInput() {
  tipInput.value = tipTotal.toFixed(2);
}

function updateTotalInput() {
  console.log({ subtotal, tipTotal }, subtotal + tipTotal);
  calculateRoundedOffset();
  totalInput.value = Number(subtotal + tipTotal).toFixed(2);
}
