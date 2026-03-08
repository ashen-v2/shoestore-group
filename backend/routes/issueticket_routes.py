from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from dependancies.dependancies import get_current_user
from db.session import get_session
from models.issuetickets import IssueTicket, IssueTicketCreate
from models.orders import Order
from models.tokens import TokenData

router : APIRouter = APIRouter( prefix="/issuetickets", tags=["issuetickets"])

@router.post("/{order_id}", status_code=201)
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