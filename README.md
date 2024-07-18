
# API

## Endpoints

### /search

#### GET
Supports a query parameter string 'q' containing either a restaurant name or address
e.g. 

```
GET /search?q=My+Awesome+Restaurant
    returns back details in response data body:
    {
        data: [
            {
                "name": "O'Connors",
                "address": "123 Main St.",
                "type": "Take Out",
                "status": "PASS",
                "severity": "",
                "details": "infraction details here",
                "date": "",
                "action": "",
                "outcome": "",
                "amt fined": ""
            },{

            }

        ]
    }
```
