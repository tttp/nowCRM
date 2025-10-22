const domain = process.env.AUTH0_BASE_URL;
const trackerCode = `

const NOWTEC_ENDPOINT_URI = '${domain}/api/tracker_post'

async function sendEventToEndpoint(eventData) {
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    }
    const response = await fetch(NOWTEC_ENDPOINT_URI, fetchOptions);
    return response.status;
}

function getURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const paramsObject = {};
    for (const [key, value] of urlParams.entries()) {
        paramsObject[key] = value;
    }
    return paramsObject;
}

function getUTMParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};

    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    utmKeys.forEach(key => {
        if (urlParams.has(key)) utmParams[key] = urlParams.get(key);
    });
    return utmParams;
}

function getFormData(form) {
    const formData = new FormData(form);
    const data = {};

    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    return data
}

setTimeout(function() {
    const forms = document.querySelectorAll("form");
    if (forms) {
        for(const form of forms) {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                const eventData = {
                    action: 'formSubmit',
                    source: window.location.origin,
                    status: 'submited',
                    author: 'nowtec',
                    timestamp: new Date().toISOString(),
                    formData: getFormData(form),
                    urlParameters: getURLParameters(),
                    utmParameters: getUTMParameters()
                };
                sendEventToEndpoint(eventData).then(response => {
                    console.log('RESPONSE', response)
                }).catch(error => {
                    console.error(error)
                }).finally(() => form.submit())
            });
        }
    }
}, 4000);
`;

export default trackerCode;
