# Friction RAG Engine - Frontend Architecture

## The Stack
* **Core Framework:** React + Vite. Vite is used instead of standard Create React App because its build times and hot-module replacement (HMR) are significantly faster.
* **Styling:** Tailwind CSS v4. Used to completely bypass standard CSS files. It allows for rapid UI prototyping using utility classes and handles dark mode/flexbox layouts effortlessly.
* **Icons:** Lucide React. A modern, optimized vector icon library. It only bundles the specific SVGs we import, keeping the frontend lightweight.

## Application Structure
The application is built using a modern two-pane layout:
1.  **Sidebar:** Houses the system status and knowledge base connections.
2.  **Chat Window:** The main arena containing the message history and the user input field.

## Data Flow (Local State)
Currently, the chat functionality relies entirely on local React state (`useState`). 
* `messages`: An array holding the conversation history.
* `inputText`: A string tracking the user's keystrokes. 
* When "Send" is clicked, the `inputText` is formatted into a message object and pushed to the `messages` array, triggering React to instantly re-render the UI with the new chat bubble.