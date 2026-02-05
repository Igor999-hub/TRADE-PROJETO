/*
 * ================================================
 * CALCULADORAS.JS - CALCULADORAS DE TRADING
 * ================================================
 * Este arquivo contém:
 * 1. Calculadora de Lote (tamanho ideal baseado em risco)
 * 2. Calculadora de Posição (quanto arriscar sem quebrar)
 * 3. Dashboard de Sinais (semáforo de indicadores)
 * ================================================
 */

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('🧮 Módulo de Calculadoras carregado');
    
    // ===== CALCULADORA DE LOTE =====
    
    const calcLoteBtn = document.getElementById('calcLoteBtn');
    
    calcLoteBtn.addEventListener('click', function() {
        
        // Pegar valores dos inputs
        const saldoConta = parseFloat(document.getElementById('saldoConta').value);
        const riscoTrade = parseFloat(document.getElementById('riscoTrade').value);
        const stopLoss = parseFloat(document.getElementById('stopLoss').value);
        
        // Validar se todos os campos foram preenchidos
        if (!saldoConta || !riscoTrade || !stopLoss) {
            mostrarMensagem('❌ Preencha todos os campos!', 'erro');
            return;
        }
        
        // Validar limites
        if (riscoTrade > 10) {
            mostrarMensagem('⚠️ Risco acima de 10% é muito perigoso!', 'erro');
            return;
        }
        
        if (saldoConta <= 0 || stopLoss <= 0) {
            mostrarMensagem('❌ Valores devem ser maiores que zero!', 'erro');
            return;
        }
        
        // ===== FÓRMULA DO CÁLCULO =====
        // 
        // EXPLICAÇÃO SIMPLES:
        // 
        // 1. Primeiro, calculamos quanto você está disposto a perder:
        //    Ex: Conta de R$ 1000 com 2% de risco = R$ 20
        //
        // 2. Depois, dividimos isso pelo stop loss:
        //    Ex: R$ 20 ÷ 50 pontos = R$ 0,40 por ponto
        //
        // 3. Isso te dá o tamanho do lote ideal!
        //
        // =============================================
        
        const valorRisco = saldoConta * (riscoTrade / 100);
        const tamanhoDólar = valorRisco / stopLoss;
        const tamanhoLote = tamanhoDólar * 100; // Convertido para lote padrão
        const perdaMaxima = valorRisco;
        
        // Mostrar resultado
        document.getElementById('valorLote').textContent = tamanhoLote.toFixed(2);
        document.getElementById('perdaMaxima').textContent = formatarDinheiro(perdaMaxima);
        
        document.getElementById('resultadoLote').style.display = 'block';
        
        mostrarMensagem('✅ Lote calculado com sucesso!', 'sucesso');
        
        // Log para debug
        console.log('📊 Cálculo de Lote:', {
            saldoConta,
            riscoTrade: riscoTrade + '%',
            stopLoss,
            valorRisco,
            tamanhoLote,
            perdaMaxima
        });
    });
    
    // ===== CALCULADORA DE POSIÇÃO =====
    
    const calcPosicaoBtn = document.getElementById('calcPosicaoBtn');
    
    calcPosicaoBtn.addEventListener('click', function() {
        
        // Pegar valores
        const capitalTotal = parseFloat(document.getElementById('capitalTotal').value);
        const numTrades = parseInt(document.getElementById('numTrades').value);
        const margemSeguranca = parseFloat(document.getElementById('margemSeguranca').value);
        
        // Validar
        if (!capitalTotal || !numTrades || !margemSeguranca) {
            mostrarMensagem('❌ Preencha todos os campos!', 'erro');
            return;
        }
        
        if (capitalTotal <= 0 || numTrades <= 0) {
            mostrarMensagem('❌ Valores devem ser maiores que zero!', 'erro');
            return;
        }
        
        // ===== FÓRMULA DO CÁLCULO =====
        //
        // EXPLICAÇÃO SIMPLES:
        //
        // 1. Reservamos uma margem de segurança:
        //    Ex: Capital R$ 5000 - 20% = R$ 4000 disponível
        //
        // 2. Dividimos o capital disponível pelos trades:
        //    Ex: R$ 4000 ÷ 3 trades = R$ 1333,33 por trade
        //
        // 3. Assim você não queima toda a banca!
        //
        // =============================================
        
        const capitalReservado = capitalTotal * (margemSeguranca / 100);
        const capitalDisponivel = capitalTotal - capitalReservado;
        const valorPorTrade = capitalDisponivel / numTrades;
        
        // Mostrar resultado
        document.getElementById('valorPorTrade').textContent = formatarDinheiro(valorPorTrade);
        document.getElementById('capitalDisponivel').textContent = formatarDinheiro(capitalDisponivel);
        document.getElementById('capitalReservado').textContent = formatarDinheiro(capitalReservado);
        
        document.getElementById('resultadoPosicao').style.display = 'block';
        
        mostrarMensagem('✅ Posição calculada com sucesso!', 'sucesso');
        
        // Log para debug
        console.log('💵 Cálculo de Posição:', {
            capitalTotal,
            numTrades,
            margemSeguranca: margemSeguranca + '%',
            capitalReservado,
            capitalDisponivel,
            valorPorTrade
        });
    });
    
    // ===== DASHBOARD DE SINAIS =====
    
    const atualizarSinaisBtn = document.getElementById('atualizarSinais');
    
    // Função para atualizar um semáforo individual
    function atualizarSemaforo(nome, status) {
        
        // Resetar todas as luzes deste semáforo
        document.getElementById(`${nome}Verde`).classList.remove('ativo', 'verde');
        document.getElementById(`${nome}Amarelo`).classList.remove('ativo', 'amarelo');
        document.getElementById(`${nome}Vermelho`).classList.remove('ativo', 'vermelho');
        
        // Acender a luz correspondente
        if (status === 'positivo') {
            document.getElementById(`${nome}Verde`).classList.add('ativo', 'verde');
            document.getElementById(`${nome}Status`).textContent = '✅ Positivo';
            document.getElementById(`${nome}Status`).style.color = 'var(--success)';
        } else if (status === 'neutro') {
            document.getElementById(`${nome}Amarelo`).classList.add('ativo', 'amarelo');
            document.getElementById(`${nome}Status`).textContent = '⚠️ Neutro';
            document.getElementById(`${nome}Status`).style.color = 'var(--warning)';
        } else {
            document.getElementById(`${nome}Vermelho`).classList.add('ativo', 'vermelho');
            document.getElementById(`${nome}Status`).textContent = '❌ Negativo';
            document.getElementById(`${nome}Status`).style.color = 'var(--danger)';
        }
    }
    
    // Função para gerar sinais aleatórios (SIMULAÇÃO)
    function gerarSinais() {
        
        // Em um sistema real, aqui você conectaria com indicadores de verdade
        const opcoes = ['positivo', 'neutro', 'negativo'];
        
        const tendencia = opcoes[Math.floor(Math.random() * opcoes.length)];
        const volume = opcoes[Math.floor(Math.random() * opcoes.length)];
        const momentum = opcoes[Math.floor(Math.random() * opcoes.length)];
        
        return {
            tendencia,
            volume,
            momentum
        };
    }
    
    // Função para calcular sincronização
    function calcularSincronia(sinais) {
        
        const sincroniaDiv = document.getElementById('sincroniaResultado');
        
        // Limpar classes anteriores
        sincroniaDiv.className = 'sincronia-resultado';
        
        // Contar sinais positivos
        let positivos = 0;
        if (sinais.tendencia === 'positivo') positivos++;
        if (sinais.volume === 'positivo') positivos++;
        if (sinais.momentum === 'positivo') positivos++;
        
        // Contar sinais negativos
        let negativos = 0;
        if (sinais.tendencia === 'negativo') negativos++;
        if (sinais.volume === 'negativo') negativos++;
        if (sinais.momentum === 'negativo') negativos++;
        
        let resultado, icone, texto;
        
        // LÓGICA DE DECISÃO
        if (positivos >= 2) {
            // Maioria positiva = COMPRAR
            resultado = 'comprar';
            icone = '<i class="fas fa-arrow-up"></i>';
            texto = `
                <h3 style="color: var(--success)">🟢 SINAL DE COMPRA</h3>
                <p>Os indicadores estão sincronizados para alta!</p>
                <p><strong>Indicadores positivos:</strong> ${positivos}/3</p>
                <p><strong>Sugestão:</strong> Considere entrada de compra (CALL)</p>
            `;
        } else if (negativos >= 2) {
            // Maioria negativa = VENDER
            resultado = 'vender';
            icone = '<i class="fas fa-arrow-down"></i>';
            texto = `
                <h3 style="color: var(--danger)">🔴 SINAL DE VENDA</h3>
                <p>Os indicadores estão sincronizados para queda!</p>
                <p><strong>Indicadores negativos:</strong> ${negativos}/3</p>
                <p><strong>Sugestão:</strong> Considere entrada de venda (PUT)</p>
            `;
        } else {
            // Indefinido = AGUARDAR
            resultado = 'neutro';
            icone = '<i class="fas fa-pause"></i>';
            texto = `
                <h3 style="color: var(--warning)">🟡 AGUARDAR</h3>
                <p>Indicadores divergentes - não há consenso!</p>
                <p><strong>Recomendação:</strong> Aguarde sinal mais claro</p>
            `;
        }
        
        sincroniaDiv.classList.add(resultado);
        sincroniaDiv.innerHTML = `
            <div class="sincronia-icone">${icone}</div>
            ${texto}
        `;
    }
    
    // Evento do botão atualizar sinais
    atualizarSinaisBtn.addEventListener('click', function() {
        
        // Mudar texto do botão
        const textoOriginal = atualizarSinaisBtn.innerHTML;
        atualizarSinaisBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Atualizando...';
        atualizarSinaisBtn.disabled = true;
        
        // Simular delay de requisição
        setTimeout(() => {
            
            // Gerar novos sinais
            const sinais = gerarSinais();
            
            // Atualizar semáforos
            atualizarSemaforo('tendencia', sinais.tendencia);
            atualizarSemaforo('volume', sinais.volume);
            atualizarSemaforo('momentum', sinais.momentum);
            
            // Calcular e mostrar sincronização
            calcularSincronia(sinais);
            
            // Restaurar botão
            atualizarSinaisBtn.innerHTML = textoOriginal;
            atualizarSinaisBtn.disabled = false;
            
            mostrarMensagem('✅ Sinais atualizados!', 'sucesso');
            
        }, 1500);
    });
    
    // ===== AUTO-ATUALIZAR SINAIS A CADA 30 SEGUNDOS =====
    // Descomente a linha abaixo se quiser atualização automática:
    // setInterval(() => atualizarSinaisBtn.click(), 30000);
    
});

