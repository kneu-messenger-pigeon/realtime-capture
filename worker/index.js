import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const clientSqs = new SQSClient({
    region: AwsRegion,
    credentialDefaultProvider: myCredentialProvider
});

function myCredentialProvider() {
    return {
        // use wrangler secrets to provide these global variables
        accessKeyId: AwsAccessKeyId,
        secretAccessKey: AwsSecretAccessKey,
    }
}

/**
 * @param {Object} form
 * @param {Headers} headers
 * @return {Promise}
 */
async function sendMessage(form, headers) {
    if (!Object.keys(form).length) {
        return Promise.resolve();
    }

    let eventData = {
        timestamp: Date.now() / 1E3 | 0,
        ip: headers.get("Cf-Connecting-Ip"),
        referer: headers.get("Referer"),
        form: form,
    }

    return clientSqs.send(new SendMessageCommand({
        // use wrangler secrets to provide this global variable
        QueueUrl: AwsSqsQueueUrl,
        MessageBody: JSON.stringify(eventData),
    }));
}

const corsHeaders = {
    "Allow": "HEAD,POST,OPTIONS",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "HEAD,POST,OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
}

/**
 * @param {FetchEvent} event
 * @return {Promise<Response>}
 */
async function handleRequest (event) {
    if (event.request.method === 'POST') {
        let payload = await event.request.json()
        event.waitUntil(sendMessage(payload, event.request.headers))
    }

    return new Response(null, {
        headers: corsHeaders,
    })
}


addEventListener('fetch',   event => {
    event.respondWith(handleRequest(event))
})