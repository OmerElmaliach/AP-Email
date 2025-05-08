#!/bin/bash
# DOCKER FOR RUNNING THE SERVER
DOCKERFILE="config/DockerServer"

# Build the image
docker build -f ${DOCKERFILE} -t docker-server .

# Create a directory outside of src named data if doesnt exist.
cd ..
prev_pwd=$(pwd)
mkdir -p ./data
cd src

# Run and create a volume for data storage.
docker run -it -v "${prev_pwd}/data:/Ap_Email/data" docker-server

# Delete the image previously created.
docker image rm -f docker-server