/* ================================================
 * 📚 GLOSSÁRIO - TERMOS DE TRADING
 * ================================================
 * 
 * LOTE: Tamanho da sua posição no mercado
 *       Ex: Lote de 1.0 = $100,000 no forex
 * 
 * STOP LOSS: Ponto onde você "desiste" do trade
 *            para não perder muito dinheiro
 * 
 * RISCO: Percentual da sua conta que você
 *        está disposto a perder em 1 trade
 * 
 * MARGEM: Dinheiro que fica "bloqueado" como
 *         garantia para manter suas posições
 * 
 * PAYOUT: Percentual de retorno em opções
 *         Ex: 80% = se apostar R$100, ganha R$180
 * 
 * INDICADORES:
 * - Tendência: Direção geral do mercado (alta/baixa)
 * - Volume: Quantidade de negociações (força)
 * - Momentum: Velocidade da mudança de preço
 * 
 * ================================================
 */

/* ================================================
 * 🔮 COMO CONECTAR INDICADORES REAIS
 * ================================================
 * 
 * Para usar indicadores técnicos de verdade:
 * 
 * 1. BIBLIOTECAS JavaScript:
 *    - TechnicalIndicators (npm install technicalindicators)
 *    - Tulind (biblioteca C com bindings JS)
 * 
 * 2. APIs de Mercado:
 *    - Alpha Vantage (gratuita)
 *    - TradingView (widgets)
 *    - MetaTrader API
 * 
 * 3. EXEMPLO com TechnicalIndicators:
 * 
 *    const SMA = require('technicalindicators').SMA;
 *    
 *    const precos = [10, 12, 15, 14, 16, 18, 20];
 *    
 *    const sma = SMA.calculate({
 *        period: 3,
 *        values: precos
 *    });
 *    
 *    console.log(sma); // Média móvel
 * 
 * ================================================
 */
