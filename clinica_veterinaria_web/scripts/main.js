const API_BASE = "http://localhost:8080/api/gestor";

// Variáveis globais para armazenar dados
let especies = [];
let pets = [];
let funcionarios = [];
let agendamentos = [];

// Função para mostrar tabs
function showTab(tabName) {
  // Esconder todas as tabs
  $(".tab-content").removeClass("active");
  $(".nav-tab").removeClass("active");

  // Mostrar tab selecionada
  $("#" + tabName).addClass("active");
  $(`button[onclick="showTab('${tabName}')"]`).addClass("active");

  // Carregar dados quando necessário
  if (tabName === "especies") {
    carregarEspecies();
  } else if (tabName === "pets") {
    carregarPets();
    carregarEspeciesSelect();
  } else if (tabName === "funcionarios") {
    carregarFuncionarios();
  } else if (tabName === "agendamentos") {
    carregarAgendamentos();
    carregarPetsSelect();
    carregarVeterinarios();
  }
}

// Funções para mostrar alertas
function showAlert(containerId, message, type = "success") {
  const alertClass =
    type === "error"
      ? "alert-danger"
      : type === "info"
      ? "alert-info"
      : "alert-success";

  const alertHtml = `
                <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;

  $(`#${containerId}`).html(alertHtml);

  // Auto-hide após 5 segundos
  setTimeout(() => {
    $(`#${containerId} .alert`).fadeOut();
  }, 5000);
}

// ESPÉCIES
function carregarEspecies() {
  $("#especiesTableBody").html(
    '<tr><td colspan="5" class="loading">Carregando...</td></tr>'
  );

  $.get(`${API_BASE}/especies`)
    .done(function (data) {
      // Parse dos dados se necessário
      const response = typeof data === "string" ? JSON.parse(data) : data;

      // Verificar se a resposta tem sucesso e se existe o array data
      if (response.success && response.data) {
        especies = response.data; // Acessar o array dentro de data
      } else {
        especies = []; // Array vazio se não houver dados
        console.error("Resposta da API inválida:", response);
      }

      renderEspeciesTable();
    })
    .fail(function (xhr, status, error) {
      console.error("Erro ao carregar espécies:", error);
      showAlert("alertEspecie", "Erro ao carregar espécies", "error");
      especies = []; // Garantir que especies seja um array vazio
      renderEspeciesTable(); // Renderizar tabela vazia
    });
}

function renderEspeciesTable() {
  let html = "";
  especies.forEach((especie) => {
    html += `
                    <tr>
                        <td>${especie._id || especie.id}</td>
                        <td>${especie.nome_especie}</td>
                        <td>${especie.tipo_animal}</td>
                        <td>${especie.descricao || "-"}</td>
                        <td>
                            <button class="btn btn-warning" onclick="editarEspecie('${
                              especie._id || especie.id
                            }')">Editar</button>
                            <button class="btn btn-danger" onclick="deletarEspecie('${
                              especie._id || especie.id
                            }')">Excluir</button>
                        </td>
                    </tr>
                `;
  });
  $("#especiesTableBody").html(
    html || '<tr><td colspan="5">Nenhuma espécie encontrada</td></tr>'
  );
}

$("#especieForm").submit(function (e) {
  e.preventDefault();

  const formData = {
    nome_especie: $("#nome_especie").val(),
    tipo_animal: $("#tipo_animal").val(),
    descricao: $("#descricao_especie").val(),
  };

  $.ajax({
    url: `${API_BASE}/especies`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function () {
      showAlert("alertEspecie", "Espécie salva com sucesso!");
      limparFormEspecie();
      carregarEspecies();
    },
    error: function () {
      showAlert("alertEspecie", "Erro ao salvar espécie", "error");
    },
  });
});

let editandoEspecie = false;
let especieEditandoId = null;

function editarEspecie(id) {
  // Buscar a espécie pelo ID
  $.get(`${API_BASE}/especies/${id}`)
    .done(function (data) {
      const response = typeof data === "string" ? JSON.parse(data) : data;

      if (response.success && response.data) {
        const especie = response.data;

        // Preencher o formulário com os dados da espécie
        $("#nome_especie").val(especie.nome_especie);
        $("#tipo_animal").val(especie.tipo_animal);
        $("#descricao_especie").val(especie.descricao || "");

        // Marcar que estamos editando
        editandoEspecie = true;
        especieEditandoId = id;

        // Opcional: Mudar o texto do botão de submit
        $('#especieForm button[type="submit"]').text("Atualizar Espécie");

        // Opcional: Adicionar botão de cancelar se não existir
        if (!$("#cancelarEdicaoEspecie").length) {
          $('#especieForm button[type="submit"]').after(
            '<button type="button" id="cancelarEdicaoEspecie" class="btn btn-secondary ml-2">Cancelar</button>'
          );
        }

        showAlert("alertEspecie", "Espécie carregada para edição", "info");
      } else {
        showAlert("alertEspecie", "Erro ao carregar dados da espécie", "error");
      }
    })
    .fail(function () {
      showAlert(
        "alertEspecie",
        "Erro ao carregar espécie para edição",
        "error"
      );
    });
}

