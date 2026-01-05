from flask import Blueprint, request, jsonify
from core.transcript import get_transcript, process_transcript
from core.summarizer import generate_summary, setup_credentials
from core.qa_engine import answer_question

api_blueprint = Blueprint('api', __name__)

# ! Cache for transcripts - Need Redis or chat history List from langchain
transcript_cache = {}

@api_blueprint.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "YouTube Summarizer API"}), 200

@api_blueprint.route('/transcript', methods=['POST'])
def fetch_transcript():
    """Fetch and return YouTube video transcript"""
    data = request.get_json()
    
    if not data or 'video_url' not in data:
        return jsonify({"error": "video_url is required"}), 400
    
    video_url = data['video_url']
    
    try:
        # Check cache first
        if video_url in transcript_cache:
            return jsonify({
                "video_url": video_url,
                "transcript": transcript_cache[video_url],
                "cached": True
            }), 200
        
        # Fetch transcript
        fetched_transcript = get_transcript(video_url)
        if not fetched_transcript:
            return jsonify({"error": "Could not fetch transcript"}), 404
        
        processed = process_transcript(fetched_transcript)
        
        # Cache the result
        transcript_cache[video_url] = processed
        
        return jsonify({
            "video_url": video_url,
            "transcript": processed,
            "cached": False
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_blueprint.route('/summarize', methods=['POST'])
def summarize():
    """Generate summary of YouTube video"""
    data = request.get_json()
    
    if not data or 'video_url' not in data:
        return jsonify({"error": "video_url is required"}), 400
    
    video_url = data['video_url']
    
    try:
        # Get or fetch transcript
        if video_url in transcript_cache:
            processed_transcript = transcript_cache[video_url]
        else:
            fetched_transcript = get_transcript(video_url)
            if not fetched_transcript:
                return jsonify({"error": "Could not fetch transcript"}), 404
            processed_transcript = process_transcript(fetched_transcript)
            transcript_cache[video_url] = processed_transcript
        
        # Generate summary
        summary = generate_summary(processed_transcript)
        
        return jsonify({
            "video_url": video_url,
            "summary": summary
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_blueprint.route('/ask', methods=['POST'])
def ask_question():
    """Answer question about YouTube video content"""
    data = request.get_json()
    
    if not data or 'video_url' not in data or 'question' not in data:
        return jsonify({"error": "video_url and question are required"}), 400
    
    video_url = data['video_url']
    question = data['question']
    
    try:
        # Get or fetch transcript
        if video_url in transcript_cache:
            processed_transcript = transcript_cache[video_url]
        else:
            fetched_transcript = get_transcript(video_url)
            if not fetched_transcript:
                return jsonify({"error": "Could not fetch transcript"}), 404
            processed_transcript = process_transcript(fetched_transcript)
            transcript_cache[video_url] = processed_transcript
        
        # Setup credentials
        _, credentials, project_id = setup_credentials()
        
        # Generate answer
        answer = answer_question(processed_transcript, question, credentials, project_id)
        
        return jsonify({
            "video_url": video_url,
            "question": question,
            "answer": answer
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500