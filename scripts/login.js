document.addEventListener('DOMContentLoaded', () => {
    if (isUserLoggedIn()) {
        window.location.href = 'home.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    if (!loginForm) {
        console.error("Formulário de login não encontrado!");
        return;
    }

    const errorMsg = createErrorMsgElement();
    loginForm.prepend(errorMsg);

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLoginSubmit(loginForm, errorMsg);
    });

    loginForm.addEventListener('input', () => {
        errorMsg.textContent = '';
    });
});

// Verifica se já existe usuário logado
function isUserLoggedIn() {
    return !!localStorage.getItem('loggedUser');
}

// Cria elemento para mensagens de erro
function createErrorMsgElement() {
    const errorMsg = document.createElement('div');
    errorMsg.id = 'login-error-msg';
    errorMsg.style.color = '#d9534f';
    errorMsg.style.marginBottom = '10px';
    errorMsg.style.textAlign = 'center';
    return errorMsg;
}

// Lida com o envio do formulário de login
function handleLoginSubmit(form, errorMsg) {
    errorMsg.textContent = '';
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const nameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');

    if (!nameInput || !passwordInput) {
        showError("Erro no formulário, verifique os campos.", errorMsg, submitBtn);
        return;
    }

    const name = nameInput.value.trim();
    const password = passwordInput.value;

    const users = getStoredUsers(errorMsg, submitBtn);
    if (!users) return;

    const loggedUser = users.find(user =>
        user.name === name && user.password === password
    );

    if (loggedUser) {
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        window.location.href = 'home.html';
    } else {
        showError("Nome ou senha incorretos!", errorMsg, submitBtn);
    }
}

// Recupera os usuários salvos no localStorage
function getStoredUsers(errorMsg, submitBtn) {
    const storedUsers = localStorage.getItem('users');
    if (!storedUsers) return [];
    try {
        return JSON.parse(storedUsers);
    } catch (error) {
        showError("Erro interno ao acessar usuários.", errorMsg, submitBtn);
        return null;
    }
}

// Exibe mensagem de erro e reabilita o botão
function showError(message, errorMsg, submitBtn) {
    errorMsg.textContent = message;
    if (submitBtn) submitBtn.disabled = false;
}

const style = document.createElement('style');
style.textContent = `

`;
document.head.appendChild(style);