from jinja2 import Environment, FileSystemLoader

env = Environment(loader=FileSystemLoader("templates"))

def render_order_email(data: dict):
    template = env.get_template("order_received.html")

    html = template.render(
        customer_name=data["customer_name"],
        order_id=data["order_id"],
        amount=data["amount"],
        date=data["date"],
        order_url=data["order_url"]
    )

    return html