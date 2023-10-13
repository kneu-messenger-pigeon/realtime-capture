const eventEndpoint = "https://{WORKER_HOST}/";

const readFile = require('fs/promises').readFile;
require('jest-fetch-mock').enableMocks();

/* mock MutationObserver */
const GetMutationObserverMock = function () {
   function MutationObserverMock (callback) {
        MutationObserverMock.lastInstance = this;
        this.callback = callback;
    }

    MutationObserverMock.prototype.observe = (target) => {
        MutationObserverMock.lastTarget = target;
    }
    MutationObserverMock.prototype.disconnect = () => {}

    return MutationObserverMock;
}


/* end mock of MutationObserver */
test('Edit scores', async () => {
    let expectedPost = {
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
        "st110030_1-999999":"",
        "st110030_2-999999":"3",
        "st118514_1-999999":"",
        "st118514_2-999999":"",
        "st110033_1-999999":"",
        "st110033_2-999999":"",
        "st110034_1-999999":"",
        "st110034_2-999999":"",
        "st110035_1-999999":"",
        "st110035_2-999999":"",
        "st110036_1-999999":"",
        "st110036_2-999999":"",
        "st110037_1-999999":"",
        "st110037_2-999999":"",
        "st110038_1-999999":"",
        "st110038_2-999999":"",
        "st110039_1-999999":"",
        "st110039_2-999999":"",
        "st110040_1-999999":"",
        "st110040_2-999999":"",
        "st110041_1-999999":"",
        "st110041_2-999999":"",
        "st110042_1-999999":"",
        "st110042_2-999999":"",
        "st110043_1-999999":"",
        "st110043_2-999999":"",
        "st110044_1-999999":"-11",
        "st110044_2-999999":"",
        "st110046_1-999999":"",
        "st110046_2-999999":"",
        "st110047_1-999999":"",
        "st110047_2-999999":"",
        "st110048_1-999999":"",
        "st110048_2-999999":"",
        "st110050_1-999999":"",
        "st110050_2-999999":"",
        "st110051_1-999999":"",
        "st110051_2-999999":"",
        "st110052_1-999999":"",
        "st110052_2-999999":"",
        "st118503_1-999999":"",
        "st118503_2-999999":"",
        "st110053_1-999999":"",
        "st110053_2-999999":"",
        "st118578_1-999999":"",
        "st118578_2-999999":"",
        "st110054_1-999999":"нб/нп",
        "st110054_2-999999":"",
        "st110055_1-999999":"",
        "st110055_2-999999":"",
        "st110056_1-999999":"",
        "st110056_2-999999":"",
        "st110057_1-999999":"",
        "st110057_2-999999":"",
        "st110058_1-999999":"",
        "st110058_2-999999":"",
        "st110682_1-999999":"",
        "st110682_2-999999":"",
        "st110059_1-999999":"",
        "st110059_2-999999":"",
        "AddEstim":"0",
    };

    // base HTML of page
    document.body.innerHTML = await readFile(__dirname +  "/html/edit-scores.html", {encoding:'utf8'});
    document.body.querySelector('form').submit = () => {}

    // connect lib
    fetch.mockResponse(null);
    document.addEventListener = jest.fn()
    window.$ = global.$ = window.jQuery = global.jQuery = require('jquery')
    require("../src/capture.js");

    document.querySelector('[name="st110030_2-999999"]').value = "3";

    expect(fetch).toHaveBeenLastCalledWith(eventEndpoint, {
        method: "HEAD",
        cache: "no-cache",
        credentials: "omit",
        mode: "no-cors",
    });

    // emulate click on button and check that Lib send event to endpoint
    document.querySelector('[type=submit]').dispatchEvent(new MouseEvent('click'));

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenLastCalledWith(eventEndpoint, {
        method: "POST",
        body: JSON.stringify(expectedPost),
        headers: {
            "Content-Type": "application/json",
            "X-Has-Changes": "1",
        },
        cache: "no-cache",
        credentials: "omit",
        keepalive: true,
        mode: "no-cors",
    });
});


/* end mock of MutationObserver */
test('Create lesson', async () => {
    let expectedPost = {
        "hlf":"0",
        "prt":"193000",
        "prti":"0",
        "teacher":"9999",
        "action":"insert",
        "n":"10",
        "sesID":"00AB0000-0000-0000-0000-000CD0000AA0",
        "m":"-1",
        "date_z":"23.12.2022",
        "tzn":"1",
        "result":"3",
        "grade":""
    };

    // base HTML of page
    document.body.innerHTML = await readFile(__dirname +  "/html/create-lesson-form.html", {encoding:'utf8'});
    document.body.querySelector('form').submit = () => {}

    // connect lib
    fetch.mockResponse(null);
    document.addEventListener = jest.fn()
    window.$ = window.jQuery = global.$ = require('jquery')
    require(__dirname + "/html/lesson-form.js");
    require("../src/capture.js");

    window.dispatchEvent(new PageTransitionEvent('pageshow', {
        persisted: true,
    }))

    expect(fetch).toHaveBeenLastCalledWith(eventEndpoint, {
        method: "HEAD",
        cache: "no-cache",
        credentials: "omit",
        mode: "no-cors",
    });

    // emulate click on button and check that Lib send event to endpoint
    let buttons = document.querySelectorAll('button');
    let button = buttons[buttons.length - 2];
    button.dispatchEvent(new MouseEvent('click'));

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenLastCalledWith(eventEndpoint, {
        method: "POST",
        body: JSON.stringify(expectedPost),
        headers: {
            "Content-Type": "application/json",
            "X-Has-Changes": "0",
        },
        cache: "no-cache",
        credentials: "omit",
        keepalive: true,
        mode: "no-cors",
    });
});

