# Test Runner and Analyzer

## Description
Runs the backend test suite using `make test`. If tests fail, it automatically analyzes the error output and proposes a fix.

## Prompt
Execute the command `make test` in the terminal to run the pytest suite for the FastAPI backend.

1. If the tests pass successfully (exit code 0), output exactly: "✅ All tests passed successfully! The codebase is stable."
2. If any test fails (exit code > 0):
   - Carefully read the error traceback from the terminal output.
   - Identify the specific file and line number causing the failure.
   - Provide a concise explanation of why the test failed based on the error message.
   - Propose a specific code fix to resolve the issue. 
   - Ask for my confirmation before applying any changes to the files.