import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    GOATCOUNTER_SITE = os.environ.get('GOATCOUNTER_SITE', '')  # e.g. 'yoursite' for yoursite.goatcounter.com
