import re

def clean_email_body(body: str) -> str:
    """
    Takes raw email body and returns only the actual complaint text.
    Removes signatures, reply chains, disclaimers, and extra whitespace.
    """
    if not body:
        return ""

    cleaned = body

    # Step 1 — Remove HTML tags (if email came in HTML format)
    cleaned = re.sub(r'<[^>]+>', ' ', cleaned)

    # Step 2 — Remove email reply chains
    # Handles patterns like "On Mon, Jan 1 2024, John wrote:"
    cleaned = re.sub(
        r'On\s.+?wrote:\s*',
        '',
        cleaned,
        flags=re.DOTALL
    )

    # Step 3 — Remove quoted reply lines starting with ">"
    cleaned = re.sub(r'>.*', '', cleaned, flags=re.MULTILINE)

    # Step 4 — Remove common signature patterns
    signature_patterns = [
        r'(?i)regards.*',
        r'(?i)best regards.*',
        r'(?i)warm regards.*',
        r'(?i)thanks.*',
        r'(?i)thank you.*',
        r'(?i)sincerely.*',
        r'(?i)cheers.*',
        r'(?i)yours (truly|faithfully|sincerely).*',
    ]
    for pattern in signature_patterns:
        cleaned = re.sub(pattern, '', cleaned, flags=re.DOTALL)

    # Step 5 — Remove disclaimer blocks
    # Common in corporate emails
    cleaned = re.sub(
        r'(?i)(disclaimer|confidentiality notice|this email).+',
        '',
        cleaned,
        flags=re.DOTALL
    )

    # Step 6 — Remove URLs
    cleaned = re.sub(r'http\S+|www\S+', '', cleaned)

    # Step 7 — Remove email addresses from body text
    cleaned = re.sub(r'\S+@\S+', '', cleaned)

    # Step 8 — Remove phone numbers
    cleaned = re.sub(r'(\+?\d[\d\s\-().]{7,}\d)', '', cleaned)

    # Step 9 — Remove extra whitespace and blank lines
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
    cleaned = re.sub(r'[ \t]+', ' ', cleaned)
    cleaned = cleaned.strip()

    return cleaned


def extract_sender_name(body: str) -> str:
    """
    Tries to extract sender name from email signature.
    Returns empty string if not found.
    """
    # Looks for patterns like "Regards, John" or "Thanks, John Smith"
    match = re.search(
        r'(?i)(?:regards|thanks|sincerely|cheers)[,\s]+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)',
        body
    )
    if match:
        return match.group(1).strip()
    return ""


def is_auto_reply(subject: str, body: str) -> bool:
    """
    Detects if the email is an auto-reply or out-of-office.
    Helps avoid processing system-generated emails as complaints.
    """
    auto_reply_keywords = [
        'auto-reply',
        'out of office',
        'automatic reply',
        'autoreply',
        'do not reply',
        'noreply',
        'no-reply',
        'delivery failed',
        'undeliverable',
        'mailer-daemon'
    ]

    subject_lower = subject.lower()
    body_lower = body.lower()

    for keyword in auto_reply_keywords:
        if keyword in subject_lower or keyword in body_lower:
            return True

    return False