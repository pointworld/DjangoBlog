import logging
import logging.config
import logging.handlers
from logging.handlers import WatchedFileHandler
import os

import multiprocessing

from DjangoBlog.settings import BASE_DIR

# user = 'www-data'
# group = 'www-data'

# bind ip and port
bind = '0.0.0.0:8000'
# bind = '127.0.0.1:8000'
# The maximum number of pending connections. [2048]
backlog = 512
# work directory
chdir = '/code'
# chdir = '/Users/pointone/Documents/ws'
# timeout
timeout = 30
# Timeout for graceful workers restart. [30]
graceful_timeout = 10

# model: default sync, we use gevent
worker_class = 'gevent'
# process / worker num
workers = multiprocessing.cpu_count() * 2 + 1
# thread num of per process / worker
threads = 2

worker_connections = 1000

# access log format
access_log_format = '%(t)s %(h)s "%(r)s" %(s)s %(L)s %(b)s %(f)s" "%(a)s"'
# access log path
accesslog = '/code/logs/gunicorn/gunicorn.access.log'

# error log level, access log cannot set level
loglevel = 'info'
# errorlog = '/code/logs/gunicorn_error.log'

pidfile = './logs/.gunicorn.pid'
# daemon = True


## LOG

BASE_LOG_DIR = os.path.join(BASE_DIR, 'logs')
os.makedirs(BASE_LOG_DIR, exist_ok=True)
os.makedirs(BASE_LOG_DIR + '/gunicorn', exist_ok=True)


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'loggers': {
        'gunicorn.error': {
            'handlers': ['error_file'],
            'level': 'INFO',
            'propagate': False,
            "qualname": "gunicorn.error",
        },
        "gunicorn.access": {
            "level": "DEBUG",
            "handlers": ["access_file"],
            "propagate": True,
            "qualname": "gunicorn.access"
        },
    },
    'handlers':{
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'key_value',
            'stream': 'ext://sys.stdout'
        },
        "error_file": {
            "class": "logging.handlers.RotatingFileHandler",
            "maxBytes": 1024*1024*1024, # 1G
            "backupCount": 1,
            "formatter": "generic",
            # 'mode': 'w+',
            "filename": os.path.join(BASE_LOG_DIR, 'gunicorn', 'gunicorn.error.log'),
        },
        "access_file": {
            'class': 'logging.handlers.TimedRotatingFileHandler',
            "backupCount": 30,
            'when': 'D',
            "formatter": "generic",
            'encoding': 'utf-8',
            "filename": os.path.join(BASE_LOG_DIR, 'gunicorn', 'gunicorn.access.log'),
        },
    },
    'formatters':{
        'key_value': {
            'format': 'timestamp=%(asctime)s pid=%(process)d loglevel=%(levelname)s msg=%(message)s'
        },
        "generic": {
            "format": "'[%(process)d] [%(asctime)s] %(levelname)s [%(filename)s:%(lineno)s] %(message)s'",
            "datefmt": "[%Y-%m-%d %H:%M:%S %z]",
            "class": "logging.Formatter"
        },
        "access": {
            "format": "'[%(process)d] [%(asctime)s] %(levelname)s [%(filename)s:%(lineno)s] %(message)s'",
            "class": "logging.Formatter"
        }
    }
}


logging.config.dictConfig(LOGGING)
# acclog = logging.getLogger('gunicorn.access')
# acclog.addHandler(WatchedFileHandler('/code/logs/gunicorn_access.log'))
# acclog.propagate = False
# errlog = logging.getLogger('gunicorn.error')
# errlog.addHandler(WatchedFileHandler('/code/logs/gunicorn_error.log'))
# errlog.propagate = False
