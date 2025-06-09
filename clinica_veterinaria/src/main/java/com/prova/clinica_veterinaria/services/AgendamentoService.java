package com.prova.clinica_veterinaria.services;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.prova.clinica_veterinaria.models.Agendamento;
import com.prova.clinica_veterinaria.models.Agendamento.StatusAgendamento;
import com.prova.clinica_veterinaria.repositories.AgendamentoRepository;
import com.prova.clinica_veterinaria.models.Funcionario;
import com.prova.clinica_veterinaria.repositories.FuncionarioRepository;

@Service
public class AgendamentoService {
    private final AgendamentoRepository agendamentoRepository;
    private final FuncionarioRepository funcionarioRepository;

    public AgendamentoService(AgendamentoRepository agendamentoRepository, 
                             FuncionarioRepository funcionarioRepository) {
        this.agendamentoRepository = agendamentoRepository;
        this.funcionarioRepository = funcionarioRepository;
    }

    public List<Agendamento> getAgendamentos() {
        return agendamentoRepository.findAll();
    }

    public Agendamento getAgendamento(Long id) {
        return agendamentoRepository.findById(id).orElse(null);
    }

    public List<Agendamento> getAgendamentosPorPet(String idPet) {
        return agendamentoRepository.findByIdPet(idPet);
    }

    public List<Agendamento> getAgendamentosPorVeterinario(Long idVeterinario) {
        return agendamentoRepository.findByVeterinarioIdFuncionario(idVeterinario);
    }

    public List<Agendamento> getAgendamentosPorStatus(Agendamento.StatusAgendamento status) {
        return agendamentoRepository.findByStatusAgendamento(status);
    }

    public Agendamento salvarAgendamento(Agendamento agendamento) {
        // Validação se o veterinário existe
        if (agendamento.getVeterinario() != null && agendamento.getVeterinario().getIdFuncionario() != null) {
            Optional<Funcionario> veterinarioOpt = funcionarioRepository.findById(agendamento.getVeterinario().getIdFuncionario());
            if (veterinarioOpt.isEmpty()) {
                throw new RuntimeException("Veterinário com ID " + agendamento.getVeterinario().getIdFuncionario() + " não encontrado");
            }
            agendamento.setVeterinario(veterinarioOpt.get());
        } else {
            throw new RuntimeException("Veterinário é obrigatório");
        }

        // Validação básica de data (não pode ser no passado)
        if (agendamento.getDataAgendamento() != null && agendamento.getDataAgendamento().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Data do agendamento não pode ser no passado");
        }

        // Se status não fornecido, usa o padrão AGENDADO
        if (agendamento.getStatusAgendamento() == null) {
            agendamento.setStatusAgendamento(Agendamento.StatusAgendamento.AGENDADO);
        }
        
        return agendamentoRepository.save(agendamento);
    }

