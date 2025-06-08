from pymongo import MongoClient
from app.config import Config

class Database:
    _instance = None
    _client = None
    _db = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
        return cls._instance
    
    def connect(self):
        if self._client is None:
            self._client = MongoClient(Config.MONGO_URI)
            self._db = self._client[Config.DATABASE_NAME]
            self._create_indexes()
        return self._db
    
    def _create_indexes(self):
        # Índices para otimizar consultas
        self._db.especies.create_index("nome_especie")
        self._db.pets.create_index("nome_pet")
        self._db.pets.create_index("nome_proprietario")
        self._db.pets.create_index("data_cadastro")
    
    def get_db(self):
        return self._db if self._db is not None else self.connect()
  
    def close(self):
        if self._client:
            self._client.close()