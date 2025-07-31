// ===================================
// DOM Elements
// ===================================
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatContainer = document.getElementById('chat-container');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const backdrop = document.getElementById('backdrop');
const chatHistoryList = document.getElementById('chat-history-list');
const newChatBtn = document.getElementById('new-chat-btn');
const mobileChatTitle = document.getElementById('mobile-chat-title');
const appContainer = document.getElementById('app-container');
const authModal = document.getElementById('auth-modal');
// Profile Modal elements
const editProfileBtn = document.getElementById('edit-profile-btn');
const profileModal = document.getElementById('profile-modal');
const profileForm = document.getElementById('profile-form');
const cancelProfileChangeBtn = document.getElementById('cancel-profile-change');
const avatarUploadBtn = document.getElementById('avatar-upload-btn');
const avatarUploadInput = document.getElementById('avatar-upload');
const profileAvatarPreview = document.getElementById('profile-avatar-preview');
const userAvatarButton = document.getElementById('user-avatar-button');
const profileUsername = document.getElementById('profile-username');
const profileEmail = document.getElementById('profile-email');
const checkUsername = document.getElementById('check-username');
const profileMessage = document.getElementById('profile-message');
// Auth Modal elements
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const accountDropdownButton = document.getElementById('account-menu-button');
const accountDropdown = document.getElementById('account-dropdown');
const changePasswordBtn = document.getElementById('change-password-btn');
const passwordModalBackdrop = document.getElementById('password-modal-backdrop');
const passwordModal = document.getElementById('password-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelPasswordChange = document.getElementById('cancel-password-change');
const passwordChangeForm = document.getElementById('password-change-form');
const logoutBtn = document.getElementById('logout-btn');
const usernameDisplay = document.getElementById('username-display');
const signupMessage = document.getElementById('signup-message');
const loginMessage = document.getElementById('login-message');
const passwordMessage = document.getElementById('password-message');

// ===================================
// Application State Management
// ===================================
let isUserLoggedIn = false; // Simulate user not being logged in initially
let activeChatId = null;
let chats = {}; // Data will be fetched from the server

// ===================================
// API Functions
// ===================================

async function fetchChats() {
    const response = await fetch('/api/chats/');
    const data = await response.json();
    chats = data.reduce((acc, chat) => {
        acc[chat.id] = {title: chat.title, messages: []};
        return acc;
    }, {});
    renderSidebar();
}

async function fetchMessages(chatId) {
    if (chats[chatId] && chats[chatId].messages.length > 0) {
        renderChatMessages(chatId);
        return;
    }
    const response = await fetch(`/api/chats/${chatId}/`);
    const data = await response.json();
    chats[chatId].messages = data;
    renderChatMessages(chatId);
}

// ===================================
// Render and Display Functions
// ===================================

const renderSidebar = () => {
    chatHistoryList.innerHTML = '';
    Object.keys(chats).forEach(chatId => {
        const chat = chats[chatId];
        const isActive = Number(chatId) === Number(activeChatId);
        const link = document.createElement('a');
        link.href = '#';
        link.dataset.chatId = chatId;
        link.className = `flex items-center p-2 text-sm rounded-lg transition-colors ${isActive ? 'bg-gray-700 font-semibold' : 'hover:bg-gray-700/50'}`;
        link.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-3 ml-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg><span class="truncate">${chat.title}</span>`;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveChat(chatId);
            if (window.innerWidth < 768) {
                toggleMenu();
            }
        });
        chatHistoryList.appendChild(link);
    });
};

const renderChatMessages = (chatId) => {
    if (!chatId || !chats[chatId]) {
        chatContainer.innerHTML = `<div class="flex flex-col items-center justify-center h-full"><div class="text-center text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-16 h-16 mx-auto mb-4"><path d="M12 8V4H8"></path><path d="M20 12v4h-4"></path><path d="M4 16.5A2.5 2.5 0 0 1 6.5 14H8"></path><path d="M16 4.5A2.5 2.5 0 0 1 13.5 7H12"></path><path d="M3 3l18 18"></path></svg><h2 class="text-2xl font-bold text-gray-400">چت‌بات هوش مصنوعی</h2><p class="mt-2">یک گفتگوی جدید را شروع کنید.</p></div></div>`;
        mobileChatTitle.textContent = 'چت جدید';
        return;
    }

    const chat = chats[chatId];
    mobileChatTitle.textContent = chat.title;
    chatContainer.innerHTML = '';
    chat.messages.forEach(message => appendMessage(message.sender, message.text));
    chatContainer.scrollTop = chatContainer.scrollHeight;
};

const appendMessage = (sender, text) => {
    const isUser = sender === 'user';
    const messageHTML = `<div class="flex items-start gap-3 mb-6 ${isUser ? 'justify-end' : ''}"><div class="${isUser ? 'bg-gray-600 text-white' : 'bg-gray-900'} p-4 rounded-lg max-w-2xl"><p class="font-bold mb-1"></p><p>${text.replace(/\n/g, '<br>')}</p></div></div>`;
    chatContainer.insertAdjacentHTML('beforeend', messageHTML);
};

// Show typing indicator
const showTypingIndicator = () => {
    const typingHTML = `
                <div id="typing-indicator" class="flex items-start gap-3 mb-6">
                    <div class="bg-gray-900 p-4 rounded-lg rounded-tl-none">
                        <div class="flex items-center space-x-2 space-x-reverse">
                            <span class="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style="animation-delay: 0s;"></span>
                            <span class="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style="animation-delay: 0.2s;"></span>
                            <span class="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style="animation-delay: 0.4s;"></span>
                        </div>
                    </div>
                </div>`;
    chatContainer.insertAdjacentHTML('beforeend', typingHTML);
    chatContainer.scrollTop = chatContainer.scrollHeight;
};

const hideTypingIndicator = () => {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
};

// ===================================
// Management and Event Functions
// ===================================

const setActiveChat = (chatId) => {
    activeChatId = chatId;
    renderSidebar();
    if (chatId) {
        fetchMessages(chatId);
    } else {
        renderChatMessages(null);
    }
};

const sendMessage = async () => {
    const messageText = messageInput.value.trim();
    if (messageText === '') return;

    // Append user message immediately for better UX
    if (!activeChatId) {
        chatContainer.innerHTML = ''; // Clear welcome message
    }
    appendMessage('user', messageText);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const originalMessage = messageInput.value;
    messageInput.value = '';
    messageInput.style.height = 'auto';
    toggleSendButton();
    showTypingIndicator();

    const response = await fetch('/api/send_message/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text: originalMessage, chatId: activeChatId})
    });
    const data = await response.json();

    hideTypingIndicator();

    if (!activeChatId) {
        // This is a new chat, update the state and UI
        activeChatId = data.chatId;
        chats[data.chatId] = {title: data.chatTitle, messages: [{sender: 'user', text: originalMessage}]};
        renderSidebar();
    }

    // Add AI response
    chats[activeChatId].messages.push({sender: 'ai', text: originalMessage});
    chats[activeChatId].messages.push(data.aiMessage);
    appendMessage(data.aiMessage.sender, data.aiMessage.text);
    chatContainer.scrollTop = chatContainer.scrollHeight;
};

// Toggle mobile sidebar menu
const toggleMenu = () => {
    sidebar.classList.toggle('translate-x-full');
    sidebar.classList.toggle('translate-x-0');
    backdrop.classList.toggle('hidden');
};

// Enable/disable send button
const toggleSendButton = () => {
    sendButton.disabled = messageInput.value.trim() === '';
};

const showAuthModal = () => {
    authModal.classList.remove('hidden');
};

const hideAuthModal = () => {
    authModal.classList.add('hidden');
};

const openProfileModal = () => {
    profileModal.classList.remove('hidden');
}

const closeProfileModal = () => {
    profileModal.classList.add('hidden');
}

const initializeApp = (username) => {
    hideAuthModal();
    appContainer.classList.remove('hidden');
    usernameDisplay.textContent = username;
    renderSidebar();
    setActiveChat(null);
    toggleSendButton();
};

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch('api/login/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
        });
        const data = await res.json();
        if (res.ok) {
            loginMessage.innerHTML = ''
            isUserLoggedIn = true;
            initializeApp(data.username);
            await fetchChats();
        } else {
            loginMessage.innerHTML = data.error;
        }
    } catch (error) {
        loginMessage.innerHTML = error.messages;
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const res = await fetch('api/signup/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, username, password}),
        });

        const data = await res.json();
        if (res.ok) {
            isUserLoggedIn = true;
            initializeApp(data.username);
            await fetchChats();
        } else {
            signupMessage.innerHTML = data.message;
        }
    } catch (error) {
        signupMessage.innerHTML = error.message;
    }
}

async function handleLogout(e) {
    e.preventDefault();
    const res = await fetch('api/logout/')
    const data = await res.json();
    if (res.ok) {
        isUserLoggedIn = false;
        window.location.reload();
    }
}

const switchAuthTab = (tab) => {
    if (tab === 'login') {
        loginTab.classList.add('tab-active');
        signupTab.classList.remove('tab-active');
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    } else {
        loginTab.classList.remove('tab-active');
        signupTab.classList.add('tab-active');
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }
};

loginTab.addEventListener('click', () => switchAuthTab('login'));
signupTab.addEventListener('click', () => switchAuthTab('signup'));
loginForm.addEventListener("submit", handleLogin);
signupForm.addEventListener("submit", handleSignup);

// Profile Modal
editProfileBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const formData = new FormData();


    const res = await fetch('api/edit-profile/', {
        method: 'POST',
        body: formData,
        contentType: 'application/json',
        credentials: 'include',
    });
    const data = await res.json();
    profileAvatarPreview.src = data.avatar
    profileUsername.value = data.username;
    profileEmail.value = data.email;

    accountDropdown.classList.add('hidden');
    openProfileModal();

});
cancelProfileChangeBtn.addEventListener('click', () => closeProfileModal());
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', document.getElementById('profile-username').value);
    formData.append('avatar', document.getElementById('avatar-upload').files[0]);

    const res = await fetch('/api/edit-profile/', {
        method: 'POST',
        body: formData,
        credentials: 'include',
    })
    const data = await res.json();
    if (data.status) {
        var username = data.username;
        profileAvatarPreview.src = data.avatar;
        profileUsername.value = username;
        profileEmail.value = data.email;
        window.location.reload();
        closeProfileModal();
    } else {
        checkUsername.innerHTML = data.error;
    }
});
avatarUploadBtn.addEventListener('click', () => avatarUploadInput.click());
avatarUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const imageUrl = event.target.result;
            profileAvatarPreview.src = imageUrl;
            userAvatarButton.src = imageUrl;
        };
        reader.readAsDataURL(file);
    }
});

// New Modal and Dropdown Logic
const openPasswordModal = () => {
    passwordModal.classList.remove('hidden');
    passwordModalBackdrop.classList.remove('hidden');
};
const closePasswordModal = () => {
    passwordModal.classList.add('hidden');
    passwordModalBackdrop.classList.add('hidden');
    passwordChangeForm.reset();
};

// accountDropdownButton.addEventListener('click', (e) => {
//     e.stopPropagation();
//     accountDropdown.classList.toggle('hidden');
// });

window.addEventListener('click', () => {
    if (!accountDropdown.classList.contains('hidden')) {
        accountDropdown.classList.add('hidden');
    }
});

changePasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    accountDropdown.classList.add('hidden');
    openPasswordModal();
})

closeModalBtn.addEventListener('click', closePasswordModal);
cancelPasswordChange.addEventListener('click', closePasswordModal)
passwordModalBackdrop.addEventListener('click', closePasswordModal)

passwordChangeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const oldPassword = document.getElementById('old_password').value;
    const password = document.getElementById('new_password1').value;
    const confirmPassword = document.getElementById('new_password2').value;
    const res = await fetch('api/password/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({password, confirmPassword, oldPassword}),
    })
    const data = await res.json();
    try {
        if (data.status) {
            window.location.reload();
            // closePasswordModal();
        } else {
            passwordMessage.innerHTML = data.message;
        }
    } catch (error) {
        passwordMessage.innerHTML = error.message;
    }
})

// Click event for the new chat button
newChatBtn.addEventListener('click', () => {
    setActiveChat(null);
});

// Other events
if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
if (backdrop) backdrop.addEventListener('click', toggleMenu);
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = (messageInput.scrollHeight) + 'px';
    toggleSendButton();
});

accountDropdownButton.addEventListener('click', (e) => {
    e.stopPropagation();
    accountDropdown.classList.toggle('hidden');
});
window.addEventListener('click', () => {
    if (!accountDropdown.classList.contains('hidden')) {
        accountDropdown.classList.add('hidden');
    }
});
logoutBtn.addEventListener('click', handleLogout);

// ===================================
// Initial Execution
// ===================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const getLogin = await fetch('api/check/login/');
        const userData = await getLogin.json();
        chatContainer.classList.remove('hidden');
        isUserLoggedIn = true;
        initializeApp(userData.username);
        await fetchChats();
    } catch (err) {
        showAuthModal();
    }


    // appContainer.classList.remove('hidden');
    // if (isUserLoggedIn) {
    //     initializeApp(usernameDisplay.value);
    // } else {
    //     showAuthModal();
    //     toggleSendButton();
    // }
});