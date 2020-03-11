from koderlabs/node-build:latest

WORKDIR /opt/dbbackup

RUN apt-get clean 
RUN apt-get update && apt-get install -y lsb-release && apt-get clean all
RUN apt install -y mysql-client

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4

RUN echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/4.0 main" | tee /etc/apt/sources.list.d/mongodb-org-4.0.list
RUN  apt-get update

RUN  apt-get install -y mongodb-org-tools

RUN apt install -y redis-tools
RUN apt install -y zip

RUN npm -v

RUN node -v

RUN npm install

RUN which npm
RUN which node 
CMD [ "/usr/local/bin/npm","run","boot"]
