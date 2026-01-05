from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_ibm import WatsonxLLM
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from ibm_watsonx_ai import Credentials
from dotenv import load_dotenv
load_dotenv()
import os

def setup_credentials():
    """Setup IBM Watsonx credentials"""
    model_id = "meta-llama/llama-3-3-70b-instruct"
    credentials = Credentials(
        url=os.getenv("URL"),
        api_key=os.getenv("API_KEY")
    )
    project_id = os.getenv("PROJECT_ID")
    return model_id, credentials, project_id

def create_summary_prompt():
    """Create prompt template for summarization"""
    template = """
    <|begin_of_text|><|start_header_id|>system<|end_header_id|>
    You are an AI assistant tasked with summarizing YouTube video transcripts.
    Provide concise, informative summaries that capture the main points.
    <|eot_id|><|start_header_id|>user<|end_header_id|>
    Please summarize the following YouTube video transcript:
    {transcript}<|eot_id|><|start_header_id|>assistant<|end_header_id|>
    """
    return PromptTemplate(input_variables=["transcript"], template=template)

def generate_summary(processed_transcript):
    """Generate summary from processed transcript"""
    model_id, credentials, project_id = setup_credentials()
    
    llm = WatsonxLLM(
        model_id=model_id,
        url=credentials.get("url"),
        project_id=project_id,
        params={"max_new_tokens": 1000},
        apikey=os.getenv("API_KEY")
    )
    
    summary_prompt = create_summary_prompt()
    summary_chain = LLMChain(llm=llm, prompt=summary_prompt)
    
    return summary_chain.run({"transcript": processed_transcript})