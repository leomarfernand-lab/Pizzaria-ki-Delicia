document.addEventListener('DOMContentLoaded', () => {
    // --- Carrossel de depoimentos ---
    const depoimentos = Array.from(document.querySelectorAll('.depoimento'));
    let indice = depoimentos.findIndex(d => d.classList.contains('ativo'));
    if (indice === -1) indice = 0;

    function mostrarDepoimento(i) {
        depoimentos.forEach((d, idx) => d.classList.toggle('ativo', idx === i));
        indice = i;
    }

    document.getElementById('depo-proximo')?.addEventListener('click', () => {
        mostrarDepoimento((indice + 1) % depoimentos.length);
    });
    document.getElementById('depo-anterior')?.addEventListener('click', () => {
        mostrarDepoimento((indice - 1 + depoimentos.length) % depoimentos.length);
    });

    // --- Validação em tempo real ---
    const form = document.getElementById('form-pedido');
    if (form) {
        const nome = form.querySelector('input[name="nome"]');
        const telefone = form.querySelector('input[name="telefone"]');
        const endereco = form.querySelector('input[name="endereco"]');
        const sabor = form.querySelector('select[name="sabor"]');
        const pagamentos = form.querySelectorAll('input[name="pagamento"]');

        function validarCampo(campo, condicao) {
            if (condicao) {
                campo.classList.remove('erro');
                campo.classList.add('ok');
            } else {
                campo.classList.remove('ok');
                campo.classList.add('erro');
            }
        }

        nome.addEventListener('input', () => validarCampo(nome, nome.value.trim() !== ''));

        telefone.addEventListener('input', () => {
            const tel = telefone.value.replace(/\s+/g, '');
            const regex = /^(\(?\d{2}\)?\s?)?(\d{4,5}-?\d{4})$/;
            validarCampo(telefone, regex.test(tel));
        });

        endereco.addEventListener('input', () => validarCampo(endereco, endereco.value.trim() !== ''));

        sabor.addEventListener('change', () => validarCampo(sabor, sabor.value !== ''));

        pagamentos.forEach(p => p.addEventListener('change', () => {
            const escolhido = form.querySelector('input[name="pagamento"]:checked');
            pagamentos.forEach(p => validarCampo(p, !!escolhido));
        }));

        // --- Validação final no submit ---
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const erros = [];
            if (!nome.value.trim()) erros.push('Nome é obrigatório.');
            const tel = telefone.value.replace(/\s+/g, '');
            const regex = /^(\(?\d{2}\)?\s?)?(\d{4,5}-?\d{4})$/;
            if (!regex.test(tel)) erros.push('Telefone inválido. Use DDD + número.');
            if (!endereco.value.trim()) erros.push('Endereço é obrigatório.');
            if (!sabor.value) erros.push('Selecione um sabor.');
            if (!form.querySelector('input[name="pagamento"]:checked')) erros.push('Escolha uma forma de pagamento.');

            const container = document.getElementById('mensagens-erro');
            if (erros.length > 0) {
                container.innerHTML = `<p>⚠️ Preencha todos os campos obrigatórios:</p>
                               <ul>${erros.map(e => `<li>${e}</li>`).join('')}</ul>`;
                container.style.display = 'block';
            } else {
                container.innerHTML = '';
                container.style.display = 'none';
                window.location.href = form.getAttribute('action') || 'obrigado.html';
            }
        });
    }
});
