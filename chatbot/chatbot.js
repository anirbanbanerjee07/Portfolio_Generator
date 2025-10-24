const chatToggle = document.getElementById("chatbot-toggle");
const chatBox = document.getElementById("chatbot");
const chatBody = document.getElementById("chat-body");
const chatInput = document.getElementById("chat-input");

// Toggle chat box visibility
chatToggle.addEventListener("click", () => {
  chatBox.style.display = chatBox.style.display === "block" ? "none" : "block";
});

// Predefined responses
const responses = {
  "how to generate portfolio": "Enter your GitHub username and click 'Generate Portfolio'.",
  "how to download pdf": "After generating, click 'Download Portfolio as PDF' button.",
  "theme": "Use the top-right button to switch between light and dark mode.",
  "what is this": "This is a Professional GitHub Portfolio Generator!",
};

// Send message
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const question = chatInput.value.toLowerCase().trim();
    if (!question) return;

    const answer = responses[question] || "Sorry, I can't answer that. Try another question.";

    const userMsg = `<p><b>You:</b> ${chatInput.value}</p>`;
    const botMsg = `<p><b>Bot:</b> ${answer}</p>`;

    chatBody.innerHTML += userMsg + botMsg;
    chatBody.scrollTop = chatBody.scrollHeight;

    chatInput.value = "";
  }
});
