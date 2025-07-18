import React, { useEffect, useState } from "react";
import { AgentPreview } from "./agents/AgentPreview";
import Login from "./core/Login/Login";
import { ThemeProvider } from "./core/theme/ThemeProvider";

const App: React.FC = () => {
  const [agentDetails, setAgentDetails] = useState({
    id: "loading",
    object: "agent",
    created_at: Date.now(),
    name: "Loading...",
    description: "Loading agent details...",
    model: "default",
    metadata: {
      logo: "robot",
    },
  });

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  // Verify token with backend
  useEffect(() => {
    const verify = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch("/auth/verify", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          setIsVerified(true);
        } else {
          console.error("Token verification failed");
        }
      } catch (err) {
        console.error("Verification error:", err);
      }
    };

    verify();
  }, [accessToken]);

  // Fetch agent details regardless
  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        const response = await fetch("/agent", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.ok
          ? await response.json()
          : {
              id: "fallback",
              object: "agent",
              created_at: Date.now(),
              name: "AI Agent",
              description: "Could not load agent details",
              model: "default",
              metadata: { logo: "robot" },
            };

        setAgentDetails(data);
      } catch (error) {
        console.error("Error fetching agent details:", error);
      }
    };

    fetchAgentDetails();
  }, []);

  return (
    <ThemeProvider>
      <div className="app-container">
        {!isVerified && <Login setAccessToken={setAccessToken} />}
        <div style={{ position: "relative" }}>
          <AgentPreview
            resourceId="sample-resource-id"
            agentDetails={agentDetails}
          />

          {!isVerified && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255,255,255,0.6)",
                zIndex: 9999,
                pointerEvents: "all",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
				cursor: "not-allowed",
              }}
            >
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
