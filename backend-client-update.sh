#!/bin/bash

WORK_DIR=/srv/linetracer-counter
TMP_DIR=${WORK_DIR}/_tmp/backend-client
BUILD_DIR=${WORK_DIR}/build/backend-client

cd      ${WORK_DIR}                                                         &&
sudo    rm -rf ${WORK_DIR}/_tmp                                             &&
sudo    git clone https://github.com/j93es/linetracer-counter.git _tmp      && 
sudo    rm -rf ${BUILD_DIR}/*                                               &&
sudo    cp -r   ${TMP_DIR}/*    ${BUILD_DIR}                                &&
sudo    cp ${WORK_DIR}/env/backend-client-env ${BUILD_DIR}/.env             &&
cd      ${BUILD_DIR}                                                        &&
sudo    npm install                                                         && 
sudo    npm run build                                                       && 
sudo    pm2 stop linetracer-counter-backend-client                          ;
sudo    pm2 delete linetracer-counter-backend-client                        ;
sudo    pm2 start ecosystem.config.js                                       &&
sudo    pm2 save                                                            &&
sudo    pm2 startup                                                         &&
sudo    rm -rf ${WORK_DIR}/_tmp                                             &&
sudo    systemctl restart nginx