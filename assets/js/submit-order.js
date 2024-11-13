// async function submitOrder() {
//   // Show the preloader
//   document.getElementById("preloader").classList.remove("hidden");

//   try {
//     // Check availability first
//     const isAvailable = await checkAvailability();
//     if (!isAvailable) {
//       // Hide the preloader if not available
//       document.getElementById("preloader").classList.add("hidden");
//       return;
//     }

//     // Retrieve cart data, personal info, and shipping fees from local storage
//     let cart = JSON.parse(localStorage.getItem("cart"));
//     let personal_info = JSON.parse(localStorage.getItem("personal_info"));
//     let shippingFees = document
//       .getElementById("shipping-fees-total")
//       .innerText.replace(" EGP", "");

//     // Create the order object
//     let order = {
//       cart: cart,
//       personal_info: personal_info,
//       shippingFees: parseFloat(shippingFees),
//     };

//     // Update the product quantities in Firebase
//     // Fetch product data from Firebase
//     const response = await fetch(`${url}/Stores/${uid}/Products.json`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch product data from Firebase");
//     }
//     let productsData = await response.json();

//     // Create a map to count quantities of each product
//     let productCounts = {};

//     cart.forEach((cartItem) => {
//       const key = `${cartItem.id}-${cartItem.productSize}-${cartItem.productColor}`;
//       if (!productCounts[key]) {
//         productCounts[key] = {
//           count: 0,
//           details: cartItem,
//         };
//       }
//       productCounts[key].count += 1;
//     });

//     // Create an array of promises for updating quantities
//     let updatePromises = [];

//     // Update product quantities and check if any product needs to be deleted
//     for (const key in productCounts) {
//       const { count, details } = productCounts[key];
//       const productId = details.id;

//       if (
//         productsData[productId] &&
//         productsData[productId].sizes[details.productSize] &&
//         productsData[productId].sizes[details.productSize][details.productColor]
//       ) {
//         const productInfo =
//           productsData[productId].sizes[details.productSize][
//             details.productColor
//           ];
//         const newQty = productInfo.qty - count;

//         if (newQty > 0) {
//           // Update the quantity
//           updatePromises.push(
//             fetch(
//               `${url}/Stores/${uid}/Products/${productId}/sizes/${details.productSize}/${details.productColor}.json`,
//               {
//                 method: "PATCH",
//                 headers: {
//                   "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ qty: newQty }),
//               }
//             )
//           );
//         } else {
//           // Remove the size/color node
//           updatePromises.push(
//             fetch(
//               `${url}/Stores/${uid}/Products/${productId}/sizes/${details.productSize}/${details.productColor}.json`,
//               {
//                 method: "DELETE",
//                 headers: {
//                   "Content-Type": "application/json",
//                 },
//               }
//             )
//           );
//         }
//       }
//     }

//     // Wait for all update operations to complete
//     await Promise.all(updatePromises);

//     // Fetch the updated product data to check for empty sizes nodes
//     const updatedResponse = await fetch(`${url}/Stores/${uid}/Products.json`);
//     if (!updatedResponse.ok) {
//       throw new Error("Failed to fetch updated product data from Firebase");
//     }
//     let updatedProductsData = await updatedResponse.json();

//     // Check for products with empty sizes nodes and delete them using IDs from the cart
//     let deleteProductPromises = [];
//     let processedProductIds = new Set();

//     for (const key in productCounts) {
//       const { details } = productCounts[key];
//       const productId = details.id;

//       if (
//         !processedProductIds.has(productId) &&
//         updatedProductsData[productId]
//       ) {
//         processedProductIds.add(productId);

//         if (
//           !updatedProductsData[productId].sizes ||
//           Object.keys(updatedProductsData[productId].sizes).length === 0
//         ) {
//           // Add promise to delete the product itself
//           deleteProductPromises.push(
//             fetch(`${url}/Stores/${uid}/Products/${productId}.json`, {
//               method: "DELETE",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             })
//           );
//         }
//       }
//     }

