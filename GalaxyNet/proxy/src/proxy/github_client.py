import base64
import os
from typing import Dict, List, Optional
import requests
import json
from dataclasses import dataclass

# Base URLs
GITHUB_API_BASE_URL = "https://api.github.com"
GITHUB_RAW_BASE_URL = "https://raw.githubusercontent.com"

# Caching (in-memory, consider a more persistent cache for a real application)
_GITHUB_DOC_CACHE: Dict[str, str] = {}


@dataclass
class GitHubDeps:
    """A dataclass to hold GitHub dependencies."""
    owner: str
    repo: str
    path: str
    branch: Optional[str] = None


def github_graphql_request(query: str, variables: Dict[str, any] = None) -> Dict[str, any]:
    """
    Executes a GraphQL query against the GitHub API.
    """
    headers = {
        "Authorization": f"bearer {os.getenv('GITHUB_TOKEN')}",
        "Content-Type": "application/json",
    }
    data = {"query": query}
    if variables:
        data["variables"] = variables

    response = requests.post(f"{GITHUB_API_BASE_URL}/graphql", headers=headers, json=data)
    response.raise_for_status()
    return response.json()


def github_repo_search_rest(query: str) -> Dict[str, any]:
    """
    Searches for repositories using the GitHub REST API.
    """
    headers = {
        "Authorization": f"bearer {os.getenv('GITHUB_TOKEN')}",
        "Accept": "application/vnd.github.v3+json",
    }
    params = {"q": query}
    response = requests.get(f"{GITHUB_API_BASE_URL}/search/repositories", headers=headers, params=params)
    response.raise_for_status()
    return response.json()


def github_repo_search_graphql(query: str) -> Dict[str, any]:
    """
    Searches for repositories using the GitHub GraphQL API.
    """
    GITHUB_GRAPHQL_QUERY = """
    query SearchRepositories($query: String!) {
      search(query: $query, type: REPOSITORY, first: 10) {
        edges {
          node {
            ... on Repository {
              nameWithOwner
              url
            }
          }
        }
      }
    }
    """
    variables = {"query": query}
    return github_graphql_request(GITHUB_GRAPHQL_QUERY, variables)


def search_code(owner: str, repo: str, keyword: str) -> List[Dict[str, any]]:
    """
    Searches for code within a specific repository.
    """
    headers = {
        "Authorization": f"bearer {os.getenv('GITHUB_TOKEN')}",
        "Accept": "application/vnd.github.v3.text-match+json",
    }
    url = f"{GITHUB_API_BASE_URL}/search/code?q={keyword}+in:file+repo:{owner}/{repo}"
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json().get("items", [])


def _get_code_with_imports(code: str, file_path: str, owner: str, repo: str, branch: str = "main") -> str:
    """
    (This function seems incomplete in the snippets, providing a possible implementation)
    A helper to get code with its imports. This is a complex task and this is a simplified version.
    """
    # In a real scenario, this would involve parsing the code to find import statements
    # and then recursively fetching the content of imported files.
    # For this example, we'll just return the code as is.
    return code


def fetch_github_documentation_aws(resource_name: str) -> Optional[str]:
    """
    Fetches documentation from GitHub for AWS resources.
    """
    if resource_name in _GITHUB_DOC_CACHE:
        return _GITHUB_DOC_CACHE[resource_name]

    # Assuming the resource_name to path logic from the snippets
    path = resource_to_github_path_aws(resource_name)
    if not path:
        return None

    owner, repo = "hashicorp", "terraform-provider-aws"
    url = f"{GITHUB_RAW_BASE_URL}/{owner}/{repo}/main/{path}"
    
    response = requests.get(url)
    if response.status_code == 200:
        content = response.text
        _GITHUB_DOC_CACHE[resource_name] = content
        return content
    return None

def fetch_github_documentation_awscc(resource_name: str) -> Optional[str]:
    """
    Fetches documentation from GitHub for AWS CC resources.
    """
    if resource_name in _GITHUB_DOC_CACHE:
        return _GITHUB_DOC_CACHE[resource_name]

    path = resource_to_github_path_awscc(resource_name)
    if not path:
        return None

    owner, repo = "hashicorp", "terraform-provider-awscc"
    url = f"{GITHUB_RAW_BASE_URL}/{owner}/{repo}/main/{path}"

    response = requests.get(url)
    if response.status_code == 200:
        content = response.text
        _GITHUB_DOC_CACHE[resource_name] = content
        return content
    return None


def resource_to_github_path_aws(resource_name: str) -> Optional[str]:
    """
    Converts an AWS resource name to its corresponding file path in the GitHub repository.
    e.g. aws_s3_bucket -> website/docs/r/s3_bucket.html.markdown
    """
    if not resource_name.startswith("aws_"):
        return None
    short_name = resource_name[4:]
    return f"website/docs/r/{short_name}.html.markdown"


def resource_to_github_path_awscc(resource_name: str) -> Optional[str]:
    """
    Converts an AWS CC resource name to its corresponding file path in the GitHub repository.
    e.g. awscc_s3_bucket -> website/docs/r/s3_bucket.html.markdown
    """
    if not resource_name.startswith("awscc_"):
        return None
    short_name = resource_name[6:]
    return f"website/docs/r/{short_name}.html.markdown"

def mock_github_release(version: str, assets: List[Dict[str, any]]) -> Dict[str, any]:
    """
    Creates a mock GitHub release dictionary.
    """
    return {
        "tag_name": version,
        "assets": assets,
    }
