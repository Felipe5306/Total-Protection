document.addEventListener('DOMContentLoaded', () => {
    // Se já houver usuário logado, redireciona direto para home.html
    const storedLoggedUser = localStorage.getItem('loggedUser');
    if (storedLoggedUser) {
        window.location.href = 'home.html';
        return;
    }
    
    const loginForm = document.getElementById('login-form');
    if (!loginForm) {
        console.error("Formulário de login não encontrado!");
        return;
    }
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Supondo que seu formulário de login possua inputs com os seguintes IDs:
        // 'login-email' para o email e 'login-password' para a senha
        const emailInput = document.getElementById('login-name');
        const passwordInput = document.getElementById('login-password');
        
        if (!emailInput || !passwordInput) {
            console.error("Campos de nome ou senha não encontrados!");
            alert("Erro no formulário, verifique os campos.");
            return;
        }
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        console.log("Tentando login com:", username, password);
        
        // Recupera os usuários salvos no localStorage
        const storedUsers = localStorage.getItem('users');
        let users = [];
        if (storedUsers) {
            try {
                users = JSON.parse(storedUsers);
            } catch (error) {
                console.error("Erro ao ler os usuários do localStorage:", error);
            }
        }
        
        // Verifica se existe um usuário com as credenciais informadas
        const loggedUser = users.find(user => 
            user.email === email && user.password === password
        );
        
        if (loggedUser) {
            console.log("Login bem-sucedido:", loggedUser);
            // Salva os dados do usuário logado no localStorage
            localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
            // Redireciona para a página home.html após o login
            window.location.href = 'home.html';
        } else {
            console.log("Credenciais inválidas");
            alert("Email ou senha incorretos!");
        }
    });

    const registerForm = document.getElementById('cadastro-form');

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('cadastro-name').value;
            const email = document.getElementById('cadastro-email').value;
            const password = document.getElementById('cadastro-password').value;
            console.log('Tentando cadastro com:', name, email, password);
            // Implementar lógica de cadastro (ex: chamada à API)
        });
    }
});