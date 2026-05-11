import sys
import random
from PySide6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                             QHBoxLayout, QFrame, QLabel, QPushButton, 
                             QSlider, QGridLayout, QScrollArea, QGraphicsView,
                             QGraphicsScene, QGraphicsEllipseItem, QGraphicsLineItem, QMenu)
from PySide6.QtCore import Qt, QSize, QTimer, QPointF
from PySide6.QtGui import QColor, QFont, QIcon, QPainter, QLinearGradient, QPen

# Constants for exact matching
BG_APP = "#020304"
BG_PANEL = "#0A0C0F"
ACCENT_GREEN = "#00FF88"
ACCENT_BLUE = "#00C2FF"
ACCENT_YELLOW = "#FFD400"
TEXT_DIM = "rgba(255, 255, 255, 0.3)"

class StylizedFrame(QFrame):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setStyleSheet(f"""
            QFrame {{
                background-color: {BG_PANEL};
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 4px;
            }}
        """)

class HeaderBlock(QWidget):
    def __init__(self, label, value, show_divider=True, parent=None):
        super().__init__(parent)
        layout = QHBoxLayout(self)
        layout.setContentsMargins(10, 0, 10, 0)
        layout.setSpacing(15)
        
        info = QVBoxLayout()
        info.setSpacing(1)
        lbl = QLabel(label.upper())
        lbl.setStyleSheet(f"color: {TEXT_DIM}; font-size: 8px; font-weight: 900; letter-spacing: 1.5px;")
        val = QLabel(value)
        val.setStyleSheet("color: white; font-size: 13px; font-weight: 700; padding-top: 1px;")
        info.addWidget(lbl)
        info.addWidget(val)
        layout.addLayout(info)
        
        if show_divider:
            line = QFrame()
            line.setFixedWidth(1)
            line.setStyleSheet("background: rgba(255, 255, 255, 0.06); margin: 18px 0;")
            layout.addWidget(line)

class DiagnosticPanel(StylizedFrame):
    def __init__(self, title, parent=None, is_scan=False, is_bscan=False):
        super().__init__(parent)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(12, 12, 12, 12)
        
        # Header
        header = QHBoxLayout()
        header.setSpacing(10)
        t = QLabel(title.upper())
        t.setStyleSheet("color: white; font-size: 10px; font-weight: 800; letter-spacing: 1px;")
        header.addWidget(t)
        header.addStretch()
        
        if is_bscan:
            nav = QHBoxLayout()
            nav.setSpacing(6)
            st = QLabel("Scan 5 / 12 ▾")
            st.setStyleSheet(f"color: {TEXT_DIM}; font-size: 9px; font-weight: 900;")
            prev = QLabel("<")
            nxt = QLabel(">")
            for item in [st, prev, nxt]:
                item.setStyleSheet(f"color: {TEXT_DIM}; font-size: 9px; font-weight: 950;")
                nav.addWidget(item)
            header.addLayout(nav)
        
        # Grid Controls
        for icon in ["▦", "▣"]:
            btn = QLabel(icon)
            btn.setStyleSheet(f"color: {TEXT_DIM}; font-size: 14px;")
            header.addWidget(btn)
            
        layout.addLayout(header)
        
        # Main Visual Area (Procedural Scan)
        self.viz = QFrame()
        self.viz.setStyleSheet("background: #050608; border-radius: 2px;")
        v_layout = QVBoxLayout(self.viz)
        v_layout.setContentsMargins(0, 0, 0, 0)
        
        if is_scan:
            self.scan_viz = ScanWidget(is_bscan=is_bscan)
            v_layout.addWidget(self.scan_viz)
            
            if is_bscan:
                # Add Thumbnail Strip for B-Scan
                thumbs = QHBoxLayout()
                thumbs.setSpacing(4)
                thumbs.setContentsMargins(10, 0, 10, 10)
                
                # Arrows
                prev = QLabel("<")
                prev.setStyleSheet(f"color: {TEXT_DIM}; font-weight: bold;")
                thumbs.addWidget(prev)
                
                for i in range(5):
                    card = QFrame()
                    card.setFixedSize(40, 30)
                    style = "background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 2px;"
                    if i == 2: # Highlight central one
                        style = f"background: rgba(0, 255, 136, 0.05); border: 1px solid {ACCENT_GREEN}; border-radius: 2px;"
                        t_layout = QVBoxLayout(card)
                        t_layout.setContentsMargins(0,0,0,0)
                        plus = QLabel("+")
                        plus.setAlignment(Qt.AlignmentFlag.AlignCenter)
                        plus.setStyleSheet(f"color: {ACCENT_GREEN}; font-size: 14px; font-weight: bold; border: none; background: transparent;")
                        t_layout.addWidget(plus)
                    card.setStyleSheet(style)
                    thumbs.addWidget(card)
                
                nxt = QLabel(">")
                nxt.setStyleSheet(f"color: {TEXT_DIM}; font-weight: bold;")
                thumbs.addWidget(nxt)
                v_layout.addLayout(thumbs)
        else:
            # Camera View Placeholder
            cam = QLabel("FEED STABLE")
            cam.setAlignment(Qt.AlignmentFlag.AlignCenter)
            cam.setStyleSheet(f"color: {TEXT_DIM}; font-size: 8px; font-weight: 800;")
            v_layout.addWidget(cam)
            
        layout.addWidget(self.viz, 1)
        
        # Footer
        footer = QHBoxLayout()
        footer.setSpacing(10)
        footer.addWidget(QLabel("☼"))
        slider = QSlider(Qt.Orientation.Horizontal)
        slider.setValue(80)
        slider.setStyleSheet("""
            QSlider::handle:horizontal {
                background: white;
                width: 10px;
                height: 10px;
                border-radius: 5px;
                margin: -4px 0;
            }
            QSlider::groove:horizontal {
                background: rgba(255,255,255,0.05);
                height: 2px;
            }
        """)
        footer.addWidget(slider)
        val = QLabel("80%")
        val.setStyleSheet(f"color: {TEXT_DIM}; font-size: 10px; min-width: 25px;")
        footer.addWidget(val)
        layout.addLayout(footer)

