#!/bin/bash
# Script to create a new user in the languid database

read -p "Enter the database host: " DB_HOST
read -p "Enter the database login: " DB_LOGIN
read -s -p "Enter the database password: " DB_PASSWORD

echo
read -p "Enter the user's email: " EMAIL
read -s -p "Enter the user's password: " PASSWORD

echo
read -p "Is this user an admin? (y/N): " IS_ADMIN
read -p "Enter the group ID for this user: " GROUP_ID

# Hash the password using MD5
PASS_HASH=$(echo -n "$PASSWORD" | md5sum | awk '{print $1}')

# Set admin flag
if [[ "$IS_ADMIN" =~ ^[Yy]$ ]]; then
    ADMIN=1
else
    ADMIN=0
fi

cat <<EOL > insert_new_user.sql
USE languid;
INSERT INTO user (email, passwdHash, admin, groupId) VALUES ('$EMAIL', '$PASS_HASH', $ADMIN, $GROUP_ID);
EOL

mysql -h "$DB_HOST" -u "$DB_LOGIN" -p"$DB_PASSWORD" < insert_new_user.sql

rm insert_new_user.sql

echo "User $EMAIL created successfully."
