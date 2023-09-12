[![Release](https://github.com/kneu-messenger-pigeon/realtime-changes-event-sender/actions/workflows/release.yaml/badge.svg)](https://github.com/kneu-messenger-pigeon/realtime-changes-event-sender/actions/workflows/release.yaml)
[![codecov](https://codecov.io/gh/kneu-messenger-pigeon/realtime-changes-event-sender/branch/main/graph/badge.svg?token=3XFR44LX9B)](https://codecov.io/gh/kneu-messenger-pigeon/realtime-changes-event-sender)


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
