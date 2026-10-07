import os
from dotenv import load_dotenv

load_dotenv(override=True)

key = os.getenv("GEMINI_API_KEY", "")
print("=" * 50)
print(f"KEY LOADED FROM ENV: '{key}'")
print(f"KEY LENGTH: {len(key)}")
print(f"STARTS WITH AIzaSy? : {key.startswith('AIzaSy')}")
print("=" * 50)