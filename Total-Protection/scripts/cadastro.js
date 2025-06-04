document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastro-form');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('cadastro-name').value;
            const password = document.getElementById('cadastro-password').value;

            // Recupera os usuários existentes ou inicializa um array vazio
            let users = JSON.parse(localStorage.getItem('users')) || [];

            // Cria um objeto para o novo usuário (somente com nome e senha)
            const newUser = { name, password };

            // Adiciona o novo usuário à lista
            users.push(newUser);

            // Salva a lista atualizada no localStorage
            localStorage.setItem('users', JSON.stringify(users));

            console.log("Usuário registrado com sucesso:", newUser);

            // Redireciona para a página de login após o cadastro
            window.location.href = 'login.html';
        });
    }
});