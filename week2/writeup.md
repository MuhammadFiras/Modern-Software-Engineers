# Week 2 Write-up
Tip: To preview this markdown file
- On Mac, press `Command (⌘) + Shift + V`
- On Windows/Linux, press `Ctrl + Shift + V`

## INSTRUCTIONS

Fill out all of the `TODO`s in this file.

## SUBMISSION DETAILS

Name: **Muhammad Firas** \
SUNet ID: **firas** \
Citations: **TODO**

This assignment took me about **24** hours to do. 


## YOUR RESPONSES
For each exercise, please include what prompts you used to generate the answer, in addition to the location of the generated response. Make sure to clearly add comments in your code documenting which parts are generated.

### Exercise 1: Scaffold a New Feature
Prompt: 
```
In week2/app/services/extract.py, please scaffold a new function called extract_action_items_llm(text: str) -> List[str]. Implement it using the ollama python client with the llama3.1:8b model. Force the model to return a structured JSON output with a list of strings under the key 'action_items'. Handle empty text inputs and potential JSON parsing errors.
``` 

Generated Code Snippets:
```
week2/app/services/extract.py Line 34 - 73
```

### Exercise 2: Add Unit Tests
Prompt: 
```
Please import extract_action_items_llm from ..app.services.extract. Then, write unit tests for extract_action_items_llm() covering multiple inputs: 1) a text with bullet lists, 2) a text with keyword-prefixed lines (like 'TODO:' or 'ACTION:'), and 3) an empty input string.
``` 

Generated Code Snippets:
```
week2/tests/test_extract.py Line 33 - 68
```

### Exercise 3: Refactor Existing Code for Clarity
Prompt: 
```
Please perform a comprehensive refactor of the FastAPI backend in the week2/app directory. Create a new schemas.py file with Pydantic models (e.g., NoteCreate, ActionItemResponse) and replace all instances of Dict[str, Any] in the routers. In main.py, remove the global init_db() call and move it into a FastAPI lifespan event manager (@asynccontextmanager). Improve error handling in the routers by utilizing proper HTTPExceptions.``` 
```

Generated/Modified Code Snippets:
```
week2/app/schemas.py Line 1 - 40
week2/app/main.py Line 10 - 36
week2/app/routers/notes.py Line 15 - 37
week2/app/routers/action_items.py Line 15 - 60
```


### Exercise 4: Use Agentic Mode to Automate a Small Task
Prompt: 
```
In routers/action_items.py, add a new POST endpoint /extract-llm that calls the extract_action_items_llm function. In routers/notes.py, add a GET endpoint / to list all notes from the database. Then, update frontend/index.html by adding 'Extract LLM' and 'List Notes' buttons, along with the necessary JavaScript fetch logic to call these new endpoints and render the results in the DOM. Ensure the JS correctly targets the existing #text input ID and handles rendering the checkboxes properly.``` 
```
Generated Code Snippets:
```
week2/app/routers/action_items.py Line 15 - 60
week2/app/routers/notes.py Line 15 - 37
frontend/index.html Line 20 - 80
```


### Exercise 5: Generate a README from the Codebase
Prompt: 
```
Please analyze the current codebase in week2/app and generate a well-structured README.md file. The README should include, at a minimum:
- A brief overview of the project
- How to set up and run the project
- API endpoints and functionality
- Instructions for running the test suite
Make sure to include any necessary commands for installation, running the server, and executing tests. The README should be clear and concise, providing all the information needed for a new developer to get started with the project.
``` 

Generated Code Snippets:
```
week2/README.md Line 1 - 60
```


## SUBMISSION INSTRUCTIONS
1. Hit a `Command (⌘) + F` (or `Ctrl + F`) to find any remaining `TODO`s in this file. If no results are found, congratulations – you've completed all required fields. 
2. Make sure you have all changes pushed to your remote repository for grading.
3. Submit via Gradescope. 