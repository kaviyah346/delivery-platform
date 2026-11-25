import os
from PIL import Image, ImageDraw, ImageFont

def get_font(size, bold=False):
    font_file = 'segoeuib.ttf' if bold else 'segoeui.ttf'
    font_path = os.path.join(r'C:\Windows\Fonts', font_file)
    if os.path.exists(font_path):
        return ImageFont.truetype(font_path, size)
    # Fallback to arial
    alt_file = 'arialbd.ttf' if bold else 'arial.ttf'
    alt_path = os.path.join(r'C:\Windows\Fonts', alt_file)
    if os.path.exists(alt_path):
        return ImageFont.truetype(alt_path, size)
    return ImageFont.load_default()

def draw_sidebar(draw, active_nav_idx=2):
    # Sidebar dimensions: 220 width, 750 height
    draw.rectangle([0, 0, 220, 750], fill='#351C15')
    
    # Logo header
    draw.rectangle([0, 0, 220, 65], fill='#2B1610')
    draw.rounded_rectangle([16, 14, 52, 50], radius=6, fill='#FFB500')
    font_logo = get_font(18, bold=True)
    draw.text((25, 20), "LS", font=font_logo, fill='#351C15')
    
    font_brand = get_font(13, bold=True)
    draw.text((62, 18), "Logistics System", font=font_brand, fill='#FFFFFF')
    font_brand_sub = get_font(9, bold=False)
    draw.text((62, 35), "ROUTE & CAPACITY HUB", font=font_brand_sub, fill='#FFB500')
    
    # Nav items
    nav_items = [
        ("Dashboard", False),
        ("Delivery Orders", False),
        ("Fleet & Capacity", active_nav_idx == 2),
        ("Route Planning", active_nav_idx == 3),
        ("Tracking & Reports", active_nav_idx == 4),
        ("AI Chatbot Assistant", active_nav_idx == 5),
    ]
    
    font_nav = get_font(12, bold=False)
    font_nav_active = get_font(12, bold=True)
    font_section = get_font(9, bold=True)
    
    draw.text((16, 82), "CORE MODULES", font=font_section, fill='#A0938E')
    
    y = 105
    for idx, (title, is_active) in enumerate(nav_items):
        if is_active:
            draw.rounded_rectangle([10, y, 210, y + 36], radius=6, fill='#FFB500')
            draw.text((22, y + 8), title, font=font_nav_active, fill='#351C15')
        else:
            draw.text((22, y + 8), title, font=font_nav, fill='#E0D7D3')
        y += 44
        
    # Footer
    draw.rectangle([0, 695, 220, 750], fill='#2B1610')
    draw.ellipse([18, 715, 26, 723], fill='#10B981')
    font_db = get_font(10, bold=False)
    draw.text((32, 712), "PostgreSQL Connected", font=font_db, fill='#E0D7D3')

def draw_header_bar(draw, title, subtitle):
    # Top navbar
    draw.rectangle([220, 0, 1200, 65], fill='#FFFFFF')
    draw.line([220, 65, 1200, 65], fill='#E2E4E8', width=1)
    
    font_title = get_font(17, bold=True)
    draw.text((245, 14), title, font=font_title, fill='#351C15')
    
    font_sub = get_font(10.5, bold=False)
    draw.text((245, 38), subtitle, font=font_sub, fill='#6B7280')
    
    # User badge
    draw.rounded_rectangle([1080, 15, 1175, 49], radius=18, fill='#F3F4F6')
    draw.ellipse([1085, 20, 1109, 44], fill='#351C15')
    font_avatar = get_font(10, bold=True)
    draw.text((1091, 26), "DS", font=font_avatar, fill='#FFB500')
    font_role = get_font(11, bold=True)
    draw.text((1116, 24), "Dispatcher", font=font_role, fill='#1F2937')

