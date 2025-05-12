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

# Run and create a docker with port 8085 as argument, 16 2 5 as bloom filter settings
docker run -it --network=host -v "${prev_pwd}/data:/Ap_Email/data docker-server" 8085 16 2 5

# Delete the image previously created.
docker image rm -f docker-server