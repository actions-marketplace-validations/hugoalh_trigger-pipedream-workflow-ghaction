FROM node:lts-gallium
COPY main.js package-lock.json package.json /opt/hugoalh/trigger-pipedream-workflow-ghaction/
WORKDIR /opt/hugoalh/trigger-pipedream-workflow-ghaction/
RUN ["npm", "ci"]
WORKDIR /
CMD ["node", "/opt/hugoalh/trigger-pipedream-workflow-ghaction/main.js"]
