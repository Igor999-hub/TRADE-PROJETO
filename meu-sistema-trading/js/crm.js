/*
 * ================================================
 * CRM.JS - GERENCIADOR FINANCEIRO
 * ================================================
 * Este arquivo controla:
 * 1. Registro de operações (Wins e Losses)
 * 2. Cálculo de lucro/perda do dia
 * 3. Cálculo de trades necessários para recuperação
 * 4. Histórico de operações
 * ================================================
 */

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('💰 Módulo CRM carregado');
    
    // ===== PEGAR ELEMENTOS DA PÁGINA =====
    const formOperacao = document.getElementById('formOperacao');
    const lucroHojeEl = document.getElementById('lucroHoje');
    const perdaHojeEl = document.getElementById('perdaHoje');
    const saldoDiaEl = document.getElementById('saldoDia');
    const tradesRecuperarEl = document.getElementById('tradesRecuperar');
    const historicoLista = document.getElementById('historicoLista');
    
    // ===== BANCO DE DADOS LOCAL (LocalStorage) =====
    // LocalStorage é como um "caderninho" do navegador
    // Guarda informações mesmo depois de fechar o site
    
    // CONFIGURAÇÕES DO USUÁRIO
    const CONFIG_PADRAO = {
        valorMedioTrade: 50, // Valor médio por operação
        metaRecuperacao: 2,  // Média de trades para recuperar 1 loss
        payout: 0.80         // 80% de retorno (padrão opções binárias)
    };
    
    // Função para pegar operações salvas
    function getOperacoes() {
        const dados = localStorage.getItem('operacoes');
        return dados ? JSON.parse(dados) : [];
    }
    
    // Função para salvar operações
    function salvarOperacoes(operacoes) {
        localStorage.setItem('operacoes', JSON.stringify(operacoes));
    }
    
    // Função para pegar configurações
    function getConfig() {
        const config = localStorage.getItem('config');
        return config ? JSON.parse(config) : CONFIG_PADRAO;
    }
    
    // ===== CALCULAR ESTATÍSTICAS DO DIA =====
    function calcularEstatisticas() {
        
        const operacoes = getOperacoes();
        const hoje = new Date().toLocaleDateString('pt-BR');
        
        // Filtrar apenas operações de hoje
        const operacoesHoje = operacoes.filter(op => {
            const dataOp = new Date(op.data).toLocaleDateString('pt-BR');
            return dataOp === hoje;
        });
        
        // Inicializar contadores
        let lucroTotal = 0;
        let perdaTotal = 0;
        let wins = 0;
        let losses = 0;
        
        // SOMAR wins e losses
        operacoesHoje.forEach(op => {
            if (op.tipo === 'win') {
                lucroTotal += op.valor;
                wins++;
            } else {
                perdaTotal += op.valor;
                losses++;
            }
        });
        
        // Calcular saldo
        const saldoDia = lucroTotal - perdaTotal;
        
        // Calcular quantos trades precisa para recuperar
        const config = getConfig();
        let tradesParaRecuperar = 0;
        
        if (saldoDia < 0) {
            // Se está negativo, calcular quantos wins precisa
            const valorPorWin = config.valorMedioTrade * config.payout;
            tradesParaRecuperar = Math.ceil(Math.abs(saldoDia) / valorPorWin);
        }
        
        return {
            lucroTotal,
            perdaTotal,
            saldoDia,
            tradesParaRecuperar,
            wins,
            losses
        };
    }
    
    // ===== ATUALIZAR DASHBOARD =====
    function atualizarDashboard() {
        
        const stats = calcularEstatisticas();
        
        // Atualizar valores nos cards
        lucroHojeEl.textContent = formatarDinheiro(stats.lucroTotal);
        perdaHojeEl.textContent = formatarDinheiro(stats.perdaTotal);
        
        // Colorir saldo (verde se positivo, vermelho se negativo)
        saldoDiaEl.textContent = formatarDinheiro(stats.saldoDia);
        if (stats.saldoDia >= 0) {
            saldoDiaEl.style.color = '#10b981';
        } else {
            saldoDiaEl.style.color = '#ef4444';
        }
        
        // Mostrar trades para recuperar
        tradesRecuperarEl.textContent = stats.tradesParaRecuperar;
        
        console.log('📊 Dashboard atualizado:', stats);
    }
    
    // ===== RENDERIZAR HISTÓRICO =====
    function renderizarHistorico() {
        
        const operacoes = getOperacoes();
        const hoje = new Date().toLocaleDateString('pt-BR');
        
        // Filtrar operações de hoje
        const operacoesHoje = operacoes.filter(op => {
            const dataOp = new Date(op.data).toLocaleDateString('pt-BR');
            return dataOp === hoje;
        }).reverse(); // Mais recente primeiro
        
        // Limpar lista
        historicoLista.innerHTML = '';
        
        // Se não tem operações
        if (operacoesHoje.length === 0) {
            historicoLista.innerHTML = '<p class="empty-message">Nenhuma operação registrada hoje</p>';
            return;
        }
        
        // Criar HTML para cada operação
        operacoesHoje.forEach((op, index) => {
            const item = document.createElement('div');
            item.className = `operacao-item ${op.tipo}`;
            
            const icone = op.tipo === 'win' ? '✅' : '❌';
            const textoTipo = op.tipo === 'win' ? 'WIN' : 'LOSS';
            const corValor = op.tipo === 'win' ? 'var(--success)' : 'var(--danger)';
            const sinalValor = op.tipo === 'win' ? '+' : '-';
            
            item.innerHTML = `
                <div class="operacao-info">
                    <span class="operacao-tipo">${icone} ${textoTipo}</span>
                    <span>${formatarHora(op.horario)}</span>
                </div>
                <div>
                    <span class="operacao-valor" style="color: ${corValor}">
                        ${sinalValor} ${formatarDinheiro(op.valor)}
                    </span>
                    <button class="btn-delete" onclick="deletarOperacao(${index})" title="Deletar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            historicoLista.appendChild(item);
        });
    }
    
    // ===== ADICIONAR NOVA OPERAÇÃO =====
    formOperacao.addEventListener('submit', function(e) {
        e.preventDefault(); // Impede o formulário de recarregar a página
        
        // Pegar valores do formulário
        const tipo = document.getElementById('tipoOperacao').value;
        const valor = parseFloat(document.getElementById('valorOperacao').value);
        const horario = document.getElementById('horarioOperacao').value;
        
        // Validar
        if (!tipo || !valor || !horario) {
            mostrarMensagem('❌ Preencha todos os campos!', 'erro');
            return;
        }
        
        // Criar objeto da operação
        const novaOperacao = {
            id: Date.now(), // ID único baseado no timestamp
            tipo: tipo,
            valor: valor,
            horario: horario,
            data: new Date().toISOString()
        };
        
        // Adicionar ao array de operações
        const operacoes = getOperacoes();
        operacoes.push(novaOperacao);
        salvarOperacoes(operacoes);
        
        // Atualizar interface
        atualizarDashboard();
        renderizarHistorico();
        
        // Limpar formulário
        formOperacao.reset();
        
        // Mensagem de sucesso
        const icone = tipo === 'win' ? '✅' : '❌';
        mostrarMensagem(`${icone} Operação registrada com sucesso!`, 'sucesso');
    });
    
    // ===== DELETAR OPERAÇÃO =====
    // Função global para poder ser chamada do HTML
    window.deletarOperacao = function(indexRelativo) {
        
        if (!confirm('Tem certeza que deseja deletar esta operação?')) {
            return;
        }
        
        const operacoes = getOperacoes();
        const hoje = new Date().toLocaleDateString('pt-BR');
        
        // Encontrar operações de hoje
        const operacoesHoje = operacoes.filter(op => {
            const dataOp = new Date(op.data).toLocaleDateString('pt-BR');
            return dataOp === hoje;
        }).reverse();
        
        // Pegar a operação específica
        const opParaDeletar = operacoesHoje[indexRelativo];
        
        // Encontrar índice real no array completo
        const indexReal = operacoes.findIndex(op => op.id === opParaDeletar.id);
        
        // Remover
        if (indexReal !== -1) {
            operacoes.splice(indexReal, 1);
            salvarOperacoes(operacoes);
            
            // Atualizar interface
            atualizarDashboard();
            renderizarHistorico();
            
            mostrarMensagem('🗑️ Operação deletada!', 'sucesso');
        }
    };
    
    // ===== FUNÇÃO PARA RESETAR DIA =====
    // Útil para começar um novo dia de trading
    window.resetarDia = function() {
        if (!confirm('Isso vai limpar todas as operações de hoje. Confirma?')) {
            return;
        }
        
        const operacoes = getOperacoes();
        const hoje = new Date().toLocaleDateString('pt-BR');
        
        // Manter apenas operações de outros dias
        const operacoesOutrosDias = operacoes.filter(op => {
            const dataOp = new Date(op.data).toLocaleDateString('pt-BR');
            return dataOp !== hoje;
        });
        
        salvarOperacoes(operacoesOutrosDias);
        atualizarDashboard();
        renderizarHistorico();
        
        mostrarMensagem('🔄 Dia resetado com sucesso!', 'sucesso');
    };
    
    // ===== ADICIONAR BOTÃO DE RESET (OPCIONAL) =====
    // Você pode adicionar isso no HTML se quiser
    function adicionarBotaoReset() {
        const container = document.querySelector('#crm .subtitle');
        const botao = document.createElement('button');
        botao.className = 'btn-primary';
        botao.innerHTML = '<i class="fas fa-redo"></i> Resetar Dia';
        botao.onclick = resetarDia;
        botao.style.marginTop = '1rem';
        botao.style.background = 'var(--danger)';
        container.after(botao);
    }
    
    // Descomentar linha abaixo se quiser o botão de reset:
    // adicionarBotaoReset();
    
    // ===== INICIALIZAR =====
    atualizarDashboard();
    renderizarHistorico();
    
    // Definir horário atual como padrão no formulário
    const agora = new Date();
    const horaAtual = agora.toTimeString().slice(0, 5);
    document.getElementById('horarioOperacao').value = horaAtual;
    
});

/* ================================================
 * 💡 MELHORIAS FUTURAS
 * ================================================
 * 
 * 1. GRÁFICOS:
 *    - Adicionar Chart.js para visualizar lucro ao longo do dia
 *    - Gráfico de pizza: Win Rate
 * 
 * 2. RELATÓRIOS:
 *    - Exportar para Excel/PDF
 *    - Enviar por email
 * 
 * 3. METAS:
 *    - Definir meta diária
 *    - Alertas quando atingir meta
 * 
 * 4. GERENCIAMENTO DE BANCA:
 *    - Calcular % de risco por trade
 *    - Sugerir stop de gain/loss diário
 * 
 * ================================================
 */
