import PyPDF2

def extract_pdf_text(pdf_path):#./uploads/1739862478628_A8_008_Digix_231022.pdf

    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text()
    return text

import openai
# Set your OpenAI API key
openai.api_key = ""

def evaluate_text_with_llm(text):
    prompt = f"""    
    You are judges who were alumni of a U.S. top university who were angel investors, VC managers, directors from entrepreneurship NGOs, business school faculty, serial entrepreneurs, and senior managers from tech firms in the U.S. specializing in training in an accelerator program. 
    Your role is to help startups evaluate their own business plans based on qualitative and quantitative output.

    The evaluation includes:
    - **Qualitative**: Comments, feedback, and suggestions.
    - **Quantitative**: Provide scores based on the following metrics:
    - Market Gap
    - Market Attractiveness
    - Solution Potential
    - Team Potential
    - Investment Interests

    Also evaluate creativity based on:
    - Novelty
    - Empathy
    - Predicted demand
    - Purchase intent (both from evaluator and ideal user)
    - Feasibility, profitability, prototype quality, and usefulness

    The scores should be provided on a scale of 1.00 to 5.00.
    Text: {text}
    **Important:** Return the output strictly in the following JSON format:
        {{
            "qualitative": {{
                "comments": "...",
                "feedback": "...",
                "suggestions": "..."
            }},
            "quantitative": {{
                "market_gap": 0.0,
                "market_attractiveness": 0.0,
                "solution_potential": 0.0,
                "team_potential": 0.0,
                "investment_interests": 0.0
            }},
            "creativity": {
                {"novelty": 0.0,
                "empathy": 0.0,
                "predicted_demand": 0.0,
                "purchase_intent": 0.0,
                "feasibility": 0.0,
                "profitability": 0.0,
                "prototype_quality": 0.0,
                "usefulness": 0.0}
            }
        }}
    """
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response['choices'][0]['message']['content']
import json

def parse_evaluation(response):
    evaluation = json.loads(response)
    return evaluation

if __name__ == "__main__":
    # Step 1: Extract text from PDF
    pdf_path = "./uploads/1739862478628_A8_008_Digix_231022.pdf"
    text = extract_pdf_text(pdf_path)

    # Step 2: Evaluate text using LLM
    evaluation_response = evaluate_text_with_llm(text)

    # Step 3: Parse and display the evaluation
    evaluation = parse_evaluation(evaluation_response)
    if evaluation:
        print(json.dumps(evaluation, indent=4))