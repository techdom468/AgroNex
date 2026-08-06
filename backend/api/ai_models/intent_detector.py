import re
from thefuzz import fuzz
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Define the intents and their exact/fuzzy matching keywords
INTENT_KEYWORDS = {
    "Greeting": ["hello", "hi", "hey", "good morning", "good evening", "namaste", "kem cho"],
    "Weather": ["weather", "rain", "temperature", "humidity", "forecast", "climate", "hot", "cold"],
    "Government Schemes": ["scheme", "subsidy", "yojana", "pm-kisan", "insurance", "loan", "government"],
    "Crop Recommendation": ["recommend", "which crop", "best crop", "soil", "grow", "season", "planting"],
    "Disease": ["disease", "treatment", "symptom", "pest", "insect", "fungus", "chemical", "organic", "sick", "yellow leaves"],
}

# Example phrases for lightweight NLP similarity
INTENT_PHRASES = {
    "Greeting": [
        "hello there",
        "hi, how are you",
        "good morning"
    ],
    "Weather": [
        "what is the weather today",
        "will it rain tomorrow",
        "what is the temperature",
        "is it going to be humid"
    ],
    "Government Schemes": [
        "tell me about pm kisan yojana",
        "how to get agriculture subsidy",
        "details about crop insurance",
        "how to apply for a farming loan"
    ],
    "Crop Recommendation": [
        "which crop should i grow in black soil",
        "best crop for summer season",
        "recommend a crop for my farm"
    ],
    "Disease": [
        "my plant has yellow leaves what to do",
        "how to treat fungus in wheat",
        "what are the symptoms of leaf blight",
        "organic treatment for pests"
    ]
}

class IntentDetector:
    def __init__(self):
        self.corpus = []
        self.intent_labels = []
        
        for intent, phrases in INTENT_PHRASES.items():
            for phrase in phrases:
                self.corpus.append(phrase)
                self.intent_labels.append(intent)
                
        self.vectorizer = TfidfVectorizer().fit(self.corpus)
        self.tfidf_matrix = self.vectorizer.transform(self.corpus)

    def detect_intent(self, text):
        text = text.lower().strip()
        
        best_intent = "Unknown"
        best_confidence = 0.0

        # Fuzzy Matching
        fuzzy_scores = {intent: 0 for intent in INTENT_KEYWORDS.keys()}
        for intent, keywords in INTENT_KEYWORDS.items():
            for keyword in keywords:
                words = text.split()
                for word in words:
                    score = fuzz.ratio(keyword, word)
                    if score > fuzzy_scores[intent]:
                        fuzzy_scores[intent] = score

        # TF-IDF Cosine Similarity
        text_vector = self.vectorizer.transform([text])
        cosine_similarities = cosine_similarity(text_vector, self.tfidf_matrix).flatten()
        
        tfidf_scores = {intent: 0.0 for intent in INTENT_KEYWORDS.keys()}
        for i, score in enumerate(cosine_similarities):
            intent = self.intent_labels[i]
            if score > tfidf_scores[intent]:
                tfidf_scores[intent] = score

        # Combine Scores
        final_scores = {}
        for intent in INTENT_KEYWORDS.keys():
            f_score = fuzzy_scores[intent] / 100.0
            t_score = tfidf_scores[intent]
            
            combined_score = (f_score * 0.4) + (t_score * 0.6)
            
            # Exact word match boost
            for keyword in INTENT_KEYWORDS[intent]:
                if re.search(r'\b' + re.escape(keyword) + r'\b', text):
                    combined_score += 0.3
                    break
            
            final_scores[intent] = min(combined_score, 1.0)
            
            if final_scores[intent] > best_confidence:
                best_confidence = final_scores[intent]
                best_intent = intent

        confidence_pct = round(best_confidence * 100)

        # Fallback threshold if confidence is too low
        if confidence_pct < 70:
            best_intent = "General Agriculture"

        return best_intent, confidence_pct

intent_detector = IntentDetector()

def get_intent(text):
    return intent_detector.detect_intent(text)
