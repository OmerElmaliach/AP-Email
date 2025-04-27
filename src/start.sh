#!/bin/bash
# DOCKER FOR RUNNING MAIN
DOCKERFILE="DockerMain"

docker build -f ${DOCKERFILE} -t docker-main .
docker run docker-main
docker image rm -f docker-main