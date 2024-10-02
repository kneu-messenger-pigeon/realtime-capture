[![Release](https://github.com/kneu-messenger-pigeon/realtime-changes-event-sender/actions/workflows/release.yaml/badge.svg)](https://github.com/kneu-messenger-pigeon/realtime-changes-event-sender/actions/workflows/release.yaml)
[![codecov](https://codecov.io/gh/kneu-messenger-pigeon/realtime-capture/graph/badge.svg?token=3XFR44LX9B)](https://codecov.io/gh/kneu-messenger-pigeon/realtime-capture)

## Inject example
```javascript
document.head.append(
    Object.assign(
        document.createElement("script"),
        {
          src: "https://dekanat.pp.ua/prod/capture.js",
          async: true,
        }
    )
);

```

one line: 
```javascript
document.head.append(Object.assign(document.createElement("script"),{src:"https://dekanat.pp.ua/prod/capture.js",async:true}));
```

## Quality and reliability assurance
Provided by:
 - [Healthcheck](https://healthchecks.io/) which periodically ping Dekanat system to ensure that injection script still installed
 - [realtime-capture-browser-integration-tests](https://github.com/kneu-messenger-pigeon/realtime-capture-browser-integration-tests/) - browser automatically based tests which ensure that injection script  wroks well and captrue events from Teacher (instructor) actions
