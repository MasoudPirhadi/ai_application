from openai import OpenAI

from ai_application import settings


def get_base_url():
    client = OpenAI(
        base_url="https://ai.liara.ir/api/v1/687a445eddea6dfdb8b0d892",
        api_key=settings.AI_API_KEY,
    )
    return client


def api_send_message(message: str):
    client = get_base_url()
    completion = client.chat.completions.create(
        model=settings.AI_MODEL,
        messages=[
            {
                "role": "user",
                "content": message
            }
        ]
    )
    return completion

