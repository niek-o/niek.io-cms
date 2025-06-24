# it's a good idea to pin this, but for demo purposes we'll leave it as is
FROM node:22 AS builder

# automatically creates the dir and sets it as the current working dir
WORKDIR /usr/src/app
# this will allow us to run vite and other tools directly
ENV PATH /usr/src/node_modules/.bin:$PATH

# inject all environment vars we'll need
ARG VITE_API_KEY
ARG VITE_CDN_URL
ARG VITE_PASSWORD
ARG VITE_USERNAME
# expose the variable to the finished cotainer
ENV VITE_API_KEY=$VITE_API_KEY
ENV VITE_CDN_URL=$VITE_CDN_URL
ENV VITE_PASSWORD=$VITE_PASSWORD
ENV VITE_USERNAME=$VITE_USERNAME

COPY package.json ./

RUN npm install

# use a more specific COPY, as this will include files like `Dockerfile`, we don't really need inside our containers.
COPY . ./

FROM builder AS dev
CMD ["npm", "run", "dev"]

FROM builder AS prod-builder
RUN npm run build

# it's a good idea to pin this, but for demo purposes we'll leave it as is
FROM nginx:1.28 AS prod

COPY --from=prod-builder /usr/src/app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]