// Load user data with error handling
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  try {
    // Load user profile
    const userDoc = db.collection("users").doc(user.uid);

    userDoc.onSnapshot(
      (doc) => {
        if (doc.exists) {
          const userData = doc.data();
          document.getElementById("userName").textContent = userData.name;
          document.getElementById("cylindersRemaining").textContent =
            userData.cylindersRemaining;
          document.getElementById("accountBalance").textContent = `₹${
            userData.accountBalance || 0
          }`;
        }
      },
      (error) => {
        console.error("User data error:", error);
        document.getElementById("userName").textContent =
          "Error loading profile";
      }
    );

    // Load notifications
    loadNotifications(user.uid);
  } catch (error) {
    console.error("Initialization error:", error);
  }
});

async function loadNotifications(userId) {
  try {
    const notificationsQuery = db
      .collection("notifications")
      .where("userId", "==", userId)
      .orderBy("timestamp", "desc");

    notificationsQuery.onSnapshot(
      (snapshot) => {
        const notificationsList = document.getElementById("notificationList");
        notificationsList.innerHTML = "";

        if (snapshot.empty) {
          notificationsList.innerHTML = "<li>No notifications yet</li>";
          return;
        }

        snapshot.forEach((doc) => {
          const notification = doc.data();
          const li = document.createElement("li");
          li.textContent = notification.message;

          if (notification.timestamp) {
            const date = new Date(notification.timestamp.seconds * 1000);
            li.title = date.toLocaleString();
          }

          notificationsList.appendChild(li);
        });
      },
      (error) => {
        console.error("Notifications error:", error);
        document.getElementById("notificationList").innerHTML =
          '<li class="error">Error loading notifications</li>';
      }
    );
  } catch (error) {
    console.error("Notification load error:", error);
  }
}