//     // Wait for all delete operations to complete
//     await Promise.all(deleteProductPromises);

//     // Send the order to the server
//     const orderResponse = await fetch(`${url}/Stores/${uid}/orders.json`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(order),
//     });
//     if (!orderResponse.ok) {
//       throw new Error("Network response was not ok");
//     }

//     // Clear the local storage
//     localStorage.removeItem("cart");

//     // Hide the preloader and show success message
//     document.getElementById("preloader").classList.add("hidden");
//     Swal.fire({
//       icon: "success",
//       title: "Order submitted successfully!",
//       showConfirmButton: false,
//       timer: 2000, // Close the alert after 1.5 seconds
//     }).then(() => {
//       window.location.href = "./index.html";
//     });
//   } catch (error) {
//     console.error(
//       "Error updating product quantities or submitting order:",
//       error
//     );
//     // Hide the preloader and show error message
//     document.getElementById("preloader").classList.add("hidden");
//     Swal.fire({
//       icon: "error",
//       title: "Error",
//       text: "An error occurred while processing your order. Please try again soon!",
//       showConfirmButton: false,
//       timer: 1500, // Close the alert after 1.5 seconds
//     });
//   }
// }

//
// Firebase configuration

//2
// const firebaseConfig = {
//   apiKey: "AIzaSyDss53pHibCpqo87_1bhoUHkf8Idnj-Fig",
//   authDomain: "matager-f1f00.firebaseapp.com",
//   projectId: "matager-f1f00",
//   storageBucket: "matager-f1f00.appspot.com",
//   messagingSenderId: "922824110897",
//   appId: "1:922824110897:web:b7978665d22e2d652e7610",
// };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// const auth = firebase.auth();

// async function submitOrder() {
//   // Show the preloader
//   document.getElementById("preloader").classList.remove("hidden");

//   try {
//     // Check if the user is authenticated
//     const user = firebase.auth().currentUser;

//     if (!user) {
//       // Hide the preloader
//       document.getElementById("preloader").classList.add("hidden");

//       // Show a message and Google Sign-In button
//       Swal.fire({
//         icon: "warning",
//         title: "Sign In Required",
//         html: `
//         <div class="flex flex-direction-column align-items">
//           <p>You need to sign in to complete your order.</p>
//           <button id="google-sign-in" class="swal2-confirm swal2-styled mt-10" style="background-color: #4285F4; color: white;">Sign in with Google</button>
//           <p><a href="./account.html" class="mt-10" style="color: #4285F4; text-decoration: underline;">Go to your account</a></p>
//         </div>
//         `,
//         showConfirmButton: false,
//       });

//       // Add Google Sign-In functionality
//       document
//         .getElementById("google-sign-in")
//         .addEventListener("click", () => {
//           const provider = new firebase.auth.GoogleAuthProvider();
//           firebase
//             .auth()
//             .signInWithPopup(provider)
//             .then((result) => {
//               Swal.fire({
//                 icon: "success",
//                 title: "Signed in successfully!",
//                 showConfirmButton: false,
//                 timer: 1500, // Close the alert after 1.5 seconds
//               });
//             })
//             .catch((error) => {
//               console.error("Error signing in:", error);
//               Swal.fire({
//                 icon: "error",
//                 title: "Sign In Failed",
//                 text: "There was a problem signing you in. Please try again!",
//                 showConfirmButton: false,
//                 timer: 1500, // Close the alert after 1.5 seconds
//               });
//             });
//         });

//       return; // Stop the process if the user is not authenticated
//     }

//     // Check product availability first
//     const isAvailable = await checkAvailability();
//     if (!isAvailable) {
//       // Hide the preloader if not available
//       document.getElementById("preloader").classList.add("hidden");
//       return;
//     }

