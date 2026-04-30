from pydantic import BaseModel


class PracticeTaskRequest(BaseModel):
    profession: str | None = None
    stepId: str | None = None


class PracticeCheckRequest(BaseModel):
    profession: str | None = None
    answer: str | None = None
    task: str | None = None
    stepId: str | None = None
    success: str | None = None


class MentorRequest(BaseModel):
    profession: str | None = None
    question: str | None = None
    context: str | None = None


class RoadmapHelpRequest(BaseModel):
    profession: str | None = None
    nodeLabel: str | None = None
    nodeStatus: str | None = None
    currentDescription: str | None = None
