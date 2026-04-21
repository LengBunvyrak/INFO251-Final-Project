const toggleDarkMode = () => {
    const toggleBtn = document.getElementById("themeToggle");

    // Load saved theme
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateButton(savedTheme);

    // Toggle theme
    toggleBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const newTheme = current === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    updateButton(newTheme);
    });

    // Update button text/icon
    function updateButton(theme) {
    toggleBtn.textContent = theme === "dark" ? "☀️ Light" : "🌙 Dark";
    }
}

export default toggleDarkMode