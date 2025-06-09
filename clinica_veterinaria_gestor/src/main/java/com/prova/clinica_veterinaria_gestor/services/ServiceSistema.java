package com.prova.clinica_veterinaria_gestor.services;

import java.net.URI;
import java.util.Arrays;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class ServiceSistema {

    private RestTemplate restTemplate;
    private String url_server1_funcionario;
    private String url_server2_agendamento;
    private String url_server3_pet;
    private String url_server4_especie;

    public ServiceSistema() {
        restTemplate = new RestTemplate();
        // Inicialização das URLs dos servidores
        this.url_server1_funcionario = "http://localhost:8081/api/funcionarios";
        this.url_server2_agendamento = "http://localhost:8081/api/agendamentos";
        this.url_server3_pet = "http://127.0.0.1:5000/api/pets";
        this.url_server4_especie = "http://127.0.0.1:5000/api/especies";
    }
    
    // Métodos Serviço 1 - API Funcionario
    public ResponseEntity<String> getFuncionarios() {
        return restTemplate.getForEntity(url_server1_funcionario, String.class);
    }

    public ResponseEntity<String> getFuncionarioById(Long id) {
        return restTemplate.getForEntity(url_server1_funcionario + "/" + id, String.class);
    }

    public ResponseEntity<String> salvarFuncionarios(String funcionario) {
        // Criando headers com Content-Type 
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        // Criando HttpEntity com body e headers
        HttpEntity<String> request = new HttpEntity<>(funcionario, headers);
        
        return restTemplate.postForEntity(url_server1_funcionario, request, String.class);
    }

    public ResponseEntity<String> atualizarFuncionarios(Long id, String funcionario) {
        String url = url_server1_funcionario + "/" + id;
        
        // Criando headers com Content-Type 
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        // Criando HttpEntity com body e headers
        HttpEntity<String> request = new HttpEntity<>(funcionario, headers);
        
        // Usando exchange com HttpMethod.PUT
        return restTemplate.exchange(url, HttpMethod.PUT, request, String.class);
    }

    public ResponseEntity<String> deletarFuncionarios(Long id) {
        restTemplate.delete(url_server1_funcionario + "/" + id);
        return ResponseEntity.ok("Funcionário deletado com sucesso");
    }

    // Métodos Serviço 2 - API Agendamento
    public ResponseEntity<String> getAgendamentos() {
        return restTemplate.getForEntity(url_server2_agendamento, String.class);
    }

    public ResponseEntity<String> getAgendamentoById(Long id) {
        return restTemplate.getForEntity(url_server2_agendamento + "/" + id, String.class);
    }

    public ResponseEntity<String> salvarAgendamentos(String agendamento) {
        // Criando headers com Content-Type 
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        // Criando HttpEntity com body e headers
        HttpEntity<String> request = new HttpEntity<>(agendamento, headers);
        
        return restTemplate.postForEntity(url_server2_agendamento, request, String.class);
    }

    public ResponseEntity<String> atualizarAgendamentos(Long id, String agendamento) {
        String url = url_server2_agendamento + "/" + id;
        
        try {
            // Criando headers com Content-Type 
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
            
            // Log para debug
            System.out.println("URL: " + url);
            System.out.println("Body: " + agendamento);
            
            // Criando HttpEntity com body e headers
            HttpEntity<String> request = new HttpEntity<>(agendamento, headers);
            
            // Usando exchange com HttpMethod.PUT
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, request, String.class);
            
            return response;
            
        } catch (HttpClientErrorException e) {
            System.err.println("Erro HTTP: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            System.err.println("Erro geral: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("{\"error\": \"Erro interno: " + e.getMessage() + "\"}");
        }
    }

    public ResponseEntity<String> deletarAgendamentos(Long id) {
        restTemplate.delete(url_server2_agendamento + "/" + id);
        return ResponseEntity.ok("Agendamento deletado com sucesso");
    }


    // Métodos Serviço 3 - API Pet
    public ResponseEntity<String> getPets() {
        return restTemplate.getForEntity(url_server3_pet, String.class);
    }

    public ResponseEntity<String> getPetById(String id) {
        return restTemplate.getForEntity(url_server3_pet + "/" + id, String.class);
    }

    public ResponseEntity<String> salvarPets(String pet) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(pet, headers);
        return restTemplate.postForEntity(url_server3_pet, entity, String.class);
    }


    public ResponseEntity<String> deletarPets(String id) {
        restTemplate.delete(url_server3_pet + "/" + id);
        return ResponseEntity.ok("Pet deletado com sucesso");
    }

    public ResponseEntity<String> atualizarPets(String id, String pet) {
        String url = url_server3_pet + "/" + id;

        RequestEntity<String> request = RequestEntity
            .put(URI.create(url))
            .contentType(MediaType.APPLICATION_JSON)
            .body(pet);

        return restTemplate.exchange(request, String.class);
    }


    // Métodos Serviço 4 - API Espécie
    public ResponseEntity<String> getEspecies() {
        return restTemplate.getForEntity(url_server4_especie, String.class);
    }

    public ResponseEntity<String> getEspecieById(String id) {
        return restTemplate.getForEntity(url_server4_especie + "/" + id, String.class);
    }

    public ResponseEntity<String> salvarEspecies(String especie) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(especie, headers);
        return restTemplate.postForEntity(url_server4_especie, entity, String.class);
    }

    public ResponseEntity<String> deletarEspecies(String id) {
        try {
            String url = url_server4_especie + "/" + id;
            
            RequestEntity<Void> request = RequestEntity
                .delete(URI.create(url))
                .build();

            return restTemplate.exchange(request, String.class);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"success\": false, \"message\": \"Erro ao deletar espécie: " + e.getMessage() + "\"}");
        }
    }

    public ResponseEntity<String> atualizarEspecies(String id, String especie) {
        String url = url_server4_especie + "/" + id;

        RequestEntity<String> request = RequestEntity
            .put(URI.create(url))
            .contentType(MediaType.APPLICATION_JSON)
            .body(especie);

        return restTemplate.exchange(request, String.class);
    }

    // Métodos especiais para listar pets com espécies e agendamentos
    // RELATÓRIO: PETS COM ESPÉCIES
    public ResponseEntity<String> getPetsComEspecies() {
        try {
            // Buscar dados das duas APIs
            ResponseEntity<String> petsResponse = getPets();
            ResponseEntity<String> especiesResponse = getEspecies();
            
            // Verificar se ambas as respostas foram bem-sucedidas
            if (!petsResponse.getStatusCode().is2xxSuccessful() || 
                !especiesResponse.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.internalServerError()
                        .body("{\"error\": \"Erro ao buscar dados das APIs\"}");
            }
            
            // Parse dos dados JSON
            ObjectMapper mapper = new ObjectMapper();
            JsonNode petsJson = mapper.readTree(petsResponse.getBody());
            JsonNode especiesJson = mapper.readTree(especiesResponse.getBody());
            
            // Extrair arrays de dados (considerando estrutura {success: true, data: []})
            JsonNode petsData = petsJson.has("data") ? petsJson.get("data") : petsJson;
            JsonNode especiesData = especiesJson.has("data") ? especiesJson.get("data") : especiesJson;
            
            // Criar resposta combinada
            ObjectNode response = mapper.createObjectNode();
            response.put("success", true);
            response.set("pets", petsData);
            response.set("especies", especiesData);
            
            return ResponseEntity.ok(response.toString());
            
        } catch (Exception e) {
            System.err.println("Erro ao processar pets com espécies: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("{\"error\": \"Erro ao processar dados: " + e.getMessage() + "\"}");
        }
    }
    
    // RELATÓRIO: PETS COM AGENDAMENTOS
    public ResponseEntity<String> getPetsComAgendamentos() {
        try {
            // Buscar dados das três APIs
            ResponseEntity<String> petsResponse = getPets();
            ResponseEntity<String> agendamentosResponse = getAgendamentos();
            ResponseEntity<String> funcionariosResponse = getFuncionarios();
            
            // Verificar se todas as respostas foram bem-sucedidas
            if (!petsResponse.getStatusCode().is2xxSuccessful() || 
                !agendamentosResponse.getStatusCode().is2xxSuccessful() ||
                !funcionariosResponse.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.internalServerError()
                        .body("{\"error\": \"Erro ao buscar dados das APIs\"}");
            }
            
            // Parse dos dados JSON
            ObjectMapper mapper = new ObjectMapper();
            JsonNode petsJson = mapper.readTree(petsResponse.getBody());
            JsonNode agendamentosJson = mapper.readTree(agendamentosResponse.getBody());
            JsonNode funcionariosJson = mapper.readTree(funcionariosResponse.getBody());
            
            // Extrair arrays de dados
            JsonNode petsData = petsJson.has("data") ? petsJson.get("data") : petsJson;
            JsonNode agendamentosData = agendamentosJson.has("data") ? agendamentosJson.get("data") : agendamentosJson;
            JsonNode funcionariosData = funcionariosJson.has("data") ? funcionariosJson.get("data") : funcionariosJson;
            
            // Criar resposta combinada
            ObjectNode response = mapper.createObjectNode();
            response.put("success", true);
            response.set("pets", petsData);
            response.set("agendamentos", agendamentosData);
            response.set("funcionarios", funcionariosData);
            
            return ResponseEntity.ok(response.toString());
            
        } catch (Exception e) {
            System.err.println("Erro ao processar pets com agendamentos: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("{\"error\": \"Erro ao processar dados: " + e.getMessage() + "\"}");
        }
    }
}

