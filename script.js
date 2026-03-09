// script.js - Loads personal details from JSON and populates the page
fetch('personal.json')
  .then(response => response.json())
  .then(data => {
    // Set page title
    document.title = `${data.name} - Personal Website`;

    // Update name
    const nameElements = document.querySelectorAll('.personal-name');
    nameElements.forEach(el => el.textContent = data.name);

    // Update email
    const emailElements = document.querySelectorAll('.personal-email');
    emailElements.forEach(el => el.textContent = data.email);

    // Update phone
    const phoneElements = document.querySelectorAll('.personal-phone');
    phoneElements.forEach(el => el.textContent = data.phone);

    // Update LinkedIn
    const linkedinElements = document.querySelectorAll('.personal-linkedin');
    linkedinElements.forEach(el => {
      el.href = data.linkedin;
      el.textContent = data.linkedin;
    });

    // Update GitHub
    const githubElements = document.querySelectorAll('.personal-github');
    githubElements.forEach(el => {
      el.href = data.github;
      el.textContent = data.github;
    });

    // Update bio if present
    const bioElements = document.querySelectorAll('.personal-bio');
    bioElements.forEach(el => el.textContent = data.bio);
  })
  .catch(error => console.error('Error loading personal details:', error));