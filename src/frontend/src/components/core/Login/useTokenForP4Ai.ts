import { useMsal } from "@azure/msal-react";
import { AuthenticationResult } from "@azure/msal-browser";

export const useTokenForP4Ai = () => {
  const { instance } = useMsal();

  const getToken = async (scopes: string[]): Promise<string | undefined> => {
    console.log("Attempting to acquire token with scopes:", scopes);

    try {
      let activeAccount = instance.getActiveAccount();
      if (!activeAccount) {
        console.warn("No active account found. Attempting interactive login...");
        const loginResponse = await instance.loginPopup({
          scopes,
          redirectUri: window.location.origin,
        });

        activeAccount = loginResponse.account;
        if (activeAccount) {
          instance.setActiveAccount(activeAccount);
        }
      }

      const tokenResponse: AuthenticationResult = await instance.acquireTokenSilent({
        scopes,
        redirectUri: window.location.origin,
      });

      console.log("Silent token acquired");
      return tokenResponse.accessToken;
    } catch (error) {
      console.warn("Silent token acquisition failed:", error);

      try {
        const interactiveResponse: AuthenticationResult = await instance.acquireTokenPopup({
          scopes,
          redirectUri: window.location.origin,
        });

        console.log("Interactive token acquired");
        return interactiveResponse.accessToken;
      } catch (interactiveError) {
        console.error("Interactive authentication failed:", interactiveError);
        return undefined;
      }
    }
  };

  return getToken;
};