class ScanWidget(QWidget):
    def __init__(self, parent=None, is_bscan=False):
        super().__init__(parent)
        self.is_bscan = is_bscan
        self.points = []
        num_points = 100 if is_bscan else 200
        for i in range(num_points):
            self.points.append(random.uniform(20, 40))
            
    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        
        w = self.width()
        h = self.height()
        
        if self.is_bscan:
            # Draw Curved Line with points
            pen = QPen(QColor(255, 255, 255, 80), 1.2)
            painter.setPen(pen)
            
            for i in range(len(self.points) - 1):
                # Normalized pos 0 to 1
                t = i / len(self.points)
                t2 = (i+1) / len(self.points)
                
                # Curvature
                offset = 40 * (1 - (2*t - 1)**2)
                offset2 = 40 * (1 - (2*t2 - 1)**2)
                
                x1 = t * w
                y1 = h - 20 - offset - self.points[i]
                x2 = t2 * w
                y2 = h - 20 - offset2 - self.points[i+1]
                
                painter.drawLine(x1, y1, x2, y2)
                
                if i % 5 == 0:
                    painter.setBrush(QColor(255, 255, 255, 100))
                    painter.drawEllipse(x1 - 1, y1 - 1, 2, 2)
        else:
            # Enface Scan (Grid of points/reticle)
            painter.setPen(QPen(QColor(255, 255, 255, 20)))
            for i in range(10):
                painter.drawLine(0, i * h / 10, w, i * h / 10)
                painter.drawLine(i * w / 10, 0, i * w / 10, h)
            painter.setPen(QPen(QColor(ACCENT_GREEN, 50), 1))
            painter.drawEllipse(w/2 - 50, h/2 - 50, 100, 100)

class ActionGroup(QFrame):
    def __init__(self, title, buttons, parent=None):
        super().__init__(parent)
        self.setStyleSheet(f"""
            QFrame {{
                background: transparent;
                border: none;
            }}
            QLabel {{
                color: {TEXT_DIM};
                font-size: 8px;
                font-weight: 950;
                letter-spacing: 1.5px;
            }}
        """)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 20, 0)
        layout.setSpacing(8)
        
        lbl = QLabel(title.upper())
        layout.addWidget(lbl)
        
        btn_row = QHBoxLayout()
        btn_row.setSpacing(8)
        for b_name, b_icon, b_color in buttons:
            btn = QPushButton(f"{b_icon} {b_name}")
            style = f"""
                QPushButton {{
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 4px;
                    padding: 6px 16px;
                    color: white;
                    font-size: 11px;
                    font-weight: 700;
                    min-width: 60px;
                }}
                QPushButton:hover {{
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.15);
                }}
            """
            if b_color:
                # Custom color icons/text
                style = style.replace("color: white;", f"color: {b_color};")
                style = style.replace("border: 1px solid rgba(255,255,255,0.08);", f"border: 1px solid {b_color}33;")
            btn.setStyleSheet(style)
            btn_row.addWidget(btn)
        layout.addLayout(btn_row)

