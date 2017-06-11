# URL Shortener Microservice

This simple API was created as part of Free Code Camp's curriculum.

## Getting Started

Give it a try [here](https://shorturl-fcc-km.herokuapp.com).

### User Stories

1. I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
2. If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.
3. When I visit that shortened URL, it will redirect me to my original link.

### Example Creation

#### Input
```
https://shorturl-fcc-km..herokuapp.com/new/https://www.google.com
https://shorturl-fcc-km..herokuapp.com/new/https://youtube.com
```

#### Output
```
{ "original_url":"https://www.youtube.com", "short_url":"https://shorturl-fcc-km.herokuapp.com/6464" }
```

### Example Usage

#### Usage
```
https://shorturl-fcc-km.herokuapp.com/6464
```

#### Will Redirect User To

```
https://www.youtube.com
```