function cancelarEdicaoEspecie() {
  editandoEspecie = false;
  especieEditandoId = null;
  limparFormEspecie();
  $('#especieForm button[type="submit"]').text("Salvar Espécie");
  $("#cancelarEdicaoEspecie").remove();
}

// Modificar o submit do formulário para lidar com edição
$("#especieForm")
  .off("submit")
  .on("submit", function (e) {
    e.preventDefault();

    const formData = {
      nome_especie: $("#nome_especie").val(),
      tipo_animal: $("#tipo_animal").val(),
      descricao: $("#descricao_especie").val(),
    };

    if (editandoEspecie && especieEditandoId) {
      // Atualizar espécie existente
      $.ajax({
        url: `${API_BASE}/especies/${especieEditandoId}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function () {
          showAlert("alertEspecie", "Espécie atualizada com sucesso!");
          cancelarEdicaoEspecie();
          carregarEspecies();
        },
        error: function (xhr, status, error) {
          console.error("Erro ao atualizar espécie:", error);
          showAlert("alertEspecie", "Erro ao atualizar espécie", "error");
        },
      });
    } else {
      // Criar nova espécie
      $.ajax({
        url: `${API_BASE}/especies`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function () {
          showAlert("alertEspecie", "Espécie salva com sucesso!");
          limparFormEspecie();
          carregarEspecies();
        },
        error: function (xhr, status, error) {
          console.error("Erro ao salvar espécie:", error);
          showAlert("alertEspecie", "Erro ao salvar espécie", "error");
        },
      });
    }
  });

// Event listener para o botão cancelar (usando delegação de eventos)
$(document).on("click", "#cancelarEdicaoEspecie", function () {
  cancelarEdicaoEspecie();
});

function limparFormEspecie() {
  $("#especieForm")[0].reset();
}

function deletarEspecie(id) {
  if (confirm("Tem certeza que deseja excluir esta espécie?")) {
    $.ajax({
      url: `${API_BASE}/especies/${id}`,
      method: "DELETE",
      success: function () {
        showAlert("alertEspecie", "Espécie excluída com sucesso!");
        carregarEspecies();
      },
      error: function () {
        showAlert("alertEspecie", "Erro ao excluir espécie", "error");
      },
    });
  }
}

// PETS
function carregarPets() {
  $("#petsTableBody").html(
    '<tr><td colspan="8" class="loading">Carregando...</td></tr>'
  );

  $.get(`${API_BASE}/pets`)
    .done(function (data) {
      // Parse dos dados se necessário
      const response = typeof data === "string" ? JSON.parse(data) : data;

      // Verificar se a resposta tem sucesso e se existe o array data
      if (response.success && response.data) {
        pets = response.data;
      } else {
        pets = [];
        console.error("Resposta da API inválida:", response);
      }

      renderPetsTable();
    })
    .fail(function (xhr, status, error) {
      console.error("Erro ao carregar pets:", error);
      showAlert("alertPet", "Erro ao carregar pets", "error");
      pets = [];
      renderPetsTable();
    });
}

function renderPetsTable() {
  let html = "";
  pets.forEach((pet) => {
    // Como o pet já vem com o objeto especie completo, use ele diretamente
    const especieNome = pet.especie ? pet.especie.nome_especie : "N/A";

    // Formatação da data
    const dataCadastro = pet.data_cadastro
      ? new Date(pet.data_cadastro).toLocaleDateString("pt-BR")
      : "N/A";

    html += `
                    <tr>
                        <td>${pet._id || pet.id}</td>
                        <td>${pet.nome_pet}</td>
                        <td>${especieNome}</td>
                        <td>${pet.sexo}</td>
                        <td>${pet.nome_proprietario}</td>
                        <td>${pet.telefone_proprietario}</td>
                        <td>${dataCadastro}</td>
                        <td>
                            <button class="btn btn-warning" onclick="editarPet('${
                              pet._id || pet.id
                            }')">Editar</button>
                            <button class="btn btn-danger" onclick="deletarPet('${
                              pet._id || pet.id
                            }')">Excluir</button>
                        </td>
                    </tr>
                `;
  });
  $("#petsTableBody").html(
    html || '<tr><td colspan="8">Nenhum pet encontrado</td></tr>'
  );
}

function carregarEspeciesSelect() {
  $.get(`${API_BASE}/especies`)
    .done(function (data) {
      // Parse dos dados se necessário
      const response = typeof data === "string" ? JSON.parse(data) : data;

      // CORREÇÃO: Extrair o array data da resposta
      if (response.success && response.data) {
        especies = response.data;
      } else {
        especies = [];
        console.error("Resposta da API de espécies inválida:", response);
      }

      let options = '<option value="">Selecione uma espécie...</option>';
      especies.forEach((especie) => {
        options += `<option value="${especie._id || especie.id}">${
          especie.nome_especie
        }</option>`;
      });
      $("#id_especie").html(options);
    })
    .fail(function (xhr, status, error) {
      console.error("Erro ao carregar espécies:", error);
      especies = [];
      $("#id_especie").html(
        '<option value="">Erro ao carregar espécies</option>'
      );
    });
}

// Função para garantir que as espécies sejam carregadas antes dos pets
function carregarDadosPets() {
  // Carrega espécies primeiro (para o select)
  carregarEspeciesSelect();
  // Carrega pets
  carregarPets();
}

$("#petForm").submit(function (e) {
  e.preventDefault();

  const formData = {
    nome_pet: $("#nome_pet").val(),
    id_especie: $("#id_especie").val(),
    sexo: $("#sexo").val(),
    nome_proprietario: $("#nome_proprietario").val(),
    telefone_proprietario: $("#telefone_proprietario").val(),
    data_cadastro: $("#data_cadastro").val(),
  };

  $.ajax({
    url: `${API_BASE}/pets`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function () {
      showAlert("alertPet", "Pet salvo com sucesso!");
      limparFormPet();
      carregarPets();
    },
    error: function () {
      showAlert("alertPet", "Erro ao salvar pet", "error");
    },
  });
});

function limparFormPet() {
  $("#petForm")[0].reset();
}

let editandoPet = false;
let petIdEditando = null;

function editarPet(id) {
  console.log("Editando pet ID:", id);

  // Encontrar o pet na lista carregada
  const pet = pets.find((p) => (p._id || p.id) === id);

  if (!pet) {
    console.error("Pet não encontrado:", id);
    showAlert("alertPet", "Pet não encontrado", "error");
    return;
  }

  // Preencher o formulário com os dados do pet
  $("#nome_pet").val(pet.nome_pet);
  $("#id_especie").val(pet.id_especie);
  $("#sexo").val(pet.sexo);
  $("#nome_proprietario").val(pet.nome_proprietario);
  $("#telefone_proprietario").val(pet.telefone_proprietario);

  // Formatar a data para o input (YYYY-MM-DD)
  if (pet.data_cadastro) {
    const data = new Date(pet.data_cadastro);
    const dataFormatada = data.toISOString().split("T")[0];
    $("#data_cadastro").val(dataFormatada);
  }

  // Marcar que estamos editando
  editandoPet = true;
  petIdEditando = id;

  // Alterar o texto do botão e adicionar botão cancelar
  const submitBtn = $('#petForm button[type="submit"]');
  const cancelBtn = $("#cancelarEdicaoPet");

  submitBtn
    .text("Atualizar Pet")
    .removeClass("btn")
    .addClass("btn btn-success");

  if (cancelBtn.length === 0) {
    submitBtn.after(
      '<button type="button" id="cancelarEdicaoPet" class="btn btn-secondary" onclick="cancelarEdicaoPet()">Cancelar</button>'
    );
  }

  // Scroll para o formulário
  $("html, body").animate(
    {
      scrollTop: $("#petForm").offset().top - 100,
    },
    500
  );

  showAlert("alertPet", "Modo de edição ativado", "info");
}

function cancelarEdicaoPet() {
  editandoPet = false;
  petIdEditando = null;

  // Limpar formulário
  limparFormPet();

  // Restaurar botão original
  const submitBtn = $('#petForm button[type="submit"]');
  submitBtn.text("Salvar Pet").removeClass("btn-success").addClass("btn");

  // Remover botão cancelar
  $("#cancelarEdicaoPet").remove();

  showAlert("alertPet", "Edição cancelada", "info");
}

// Atualizar o submit do formulário para lidar com edição
$("#petForm")
  .off("submit")
  .on("submit", function (e) {
    e.preventDefault();

    const formData = {
      nome_pet: $("#nome_pet").val(),
      id_especie: $("#id_especie").val(),
      sexo: $("#sexo").val(),
      nome_proprietario: $("#nome_proprietario").val(),
      telefone_proprietario: $("#telefone_proprietario").val(),
      data_cadastro: $("#data_cadastro").val(),
    };

    console.log("Dados do formulário:", formData);
    console.log("Editando:", editandoPet, "ID:", petIdEditando);

    if (editandoPet && petIdEditando) {
      // Atualizar pet existente
      $.ajax({
        url: `${API_BASE}/pets/${petIdEditando}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
          console.log("Pet atualizado com sucesso:", response);
          showAlert("alertPet", "Pet atualizado com sucesso!");
          cancelarEdicaoPet(); // Limpa o modo de edição
          carregarPets();
        },
        error: function (xhr, status, error) {
          console.error("Erro ao atualizar pet:", {
            status: xhr.status,
            statusText: xhr.statusText,
            responseText: xhr.responseText,
            error: error,
          });

          let errorMessage = "Erro ao atualizar pet";
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            if (errorResponse.message) {
              errorMessage = errorResponse.message;
            }
          } catch (e) {
            errorMessage = xhr.responseText || "Erro desconhecido";
          }

          showAlert("alertPet", errorMessage, "error");
        },
      });
    } else {
      // Criar novo pet
      $.ajax({
        url: `${API_BASE}/pets`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
          console.log("Pet criado com sucesso:", response);
          showAlert("alertPet", "Pet salvo com sucesso!");
          limparFormPet();
          carregarPets();
        },
        error: function (xhr, status, error) {
          console.error("Erro ao salvar pet:", {
            status: xhr.status,
            statusText: xhr.statusText,
            responseText: xhr.responseText,
            error: error,
          });

          let errorMessage = "Erro ao salvar pet";
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            if (errorResponse.message) {
              errorMessage = errorResponse.message;
            }
          } catch (e) {
            errorMessage = xhr.responseText || "Erro desconhecido";
          }

          showAlert("alertPet", errorMessage, "error");
        },
      });
    }
  });

