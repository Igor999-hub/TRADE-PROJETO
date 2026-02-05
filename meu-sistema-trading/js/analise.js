/*
 * ================================================
 * ANALISE.JS - SISTEMA DE ANÁLISE DE GRÁFICO
 * ================================================
 * Este arquivo é responsável por:
 * 1. Upload de imagem (print do gráfico)
 * 2. Processar e analisar o gráfico
 * 3. Mostrar se é hora de COMPRAR ou VENDER
 * ================================================
 */

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('📊 Módulo de Análise carregado');
    
    // ===== PEGAR ELEMENTOS DA PÁGINA =====
    // Como pegar ferramentas de uma caixa de ferramentas
    const uploadBox = document.getElementById('uploadBox');
    const imageInput = document.getElementById('imageInput');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const removeButton = document.getElementById('removeImage');
    const analisarBtn = document.getElementById('analisarBtn');
    const resultadoDiv = document.getElementById('resultadoAnalise');
    
    // ===== VARIÁVEL PARA GUARDAR A IMAGEM =====
    let imagemAtual = null;
    
    // ===== EVENTO: CLICAR NA ÁREA DE UPLOAD =====
    // Quando você clica na caixa de upload, abre o seletor de arquivo
    uploadBox.addEventListener('click', function() {
        imageInput.click();
    });
    
    // ===== EVENTO: ARRASTAR ARQUIVO =====
    // Previne que o navegador abra a imagem em outra aba
    uploadBox.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadBox.style.borderColor = '#2563eb';
        uploadBox.style.background = 'rgba(37, 99, 235, 0.2)';
    });
    
    uploadBox.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadBox.style.borderColor = 'rgba(37, 99, 235, 0.5)';
        uploadBox.style.background = 'rgba(30, 41, 59, 0.5)';
    });
    
    // ===== EVENTO: SOLTAR ARQUIVO =====
    uploadBox.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadBox.style.borderColor = 'rgba(37, 99, 235, 0.5)';
        uploadBox.style.background = 'rgba(30, 41, 59, 0.5)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processarImagem(files[0]);
        }
    });
    
    // ===== EVENTO: SELECIONAR ARQUIVO =====
    imageInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            processarImagem(e.target.files[0]);
        }
    });
    
    // ===== FUNÇÃO: PROCESSAR IMAGEM =====
    // Como "revelar uma foto" - transforma o arquivo em algo visível
    function processarImagem(arquivo) {
        
        // Verificar se é realmente uma imagem
        if (!arquivo.type.startsWith('image/')) {
            mostrarMensagem('❌ Por favor, envie apenas imagens!', 'erro');
            return;
        }
        
        // FileReader é como uma "máquina de ler fotos"
        const leitor = new FileReader();
        
        // Quando terminar de ler...
        leitor.onload = function(e) {
            imagemAtual = e.target.result; // Guardar a imagem
            previewImage.src = imagemAtual; // Mostrar preview
            
            // MOSTRAR o preview e ESCONDER o upload box
            uploadBox.style.display = 'none';
            previewContainer.style.display = 'block';
            
            // HABILITAR o botão de analisar
            analisarBtn.disabled = false;
            
            mostrarMensagem('✅ Imagem carregada com sucesso!', 'sucesso');
        };
        
        // Iniciar a leitura do arquivo
        leitor.readAsDataURL(arquivo);
    }
    
    // ===== EVENTO: REMOVER IMAGEM =====
    removeButton.addEventListener('click', function() {
        imagemAtual = null;
        previewImage.src = '';
        
        // MOSTRAR o upload box e ESCONDER o preview
        uploadBox.style.display = 'flex';
        previewContainer.style.display = 'none';
        
        // DESABILITAR o botão de analisar
        analisarBtn.disabled = true;
        
        // ESCONDER resultado se estiver visível
        resultadoDiv.style.display = 'none';
        
        // Limpar o input
        imageInput.value = '';
    });
    
    // ===== EVENTO: ANALISAR GRÁFICO =====
    analisarBtn.addEventListener('click', function() {
        
        if (!imagemAtual) {
            mostrarMensagem('❌ Nenhuma imagem selecionada!', 'erro');
            return;
        }
        
        // Mudar texto do botão para mostrar que está processando
        const textoOriginal = analisarBtn.innerHTML;
        analisarBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analisando...';
        analisarBtn.disabled = true;
        
        // SIMULAR ANÁLISE (aguardar 2 segundos)
        // Em um sistema real, aqui você enviaria para uma IA de verdade
        setTimeout(() => {
            const resultado = analisarGrafico();
            mostrarResultado(resultado);
            
            // Voltar botão ao normal
            analisarBtn.innerHTML = textoOriginal;
            analisarBtn.disabled = false;
        }, 2000);
    });
    
    // ===== FUNÇÃO: ANALISAR GRÁFICO (SIMULADO) =====
    // IMPORTANTE: Aqui você integraria uma IA real!
    // Por enquanto, vamos simular uma análise aleatória para demonstração
    function analisarGrafico() {
        
        // Gerar números aleatórios para simular indicadores
        const random = Math.random();
        
        let decisao, confianca, recomendacao;
        
        if (random > 0.6) {
            // 40% de chance: COMPRAR
            decisao = 'comprar';
            confianca = Math.floor(Math.random() * 20 + 70); // 70-90%
            recomendacao = `
                <h4>🟢 Indicação: COMPRAR (CALL)</h4>
                <p><strong>Análise:</strong> Os indicadores mostram uma forte tendência de alta. 
                O volume está crescendo e o momentum está positivo.</p>
                <p><strong>Pontos observados:</strong></p>
                <ul>
                    <li>✅ Rompimento de resistência identificado</li>
                    <li>✅ Médias móveis em alinhamento de alta</li>
                    <li>✅ RSI em zona de força (50-70)</li>
                    <li>✅ MACD em cruzamento positivo</li>
                </ul>
                <p><strong>Sugestão:</strong> Considere entrada com stop loss abaixo da última mínima relevante.</p>
            `;
            
        } else if (random < 0.3) {
            // 30% de chance: VENDER
            decisao = 'vender';
            confianca = Math.floor(Math.random() * 20 + 65); // 65-85%
            recomendacao = `
                <h4>🔴 Indicação: VENDER (PUT)</h4>
                <p><strong>Análise:</strong> Os indicadores sugerem uma possível reversão de baixa. 
                Há sinais de enfraquecimento da tendência atual.</p>
                <p><strong>Pontos observados:</strong></p>
                <ul>
                    <li>⚠️ Perda de suporte importante</li>
                    <li>⚠️ Divergência bearish no RSI</li>
                    <li>⚠️ Volume em queda nas altas</li>
                    <li>⚠️ MACD mostrando perda de força</li>
                </ul>
                <p><strong>Sugestão:</strong> Aguarde confirmação da reversão com rompimento claro.</p>
            `;
            
        } else {
            // 30% de chance: NEUTRO
            decisao = 'neutro';
            confianca = Math.floor(Math.random() * 20 + 40); // 40-60%
            recomendacao = `
                <h4>🟡 Indicação: AGUARDAR</h4>
                <p><strong>Análise:</strong> O mercado está em momento de indecisão. 
                Os indicadores estão conflitantes e não há sinal claro de direção.</p>
                <p><strong>Pontos observados:</strong></p>
                <ul>
                    <li>⚡ Preço em zona de consolidação</li>
                    <li>⚡ Indicadores em divergência</li>
                    <li>⚡ Volume baixo, sem força direcional</li>
                    <li>⚡ Aguardar rompimento ou rejeição</li>
                </ul>
                <p><strong>Sugestão:</strong> Evite entradas neste momento. Aguarde definição clara de tendência.</p>
            `;
        }
        
        return {
            decisao: decisao,
            confianca: confianca,
            recomendacao: recomendacao
        };
    }
    
    // ===== FUNÇÃO: MOSTRAR RESULTADO =====
    function mostrarResultado(resultado) {
        
        // Pegar elementos do resultado
        const badge = document.getElementById('resultadoBadge');
        const confiancaFill = document.getElementById('confiancaFill');
        const confiancaTexto = document.getElementById('confiancaTexto');
        const recomendacaoDiv = document.getElementById('recomendacao');
        
        // LIMPAR classes anteriores
        badge.className = 'resultado-badge';
        
        // DEFINIR cor e texto baseado na decisão
        if (resultado.decisao === 'comprar') {
            badge.classList.add('comprar');
            badge.textContent = '🟢 COMPRAR';
        } else if (resultado.decisao === 'vender') {
            badge.classList.add('vender');
            badge.textContent = '🔴 VENDER';
        } else {
            badge.classList.add('neutro');
            badge.textContent = '🟡 AGUARDAR';
        }
        
        // BARRA DE CONFIANÇA
        confiancaFill.style.width = resultado.confianca + '%';
        confiancaTexto.textContent = resultado.confianca + '% de confiança';
        
        // RECOMENDAÇÃO
        recomendacaoDiv.innerHTML = resultado.recomendacao;
        
        // MOSTRAR o resultado com animação
        resultadoDiv.style.display = 'block';
        resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        mostrarMensagem('✅ Análise concluída!', 'sucesso');
    }
    
});

/* ================================================
 * 🎓 COMO INTEGRAR IA REAL (FUTURO)
 * ================================================
 * 
 * Para conectar com uma IA de verdade, você precisaria:
 * 
 * 1. USAR UMA API DE IA:
 *    - Claude API (Anthropic)
 *    - GPT-4 Vision (OpenAI)
 *    - Google Cloud Vision
 * 
 * 2. EXEMPLO DE CÓDIGO (com fetch):
 * 
 *    async function analisarComIA(imagem) {
 *        const resposta = await fetch('SUA_URL_DA_API', {
 *            method: 'POST',
 *            headers: {
 *                'Content-Type': 'application/json',
 *                'Authorization': 'Bearer SUA_CHAVE_API'
 *            },
 *            body: JSON.stringify({
 *                imagem: imagem,
 *                prompt: 'Analise este gráfico de trading...'
 *            })
 *        });
 *        
 *        const resultado = await resposta.json();
 *        return resultado;
 *    }
 * 
 * 3. OU usar uma biblioteca de análise técnica JavaScript:
 *    - TechnicalIndicators (npm)
 *    - Tulind (biblioteca C com bindings JS)
 * 
 * ================================================
 */
