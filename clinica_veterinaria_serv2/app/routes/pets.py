from flask import Blueprint, request, jsonify
from datetime import datetime
from app.models import PetModel

pets_bp = Blueprint('pets', __name__)
pet_model = PetModel()

@pets_bp.route('/pets', methods=['GET'])
def get_pets():
    """Listar todos os pets"""
    try:
        ativo_apenas = request.args.get('ativo_apenas', 'true').lower() == 'true'
        search_query = request.args.get('search', '').strip()
        
        if search_query:
            pets = pet_model.search(search_query)
        else:
            pets = pet_model.get_all(ativo_apenas)
        
        return jsonify({
            'success': True,
            'data': pets,
            'total': len(pets),
            'filters': {
                'ativo_apenas': ativo_apenas,
                'search': search_query if search_query else None
            },
            'message': f'{len(pets)} pet(s) encontrado(s)'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao buscar pets: {str(e)}',
            'error': 'DATABASE_ERROR'
        }), 500

@pets_bp.route('/pets/<pet_id>', methods=['GET'])
def get_pet(pet_id):
    """Buscar pet por ID"""
    try:
        pet = pet_model.get_by_id(pet_id)
        if not pet:
            return jsonify({
                'success': False,
                'message': 'Pet não encontrado',
                'error': 'NOT_FOUND'
            }), 404
        
        return jsonify({
            'success': True,
            'data': pet,
            'message': 'Pet encontrado com sucesso'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao buscar pet: {str(e)}',
            'error': 'DATABASE_ERROR'
        }), 500

@pets_bp.route('/pets', methods=['POST'])
def create_pet():
    """Criar novo pet"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'Dados não fornecidos',
                'error': 'MISSING_DATA'
            }), 400
        
        # Validações
        required_fields = ['nome_pet', 'id_especie', 'sexo', 'nome_proprietario', 'telefone_proprietario']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'message': f'Campos obrigatórios ausentes: {", ".join(missing_fields)}',
                'error': 'VALIDATION_ERROR'
            }), 400
        
        if data['sexo'] not in ['MACHO', 'FEMEA']:
            return jsonify({
                'success': False,
                'message': 'Sexo deve ser MACHO ou FEMEA',
                'error': 'VALIDATION_ERROR'
            }), 400
        
        # Se não informar data_cadastro, usar data atual
        if not data.get('data_cadastro'):
            data['data_cadastro'] = datetime.now().date()
        
        pet_id = pet_model.create(data)
        
        return jsonify({
            'success': True,
            'message': 'Pet cadastrado com sucesso',
            'data': {
                'id': pet_id,
                'nome_pet': data['nome_pet'],
                'nome_proprietario': data['nome_proprietario']
            }
        }), 201
    except ValueError as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 'VALIDATION_ERROR'
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao cadastrar pet: {str(e)}',
            'error': 'DATABASE_ERROR'
        }), 500

@pets_bp.route('/pets/<pet_id>', methods=['PUT'])
def update_pet(pet_id):
    """Atualizar pet"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'Dados não fornecidos',
                'error': 'MISSING_DATA'
            }), 400
        
        # Verificar se o pet existe
        if not pet_model.get_by_id(pet_id):
            return jsonify({
                'success': False,
                'message': 'Pet não encontrado',
                'error': 'NOT_FOUND'
            }), 404
        
        # Validações
        required_fields = ['nome_pet', 'id_especie', 'sexo', 'nome_proprietario', 'telefone_proprietario']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'message': f'Campos obrigatórios ausentes: {", ".join(missing_fields)}',
                'error': 'VALIDATION_ERROR'
            }), 400
        
        if data['sexo'] not in ['MACHO', 'FEMEA']:
            return jsonify({
                'success': False,
                'message': 'Sexo deve ser MACHO ou FEMEA',
                'error': 'VALIDATION_ERROR'
            }), 400
        
        success = pet_model.update(pet_id, data)
        
        if not success:
            return jsonify({
                'success': False,
                'message': 'Erro na atualização do pet',
                'error': 'UPDATE_ERROR'
            }), 500
        
        return jsonify({
            'success': True,
            'message': 'Pet atualizado com sucesso',
            'data': {'id': pet_id}
        }), 200
    except ValueError as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'error': 'VALIDATION_ERROR'
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao atualizar pet: {str(e)}',
            'error': 'DATABASE_ERROR'
        }), 500

@pets_bp.route('/pets/<pet_id>', methods=['DELETE'])
def delete_pet(pet_id):
    """Desativar pet (soft delete)"""
    try:
        # Verificar se o pet existe
        pet = pet_model.get_by_id(pet_id)
        if not pet:
            return jsonify({
                'success': False,
                'message': 'Pet não encontrado',
                'error': 'NOT_FOUND'
            }), 404
        
        # Verificar se o pet já está inativo
        if not pet.get('ativo', True):
            return jsonify({
                'success': False,
                'message': 'Pet já está inativo',
                'error': 'ALREADY_INACTIVE'
            }), 400
        
        success = pet_model.delete(pet_id)
        
        if not success:
            return jsonify({
                'success': False,
                'message': 'Erro ao desativar pet',
                'error': 'DELETE_ERROR'
            }), 500
        
        return jsonify({
            'success': True,
            'message': 'Pet desativado com sucesso'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao desativar pet: {str(e)}',
            'error': 'DATABASE_ERROR'
        }), 500