# -------------------------------------------------------------
# 1. SCREENSHOT: Fleet & Vehicle Capacity Management
# -------------------------------------------------------------
def render_fleet_screen():
    img = Image.new('RGB', (1200, 750), '#F4F4F6')
    draw = ImageDraw.Draw(img)
    draw_sidebar(draw, active_nav_idx=2)
    draw_header_bar(draw, "Fleet & Vehicle Capacity Management", "Real-time payload utilization, weight limits & driver assignments")
    
    # 4 Quick Stat Cards
    stat_cards = [
        ("TOTAL FLEET", "6", "Active vehicles", "#351C15"),
        ("AVAILABLE", "2", "Ready for dispatch", "#10B981"),
        ("OCCUPIED", "3", "Carrying active load", "#FFB500"),
        ("MAINTENANCE", "1", "Out of service", "#EF4444")
    ]
    card_w = 222
    for i, (lbl, val, sub, col) in enumerate(stat_cards):
        x = 245 + i * (card_w + 17)
        draw.rounded_rectangle([x, 80, x + card_w, 155], radius=8, fill='#FFFFFF')
        draw.line([x, 80, x, 155], fill=col, width=4)
        draw.text((x + 16, 92), lbl, font=get_font(10, bold=True), fill='#6B7280')
        draw.text((x + 16, 108), val, font=get_font(22, bold=True), fill='#1F2937')
        draw.text((x + 16, 137), sub, font=get_font(9.5, bold=False), fill='#9CA3AF')

    # Vehicle Cards Grid (4 detailed vehicle cards)
    vehicles = [
        {
            "num": "V-101", "model": "Freightliner Custom Chassis MT45",
            "load": 205.5, "max": 1500.0, "status": "OCCUPIED", "status_col": "#F59E0B",
            "driver": "Marcus Reed", "phone": "+1-404-555-0144"
        },
        {
            "num": "V-102", "model": "Ford E-450 Super Duty Cargo Van",
            "load": 340.0, "max": 2200.0, "status": "OCCUPIED", "status_col": "#F59E0B",
            "driver": "Elena Rostova", "phone": "+1-404-555-0178"
        },
        {
            "num": "V-103", "model": "Mercedes-Benz Sprinter 3500",
            "load": 0.0, "max": 1800.0, "status": "AVAILABLE", "status_col": "#10B981",
            "driver": "Jamal Washington", "phone": "+1-404-555-0199"
        },
        {
            "num": "V-104", "model": "Navistar International DuraStar",
            "load": 520.0, "max": 4500.0, "status": "OCCUPIED", "status_col": "#F59E0B",
            "driver": "Carlos Santana", "phone": "+1-404-555-0211"
        }
    ]
    
    grid_w = 460
    grid_h = 245
    for idx, v in enumerate(vehicles):
        gx = 245 + (idx % 2) * (grid_w + 20)
        gy = 175 + (idx // 2) * (grid_h + 18)
        
        draw.rounded_rectangle([gx, gy, gx + grid_w, gy + grid_h], radius=10, fill='#FFFFFF')
        draw.rounded_rectangle([gx, gy, gx + grid_w, gy + grid_h], radius=10, outline='#E2E4E8', width=1)
        
        # Vehicle badge & title
        draw.text((gx + 20, gy + 18), v["num"], font=get_font(18, bold=True), fill='#351C15')
        draw.text((gx + 85, gy + 22), v["model"], font=get_font(11, bold=False), fill='#6B7280')
        
        # Status pill
        draw.rounded_rectangle([gx + grid_w - 105, gy + 16, gx + grid_w - 20, gy + 40], radius=12, fill='#FFFBEB')
        draw.text((gx + grid_w - 95, gy + 21), v["status"], font=get_font(10, bold=True), fill=v["status_col"])
        
        # Load progress bar
        pct = (v["load"] / v["max"]) * 100
        draw.text((gx + 20, gy + 65), "Payload Capacity Utilization:", font=get_font(11, bold=True), fill='#1F2937')
        load_str = f"{v['load']:.1f} / {v['max']:.1f} kg ({pct:.1f}%)"
        draw.text((gx + grid_w - 165, gy + 65), load_str, font=get_font(11, bold=True), fill='#351C15')
        
        # Bar background
        draw.rounded_rectangle([gx + 20, gy + 88, gx + grid_w - 20, gy + 102], radius=7, fill='#E5E7EB')
        bar_fill_w = int((grid_w - 40) * (pct / 100.0))
        if bar_fill_w > 0:
            fill_col = '#EF4444' if pct >= 100 else '#FFB500' if pct > 70 else '#10B981'
            draw.rounded_rectangle([gx + 20, gy + 88, gx + 20 + max(14, bar_fill_w), gy + 102], radius=7, fill=fill_col)
            
        # Driver info box
        draw.rounded_rectangle([gx + 20, gy + 120, gx + grid_w - 20, gy + 175], radius=6, fill='#F9FAFB')
        draw.text((gx + 32, gy + 130), f"Assigned Driver: {v['driver']}", font=get_font(11.5, bold=True), fill='#1F2937')
        draw.text((gx + 32, gy + 150), f"Contact: {v['phone']}   •   Shift: Active / On-Duty", font=get_font(10.5, bold=False), fill='#6B7280')
        
        # Action button
        draw.rounded_rectangle([gx + 20, gy + 192, gx + 150, gy + 226], radius=6, fill='#351C15')
        draw.text((gx + 40, gy + 201), "Manage Carrier", font=get_font(10.5, bold=True), fill='#FFB500')
        
        draw.rounded_rectangle([gx + 160, gy + 192, gx + 310, gy + 226], radius=6, fill='#F3F4F6')
        draw.text((gx + 185, gy + 201), "Reallocate Load", font=get_font(10.5, bold=True), fill='#4B5563')

    # Overall Fleet Capacity Alert banner
    draw.rounded_rectangle([245, 680, 1175, 730], radius=8, fill='#FFFBEB')
    draw.rounded_rectangle([245, 680, 1175, 730], radius=8, outline='#FDE68A', width=1)
    draw.text((265, 695), "AUTOMATED CAPACITY GUARD: Active. Prevents vehicle payload exceeding maximum limit during allocation.", font=get_font(11, bold=True), fill='#92400E')
    
    img.save('screenshots/sample_fleet.png')
    print("Saved screenshots/sample_fleet.png")

# -------------------------------------------------------------
# 2. SCREENSHOT: Route Planning & Allocation
# -------------------------------------------------------------
def render_routes_screen():
    img = Image.new('RGB', (1200, 750), '#F4F4F6')
    draw = ImageDraw.Draw(img)
    draw_sidebar(draw, active_nav_idx=3)
    draw_header_bar(draw, "Route Planning and Allocation", "Multi-stop delivery sequencing, distance optimization & vehicle mapping")
    
    # Active Route Summary Header
    draw.rounded_rectangle([245, 80, 1175, 140], radius=8, fill='#FFFFFF')
    draw.rounded_rectangle([245, 80, 1175, 140], radius=8, outline='#E2E4E8', width=1)
    draw.text((265, 92), "CURRENT ACTIVE DISPATCH CORRIDOR", font=get_font(10, bold=True), fill='#FFB500')
    draw.text((265, 110), "Atlanta Regional Distribution Center -> Greater Metro Transit Corridor", font=get_font(14, bold=True), fill='#351C15')
    
    draw.rounded_rectangle([1030, 93, 1155, 127], radius=6, fill='#351C15')
    draw.text((1045, 101), "+ Add Route", font=get_font(11, bold=True), fill='#FFB500')
    
    # Left Panel: Route List Table (580 width)
    draw.rounded_rectangle([245, 155, 750, 725], radius=8, fill='#FFFFFF')
    draw.rounded_rectangle([245, 155, 750, 725], radius=8, outline='#E2E4E8', width=1)
    
    draw.text((265, 175), "PLANNED & IN-PROGRESS ROUTES", font=get_font(12, bold=True), fill='#351C15')
    
    routes_list = [
        {
            "code": "RT-ATL-HUB-01", "origin": "Atlanta Sorting Hub", "dest": "Downtown Commercial District",
            "dist": "42.5 km", "time": "1.8 hrs", "vehicle": "V-101", "status": "IN PROGRESS", "col": "#10B981"
        },
        {
            "code": "RT-ATL-METRO-02", "origin": "Atlanta Sorting Hub", "dest": "Buckhead Commercial Plaza",
            "dist": "68.0 km", "time": "2.5 hrs", "vehicle": "V-102", "status": "IN PROGRESS", "col": "#10B981"
        },
        {
            "code": "RT-SAV-CORR-03", "origin": "Atlanta Sorting Hub", "dest": "Savannah Industrial Terminal",
            "dist": "395.0 km", "time": "5.2 hrs", "vehicle": "V-104", "status": "PLANNED", "col": "#3B82F6"
        },
        {
            "code": "RT-AUG-EXPR-04", "origin": "Atlanta Sorting Hub", "dest": "Augusta Regional Distribution",
            "dist": "235.0 km", "time": "3.8 hrs", "vehicle": "V-103", "status": "COMPLETED", "col": "#6B7280"
        }
    ]
    
    ry = 210
    for r in routes_list:
        draw.rounded_rectangle([265, ry, 730, ry + 112], radius=6, fill='#F9FAFB')
        draw.rounded_rectangle([265, ry, 730, ry + 112], radius=6, outline='#E5E7EB', width=1)
        
        draw.text((280, ry + 12), r["code"], font=get_font(13, bold=True), fill='#351C15')
        draw.rounded_rectangle([630, ry + 10, 715, ry + 30], radius=10, fill='#EFF6FF')
        draw.text((642, ry + 13), r["status"], font=get_font(9, bold=True), fill=r["col"])
        
        draw.text((280, ry + 38), f"Route: {r['origin']}  ->  {r['dest']}", font=get_font(11, bold=False), fill='#1F2937')
        draw.text((280, ry + 60), f"Distance: {r['dist']}   |   Est. Duration: {r['time']}", font=get_font(10.5, bold=False), fill='#6B7280')
        draw.text((280, ry + 82), f"Assigned Carrier: {r['vehicle']}   •   Multi-stop optimized sequence", font=get_font(10.5, bold=True), fill='#D97706')
        
        ry += 125

    # Right Panel: Route Visual Transit Sequence (Map / Stops)
    draw.rounded_rectangle([770, 155, 1175, 725], radius=8, fill='#FFFFFF')
    draw.rounded_rectangle([770, 155, 1175, 725], radius=8, outline='#E2E4E8', width=1)
    
    draw.text((790, 175), "TRANSIT SEQUENCING: RT-ATL-HUB-01", font=get_font(12, bold=True), fill='#351C15')
    draw.text((790, 195), "Optimized stop order to minimize distance & transit delay", font=get_font(10, bold=False), fill='#6B7280')
    
    # Visual timeline stops
    stops = [
        ("Stop 1 (Depot)", "Atlanta Sorting Hub", "08:30 AM", "Depart with 205.5 kg payload"),
        ("Stop 2 (Delivery)", "1200 Techwood Dr NW", "09:15 AM", "Deliver ORD-1001 (85.5 kg)"),
        ("Stop 3 (Delivery)", "80 Jesse Hill Jr Dr SE", "10:00 AM", "Deliver ORD-1002 (120.0 kg)"),
        ("Stop 4 (Terminal)", "Downtown Logistics Hub", "10:45 AM", "Carrier V-101 released to Available")
    ]
    
    sy = 230
    for i, (stop_lbl, loc, time_str, note) in enumerate(stops):
        # Line connecting stops
        if i < len(stops) - 1:
            draw.line([815, sy + 15, 815, sy + 105], fill='#FFB500', width=3)
            
        # Circle badge
        draw.ellipse([805, sy + 5, 825, sy + 25], fill='#351C15', outline='#FFB500', width=2)
        draw.text((811, sy + 8), str(i + 1), font=get_font(10, bold=True), fill='#FFB500')
        
        # Stop details
        draw.text((840, sy + 3), stop_lbl, font=get_font(11, bold=True), fill='#FFB500')
        draw.text((840, sy + 20), loc, font=get_font(12, bold=True), fill='#1F2937')
        draw.text((840, sy + 40), f"Time: {time_str}   |   {note}", font=get_font(10, bold=False), fill='#6B7280')
        
        sy += 105

    # Algorithm performance pill
    draw.rounded_rectangle([790, 655, 1155, 705], radius=6, fill='#F3F4F6')
    draw.text((805, 672), "⚡ Route Efficiency Index: 96.4%   |   Fuel Savings: ~18.2%", font=get_font(10.5, bold=True), fill='#1F2937')

    img.save('screenshots/sample_routes.png')
    print("Saved screenshots/sample_routes.png")

# -------------------------------------------------------------
# 3. SCREENSHOT: Delivery Tracking & Reports
# -------------------------------------------------------------
def render_tracking_screen():
    img = Image.new('RGB', (1200, 750), '#F4F4F6')
    draw = ImageDraw.Draw(img)
    draw_sidebar(draw, active_nav_idx=4)
    draw_header_bar(draw, "Delivery Tracking & Performance Reports", "Live shipment milestone verification, SLA compliance & fleet intelligence")
    
    # 3 High-level SLA Metrics Cards
    kpis = [
        ("ON-TIME DELIVERY RATE", "98.4%", "SLA standard: 95.0%", "#10B981"),
        ("AVG TRANSIT TIME", "2.1 hrs", "Metro deliveries", "#3B82F6"),
        ("ZERO OVERLOAD INCIDENTS", "100%", "Capacity limits enforced", "#FFB500")
    ]
    for i, (lbl, val, sub, col) in enumerate(kpis):
        x = 245 + i * (300 + 15)
        draw.rounded_rectangle([x, 80, x + 300, 155], radius=8, fill='#FFFFFF')
        draw.line([x, 80, x, 155], fill=col, width=4)
        draw.text((x + 16, 92), lbl, font=get_font(10, bold=True), fill='#6B7280')
        draw.text((x + 16, 108), val, font=get_font(22, bold=True), fill='#1F2937')
        draw.text((x + 16, 137), sub, font=get_font(9.5, bold=False), fill='#9CA3AF')

    # Main Card: Live Parcel Milestone Tracker (ORD-1001)
    draw.rounded_rectangle([245, 175, 1175, 435], radius=8, fill='#FFFFFF')
    draw.rounded_rectangle([245, 175, 1175, 435], radius=8, outline='#E2E4E8', width=1)
    
    draw.text((270, 195), "SHIPMENT TRACKING DETAILS: ORD-1001", font=get_font(14, bold=True), fill='#351C15')
    draw.rounded_rectangle([1030, 192, 1150, 218], radius=13, fill='#F3E8FF')
    draw.text((1045, 197), "IN TRANSIT", font=get_font(10, bold=True), fill='#7C3AED')
    
    draw.text((270, 225), "Customer: Acme Industrial Corp   |   Contact: +1-404-555-8821   |   Weight: 85.5 kg   |   Priority: High", font=get_font(11, bold=False), fill='#4B5563')
    draw.text((270, 245), "Route: 1200 Techwood Dr NW -> 450 Peachtree St NE   |   Assigned Carrier: V-101", font=get_font(11, bold=False), fill='#6B7280')
    
    # Horizontal Milestone Step Timeline
    milestones = [
        ("ORDER PLACED", "Nov 18, 08:30 AM", "Registered in PostgreSQL", True),
        ("CARRIER ASSIGNED", "Nov 18, 09:15 AM", "Allocated to Carrier V-101", True),
        ("DISPATCHED", "Nov 19, 08:00 AM", "Departed Atlanta Hub", True),
        ("OUT FOR DELIVERY", "Nov 19, 09:30 AM", "En route to destination", True),
        ("DELIVERED", "Est. 11:30 AM", "Recipient signature required", False)
    ]
    
    # Connecting line across timeline
    draw.line([320, 315, 1080, 315], fill='#E5E7EB', width=4)
    draw.line([320, 315, 890, 315], fill='#10B981', width=4)
    
    for i, (m_lbl, m_time, m_sub, is_done) in enumerate(milestones):
        mx = 320 + i * 190
        # Node circle
        if is_done:
            draw.ellipse([mx - 15, 300, mx + 15, 330], fill='#10B981')
            draw.text((mx - 5, 307), "✔", font=get_font(11, bold=True), fill='#FFFFFF')
        else:
            draw.ellipse([mx - 15, 300, mx + 15, 330], fill='#FFFFFF', outline='#9CA3AF', width=2)
            draw.ellipse([mx - 5, 310, mx + 5, 320], fill='#9CA3AF')
            
        draw.text((mx - 55, 342), m_lbl, font=get_font(10.5, bold=True), fill='#351C15' if is_done else '#9CA3AF')
        draw.text((mx - 55, 360), m_time, font=get_font(9.5, bold=False), fill='#1F2937' if is_done else '#9CA3AF')
        draw.text((mx - 55, 376), m_sub, font=get_font(8.5, bold=False), fill='#6B7280')

    # Bottom Table: Recent Analytics Delivery Summary
    draw.rounded_rectangle([245, 455, 1175, 725], radius=8, fill='#FFFFFF')
    draw.rounded_rectangle([245, 455, 1175, 725], radius=8, outline='#E2E4E8', width=1)
    
    draw.text((270, 475), "RECENT COMPLETED SHIPMENTS & SLA LOGS", font=get_font(12, bold=True), fill='#351C15')
    
    # Headers
    draw.rectangle([270, 505, 1150, 535], fill='#F9FAFB')
    draw.text((285, 513), "ORDER ID", font=get_font(10, bold=True), fill='#6B7280')
    draw.text((395, 513), "CUSTOMER", font=get_font(10, bold=True), fill='#6B7280')
    draw.text((585, 513), "WEIGHT", font=get_font(10, bold=True), fill='#6B7280')
    draw.text((685, 513), "CARRIER", font=get_font(10, bold=True), fill='#6B7280')
    draw.text((795, 513), "DELIVERY TIME", font=get_font(10, bold=True), fill='#6B7280')
    draw.text((965, 513), "SLA STATUS", font=get_font(10, bold=True), fill='#6B7280')
    
    rows = [
        ("ORD-1006", "Starlight Office Furnishings", "210.0 kg", "V-103", "Nov 17, 02:45 PM", "ON TIME (COMPLETED)", "#10B981"),
        ("ORD-1008", "Metro Legal Services", "3.5 kg", "V-101", "Nov 16, 11:20 AM", "ON TIME (COMPLETED)", "#10B981"),
        ("ORD-1003", "Global Retail Distribution", "340.0 kg", "V-102", "Nov 19, In Transit", "WITHIN SLA WINDOW", "#3B82F6"),
        ("ORD-1007", "Horizon Aerospace Logistics", "520.0 kg", "V-104", "Nov 19, Assigned", "SCHEDULED ON TIME", "#3B82F6")
    ]
    
    ty = 545
    for r in rows:
        draw.line([270, ty - 3, 1150, ty - 3], fill='#F3F4F6', width=1)
        draw.text((285, ty), r[0], font=get_font(10.5, bold=True), fill='#351C15')
        draw.text((395, ty), r[1], font=get_font(10.5, bold=False), fill='#1F2937')
        draw.text((585, ty), r[2], font=get_font(10.5, bold=True), fill='#1F2937')
        draw.text((685, ty), r[3], font=get_font(10.5, bold=False), fill='#6B7280')
        draw.text((795, ty), r[4], font=get_font(10, bold=False), fill='#6B7280')
        draw.text((965, ty), r[5], font=get_font(10, bold=True), fill=r[6])
        ty += 42
        
    img.save('screenshots/sample_tracking.png')
    print("Saved screenshots/sample_tracking.png")

# -------------------------------------------------------------
# 4. SCREENSHOT: AI Logistics Dispatcher Chatbot
# -------------------------------------------------------------
def render_chatbot_screen():
    img = Image.new('RGB', (1200, 750), '#F4F4F6')
    draw = ImageDraw.Draw(img)
    draw_sidebar(draw, active_nav_idx=5)
    draw_header_bar(draw, "AI Logistics Assistant & Dispatch Bot", "Natural language querying for vehicle payload, parcel tracking & fleet optimization")
    
    # Main Chatbot Container (930 width, 645 height)
    draw.rounded_rectangle([245, 80, 1175, 725], radius=10, fill='#FFFFFF')
    draw.rounded_rectangle([245, 80, 1175, 725], radius=10, outline='#E2E4E8', width=1)
    
    # Chat Header
    draw.rounded_rectangle([245, 80, 1175, 140], radius=10, fill='#351C15')
    draw.rectangle([245, 120, 1175, 140], fill='#351C15') # flatten bottom corners
    
    draw.ellipse([265, 93, 297, 125], fill='#FFB500')
    draw.text((273, 99), "AI", font=get_font(13, bold=True), fill='#351C15')
    draw.text((310, 93), "Logistics Dispatcher Copilot", font=get_font(13.5, bold=True), fill='#FFFFFF')
    draw.text((310, 115), "Online • Connected to PostgreSQL Live Database", font=get_font(9.5, bold=False), fill='#10B981')
    
    # Quick action suggestion pills
    pills = [
        "📦 Track Order Status",
        "⚖ Available Vehicle Capacity",
        "🚨 High Priority Shipments",
        "🗺 Route ETA Query"
    ]
    px = 265
    for p in pills:
        pw = len(p) * 8 + 15
        draw.rounded_rectangle([px, 155, px + pw, 185], radius=14, fill='#F3F4F6')
        draw.text((px + 10, 163), p, font=get_font(9.5, bold=True), fill='#351C15')
        px += pw + 12

    # Chat Messages Thread
    # Msg 1: Bot Welcome
    draw.rounded_rectangle([265, 205, 840, 275], radius=10, fill='#F9FAFB')
    draw.rounded_rectangle([265, 205, 840, 275], radius=10, outline='#E5E7EB', width=1)
    draw.text((285, 218), "Hello Dispatcher! I can assist with capacity validation, route allocation,", font=get_font(11, bold=False), fill='#1F2937')
    draw.text((285, 240), "and live parcel updates. What shipment or carrier do you need to inspect?", font=get_font(11, bold=False), fill='#1F2937')
    draw.text((770, 252), "09:40 AM", font=get_font(8.5, bold=False), fill='#9CA3AF')

    # Msg 2: User Query
    draw.rounded_rectangle([580, 290, 1155, 345], radius=10, fill='#351C15')
    draw.text((600, 305), "Check available carrier capacity for an urgent 320 kg shipment to Buckhead.", font=get_font(11, bold=True), fill='#FFFFFF')
    draw.text((1085, 323), "09:41 AM", font=get_font(8.5, bold=False), fill='#FFB500')

    # Msg 3: Bot Response with Structured Data
    draw.rounded_rectangle([265, 360, 950, 480], radius=10, fill='#F0FDF4')
    draw.rounded_rectangle([265, 360, 950, 480], radius=10, outline='#BBF7D0', width=1)
    draw.text((285, 375), "✔ Found 2 vehicles capable of accommodating 320.0 kg without overloading:", font=get_font(11, bold=True), fill='#166534')
    draw.text((285, 400), "• Vehicle V-103 (Mercedes Sprinter): Status AVAILABLE (0.0 / 1800.0 kg payload).", font=get_font(10.5, bold=False), fill='#1F2937')
    draw.text((285, 420), "• Vehicle V-102 (Ford E-450): OCCUPIED with 340.0 kg (Current spare limit: 1,860.0 kg).", font=get_font(10.5, bold=False), fill='#1F2937')
    draw.text((285, 445), "Recommendation: Allocate to V-103 for direct dispatch without intermediate stops.", font=get_font(10.5, bold=True), fill='#D97706')
    draw.text((880, 458), "09:41 AM", font=get_font(8.5, bold=False), fill='#9CA3AF')

    # Msg 4: User Query 2
    draw.rounded_rectangle([680, 498, 1155, 550], radius=10, fill='#351C15')
    draw.text((700, 513), "What is the status of medical delivery ORD-1002?", font=get_font(11, bold=True), fill='#FFFFFF')
    draw.text((1085, 528), "09:42 AM", font=get_font(8.5, bold=False), fill='#FFB500')

    # Msg 5: Bot Response 2
    draw.rounded_rectangle([265, 565, 950, 645], radius=10, fill='#F9FAFB')
    draw.rounded_rectangle([265, 565, 950, 645], radius=10, outline='#E5E7EB', width=1)
    draw.text((285, 578), "📦 Order ORD-1002 (Apex Medical Supplies) is currently IN TRANSIT on Vehicle V-101.", font=get_font(11, bold=True), fill='#351C15')
    draw.text((285, 600), "Driver: Marcus Reed   |   Destination: 3400 Howell Mill Rd NW   |   ETA: Today, 11:45 AM", font=get_font(10.5, bold=False), fill='#4B5563')
    draw.text((285, 620), "Temperature alert tag: Normal   |   Route RT-ATL-HUB-01 is operating on schedule.", font=get_font(10, bold=False), fill='#10B981')
    draw.text((880, 625), "09:42 AM", font=get_font(8.5, bold=False), fill='#9CA3AF')

    # Bottom Prompt Input Bar
    draw.rounded_rectangle([265, 665, 1070, 712], radius=8, fill='#F3F4F6')
    draw.text((285, 680), "Ask Copilot: 'Allocate order ORD-1004 to V-103' or query capacity...", font=get_font(11, bold=False), fill='#9CA3AF')
    
    draw.rounded_rectangle([1080, 665, 1155, 712], radius=8, fill='#FFB500')
    draw.text((1098, 680), "Send", font=get_font(11, bold=True), fill='#351C15')

    img.save('screenshots/sample_chatbot.png')
    print("Saved screenshots/sample_chatbot.png")

if __name__ == "__main__":
    os.makedirs('screenshots', exist_ok=True)
    render_fleet_screen()
    render_routes_screen()
    render_tracking_screen()
    render_chatbot_screen()
    print("All 4 sample screens created successfully!")
