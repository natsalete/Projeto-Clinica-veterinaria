from flask import Blueprint

def register_routes(app):
    """Registra todos os blueprints da aplicação"""
    
    # Importar blueprints
    from .especies import especies_bp
    from .pets import pets_bp
    
    # Registrar blueprints com prefixo /api
    app.register_blueprint(especies_bp, url_prefix='/api')
    app.register_blueprint(pets_bp, url_prefix='/api')
    
    # Blueprint para rotas de saúde/status da API
    health_bp = Blueprint('health', __name__)
    
    @health_bp.route('/health')
    def health_check():
        """Endpoint de verificação de saúde da API"""
        from ..database import Database
        
        try:
            db = Database().get_db()
            # Teste simples de conectividade
            db.command('ping')
            db_status = 'connected'
        except Exception as e:
            db_status = f'error: {str(e)}'
        
        return {
            'status': 'healthy',
            'database': db_status,
            'message': 'API está funcionando corretamente'
        }
    
    @health_bp.route('/api/stats')
    def api_stats():
        """Estatísticas básicas da API"""
        from ..models import EspecieModel, PetModel
        
        try:
            especie_model = EspecieModel()
            pet_model = PetModel()
            
            total_especies = len(especie_model.get_all())
            total_pets = len(pet_model.get_all(ativo_apenas=False))
            pets_ativos = len(pet_model.get_all(ativo_apenas=True))
            
            return {
                'success': True,
                'data': {
                    'total_especies': total_especies,
                    'total_pets': total_pets,
                    'pets_ativos': pets_ativos,
                    'pets_inativos': total_pets - pets_ativos
                }
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Erro ao obter estatísticas: {str(e)}'
            }, 500
    
    # Registrar blueprint de health
    app.register_blueprint(health_bp)