#!/bin/bash
# mongoDB and Redis setup

check_mongoDB_installed() {
    echo "Check if mongoDB installed."

    if [[ ( ! -f "`which mongod`" ) ]]
    then
        
        curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
            sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
            --dearmor
        echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] \
            https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | \
            sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
        sudo apt update
        sudo apt install -y mongodb-org
    fi

    if [ -f "`which mongod`" ]; then
        echo "mongoDB is ready ✅"
    else
        echo "mongoDB install failed ❌, please install it manually."
    fi
}

check_redis_installed() {
    echo "Check if Redis installed."

    if [[ ( ! -f "`which redis-server`" ) ]]
    then
        sudo add-apt-repository ppa:redislabs/redis -y
        sudo apt update
        sudo apt install -y redis
    fi

    if [ -f "`which redis-server`" ]; then
        echo "Redis is ready ✅"
    else
        echo "Redis install failed ❌, please install it manually."
    fi
}

echo "Prepare mongoDB and Redis ..."

echo "1>. Create install.tmp folder."
[ -d "./install.tmp" ] || mkdir install.tmp

echo "2>. Install build tools ..."
cd install.tmp
sudo apt update
sudo apt install -y gnupg curl
check_mongoDB_installed
check_redis_installed

echo "3>. Cleanup install.tmp folder."
cd ..
[ -d "./install.tmp" ] && rm -rf install.tmp
echo "mongoDB and Redis is setup successfully. 💯"