from PySide6.QtOpenGLWidgets import QOpenGLWidget

class EyeGraphicsView(QGraphicsView):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setViewport(QOpenGLWidget())
        self.setScene(QGraphicsScene(self))
        self.setBackgroundBrush(QColor("#030507"))
        self.setRenderHint(QPainter.RenderHint.Antialiasing)
        self.setFrameShape(QFrame.Shape.NoFrame)
        self.draw_mock_eye()
        
    def draw_mock_eye(self):
        # Base Eye Image (simulated with a gradient ellipse for now)
        eye_base = self.scene().addEllipse(-250, -250, 500, 500, QPen(Qt.GlobalColor.transparent), QColor(20, 22, 25))
        
        # Grid lines (Crosshairs) - dotted
        grid_pen = QPen(QColor(255, 255, 255, 40), 1, Qt.PenStyle.DotLine)
        self.scene().addLine(-500, 0, 500, 0, grid_pen)
        self.scene().addLine(0, -500, 0, 500, grid_pen)
        
        # Limbus Ring (Yellow)
        limbus_pen = QPen(QColor(ACCENT_YELLOW), 1.5)
        self.scene().addEllipse(-210, -210, 420, 420, limbus_pen)
        
        # Limbus Nodes (4 yellow squares)
        node_size = 5
        node_brush = QColor(ACCENT_YELLOW)
        nodes = [(0, -210), (210, 0), (0, 210), (-210, 0)]
        for nx, ny in nodes:
            rect = self.scene().addRect(nx - node_size/2, ny - node_size/2, node_size, node_size, QPen(Qt.GlobalColor.transparent), node_brush)
            rect.setZValue(10)
            
        # Iris Detection Ring (Blue dashed)
        iris_pen = QPen(QColor(ACCENT_BLUE, 100), 0.8, Qt.PenStyle.DashLine)
        self.scene().addEllipse(-140, -140, 280, 280, iris_pen)
        
        # Pupil Ring (Green)
        pupil_pen = QPen(QColor(ACCENT_GREEN), 1.5)
        self.scene().addEllipse(-75, -75, 150, 150, pupil_pen)
        
        # Center Marker
        self.scene().addEllipse(-4, -4, 8, 8, QPen(Qt.GlobalColor.transparent), QColor(ACCENT_GREEN, 180))
        
        # Offset Text
        offset_val = QLabel("0.30 mm")
        offset_val.setStyleSheet(f"color: {ACCENT_GREEN}; font-size: 10px; font-weight: 800; background: transparent;")
        proxy = self.scene().addWidget(offset_val)
        proxy.setPos(20, 20)

class DotBar(QWidget):
    def __init__(self, count=24, active_count=19, parent=None):
        super().__init__(parent)
        self.count = count
        self.active_count = active_count
        self.setFixedHeight(12)
        
    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        
        dot_size = 4
        spacing = 6
        for i in range(self.count):
            x = i * (dot_size + spacing)
            color = QColor(ACCENT_GREEN) if i < self.active_count else QColor(255, 255, 255, 15)
            painter.setBrush(color)
            painter.setPen(Qt.GlobalColor.transparent)
            painter.drawEllipse(x, 4, dot_size, dot_size)

