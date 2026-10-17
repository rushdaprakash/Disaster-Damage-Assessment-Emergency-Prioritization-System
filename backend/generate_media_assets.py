import os
from PIL import Image, ImageDraw, ImageFont

UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "static", "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)

def create_sample_image(filename: str, title: str, subtitle: str, color=(30, 58, 138)):
    img = Image.new("RGB", (800, 600), color=color)
    draw = ImageDraw.Draw(img)
    
    # Draw simple visual elements representing flood water & submerged area
    draw.rectangle([0, 300, 800, 600], fill=(29, 78, 137))  # Muddy flood water
    draw.rectangle([150, 200, 350, 450], fill=(71, 85, 105)) # Submerged building
    draw.ellipse([450, 380, 650, 480], fill=(225, 29, 72))  # Submerged vehicle

    draw.text((30, 30), f"DISASTER EVIDENCE: {title}", fill=(255, 255, 255))
    draw.text((30, 60), f"Location: {subtitle}", fill=(226, 232, 240))
    draw.text((30, 520), "[AegisDisaster AI - Verified Field Snapshot]", fill=(148, 163, 184))

    full_path = os.path.join(UPLOADS_DIR, filename)
    img.save(full_path)
    print(f"Generated sample image asset: {full_path}")

if __name__ == "__main__":
    create_sample_image("sample_image_bridge.jpg", "Anna Salai Bridge Flood", "13.0827 N, 80.2707 E")
    create_sample_image("sample_tnagar_flood.jpg", "T. Nagar Waterlogging", "13.0400 N, 80.2333 E")
    create_sample_image("sample_adyar.jpg", "Adyar Bridge Approach", "13.0067 N, 80.2578 E")
    create_sample_image("sample_madhavaram.jpg", "Madhavaram Link Road", "13.1200 N, 80.2100 E")
    create_sample_image("sample_image.png", "Field Evidence Snapshot", "Chennai Metro Area")
