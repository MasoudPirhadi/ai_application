from django.shortcuts import render
from django.views.generic import View


# Create your views here.


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
