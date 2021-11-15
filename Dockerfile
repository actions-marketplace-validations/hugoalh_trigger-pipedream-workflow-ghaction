FROM node:lts-fermium
COPY package*.json /
RUN ["npm", "ci"]
COPY main.js /
CMD ["node", "/main.js"]
