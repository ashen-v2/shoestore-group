from fastapi import APIRouter, Depends, HTTPException
from db.session import get_session
from sqlmodel import Session, select, func
from datetime import date, datetime, time, timedelta, timezone
from models.payments import Payment


router : APIRouter = APIRouter( prefix="/analytics", tags=["analytics"])


def _to_date_key(value) -> date:
    """Normalize SQL date/datetime/string values into a date key."""
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    if isinstance(value, str):
        return datetime.fromisoformat(value).date()
    raise ValueError(f"Unsupported date value type: {type(value)}")


def _month_shift(month_start: date, offset: int) -> date:
    """Shift a month-start date by offset months and return another month-start."""
    total_months = (month_start.year * 12 + month_start.month - 1) + offset
    year = total_months // 12
    month = (total_months % 12) + 1
    return date(year, month, 1)

@router.get("/sales-total/{duration}")
def get_sales_analytics(duration: str, session : Session = Depends(get_session)):
    now = datetime.now(timezone.utc)

    if duration == "daily":
        start_day = (now - timedelta(days=6)).date()
        start_date = datetime.combine(start_day, time.min, tzinfo=timezone.utc)

        query = (
            select(
                func.date(Payment.created_at).label("day"),
                func.sum(Payment.amount).label("revenue")
            )
            .where(Payment.status == "completed")
            .where(Payment.created_at >= start_date)
            .group_by(func.date(Payment.created_at))
            .order_by(func.date(Payment.created_at))
        )

        results = session.exec(query).all()

        revenue_map = {_to_date_key(r.day): float(r.revenue) for r in results}

        data = []
        for i in range(7):
            day = start_day + timedelta(days=i)
            label = day.strftime("%a")
            revenue = revenue_map.get(day, 0)

            data.append({
                "label": label,
                "revenue": revenue
            })

        return data


    elif duration == "weekly":
        current_week_start = now.date() - timedelta(days=now.weekday())
        week_starts = [current_week_start - timedelta(weeks=i) for i in range(7, -1, -1)]
        start_date = datetime.combine(week_starts[0], time.min, tzinfo=timezone.utc)

        query = (
            select(
                func.date_trunc("week", Payment.created_at).label("week"),
                func.sum(Payment.amount).label("revenue")
            )
            .where(Payment.status == "completed")
            .where(Payment.created_at >= start_date)
            .group_by(func.date_trunc("week", Payment.created_at))
            .order_by(func.date_trunc("week", Payment.created_at))
        )

        results = session.exec(query).all()

        revenue_map = {_to_date_key(r.week): float(r.revenue) for r in results}

        data = []
        for week_start in week_starts:
            label = week_start.strftime("%d %b")
            revenue = revenue_map.get(week_start, 0)

            data.append({
                "label": label,
                "revenue": revenue
            })

        return data


    elif duration == "monthly":
        current_month_start = now.date().replace(day=1)
        month_starts = [_month_shift(current_month_start, i) for i in range(-11, 1)]
        start_date = datetime.combine(month_starts[0], time.min, tzinfo=timezone.utc)

        query = (
            select(
                func.date_trunc("month", Payment.created_at).label("month"),
                func.sum(Payment.amount).label("revenue")
            )
            .where(Payment.status == "completed")
            .where(Payment.created_at >= start_date)
            .group_by(func.date_trunc("month", Payment.created_at))
            .order_by(func.date_trunc("month", Payment.created_at))
        )

        results = session.exec(query).all()

        revenue_map = {_to_date_key(r.month): float(r.revenue) for r in results}

        data = []
        for month_start in month_starts:
            label = month_start.strftime("%b")
            revenue = revenue_map.get(month_start, 0)

            data.append({
                "label": label,
                "revenue": revenue
            })

        return data

    else:
        raise HTTPException(status_code=400, detail="Invalid duration")