//     // Retrieve cart data, personal info, and shipping fees from local storage
//     let cart = JSON.parse(localStorage.getItem("cart"));
//     let personal_info = JSON.parse(localStorage.getItem("personal_info"));
//     let shippingFees = document
//       .getElementById("shipping-fees-total")
//       .innerText.replace(" EGP", "");

//     // Create the order object
//     let order = {
//       cart: cart,
//       personal_info: personal_info,
//       shippingFees: parseFloat(shippingFees),
//     };

//     // Update product quantities in Firebase
//     const response = await fetch(`${url}/Stores/${uid}/Products.json`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch product data from Firebase");
//     }
//     let productsData = await response.json();

//     // Create a map to count quantities of each product
//     let productCounts = {};
//     cart.forEach((cartItem) => {
//       const key = `${cartItem.id}-${cartItem.productSize}-${cartItem.productColor}`;
//       if (!productCounts[key]) {
//         productCounts[key] = {
//           count: 0,
//           details: cartItem,
//         };
//       }
//       productCounts[key].count += 1;
//     });

//     // Create an array of promises for updating quantities
//     let updatePromises = [];

//     // Update product quantities or delete product if no stock is left
//     for (const key in productCounts) {
//       const { count, details } = productCounts[key];
//       const productId = details.id;

//       if (
//         productsData[productId] &&
//         productsData[productId].sizes[details.productSize] &&
//         productsData[productId].sizes[details.productSize][details.productColor]
//       ) {
//         const productInfo =
//           productsData[productId].sizes[details.productSize][
//             details.productColor
//           ];
//         const newQty = productInfo.qty - count;

//         if (newQty > 0) {
//           // Update the quantity
//           updatePromises.push(
//             fetch(
//               `${url}/Stores/${uid}/Products/${productId}/sizes/${details.productSize}/${details.productColor}.json`,
//               {
//                 method: "PATCH",
//                 headers: {
//                   "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ qty: newQty }),
//               }
//             )
//           );
//         } else {
//           // Remove the size/color node
//           updatePromises.push(
//             fetch(
//               `${url}/Stores/${uid}/Products/${productId}/sizes/${details.productSize}/${details.productColor}.json`,
//               {
//                 method: "DELETE",
//                 headers: {
//                   "Content-Type": "application/json",
//                 },
//               }
//             )
//           );
//         }
//       }
//     }

//     // Wait for all update operations to complete
//     await Promise.all(updatePromises);

//     // Fetch the updated product data to check for empty sizes nodes
//     const updatedResponse = await fetch(`${url}/Stores/${uid}/Products.json`);
//     if (!updatedResponse.ok) {
//       throw new Error("Failed to fetch updated product data from Firebase");
//     }
//     let updatedProductsData = await updatedResponse.json();

//     // Check for products with empty sizes nodes and delete them using IDs from the cart
//     let deleteProductPromises = [];
//     let processedProductIds = new Set();

//     for (const key in productCounts) {
//       const { details } = productCounts[key];
//       const productId = details.id;

//       if (
//         !processedProductIds.has(productId) &&
//         updatedProductsData[productId]
//       ) {
//         processedProductIds.add(productId);

//         if (
//           !updatedProductsData[productId].sizes ||
//           Object.keys(updatedProductsData[productId].sizes).length === 0
//         ) {
//           // Add promise to delete the product itself
//           deleteProductPromises.push(
//             fetch(`${url}/Stores/${uid}/Products/${productId}.json`, {
//               method: "DELETE",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             })
//           );
//         }
//       }
//     }

//     // Wait for all delete operations to complete
//     await Promise.all(deleteProductPromises);

//     // Send the order to the server
//     const orderResponse = await fetch(`${url}/Stores/${uid}/orders.json`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(order),
//     });
//     if (!orderResponse.ok) {
//       throw new Error("Network response was not ok");
//     }

//     // Clear the local storage
//     localStorage.removeItem("cart");

