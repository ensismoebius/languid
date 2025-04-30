#!/bin/bash
# This script sets up a Docker container with Apache, PHP, and the necessary libraries for running a C++ code testing environment.

# Update the package list and install Apache, PHP, and required PHP extensions
sudo apt update
sudo apt install -y apache2 php libapache2-mod-php php-mysql php-curl php-xml php-mbstring php-zip php-gd php-bcmath php-json

# Add the www-data user to the docker group to allow it to run Docker commands
sudo usermod -aG docker www-data

# Check if the -f flag is passed
FORCE_REBUILD=false
while getopts "f" opt; do
  case $opt in
    f)
      FORCE_REBUILD=true
      ;;
  esac
done

# Check if the Docker image already exists
if [[ $(sudo docker images -q sandbox) && $FORCE_REBUILD == false ]]; then
  echo "Docker image 'sandbox' already exists. Skipping build."
else
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

  # Clean up the Dockerfile
  rm Dockerfile
fi

# Prompt the user for database credentials
read -p "Enter the database host: " DB_HOST
read -p "Enter the database login: " DB_LOGIN
read -s -p "Enter the database password: " DB_PASSWORD

# Add a newline after password input for better formatting
echo

# Add MySQL database creation script
cat <<EOL > create_database.sql
CREATE DATABASE IF NOT EXISTS languid;
USE languid;

CREATE TABLE IF NOT EXISTS exercise (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    instructions TEXT NOT NULL,
    testFileName VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwdHash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_exercise (
    loginId INT NOT NULL,
    exerciseId INT NOT NULL,
    done BOOLEAN DEFAULT FALSE,
    code varchar(5000) NOT NULL,
    PRIMARY KEY (loginId, exerciseId),
    FOREIGN KEY (loginId) REFERENCES user(id),
    FOREIGN KEY (exerciseId) REFERENCES exercise(id)
);
EOL

# Execute the SQL script to create the database and tables
mysql -h "$DB_HOST" -u "$DB_LOGIN" -p"$DB_PASSWORD" < create_database.sql

# Clean up the SQL script
rm create_database.sql

# Add a default user to the user table
cat <<EOL > insert_default_user.sql
USE languid;

INSERT INTO user (email, passwdHash) VALUES ('test', MD5('1234'));
EOL

# Execute the SQL script to insert the default user
mysql -h "$DB_HOST" -u "$DB_LOGIN" -p"$DB_PASSWORD" < insert_default_user.sql

# Clean up the SQL script
rm insert_default_user.sql
