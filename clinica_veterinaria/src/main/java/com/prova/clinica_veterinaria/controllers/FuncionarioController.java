package com.prova.clinica_veterinaria.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import com.prova.clinica_veterinaria.models.Funcionario;
import com.prova.clinica_veterinaria.repositories.FuncionarioRepository;
import com.prova.clinica_veterinaria.services.FuncionarioServices;

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = "*")
public class FuncionarioController {

    @Autowired
    private FuncionarioServices funcionarioServices;

    @GetMapping
    public List<Funcionario> getFuncionarios() {
        return funcionarioServices.getFuncionarios();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> getFuncionarioPorId(@PathVariable Long id) {
        Optional<Funcionario> funcionario = funcionarioServices.buscarFuncionarioPorId(id);
        
        if (funcionario.isPresent()) {
            return ResponseEntity.ok(funcionario.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Funcionario salvarFuncionario(@RequestBody Funcionario funcionario) {
        return funcionarioServices.salvarFuncionario(funcionario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Funcionario> atualizarFuncionario(@PathVariable Long id, @RequestBody Funcionario funcionario) {
        try {
            Funcionario funcionarioAtualizado = funcionarioServices.atualizarFuncionario(id, funcionario);
            return ResponseEntity.ok(funcionarioAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirFuncionarioPorId(@PathVariable Long id) {
        Optional<Funcionario> funcionario = funcionarioServices.buscarFuncionarioPorId(id);
        
        if (funcionario.isPresent()) {
            funcionarioServices.excluirFuncionario(funcionario.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping
    public void excluirFuncionario(@RequestBody Funcionario funcionario) {
        funcionarioServices.excluirFuncionario(funcionario);
    }
}