function deletarPet(id) {
  console.log("Tentando deletar pet ID:", id);

  // Encontrar o pet para mostrar informações na confirmação
  const pet = pets.find((p) => (p._id || p.id) === id);
  const nomePet = pet ? pet.nome_pet : "este pet";

  if (confirm(`Tem certeza que deseja excluir ${nomePet}?`)) {
    $.ajax({
      url: `${API_BASE}/pets/${id}`,
      method: "DELETE",
      success: function (response) {
        console.log("Pet deletado com sucesso:", response);
        showAlert("alertPet", `${nomePet} foi excluído com sucesso!`);
        carregarPets();

        // Se estávamos editando este pet, cancelar a edição
        if (editandoPet && petIdEditando === id) {
          cancelarEdicaoPet();
        }
      },
      error: function (xhr, status, error) {
        console.error("Erro ao deletar pet:", {
          status: xhr.status,
          statusText: xhr.statusText,
          responseText: xhr.responseText,
          error: error,
        });

        let errorMessage = `Erro ao excluir ${nomePet}`;
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          if (errorResponse.message) {
            errorMessage = errorResponse.message;
          }
        } catch (e) {
          errorMessage = xhr.responseText || "Erro desconhecido ao excluir";
        }

        showAlert("alertPet", errorMessage, "error");
      },
    });
  }
}

