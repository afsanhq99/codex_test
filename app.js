const API_KEY = "AIzaSyCsPNretm1QSyaZF88F-7lfPtNaubraOfo";
const MODEL = "gemini-2.5-flash";
const STORAGE_KEY = "gemini-chat-history";
const THEME_KEY = "gemini-chat-theme";

const chatEl = document.getElementById("chat");
const inputEl = document.getElementById("user-input");
const systemPromptEl = document.getElementById("system-prompt");
const sendButton = document.getElementById("send");
const statusEl = document.getElementById("status");
const clearButton = document.getElementById("clear-chat");
const themeButton = document.getElementById("toggle-theme");
const messageTemplate = document.getElementById("message-template");

const state = {
  messages: [],
  isSending: false,
};

const setStatus = (text) => {
  statusEl.textContent = text;
};

const persist = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.messages));
};

const loadHistory = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return;
  }

  try {
    state.messages = JSON.parse(stored);
  } catch (error) {
    console.warn("Unable to parse chat history", error);
  }
};

const renderMessage = (message) => {
  const node = messageTemplate.content.cloneNode(true);
  const article = node.querySelector(".message");
  const meta = node.querySelector(".message__meta");
  const content = node.querySelector(".message__content");
  const copyButton = node.querySelector(".copy");

  article.classList.toggle("user", message.role === "user");
  meta.textContent = message.role === "user" ? "You" : "Assistant";
  content.textContent = message.text;

  copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(message.text).then(() => {
      copyButton.textContent = "Copied";
      setTimeout(() => {
        copyButton.textContent = "Copy";
      }, 1500);
    });
  });

  chatEl.appendChild(node);
  chatEl.scrollTop = chatEl.scrollHeight;
};

const renderAll = () => {
  chatEl.innerHTML = "";
  state.messages.forEach(renderMessage);
};

const addMessage = (role, text) => {
  const message = { role, text, createdAt: new Date().toISOString() };
  state.messages.push(message);
  persist();
  renderMessage(message);
};

const buildPayload = () => {
  const systemPrompt = systemPromptEl.value.trim();
  const contents = state.messages.map((message) => ({
    role: message.role === "user" ? "user" : "model",
    parts: [{ text: message.text }],
  }));

  const payload = { contents };

  if (systemPrompt) {
    payload.systemInstruction = {
      role: "system",
      parts: [{ text: systemPrompt }],
    };
  }

  return payload;
};

const sendMessage = async () => {
  const text = inputEl.value.trim();
  if (!text || state.isSending) {
    return;
  }

  addMessage("user", text);
  inputEl.value = "";
  resizeTextarea();

  state.isSending = true;
  sendButton.disabled = true;
  setStatus("Thinking...");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildPayload()),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Request failed");
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.map((part) => part.text).join("") ||
      "No response.";

    addMessage("assistant", reply);
  } catch (error) {
    addMessage("assistant", `Error: ${error.message}`);
  } finally {
    state.isSending = false;
    sendButton.disabled = false;
    setStatus("Idle");
  }
};

const resizeTextarea = () => {
  inputEl.style.height = "auto";
  inputEl.style.height = `${inputEl.scrollHeight}px`;
};

inputEl.addEventListener("input", resizeTextarea);
inputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

sendButton.addEventListener("click", sendMessage);

clearButton.addEventListener("click", () => {
  state.messages = [];
  persist();
  renderAll();
});

themeButton.addEventListener("click", () => {
  const root = document.documentElement;
  root.classList.toggle("dark");
  localStorage.setItem(THEME_KEY, root.classList.contains("dark") ? "dark" : "light");
});

const applyTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark") {
    document.documentElement.classList.add("dark");
  }
};

applyTheme();
loadHistory();
renderAll();
resizeTextarea();
