# multilingual-nlp-pipeline
A modular multilingual Natural Language Processing (NLP) pipeline capable of processing text in 100+ languages. The system detects the input language, translates it into a target language, and performs text classification using multilingual transformer models.  The pipeline follows a router-based architecture that allows dynamic selection of models for language detection, translation, and classification, making the system scalable and extensible for future experimentation.

Features->  
1. Language detection using fastText
2. Neural machine translation with MarianMT
3. Multilingual sentiment analysis using XLM-RoBERTa
4. Modular pipeline with dynamic model routing
5. Designed for extensibility, benchmarking, and adaptive learning
