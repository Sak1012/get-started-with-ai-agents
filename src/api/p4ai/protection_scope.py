import os
from typing import Optional
import httpx
from .msalconfig import MSAL_CONFIG

_scopes_cache = None


# This is the Graph endpoint for beta
GRAPH_ENDPOINT = f"https://graph.microsoft.com/beta/me/dataSecurityAndGovernance/protectionScopes/compute"


async def fetch_protection_scopes(token: str) -> None:
    global _scopes_cache

    access_token = token

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # Prepare the request body as per the raw API format
    body = {
        "activities": "uploadText,downloadText",
        "locations": [
            {
                "@odata.type": "microsoft.graph.policyLocationApplication",
                "value": MSAL_CONFIG["client_id"]
            }
        ],
        "deviceMetadata": {
            "deviceType": "Unmanaged",
            "operatingSystemSpecifications": {
                "operatingSystemPlatform": "Windows 11",
                "operatingSystemVersion": "10.0.26100.0"
            },
            "ipAddress": "127.0.0.1"
        }
    }

    print("\nRequest body for protection scopes:", body)

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(GRAPH_ENDPOINT, headers=headers, json=body)

        response.raise_for_status()
        json_response = response.json()
        _scopes_cache = json_response.get("value")
        print("\nProtection scopes fetched:", _scopes_cache, "\n")

    except httpx.HTTPStatusError as e:
        print("HTTP error:", e.response.status_code, e.response.text)
    except Exception as e:
        print("Failed to fetch protection scopes:", str(e))


def get_cached_protection_scope() -> Optional[object]:
    return _scopes_cache
