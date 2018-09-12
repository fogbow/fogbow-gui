FROM node:8.11.4-jessie

RUN \
  sed -i 's/# \(.*multiverse$\)/\1/g' /etc/apt/sources.list && \
  apt-get update -y && \
  apt-get upgrade -y && \
  apt-get install -y byobu curl git htop man unzip vim nano wget && \
  apt-get install -y net-tools iputils-ping

RUN git clone https://github.com/fogbow/fogbow-gui.git

WORKDIR fogbow-gui

RUN git checkout new-release

RUN npm i

CMD npm start && tail -f /dev/null
