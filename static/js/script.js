document.getElementById('submitButton').addEventListener('click', sendMessage);
document.getElementById('documentInput').addEventListener('change', handleDocumentUpload);
document.getElementById('messageInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('messageInput').addEventListener('focus', function() {
    document.getElementById('inputBarContainer').classList.add('active');
});

document.getElementById('messageInput').addEventListener('blur', function() {
    document.getElementById('inputBarContainer').classList.remove('active');
});

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messages = document.getElementById('messages');

    if (messageInput.value.trim() !== "") {
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';

        const userImage = document.createElement('img');
        userImage.src = '../static/images/user.png'; // path to your user image

        const userMessageText = document.createElement('span');
        userMessageText.textContent = messageInput.value;

        userMessage.appendChild(userImage);
        userMessage.appendChild(userMessageText);
        messages.appendChild(userMessage);

        // Send the message to the backend
        fetch('/send_query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: messageInput.value })
        })
        .then(response => response.json())
        .then(data => {
            // console.log('Response received from backend:', data); // Log the response

            if (data && data.response) { // Ensure data and data.response exist
                const responseMessage = document.createElement('div');
                responseMessage.className = 'message response-message';

                const responseImage = document.createElement('img');
                responseImage.src = '../static/images/stars.png'; // path to your response image

                const responseMessageText = document.createElement('span');
                responseMessageText.innerHTML = data.response;

                responseMessage.appendChild(responseImage);
                responseMessage.appendChild(responseMessageText);
                messages.appendChild(responseMessage);
                messages.scrollTop = messages.scrollHeight;
            } else {
                console.error('Invalid response format:', data); // Log if the response format is unexpected
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

        messageInput.value = '';
        messages.scrollTop = messages.scrollHeight;
    }
}

function handleDocumentUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const documentPreview = document.getElementById('documentPreview');
        const fileType = file.type;

        if (fileType.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                documentPreview.innerHTML = `<img src="${e.target.result}" width="100%" height="auto">`;
            };
            reader.readAsDataURL(file);
        } else if (fileType === 'application/pdf') {
            documentPreview.innerHTML = `<iframe src="${URL.createObjectURL(file)}" width="100%" height="100%"></iframe>`;
        } else {
            documentPreview.innerHTML = `<p>Preview not available for this file type</p>`;
        }

        // Send the file content to the Flask app
        sendDocumentContent(file);
    }
}

function sendDocumentContent(file) {
    const formData = new FormData();
    formData.append('file', file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.getElementById('documentInput').addEventListener('change', handleDocumentUpload);