function limparFormPet() {
  $("#petForm")[0].reset();

  // Se estava em modo de edição, cancelar
  if (editandoPet) {
    cancelarEdicaoPet();
  }
}

// FUNCIONÁRIOS
let editandoFuncionario = false;
let funcionarioEditandoId = null;

function carregarFuncionarios() {
  $("#funcionariosTableBody").html(
    '<tr><td colspan="6" class="loading">Carregando...</td></tr>'
  );

  $.get(`${API_BASE}/funcionarios`)
    .done(function (data) {
      funcionarios = typeof data === "string" ? JSON.parse(data) : data;
      renderFuncionariosTable();
    })
    .fail(function (xhr, status, error) {
      console.error("Erro ao carregar funcionários:", error);
      showAlert("alertFuncionario", "Erro ao carregar funcionários", "error");
      $("#funcionariosTableBody").html(
        '<tr><td colspan="6">Erro ao carregar dados</td></tr>'
      );
    });
}

function renderFuncionariosTable() {
  let html = "";
  if (funcionarios && funcionarios.length > 0) {
    funcionarios.forEach((funcionario) => {
      // Correção: usar idFuncionario em vez de id
      const id = funcionario.idFuncionario || funcionario.id;
      html += `
                        <tr>
                            <td>${id || "N/A"}</td>
                            <td>${funcionario.nome || ""}</td>
                            <td>${funcionario.cargo || ""}</td>
                            <td>${funcionario.telefone || ""}</td>
                            <td>${
                              funcionario.ativo == 1 ? "Ativo" : "Inativo"
                            }</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="editarFuncionario(${id})">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="deletarFuncionario(${id})">Excluir</button>
                            </td>
                        </tr>
                    `;
    });
  }
  $("#funcionariosTableBody").html(
    html || '<tr><td colspan="6">Nenhum funcionário encontrado</td></tr>'
  );
}

$("#funcionarioForm").submit(function (e) {
  e.preventDefault();

  const formData = {
    nome: $("#nome_funcionario").val().trim(),
    cargo: $("#cargo").val().trim(),
    telefone: $("#telefone_funcionario").val().trim(),
    ativo: parseInt($("#ativo").val()),
  };

  // Validação básica
  if (!formData.nome || !formData.cargo || !formData.telefone) {
    showAlert(
      "alertFuncionario",
      "Preencha todos os campos obrigatórios",
      "error"
    );
    return;
  }

  const url = editandoFuncionario
    ? `${API_BASE}/funcionarios/${funcionarioEditandoId}`
    : `${API_BASE}/funcionarios`;

  const method = editandoFuncionario ? "PUT" : "POST";

  $.ajax({
    url: url,
    method: method,
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function (response) {
      const mensagem = editandoFuncionario
        ? "Funcionário atualizado com sucesso!"
        : "Funcionário salvo com sucesso!";
      showAlert("alertFuncionario", mensagem);
      limparFormFuncionario();
      carregarFuncionarios();
    },
    error: function (xhr, status, error) {
      console.error("Erro ao salvar funcionário:", error);
      console.error("Response:", xhr.responseText);
      showAlert("alertFuncionario", "Erro ao salvar funcionário", "error");
    },
  });
});

