
# Employee Self-Assessment

This repository is an API used for an employee self-assessment application where an employee can assess another employee every 6 months.


## Run Locally

Clone the project

```bash
  git clone https://github.com/salassep/employee-self-assessment.git
```

Go to the project directory

```bash
  cd employee-self-assessment
```

Install dependencies

```bash
  npm install
```

Set the environment variables 

```bash
  touch .env
```

Go to the **src** directory

```bash
  cd src
```

Start the server

```bash
  npm run start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_USERNAME` (Database username)

`DB_PASSWORD` (Database password)

`HOST` (Database host)

`PORT` (Database port)

`JWT_KEY` (Key for the application to be used for authentication)

`REDIS_SERVER` (Redis server)

`EMAIL_USERNAME` (Email address)

`EMAIL_PASSWORD` (Email password. If using Gmail, use the password provided by Google for third-party access instead of the original password. Read more at https://support.google.com/mail/answer/185833?hl=en-GB.)




## Tech Stack

Node, Express, Redis.

