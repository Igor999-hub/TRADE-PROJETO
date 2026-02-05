/*
 * ================================================
 * MAIN.JS - ARQUIVO PRINCIPAL
 * ================================================
 * Este arquivo é como um "maestro de orquestra"
 * Ele controla a navegação entre as diferentes seções
 * ================================================
 */

// ===== ESPERAR O SITE CARREGAR COMPLETAMENTE =====
// É como esperar todos os atores subirem no palco antes de começar a peça
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('🚀 Sistema TradingPro iniciado!');
    
    // ===== PEGAR TODOS OS BOTÕES DO MENU =====
    // Isso é como pegar todos os controles remotos da TV
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.section');
    
    // ===== FUNÇÃO PARA TROCAR DE SEÇÃO =====
    // Pensa nisso como trocar de canal na TV
    function trocarSecao(nomeSecao) {
        
        // 1. ESCONDER TODAS AS SEÇÕES
        // Como apagar todas as luzes do palco
        sections.forEach(secao => {
            secao.classList.remove('active');
        });
        
        // 2. DESMARCAR TODOS OS BOTÕES DO MENU
        // Como desligar todos os botões iluminados
        menuItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // 3. MOSTRAR A SEÇÃO ESCOLHIDA
        // Como acender APENAS a luz do palco principal
        const secaoEscolhida = document.getElementById(nomeSecao);
        if (secaoEscolhida) {
            secaoEscolhida.classList.add('active');
        }
        
        // 4. MARCAR O BOTÃO DO MENU CORRESPONDENTE
        // Como acender o botão do controle remoto
        const botaoAtivo = document.querySelector(`[data-section="${nomeSecao}"]`);
        if (botaoAtivo) {
            botaoAtivo.classList.add('active');
        }
        
        console.log(`📂 Seção ativa: ${nomeSecao}`);
    }
    
    // ===== ADICIONAR EVENTO DE CLIQUE EM CADA BOTÃO =====
    // É como programar o que acontece quando você clica em cada botão
    menuItems.forEach(botao => {
        botao.addEventListener('click', function() {
            // Pegar o nome da seção que está no atributo "data-section"
            const secao = this.getAttribute('data-section');
            trocarSecao(secao);
        });
    });
    
    // ===== INICIAR NA PRIMEIRA SEÇÃO (ANÁLISE) =====
    trocarSecao('analise');
    
    // ===== FUNÇÃO PARA MOSTRAR MENSAGENS (TIPO TOAST) =====
    // Como uma notificação do celular que aparece e some
    window.mostrarMensagem = function(texto, tipo = 'info') {
        // Criar o elemento da mensagem
        const mensagem = document.createElement('div');
        mensagem.className = `toast toast-${tipo}`;
        mensagem.textContent = texto;
        
        // Estilos inline (CSS direto no elemento)
        mensagem.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${tipo === 'sucesso' ? '#10b981' : tipo === 'erro' ? '#ef4444' : '#2563eb'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        // Adicionar no final do body
        document.body.appendChild(mensagem);
        
        // Remover após 3 segundos
        setTimeout(() => {
            mensagem.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                mensagem.remove();
            }, 300);
        }, 3000);
    };
    
    // ===== FUNÇÃO PARA FORMATAR DINHEIRO =====
    // Transforma 1234.56 em "R$ 1.234,56"
    window.formatarDinheiro = function(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };
    
    // ===== FUNÇÃO PARA FORMATAR DATA =====
    // Transforma data em formato brasileiro
    window.formatarData = function(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    };
    
    // ===== FUNÇÃO PARA FORMATAR HORA =====
    window.formatarHora = function(hora) {
        return hora || new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    console.log('✅ Sistema pronto para uso!');
});

/* ===== ADICIONAR ANIMAÇÕES CSS =====
   Isso vai no HEAD do HTML ou pode ser adicionado dinamicamente */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
