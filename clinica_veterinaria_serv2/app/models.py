from datetime import datetime
from bson import ObjectId
from app.database import Database

class BaseModel:
    def __init__(self):
        self.db = Database().get_db()
    
    def to_dict(self, doc):
        """Converte documento MongoDB para dicionário Python"""
        if doc:
            doc['_id'] = str(doc['_id'])
        return doc

class EspecieModel(BaseModel):
    def __init__(self):
        super().__init__()
        self.collection = self.db.especies
    
    def create(self, data):
        """Criar nova espécie"""
        especie = {
            'nome_especie': data['nome_especie'],
            'tipo_animal': data['tipo_animal'],  # DOMESTICO, SILVESTRE, EXOTICO
            'descricao': data.get('descricao', ''),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = self.collection.insert_one(especie)
        return str(result.inserted_id)
    
    def get_all(self):
        """Listar todas as espécies"""
        especies = list(self.collection.find())
        return [self.to_dict(especie) for especie in especies]
    
    def get_by_id(self, especie_id):
        """Buscar espécie por ID"""
        try:
            especie = self.collection.find_one({'_id': ObjectId(especie_id)})
            return self.to_dict(especie)
        except:
            return None
    
    def update(self, especie_id, data):
        """Atualizar espécie"""
        try:
            update_data = {
                'nome_especie': data['nome_especie'],
                'tipo_animal': data['tipo_animal'],
                'descricao': data.get('descricao', ''),
                'updated_at': datetime.utcnow()
            }
            
            result = self.collection.update_one(
                {'_id': ObjectId(especie_id)},
                {'$set': update_data}
            )
            return result.modified_count > 0
        except:
            return False
    
    def delete(self, especie_id):
        """Deletar espécie"""
        try:
            result = self.collection.delete_one({'_id': ObjectId(especie_id)})
            return result.deleted_count > 0
        except:
            return False

class PetModel(BaseModel):
    def __init__(self):
        super().__init__()
        self.collection = self.db.pets
        self.especie_model = EspecieModel()
    
    def create(self, data):
        """Criar novo pet"""
        # Verificar se a espécie existe
        if not self.especie_model.get_by_id(data['id_especie']):
            raise ValueError("Espécie não encontrada")
        
        pet = {
            'nome_pet': data['nome_pet'],
            'id_especie': data['id_especie'],
            'sexo': data['sexo'],  # MACHO, FEMEA
            'nome_proprietario': data['nome_proprietario'],
            'telefone_proprietario': data['telefone_proprietario'],
            'data_cadastro': datetime.strptime(data['data_cadastro'], '%Y-%m-%d') if isinstance(data['data_cadastro'], str) else data['data_cadastro'],
            'ativo': data.get('ativo', True),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = self.collection.insert_one(pet)
        return str(result.inserted_id)
    
    def get_all(self, ativo_apenas=True):
        """Listar todos os pets"""
        filter_query = {'ativo': True} if ativo_apenas else {}
        pets = list(self.collection.find(filter_query))
        
        # Enriquecer com dados da espécie
        for pet in pets:
            especie = self.especie_model.get_by_id(pet['id_especie'])
            pet['especie'] = especie
        
        return [self.to_dict(pet) for pet in pets]
    
    def get_by_id(self, pet_id):
        """Buscar pet por ID"""
        try:
            pet = self.collection.find_one({'_id': ObjectId(pet_id)})
            if pet:
                especie = self.especie_model.get_by_id(pet['id_especie'])
                pet['especie'] = especie
                return self.to_dict(pet)
            return None
        except:
            return None
    
    def update(self, pet_id, data):
        """Atualizar pet"""
        try:
            # Verificar se a espécie existe
            if 'id_especie' in data and not self.especie_model.get_by_id(data['id_especie']):
                raise ValueError("Espécie não encontrada")
            
            update_data = {
                'nome_pet': data['nome_pet'],
                'id_especie': data['id_especie'],
                'sexo': data['sexo'],
                'nome_proprietario': data['nome_proprietario'],
                'telefone_proprietario': data['telefone_proprietario'],
                'ativo': data.get('ativo', True),
                'updated_at': datetime.utcnow()
            }
            
            if 'data_cadastro' in data:
                update_data['data_cadastro'] = datetime.strptime(data['data_cadastro'], '%Y-%m-%d') if isinstance(data['data_cadastro'], str) else data['data_cadastro']
            
            result = self.collection.update_one(
                {'_id': ObjectId(pet_id)},
                {'$set': update_data}
            )
            return result.modified_count > 0
        except:
            return False
    
    def delete(self, pet_id):
        """Desativar pet (soft delete)"""
        try:
            result = self.collection.update_one(
                {'_id': ObjectId(pet_id)},
                {'$set': {'ativo': False, 'updated_at': datetime.utcnow()}}
            )
            return result.modified_count > 0
        except:
            return False
    
    def search(self, query):
        """Buscar pets por nome ou proprietário"""
        filter_query = {
            '$and': [
                {'ativo': True},
                {
                    '$or': [
                        {'nome_pet': {'$regex': query, '$options': 'i'}},
                        {'nome_proprietario': {'$regex': query, '$options': 'i'}}
                    ]
                }
            ]
        }
        
        pets = list(self.collection.find(filter_query))
        
        # Enriquecer com dados da espécie
        for pet in pets:
            especie = self.especie_model.get_by_id(pet['id_especie'])
            pet['especie'] = especie
        
        return [self.to_dict(pet) for pet in pets]