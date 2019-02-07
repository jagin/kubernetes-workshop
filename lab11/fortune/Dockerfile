FROM ubuntu:16.04

RUN apt-get update ; apt-get -y install fortune fortunes-off
ADD fortuneloop.sh /bin/fortuneloop.sh
RUN chmod +x /bin/fortuneloop.sh

ENTRYPOINT ["/bin/fortuneloop.sh"]
CMD ["-s"]

