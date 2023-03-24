# abac-test-app

Sample connected app for ABAC/UAF testing.


## Installing dependencies

After cloning the repo, install dependencies by running:

```
npm install
```

## Running the application

Update the connected app config in file `config/default.json`, e.g.:
```
{
    "secret_id": "31da790f-a682-4922-9257-2af2fd64a408",
    "secret_value": "wD7JEu7l7jZOHh69p/onGODtNcuo/qAJPBic+F3um9U=",
    "client_id": "fa04c0c6-0de3-4468-b6aa-0bb02cb156d9"
}
```

And then launch the app:
```
node main.js
```