// DOM Elements
const pendingBookings = document.getElementById("pendingBookings");
const notificationForm = document.getElementById("notificationForm");
const notificationUser = document.getElementById("notificationUser");

// Load pending bookings
auth.onAuthStateChanged((user) => {
  if (user) {
    // Check if admin
    db.collection("admins")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          window.location.href = "user.html";
        }
      });

    // Load pending bookings
    db.collection("bookings")
      .where("status", "==", "pending")
      .onSnapshot((snapshot) => {
        pendingBookings.innerHTML = "";

        snapshot.forEach((doc) => {
          const booking = doc.data();
          const bookingDiv = document.createElement("div");
          bookingDiv.className = "booking-item";

          const bookingInfo = document.createElement("div");
          bookingInfo.innerHTML = `
            <p><strong>${booking.userName}</strong></p>
            <p>${booking.userAddress}</p>
            <p>${new Date(
              booking.bookingDate.seconds * 1000
            ).toLocaleString()}</p>
          `;

          const bookingActions = document.createElement("div");
          bookingActions.className = "booking-actions";

          const approveBtn = document.createElement("button");
          approveBtn.textContent = "Approve";
          approveBtn.onclick = () => approveBooking(doc.id, booking.userId);

          const rejectBtn = document.createElement("button");
          rejectBtn.textContent = "Reject";
          rejectBtn.onclick = () => rejectBooking(doc.id, booking.userId);

          bookingActions.appendChild(approveBtn);
          bookingActions.appendChild(rejectBtn);
          bookingDiv.appendChild(bookingInfo);
          bookingDiv.appendChild(bookingActions);
          pendingBookings.appendChild(bookingDiv);
        });
      });

    // Load users for notification dropdown
    db.collection("users")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const option = document.createElement("option");
          option.value = doc.id;
          option.textContent = doc.data().name;
          notificationUser.appendChild(option);
        });
      });
  } else {
    window.location.href = "index.html";
  }
});

// Approve booking
function approveBooking(bookingId, userId) {
  const CYLINDER_PRICE = 50; // Change this as per your pricing

  db.collection("users")
    .doc(userId)
    .get()
    .then((userDoc) => {
      if (userDoc.exists) {
        const userData = userDoc.data();
        const updatedBalance = (userData.accountBalance || 0) - CYLINDER_PRICE;

        // Only proceed if balance is enough (optional)
        if (updatedBalance < 0) {
          alert("User does not have enough balance to approve this booking.");
          return;
        }

        // Update booking status
        db.collection("bookings").doc(bookingId).update({
          status: "approved",
          approvedDate: new Date(),
        });

        // Update user's cylinder and balance
        db.collection("users")
          .doc(userId)
          .update({
            cylindersRemaining: firebase.firestore.FieldValue.increment(-1),
            accountBalance: updatedBalance,
          });

        // Send notification
        db.collection("notifications").add({
          userId: userId,
          message: "Your booking has been approved!",
          timestamp: new Date(),
        });

        alert("Booking approved successfully.");
      }
    })
    .catch((error) => {
      console.error("Error approving booking:", error);
      alert("Error: " + error.message);
    });
}

// Reject booking
function rejectBooking(bookingId, userId) {
  db.collection("bookings")
    .doc(bookingId)
    .update({
      status: "rejected",
      rejectedDate: new Date(),
    })
    .then(() => {
      db.collection("notifications").add({
        userId: userId,
        message: "Your booking was rejected. Please contact support.",
        timestamp: new Date(),
      });
      alert("Booking rejected.");
    })
    .catch((error) => {
      console.error("Error rejecting booking:", error);
      alert("Error: " + error.message);
    });
}

// Send notification
if (notificationForm) {
  notificationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = document.getElementById("notificationMessage").value;
    const userId = notificationUser.value;

    if (userId === "all") {
      // Send to all users
      db.collection("users")
        .get()
        .then((snapshot) => {
          const batch = db.batch();

          snapshot.forEach((doc) => {
            const notificationRef = db.collection("notifications").doc();
            batch.set(notificationRef, {
              userId: doc.id,
              message: message,
              timestamp: new Date(),
            });
          });

          return batch.commit();
        })
        .then(() => {
          alert("Notification sent to all users!");
          notificationForm.reset();
        });
    } else {
      // Send to specific user
      db.collection("notifications")
        .add({
          userId: userId,
          message: message,
          timestamp: new Date(),
        })
        .then(() => {
          alert("Notification sent!");
          notificationForm.reset();
        });
    }
  });
}
