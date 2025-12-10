import subprocess
from typing import Dict, Any

def execute_code_simple(code: str) -> None:
    """
    Executes Python code using exec.
    Warning: This is not safe and should not be used with untrusted code.
    """
    try:
        exec(code)
    except Exception as e:
        print(f"Error executing code: {e}")

def _execute_code_interpreter(code: str, deps: Dict[str, Any] = None) -> None:
    """
    (This function seems incomplete in the snippets, providing a possible implementation)
    Executes Python code in a sandboxed environment.
    """
    # This is a placeholder for a more complex implementation.
    # A real implementation would require a sandboxing library or a separate process
    # with restricted permissions.
    print("Simulating code execution in a sandboxed interpreter.")
    print(f"Code to execute: {code}")
    print(f"Dependencies: {deps}")
    try:
        # A very basic and unsafe way to simulate passing dependencies
        # In a real scenario, you'd use a more sophisticated mechanism
        local_scope = {}
        if deps:
            local_scope.update(deps)
        exec(code, globals(), local_scope)
    except Exception as e:
        print(f"Error executing code in interpreter: {e}")


def execute_code_docker(code: str, image: str = "python:3.9-slim") -> None:
    """
    Executes Python code in a Docker container.
    """
    try:
        result = subprocess.run(
            ["docker", "run", "--rm", image, "python", "-c", code],
            capture_output=True,
            text=True,
            check=True,
        )
        print(result.stdout)
        if result.stderr:
            print("--- stderr ---")
            print(result.stderr)
    except FileNotFoundError:
        print("Docker not found. Please install Docker to use this feature.")
    except subprocess.CalledProcessError as e:
        print(f"Error executing code in Docker: {e}")
        print(e.stderr)
