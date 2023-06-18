function saveSessionData(sessionData) {
  const { id } = sessionData;
  const sessionDataJSON = JSON.stringify(sessionData);
  localStorage.setItem(id, sessionDataJSON);
}

function getSavedSessionsCount() {
  return localStorage.length;
}

function getSavedSessionsData() {
  return Object.keys(localStorage).map((key) => JSON.parse(localStorage[key]));
}

function deleteSessionData(id) {
  const session = localStorage.removeItem(id);
}
