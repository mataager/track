// Email and Password Sign-In or Sign-Up Prompt
function emailPasswordSignIn() {
  Swal.fire({
    title: "Sign in with Email & Password",
    html: `
      <input type="email" id="email" class="swal2-input" placeholder="Enter your email">
      <input type="password" id="password" class="swal2-input" placeholder="Enter your password">
      <p style="margin-top: 10px;">Don't have an account? <a href="#" id="signup-link">Sign up here</a></p>
    `,
    showCancelButton: true,
    confirmButtonText: "Sign In",
    didOpen: () => {
      document.getElementById("signup-link").addEventListener("click", () => {
        Swal.close(); // Close the sign-in prompt and open the sign-up prompt
        emailPasswordSignUp();
      });
    },
    preConfirm: () => {
      const email = Swal.getPopup().querySelector("#email").value;
      const password = Swal.getPopup().querySelector("#password").value;

      if (!email || !password) {
        Swal.showValidationMessage("Please enter both email and password");
        return false;
      }
      return { email, password };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { email, password } = result.value;
      auth
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          Swal.fire({
            icon: "success",
            title: "Signed In Successfully",
            text: `Welcome, ${userCredential.user.email}`,
          });

          // Hide the email sign-in button on success
          document.getElementById("email-signin-btn").style.display = "none";
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Sign In Failed",
            text: error.message,
          });
        });
    }
  });
}

// Sign-Up Prompt
function emailPasswordSignUp() {
  Swal.fire({
    title: "Create a New Account",
    html: `
      <input type="email" id="new-email" class="swal2-input" placeholder="Enter your email">
      <input type="password" id="new-password" class="swal2-input" placeholder="Enter your password">
      <input type="text" id="phone" class="swal2-input" placeholder="Enter your phone number (optional)">
      <input type="text" id="profile-pic" class="swal2-input" placeholder="Enter your profile picture URL (optional)">
    `,
    showCancelButton: true,
    confirmButtonText: "Sign Up",
    preConfirm: () => {
      const email = Swal.getPopup().querySelector("#new-email").value;
      const password = Swal.getPopup().querySelector("#new-password").value;
      const phone = Swal.getPopup().querySelector("#phone").value;
      const profilePic = Swal.getPopup().querySelector("#profile-pic").value;

      if (!email || !password) {
        Swal.showValidationMessage("Please enter both email and password");
        return false;
      }
      return { email, password, phone, profilePic };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { email, password, phone, profilePic } = result.value;
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Set additional user information
          return userCredential.user
            .updateProfile({
              displayName: "Customer",
              photoURL: profilePic || undefined,
            })
            .then(() => {
              // Save additional info (e.g., phone) in database if needed
              const uid = userCredential.user.uid;
              const userData = {
                email,
                displayName: "Customer",
                phone: phone || null,
                photoURL: profilePic || null,
              };
              // return firebase.database().ref(`users/${uid}`).set(userData);
            });
        })
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Account Created Successfully",
            text: "Welcome! You can now signed in",
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Sign Up Failed",
            text: error.message,
          });
        });
    }
  });
}
