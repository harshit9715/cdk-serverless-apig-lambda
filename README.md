# CDK Serverless sample app

![Stage build status](https://github.com/harshit9715/cdk-serverless-apig-lambda/actions/workflows/CICD.yml/badge.svg "GitHub Actions Build Status")
![Production build status](https://github.com/harshit9715/cdk-serverless-apig-lambda/actions/workflows/main.yml/badge.svg "GitHub Actions Build Status")

## Install CDK

```bash
npm i -g aws-cdk
```

## Configure environment

Don't forget to configure environment variable through a .env file and create variable refrences in config.ts file.

## Setup and run

```bash
npm i
npm run build
cdk synth
cdk bootstrap # (connect account-region to app)
cdk deploy

# Destroy stack
cdk destroy
```
