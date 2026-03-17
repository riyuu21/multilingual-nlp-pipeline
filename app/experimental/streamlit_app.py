import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import streamlit as st
from pipeline.main_pipeline import run_pipeline

st.set_page_config(page_title="Multilingual NLP Pipeline", layout="centered")

st.title("🌍 Multilingual NLP Pipeline")
st.write("Detect → Translate → Classify text in 100+ languages")

# Input box
user_input = st.text_area("Enter your text:", height=150)

# Button
if st.button("Analyze Text"):

    if user_input.strip() == "":
        st.warning("Please enter some text.")
    else:
        with st.spinner("Processing..."):

            result = run_pipeline(user_input)

        st.success("Analysis Complete!")

        # Display results
        st.subheader("Results")

        st.write(f"**Detected Language:** {result['language']}")
        st.write(f"**Translation:** {result['translation']}")
        st.write(f"**Prediction:** {result['prediction']}")
        st.write(f"**Confidence:** {round(result['confidence'], 3)}")