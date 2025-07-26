from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import check_password
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
import json

from account_module.models import Users
from ai_module.models import Chat, SendMessage
from utils.base_url import api_send_message


class AiView(View):
    def get(self, request):
        return render(request, 'ai_module/chat.html')

    def post(self, request):
        pass


def sidebar(request):
    return render(request, 'ai_application/sidebar.html')


def header_components(request):
    return render(request, 'ai_application/header_components.html')


def footer_components(request):
    return render(request, 'ai_application/footer_components.html')


def modals_components(request):
    return render(request, 'ai_application/modals.html')


@login_required
def current_user(request):
    return JsonResponse({'username': request.user.username}, safe=False)


@login_required
def get_chats(request):
    chats = Chat.objects.filter(user=request.user)
    data = [{'id': chat.id, 'title': chat.name, 'user': request.user.id} for chat in chats]
    return JsonResponse(data, safe=False)


@login_required
def get_chat_messages(request, chat_id):
    try:
        chat = Chat.objects.get(id=chat_id)
        messages = chat.sendmessage_set.all()
        data = [{'sender': message.sender, 'text': message.message} for message in messages]
        return JsonResponse(data, safe=False)
    except Chat.DoesNotExist:
        return JsonResponse({'error': 'Chat does not exist'}, status=404, safe=False)


@login_required
@csrf_exempt
def send_message(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        message_text = data['text']

        ai = api_send_message(message_text)
        chat_id = data['chatId']

        if not chat_id:
            title = ' '.join(message_text.split()[:4]) + '...'
            chat = Chat.objects.create(user=request.user, name=title)

        else:
            try:
                chat = Chat.objects.get(id=chat_id)
            except Chat.DoesNotExist:
                return JsonResponse({'error': 'Chat does not exist'}, status=404, safe=False)

        # save user message
        SendMessage.objects.create(chat=chat, sender='user', message=message_text)

        ai_message = SendMessage.objects.create(chat=chat, sender='ai', message=ai.choices[0].message.content)

        return JsonResponse({
            'chatId': chat.id,
            'chatTitle': chat.name,
            'aiMessage': {
                'sender': ai_message.sender,
                'text': ai_message.message
            }

        }
        )
    return JsonResponse({'error': 'Please enter valid parameters'}, status=400)


@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data['email']
        password = data['password']
        user = Users.objects.filter(email=email).first()
        if user is not None and check_password(password, user.password):
            login(request, user)
            return JsonResponse({'success': True, 'email': request.user.email, 'username': request.user.username})

        else:
            return JsonResponse({'success': False, 'error': 'نام کاربری یا رمز عبور اشتباه است.'}, status=401)


@login_required
def logout_view(request):
    if request.user.is_authenticated:
        logout(request)
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False})
