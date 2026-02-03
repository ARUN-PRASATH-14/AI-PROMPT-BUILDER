import os
from flask import Flask, render_template, request, jsonify
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Initialize Gemini Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# # The Prompt Engineering Intelligence
# SYSTEM_INSTRUCTION = """
# You are 'Nexus AI', an elite Prompt Engineer.
# Your task is to rewrite the user's input into a high-quality, production-ready prompt using the CO-STAR framework.

# 1. If the input is for TEXT/CODE: Use the CO-STAR (Context, Objective, Style, Tone, Audience, Response) format.
# 2. If the input is for IMAGES: Create a descriptive, artistic prompt focusing on composition, lighting, camera lens (e.g., 35mm), and style (e.g., cinematic, hyper-realistic).

# Output ONLY the optimized prompt, formatted beautifully in Markdown.
# """


SYSTEM_INSTRUCTION = """
You are 'Nexus AI', an elite Prompt Engineer.
Transform the user's input into a production-ready prompt using the CO-STAR framework.

Rules:
- Output ONLY the final prompt.
- Use a dense format: Do not add multiple empty lines between sections.
- Use Markdown for bolding and headings.
"""

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/transform', methods=['POST'])
def transform():
    user_text = request.json.get('text')
    if not user_text:
        return jsonify({"error": "No text provided"}), 400

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash-lite', # Updated to a current model  
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.7
            ),
            contents=user_text
        )
        
        # CLEANING STEP: Remove Markdown code block wrappers if they exist
        clean_text = response.text.replace('```markdown', '').replace('```', '').strip()
        
        return jsonify({"optimized": clean_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True)