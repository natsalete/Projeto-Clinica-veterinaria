package com.prova.clinica_veterinaria.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.prova.clinica_veterinaria.models.Agendamento;
import com.prova.clinica_veterinaria.services.AgendamentoService;

@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin(origins = "*")
public class AgendamentoController {
    
    @Autowired
    private AgendamentoService agendamentoService;

    @GetMapping
    public List<Agendamento> getAgendamentos() {
        return agendamentoService.getAgendamentos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Agendamento> getAgendamento(@PathVariable Long id) {
        Agendamento agendamento = agendamentoService.getAgendamento(id);
        if (agendamento != null) {
            return ResponseEntity.ok(agendamento);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/pet/{idPet}")
    public List<Agendamento> getAgendamentosPorPet(@PathVariable String idPet) {
        return agendamentoService.getAgendamentosPorPet(idPet);
    }

    @GetMapping("/veterinario/{idVeterinario}")
    public List<Agendamento> getAgendamentosPorVeterinario(@PathVariable Long idVeterinario) {
        return agendamentoService.getAgendamentosPorVeterinario(idVeterinario);
    }

    @GetMapping("/status")
    public List<Agendamento> getAgendamentosPorStatus(@RequestParam Agendamento.StatusAgendamento status) {
        return agendamentoService.getAgendamentosPorStatus(status);
    }

    @PostMapping
    public ResponseEntity<?> salvarAgendamento(@RequestBody Agendamento agendamento) {
        try {
            Agendamento agendamentoSalvo = agendamentoService.salvarAgendamento(agendamento);
            return ResponseEntity.status(HttpStatus.CREATED).body(agendamentoSalvo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarAgendamento(@PathVariable Long id, 
                                                 @RequestBody Agendamento agendamento) {
        try {
            Agendamento agendamentoAtualizado = agendamentoService.atualizarAgendamento(id, agendamento);
            return ResponseEntity.ok(agendamentoAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/confirmar")
    public ResponseEntity<?> confirmarAgendamento(@PathVariable Long id) {
        try {
            Agendamento agendamento = agendamentoService.confirmarAgendamento(id);
            return ResponseEntity.ok(agendamento);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarAgendamento(@PathVariable Long id) {
        try {
            Agendamento agendamento = agendamentoService.cancelarAgendamento(id);
            return ResponseEntity.ok(agendamento);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/finalizar")
    public ResponseEntity<?> finalizarAgendamento(@PathVariable Long id) {
        try {
            Agendamento agendamento = agendamentoService.finalizarAgendamento(id);
            return ResponseEntity.ok(agendamento);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAgendamento(@PathVariable Long id) {
        try {
            agendamentoService.excluirAgendamento(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}