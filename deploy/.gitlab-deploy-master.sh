#!/bin/bash

# Get Servers List
set -f
string=$PRODUCTION_SERVER
array=(${string//,/ })
echo $PRODUCTION_SERVER
# Iterate
for i in "${!array[@]}"; do
    echo "****Deploying Project on Master ******"
    if ssh root@${array[i]} 'whoami && 
    cd /BookB-Dashboard && pwd &&
    sudo git pull origin master && 
    sudo npm install && 
    cd frontend && 
    sudo npm install && 
    sudo npm run build && 
    echo "DONE WITH BUILD" &&
    sudo cp -rv /BookB-Dashboard/frontend/build /BookB-Dashboard/backend/public &&
    echo "DONE WITH C/P" &&
    sudo cp -rv /BookB-Dashboard/backend/jwt-connector  /BookB-Dashboard/node_modules/jwt-connector && 
    sudo pm2 restart all'; then
        curl -X POST -H 'Content-type: application/json' --data '{"text":"*BookB* has been deployed successfully (Production)!:white_check_mark:"}' https://hooks.slack.com/services/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

    else
        curl -X POST -H 'Content-type: application/json' --data '{"text":"*BookB* has been thrown an error (Production) !:x:"}' https://hooks.slack.com/services/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

    fi
done

