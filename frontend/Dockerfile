# pull the official base image
FROM node:alpine

EXPOSE 3000

# set working direction
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
ENV REACT_APP_API_BASE_URL https://hack-cancer.azurewebsites.net
#ENV REACT_APP_API_BASE_URL http://localhost:8080
# install application dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm i
# add app
COPY . ./
# start app
CMD ["npm", "start"]