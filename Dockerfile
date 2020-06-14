FROM python:3.7.6

# show print log when run `docker logs xxx`
# ENV PYTHONUNBUFFERED 0

ENV PYTHONUNBUFFERED 1

ADD ./requirements.txt /requirements.txt
RUN pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt

ADD ./ /code/
WORKDIR /code/

RUN chmod +x /code/scripts/*.sh

CMD ["/code/scripts/start.sh"]