/* end mock of MutationObserver */
test('Edit lesson', async () => {
    let expectedPost = {
        "hlf":"0",
        "prt":"193000",
        "prti":"999999",
        "teacher":"9999",
        "action":"edit",
        "n":"10",
        "sesID":"00AB0000-0000-0000-0000-000CD0000AA0",
        "m":"-1",
        "date_z":"12.12.2022",
        "tzn":"1",
        "result":"",
        "grade":"2"
    };

    // base HTML of page
    document.body.innerHTML = await readFile(__dirname +  "/html/edit-lesson-form.html", {encoding:'utf8'});
    document.body.querySelector('form').submit = () => {}

    // connect lib
    fetch.mockResponse(null);
    document.addEventListener = jest.fn()
    window.$ = window.jQuery = global.$ = require('jquery')
    require(__dirname + "/html/lesson-form.js");
    require("../src/capture.js");

    expect(fetch).toHaveBeenLastCalledWith(eventEndpoint, {
        method: "HEAD",
        cache: "no-cache",
        credentials: "omit",
        mode: "no-cors",
    });

    // emulate click on button and check that Lib send event to endpoint
    let buttons = document.querySelectorAll('button');
    let button = buttons[buttons.length - 1];
    button.dispatchEvent(new MouseEvent('click'));

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenLastCalledWith(eventEndpoint, {
        method: "POST",
        body: JSON.stringify(expectedPost),
        headers: {
            "Content-Type": "application/json",
            "X-Has-Changes": "0",
        },
        cache: "no-cache",
        credentials: "omit",
        keepalive: true,
        mode: "no-cors",
    });
});

test('Delete lesson', async () => {
    let expectedPost = {
        "sesID":"00AB0000-0000-0000-0000-000CD0000AA0",
        "n":"11",
        "action":"delete",
        "prti":"999999",
        "prt":"193000",
        "d1":"",
        "d2":"",
        "m":"-1",
        "hlf":"0",
        "course":"undefined",
    };

        // base HTML of page
    document.body.innerHTML = await readFile(__dirname +  "/html/delete-lesson-link.html", {encoding:'utf8'});

    // connect lib
    fetch.mockResponse(null);
    window.$ = require('jquery')
    window.MutationObserver = global.MutationObserver = GetMutationObserverMock()
    document.addEventListener = jest.fn()
    require("../src/capture.js");

    global.MutationObserver.lastInstance.callback([
        {
            type: "childList",
            target: global.MutationObserver.lastTarget,
            addedNodes: [global.MutationObserver.lastTarget.childNodes[0]],
            removedNodes: [],
        }
    ])

    expect(fetch).toHaveBeenLastCalledWith(eventEndpoint, {
        method: "HEAD",
        cache: "no-cache",
        credentials: "omit",
        mode: "no-cors",
    });

    global.confirm = function () {
        return true;
    }
    document.querySelector('#delzn').dispatchEvent(new MouseEvent('click'));

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenLastCalledWith(eventEndpoint, {
        method: "POST",
        body: JSON.stringify(expectedPost),
        headers: {
            "Content-Type": "application/json",
            "X-Has-Changes": "1",
        },
        cache: "no-cache",
        credentials: "omit",
        keepalive: true,
        mode: "no-cors",
    });
});




test('Load libs', async () => {
    delete window.FormData;
    delete window.URLSearchParams

    require("../src/capture.js");

    let scripts = document.head.querySelectorAll('script')
    let srcList = [];
    expect(scripts.length).toEqual(2);

    scripts.forEach((s) => srcList.push(s.getAttribute('src')))
    srcList.sort();

    expect(srcList).toEqual([
        'https://cdn.jsdelivr.net/npm/@ungap/url-search-params/min.js',
        'https://cdn.jsdelivr.net/npm/formdata-polyfill@4.0.10/formdata.min.js',
    ]);

    fetch.mockResponse(null);
    let documentAddEventListenerMock = jest.fn()
    document.addEventListener = documentAddEventListenerMock

    expect(scripts[0].dispatchEvent(new Event('load'))).toBeTruthy();
    expect(documentAddEventListenerMock).not.toHaveBeenCalled()

    expect(scripts[1].dispatchEvent(new Event('error'))).toBeTruthy();
    expect(documentAddEventListenerMock).toHaveBeenCalledTimes(1);
});
