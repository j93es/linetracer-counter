#!/bin/bash

WORK_DIR=/srv/linetracer-counter
TMP_DIR=${WORK_DIR}/_tmp/frontend-client
BUILD_DIR=${WORK_DIR}/build/frontend-client

cd      ${WORK_DIR}                                                         &&
sudo    rm -rf ${WORK_DIR}/_tmp                                             &&
sudo    git clone https://github.com/j93es/linetracer-counter.git _tmp      && 
cd      ${TMP_DIR}                                                          &&
sudo    cp ${WORK_DIR}/env/frontend-client-env ${TMP_DIR}/.env               &&
sudo    npm install                                                         && 
sudo    npm run build                                                       && 
sudo    rm -rf ${BUILD_DIR}/*                                               &&
sudo    mv ${TMP_DIR}/build/* ${BUILD_DIR}                                  &&
sudo    rm -rf ${WORK_DIR}/_tmp                                             &&
sudo    systemctl restart nginx