from msgraph_beta import GraphServiceClient
from azure.core.credentials import AccessToken
from azure.core.credentials_async import AsyncTokenCredential
import datetime

_graph_client_instance = None  # Internal singleton cache


class SimpleAccessTokenCredential(AsyncTokenCredential):
    def __init__(self, token: str):
        self._token = token

    async def get_token(self, *scopes, **kwargs) -> AccessToken:
        return AccessToken(
            token=self._token,
            expires_on=datetime.datetime.utcnow().timestamp() + 3600,
        )


async def initialize_graph_client(token: str) -> None:
    """Call this once after login to initialize the client."""
    global _graph_client_instance
    if _graph_client_instance is None:
        credential = SimpleAccessTokenCredential(token)
        _graph_client_instance = GraphServiceClient(
            credential, scopes=["https://graph.microsoft.com/.default"]
        )


def get_client() -> GraphServiceClient:
    """Get the initialized client instance. Raises if not initialized."""
    if _graph_client_instance is None:
        raise RuntimeError("Graph client not initialized. Call initialize_graph_client(token) first.")
    return _graph_client_instance
