import requests
def verify_token(token, ip):
    data = {
        "secret": "ES_54fa95cfc8de4fef84a1995b71025082",
        "response": token,
        "remoteip": ip,
        "sitekey": "e23cfd6e-f230-4432-87c8-2f608bc0b058",
    }
    j = requests.post(
        "https://api.hcaptcha.com/siteverify",
        data=data,
        timeout=5,
    ).json()
    return (True, []) if j.get("success") else (
        False,
        j.get("error-codes", []),
    )