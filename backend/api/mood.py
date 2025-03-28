# mood.py

from transformers import AutoTokenizer, AutoModelForSequenceClassification
from torch.nn.functional import softmax
import torch

class MoodAnalyzer:
    def __init__(self, model_name: str = "cardiffnlp/twitter-roberta-base-sentiment"):
        self.model_name = model_name
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        self.labels = ["negative", "neutral", "positive"]

    def analyze(self, text: str) -> dict:
        if not text or not text.strip():
            return {"label": "neutral", "score": 0.0}

        encoded_input = self.tokenizer(text, return_tensors='pt', truncation=True)
        with torch.no_grad():
            output = self.model(**encoded_input)
            scores = softmax(output.logits, dim=1)[0].tolist()

        top_idx = int(torch.argmax(output.logits))
        return {
            "label": self.labels[top_idx],
            "score": round(scores[top_idx], 4),
            "scores": dict(zip(self.labels, map(lambda s: round(s, 4), scores)))
        }

# Example usage:
if __name__ == "__main__":
    analyzer = MoodAnalyzer()
    result = analyzer.analyze("I feel amazing today!")
    print(result)
