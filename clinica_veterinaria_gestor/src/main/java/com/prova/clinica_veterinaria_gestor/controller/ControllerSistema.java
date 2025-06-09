package com.prova.clinica_veterinaria_gestor.controller;

import com.prova.clinica_veterinaria_gestor.services.ServiceSistema;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gestor")
@CrossOrigin(origins = "*")
public class ControllerSistema {

    @Autowired
    private ServiceSistema serviceSistema;

    // Endpoints para Funcionários
    @GetMapping("/funcionarios")
    public ResponseEntity<String> getFuncionarios() {
        return serviceSistema.getFuncionarios();
    }

    @GetMapping("/funcionarios/{id}")
    public ResponseEntity<String> getFuncionarioById(@PathVariable Long id) {
        return serviceSistema.getFuncionarioById(id);
    }

    @PostMapping("/funcionarios")
    public ResponseEntity<String> salvarFuncionario(@RequestBody String funcionario) {
        return serviceSistema.salvarFuncionarios(funcionario);
    }

    @PutMapping("/funcionarios/{id}")
    public ResponseEntity<String> atualizarFuncionario(@PathVariable Long id, @RequestBody String funcionario) {
        return serviceSistema.atualizarFuncionarios(id, funcionario);
    }

    @DeleteMapping("/funcionarios/{id}")
    public ResponseEntity<String> deletarFuncionario(@PathVariable Long id) {
        return serviceSistema.deletarFuncionarios(id);
    }

    // Endpoints para Agendamentos
    @GetMapping("/agendamentos")
    public ResponseEntity<String> getAgendamentos() {
        return serviceSistema.getAgendamentos();
    }

    @GetMapping("/agendamentos/{id}")
    public ResponseEntity<String> getAgendamentoById(@PathVariable Long id) {
        return serviceSistema.getAgendamentoById(id);
    }

    @PostMapping("/agendamentos")
    public ResponseEntity<String> salvarAgendamento(@RequestBody String agendamento) {
        return serviceSistema.salvarAgendamentos(agendamento);
    }

    @PutMapping("/agendamentos/{id}")
    public ResponseEntity<?> atualizarAgendamento(@PathVariable Long id, 
                                                @RequestBody String agendamento) {
        try {
            ResponseEntity<String> response = serviceSistema.atualizarAgendamentos(id, agendamento);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                            .body("{\"error\": \"Erro ao atualizar agendamento: " + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/agendamentos/{id}")
    public ResponseEntity<String> deletarAgendamento(@PathVariable Long id) {
        return serviceSistema.deletarAgendamentos(id);
    }

    // Endpoints para Pets
    @GetMapping("/pets")
    public ResponseEntity<String> getPets() {
        return serviceSistema.getPets();
    }

    @GetMapping("/pets/{id}")
    public ResponseEntity<String> getPetById(@PathVariable String id) {
        return serviceSistema.getPetById(id);
    }

    @PostMapping("/pets")
    public ResponseEntity<String> salvarPet(@RequestBody String pet) {
        return serviceSistema.salvarPets(pet);
    }

    @PutMapping("/pets/{id}")
    public ResponseEntity<String> atualizarPet(@PathVariable String id, @RequestBody String pet) {
        return serviceSistema.atualizarPets(id, pet);
    }

    @DeleteMapping("/pets/{id}")
    public ResponseEntity<String> deletarPet(@PathVariable String id) {
        return serviceSistema.deletarPets(id);
    }

    // Endpoints para Espécies
    @GetMapping("/especies")
    public ResponseEntity<String> getEspecies() {
        return serviceSistema.getEspecies();
    }

    @GetMapping("/especies/{id}")
    public ResponseEntity<String> getEspecieById(@PathVariable String id) {
        return serviceSistema.getEspecieById(id);
    }

    @PostMapping("/especies")
    public ResponseEntity<String> salvarEspecie(@RequestBody String especie) {
        return serviceSistema.salvarEspecies(especie);
    }

    @PutMapping("/especies/{id}")
    public ResponseEntity<String> atualizarEspecie(@PathVariable String id, @RequestBody String especie) {
        return serviceSistema.atualizarEspecies(id, especie);
    }

    @DeleteMapping("/especies/{id}")
    public ResponseEntity<String> deletarEspecie(@PathVariable String id) {
        return serviceSistema.deletarEspecies(id);
    }

    // Endpoints especiais para relatórios
    @GetMapping("/pets-com-especies")
    public ResponseEntity<String> getPetsComEspecies() {
        return serviceSistema.getPetsComEspecies();
    }

    @GetMapping("/pets-com-agendamentos")
    public ResponseEntity<String> getPetsComAgendamentos() {
        return serviceSistema.getPetsComAgendamentos();
    }
}