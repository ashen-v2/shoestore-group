from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from dependancies.dependancies import get_current_user, allow_admin_moderator
from db.session import get_session
from models.issuetickets import IssueTicket, IssueTicketCreate, IssueTicketStatusUpdate
from models.orders import Order
from models.tokens import TokenData
from datetime import datetime, timezone

router : APIRouter = APIRouter( prefix="/issuetickets", tags=["issuetickets"])

@router.get("/", response_model=list[IssueTicket], status_code=200)
def get_issue_tickets(session : Session = Depends(get_session),
                       current_user : TokenData = Depends(get_current_user), limit : int = 20, offset : int = 0 ):
    """Get all issue tickets for the current user"""
    issue_tickets : list[IssueTicket] = session.exec(select(IssueTicket)
                                                     .where(IssueTicket.user_id == current_user.user_id).offset(offset).limit(limit)).all()
    return issue_tickets

@router.post("/{order_id}", status_code=201, response_model=IssueTicket)
def create_issue_ticket(order_id : int, issueticket: IssueTicketCreate, session : Session = Depends(get_session),
                         current_user : TokenData = Depends(get_current_user)):
    """Create an issue ticket for an order"""
    order : Order = session.get(Order, order_id)
    if not order or order.user_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="Invalid Order")
    
   
    issue_ticket : IssueTicket = IssueTicket(user_id=current_user.user_id, order_id=order_id, subject=issueticket.subject, description=issueticket.description)
    session.add(issue_ticket)
    session.commit()
    session.refresh(issue_ticket)
    return issue_ticket

@router.get("/mod", response_model=list[IssueTicket], status_code=200, dependencies=[Depends(allow_admin_moderator)], tags=["moderator"])
def get_all_issue_tickets(session : Session = Depends(get_session), limit : int = 50, offset : int = 0):
    """Get all issue tickets (Admin/Moderator only)"""
    issue_tickets : list[IssueTicket] = session.exec(select(IssueTicket).offset(offset).limit(limit).order_by(IssueTicket.created_at.desc())).all()
    return issue_tickets

@router.patch("/mod/{ticket_id}", response_model=IssueTicket, tags=["moderator"])
def update_issue_ticket(ticket_id : int, status : IssueTicketStatusUpdate, session : Session = Depends(get_session), current_user : TokenData = Depends(allow_admin_moderator)):
    """Update the status of an issue ticket (Admin/Moderator only)"""
    issue_ticket : IssueTicket = session.get(IssueTicket, ticket_id)
    if not issue_ticket:
        raise HTTPException(status_code=404, detail="Issue Ticket not found")
    
    issue_ticket.status = status.status
    issue_ticket.updated_at = datetime.now(timezone.utc)
    session.add(issue_ticket)
    session.commit()
    session.refresh(issue_ticket)
    return issue_ticket

