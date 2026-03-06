from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str
    secret_key:str
    algorithm:str
    access_token_expire_minutes:int
    stripe_secret_key:str
    stripe_web_hook_secret:str

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()