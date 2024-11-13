

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDss53pHibCpqo87_1bhoUHkf8Idnj-Fig",
  authDomain: "matager-f1f00.firebaseapp.com",
  projectId: "matager-f1f00",
  storageBucket: "matager-f1f00.appspot.com",
  messagingSenderId: "922824110897",
  appId: "1:922824110897:web:b7978665d22e2d652e7610",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Google Provider
const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
provider.setCustomParameters({
  login_hint: "user@example.com",
});

// Sign in with Google (popup method)
document.getElementById("google-signin-btn").addEventListener("click", () => {
  auth
    .signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      console.log("User signed in:", user);
      Swal.fire("Logged in!", "You are now signed in.", "success");
      updateUI(user); // Show signout button if user is logged in
    })
    .catch((error) => {
      console.error("Error during sign-in:", error);
      Swal.fire("Error", error.message, "error");
    });
});

// Sign out
document.getElementById("signout-btn").addEventListener("click", () => {
  auth.signOut().then(() => {
    console.log("User signed out");
    Swal.fire("Logged out!", "You have been signed out.", "success");
    updateUI(null); // Hide signout button and user info
  });
});

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User is signed in:", user);
    updateUI(user); // Update UI with user data
    // Hide the "Sign in" button if user is already authenticated
    document.getElementById("google-signin-btn").style.display = "none";
    document.getElementById("email-signin-btn").style.display = "none";
    document.getElementById("signout-btn").style.display = "block";
  } else {
    console.log("No user is signed in.");
    updateUI(null); // Hide user info
    document.getElementById("google-signin-btn").style.display = "block";
    document.getElementById("email-signin-btn").style.display = "block";
    document.getElementById("signout-btn").style.display = "none";
  }
});

// Helper function to update UI based on auth state
function updateUI(user) {
  // Show the preloader initially
  document.getElementById("preloader").style.display = "flex";

  // Automatically hide the preloader after 1.5 seconds
  setTimeout(() => {
    document.getElementById("preloader").style.display = "none";
  }, 1500);

  if (user) {
    // Show user info
    document.getElementById("google-signin-btn").style.display = "none";
    document.getElementById("signout-btn").style.display = "block";

    // Update user info (name, email, photo)
    document.getElementById("user-info").style.display = "block";
    document.getElementById("user-name").innerText = `${
      user.displayName || "No Name"
    }`;
    document.getElementById("user-email").innerText = `${user.email}`;
    document.getElementById("user-photo").src =
      user.photoURL || "https://via.placeholder.com/100";
  } else {
    // Hide user info and show the sign-in button
    document.getElementById("google-signin-btn").style.display = "block";
    document.getElementById("signout-btn").style.display = "none";
    document.getElementById("user-info").style.display = "none";
  }
}
