from flask import Flask, render_template, request, jsonify, session
import os
import binascii
import PyPDF2
import tempfile
from utils import llama
from markdown import markdown

app = Flask(__name__)
app.secret_key = binascii.hexlify(os.urandom(24)).decode()

# Global default upload status
DEFAULT_UPLOAD_STATUS = {
    "status": "No file uploaded",
    "file_name": None,
    "file_content": None
}

prompt1 = """You are an intelligent assistant. 
Answer the following question as accurately and concisely as possible based on your general knowledge and understanding.
Please answer the questions in the query and explain your reasoning.
If there is not enough information to answer, please say
"I do not have enough information to answer this question."
"""

prompt2 = """You are an intelligent assistant. Given the context data provided below, 
answer the following question primarily using the information from the context. 
The context may also include previous questions and answers relevant to the current question.
If the context does not provide sufficient information, only then draw from your general knowledge:
```document: {document}```
Please answer the questions in the query and explain your reasoning.
If there is not enough information to answer this question, please say
"I do not have enough information to answer this question."
"""

@app.before_request
def before_request():
    if 'upload_status' not in session:
        session['upload_status'] = DEFAULT_UPLOAD_STATUS.copy()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No file part"})
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"status": "error", "message": "No selected file"})
    
    if file and file.filename.endswith('.pdf'):
        temp_dir = tempfile.gettempdir()
        file_path = os.path.join(temp_dir, file.filename)
        file.save(file_path)
        
        # Read the PDF content
        content = []
        with open(file_path, 'rb') as pdf_file:
            reader = PyPDF2.PdfReader(pdf_file)
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                content.append(page.extract_text())
            content = '\n'.join(content)
        
        # Update the upload status
        session['upload_status'] = {
            "status": "File uploaded successfully",
            "file_name": file.filename,
            "file_content": content
        }

        # print(f"upload: {session['upload_status']['file_name']}")

        # Optionally, delete the file after reading
        os.remove(file_path)
        
        return jsonify({"status": "success", "message": "File received"})
    else:
        return jsonify({"status": "error", "message": "Invalid file type"})

@app.route('/send_query', methods=['POST'])
def send_query():
    data = request.json
    message = data.get('message')
    
    # Choose the appropriate prompt based on the presence of file content
    if session['upload_status']['file_content']:
        prompt = prompt2.format(document=session['upload_status']['file_content'])
    else:
        prompt = prompt1

    prompt = prompt + "\nquestion: " + message

    # Generate response from llama
    response = llama(prompt)
    
    # Assuming the response from llama is in the 'response' key of the dictionary
    response = markdown(response)

    # print(f"{session['upload_status']['file_name']} \n {prompt} \n {response}")

    # Append the response to the prompt
    prompt = prompt + "\nresponse: " + response
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)
