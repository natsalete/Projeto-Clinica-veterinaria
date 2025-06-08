from flask import Flask, jsonify
from app.config import Config
from app.database import Database

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Conectar ao banco de dados
    Database().connect()
    
    # Registrar blueprints
    from .routes import register_routes
    register_routes(app)
    
    @app.route('/')
    def home():
        return jsonify({
            'message': 'API de Pets - Flask + MongoDB',
            'version': '1.0.0',
            'status': 'running',
            'endpoints': {
                'especies': {
                    'GET /api/especies': 'Listar todas as espécies',
                    'GET /api/especies/<id>': 'Buscar espécie por ID',
                    'POST /api/especies': 'Criar nova espécie',
                    'PUT /api/especies/<id>': 'Atualizar espécie',
                    'DELETE /api/especies/<id>': 'Deletar espécie'
                },
                'pets': {
                    'GET /api/pets': 'Listar todos os pets',
                    'GET /api/pets?search=<query>': 'Buscar pets',
                    'GET /api/pets?ativo_apenas=false': 'Incluir pets inativos',
                    'GET /api/pets/<id>': 'Buscar pet por ID',
                    'POST /api/pets': 'Cadastrar novo pet',
                    'PUT /api/pets/<id>': 'Atualizar pet',
                    'DELETE /api/pets/<id>': 'Desativar pet'
                }
            }
        })
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'message': 'Endpoint não encontrado',
            'error': 'Not Found'
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'success': False,
            'message': 'Erro interno do servidor',
            'error': 'Internal Server Error'
        }), 500
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'success': False,
            'message': 'Requisição inválida',
            'error': 'Bad Request'
        }), 400
    
    return app