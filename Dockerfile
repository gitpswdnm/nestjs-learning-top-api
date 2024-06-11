FROM node:20-alpine
WORKDIR /opt/app
ADD package.json package.json
RUN npm install -g pnpm
RUN pnpm i
ADD . .
RUN pnpm run build
RUN pnpm prune --prod
CMD [ "node", "./dist/main.js" ]
