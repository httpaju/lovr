const apiKey = '7f9612830d43ab6c8aec82f34731e8b9'; // Your ImgBB API key

document.getElementById('lover-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const yourName = document.getElementById('yourName').value.trim();
    const birthdayPerson = document.getElementById('birthdayPerson').value.trim();
    const message = document.getElementById('message').value.trim();
    const files = document.getElementById('images').files;

    if (!yourName || !birthdayPerson || !message || files.length === 0) {
        alert("Please fill all fields and upload at least one image.");
        return;
    }

    const imageUrls = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
            const imageUrl = await uploadImage(file);
            imageUrls.push(imageUrl);
        } catch(err) {
            console.error("Image upload failed", err);
            alert("Failed to upload image: " + file.name);
            return;
        }
    }

    const data = {
        yourName,
        birthdayPerson,
        message,
        images: imageUrls
    };

    const jsonString = JSON.stringify(data);
    const encoded = encodeURIComponent(jsonString);

    const baseURL = window.location.origin.replace('lover.html', 'index.html');
    const fullLink = `${baseURL}/lovr/?data=${encoded}`;

    const resultLink = document.getElementById('result-link');
    resultLink.href = fullLink;
    resultLink.textContent = fullLink;
});

async function uploadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = async function() {
            const base64data = reader.result.split(',')[1];
            try {
                const formData = new FormData();
                formData.append('image', base64data);

                const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (result.success) {
                    resolve(result.data.url);
                } else {
                    reject(result.error);
                }
            } catch(err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
