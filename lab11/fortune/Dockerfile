FROM ubuntu:latest

RUN apt-get update ; apt-get -y install fortune fortunes-off
ADD fortuneloop.sh /bin/fortuneloop.sh

ENTRYPOINT ["/bin/fortuneloop.sh"]
CMD ["-s"]