//     // Hide the preloader and show success message
//     document.getElementById("preloader").classList.add("hidden");
//     Swal.fire({
//       icon: "success",
//       title: "Order submitted successfully!",
//       showConfirmButton: false,
//       timer: 2000,
//     }).then(() => {
//       window.location.href = "./index.html";
//     });
//   } catch (error) {
//     console.error(
//       "Error updating product quantities or submitting order:",
//       error
//     );
//     // Hide the preloader and show error message
//     document.getElementById("preloader").classList.add("hidden");
//     Swal.fire({
//       icon: "error",
//       title: "Error",
//       text: "An error occurred while processing your order. Please try again soon!",
//       showConfirmButton: false,
//       timer: 1500,
//     });
//   }
// }

//
//3
//3
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

async function googleSignIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await firebase.auth().signInWithPopup(provider);
    Swal.fire({
      icon: "success",
      title: "Signed in successfully!",
      showConfirmButton: false,
      timer: 1500, // Close the alert after 1.5 seconds
    });
    return result.user;
  } catch (error) {
    console.error("Error signing in:", error);
    Swal.fire({
      icon: "error",
      title: "Sign In Failed",
      text: "There was a problem signing you in. Please try again!",
      showConfirmButton: false,
      timer: 1500, // Close the alert after 1.5 seconds
    });
    return null;
  }
}

