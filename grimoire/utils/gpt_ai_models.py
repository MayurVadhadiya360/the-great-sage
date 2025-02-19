from groq import Groq
from database.db import get_database
import os


def get_models() -> dict[str, dict[str, dict[str, float|int]]]:
    db_col = get_database()['ModelSpec']
    providers = list(db_col.find({"active": True}))

    model_specs = {}
    for provider in providers:
        provider_name = provider["provider"]
        model_specs[provider_name] = provider["models"]
    return model_specs

MODELS_SPEC = get_models()

def get_provider_models_list():
    provider_models: list[dict[str, str | list[str]]] = [
        {"provider": provider, "models": list(models.keys())} for provider, models in MODELS_SPEC.items()
    ]
    return provider_models


def get_model_spec(model_name: str) -> dict[str, float | int] | None:
    for provider, models in MODELS_SPEC.items():
        if model_name in models:
            return models.get(model_name)
    return None


API_KEY = os.getenv("API_KEY")
GROQ_CLIENT = Groq(api_key=API_KEY)

def get_assistant_response(model_name:str, context:list[dict] = []) -> str:
    model_spec = get_model_spec(model_name)
    if model_spec is None:
        return "Model not found"

    completion = GROQ_CLIENT.chat.completions.create(
        model=model_name,
        messages=context,
        temperature=model_spec["temperature"],
        max_completion_tokens=model_spec["max_completion_tokens"],
        top_p=model_spec["top_p"],
        stream=False,
        stop=None,
    )

    response = str(completion.choices[0].message.content)
    return response
