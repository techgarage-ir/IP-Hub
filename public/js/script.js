$(() => {
    const alertBox = document.getElementById('data');
    const inputForm = document.getElementById('inputForm');
    const appResult = document.getElementById('appResult');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const responseText = document.getElementById('response');
    const responseContainer = document.getElementById('responseContainer');
    const backButton = document.getElementById('backButton');
    const copyButton = document.getElementById('copyButton');
    const downloadButton = document.getElementById('downloadButton');
    const countryInput = document.getElementById('country');

    $('.dropdown').select2({
        theme: "bootstrap-5",
        width: $(this).data('width') ?
        $(this).data('width') :
        $(this).hasClass('w-100') ? '100%' : 'style'
    });

    inputForm.onsubmit = (event) => {
        event.preventDefault();
        inputForm.style.display = 'none';
        appResult.style.display = 'block';
        loadingSpinner.classList.remove('d-none');
        loadingSpinner.classList.add('d-flex');

        let data = new FormData(event.target);
        let succeed = false;
        fetch(event.target.action, {
            method: inputForm.method,
            body: formDataToJSON(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(async response => {
            if (response.ok) {
                let result = await response.text();
                result = response.headers.get('Content-Type') === ('application/json') ? beautifyJson(result) : result;
                responseText.innerHTML = result;
                formatSyntax(responseText);
                succeed = true;
            } else {
                response.text().then(text => {
                    showAlert(`Oops! There was a problem submitting your form<br>Code: ${response.status} - ${response.statusText}<br>${text}`);
                });
                succeed = false;
            }
        }).catch(error => {
            showAlert("Oops! There was a problem submitting your form<br>" + error);
            succeed = false;
        }).finally(() => {;
            loadingSpinner.classList.add('d-none');
            loadingSpinner.classList.remove('d-flex');
            if (succeed) {
                responseContainer.classList.remove('d-none');
                responseText.classList.remove('d-none');
            }
            backButton.classList.remove("d-none");
            copyButton.classList.remove("d-none");
            downloadButton.classList.remove("d-none");
        });
        // GA4
        gtag('event', 'submit_form', {
            'country': countryInput.options[countryInput.selectedIndex].text,
            'format': document.querySelector('input[name="format"]:checked').value,
            'ip_type': document.querySelector('input[name="version"]:checked').value,
            'access_type': document.querySelector('input[name="access"]:checked').value,
        });
    };

    backButton.onclick = () => {
        inputForm.reset();
        turnstile.reset('#captcha-widget');
        $('#country').val(null).trigger('change');
        inputForm.style.display = 'block';
        appResult.style.display = 'none';
        responseText.classList.add('d-none');
        responseContainer.classList.add('d-none');
        loadingSpinner.classList.remove('d-none');
        loadingSpinner.classList.add('d-flex');
        alertBox.classList.add("d-none");
        backButton.classList.add("d-none");
        copyButton.classList.add("d-none");
        downloadButton.classList.add("d-none");
    };

    copyButton.onclick = () => {
        let text = responseText.innerText;
        copyToClipboard(text);
    }

    downloadButton.onclick = () => {
        let text = responseText.innerText;
        let country = countryInput.value;
        let format = document.querySelector('input[name="format"]:checked').value;
        let fileName = `${country}_${format}.json`;
        downloadFile(text, fileName);
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        toggleTheme();
    }
});

function showSection(e, sectionId) {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    navItems.forEach(navItem => {
        navItem.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    e.classList.add('active');
}

function toggleTheme() {
    document.getElementById('switchTheme').querySelector('i.bx').classList.toggle('bx-sun');
    document.getElementById('switchTheme').querySelector('i.bx').classList.toggle('bx-moon');
    if (document.documentElement.getAttribute('data-bs-theme') === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    }
}

function formDataToJSON(formData) {
    if (!(formData instanceof FormData)) {
        throw TypeError('formData argument is not an instance of FormData');
    }

    const data = {}
    for (const [name, value] of formData) {
        data[name] = value;
    }

    return JSON.stringify(data);
}

function showAlert(message) {
    const alertBox = document.getElementById('data');
    alertBox.classList.remove("d-none");
    alertBox.innerHTML = message;
}

function formatSyntax(el) {
    el.classList.add('language-json');
    Prism.highlightElement(el);
}

function beautifyJson(code) {
    return JSON.stringify(JSON.parse(code), null, 2);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showAlert('Copied to clipboard!');
    }).catch(() => {
        showAlert('Failed to copy to clipboard!');
    });
}

function downloadFile(text, fileName) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}
