#using offiicial node image
FROM node:14.20.1-alpine

#to set the working directory 
WORKDIR /usr/src/app

#to copy package.json and package-lock.json
COPY package*.json ./

#to install dep
RUN npm install

#copy everything else from the app
COPY . .

#the port the be is running on
EXPOSE 3000

#to run be app
CMD [ "npm", "start" ]
