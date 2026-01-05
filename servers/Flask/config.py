import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    PROJECT_ID = os.getenv('PROJECT_ID')
    API_KEY = os.getenv('API_KEY')
    URL = os.getenv('URL')
    
    # IBM Watsonx settings
    WATSONX_MODEL_ID = "meta-llama/llama-3-3-70b-instruct"
    EMBEDDING_MODEL_ID = 'ibm/slate-30m-english-rtrvr-v2'
    
    # Chunking parameters
    CHUNK_SIZE = 200
    CHUNK_OVERLAP = 20
    
    # RAG parameters
    SIMILARITY_TOP_K = 7

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}