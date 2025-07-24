// Load language file and update DOM
function loadLanguage(lang) {
  fetch(`lang/${lang}.json`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('title').textContent = data.title;
      document.getElementById('description').textContent = data.description;
      document.getElementById('login').textContent = data.login;
      document.getElementById('contact').textContent = data.contact;
    })
    .catch(error => console.error("Language file load error:", error));
}

// Handle language change
document.getElementById('language-switcher').addEventListener('change', function () {
  const selectedLang = this.value;
  localStorage.setItem('lang', selectedLang); // optional: remember user's choice
  loadLanguage(selectedLang);
});

// Initial load
const savedLang = localStorage.getItem('lang') || 'en';
document.getElementById('language-switcher').value = savedLang;
loadLanguage(savedLang);
