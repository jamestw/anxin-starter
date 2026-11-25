from pydantic import BaseModel


class Page[T](BaseModel):
    """列表回應一律 { items, total }；查詢參數 limit / offset / q"""

    items: list[T]
    total: int