function editarFuncionario(id) {
  // Buscar o funcionário pelo ID
  const funcionario = funcionarios.find((f) => (f.idFuncionario || f.id) == id);

  if (!funcionario) {
    showAlert("alertFuncionario", "Funcionário não encontrado", "error");
    return;
  }

  // Preencher o formulário com os dados do funcionário
  $("#nome_funcionario").val(funcionario.nome || "");
  $("#cargo").val(funcionario.cargo || "");
  $("#telefone_funcionario").val(funcionario.telefone || "");
  $("#ativo").val(funcionario.ativo || 1);

  // Marcar como editando
  editandoFuncionario = true;
  funcionarioEditandoId = id;

  // Alterar o texto do botão
  $('#funcionarioForm button[type="submit"]').text("Atualizar Funcionário");

  // Scroll para o formulário
  $("html, body").animate(
    {
      scrollTop: $("#funcionarioForm").offset().top - 100,
    },
    500
  );

  showAlert("alertFuncionario", "Funcionário carregado para edição", "info");
}

function cancelarEdicao() {
  limparFormFuncionario();
}

function limparFormFuncionario() {
  $("#funcionarioForm")[0].reset();
  editandoFuncionario = false;
  funcionarioEditandoId = null;
  $('#funcionarioForm button[type="submit"]').text("Salvar Funcionário");
}

function deletarFuncionario(id) {
  if (!confirm("Tem certeza que deseja excluir este funcionário?")) {
    return;
  }

  $.ajax({
    url: `${API_BASE}/funcionarios/${id}`,
    method: "DELETE",
    success: function (response) {
      showAlert("alertFuncionario", "Funcionário excluído com sucesso!");
      carregarFuncionarios();
    },
    error: function (xhr, status, error) {
      console.error("Erro ao excluir funcionário:", error);
      showAlert("alertFuncionario", "Erro ao excluir funcionário", "error");
    },
  });
}

// Função para mostrar alertas (se não existir)
function showAlert(elementId, message, type = "success") {
  const alertClass =
    type === "error"
      ? "alert-danger"
      : type === "info"
      ? "alert-info"
      : "alert-success";

  const alertHtml = `
                <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;

  $(`#${elementId}`).html(alertHtml);

  // Auto-hide após 5 segundos
  setTimeout(() => {
    $(`#${elementId} .alert`).fadeOut();
  }, 5000);
}

// AGENDAMENTOS
let editandoAgendamento = false;
let agendamentoEditandoId = null;

function carregarAgendamentos() {
  $("#agendamentosTableBody").html(
    '<tr><td colspan="8" class="loading">Carregando...</td></tr>'
  );

  // Garantir que pets e funcionarios sejam arrays antes de carregar agendamentos
  if (!Array.isArray(pets)) {
    pets = [];
  }
  if (!Array.isArray(funcionarios)) {
    funcionarios = [];
  }

  $.get(`${API_BASE}/agendamentos`)
    .done(function (data) {
      agendamentos = typeof data === "string" ? JSON.parse(data) : data;
      renderAgendamentosTable();
    })
    .fail(function (xhr, status, error) {
      console.error("Erro ao carregar agendamentos:", error);
      showAlert("alertAgendamento", "Erro ao carregar agendamentos", "error");
      $("#agendamentosTableBody").html(
        '<tr><td colspan="8">Erro ao carregar dados</td></tr>'
      );
    });
}

function renderAgendamentosTable() {
  let html = "";
  if (agendamentos && agendamentos.length > 0) {
    agendamentos.forEach((agendamento) => {
      // Correção: verificar diferentes possíveis nomes do campo ID
      const id = agendamento.idAgendamento || agendamento.id;

      // Buscar pet pelo ID com diferentes formatos possíveis - verificar se pets é array
      let pet = null;
      if (Array.isArray(pets) && pets.length > 0) {
        pet = pets.find((p) => {
          const petId = p._id || p.id;
          return petId === agendamento.idPet || petId == agendamento.idPet;
        });
      }

      // Buscar funcionário pelo ID corrigindo a referência - verificar se funcionarios é array
      let funcionario = null;
      if (Array.isArray(funcionarios) && funcionarios.length > 0) {
        funcionario = funcionarios.find((f) => {
          const funcId = f.idFuncionario || f.id;
          const veterinarioId =
            agendamento.veterinario?.idFuncionario ||
            agendamento.idFuncionario ||
            agendamento.veterinario?.id;
          return funcId == veterinarioId;
        });
      }

      // Formatação da data
      let dataFormatada = "N/A";
      if (agendamento.dataAgendamento) {
        try {
          dataFormatada = new Date(agendamento.dataAgendamento).toLocaleString(
            "pt-BR"
          );
        } catch (e) {
          dataFormatada = agendamento.dataAgendamento;
        }
      }

      html += `
                        <tr>
                            <td>${id || "N/A"}</td>
                            <td>${
                              pet
                                ? pet.nome_pet || pet.nome
                                : "Pet não encontrado"
                            }</td>
                            <td>${dataFormatada}</td>
                            <td>${agendamento.tipoServico || "N/A"}</td>
                            <td><span class="badge bg-${getStatusBadgeClass(
                              agendamento.statusAgendamento
                            )}">${
        agendamento.statusAgendamento || "N/A"
      }</span></td>
                            <td>${
                              funcionario
                                ? funcionario.nome
                                : "Veterinário não encontrado"
                            }</td>
                            <td>R$ ${
                              agendamento.valorEstimado
                                ? agendamento.valorEstimado.toFixed(2)
                                : "0,00"
                            }</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="editarAgendamento(${id})">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="deletarAgendamento(${id})">Excluir</button>
                            </td>
                        </tr>
                    `;
    });
  }
  $("#agendamentosTableBody").html(
    html || '<tr><td colspan="8">Nenhum agendamento encontrado</td></tr>'
  );
}

