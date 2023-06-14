const mockSend = jest.fn();
const mockSQSClient = jest.fn().mockImplementation(() => {
  return {
    send : mockSend
  }
})

const mockSendMessageCommand = jest.fn()

jest.mock("@aws-sdk/client-sqs", () => {
  return {
    SQSClient: mockSQSClient,
    SendMessageCommand: mockSendMessageCommand,
  };
});

/** @global addEventListener jest.Mock **/
global.addEventListener = jest.fn();
global.AwsRegion = 'test-region'
global.AwsAccessKeyId = 'test-access-key-id'
global.AwsSecretAccessKey = 'test-secret-key'
global.AwsSqsQueueUrl = "https://aws-sqs-queue-url/"

global.Response = jest.fn().mockImplementation(() => {

})

require('../worker/index')
const { SendMessageCommand } = require("@aws-sdk/client-sqs");

expect(addEventListener.mock?.lastCall[0]).toBe('fetch');
expect(typeof addEventListener.mock?.lastCall[1]).toBe("function")

const fetchEventListener = addEventListener.mock?.lastCall[1]
const actualSQSClientConfig = mockSQSClient.mock.lastCall ? mockSQSClient.mock.lastCall[0] : undefined

const expectedHeaders = {
  "Allow": "HEAD,POST,OPTIONS",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "HEAD,POST,OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Max-Age": "86400",
}

test('SQS_Client_construct', async () => {
  addEventListener.mockClear();

  expect(typeof actualSQSClientConfig).toBe('object')
  expect(actualSQSClientConfig).not.toBeNull()

  const actualConfig = actualSQSClientConfig || {}
  expect(actualConfig.region).toBe(AwsRegion)
  expect(actualConfig.credentialDefaultProvider).toBeInstanceOf(Function)

  const actualCredentials = actualConfig.credentialDefaultProvider();
  expect(typeof actualCredentials).toBe('object')
  expect(actualCredentials.accessKeyId).toBe(AwsAccessKeyId)
  expect(actualCredentials.secretAccessKey).toBe(AwsSecretAccessKey)
})


const doRequest = async function(request) {
  Response.mockClear()

  const event = {
    request: request,
    respondWith: jest.fn(),
    waitUntil: jest.fn(),
  }

  await fetchEventListener(event)

  if (event.waitUntil.mock.lastCall) {
    await event.waitUntil.mock.lastCall[0]
  }

  expect(Response.mock.instances).toHaveLength(1)
  expect(Response.mock.calls).toHaveLength(1)

  expect(Response.mock.lastCall[0]).toBe(null)
  expect(typeof Response.mock.lastCall[1]).toBe("object")
  expect(Response.mock.lastCall[1].headers).toStrictEqual(expectedHeaders)
}

test('addEventListener_HEAD_Request', async () => {
  const request = {
    method: "HEAD",
    url: "http://localhost/",
    headers: {}
  };
  await doRequest(request)
})

test('addEventListener_POST_empty_Request', async () => {
  const request = {
    method: "POST",
    url: "http://localhost/",
    headers: {},
    json: jest.fn().mockResolvedValue({}),
  };
  await doRequest(request)
})


test('addEventListener_POST_with_payload_Request', async () => {
  const currentTimestampInSeconds = 123999
  const currentTimestampInMilliSeconds = currentTimestampInSeconds * 1E3
  Date.now = jest.fn(() => currentTimestampInMilliSeconds)

  const form = {
    "hlf":"0",
    "prt":"188619",
    "prti":"999999",
    "action":"",
    "n":"4",
    "sesID":"99FED80A-2E33-40CB-9CEF-01E25B5AA66B",
    "d1":"09.09.2022",
    "course":"3",
    "m":"-1",
    "d2":"18.12.2022",
    "st110043_2-999999":"",
    "st110044_1-999999":"-11",
    "st110052_1-999999":"",
    "st110052_2-999999":"",
    "st118503_1-999999":"",
    "st110054_1-999999":"нб/нп",
    "st110054_2-999999":"",
    "st110059_2-999999":"",
    "AddEstim":"0",
  };

  const headers = {
    "Cf-Connecting-Ip": "127.10.10.10",
    "Referer": "http://dekanat/index.html",
  }
  headers.get = (key) => headers[key]

  const request = {
    method: "POST",
    url: "http://localhost/",
    headers: headers,
    json: jest.fn().mockResolvedValue(form),
  };
  await doRequest(request)

  // assert that `send` was called on client with instance of SendCommand
  expect(mockSend.mock.calls).toHaveLength(1)
  expect(mockSend.mock.lastCall[0]).toBe(mockSendMessageCommand.mock.instances[0])

  // assert tha expected payoload used to create SendCommand
  expect(mockSendMessageCommand.mock.calls).toHaveLength(1)
  expect(typeof mockSendMessageCommand.mock.lastCall[0]).toBe('object')

  const sendMessageCommandConfig = mockSendMessageCommand.mock.lastCall[0] || {}
  expect(sendMessageCommandConfig.QueueUrl).toBe(AwsSqsQueueUrl)

  const actualMessageBody = JSON.parse(sendMessageCommandConfig.MessageBody)
  expect(typeof actualMessageBody).toBe('object')
  expect(actualMessageBody.form).toStrictEqual(form)
  expect(actualMessageBody.ip).toBe(headers['Cf-Connecting-Ip'])
  expect(actualMessageBody.referer).toBe(headers['Referer'])
  expect(actualMessageBody.timestamp).toBe(currentTimestampInSeconds)
})