function saveSessionData(sessionData) {
  const { id } = sessionData;
  const sessionDataJSON = JSON.stringify(sessionData);
  localStorage.setItem(id, sessionDataJSON);
  console.info(`Session saved successfully! ${id}`);
}

function getSavedSessionsCount() {
  return localStorage.length;
}

function getSavedSessionsData() {
  return Object.keys(localStorage).map((key) => JSON.parse(localStorage[key]));
}

function deleteSessionData(id) {
  const session = localStorage.removeItem(id);
  console.info(`Session deleted successfully! ${session}`);
}