function getStatusBadgeClass(status) {
  const statusClasses = {
    AGENDADO: "primary",
    CONFIRMADO: "success",
    CANCELADO: "danger",
    REALIZADO: "info",
    EM_ANDAMENTO: "warning",
  };
  return statusClasses[status] || "secondary";
}

function carregarPetsSelect() {
  return carregarPetsSelectPromise();
}

function carregarVeterinarios() {
  return carregarVeterinariosPromise();
}

$("#agendamentoForm").submit(function (e) {
  e.preventDefault();

  const formData = {
    idPet: $("#idPet").val(),
    dataAgendamento: $("#dataAgendamento").val(),
    tipoServico: $("#tipoServico").val().trim(),
    statusAgendamento: $("#statusAgendamento").val(),
    observacoes: $("#observacoes").val().trim(),
    valorEstimado: parseFloat($("#valorEstimado").val()) || 0,
    veterinario: {
      idFuncionario: parseInt($("#idFuncionario").val()),
    },
  };

  // Validação básica
  if (
    !formData.idPet ||
    !formData.dataAgendamento ||
    !formData.tipoServico ||
    !formData.veterinario.idFuncionario
  ) {
    showAlert(
      "alertAgendamento",
      "Preencha todos os campos obrigatórios",
      "error"
    );
    return;
  }

  const url = editandoAgendamento
    ? `${API_BASE}/agendamentos/${agendamentoEditandoId}`
    : `${API_BASE}/agendamentos`;

  const method = editandoAgendamento ? "PUT" : "POST";

  $.ajax({
    url: url,
    method: method,
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function (response) {
      const mensagem = editandoAgendamento
        ? "Agendamento atualizado com sucesso!"
        : "Agendamento salvo com sucesso!";
      showAlert("alertAgendamento", mensagem);
      limparFormAgendamento();
      carregarAgendamentos();
    },
    error: function (xhr, status, error) {
      console.error("Erro ao salvar agendamento:", error);
      console.error("Response:", xhr.responseText);
      let mensagem = "Erro ao salvar agendamento";
      if (xhr.responseText) {
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          mensagem = errorResponse.message || mensagem;
        } catch (e) {
          mensagem = xhr.responseText;
        }
      }
      showAlert("alertAgendamento", mensagem, "error");
    },
  });
});

function editarAgendamento(id) {
  // Buscar o agendamento pelo ID
  const agendamento = agendamentos.find((a) => (a.idAgendamento || a.id) == id);

  if (!agendamento) {
    showAlert("alertAgendamento", "Agendamento não encontrado", "error");
    return;
  }

  // Preencher o formulário com os dados do agendamento
  $("#idPet").val(agendamento.idPet || "");

  // Formatação da data para o input datetime-local
  if (agendamento.dataAgendamento) {
    try {
      const data = new Date(agendamento.dataAgendamento);
      const dataFormatada = data.toISOString().slice(0, 16);
      $("#dataAgendamento").val(dataFormatada);
    } catch (e) {
      $("#dataAgendamento").val("");
    }
  }

  $("#tipoServico").val(agendamento.tipoServico || "");
  $("#statusAgendamento").val(agendamento.statusAgendamento || "AGENDADO");
  $("#observacoes").val(agendamento.observacoes || "");
  $("#valorEstimado").val(agendamento.valorEstimado || "");

  // Preencher veterinário
  const veterinarioId =
    agendamento.veterinario?.idFuncionario ||
    agendamento.idFuncionario ||
    agendamento.veterinario?.id;
  $("#idFuncionario").val(veterinarioId || "");

  // Marcar como editando
  editandoAgendamento = true;
  agendamentoEditandoId = id;

  // Alterar o texto do botão
  $('#agendamentoForm button[type="submit"]').text("Atualizar Agendamento");

  // Scroll para o formulário
  $("html, body").animate(
    {
      scrollTop: $("#agendamentoForm").offset().top - 100,
    },
    500
  );

  showAlert("alertAgendamento", "Agendamento carregado para edição", "info");
}

function cancelarEdicao() {
  limparFormAgendamento();
}

function limparFormAgendamento() {
  $("#agendamentoForm")[0].reset();
  editandoAgendamento = false;
  agendamentoEditandoId = null;
  $('#agendamentoForm button[type="submit"]').text("Salvar Agendamento");
}

