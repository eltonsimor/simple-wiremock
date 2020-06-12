# SIMPLE WIREMOCK
---

### Summary

This project was created to help with tests mocking Rest API from Backend.

### Instructions to setup the project

To use the package you need execute the command:

```bash
npm i -D simple-wiremock
``` 

### Importing and using it

After installed the package, above following the slice example code:

```typescript
import { SimpleWiremock } from 'simple-wiremock'

const should = require('should');
const request = require('request');

describe((TestComponent) => {
    let simpleWiremock: SimpleWiremock;

    beforeAll(() => {
        simpleWiremock = new SimpleWiremock().start();
        simpleWiremock.get('/users/1', {
            status: 200,
            headers: { 'Content-Type': 'applications/json' },
            body: {
                name: 'Austin Power',
                age: 40
            }
        });
    });

    it(() => {
        request('http://localhost:5001/users/1', (err, res, body) =>{
            should.not.exist(err);
            should.exist(res);
            JSON.parse(body).should.containDeep({ name: 'Austin Power', age: 40 });
            done();
        });
    });

    afterAll(() => {
        simpleWiremock.stop();
    });
});
```

> By default SimpleWiremock stay listening at **port 5001**

> This SimpleWiremock has following methods:
> [
>   GET (simpleWiremock.get(url, object)), 
>   POST (simpleWiremock.post(url, object)), 
>   PUT (simpleWiremock.put(url, object)), 
>   PATCH (simpleWiremock.patch(url, object)), 
>   OPTIONS (simpleWiremock.options(url, object)), 
>   HEAD (simpleWiremock.head(url, object))
>   DELETE (simpleWiremock.delete(url, object))
> ]

#### The example object response used to response:
```javascript
    {
        status: number,
        headers: { '<Key>': 'value' },
        body: your object response.
    }
```

> body accept a object and list.

#### Example mock returning a list:

```javascript
simpleWiremock.get('/users', {
    status: 200,
    headers: { 'Content-Type': 'applications/json' },
    body: [
        {
            name: 'Austin Power',
            age: 40
        },
        {
            name: 'Ana Clara',
            age: 28
        }
    ]
});
```

#### Example with another http methods

- Using **HTTP POST**
```javascript
simpleWiremock.post('/users', {
    status: 201,
    headers: { 'Content-Type': 'applications/json' },
    body:{
        name: 'Austin Power',
        age: 40
    }
});
```

- Using **HTTP PATCH**
```javascript
simpleWiremock.patch('/users', {
    status: 202,
    headers: { 'Content-Type': 'applications/json' },
    body:{
        name: 'Austin Power',
        age: 40
    }
});
```

- Using **HTTP DELETE**
```javascript
simpleWiremock.delete('/users/1', {
    status: 202,
    headers: { 'Content-Type': 'applications/json' },
    body:{}
});
```

- Using **HTTP OPTIONS**
```javascript
simpleWiremock.options('/users/1', {
    status: 204,
    headers: {},
    body:{}
});
```

> When We don't send the headers, the SimpleWiremock always return Content-Type = application/json.

### How to start the SimpleWiremock in specific port?

```typescript
    
    beforeAll(() => {
        simpleWiremock = new SimpleWiremock().setPort(5002).start();
        simpleWiremock.get('/users/1', {
            status: 200,
            headers: { 'Content-Type': 'applications/json' },
            body: {
                name: 'Austin Power',
                age: 40
            }
        });
    });

    ...
```

> OBS: We always need to stop the server after our tests.