from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import auth_router, disease_router, agents_router, community_router, simulation_router, weather_router, farm_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="AgriMind AI - Next-Generation Multi-Agent Agricultural Intelligence Platform API"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router.router, prefix=settings.API_V1_STR)
app.include_router(disease_router.router, prefix=settings.API_V1_STR)
app.include_router(agents_router.router, prefix=settings.API_V1_STR)
app.include_router(community_router.router, prefix=settings.API_V1_STR)
app.include_router(simulation_router.router, prefix=settings.API_V1_STR)
app.include_router(weather_router.router, prefix=settings.API_V1_STR)
app.include_router(farm_router.router, prefix=settings.API_V1_STR)



@app.get("/")
async def root():
    return {
        "status": "online",
        "system": "AgriMind AI",
        "tagline": "Predict. Explain. Prevent. Optimize.",
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "AgriMind AI Backend Engine",
        "version": settings.VERSION
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
