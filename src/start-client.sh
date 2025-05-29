#!/bin/bash
# DOCKER FOR RUNNING THE CLIENT.
DOCKERFILE="config/DockerClient"

# Build the image (suppress output)
docker build -f ${DOCKERFILE} -t docker-client . > /dev/null 2>&1

# Run the docker with ip and port as arguments, -i for allowing client input, --network=host to access local host outside docker.
docker run -i --network=host docker-client 127.0.0.1 8091

# Delete the image previously created (suppress output)
docker image rm -f docker-client > /dev/null 2>&1