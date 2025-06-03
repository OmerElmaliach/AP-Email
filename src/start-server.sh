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

# Run and create a docker with port 8091 as argument, 32 2 5 as bloom filter settings
# changed from -it --nwork=host to -p 8091:8091 for port mapping because i'm running on windows
docker run -it -p 8091:8091 -v "${prev_pwd}/data:/Ap_Email/data" docker-server 8091 32 2 5

# Delete the image previously created.
docker image rm -f docker-server