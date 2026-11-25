import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 widescreen layout
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # blank layout

    # Professional Logistics Color Palette
    COLOR_PRIMARY = RGBColor(53, 28, 21)         # Dark Brown (#351C15)
    COLOR_ACCENT = RGBColor(255, 181, 0)         # Golden Yellow (#FFB500)
    COLOR_BG = RGBColor(248, 249, 250)           # Off-white / light slate
    COLOR_CARD = RGBColor(255, 255, 255)         # Card background
    COLOR_CARD_BORDER = RGBColor(226, 232, 240)   # Slate 200 border
    COLOR_TEXT_MAIN = RGBColor(31, 41, 55)       # Dark Gray (#1F2937)
    COLOR_TEXT_MUTED = RGBColor(100, 116, 139)   # Slate 500
    COLOR_GREEN = RGBColor(16, 185, 129)         # Emerald Green
    COLOR_BLUE = RGBColor(37, 99, 235)           # Blue (#2563EB)
    COLOR_PURPLE = RGBColor(139, 92, 246)        # Purple
    COLOR_AMBER = RGBColor(217, 119, 6)          # Amber

    def add_header(slide, title_text, category_text="DELIVERY ROUTE & VEHICLE CAPACITY MANAGEMENT PLATFORM"):
        # Header banner shape
        header_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(1.05))
        header_bar.fill.solid()
        header_bar.fill.fore_color.rgb = COLOR_PRIMARY
        header_bar.line.fill.background()

        # Gold accent stripe under header
        stripe = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(1.05), Inches(13.333), Inches(0.05))
        stripe.fill.solid()
        stripe.fill.fore_color.rgb = COLOR_ACCENT
        stripe.line.fill.background()

        # Text in header
        tx_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.12), Inches(11.7), Inches(0.80))
        tf = tx_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p0 = tf.paragraphs[0]
        p0.text = category_text.upper()
        p0.font.size = Pt(9.5)
        p0.font.bold = True
        p0.font.color.rgb = COLOR_ACCENT
        p0.space_after = Pt(2)

        p1 = tf.add_paragraph()
        p1.text = title_text
        p1.font.size = Pt(21)
        p1.font.bold = True
        p1.font.color.rgb = RGBColor(255, 255, 255)

    # -------------------------------------------------------------
    # SLIDE 1: Title Slide (Team DevCore)
    # -------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_layout)

    # Background
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = COLOR_PRIMARY
    bg1.line.fill.background()

    # Decorative gold bar
    deco_bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.0), Inches(1.3), Inches(0.8), Inches(0.08))
    deco_bar.fill.solid()
    deco_bar.fill.fore_color.rgb = COLOR_ACCENT
    deco_bar.line.fill.background()

    # Main Title Box
    t_box = slide1.shapes.add_textbox(Inches(1.0), Inches(1.55), Inches(11.3), Inches(2.2))
    tf1 = t_box.text_frame
    tf1.word_wrap = True
    tf1.margin_left = tf1.margin_top = tf1.margin_right = tf1.margin_bottom = 0

    p_sub = tf1.paragraphs[0]
    p_sub.text = "LOGISTICS & FLEET OPERATIONS PLATFORM"
    p_sub.font.size = Pt(13)
    p_sub.font.bold = True
    p_sub.font.color.rgb = COLOR_ACCENT
    p_sub.space_after = Pt(6)

    p_title = tf1.add_paragraph()
    p_title.text = "Delivery Route and Vehicle Capacity\nManagement Platform"
    p_title.font.size = Pt(36)
    p_title.font.bold = True
    p_title.font.color.rgb = RGBColor(255, 255, 255)
    p_title.space_after = Pt(10)

    # Problem Statement Card
    ps_card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(3.9), Inches(11.3), Inches(1.2))
    ps_card.fill.solid()
    ps_card.fill.fore_color.rgb = RGBColor(74, 40, 30)
    ps_card.line.color.rgb = COLOR_ACCENT
    ps_card.line.width = Pt(1.5)

    ps_tf = ps_card.text_frame
    ps_tf.word_wrap = True
    ps_tf.margin_left = Inches(0.4)
    ps_tf.margin_top = Inches(0.2)
    ps_tf.margin_right = Inches(0.4)

    p_ps_lbl = ps_tf.paragraphs[0]
    p_ps_lbl.text = "PROBLEM STATEMENT"
    p_ps_lbl.font.size = Pt(11)
    p_ps_lbl.font.bold = True
    p_ps_lbl.font.color.rgb = COLOR_ACCENT
    p_ps_lbl.space_after = Pt(4)

    p_ps_txt = ps_tf.add_paragraph()
    p_ps_txt.text = "Manage delivery routes efficiently while ensuring vehicle payload carrying capacity is never exceeded."
    p_ps_txt.font.size = Pt(16)
    p_ps_txt.font.color.rgb = RGBColor(255, 255, 255)

    # Team Info Box (Exact names from user submission)
    team_card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(5.35), Inches(11.3), Inches(1.55))
    team_card.fill.solid()
    team_card.fill.fore_color.rgb = RGBColor(43, 22, 17)
    team_card.line.color.rgb = RGBColor(100, 60, 50)
    team_card.line.width = Pt(1.0)

    team_tf = team_card.text_frame
    team_tf.word_wrap = True
    team_tf.margin_left = Inches(0.4)
    team_tf.margin_top = Inches(0.18)

    p_team_lbl = team_tf.paragraphs[0]
    p_team_lbl.text = "PROJECT REVIEW 1   |   TEAM NAME: DevCore"
    p_team_lbl.font.size = Pt(13)
    p_team_lbl.font.bold = True
    p_team_lbl.font.color.rgb = COLOR_ACCENT
    p_team_lbl.space_after = Pt(4)

    p_members = team_tf.add_paragraph()
    p_members.text = "Team Members:  Kaviya M  |  Sowmiya R P  |  Meaghaa S  |  Mahadev Baba"
    p_members.font.size = Pt(13)
    p_members.font.bold = True
    p_members.font.color.rgb = RGBColor(255, 255, 255)
    p_members.space_after = Pt(4)

    p_team_sub = team_tf.add_paragraph()
    p_team_sub.text = "Full-Stack Web Application  •  Spring Boot  •  React  •  PostgreSQL  •  AI Chatbot Integration"
    p_team_sub.font.size = Pt(11)
    p_team_sub.font.color.rgb = RGBColor(209, 213, 219)

    # -------------------------------------------------------------
    # SLIDE 2: Tech Stack
    # -------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    add_header(slide2, "Technology Stack & System Architecture")

    col_width = Inches(3.64)
    col_gap = Inches(0.4)
    left_start = Inches(0.8)
    top_pos = Inches(1.45)
    card_height = Inches(5.45)

    tech_columns = [
        {
            "category": "FRONTEND STACK",
            "subtitle": "User Interface & Visualization",
            "accent": COLOR_ACCENT,
            "items": [
                ("React.js 18", "Component-driven responsive SPA"),
                ("Tailwind CSS", "Clean, minimal logistics design system"),
                ("React Router v6", "Seamless multi-module navigation"),
                ("Axios", "REST API integration & error handling"),
                ("Recharts", "Interactive pie charts & bar graphs"),
                ("Lucide React", "Consistent modern logistics iconography")
            ]
        },
        {
            "category": "BACKEND STACK",
            "subtitle": "Enterprise Business Logic",
            "accent": COLOR_PRIMARY,
            "items": [
                ("Java 21 (LTS)", "Robust high-performance platform"),
                ("Spring Boot 3.3", "Clean layered micro-framework"),
                ("Spring Data JPA", "Data access & custom JPQL queries"),
                ("Hibernate ORM", "Relational persistence & schema mapping"),
                ("Jakarta Validation", "Server-side mandatory constraint rules"),
                ("Maven 3.9", "Dependency management & build pipeline")
            ]
        },
        {
            "category": "DATABASE & AI ASSISTANT",
            "subtitle": "Persistence & Conversational AI",
            "accent": COLOR_BLUE,
            "items": [
                ("PostgreSQL 16", "Database: ups_logistics (full persistence)"),
                ("Capacity Guard", "Enforced at DB transaction level"),
                ("RESTful APIs", "Structured endpoints with HTTP status codes"),
                ("Postman Testing", "Complete API verification suite"),
                ("AI Logistics Chatbot", "Interactive dispatcher support assistant"),
                ("Clean Architecture", "Controller -> Service -> Repository -> DB")
            ]
        }
    ]

    for idx, col in enumerate(tech_columns):
        col_left = left_start + idx * (col_width + col_gap)

        card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col_left, top_pos, col_width, card_height)
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD
        card.line.color.rgb = COLOR_CARD_BORDER
        card.line.width = Pt(1.5)

        tag = slide2.shapes.add_shape(MSO_SHAPE.RECTANGLE, col_left, top_pos, col_width, Inches(0.85))
        tag.fill.solid()
        tag.fill.fore_color.rgb = COLOR_PRIMARY
        tag.line.fill.background()

        tag_tf = tag.text_frame
        tag_tf.word_wrap = True
        tag_tf.margin_left = Inches(0.3)
        tag_tf.margin_top = Inches(0.12)

        p_tag = tag_tf.paragraphs[0]
        p_tag.text = col["category"]
        p_tag.font.size = Pt(13)
        p_tag.font.bold = True
        p_tag.font.color.rgb = COLOR_ACCENT

        p_tag_sub = tag_tf.add_paragraph()
        p_tag_sub.text = col["subtitle"]
        p_tag_sub.font.size = Pt(9.5)
        p_tag_sub.font.color.rgb = RGBColor(229, 231, 235)

        tx = slide2.shapes.add_textbox(col_left + Inches(0.25), top_pos + Inches(1.05), col_width - Inches(0.5), card_height - Inches(1.2))
        tf = tx.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        for i, (name, desc) in enumerate(col["items"]):
            p_item = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
            p_item.text = f"•  {name}"
            p_item.font.size = Pt(12)
            p_item.font.bold = True
            p_item.font.color.rgb = COLOR_TEXT_MAIN

            p_desc = tf.add_paragraph()
            p_desc.text = f"    {desc}"
            p_desc.font.size = Pt(10)
            p_desc.font.color.rgb = COLOR_TEXT_MUTED
            p_desc.space_after = Pt(7.5)

    # -------------------------------------------------------------
    # SLIDE 3: Details About Modules
    # -------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    add_header(slide3, "Complete Application Modules Overview", "PLATFORM ARCHITECTURE — 5 MODULES + AI CHATBOT")

    modules_data = [
        {
            "num": "MODULE 1",
            "name": "Operations Dashboard",
            "status": "IMPLEMENTED",
            "status_color": COLOR_GREEN,
            "desc": "Live overview of logistics operations: 6 real-time KPI statistics cards, Recharts pie and bar charts, vehicle capacity utilization progress meters, and recent order stream directly from PostgreSQL."
        },
        {
            "num": "MODULE 2",
            "name": "Delivery Order Management",
            "status": "IMPLEMENTED",
            "status_color": COLOR_GREEN,
            "desc": "Complete shipment lifecycle: automatic order ID generation (ORD-XXXX), full CRUD operations, customer contacts, pickup and delivery routing, weight logging, multi-criteria filtering, and live vehicle assignment."
        },
        {
            "num": "MODULE 3",
            "name": "Fleet & Vehicle Capacity Management",
            "status": "FOUNDATION READY",
            "status_color": COLOR_AMBER,
            "desc": "Vehicle carrying limits enforcement: database models for carriers, driver contacts, maximum capacity limits, and automatic load calculations ensuring payloads never exceed capacity."
        },
        {
            "num": "MODULE 4",
            "name": "Route Planning & Allocation",
            "status": "FUTURE SCOPE",
            "status_color": COLOR_BLUE,
            "desc": "Optimized delivery sequencing: route codes, transit distance calculations, estimated durations, and algorithmic multi-order allocation across available carriers."
        },
        {
            "num": "MODULE 5",
            "name": "Delivery Tracking & Reports",
            "status": "FUTURE SCOPE",
            "status_color": COLOR_BLUE,
            "desc": "Operational intelligence: milestone tracking, SLA compliance analytics, delivery completion reports, and historical fleet efficiency metrics."
        },
        {
            "num": "ADD-ON",
            "name": "AI Logistics Dispatcher Chatbot",
            "status": "PANEL SUGGESTION / UPCOMING",
            "status_color": COLOR_PURPLE,
            "desc": "Conversational assistant: allows dispatchers to query parcel status, check available vehicle capacities, receive overload alerts, and get instant routing advice via natural language."
        }
    ]

    m_top = Inches(1.35)
    m_height = Inches(0.88)
    m_gap = Inches(0.1)

    for i, mod in enumerate(modules_data):
        curr_top = m_top + i * (m_height + m_gap)

        m_card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), curr_top, Inches(11.72), m_height)
        m_card.fill.solid()
        m_card.fill.fore_color.rgb = COLOR_CARD
        m_card.line.color.rgb = COLOR_CARD_BORDER
        m_card.line.width = Pt(1.5)

        m_tf = m_card.text_frame
        m_tf.word_wrap = True
        m_tf.margin_left = Inches(0.25)
        m_tf.margin_top = Inches(0.10)
        m_tf.margin_right = Inches(0.25)

        p_m_title = m_tf.paragraphs[0]
        p_m_title.text = f"{mod['num']}: {mod['name'].upper()}   "
        p_m_title.font.size = Pt(11.5)
        p_m_title.font.bold = True
        p_m_title.font.color.rgb = COLOR_PRIMARY

        run_status = p_m_title.add_run()
        run_status.text = f"[{mod['status']}]"
        run_status.font.size = Pt(9.5)
        run_status.font.bold = True
        run_status.font.color.rgb = mod["status_color"]
        p_m_title.space_after = Pt(2)

        p_m_desc = m_tf.add_paragraph()
        p_m_desc.text = mod["desc"]
        p_m_desc.font.size = Pt(9.5)
        p_m_desc.font.color.rgb = COLOR_TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 4: ALL UI SCREENS IN ONE SLIDE (With Actual Screenshots Embedded)
    # -------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_layout)
    add_header(slide4, "Platform UI & Chatbot Interface Showcase", "ALL 6 APPLICATION SCREENS IN ONE CONSOLIDATED VIEW")

    ph_width = Inches(3.64)
    ph_gap_x = Inches(0.40)
    ph_left_start = Inches(0.8)

    ph_height = Inches(2.72)
    ph_gap_y = Inches(0.24)
    ph_top_start = Inches(1.35)

    ui_screens = [
        {
            "tag": "1. OPERATIONS DASHBOARD",
            "img": "screenshots/image1.png",
            "desc": "Real-time KPI metrics, status pie chart & vehicle load progress"
        },
        {
            "tag": "2. DELIVERY ORDER MANAGEMENT",
            "img": "screenshots/image2.png",
            "desc": "Structured shipment records, real-time search & multi-status filters"
        },
        {
            "tag": "3. FLEET & CAPACITY",
            "img": "screenshots/sample_fleet.png",
            "desc": "Vehicle carrying limits, active payload meters & driver allocations"
        },
        {
            "tag": "4. ROUTE PLANNING",
            "img": "screenshots/sample_routes.png",
            "desc": "Multi-stop delivery sequences, distance logs & vehicle route mapping"
        },
        {
            "tag": "5. TRACKING & REPORTS",
            "img": "screenshots/sample_tracking.png",
            "desc": "Live parcel milestone tracker, SLA compliance & fleet logs"
        },
        {
            "tag": "6. AI DISPATCHER CHATBOT",
            "img": "screenshots/sample_chatbot.png",
            "desc": "Conversational assistant for instant parcel query & capacity alerts"
        }
    ]

    for i, ui in enumerate(ui_screens):
        row = i // 3
        col = i % 3

        c_left = ph_left_start + col * (ph_width + ph_gap_x)
        c_top = ph_top_start + row * (ph_height + ph_gap_y)

        # Outer Card Container
        card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left, c_top, ph_width, ph_height)
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD
        card.line.color.rgb = COLOR_CARD_BORDER
        card.line.width = Pt(1.5)

        # Header Pill in Card
        h_pill = slide4.shapes.add_shape(MSO_SHAPE.RECTANGLE, c_left, c_top, ph_width, Inches(0.36))
        h_pill.fill.solid()
        h_pill.fill.fore_color.rgb = COLOR_PRIMARY
        h_pill.line.fill.background()

        h_tf = h_pill.text_frame
        h_tf.word_wrap = True
        h_tf.margin_left = Inches(0.15)
        h_tf.margin_top = Inches(0.06)

        p_ht = h_tf.paragraphs[0]
        p_ht.text = ui["tag"]
        p_ht.font.size = Pt(9.5)
        p_ht.font.bold = True
        p_ht.font.color.rgb = COLOR_ACCENT

        # Embed Screenshot image
        img_path = ui["img"]
        if os.path.exists(img_path):
            img_left = c_left + Inches(0.10)
            img_top = c_top + Inches(0.42)
            img_w = ph_width - Inches(0.20)
            img_h = Inches(1.88)
            slide4.shapes.add_picture(img_path, img_left, img_top, width=img_w, height=img_h)

        # Description text below screenshot box
        desc_box = slide4.shapes.add_textbox(c_left + Inches(0.10), c_top + Inches(2.34), ph_width - Inches(0.20), Inches(0.34))
        desc_tf = desc_box.text_frame
        desc_tf.word_wrap = True
        desc_tf.margin_left = desc_tf.margin_top = desc_tf.margin_right = desc_tf.margin_bottom = 0

        p_desc = desc_tf.paragraphs[0]
        p_desc.text = ui["desc"]
        p_desc.font.size = Pt(8.5)
        p_desc.font.color.rgb = COLOR_TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 5: Core Business Logic (Clean 3-Pillar Minimal Layout)
    # -------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_layout)
    add_header(slide5, "Core Business Logic & Capacity Rules", "SYSTEM RULES & TECHNICAL ENFORCEMENT")

    # 3 Large Horizontal Pillars (Organized, Airy, Only Necessary Content)
    p_left = Inches(0.8)
    p_width = Inches(11.72)
    p_height = Inches(1.60)
    p_gap = Inches(0.24)
    p_start_top = Inches(1.50)

    pillars = [
        {
            "num": "01",
            "title": "Strict Vehicle Payload Protection",
            "tag": "GUARANTEED ZERO OVERLOADING",
            "tag_col": COLOR_GREEN,
            "bullets": [
                "Every carrier enforces a hard maximum carrying capacity (kg) stored in PostgreSQL.",
                "Real-time validation calculates current load + package weight before allocation.",
                "Throws transaction-level CapacityExceededException (HTTP 400) on any excess."
            ]
        },
        {
            "num": "02",
            "title": "Dynamic Load Recalculation & Lifecycle",
            "tag": "REAL-TIME SYNCHRONIZATION",
            "tag_col": COLOR_AMBER,
            "bullets": [
                "Order creation, update, and deletion automatically recalculate active vehicle payloads.",
                "Vehicle state automatically toggles between Available and Occupied.",
                "Completed/Delivered shipments immediately release carrier payload capacity."
            ]
        },
        {
            "num": "03",
            "title": "Permanent PostgreSQL Persistence",
            "tag": "ENTERPRISE ACID STORAGE",
            "tag_col": COLOR_BLUE,
            "bullets": [
                "Zero browser local-storage reliance; all records permanently persist in PostgreSQL 16.",
                "Structured relational tables: delivery_orders, vehicles, and delivery_routes.",
                "Automatic audit timestamps ensure full traceability across system restarts."
            ]
        }
    ]

    for i, p in enumerate(pillars):
        curr_y = p_start_top + i * (p_height + p_gap)

        # Card container
        card = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, p_left, curr_y, p_width, p_height)
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD
        card.line.color.rgb = COLOR_CARD_BORDER
        card.line.width = Pt(1.5)

        # Left Accent Number Badge
        num_box = slide5.shapes.add_shape(MSO_SHAPE.RECTANGLE, p_left, curr_y, Inches(1.2), p_height)
        num_box.fill.solid()
        num_box.fill.fore_color.rgb = COLOR_PRIMARY
        num_box.line.fill.background()

        num_tf = num_box.text_frame
        num_tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_num = num_tf.paragraphs[0]
        p_num.alignment = PP_ALIGN.CENTER
        p_num.text = p["num"]
        p_num.font.size = Pt(22)
        p_num.font.bold = True
        p_num.font.color.rgb = COLOR_ACCENT

        # Content Text Box
        c_tx = slide5.shapes.add_textbox(p_left + Inches(1.45), curr_y + Inches(0.14), p_width - Inches(1.65), p_height - Inches(0.28))
        c_tf = c_tx.text_frame
        c_tf.word_wrap = True
        c_tf.margin_left = c_tf.margin_top = c_tf.margin_right = c_tf.margin_bottom = 0

        # Title & Tag
        p_h = c_tf.paragraphs[0]
        p_h.text = p["title"] + "   "
        p_h.font.size = Pt(14)
        p_h.font.bold = True
        p_h.font.color.rgb = COLOR_PRIMARY

        r_tag = p_h.add_run()
        r_tag.text = f"[{p['tag']}]"
        r_tag.font.size = Pt(10)
        r_tag.font.bold = True
        r_tag.font.color.rgb = p["tag_col"]
        p_h.space_after = Pt(6)

        # Short concise bullets
        for b in p["bullets"]:
            p_b = c_tf.add_paragraph()
            p_b.text = f"• {b}"
            p_b.font.size = Pt(10.5)
            p_b.font.color.rgb = COLOR_TEXT_MAIN
            p_b.space_after = Pt(3)

    # -------------------------------------------------------------
    # SLIDE 6: Review 1 Summary & Roadmap (Clean 2-Column Minimal Layout)
    # -------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_layout)
    add_header(slide6, "Project Review 1 Summary & Next Steps", "MILESTONE REVIEW & FUTURE ROADMAP")

    col_w = Inches(5.66)
    col_h = Inches(4.30)
    col_y = Inches(1.50)

    # Left Column: Review 1 Completed Deliverables
    card_l = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), col_y, col_w, col_h)
    card_l.fill.solid()
    card_l.fill.fore_color.rgb = COLOR_CARD
    card_l.line.color.rgb = COLOR_CARD_BORDER
    card_l.line.width = Pt(1.5)

    # Header in Left Card
    hl = slide6.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), col_y, col_w, Inches(0.75))
    hl.fill.solid()
    hl.fill.fore_color.rgb = COLOR_PRIMARY
    hl.line.fill.background()

    hl_tf = hl.text_frame
    hl_tf.word_wrap = True
    hl_tf.margin_left = Inches(0.3)
    hl_tf.margin_top = Inches(0.12)
    p_hl = hl_tf.paragraphs[0]
    p_hl.text = "✔  REVIEW 1 COMPLETED DELIVERABLES"
    p_hl.font.size = Pt(12.5)
    p_hl.font.bold = True
    p_hl.font.color.rgb = COLOR_ACCENT
    p_hl_sub = hl_tf.add_paragraph()
    p_hl_sub.text = "Verified Working Full-Stack Integration"
    p_hl_sub.font.size = Pt(9.5)
    p_hl_sub.font.color.rgb = RGBColor(229, 231, 235)

    # Bullets Left
    tx_l = slide6.shapes.add_textbox(Inches(1.1), col_y + Inches(0.95), col_w - Inches(0.6), col_h - Inches(1.1))
    tf_l = tx_l.text_frame
    tf_l.word_wrap = True
    tf_l.margin_left = tf_l.margin_top = tf_l.margin_right = tf_l.margin_bottom = 0

    review1_pts = [
        ("Operations Dashboard", "6 live KPI metrics, status pie chart, priority bar graph, and vehicle capacity meters."),
        ("Delivery Order Management", "Full CRUD operations, automatic ORD-XXXX ID generation, and address routing."),
        ("Search & Filter System", "Instant keyword search with delivery status and priority multi-filtering."),
        ("PostgreSQL 16 Persistence", "Permanent relational database storage with pre-seeded test data."),
        ("Production Quality", "Spring Boot layered architecture, Jakarta Validation, and Postman API test suite.")
    ]

    for idx, (title, desc) in enumerate(review1_pts):
        p_t = tf_l.paragraphs[0] if idx == 0 else tf_l.add_paragraph()
        p_t.text = f"• {title}"
        p_t.font.size = Pt(11)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_TEXT_MAIN

        p_d = tf_l.add_paragraph()
        p_d.text = f"   {desc}"
        p_d.font.size = Pt(9.5)
        p_d.font.color.rgb = COLOR_TEXT_MUTED
        p_d.space_after = Pt(6)

    # Right Column: Phase 2 Next Steps
    card_r = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.86), col_y, col_w, col_h)
    card_r.fill.solid()
    card_r.fill.fore_color.rgb = COLOR_CARD
    card_r.line.color.rgb = COLOR_CARD_BORDER
    card_r.line.width = Pt(1.5)

    # Header in Right Card
    hr = slide6.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.86), col_y, col_w, Inches(0.75))
    hr.fill.solid()
    hr.fill.fore_color.rgb = COLOR_PRIMARY
    hr.line.fill.background()

    hr_tf = hr.text_frame
    hr_tf.word_wrap = True
    hr_tf.margin_left = Inches(0.3)
    hr_tf.margin_top = Inches(0.12)
    p_hr = hr_tf.paragraphs[0]
    p_hr.text = "🚀  PHASE 2 ROADMAP & NEXT STEPS"
    p_hr.font.size = Pt(12.5)
    p_hr.font.bold = True
    p_hr.font.color.rgb = COLOR_ACCENT
    p_hr_sub = hr_tf.add_paragraph()
    p_hr_sub.text = "Upcoming Capabilities & Extensions"
    p_hr_sub.font.size = Pt(9.5)
    p_hr_sub.font.color.rgb = RGBColor(229, 231, 235)

    # Bullets Right
    tx_r = slide6.shapes.add_textbox(Inches(7.16), col_y + Inches(0.95), col_w - Inches(0.6), col_h - Inches(1.1))
    tf_r = tx_r.text_frame
    tf_r.word_wrap = True
    tf_r.margin_left = tf_r.margin_top = tf_r.margin_right = tf_r.margin_bottom = 0

    phase2_pts = [
        ("Interactive Fleet Module", "Dedicated fleet management, maintenance scheduling, and carrier reassignment."),
        ("Algorithmic Route Optimization", "Multi-stop vehicle transit sequencing to minimize travel distance and fuel costs."),
        ("AI Dispatcher Chatbot", "Interactive conversational interface for order queries and proactive capacity warnings."),
        ("Live Parcel GPS Tracking", "Real-time delivery progress updates, milestone tracking, and customer portal."),
        ("Logistics SLA Analytics", "Delivery turnaround analytics, historical reports, and fleet efficiency scoring.")
    ]

    for idx, (title, desc) in enumerate(phase2_pts):
        p_t = tf_r.paragraphs[0] if idx == 0 else tf_r.add_paragraph()
        p_t.text = f"• {title}"
        p_t.font.size = Pt(11)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_TEXT_MAIN

        p_d = tf_r.add_paragraph()
        p_d.text = f"   {desc}"
        p_d.font.size = Pt(9.5)
        p_d.font.color.rgb = COLOR_TEXT_MUTED
        p_d.space_after = Pt(6)

    # Bottom Highlight Callout (Airy & Clean)
    callout = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.05), Inches(11.72), Inches(0.95))
    callout.fill.solid()
    callout.fill.fore_color.rgb = RGBColor(255, 251, 235)
    callout.line.color.rgb = COLOR_ACCENT
    callout.line.width = Pt(1.5)

    c_tf = callout.text_frame
    c_tf.word_wrap = True
    c_tf.vertical_anchor = MSO_ANCHOR.MIDDLE

    p_call = c_tf.paragraphs[0]
    p_call.alignment = PP_ALIGN.CENTER
    p_call.text = "CORE OBJECTIVE & IMPACT"
    p_call.font.size = Pt(11)
    p_call.font.bold = True
    p_call.font.color.rgb = COLOR_PRIMARY
    p_call.space_after = Pt(2)

    p_call_sub = c_tf.add_paragraph()
    p_call_sub.alignment = PP_ALIGN.CENTER
    p_call_sub.text = "Guaranteed zero vehicle over-capacity compliance with high-performance relational persistence and intelligent route planning readiness."
    p_call_sub.font.size = Pt(11)
    p_call_sub.font.color.rgb = COLOR_TEXT_MAIN

    primary_filename = "Delivery_Route_and_Vehicle_Capacity_Management_Platform.pptx"
    updated_filename = "Delivery_Route_and_Vehicle_Capacity_Management_Platform_Updated.pptx"
    
    try:
        prs.save(primary_filename)
        print(f"Presentation successfully updated and saved: {primary_filename}")
    except PermissionError:
        print(f"Notice: {primary_filename} is currently open in PowerPoint. Saving as {updated_filename}...")
        prs.save(updated_filename)
        print(f"Presentation successfully updated and saved: {updated_filename}")

if __name__ == "__main__":
    create_presentation()
