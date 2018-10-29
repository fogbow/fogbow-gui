FROM node:8.11.4-jessie

RUN \
  sed -i 's/# \(.*multiverse$\)/\1/g' /etc/apt/sources.list && \
  apt-get update -y && \
  apt-get upgrade -y && \
  apt-get install -y byobu curl git htop man unzip vim nano wget && \
  apt-get install -y net-tools iputils-ping

RUN git clone https://github.com/fogbow/fogbow-gui.git

# Generates the build number based on the commit checksum
# Commenting this out as per Fubica's request
# RUN (build_number=$(git rev-parse --short 'HEAD') && echo "build_number=$build_number" > build)

WORKDIR fogbow-gui

RUN npm i

CMD npm start || tail -f /dev/null
