import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slicesRedux/user";

function useCheckAuth() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "http://localhost:9000/api/v1/auth/check-auth",
          {
            // Send cookies to allow the server to verify the authentication state
            credentials: "include",
          }
        );

        // Handle non-authenticated users (status 401)
        if (response.status === 401) {
          console.log("User is not authenticated");
          return;
        }

        // If the response is OK, parse the JSON data and update the user state via Redux
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          dispatch(login(data));
        } else {
          console.log(`Server error: ${response.status}`);
        }
      } catch (error) {
        console.log(`Fetch error: ${error.message}`);
      } finally {
        // Stop the loading state regardless of success or failure
        setIsLoading(false);
      }
    };

    // Call the async function inside useEffect
    checkAuth();
  }, [dispatch]);

  return [user, isLoading];
}

export default useCheckAuth;
