# Sistema de Gestão para Clínica Veterinária

Sistema completo para gerenciamento de clínica veterinária desenvolvido com arquitetura de microsserviços, utilizando diferentes tecnologias para cada serviço específico.

![image](https://github.com/user-attachments/assets/7c34050a-8af0-4a9e-a530-ac2bc6212f3b)

## 📋 Visão Geral

O sistema é composto por uma arquitetura distribuída com 4 componentes principais:
- **Serviço 1**: Gerenciamento de Funcionários e Agendamentos (Java Spring Boot + PostgreSQL)
- **Serviço 2**: Gerenciamento de Espécies e Pets (Python + Flask + MongoDB)
- **Serviço Gestor**: Coordenação entre os microsserviços (Java Spring Boot)
- **Sistema Cliente**: Interface web responsiva (HTML5 + CSS3 + JavaScript/jQuery)

## 🏗️ Arquitetura do Sistema
![image](https://github.com/user-attachments/assets/a1956110-7cab-4908-bf28-07e436eaa132)


## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 17+** com Spring Boot
- **Python 3.8+** com Flask
- **PostgreSQL** (Banco Relacional)
- **MongoDB** (Banco NoSQL)

### Frontend
- **HTML5**
- **CSS3**
- **JavaScript**
- **jQuery**

## 📊 Modelo de Dados

### PostgreSQL (Serviço 1)

#### Tabela: funcionarios
```sql
CREATE TABLE funcionarios (
    id_funcionario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cargo ENUM('VETERINARIO', 'AUXILIAR', 'RECEPCIONISTA', 'GERENTE') NOT NULL,
    telefone VARCHAR(20),
    ativo BOOLEAN DEFAULT TRUE
);
```

#### Tabela: agendamentos
```sql
CREATE TABLE agendamentos (
    id_agendamento INT PRIMARY KEY AUTO_INCREMENT,
    id_pet INT NOT NULL,
    id_veterinario INT NOT NULL,
    data_agendamento DATETIME NOT NULL,
    tipo_servico ENUM('CONSULTA', 'CIRURGIA', 'VACINACAO', 'EXAME', 'BANHO_TOSA') NOT NULL,
    status_agendamento ENUM('AGENDADO', 'CONFIRMADO', 'REALIZADO', 'CANCELADO') DEFAULT 'AGENDADO',
    observacoes TEXT,
    valor_estimado DECIMAL(10,2),
    FOREIGN KEY (id_pet) REFERENCES pets(id_pet),
    FOREIGN KEY (id_veterinario) REFERENCES funcionarios(id_funcionario)
);
```

### MongoDB (Serviço 2)

#### Collection: especies
```javascript
{
  id_especie: Number,
  nome_especie: String,
  tipo_animal: String, // 'DOMESTICO', 'SILVESTRE', 'EXOTICO'
  descricao: String
}
```

#### Collection: pets
```javascript
{
  id_pet: Number,
  nome_pet: String,
  id_especie: Number,
  sexo: String, // 'MACHO', 'FEMEA'
  nome_proprietario: String,
  telefone_proprietario: String,
  data_cadastro: Date,
  ativo: Boolean
}
```

## 🚀 Funcionalidades

### Gestão de Animais
- ✅ Cadastro de espécies (domésticas, silvestres, exóticas)
- ✅ Registro de pets com dados do proprietário
- ✅ Controle de status ativo/inativo

### Gestão de Funcionários
- ✅ Cadastro de veterinários, auxiliares, recepcionistas e gerentes
- ✅ Controle de dados de contato
- ✅ Gestão de status funcional

### Sistema de Agendamentos
- ✅ Agendamento de consultas, cirurgias, vacinações
- ✅ Controle de exames e serviços de banho/tosa
- ✅ Gestão de status (agendado, confirmado, realizado, cancelado)
- ✅ Registro de observações e valores estimados

## 🔧 Configuração e Instalação

### Pré-requisitos
- Java 17+
- Python 3.8+
- PostgreSQL 12+
- MongoDB 4.4+
- Node.js (para gerenciamento de dependências frontend, se necessário)

### Configuração dos Bancos de Dados

#### PostgreSQL
```sql
-- Criar banco de dados
CREATE DATABASE clinica_veterinaria;

-- // As tabelas serão criadas automaticamente
```

#### MongoDB
```javascript
// Conectar ao MongoDB
use clinica_veterinaria

// As collections serão criadas automaticamente
```

### Executando os Serviços

#### Serviço 1 (Java/Spring Boot) - clinica_veterinaria
```bash
cd servico2-java
./mvnw spring-boot:run
```

#### Serviço 2 (Python/Flask) - clinica_veterinaria_serv2
```bash
cd servico1-python
pip install -r requirements.txt
python run.py
```

#### Serviço Gestor - clinica_veterinaria_gestor
```bash
cd servico-gestor
./mvnw spring-boot:run
```

#### Sistema Cliente - clinica_veterinaria_web
```bash
cd cliente-web
# Servir arquivos estáticos (pode usar qualquer servidor web)
python -m http.server 8080
# ou
npx serve .
```

## 🌐 APIs e Endpoints
Link documentação das APIs: https://documenter.getpostman.com/view/39398509/2sB2x5GCLc

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autor

- **Natalia Salete** - *Desenvolvimento inicial* - [GitHub](https://github.com/natsalete)

## 📞 Contato

Para dúvidas ou sugestões, entre em contato através do GitHub Issues ou pelo email: natsalete14@gmail.com.

---

⭐ **Se este projeto te ajudou, considere dar uma estrela!**
