#!/bin/bash
# This script sets up a Docker container with Apache, PHP, and the necessary libraries for running a C++ code testing environment.

# Update the package list and install Apache, PHP, and required PHP extensions
sudo apt update
sudo apt install -y apache2 php libapache2-mod-php php-mysql php-curl php-xml php-mbstring php-zip php-gd php-bcmath php-json

# Add the www-data user to the docker group to allow it to run Docker commands
sudo usermod -aG docker www-data

# Create a Dockerfile for the container
touch Dockerfile
cat <<EOL > Dockerfile
FROM ubuntu:latest
RUN apt-get update && apt-get install -y g++ cmake libgtest-dev && \
    cd /usr/src/gtest && \
    cmake . && \
    make && \
    mkdir -p /usr/lib/gtest && \
    cp lib/*.a /usr/lib/gtest
CMD ["/bin/bash"]
EOL

# Build the Docker image
sudo docker build -t sandbox .

# Run the Docker container
sudo docker run -d --name sandbox -p 8080:80 sandbox

# Ensure Docker permissions are correct
if ! groups | grep -q '\bdocker\b'; then
  echo "You need to log out and log back in for Docker group changes to take effect."
fi

rm Dockerfile
# End of script
