"""Domain-specific exceptions, translated into HTTP responses in the routes layer."""


class RegIntelError(Exception):
    """Base class for all expected application errors."""


class InvalidFileError(RegIntelError):
    """Raised when the uploaded file is not a supported/valid PDF."""


class PdfExtractionError(RegIntelError):
    """Raised when text cannot be extracted from a PDF."""


class GeminiServiceError(RegIntelError):
    """Raised when the Gemini API call fails or returns something unusable."""


class ExtractionParsingError(RegIntelError):
    """Raised when Gemini's output cannot be parsed into valid obligations."""
