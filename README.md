# Ask_llama2

## Project Overview
Ask Llama2 is a web application designed to interact with the Llama2 language model. It allows users to upload PDF documents and ask questions based on either the uploaded content or general knowledge. The application uses Flask for the backend, and a combination of HTML, CSS, and JavaScript for the frontend.


**Live Demo:** [https://ask-llama2.onrender.com](https://ask-llama2.onrender.com)

**Video Demo:**

https://github.com/user-attachments/assets/02ef8aed-0339-4afe-8d96-a5006586fad9


## Key Features ✨

- **PDF Document Upload** 📄: Users can upload PDF files which are then processed to extract text content.
- **Intelligent Query Response** 🤖: Depending on whether a document is uploaded, the application generates responses using either the document's content or general knowledge.
- **Dynamic User Interface** 🖥️: A user-friendly interface for document preview and chat-based interaction.

## Technologies Used 🛠️

- **Backend**: Flask, PyPDF2, Python-dotenv
- **Frontend**: HTML, CSS, JavaScript
- **Language Model**: Llama2 via the Together API
- **PDF Processing**: PyPDF2
- **Markdown Rendering**: Markdown

## Llama2 and Prompt Engineering 🧠

The core of this application revolves around Llama2, an advanced language model from Together. The model is queried with different prompts depending on the availability of uploaded document content:

- **General Knowledge Prompt**: When no document is uploaded, a general prompt (`prompt1`) is used to answer the user's questions based on Llama2's training data.
- **Contextual Prompt**: When a document is uploaded, a contextual prompt (`prompt2`) is used, which includes the document's content to provide more accurate answers.

### Prompt Examples 📋

1. **General Knowledge Prompt**
   ```python
   prompt1 = """You are an intelligent assistant. 
   Answer the following question as accurately and concisely as possible based on your general knowledge and understanding.
   Please answer the questions in the query and explain your reasoning.
   If there is not enough information to answer, please say
   "I do not have enough information to answer this question."
   """ ```
2. **Contextual Prompt**
   ```python
   prompt1 = """You are an intelligent assistant. Given the context data provided below. 
   answer the following question primarily using the information from the context. 
   The context may also include previous questions and answers relevant to the current question.
   If the context does not provide sufficient information, only then draw from your general knowledge:
   document: {document} 

   Please answer the questions in the query and explain your reasoning.
   If there is not enough information to answer this question, please say
   "I do not have enough information to answer this question."
   """

## Backend Details 🖧
The backend is built using Flask, and it handles the following key functionalities:

* **File Upload:** Handles PDF file uploads and extracts text content using PyPDF2.
* **Session Management:** Maintains the upload status and session data.
* **Query Handling:** Receives user queries, constructs appropriate prompts, and fetches responses from Llama2 via the Together API.

  ### Key Backend Code Snippets

  * **File Upload Handling, Query Processing:** see [app.py](https://github.com/KOMPALALOKESH/Ask_llama2/blob/main/app.py)
  * **Calling Llama2:** see [utils.py](https://github.com/KOMPALALOKESH/Ask_llama2/blob/main/utils.py)

## Frontend Details 🎨
The frontend is implemented using HTML for structure, CSS for styling, and JavaScript for interactivity. The main components are:
  ### Key Backend Code Snippets
  * **Chat Interface:** Allows users to type and send messages.
  * **Document Preview:** Displays a preview of uploaded PDF documents.
  * **Dynamic Response Display:** Shows responses from the Llama2 model in a chat format.
  
### Key Frontend Code Snippets
* **Sending Messages, Handling Document Upload:** see [script.js](https://github.com/KOMPALALOKESH/Ask_llama2/blob/main/static/js/script.js)

## How to Run 🏃‍♂️

1. Clone the Repository:
   ```
   git clone https://github.com/KOMPALALOKESH/Ask_llama2.git
   ```
2. Install Dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Set Up Environment Variables: Create a .env file and add your Together API key and base URL.
   ```
   TOGETHER_API_KEY=***
   DLAI_TOGETHER_API_BASE=***
   ```
4. Run the Application:
   ```
   py app.py
   ```

## Conclusion 🎉
Ask Llama2 is a robust application that leverages advanced language models to provide intelligent responses based on both general knowledge and specific document content. The integration of Flask for the backend and a dynamic, responsive frontend ensures a seamless user experience.

For more information, visit the [project repository](https://github.com/KOMPALALOKESH/Ask_llama2).
