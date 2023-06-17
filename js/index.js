// Shows/hides quality of service / percentage groups depending on selection
const calculateBySelect = document.getElementById("calculateBy");

calculateBySelect.addEventListener("input", ({ target: { value } }) => {
  const qualityOfServiceElements =
    document.getElementsByClassName("quality-of-service");
  for (const element of qualityOfServiceElements) {
    value === "service-quality"
      ? element.removeAttribute("hidden")
      : element.setAttribute("hidden", "");
  }

  const percentageGroupElements =
    document.getElementsByClassName("percentage-group");
  for (const element of percentageGroupElements) {
    value === "percentage"
      ? element.removeAttribute("hidden")
      : element.setAttribute("hidden", "");
  }
});

// Creates a list of values for qualityOfService that correspond to predefined tip percentage recommendations
const qualityOfServiceSelect = document.getElementById("qualityOfService");

const qualityOfServiceValues = {
  incredible: 25,
  good: 20,
  decent: 18,
  poor: 12,
};

for (const qualityOfServiceOption in qualityOfServiceValues) {
  const option = document.createElement("option");
  option.value = qualityOfServiceOption;
  option.textContent = qualityOfServiceOption;
  option.classList.add("capitalized");
  qualityOfServiceSelect.appendChild(option);
}

// Sets percentageDisplayed to match percentageSelect value
const percentageSelect = document.querySelector("#percentage");
const percentageDisplayed = document.querySelector("#percentage-displayed");

percentageDisplayed.value = percentageSelect.value;

percentageSelect.addEventListener("change", ({ target: { value } }) => {
  percentageDisplayed.value = value;
});
