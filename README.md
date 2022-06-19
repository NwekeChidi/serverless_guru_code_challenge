<!--
title: 'Serverless Guru Code Challenge'
description: 'This project demonstrates how to develop and deploy a simple Node Express AWS API GATEWAY CRUD REST API service backed by DynamoDB running on AWS Lambda using the traditional Serverless Framework with emulation for localhost.'
layout: Doc
framework: v3
platform: AWS
language: nodeJS
priority: 1
authorLink: 'https://github.com/NwekeChidi'
authorName: 'Serverless, inc.'
-->
# Serverless Guru Code Challenge
This project demonstrates how to develop and deploy a simple Node Express AWS API GATEWAY CRUD REST API service backed by DynamoDB running on AWS Lambda using the traditional Serverless Framework with emulation for localhost. 
Full challenge descriptions [here](https://github.com/serverless-guru/code-challenges/blob/master/code-challenge-5/README.md)

## Anatomy of Project

This project (while leveraging the [Serverless Framework Node Express API service backed by DynamoDB on AWS Template](https://github.com/serverless/examples/tree/v3/aws-node-express-dynamodb-api)) and Infrastrastructure as Code which is provisioned by [AWS Cloud Formation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html), and automated multi-stage CI/CD pipeline for "production" and "development" (unit testing included), configures CRUD functions, `api`, which is responsible for handling all incoming requests thanks to the [httpApi event](https://www.serverless.com/framework/docs/providers/aws/events/http-api/) and [`serverless-http`](https://github.com/dougmoscrop/serverless-http) package, which allows you to wrap existing `express` applications and also handles provisioning of a DynamoDB database that is used for storing data. The `express` application exposes five main endpoints which are invoked through the AWS API Gateway, `POST /users/new` to create users,  `POST /posts/new` to create blog posts, `GET /posts/view/{id}`, to retrieve psots, `PATCH /posts/update/{id}` to update/edit posts, and `DELETE /posts/delete/{id}` to delete post.

## Usage

### Deployment
> Fork the repository and clone to your local machine.

Install dependencies with:

```bash
npm install
```

> Set up your IAM Role on AWS with permissions for lambda, cloudwatch logs, cloudformation, dynamodb, and api gateway. Save the secrets to your repo. This allows you to leverage AWS IAC through cloud formation to create the required services on deployment.

In the `serverless.yml` file, replace the value for `role` with the `arn` of the role you created.
```yml
role: arn:aws:iam::role: arn:aws:iam::xxxxxxxxx:role/role-name
```
and then deploy with:

```bash
serverless deploy
```

> For CI/CD
It is recommended to create multiple roles on aws where different environment should live. Then in the `.github/workflows/main.yml` file, replace the code below with the environmental variables for the IAM production secrets:
```yml
AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID_PROD }}
AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY_PROD }}
```

Do the same for the `.github/workflows/dev.yml` file.

### Invocation

After successful deployment, you can create a new user by calling the corresponding endpoint:
#### Create User
```bash
curl -H "Content-Type: application/json" -X POST -d "{\"name\": \"John Cannon\"}" https://xxxxxxxxxx.execute-api.us-west-1.amazonaws.com/users/new
```


Which should result in the following response:

```bash
{"status":"success","data":{"name":"John Cannon","PK":"6cd0ca3a-a8ae-47d8-8fbf-13a2dc56d12f","SK":"user"}}
```
__NB:__  The `xxxxxxxxxx` in the cURL request above will be replaced by the actual values in your api gateway arn.

#### Create Post

```bash
curl -H "Content-Type: application/json" -X POST -d "{\"title\": \"title\", \"feature\": \"feature\", \"post\": \"some random post\"}" https://xxxxxxxxxx.execute-api.us-west-1.amazonaws.com/posts/new/some-userId
```

Which should result in the following response:

```bash
{"status":"success","data":{"title":"title","feature":"feature","post":"some random post","blogger":{"SK":"user","PK":"some-userId","name":"John Cannon"},"PK":"9aaf8e26-cc7d-42f6-9ded-cced07c2bf06","SK":"blog"}}
```

If you try to create a post with a wrong userId, you should receive the following response:

```bash
{"status":"failed","error":"Could not find item with provided \"id\""}
```

#### Retrieve Post
```bash
curl -H "Content-Type: application/json" -X GET https://xxxxxxxxxx.execute-api.us-west-1.amazonaws.com/posts/view/some-postId
```
the response should be:
```bash
{"status":"success","item":{"post":"some random post","feature":"feature","SK":"blog","blogger":{"SK":"user","name":"John Cannon","PK":"some-userId"},"PK":"some-postId","title":"title"}}
``` 

#### Update/Edit Post
```bash
curl -H "Content-Type: application/json" -X PATCH -d "{\"tag\":\"tag\", \"post\": \"some random post edited\"}" https://xxxxxxxxx.execute-api.us-west-1.amazonaws.com/posts/update/some-postId
```
Which should result in the following response:
```bash
{"status":"success","message":{"message":"Update Successful"}}
```

#### Delete Post
```bash
curl -H "Content-Type: application/json" -X DELETE  https://xxxxxxxxxx.execute-api.us-west-1.amazonaws.com/posts/delete/some-postId
```

The response on successful delete should be:
```bash
{"status":"success","message":{"message":"Delete Successful"}}
```

### Local Deployment

Running any of the following commands will deploy the project on the local machine
```bash
serverless offline start
sls offline start
```

### Postman Documentation
View link to postman documentation [here](https://documenter.getpostman.com/view/19837110/UzBmMSfv)