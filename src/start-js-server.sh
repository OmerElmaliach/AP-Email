#!/bin/bash
# DOCKER FOR RUNNING THE JAVASCRIPT SERVER.
DOCKERFILE="config/DockerJs"

# Build the image
docker build -f ${DOCKERFILE} -t docker-js .

# Run the docker with port 9000
docker run -p 9000:9000 docker-js

# Delete the image previously created.
docker image rm -f docker-js