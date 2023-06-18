const sessionListTable = document.querySelector("#session-list-table");

generateSessionElements();

function generateSessionElements() {
  const savedSessions = getSavedSessionsData();

  for (let session of savedSessions) {
    const { id, date, tipAmount, totalAmount } = session;

    const row = sessionListTable.insertRow(-1);

    const cell1 = row.insertCell(0);
    cell1.innerText = date;

    const cell2 = row.insertCell(1);
    cell2.innerText = `$${tipAmount.toFixed(2)}`;

    const cell3 = row.insertCell(2);
    cell3.innerText = `$${totalAmount.toFixed(2)}`;

    const cell4 = row.insertCell(3);
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", () => {
      deleteBtn.setAttribute("disabled", "");
      deleteSessionData(id);
      row.remove();
    });
    cell4.appendChild(deleteBtn);
  }
}
