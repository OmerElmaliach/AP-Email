#!/bin/bash
# DOCKER FOR RUNNING THE CLIENT.
DOCKERFILE="config/DockerClient"

# Build the image
docker build -f ${DOCKERFILE} -t docker-client .

# Run the docker with ip and port as arguments, -it for allowing client input, --network=host to access local host outside docker.
docker run -it --network=host docker-client 127.0.0.1 8080

# Delete the image previously created.
docker image rm -f docker-client