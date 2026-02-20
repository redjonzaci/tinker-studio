from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tinker

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/supported-models")
def get_supported_models(x_api_key: str = Header()):
    client = tinker.ServiceClient(api_key=x_api_key)
    capabilities = client.get_server_capabilities()
    return [
        {"model_name": model.model_name}
        for model in capabilities.supported_models
        if model.model_name is not None
    ]
