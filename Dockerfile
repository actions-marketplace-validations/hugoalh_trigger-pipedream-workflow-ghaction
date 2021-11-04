FROM node:lts-fermium
COPY package*.json /
RUN ["npm", "install", "--production"]
COPY main.js /
CMD ["node", "--no-warnings", "/main.js"]
