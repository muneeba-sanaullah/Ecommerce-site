// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Bootstrap validation
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    // Get input values
    const firstName = document.getElementById("validationCustom01").value.trim();
    const lastName = document.getElementById("validationCustom02").value.trim();
    const username = document.getElementById("validationCustomUsername").value.trim();
    const city = document.getElementById("validationCustom03").value.trim();
    const state = document.getElementById("validationCustom04").value;
    const zip = document.getElementById("validationCustom05").value.trim();
    const agreed = document.getElementById("invalidCheck").checked;

    // Create user object
    const user = {
      firstName,
      lastName,
      username,
      city,
      state,
      zip,
      agreed
    };

    // Store in localStorage (simulate account creation)
    localStorage.setItem(`user_${username}`, JSON.stringify(user));

    // Optional: Show success message
    alert("Account created successfully!");

    // Reset form
    form.reset();
    form.classList.remove("was-validated");
  });
});
