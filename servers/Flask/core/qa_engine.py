from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_ibm import WatsonxLLM, WatsonxEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
import os

def chunk_transcript(processed_transcript, chunk_size=200, chunk_overlap=20):
    """Split transcript into chunks"""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    return text_splitter.split_text(processed_transcript)

def create_faiss_index(chunks, credentials, project_id):
    """Create FAISS index from chunks"""
    embedding_model = WatsonxEmbeddings(
        model_id='ibm/slate-30m-english-rtrvr-v2',
        url=credentials["url"],
        project_id=project_id,
        apikey=os.getenv("API_KEY")
    )
    return FAISS.from_texts(chunks, embedding_model)

def create_qa_prompt_template():
    """Create Q&A prompt template"""
    qa_template = """
    You are an expert assistant providing detailed answers based on video content.
    Relevant Video Context: {context}
    Question: {question}
    """
    return PromptTemplate(
        input_variables=["context", "question"],
        template=qa_template
    )

def answer_question(processed_transcript, question, credentials, project_id):
    """Generate answer to question using RAG"""
    chunks = chunk_transcript(processed_transcript)
    faiss_index = create_faiss_index(chunks, credentials, project_id)
    
    llm = WatsonxLLM(
        model_id="meta-llama/llama-3-3-70b-instruct",
        url=credentials.get("url"),
        project_id=project_id,
        params={"max_new_tokens": 2000, "min_new_tokens": 50},
        apikey=os.getenv("API_KEY")
    )
    
    qa_prompt = create_qa_prompt_template()
    qa_chain = LLMChain(llm=llm, prompt=qa_prompt)
    
    relevant_context = faiss_index.similarity_search(question, k=7)
    answer = qa_chain.predict(context=relevant_context, question=question)
    
    return answer