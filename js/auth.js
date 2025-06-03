const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const logoutBtn = document.getElementById("logoutBtn");

auth.onAuthStateChanged(async (user) => {
  try {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split("/").pop();
    const allowedPages = ["index.html", "booking.html", "history.html", ""];

    if (allowedPages.includes(currentPage)) return;

    if (user) {
      const adminDoc = await db.collection("admins").doc(user.uid).get();

      if (adminDoc.exists) {
        if (!currentPath.includes("admin.html")) {
          window.location.href = "admin.html";
        }
      } else {
        const userPages = ["user.html", "booking.html", "history.html"];
        if (!userPages.some((page) => currentPath.includes(page))) {
          window.location.href = "user.html";
        }
      }
    } else {
      if (!currentPath.includes("index.html")) {
        window.location.href = "index.html";
      }
    }
  } catch (error) {
    console.error("Auth state error:", error);
  }
});

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      await auth.signInWithEmailAndPassword(email, password);

      const user = auth.currentUser;
      const userDoc = await db.collection("users").doc(user.uid).get();

      if (userDoc.exists) {
        window.location.href = "user.html";
      }
    } catch (error) {
      alert(error.message);
      console.error("Login error:", error);
    }
  });
}

async function adminLogin() {
  try {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    await auth.signInWithEmailAndPassword(email, password);

    const user = auth.currentUser;
    const adminDoc = await db.collection("admins").doc(user.uid).get();

    if (adminDoc.exists) {
      window.location.href = "admin.html";
    } else {
      alert("You are not an admin.");
      await auth.signOut();
    }
  } catch (error) {
    alert(error.message);
    console.error("Admin login error:", error);
  }
}

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const name = document.getElementById("regName").value;
      const email = document.getElementById("regEmail").value;
      const password = document.getElementById("regPassword").value;
      const address = document.getElementById("regAddress").value;
      const phone = document.getElementById("regPhone").value;

      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      await db.collection("users").doc(userCredential.user.uid).set({
        name,
        email,
        address,
        phone,
        initialCylinders: 12,
        cylindersRemaining: 12,
        accountBalance: 1000,
        joinDate: new Date(),
      });

      alert("Registration successful!");
      window.location.href = "user.html";
    } catch (error) {
      alert(error.message);
      console.error("Registration error:", error);
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await auth.signOut();
      window.location.href = "index.html";
    } catch (error) {
      console.error("Logout error:", error);
    }
  });
}

function openTab(tabName, event) {
  const tabs = document.getElementsByClassName("tab-content");
  const tabBtns = document.getElementsByClassName("tab-btn");

  Array.from(tabs).forEach((tab) => tab.classList.remove("active"));
  Array.from(tabBtns).forEach((btn) => btn.classList.remove("active"));

  document.getElementById(tabName).classList.add("active");
  event.currentTarget.classList.add("active");
}
