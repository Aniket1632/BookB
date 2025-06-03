#!/bin/bash

# Get Servers List
set -f
string=$STAGING_SERVER
array=(${string//,/ })
echo $STAGING_SERVER
# Iterate
for i in "${!array[@]}"; do
    echo "****Deploying Project on Staging ******"
    if ssh root@${array[i]} 'whoami && 
    cd /root/barberly && pwd &&
    sudo git pull origin Production-V1 &&
    sudo npm install && 
    echo "DONE WITH BACKEND NPM INSTALL" &&
    cd /root/barberly/frontend &&
    sudo npm install --force && 
    echo "DONE WITH FRONTEND NPM INSTALL" &&
    sudo npm run build && 
    echo "DONE WITH BUILD" &&
    sudo cp -rv /root/barberly/frontend/build /root/barberly/backend/public &&
    echo "DONE WITH C/P" &&
    sudo pm2 restart all'; then
        curl -X POST -H 'Content-type: application/json' --data '{"text":"*BookB* has been deployed successfully(Staging) !:white_check_mark:"}' https://hooks.slack.com/services/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

    else
        curl -X POST -H 'Content-type: application/json' --data '{"text":"*BookB* has been thrown an error(Staging) !:x:"}' https://hooks.slack.com/services/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

    fi
done
