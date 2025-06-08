from flask import Blueprint, request, jsonify
from app.models import EspecieModel

especies_bp = Blueprint('especies', __name__)
especie_model = EspecieModel()

@especies_bp.route('/especies', methods=['GET'])
def get_especies():
    """Listar todas as espécies"""
    try:
        especies = especie_model.get_all()
        return jsonify({
            'success': True,
            'data': especies,
            'total': len(especies),
            'message': f'{len(especies)} espécie(s) encontrada(s)'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao buscar espécies: {str(e)}',
            'error': 'DATABASE_ERROR'
        }), 500

@especies_bp.route('/especies/<especie_id>', methods=['GET'])
def get_especie(especie_id):
    """Buscar espécie por ID"""
    try:
        especie = especie_model.get_by_id(especie_id)
        if not especie:
            return jsonify({
                'success': False,
                'message': 'Espécie não encontrada',
                'error': 'NOT_FOUND'
            }), 404
        
        return jsonify({
            'success': True,
            'data': especie,
            'message': 'Espécie encontrada com sucesso'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao buscar espécie: {str(e)}',
            'error': 'DATABASE_ERROR'
        }), 500

@especies_bp.route('/especies', methods=['POST'])
def create_especie():
    """Criar nova espécie"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'Dados não fornecidos',
                'error': 'MISSING_DATA'
            }), 400
        
        # Validações
        required_fields = ['nome_especie', 'tipo_animal']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'message': f'Campos obrigatórios ausentes: {", ".join(missing_fields)}',
                'error': 'VALIDATION_ERROR'
            }), 400
        
        if data['tipo_animal'] not in ['DOMESTICO', 'SILVESTRE', 'EXOTICO']:
            return jsonify({
                'success': False,
                'message': 'Tipo de animal deve ser DOMESTICO, SILVESTRE ou EXOTICO',
                'error': 'VALIDATION_ERROR'
            }), 400
        
        especie_id = especie_model.create(data)
        
        return jsonify({
            'success': True,
            'message': 'Espécie criada com sucesso',
            'data': {
                'id': especie_id,
                'nome_especie': data['nome_especie'],
                'tipo_animal': data['tipo_animal']
            }
        }), 201
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao criar espécie: {str(e)}',
            'error': 'DATABASE_ERROR'
        }), 500

@especies_bp.route('/especies/<especie_id>', methods=['PUT'])
def update_especie(especie_id):
    """Atualizar espécie"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'Dados não fornecidos',
                'error': 'MISSING_DATA'
            }), 400
        
        # Verificar se a espécie existe
        if not especie_model.get_by_id(especie_id):
            return jsonify({
                'success': False,
                'message': 'Espécie não encontrada',
                'error': 'NOT_FOUND'
            }), 404
        
        # Validações
        required_fields = ['nome_especie', 'tipo_animal']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'message': f'Campos obrigatórios ausentes: {", ".join(missing_fields)}',
                'error': 'VALIDATION_ERROR'
            }), 400
        
        if data['tipo_animal'] not in ['DOMESTICO', 'SILVESTRE', 'EXOTICO']:
            return jsonify({
                'success': False,
                'message': 'Tipo de animal deve ser DOMESTICO, SILVESTRE ou EXOTICO',
                'error': 'VALIDATION_ERROR'
            }), 400
        
        success = especie_model.update(especie_id, data)
        
        if not success:
            return jsonify({
                'success': False,
                'message': 'Erro na atualização da espécie',
                'error': 'UPDATE_ERROR'
            }), 500
        
        return jsonify({
            'success': True,
            'message': 'Espécie atualizada com sucesso',
            'data': {'id': especie_id}
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao atualizar espécie: {str(e)}',
            'error': 'DATABASE_ERROR'
        }), 500

@especies_bp.route('/especies/<especie_id>', methods=['DELETE'])
def delete_especie(especie_id):
    """Deletar espécie"""
    try:
        # Verificar se a espécie existe
        if not especie_model.get_by_id(especie_id):
            return jsonify({
                'success': False,
                'message': 'Espécie não encontrada',
                'error': 'NOT_FOUND'
            }), 404
        
        # Verificar se há pets vinculados a esta espécie
        from ..models import PetModel
        pet_model = PetModel()
        pets_vinculados = pet_model.collection.count_documents({'id_especie': especie_id, 'ativo': True})
        
        if pets_vinculados > 0:
            return jsonify({
                'success': False,
                'message': f'Não é possível deletar a espécie. Existem {pets_vinculados} pet(s) vinculado(s) a ela.',
                'error': 'CONSTRAINT_ERROR'
            }), 400
        
        success = especie_model.delete(especie_id)
        
        if not success:
            return jsonify({
                'success': False,
                'message': 'Erro ao deletar espécie',
                'error': 'DELETE_ERROR'
            }), 500
        
        return jsonify({
            'success': True,
            'message': 'Espécie deletada com sucesso'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao deletar espécie: {str(e)}',
            'error': 'DATABASE_ERROR'
        }), 500
