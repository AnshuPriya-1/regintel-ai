"""
Centralized application configuration.

All environment-driven values are loaded once here via pydantic-settings so
the rest of the codebase never touches os.environ directly. Import `settings`
wherever configuration is needed.
"""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # --- Gemini ---
    gemini_api_key: str = ""
    gemini_model: str = "gemini-3.5-flash"

    # --- CORS ---
    cors_origins: str = "http://localhost:3000"

    # --- Document chunking ---
    chunk_size_chars: int = 12000
    chunk_overlap_chars: int = 500

    # --- Misc ---
    max_upload_mb: int = 25

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Settings are cached so the .env file is only parsed once per process."""
    return Settings()


settings = get_settings()
