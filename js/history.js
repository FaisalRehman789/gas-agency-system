// Initialize auth state
auth.onAuthStateChanged((user) => {
  if (!user) {
    console.log("No user in history page - redirecting to login");
    window.location.href = "index.html";
    return;
  }

  // User is authenticated, load booking history
  loadBookingHistory(user.uid);
});

async function loadBookingHistory(userId) {
  try {
    const bookingsQuery = db
      .collection("bookings")
      .where("userId", "==", userId)
      .orderBy("bookingDate", "desc");

    bookingsQuery.onSnapshot(
      (snapshot) => {
        const tbody = document.querySelector("#bookingHistory tbody");
        tbody.innerHTML = "";

        if (snapshot.empty) {
          tbody.innerHTML =
            '<tr><td colspan="4">No booking history found</td></tr>';
          return;
        }

        snapshot.forEach((doc) => {
          const booking = doc.data();
          const tr = document.createElement("tr");

          // Date cell
          const dateCell = document.createElement("td");
          dateCell.textContent = booking.bookingDate.toDate().toLocaleString();

          // Status cell
          const statusCell = document.createElement("td");
          statusCell.textContent = booking.status;
          statusCell.className = `status-${booking.status}`;

          // Payment cell
          const paymentCell = document.createElement("td");
          paymentCell.textContent =
            booking.paymentMethod === "cash" ? "Cash on Delivery" : "PayTM";

          // Action cell
          const actionCell = document.createElement("td");
          if (booking.status === "pending") {
            actionCell.innerHTML = '<button class="cancel-btn">Cancel</button>';
            actionCell
              .querySelector(".cancel-btn")
              .addEventListener("click", () => {
                cancelBooking(doc.id);
              });
          }

          tr.appendChild(dateCell);
          tr.appendChild(statusCell);
          tr.appendChild(paymentCell);
          tr.appendChild(actionCell);

          tbody.appendChild(tr);
        });
      },
      (error) => {
        console.error("Booking history error:", error);
        const tbody = document.querySelector("#bookingHistory tbody");
        tbody.innerHTML =
          '<tr><td colspan="4">Error loading history. Please try again.</td></tr>';
      }
    );
  } catch (error) {
    console.error("History load error:", error);
  }
}

async function cancelBooking(bookingId) {
  if (!confirm("Are you sure you want to cancel this booking?")) return;

  try {
    await db.collection("bookings").doc(bookingId).update({
      status: "cancelled",
      cancelledDate: new Date(),
    });
    alert("Booking cancelled successfully");
  } catch (error) {
    console.error("Cancel booking error:", error);
    alert("Error cancelling booking: " + error.message);
  }
}
