from fastapi import APIRouter
from app.domain.schemas import AgentChatMessage
from typing import List

router = APIRouter(prefix="/agents", tags=["Multi-Agent Mesh"])

@router.post("/chat", response_model=AgentChatMessage)
async def chat_with_multi_agent_mesh(user_msg: AgentChatMessage):
    query = user_msg.content.lower()
    
    if "spray" in query or "dose" in query:
        reply = "Treatment Agent: For Tomato Early Blight, apply Mancozeb 75% WP at 2.5g/L dilution using a hollow cone nozzle. Spray in early morning hours."
        agent = "Treatment Agent"
    elif "weather" in query or "rain" in query:
        reply = "Weather Agent: Ambient humidity is currently 84%. Rain is forecasted in 48 hours. Fungal spore germination risk is CRITICAL."
        agent = "Weather Agent"
    elif "yield" in query or "loss" in query:
        reply = "Yield Agent: Without treatment, expected yield loss is 51.2% (~$1,050 financial impact per acre)."
        agent = "Yield Agent"
    else:
        reply = "Supervisor Agent: AgriMind AI Multi-Agent Network is actively monitoring your crop ecosystem. How can we assist your farming decisions today?"
        agent = "Supervisor Agent"
        
    return AgentChatMessage(
        sender="AgriMind Multi-Agent Assistant",
        content=reply,
        agent_type=agent
    )
