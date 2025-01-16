#!/bin/bash

echo "command - npx tsc"
npx tsc

echo "command - aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 381491857310.dkr.ecr.us-west-2.amazonaws.com"
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 381491857310.dkr.ecr.us-west-2.amazonaws.com

echo "command - docker build --platform linux/amd64 --progress=plain -t scraper ."
docker build --platform linux/amd64 --progress=plain -t scraper .

echo "command - docker tag scraper:latest 381491857310.dkr.ecr.us-west-2.amazonaws.com/scraper:latest"
docker tag scraper:latest 381491857310.dkr.ecr.us-west-2.amazonaws.com/scraper:latest

echo "command - docker push 381491857310.dkr.ecr.us-west-2.amazonaws.com/scraper:latest"
docker push 381491857310.dkr.ecr.us-west-2.amazonaws.com/scraper:latest