import { useState, useEffect, useRef } from "react";

const GoogleAuthButton = () => {
  const [token, setToken] = useState(null);
  const buttonRef = useRef(null);
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // check for environment variables
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error("VITE_GOOGLE_CLIENT_ID is not set in environment variables");
      return;
    }

    // Load Google Identity Services script if not already loaded
    if (!window.google?.accounts) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = initializeGoogleAuth;
    } else {
      initializeGoogleAuth();
    }

    function initializeGoogleAuth() {
      // Wait for Google script to be fully loaded
      const checkGoogle = () => {
        if (typeof google !== "undefined" && google.accounts?.id) {
          google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            use_fedcm_for_prompt: false,
          });

          // Render the button
          if (buttonRef.current) {
            try {
              google.accounts.id.renderButton(buttonRef.current, {
                theme: "outline",
                size: "large",
                type: "standard",
                text: "signin_with",
              });
            } catch (error) {
              console.error("Could not render Google button:", error);
            }
          }
        } else {
          setTimeout(checkGoogle, 100);
        }
      };
      checkGoogle();
    }

    // Cleanup code
    return () => {
      if (buttonRef.current) {
        buttonRef.current.innerHTML = "";
      }
    };
  }, [GOOGLE_CLIENT_ID]);

  // Handle Google authentication response
  function handleCredentialResponse(response) {
    const jwtToken = response.credential;
    setToken(jwtToken);
    console.log("Google JWT Token:", jwtToken);
  }

  return (
    <div>
      <div ref={buttonRef}></div>
    </div>
  );
};

export default GoogleAuthButton;

