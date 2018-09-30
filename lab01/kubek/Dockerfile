FROM node:10

# set working directory
WORKDIR /app

# set environment
ENV HOST=0.0.0.0
ENV PORT=8000

# copy app sources for production
COPY server server
COPY public public

# create healthy file indicator
RUN touch /var/healthy

# expose port and define ENTRYPOINT
ENTRYPOINT ["node", "server"]

