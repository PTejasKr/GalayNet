from urllib.parse import urlparse

def clean_github_url(url: str) -> str:
    """
    Cleans a GitHub URL to return the 'github.com/owner/repo' part.
    """
    if not url:
        return ""
    
    parsed_url = urlparse(url)
    path_parts = parsed_url.path.strip('/').split('/')
    
    if "github.com" in parsed_url.netloc and len(path_parts) >= 2:
        return f"github.com/{path_parts[0]}/{path_parts[1]}"
        
    return ""
