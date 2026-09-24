from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Department

from app.core.security import get_current_user
from app.models.models import User
from app.schemas.schemas import SymptomAnalysisRequest, SymptomAnalysisResponse
from app.services.ai_service import analyze_symptoms
from app.services.department_matcher import resolve_department

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/analyze-symptoms", response_model=SymptomAnalysisResponse)
async def analyze_symptoms_endpoint(
    payload: SymptomAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    names = [d.name for d in db.query(Department).order_by(Department.name).all()]
    result = await analyze_symptoms(payload.symptoms, payload.age, payload.gender, names)
    dep = resolve_department(db, result.get("department"))
    if dep:
        result["department"] = dep.name
        result["department_id"] = dep.id
    return SymptomAnalysisResponse(**result)
