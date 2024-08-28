FROM node:20-alpine

# Install Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
    echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
    apk add doppler

WORKDIR /usr/giftr/api

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["doppler", "run", "--", "npm", "run", "start:prod"]