    public Agendamento atualizarAgendamento(Long id, Agendamento agendamentoAtualizado) {
        Optional<Agendamento> agendamentoOpt = agendamentoRepository.findById(id);
        if (agendamentoOpt.isEmpty()) {
            throw new RuntimeException("Agendamento com ID " + id + " não encontrado");
        }

        Agendamento agendamento = agendamentoOpt.get();
        
        // Validação se o veterinário existe (se fornecido)
        if (agendamentoAtualizado.getVeterinario() != null && agendamentoAtualizado.getVeterinario().getIdFuncionario() != null) {
            Optional<Funcionario> veterinarioOpt = funcionarioRepository.findById(agendamentoAtualizado.getVeterinario().getIdFuncionario());
            if (veterinarioOpt.isEmpty()) {
                throw new RuntimeException("Veterinário com ID " + agendamentoAtualizado.getVeterinario().getIdFuncionario() + " não encontrado");
            }
            agendamento.setVeterinario(veterinarioOpt.get());
        }

        // Atualizar campos se fornecidos
        if (agendamentoAtualizado.getDataAgendamento() != null) {
            // CORREÇÃO: Validação de data mais flexível
            LocalDateTime agora = LocalDateTime.now();
            LocalDateTime novaData = agendamentoAtualizado.getDataAgendamento();
            
            // Permite datas no passado apenas para agendamentos já realizados/cancelados
            // ou se estiver sendo atualizado para status REALIZADO/CANCELADO
            if (novaData.isBefore(agora)) {
                Agendamento.StatusAgendamento statusAtual = agendamento.getStatusAgendamento();
                Agendamento.StatusAgendamento novoStatus = agendamentoAtualizado.getStatusAgendamento();
                
                boolean statusPermitePassado = (statusAtual == Agendamento.StatusAgendamento.REALIZADO ||
                                              statusAtual == Agendamento.StatusAgendamento.CANCELADO ||
                                              novoStatus == Agendamento.StatusAgendamento.REALIZADO ||
                                              novoStatus == Agendamento.StatusAgendamento.CANCELADO);
                
                if (!statusPermitePassado) {
                    throw new RuntimeException("Data do agendamento não pode ser no passado para agendamentos ativos");
                }
            }
            agendamento.setDataAgendamento(novaData);
        }

        // Atualizar outros campos
        if (agendamentoAtualizado.getTipoServico() != null) {
            agendamento.setTipoServico(agendamentoAtualizado.getTipoServico());
        }
        
        if (agendamentoAtualizado.getStatusAgendamento() != null) {
            agendamento.setStatusAgendamento(agendamentoAtualizado.getStatusAgendamento());
        }
        
        if (agendamentoAtualizado.getObservacoes() != null) {
            agendamento.setObservacoes(agendamentoAtualizado.getObservacoes());
        }
        
        if (agendamentoAtualizado.getValorEstimado() != null) {
            agendamento.setValorEstimado(agendamentoAtualizado.getValorEstimado());
        }

        // CORREÇÃO: Atualizar ID do pet se fornecido
        if (agendamentoAtualizado.getIdPet() != null) {
            agendamento.setIdPet(agendamentoAtualizado.getIdPet());
        }

        return agendamentoRepository.save(agendamento);
    }

    public Agendamento confirmarAgendamento(Long id) {
        Optional<Agendamento> agendamentoOpt = agendamentoRepository.findById(id);
        if (agendamentoOpt.isEmpty()) {
            throw new RuntimeException("Agendamento com ID " + id + " não encontrado");
        }

        Agendamento agendamento = agendamentoOpt.get();
        agendamento.setStatusAgendamento(Agendamento.StatusAgendamento.CONFIRMADO);
        return agendamentoRepository.save(agendamento);
    }

    public Agendamento cancelarAgendamento(Long id) {
        Optional<Agendamento> agendamentoOpt = agendamentoRepository.findById(id);
        if (agendamentoOpt.isEmpty()) {
            throw new RuntimeException("Agendamento com ID " + id + " não encontrado");
        }

        Agendamento agendamento = agendamentoOpt.get();
        agendamento.setStatusAgendamento(Agendamento.StatusAgendamento.CANCELADO);
        return agendamentoRepository.save(agendamento);
    }

    public Agendamento finalizarAgendamento(Long id) {
        Optional<Agendamento> agendamentoOpt = agendamentoRepository.findById(id);
        if (agendamentoOpt.isEmpty()) {
            throw new RuntimeException("Agendamento com ID " + id + " não encontrado");
        }

        Agendamento agendamento = agendamentoOpt.get();
        agendamento.setStatusAgendamento(Agendamento.StatusAgendamento.REALIZADO);
        return agendamentoRepository.save(agendamento);
    }

    public void excluirAgendamento(Long id) {
        if (agendamentoRepository.existsById(id)) {
            agendamentoRepository.deleteById(id);
        } else {
            throw new RuntimeException("Agendamento com ID " + id + " não encontrado");
        }
    }
}