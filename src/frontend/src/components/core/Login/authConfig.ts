export const msalConfig = {
  auth: {
    clientId: "YOUR_CLIENT_ID",
    authority: "https://login.microsoftonline.com/organizations",
    redirectUri: "/",
	clientCapabilities: ["cp1"],
  },
  cache: {
	cacheLocation: "sessionStorage",
	storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
	scopes : ["ProtectionScopes.Compute.User", "SensitivityLabel.Read", "ContentActivity.Write", "User.Read", "Content.Process.User"],
};
