from pydantic import BaseModel, Field
from typing import Optional, List

class Post(BaseModel):
    id: Optional[str] = None
    title: str
    content: str
    feather_type: str
    author_id: str = Field(...)
    tags: Optional[List[str]] = []
    likes: int = 0
    extra_data: Optional[dict] = {}

class Comment(BaseModel):
    id: Optional[str] = None
    post_id: str
    author_id: str
    content: str
    created_at: Optional[str] = None