class MetricRow(QWidget):
    def __init__(self, label, value, unit="", color=None, parent=None, second_val=None, second_color=None, draw_pencil=False):
        super().__init__(parent)
        layout = QHBoxLayout(self)
        layout.setContentsMargins(0, 5, 0, 5)
        
        lbl = QLabel(label)
        lbl.setStyleSheet(f"color: {TEXT_DIM}; font-size: 11px; font-weight: 500;")
        layout.addWidget(lbl)
        layout.addStretch()
        
        # Value container
        val_container = QWidget()
        v_layout = QHBoxLayout(val_container)
        v_layout.setContentsMargins(0,0,0,0)
        v_layout.setSpacing(4)
        
        val = QLabel(str(value))
        val_color = color if color else "white"
        val.setStyleSheet(f"color: {val_color}; font-weight: 700; font-family: 'JetBrains Mono', monospace; font-size: 12px;")
        v_layout.addWidget(val)
        
        if second_val:
            sv = QLabel(str(second_val))
            sv_color = second_color if second_color else "white"
            sv.setStyleSheet(f"color: {sv_color}; font-weight: 700; font-family: 'JetBrains Mono', monospace; font-size: 12px;")
            v_layout.addWidget(sv)
            
        if unit:
            u = QLabel(unit)
            u_color = color if color == ACCENT_YELLOW else (second_color if second_color == ACCENT_BLUE else TEXT_DIM)
            u.setStyleSheet(f"color: {u_color}; font-size: 9px; min-width: 15px;")
            v_layout.addWidget(u)

        if draw_pencil:
            p = QLabel("✎")
            p.setStyleSheet(f"color: {TEXT_DIM}; font-size: 10px;")
            v_layout.addWidget(p)
            
        layout.addWidget(val_container)