async function submitOrder() {
  // Show the preloader
  document.getElementById("preloader").classList.remove("hidden");

  try {
    // Get the current authenticated user
    const user = firebase.auth().currentUser;

    if (!user) {
      // If the user is not authenticated, hide preloader and show sign-in prompt
      document.getElementById("preloader").classList.add("hidden");
      Swal.fire({
        icon: "warning",
        title: "Sign In Required",
        html: `
          <div class="flex flex-direction-column align-items">
            <p>You need to sign in to complete your order.</p>
            <button id="google-sign-in" class="swal2-confirm swal2-styled mt-10 flex align-items" style="background-color: #4285F4; color: white;"><i class="bi bi-google mr-5"></i> Sign in with Google</button>
            <button id="email-sign-in" class="swal2-confirm swal2-styled mt-10  flex align-items" style="background-color: #4285F4; color: white;"><i class="bi bi-envelope-fill mr-5"></i> sign in with email & password</button>
            <p><a href="./account.html" class="mt-10" style="color: #4285F4; text-decoration: underline;">Go to your account</a></p>
          </div>
        `,
        showConfirmButton: false,
        didOpen: () => {
          document
            .getElementById("google-sign-in")
            .addEventListener("click", googleSignIn);
          document
            .getElementById("email-sign-in")
            .addEventListener("click", emailPasswordSignIn);
        },
      });

      // Handle Google sign-in
      document
        .getElementById("google-sign-in")
        .addEventListener("click", () => {
          const provider = new firebase.auth.GoogleAuthProvider();
          firebase
            .auth()
            .signInWithPopup(provider)
            .then((result) => {
              Swal.fire({
                icon: "success",
                title: "Signed in successfully!",
                showConfirmButton: false,
                timer: 1500,
              });
            })
            .catch((error) => {
              console.error("Error signing in:", error);
              Swal.fire({
                icon: "error",
                title: "Sign In Failed",
                text: "There was a problem signing you in. Please try again!",
                showConfirmButton: false,
                timer: 1500,
              });
            });
        });

      return; // Stop the process if the user is not authenticated
    }

    
    // Email and Password Sign-In Prompt
    function emailPasswordSignIn() {
      Swal.fire({
        title: "Sign in with Email & Password",
        html: `
      <input type="email" id="email" class="swal2-input" placeholder="Enter your email">
      <input type="password" id="password" class="swal2-input" placeholder="Enter your password">
    `,
        showCancelButton: true,
        confirmButtonText: "Sign In",
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

    //

    // Get the user's auth token
    const idToken = await user.getIdToken();

    // Check product availability first
    const isAvailable = await checkAvailability();
    if (!isAvailable) {
      document.getElementById("preloader").classList.add("hidden");
      return;
    }

    // Retrieve cart data, personal info, and shipping fees from local storage
    let cart = JSON.parse(localStorage.getItem("cart"));
    let personal_info = JSON.parse(localStorage.getItem("personal_info"));
    let shippingFees = document
      .getElementById("shipping-fees-total")
      .innerText.replace(" EGP", "");

    // Create the order object
    let order = {
      cart: cart,
      personal_info: personal_info,
      email:user.email,
      shippingFees: parseFloat(shippingFees),
    };

    // Fetch products data
    const response = await fetch(
      `${url}/Stores/${uid}/Products.json?auth=${idToken}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch product data from Firebase");
    }
    let productsData = await response.json();

    // Update product quantities
    let productCounts = {};
    cart.forEach((cartItem) => {
      const key = `${cartItem.id}-${cartItem.productSize}-${cartItem.productColor}`;
      if (!productCounts[key]) {
        productCounts[key] = {
          count: 0,
          details: cartItem,
        };
      }
      productCounts[key].count += 1;
    });

    let updatePromises = [];

    // Update quantities or delete products
    for (const key in productCounts) {
      const { count, details } = productCounts[key];
      const productId = details.id;

      if (
        productsData[productId] &&
        productsData[productId].sizes[details.productSize] &&
        productsData[productId].sizes[details.productSize][details.productColor]
      ) {
        const productInfo =
          productsData[productId].sizes[details.productSize][
            details.productColor
          ];
        const newQty = productInfo.qty - count;

        if (newQty > 0) {
          // Update the quantity
          updatePromises.push(
            fetch(
              `${url}/Stores/${uid}/Products/${productId}/sizes/${details.productSize}/${details.productColor}.json?auth=${idToken}`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ qty: newQty }),
              }
            )
          );
        } else {
          // Remove the size/color node
          updatePromises.push(
            fetch(
              `${url}/Stores/${uid}/Products/${productId}/sizes/${details.productSize}/${details.productColor}.json?auth=${idToken}`,
              {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
              }
            )
          );
        }
      }
    }

    // Wait for all updates
    await Promise.all(updatePromises);

    // Fetch updated product data to check for empty sizes nodes
    const updatedResponse = await fetch(
      `${url}/Stores/${uid}/Products.json?auth=${idToken}`
    );
    if (!updatedResponse.ok) {
      throw new Error("Failed to fetch updated product data from Firebase");
    }
    let updatedProductsData = await updatedResponse.json();

    // Check for products with empty sizes nodes and delete them
    let deleteProductPromises = [];
    let processedProductIds = new Set();

    for (const key in productCounts) {
      const { details } = productCounts[key];
      const productId = details.id;

      if (
        !processedProductIds.has(productId) &&
        updatedProductsData[productId]
      ) {
        processedProductIds.add(productId);

        if (
          !updatedProductsData[productId].sizes ||
          Object.keys(updatedProductsData[productId].sizes).length === 0
        ) {
          // Delete the product
          deleteProductPromises.push(
            fetch(
              `${url}/Stores/${uid}/Products/${productId}.json?auth=${idToken}`,
              {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
              }
            )
          );
        }
      }
    }

    // Wait for all deletes
    await Promise.all(deleteProductPromises);

    // Send the order to the server
    const orderResponse = await fetch(
      `${url}/Stores/${uid}/orders.json?auth=${idToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      }
    );
    if (!orderResponse.ok) {
      throw new Error("Network response was not ok");
    }

    // Clear the cart and hide the preloader
    localStorage.removeItem("cart");
    document.getElementById("preloader").classList.add("hidden");

    // Show success message and redirect
    Swal.fire({
      icon: "success",
      title: "Order submitted successfully!",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      window.location.href = "./index.html";
    });
  } catch (error) {
    console.error(
      "Error updating product quantities or submitting order:",
      error
    );

    // Hide preloader and show error message
    document.getElementById("preloader").classList.add("hidden");
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while processing your order. Please try again soon!",
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