function deletarAgendamento(id) {
  if (!confirm("Tem certeza que deseja excluir este agendamento?")) {
    return;
  }

  $.ajax({
    url: `${API_BASE}/agendamentos/${id}`,
    method: "DELETE",
    success: function (response) {
      showAlert("alertAgendamento", "Agendamento excluído com sucesso!");
      carregarAgendamentos();
    },
    error: function (xhr, status, error) {
      console.error("Erro ao excluir agendamento:", error);
      showAlert("alertAgendamento", "Erro ao excluir agendamento", "error");
    },
  });
}

// Função para inicializar tudo na ordem correta
function inicializarAgendamentos() {
  // Inicializar arrays vazios
  pets = [];
  funcionarios = [];
  agendamentos = [];

  // Carregar dados na sequência correta
  Promise.all([carregarPetsSelectPromise(), carregarVeterinariosPromise()])
    .then(() => {
      // Só carrega agendamentos após pets e funcionários estarem carregados
      carregarAgendamentos();
    })
    .catch((error) => {
      console.error("Erro ao inicializar agendamentos:", error);
      showAlert("alertAgendamento", "Erro ao carregar dados iniciais", "error");
    });
}

// Versão Promise do carregarPetsSelect
function carregarPetsSelectPromise() {
  return $.get(`${API_BASE}/pets`)
    .done(function (data) {
      // Parse dos dados se necessário
      const response = typeof data === "string" ? JSON.parse(data) : data;

      // CORREÇÃO: Extrair o array data da resposta
      if (response.success && response.data) {
        pets = response.data;
      } else {
        pets = [];
        console.error("Resposta da API de pets inválida:", response);
      }

      let options = '<option value="">Selecione um pet...</option>';
      if (pets.length > 0) {
        pets.forEach((pet) => {
          const petId = pet._id || pet.id;
          const nomePet = pet.nome_pet || pet.nome;
          const nomeProprietario =
            pet.nome_proprietario ||
            pet.proprietario ||
            "Proprietário não informado";
          options += `<option value="${petId}">${nomePet} - ${nomeProprietario}</option>`;
        });
      }
      $("#idPet").html(options);
    })
    .fail(function (xhr, status, error) {
      console.error("Erro ao carregar pets:", error);
      pets = [];
      $("#idPet").html('<option value="">Erro ao carregar pets</option>');
    });
}

// Versão Promise do carregarVeterinarios
function carregarVeterinariosPromise() {
  return $.get(`${API_BASE}/funcionarios`)
    .done(function (data) {
      funcionarios = typeof data === "string" ? JSON.parse(data) : data;
      if (!Array.isArray(funcionarios)) {
        funcionarios = [];
      }
      let options = '<option value="">Selecione um veterinário...</option>';
      if (funcionarios.length > 0) {
        funcionarios
          .filter((f) => {
            const cargo = (f.cargo || "").toUpperCase();
            const ativo = f.ativo == 1 || f.ativo === true;
            return (
              (cargo === "VETERINARIO" || cargo === "VETERINÁRIO") && ativo
            );
          })
          .forEach((funcionario) => {
            const funcId = funcionario.idFuncionario || funcionario.id;
            options += `<option value="${funcId}">${funcionario.nome}</option>`;
          });
      }
      $("#idFuncionario").html(options);
    })
    .fail(function () {
      console.error("Erro ao carregar veterinários");
      funcionarios = [];
      $("#idFuncionario").html(
        '<option value="">Erro ao carregar veterinários</option>'
      );
    });
}

// RELATÓRIOS
function carregarPetsComEspecies() {
  $("#relatorioContent").html('<p class="loading">Carregando relatório...</p>');
  $("#relatorioTitle").text("Pets com Espécies");

  // CORREÇÃO: Usar endpoint do gestor que combina os dados
  $.get(`${API_BASE}/pets-com-especies`)
    .done(function (data) {
      try {
        // Parse da resposta
        const response = typeof data === "string" ? JSON.parse(data) : data;
        console.log("Resposta pets com espécies:", response);

        // Verificar se há erro na resposta
        if (response.error) {
          throw new Error(response.error);
        }

        // Extrair dados
        const pets = response.pets || [];
        const especies = response.especies || [];

        if (!Array.isArray(pets) || pets.length === 0) {
          $("#relatorioContent").html("<p>Nenhum pet encontrado.</p>");
          return;
        }

        let html = `
                            <div class="relatorio-header">
                                <h3>Relatório: Pets com Espécies</h3>
                                <p>Total de registros: ${pets.length}</p>
                            </div>
                            <table class="relatorio-table">
                                <thead>
                                    <tr>
                                        <th>Pet</th>
                                        <th>Espécie</th>
                                        <th>Tipo Animal</th>
                                        <th>Proprietário</th>
                                        <th>Telefone</th>
                                        <th>Data Cadastro</th>
                                    </tr>
                                </thead>
                                <tbody>
                        `;

        pets.forEach((pet) => {
          // Buscar espécie correspondente
          const especie = especies.find((e) => {
            const especieId = e._id || e.id;
            const petEspecieId = pet.id_especie;
            return especieId === petEspecieId;
          });

          // Formatar data
          const dataFormatada = pet.data_cadastro
            ? new Date(pet.data_cadastro).toLocaleDateString("pt-BR")
            : "N/A";

          html += `
                                <tr>
                                    <td>${pet.nome_pet || "N/A"}</td>
                                    <td>${
                                      especie ? especie.nome_especie : "N/A"
                                    }</td>
                                    <td>${
                                      especie ? especie.tipo_animal : "N/A"
                                    }</td>
                                    <td>${pet.nome_proprietario || "N/A"}</td>
                                    <td>${
                                      pet.telefone_proprietario || "N/A"
                                    }</td>
                                    <td>${dataFormatada}</td>
                                </tr>
                            `;
        });

        html += "</tbody></table>";
        $("#relatorioContent").html(html);
      } catch (error) {
        console.error("Erro ao processar dados:", error);
        showAlert(
          "alertRelatorio",
          "Erro ao processar dados do relatório: " + error.message,
          "error"
        );
      }
    })
    .fail(function (xhr, status, error) {
      console.error("Erro na requisição:", error);
      console.error("Resposta:", xhr.responseText);
      showAlert(
        "alertRelatorio",
        "Erro ao carregar relatório: " + error,
        "error"
      );
    });
}

