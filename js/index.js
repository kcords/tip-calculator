class TipCalculator {
  #subtotal;
  #tipMultiplier;
  #tipOffset;
  #offsetType;
  #sessionId;
  #sessionDate;
  constructor() {
    this.#subtotal = 0;
    this.#tipMultiplier = 0.2;
    this.#tipOffset = 0;
    this.#offsetType = "none";
    this.#sessionId = crypto.randomUUID();
    this.#sessionDate = new Date().toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  set subtotal(newSubtotal) {
    this.#subtotal = Number(newSubtotal || 0);
    this.tipOffset = this.#offsetType;
  }

  set tipMultiplier(newPercentage) {
    this.#tipMultiplier = Number(newPercentage || 0) * 0.01;
    this.tipOffset = this.#offsetType;
  }

  set tipOffset(roundType) {
    this.#offsetType = roundType;
    const total = +this.total.toFixed(2);
    let offsetUpdate = 0;
    let prevOffset = 0;
    let nextOffset = 0;
    switch (roundType) {
      case "dollar":
        prevOffset = +(total - Math.floor(total)).toFixed(2);
        nextOffset = +(Math.ceil(total) - total).toFixed(2);
        offsetUpdate =
          prevOffset < nextOffset && prevOffset <= 0.2
            ? -prevOffset
            : nextOffset;
        break;
      case "quarter":
        prevOffset = +((total % 0.25) * 100).toFixed(2);
        nextOffset = 25 - prevOffset;
        offsetUpdate =
          prevOffset < nextOffset && prevOffset < 0.15
            ? -prevOffset / 100
            : nextOffset / 100;
        break;
      default:
        break;
    }

    this.#tipOffset = +offsetUpdate.toFixed(2);
  }

  get subtotal() {
    return this.#subtotal;
  }

  get tipMultiplier() {
    return this.#tipMultiplier;
  }

  get tipOffset() {
    return this.#tipOffset;
  }

  get tipTotal() {
    const tipValue = this.subtotal * this.tipMultiplier;
    return +(tipValue + this.tipOffset).toFixed(2);
  }

  get total() {
    return +(this.subtotal + this.tipTotal).toFixed(2);
  }

  get formattedSessionData() {
    return {
      id: this.#sessionId,
      date: this.#sessionDate,
      tipAmount: this.tipTotal,
      totalAmount: this.total,
    };
  }
}

let tipCalculator = new TipCalculator();

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

subtotalSelectTimeoutId = null;
subtotalSelect.addEventListener("input", () => {
  let inputString = subtotalSelect.value
    .replaceAll(".", "")
    .replace(/^0+(?=\d{3})/, "")
    .padStart(3, 0);
  subtotalSelect.value = `${inputString.slice(0, -2)}.${inputString.slice(-2)}`;
  debounce(updateSubtotalValue, 250, subtotalSelectTimeoutId);
});

calculateBySelect.addEventListener("change", ({ target: { value } }) => {
  toggleCalculateByElementsVisibility(value);
  updateTipMultiplierValue();
});

qualityOfServiceSelect.addEventListener("change", () => {
  updateTipMultiplierValue();
});

percentageSelect.addEventListener("input", ({ target: { value } }) => {
  percentageDisplayedInput.value = value;
  updateTipMultiplierValue();
});

roundToInput.addEventListener("change", () => {
  updateOffsetValue();
});

tipCalculatorForm.addEventListener("reset", () => {
  tipCalculator = new TipCalculator();
  updateDisplayAndSave();
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

function debounce(func, delay, timeoutId) {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(func, delay);
  console.log(timeoutId);
}

function updateTipMultiplierValue() {
  const newTipPercentage =
    calculateBySelect.value === "percentage"
      ? percentageSelect.value
      : qualityOfServiceValues[qualityOfServiceSelect.value].value;

  tipCalculator.tipMultiplier = newTipPercentage;
  updateDisplayAndSave();
}

function updateOffsetValue() {
  tipCalculator.tipOffset = roundToInput.value;
  updateDisplayAndSave();
}

function updateSubtotalValue() {
  tipCalculator.subtotal = subtotalSelect.value;
  updateDisplayAndSave();
}

function updateTipInput() {
  tipInput.value = `$${tipCalculator.tipTotal.toFixed(2)}`;
}

function updateTotalInput() {
  totalInput.value = `$${tipCalculator.total.toFixed(2)}`;
}

let saveTimeoutId = null;
function updateDisplayAndSave() {
  updateTipInput();
  updateTotalInput();
  if (tipCalculator.total > 0)
    debounce(
      () => saveSessionData(tipCalculator.formattedSessionData),
      1500,
      saveTimeoutId
    );
}
