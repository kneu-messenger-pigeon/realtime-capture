(function() {
    const eventEndpoint = "https://{WORKER_HOST}/";
    const initialFromDataKey = '__initialFormData__'

    /**
     * @param {FormData} formData
     * @param {FormData|null} initialFormData
     * @param {string[]} hiddenInputsNames
     * @returns {Promise<Response>}
     */
    const submitEvent = function (formData, initialFormData, hiddenInputsNames) {
        let hasChanges = !initialFormData;
        hiddenInputsNames = hiddenInputsNames || []
        if (initialFormData) {
            for (let [key, value] of formData.entries()) {
                if (initialFormData.get(key) !== value && !hiddenInputsNames.includes(key)) {
                    hasChanges = true;
                    break;
                }
            }
        }

        return fetch(eventEndpoint, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json",
            },
            keepalive: true,
            credentials: "omit",
            cache: "no-cache",
            body: JSON.stringify({
                "hasChanges": hasChanges,
                "form": Object.fromEntries(formData.entries())
            }),
        })
    }

    const submitEventPreConnect = function () {
        submitEventPreConnect.done = submitEventPreConnect.done || fetch(eventEndpoint, {
            method: "HEAD",
            mode: "no-cors",
            credentials: "omit",
            cache: "no-cache",
        });
    }

    const captureRegForm = function (e) {
        if (!e.realtimeCaptured && !e.defaultPrevented) {
            e.realtimeCaptured = true
            let form = captureRegForm.form
            for (let element of [e.target, e.target.form, this, this.form]) {
                if (element && element instanceof HTMLFormElement) {
                    form = element
                    break;
                }
            }

            let hiddenInputsNames = []
            form.querySelectorAll('[type=hidden]').forEach(function (hiddenInput) {
                hiddenInputsNames.push(hiddenInput.name)
            })

            submitEvent(new FormData(form), form[initialFromDataKey], hiddenInputsNames);
        }
    }

    /**
     * @param {ParentNode} node
     */
    const setupRegFormCapture = function (node) {
        let regForm = node.querySelector('#reg')
        if (regForm) {
            submitEventPreConnect();

            captureRegForm.form = regForm
            regForm.removeEventListener('submit', captureRegForm);
            regForm.addEventListener('submit', captureRegForm);

            regForm.querySelectorAll("[type=submit]").forEach(function (submitButton) {
                submitButton.removeEventListener('click', captureRegForm)
                submitButton.addEventListener('click', captureRegForm)
            })

            window.jQuery && window.jQuery(regForm).off('submit.capture', captureRegForm).on('submit.capture', captureRegForm)
            regForm[initialFromDataKey] instanceof FormData || (regForm[initialFromDataKey] = new FormData(regForm))
        }
    }

    const deleteLessonCapture = function (e) {
        e.defaultPrevented || submitEvent(new URLSearchParams(
            e.target.getAttribute('href').split('#')[0].split('?')[1]
        ))
    }

    /**
     * @param {ParentNode} node
     */
    const setupDeleteLessonCapture = function (node) {
        let deleteLink = node.querySelector('#delzn');
        if (deleteLink) {
            submitEventPreConnect();
            deleteLink.removeEventListener('click', deleteLessonCapture)
            deleteLink.addEventListener('click', deleteLessonCapture)
        }
    }

    const modalBodyObserver = new MutationObserver(function (mutationList) {
        for (let mutation of mutationList) {
            if (mutation.addedNodes.length) {
                setupDeleteLessonCapture(mutation.target);
                break;
            }
        }
    });

    const setupCapture = function () {
        let modalBody = document.querySelector('#m1 .modal-body');
        if (modalBody) {
            modalBodyObserver.disconnect();
            modalBodyObserver.observe(modalBody, {childList: true});
        }

        setupRegFormCapture(document)
    }

    const setupCaptureOnReady = function () {
        document.removeEventListener('DOMContentLoaded', setupCapture)
        document.addEventListener('DOMContentLoaded', setupCapture)
        window.addEventListener('pageshow', function (event) {
            event.persisted && setupCapture();
        });
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            setupCapture();
        }
    }

    let isScriptLoading = 0;
    const scriptOnLoad = function () {
        isScriptLoading--;
        isScriptLoading || setupCaptureOnReady();
    }

    const loadScript = function (src) {
        isScriptLoading++;

        let script = document.createElement('script')
        script.setAttribute('src', src);
        script.setAttribute('defer', 'defer')
        script.addEventListener('load', scriptOnLoad);
        script.addEventListener('error', scriptOnLoad);
        document.head.appendChild(script)
    }

    window.FormData && window.FormData.prototype.entries || loadScript('https://cdn.jsdelivr.net/npm/formdata-polyfill@4.0.10/formdata.min.js')
    window.URLSearchParams|| loadScript('https://cdn.jsdelivr.net/npm/@ungap/url-search-params/min.js');

    isScriptLoading || setupCaptureOnReady();
})()