// PETS COM AGENDAMENTOS
function carregarPetsComAgendamentos() {
  $("#relatorioContent").html('<p class="loading">Carregando relatório...</p>');
  $("#relatorioTitle").text("Pets com Agendamentos");

  // CORREÇÃO: Usar endpoint do gestor que combina os dados
  $.get(`${API_BASE}/pets-com-agendamentos`)
    .done(function (data) {
      try {
        // Parse da resposta
        const response = typeof data === "string" ? JSON.parse(data) : data;
        console.log("Resposta pets com agendamentos:", response);

        // Verificar se há erro na resposta
        if (response.error) {
          throw new Error(response.error);
        }

        // Extrair dados
        const pets = response.pets || [];
        const agendamentos = response.agendamentos || [];
        const funcionarios = response.funcionarios || [];

        if (!Array.isArray(agendamentos) || agendamentos.length === 0) {
          $("#relatorioContent").html("<p>Nenhum agendamento encontrado.</p>");
          return;
        }

        let html = `
                            <div class="relatorio-header">
                                <h3>Relatório: Pets com Agendamentos</h3>
                                <p>Total de registros: ${agendamentos.length}</p>
                            </div>
                            <table class="relatorio-table">
                                <thead>
                                    <tr>
                                        <th>Pet</th>
                                        <th>Proprietário</th>
                                        <th>Data Agendamento</th>
                                        <th>Tipo Serviço</th>
                                        <th>Status</th>
                                        <th>Veterinário</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                        `;

        agendamentos.forEach((agendamento) => {
          // Buscar pet correspondente
          const pet = pets.find((p) => {
            const petId = p._id || p.id;
            return petId === agendamento.idPet;
          });

          // Buscar funcionário/veterinário
          const funcionario = funcionarios.find((f) => {
            const funcId = f.id || f.idFuncionario;
            const agendVetId =
              agendamento.veterinario?.idFuncionario ||
              agendamento.idVeterinario;
            return funcId === agendVetId;
          });

          // Formatar data e hora
          const dataFormatada = agendamento.dataAgendamento
            ? new Date(agendamento.dataAgendamento).toLocaleString("pt-BR")
            : "N/A";

          // Formatar valor
          const valorFormatado = agendamento.valorEstimado
            ? "R$ " +
              parseFloat(agendamento.valorEstimado).toFixed(2).replace(".", ",")
            : "R$ 0,00";

          html += `
                                <tr>
                                    <td>${
                                      pet ? pet.nome_pet : "Pet não encontrado"
                                    }</td>
                                    <td>${
                                      pet ? pet.nome_proprietario : "N/A"
                                    }</td>
                                    <td>${dataFormatada}</td>
                                    <td>${agendamento.tipoServico || "N/A"}</td>
                                    <td><span class="status-${agendamento.statusAgendamento?.toLowerCase()}">${
            agendamento.statusAgendamento || "N/A"
          }</span></td>
                                    <td>${
                                      funcionario ? funcionario.nome : "N/A"
                                    }</td>
                                    <td>${valorFormatado}</td>
                                </tr>
                            `;
        });

        html += "</tbody></table>";
        $("#relatorioContent").html(html);
      } catch (error) {
        console.error("Erro ao processar dados:", error);
        showAlert(
          "alertRelatorio",
          "Erro ao processar dados do relatório: " + error.message,
          "error"
        );
      }
    })
    .fail(function (xhr, status, error) {
      console.error("Erro na requisição:", error);
      console.error("Resposta:", xhr.responseText);
      showAlert(
        "alertRelatorio",
        "Erro ao carregar relatório: " + error,
        "error"
      );
    });
}

// Inicialização
$(document).ready(function () {
  // Definir data atual como padrão
  $("#data_cadastro").val(new Date().toISOString().split("T")[0]);

  // Carregar dados iniciais
  carregarEspecies();
});