class SurgicalWorkstation(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Centration Surgical Assist - Workstation v3.0")
        self.setMinimumSize(1440, 900)
        self.setStyleSheet(f"""
            QMainWindow, QWidget {{
                background-color: {BG_APP};
                color: white;
                font-family: 'Segoe UI', sans-serif;
            }}
        """)
        
        main_layout = QHBoxLayout()
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)
        
        self.central_widget = QWidget()
        self.central_widget.setLayout(main_layout)
        self.setCentralWidget(self.central_widget)
        
        self.setup_sidebar(main_layout)
        self.setup_content(main_layout)
        self.setup_right_panel(main_layout)
        
        # Telemetry Timer
        self.timer = QTimer()
        self.timer.timeout.connect(self.update_telemetry)
        self.timer.start(1000)

    def update_telemetry(self):
        # Update mock values to feel alive
        pass

    def setup_sidebar(self, parent_layout):
        sidebar = QFrame()
        sidebar.setFixedWidth(72)
        sidebar.setStyleSheet(f"background-color: {BG_APP}; border-right: 1px solid rgba(255,255,255,0.05);")
        layout = QVBoxLayout(sidebar)
        layout.setContentsMargins(0, 20, 0, 20)
        layout.setSpacing(32)
        
        # Logo Icon
        logo = QLabel("⊕")
        logo.setAlignment(Qt.AlignmentFlag.AlignCenter)
        logo.setStyleSheet(f"color: {ACCENT_GREEN}; font-size: 28px; margin-bottom: 20px;")
        layout.addWidget(logo)
        
        # Nav Icons
        icons = [("👤", "Patient"), ("🎥", "Live", True), ("👁", "OCT"), ("📁", "View Data"), ("⚙", "Settings")]
        for icon, label, *active in icons:
            btn_container = QWidget()
            btn_layout = QVBoxLayout(btn_container)
            btn_layout.setContentsMargins(0,0,0,0)
            btn_layout.setSpacing(4)
            
            btn = QPushButton(icon)
            btn.setFixedSize(72, 44)
            is_active = active[0] if active else False
            btn.setStyleSheet(f"""
                QPushButton {{
                    border: none;
                    background: {"rgba(0, 255, 136, 0.03)" if is_active else "transparent"};
                    color: {"#00FF88" if is_active else "rgba(255,255,255,0.3)"};
                    font-size: 24px;
                    border-left: { "2px solid #00FF88" if is_active else "none" };
                }}
                QPushButton:hover {{
                    color: white;
                }}
            """)
            
            txt = QLabel(label)
            txt.setAlignment(Qt.AlignmentFlag.AlignCenter)
            txt.setStyleSheet(f"color: {TEXT_DIM}; font-size: 9px; font-weight: 800; text-transform: uppercase;")
            
            btn_layout.addWidget(btn)
            btn_layout.addWidget(txt)
            layout.addWidget(btn_container)
            
        layout.addStretch()
        
        logout_container = QWidget()
        l_layout = QVBoxLayout(logout_container)
        l_layout.setContentsMargins(0, 0, 0, 10)
        l_layout.setSpacing(4)
        l_btn = QPushButton("⍈")
        l_btn.setStyleSheet("color: #FF3B30; font-size: 28px; border: none; background: transparent;")
        l_txt = QLabel("Logout")
        l_txt.setAlignment(Qt.AlignmentFlag.AlignCenter)
        l_txt.setStyleSheet("color: #FF3B30; font-size: 10px; font-weight: 900; text-transform: uppercase;")
        l_layout.addWidget(l_btn)
        l_layout.addWidget(l_txt)
        layout.addWidget(logout_container)
        
        parent_layout.addWidget(sidebar)

    def toggle_controls(self):
        self.controls_overlay.setVisible(self.ctrl_btn.isChecked())

    def setup_content(self, parent_layout):
        content = QWidget()
        layout = QVBoxLayout(content)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)
        
        # --- TOP HEADER ---
        header = QFrame()
        header.setFixedHeight(88)
        header.setStyleSheet(f"background-color: {BG_APP}; border-bottom: 1px solid rgba(255,255,255,0.05);")
        h_layout = QHBoxLayout(header)
        h_layout.setContentsMargins(20, 0, 20, 0)
        h_layout.setSpacing(0)
        
        # Logo
        logo_layout = QHBoxLayout()
        logo_layout.setSpacing(12)
        logo_icon = QLabel("⊕")
        logo_icon.setStyleSheet(f"color: {ACCENT_GREEN}; font-size: 32px;")
        logo_text = QVBoxLayout()
        logo_text.setSpacing(0)
        lt1 = QLabel("CENTRATION")
        lt1.setStyleSheet("color: white; font-weight: 950; font-size: 13px; letter-spacing: 2px;")
        lt2 = QLabel("SURGICAL ASSIST")
        lt2.setStyleSheet(f"color: {TEXT_DIM}; font-weight: 900; font-size: 9px;")
        logo_text.addWidget(lt1)
        logo_text.addWidget(lt2)
        logo_layout.addWidget(logo_icon)
        logo_layout.addLayout(logo_text)
        h_layout.addLayout(logo_layout)
        h_layout.addSpacing(40)
        
        v_line = QFrame()
        v_line.setFixedWidth(1)
        v_line.setStyleSheet("background: rgba(255, 255, 255, 0.05); margin: 20px 0;")
        h_layout.addWidget(v_line)

        h_layout.addWidget(HeaderBlock("PX ID", "PX-1023"))
        h_layout.addWidget(HeaderBlock("PATIENT NAME", "John Doe"))
        h_layout.addWidget(HeaderBlock("DOB / AGE", "12-05-1980 / 44 Y"))
        h_layout.addWidget(HeaderBlock("SURGEON", "Dr. Smith", show_divider=False))
        
        h_layout.addStretch()
        
        # --- Controls Button ---
        self.ctrl_btn = QPushButton()
        self.ctrl_btn.setFixedHeight(38)
        self.ctrl_btn.setFixedWidth(130)
        self.ctrl_btn.setCheckable(True)
        self.ctrl_btn.setChecked(True)
        self.ctrl_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        self.ctrl_btn.setStyleSheet("""
            QPushButton {
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 4px;
            }
            QPushButton:checked {
                background: rgba(0, 255, 136, 0.05);
                border: 1px solid rgba(0, 255, 136, 0.3);
            }
            QPushButton:hover {
                border: 1px solid rgba(255,255,255,0.2);
            }
        """)
        cb_layout = QHBoxLayout(self.ctrl_btn)
        cb_layout.setContentsMargins(10, 0, 10, 0)
        cb_layout.setSpacing(8)
        cb_icon = QLabel("㗊")
        cb_icon.setStyleSheet("color: white; font-size: 16px; background: transparent; border: none;")
        cb_text = QLabel("Controls")
        cb_text.setStyleSheet("color: white; font-size: 11px; font-weight: 700; background: transparent; border: none;")
        cd_sep = QFrame()
        cd_sep.setFixedWidth(1)
        cd_sep.setStyleSheet("background: rgba(255,255,255,0.1); margin: 8px 0; border: none;")
        cb_arrow = QLabel("▾")
        cb_arrow.setStyleSheet(f"color: {TEXT_DIM}; font-size: 10px; background: transparent; border: none;")
        
        cb_layout.addWidget(cb_icon)
        cb_layout.addWidget(cb_text)
        cb_layout.addStretch()
        cb_layout.addWidget(cd_sep)
        cb_layout.addWidget(cb_arrow)
        h_layout.addWidget(self.ctrl_btn)
        h_layout.addSpacing(30)
        
        self.ctrl_btn.clicked.connect(self.toggle_controls)

        # Eye
        eye_box = QVBoxLayout()
        eye_box.setSpacing(2)
        eye_label = QLabel("EYE")
        eye_label.setStyleSheet(f"color: {TEXT_DIM}; font-size: 8px; font-weight: 900; letter-spacing: 0.5px;")
        eye_btns = QHBoxLayout()
        od = QPushButton("OD")
        od.setFixedSize(34, 24)
        od.setStyleSheet(f"background: rgba(0, 255, 136, 0.05); border: 1px solid {ACCENT_GREEN}; color: {ACCENT_GREEN}; font-size: 9px; font-weight: 900; border-radius: 4px;")
        os = QPushButton("OS")
        os.setFixedSize(34, 24)
        os.setStyleSheet("background: transparent; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); font-size: 9px; font-weight: 900; border-radius: 4px;")
        eye_btns.addWidget(od)
        eye_btns.addWidget(os)
        eye_box.addWidget(eye_label)
        eye_box.addLayout(eye_btns)
        h_layout.addLayout(eye_box)
        h_layout.addSpacing(30)

        # Mode
        mode_box = QVBoxLayout()
        mode_box.setSpacing(2)
        mode_label = QLabel("MODE")
        mode_label.setStyleSheet(f"color: {TEXT_DIM}; font-size: 8px; font-weight: 900; letter-spacing: 0.5px;")
        self.mode_sel = QPushButton("IR ▾")
        self.mode_sel.setFixedSize(80, 24)
        self.mode_sel.setStyleSheet("background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white; font-size: 10px; font-weight: 600; border-radius: 4px; text-align: left; padding-left: 10px;")
        
        mode_menu = QMenu(self)
        mode_menu.addAction("IR", lambda: self.mode_sel.setText("IR ▾"))
        mode_menu.addAction("Greyscale", lambda: self.mode_sel.setText("Greyscale ▾"))
        mode_menu.addAction("RGB", lambda: self.mode_sel.setText("RGB ▾"))
        self.mode_sel.setMenu(mode_menu)
        
        mode_box.addWidget(mode_label)
        mode_box.addWidget(self.mode_sel)
        h_layout.addLayout(mode_box)
        h_layout.addSpacing(30)

        # Status
        status_box = QVBoxLayout()
        status_box.setSpacing(2)
        status_label = QLabel("STATUS")
        status_label.setStyleSheet(f"color: {TEXT_DIM}; font-size: 8px; font-weight: 900; letter-spacing: 0.5px;")
        status_info = QHBoxLayout()
        status_info.setSpacing(6)
        dot = QLabel("●")
        dot.setStyleSheet(f"color: {ACCENT_GREEN}; font-size: 10px;")
        stxt = QLabel("STABLE - READY")
        stxt.setStyleSheet("color: white; font-weight: 900; font-size: 11px; letter-spacing: 0.5px;")
        status_info.addWidget(dot)
        status_info.addWidget(stxt)
        status_box.addWidget(status_label)
        status_box.addLayout(status_info)
        h_layout.addLayout(status_box)
        h_layout.addSpacing(40)

        # Settings
        set_btn = QPushButton("⚙ Settings")
        set_btn.setFixedSize(94, 38)
        set_btn.setStyleSheet("""
            QPushButton {
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 6px;
                color: white;
                font-size: 11px;
                font-weight: 700;
            }
            QPushButton:hover {
                background: rgba(255,255,255,0.06);
                border: 1px solid rgba(255,255,255,0.2);
            }
        """)
        h_layout.addWidget(set_btn)
        h_layout.addSpacing(15)

        fs_btn = QPushButton("⛶")
        fs_btn.setFixedSize(38, 38)
        fs_btn.setStyleSheet("""
            QPushButton {
                background: transparent;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 6px;
                color: white;
                font-size: 18px;
            }
            QPushButton:hover {
                background: rgba(255,255,255,0.05);
            }
        """)
        h_layout.addWidget(fs_btn)

        layout.addWidget(header)
        
        # --- WORKSPACE ---
        body = QWidget()
        body_layout = QVBoxLayout(body)
        body_layout.setContentsMargins(20, 20, 20, 20)
        body_layout.setSpacing(20)
        
        # Main Viewport Container
        viewport_container = QFrame()
        viewport_container.setStyleSheet("background: #000; border: 1px solid rgba(255,255,255,0.05); border-radius: 4px;")
        v_layout = QGridLayout(viewport_container)
        v_layout.setContentsMargins(0,0,0,0)
        
        self.eye_view = EyeGraphicsView()
        v_layout.addWidget(self.eye_view, 0, 0)
        
        # --- FLOATING CONTROLS OVERLAY ---
        self.controls_overlay = QFrame()
        self.controls_overlay.setStyleSheet(f"""
            QFrame {{
                background: rgba(13, 15, 16, 0.95);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 10px;
            }}
        """)
        co_layout = QHBoxLayout(self.controls_overlay)
        co_layout.setContentsMargins(15, 10, 15, 10)
        co_layout.setSpacing(15)
        
        co_layout.addWidget(ActionGroup("ROI Control", [("Set", "📝", ACCENT_GREEN), ("Lock", "🔒", None), ("Clear", "🗑️", None)]))
        sep1 = QFrame(); sep1.setFixedWidth(1); sep1.setStyleSheet("background: rgba(255,255,255,0.15); margin: 8px 0; border: none;")
        co_layout.addWidget(sep1)
        
        co_layout.addWidget(ActionGroup("Detection", [("Start", "▶", ACCENT_GREEN)]))
        sep2 = QFrame(); sep2.setFixedWidth(1); sep2.setStyleSheet("background: rgba(255,255,255,0.15); margin: 8px 0; border: none;")
        co_layout.addWidget(sep2)
        
        co_layout.addWidget(ActionGroup("Capture", [("Pre", "📷", ACCENT_BLUE), ("Post", "📷", "#A855F7")]))
        
        ov_content_layout = QVBoxLayout()
        ov_content_layout.setContentsMargins(20, 20, 20, 20)
        ov_content_layout.addWidget(self.controls_overlay, 0, Qt.AlignmentFlag.AlignTop | Qt.AlignmentFlag.AlignHCenter)
        ov_content_layout.addStretch()
        
        # Zoom Indicator (Floating)
        zoom_frame = QFrame()
        zoom_frame.setStyleSheet("background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; padding: 4px 10px;")
        zl = QHBoxLayout(zoom_frame)
        za = QLabel("<")
        za.setStyleSheet(f"color: {TEXT_DIM}; font-size: 12px;")
        zt = QLabel("1.0x")
        zt.setStyleSheet("color: white; font-weight: bold; font-size: 11px;")
        zl.addWidget(za); zl.addWidget(zt)
        
        v_layout.addWidget(zoom_frame, 0, 0, Qt.AlignmentFlag.AlignTop | Qt.AlignmentFlag.AlignLeft)
        v_layout.addLayout(ov_content_layout, 0, 0)
        
        # Side Tools (Floating)
        zoom_ctrl = QVBoxLayout()
        zoom_ctrl.setSpacing(5)
        for icon in ["+", "-", "✋"]:
            zb = QPushButton(icon)
            zb.setFixedSize(36, 36)
            zb.setStyleSheet("background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: white; font-size: 16px;")
            zoom_ctrl.addWidget(zb)
        v_layout.addLayout(zoom_ctrl, 0, 0, Qt.AlignmentFlag.AlignVCenter | Qt.AlignmentFlag.AlignRight)
        
        body_layout.addWidget(viewport_container, 1)
        
        # Bottom Panels
        bottom_row = QHBoxLayout()
        bottom_row.setSpacing(20)
        bottom_row.addWidget(DiagnosticPanel("OCT ENFACE", is_scan=True))
        bottom_row.addWidget(DiagnosticPanel("OCT B-SCAN", is_scan=True, is_bscan=True))
        bottom_row.addWidget(DiagnosticPanel("CAMERA VIEW 1"))
        bottom_row.addWidget(DiagnosticPanel("CAMERA VIEW 2"))
        body_layout.addLayout(bottom_row)
        
        layout.addWidget(body)
        parent_layout.addWidget(content, 1)

    def setup_right_panel(self, parent_layout):
        panel = QFrame()
        panel.setFixedWidth(320)
        panel.setStyleSheet(f"background-color: {BG_APP}; border-left: 1px solid rgba(255,255,255,0.05);")
        layout = QVBoxLayout(panel)
        layout.setContentsMargins(20, 24, 20, 24)
        layout.setSpacing(15)
        
        # Parameters
        h1 = QHBoxLayout()
        p_label = QLabel("PARAMETERS")
        p_label.setStyleSheet(f"color: {TEXT_DIM}; font-weight: 950; font-size: 10px; letter-spacing: 2.5px;")
        h1.addWidget(p_label)
        h1.addStretch()
        hide = QLabel("Hide ⌃")
        hide.setStyleSheet(f"color: {ACCENT_BLUE}; font-size: 10px;")
        h1.addWidget(hide)
        layout.addLayout(h1)
        
        layout.addWidget(MetricRow("Pupil Center (X, Y)", "124,", "px", color="white", second_val="98", second_color=ACCENT_BLUE))
        layout.addWidget(MetricRow("Limbus Center (X, Y)", "120,", "px", color="white", second_val="95", second_color=ACCENT_BLUE))
        layout.addWidget(MetricRow("Pupil Diameter", "3.62", "mm"))
        layout.addWidget(MetricRow("Limbus Diameter", "11.24", "mm"))
        
        sep = QFrame()
        sep.setFixedHeight(1)
        sep.setStyleSheet("background: rgba(255,255,255,0.03); margin: 8px 0;")
        layout.addWidget(sep)
        
        layout.addWidget(MetricRow("Offset - Pupil vs Limbus", "0.30", "mm", ACCENT_YELLOW))
        layout.addWidget(MetricRow("Offset - Red Dot vs Pupil", "0.28", "mm"))
        layout.addWidget(MetricRow("Offset - Red Dot vs Limbus", "0.31", "mm"))
        
        sep2 = QFrame()
        sep2.setFixedHeight(1)
        sep2.setStyleSheet("background: rgba(255,255,255,0.03); margin: 8px 0;")
        layout.addWidget(sep2)
        
        layout.addWidget(MetricRow("Confidence Score", "0.92", "", ACCENT_GREEN))
        layout.addWidget(MetricRow("HVID (Horizontal)", "11.63", "mm", draw_pencil=True))
        layout.addWidget(MetricRow("HVID (Vertical)", "11.58", "mm", draw_pencil=True))
        
        layout.addSpacing(25)
        
        # Stability
        h2 = QHBoxLayout()
        s_label = QLabel("STABILITY METRICS ⓘ")
        s_label.setStyleSheet(f"color: {TEXT_DIM}; font-weight: 950; font-size: 10px; letter-spacing: 2px;")
        h2.addWidget(s_label)
        h2.addStretch()
        h2.addWidget(QLabel("⌃"))
        layout.addLayout(h2)
        
        s_row = QHBoxLayout()
        s_title = QLabel("Stability Index")
        s_title.setStyleSheet(f"color: {TEXT_DIM}; font-size: 11px;")
        s_val = QLabel("82%")
        s_val.setStyleSheet(f"color: {ACCENT_GREEN}; font-weight: bold; font-size: 12px;")
        s_row.addWidget(s_title)
        s_row.addStretch()
        s_row.addWidget(s_val)
        layout.addLayout(s_row)
        layout.addWidget(DotBar(active_count=19))
        
        layout.addWidget(MetricRow("Movement (Last 2s)", "0.12", "mm"))
        layout.addWidget(MetricRow("Quality Index", "High", "", ACCENT_GREEN))
        
        layout.addSpacing(25)
        
        # Quality & Latency
        h3 = QHBoxLayout()
        q_label = QLabel("IMAGE QUALITY & LATENCY ⓘ")
        q_label.setStyleSheet(f"color: {TEXT_DIM}; font-weight: 950; font-size: 10px; letter-spacing: 2px;")
        h3.addWidget(q_label)
        h3.addStretch()
        h3.addWidget(QLabel("⌃"))
        layout.addLayout(h3)
        layout.addWidget(MetricRow("Latency", "12", "ms", ACCENT_GREEN))
        layout.addWidget(MetricRow("Quality Index", "High", "", ACCENT_GREEN))
        
        layout.addStretch()
        
        parent_layout.addWidget(panel)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = SurgicalWorkstation()
    window.show()
    sys.exit(app.exec())
