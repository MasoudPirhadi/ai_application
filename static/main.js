const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatContainer = document.getElementById('chat-container');
const typingIndicator = document.getElementById('typing-indicator');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const backdrop = document.getElementById('backdrop');

// close & open sidebar
const toggleMenu = () => {
    sidebar.classList.toggle('translate-x-full');
    sidebar.classList.toggle('translate-x-0');
    backdrop.classList.toggle('hidden');
};

if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
}
if (backdrop) {
    backdrop.addEventListener('click', toggleMenu);
}

// on & off send botton
const toggleSendButton = () => {
    sendButton.disabled = messageInput.value.trim() === '';
};

// text area & status botton
messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = (messageInput.scrollHeight) + 'px';
    toggleSendButton();
});

// send message
const sendMessage = () => {
    const messageText = messageInput.value.trim();
    if (messageText === '') return;

    // user message display
    const userMessageHTML = `
                <div class="flex items-start gap-3 mb-6 justify-end">
                    <div class="bg-purple-600 text-white p-4 rounded-lg rounded-tr-none max-w-2xl">
                        <p class="font-bold mb-1">شما</p>
                        <p>${messageText.replace(/\n/g, '<br>')}</p>
                    </div>
                    <img src="https://placehold.co/40x40/7e22ce/ffffff?text=U" alt="آواتار کاربر" class="w-10 h-10 rounded-full">
                </div>`;
    chatContainer.insertAdjacentHTML('beforeend', userMessageHTML);

    // input remove & reset height
    messageInput.value = '';
    messageInput.style.height = 'auto';
    toggleSendButton();

    // is typing display
    typingIndicator.classList.remove('hidden');
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // example message ai
    setTimeout(() => {
        typingIndicator.classList.add('hidden');
        const aiResponseHTML = `
                    <div class="flex items-start gap-3 mb-6">
                        <img src="https://placehold.co/40x40/10b981/ffffff?text=AI" alt="آواتار هوش مصنوعی" class="w-10 h-10 rounded-full">
                        <div class="bg-gray-900 p-4 rounded-lg rounded-tl-none max-w-2xl">
                            <p class="font-bold text-teal-400 mb-2">هوش مصنوعی</p>
                            <p class="text-gray-300 leading-relaxed">
                                این یک پاسخ شبیه‌سازی شده به پیام شما ("${messageText.replace(/\n/g, '<br>')}") است. در یک برنامه واقعی، این پاسخ توسط مدل زبان بزرگ تولید می‌شود.
                            </p>
                        </div>
                    </div>`;
        chatContainer.insertAdjacentHTML('beforeend', aiResponseHTML);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 1500 + Math.random() * 1000); // delay data message
};

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
toggleSendButton();