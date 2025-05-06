#!/bin/bash
# DOCKER FOR TESTS
DOCKERFILE="config/DockerTest"

docker build -f ${DOCKERFILE} -t docker-test .
docker run docker-test
docker image rm -f docker-test