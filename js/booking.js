// Initialize auth state
auth.onAuthStateChanged((user) => {
  if (!user) {
    console.log("No user in booking page - redirecting to login");
    window.location.href = "index.html";
    return;
  }

  // User is authenticated, proceed with booking page setup
  setupBookingPage(user.uid);
});

function setupBookingPage(userId) {
  // DOM Elements
  const bookingForm = document.getElementById("bookingForm");
  const paymentMethod = document.getElementById("paymentMethod");
  const paytmQR = document.getElementById("paytmQR");

  // Show PayTM QR if selected
  if (paymentMethod) {
    paymentMethod.addEventListener("change", (e) => {
      paytmQR.style.display = e.target.value === "paytm" ? "block" : "none";
    });
  }

  // Submit booking
  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        const userDoc = await db.collection("users").doc(userId).get();

        if (!userDoc.exists) {
          alert("User data not found");
          return;
        }

        const userData = userDoc.data();

        if (userData.cylindersRemaining <= 0) {
          alert("You have no cylinders remaining in your account");
          return;
        }

        // Create booking
        await db.collection("bookings").add({
          userId: userId,
          userName: userData.name,
          userAddress: userData.address,
          bookingDate: new Date(),
          status: "pending",
          paymentMethod: paymentMethod.value,
          cylindersRequested: 1,
        });

        alert("Booking request submitted successfully!");
        window.location.href = "user.html";
      } catch (error) {
        console.error("Booking error:", error);
        alert("Error submitting booking: " + error.message);
      }
    });
  }
}
