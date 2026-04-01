import google.generativeai as genai
import json
import re
from app.core.config import settings
from app.models.complaint import AIAnalysisResult

# Configure Gemini with your API key
genai.configure(api_key=settings.GEMINI_API_KEY)

# Using Gemini 1.5 Flash — fast and cost effective for this use case
model = genai.GenerativeModel("gemini-1.5-flash")


def analyze_complaint(cleaned_body: str, subject: str) -> AIAnalysisResult:
    """
    Sends cleaned complaint text to Gemini.
    Gets back category, severity, sentiment, key issues, and draft response
    all in one single API call.
    """

    prompt = f"""
You are an expert customer complaint analyst for a business support team.
Analyze the following customer complaint email and return a JSON response only.

COMPLAINT SUBJECT: {subject}

COMPLAINT BODY:
{cleaned_body}

Analyze the above and return ONLY a valid JSON object with exactly these fields:

{{
    "category": "one of: billing / technical / delivery / product_quality / account / refund / general",
    "severity": "one of: low / medium / high / critical",
    "sentiment": "one of: positive / neutral / negative / angry",
    "key_issues": "2-3 sentence summary of the core problem the customer is facing",
    "draft_response": "a professional, empathetic response draft that an agent can review and send to the customer"
}}

SEVERITY GUIDELINES:
- critical: service completely down, legal threat, regulatory complaint, data breach
- high: major feature broken, significant financial impact, customer threatening to leave
- medium: partial issue, workaround exists, moderate frustration
- low: general inquiry, minor inconvenience, feedback

SENTIMENT GUIDELINES:
- angry: aggressive language, threats, all caps, multiple exclamation marks
- negative: clearly unhappy but calm
- neutral: factual, no strong emotion
- positive: polite, understanding despite the issue

DRAFT RESPONSE GUIDELINES:
- Start with empathy and acknowledgement
- Reference the specific issue mentioned
- Give a clear next step or resolution path
- Keep it professional and concise
- Do NOT make promises about timelines you cannot guarantee
- Sign off as "Support Team"

Return ONLY the JSON object. No explanation. No markdown. No extra text.
"""

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()

        # Sometimes Gemini wraps response in ```json ... ``` even when told not to
        # This strips it out safely
        response_text = re.sub(r'^```json\s*', '', response_text)
        response_text = re.sub(r'\s*```$', '', response_text)
        response_text = response_text.strip()

        # Parse the JSON response
        parsed = json.loads(response_text)

        # Validate all required fields are present
        required_fields = ["category", "severity", "sentiment", "key_issues", "draft_response"]
        for field in required_fields:
            if field not in parsed:
                raise ValueError(f"Gemini response missing field: {field}")

        # Validate field values are within expected options
        valid_categories = ["billing", "technical", "delivery", "product_quality", "account", "refund", "general"]
        valid_severities = ["low", "medium", "high", "critical"]
        valid_sentiments = ["positive", "neutral", "negative", "angry"]

        if parsed["category"] not in valid_categories:
            parsed["category"] = "general"

        if parsed["severity"] not in valid_severities:
            parsed["severity"] = "medium"

        if parsed["sentiment"] not in valid_sentiments:
            parsed["sentiment"] = "neutral"

        return AIAnalysisResult(
            category=parsed["category"],
            severity=parsed["severity"],
            sentiment=parsed["sentiment"],
            key_issues=parsed["key_issues"],
            draft_response=parsed["draft_response"],
            cleaned_body=cleaned_body
        )

    except json.JSONDecodeError as e:
        # If Gemini returns something unparseable, return safe defaults
        # so the complaint still gets saved even if AI analysis fails
        print(f"[GeminiService] JSON parse error: {e}")
        print(f"[GeminiService] Raw response was: {response_text}")
        return _fallback_result(cleaned_body)

    except Exception as e:
        print(f"[GeminiService] Unexpected error: {e}")
        return _fallback_result(cleaned_body)


def _fallback_result(cleaned_body: str) -> AIAnalysisResult:
    """
    Returns a safe default result if Gemini call fails for any reason.
    Complaint still gets saved — just marked for manual review.
    """
    return AIAnalysisResult(
        category="general",
        severity="medium",
        sentiment="neutral",
        key_issues="AI analysis failed — please review manually",
        draft_response="Thank you for reaching out. We have received your complaint and will get back to you shortly. — Support Team",
        cleaned_body=cleaned_body
    )