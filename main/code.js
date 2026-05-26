(function () {
  const app = document.querySelector(".app");
  const socket = io();
  let uname;

  // Join
  app.querySelector(".join-screen #join-user").addEventListener("click", function () {
    let username = app.querySelector(".join-screen #username").value.trim();
    if (username.length === 0) return;

    socket.emit("newuser", username);
    uname = username;
    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
  });

  // Send message
  app.querySelector(".chat-screen #send-message").addEventListener("click", function () {
    let message = app.querySelector(".chat-screen #message-input").value.trim();
    if (message.length === 0) return;

    renderMessage("my", { username: uname, text: message });
    socket.emit("chat", { username: uname, text: message });
    app.querySelector(".chat-screen #message-input").value = "";
  });

  // Send on Enter key
  app.querySelector(".chat-screen #message-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      app.querySelector(".chat-screen #send-message").click();
    }
  });

  // Exit
  app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
    socket.emit("exituser", uname);
    window.location.href = window.location.href;
  });

  // Receive system update
  // ✅ FIX: was "Update" (capital U), must be "update" to match renderMessage check
  socket.on("update", function (update) {
    renderMessage("update", update);
  });

  // Receive chat from others
  socket.on("chat", function (message) {
    renderMessage("other", message);
  });

  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");

    if (type === "my") {
      let el = document.createElement("div");
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
        <div>
          <div class="name">You</div>
          <div class="text">${message.text}</div>
        </div>`;
      messageContainer.appendChild(el);

    } else if (type === "other") {
      let el = document.createElement("div");
      el.setAttribute("class", "message other-message");
      el.innerHTML = `
        <div>
          <div class="name">${message.username}</div>
          <div class="text">${message.text}</div>
        </div>`;
      messageContainer.appendChild(el);

    } else if (type === "update") {
      let el = document.createElement("div");
      el.setAttribute("class", "update");
      el.innerHTML = message;
      messageContainer.appendChild(el);
    }

    // Scroll to bottom
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
  }
})();