
document.getElementById("contactForm").addEventListener("submit", function(e) {
e.preventDefault();

const name = document.getElementById("name").value;
const message = document.getElementById("message").value;

const emailText = `mailto:restaurant@example.com?subject=Booking/Feedback from ${name}&body=${encodeURIComponent(message)}`;

document.getElementById("emailOutput").innerHTML = `Click to send email: <a href="${emailText}">Send Email</a>`;
});
