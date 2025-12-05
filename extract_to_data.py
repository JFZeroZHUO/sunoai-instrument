import fitz
import json
import re

pdf_path = r"c:\Users\92860\Desktop\Excel格式整理\Suno AI Global Sounds Prompt Guide.pdf"
doc = fitz.open(pdf_path)

# Map page numbers to categories (0-indexed in code, 1-indexed in PDF)
# Based on inspection and standard PDF layout
page_map = {
    3: "Brazil",
    4: "South Korea",
    5: "Mexico",
    6: "Caribbean",
    7: "India",
    8: "Africa",
    9: "Japan",
    10: "China",
    11: "Colombia",
    12: "Middle East",
    13: "Germany",
    14: "France",
    15: "UK",
    16: "Canada",
    17: "Scandinavia",
    18: "Australia & NZ",
    19: "Eastern Europe",
    20: "Irish & Celtic",
    21: "Gregorian Chant",
    22: "Aboriginal Didgeridoo",
    23: "Native American",
    24: "West African",
    25: "Mongolian & Andes"
}

# Category Translation Map
category_translations = {
    "Brazil": "巴西",
    "South Korea": "韩国",
    "Mexico": "墨西哥",
    "Caribbean": "加勒比海",
    "India": "印度",
    "Africa": "非洲",
    "Japan": "日本",
    "China": "中国",
    "Colombia": "哥伦比亚",
    "Middle East": "中东",
    "Germany": "德国",
    "France": "法国",
    "UK": "英国",
    "Canada": "加拿大",
    "Scandinavia": "斯堪的纳维亚",
    "Australia & NZ": "澳大利亚与新西兰",
    "Eastern Europe": "东欧",
    "Irish & Celtic": "爱尔兰与凯尔特",
    "Gregorian Chant": "格里高利圣咏",
    "Aboriginal Didgeridoo": "澳洲原住民迪吉里杜管",
    "Native American": "美洲原住民",
    "West African": "西非",
    "Mongolian & Andes": "蒙古与安第斯"
}

extracted_data = []

for page_num, category_en in page_map.items():
    if page_num >= doc.page_count:
        continue
        
    text = doc[page_num].get_text("text")
    lines = text.split('\n')
    clean_lines = [l.strip() for l in lines if l.strip()]
    
    items = []
    for line in clean_lines:
        # Simple heuristic for "Artist/Style: Description"
        # Some lines might be just page numbers or titles, we skip those if they don't have ':'
        if ":" in line and len(line) > 10:
            parts = line.split(":", 1)
            title = parts[0].strip()
            desc = parts[1].strip()
            
            # Skip if it looks like a footer or header
            if title.lower() in ["page", "intro", "bonus"] or len(desc) < 3:
                continue
                
            items.append({
                "title": title,
                "desc_en": desc,
                "desc_cn": desc # Placeholder: Copy English to Chinese field for now
            })
    
    extracted_data.append({
        "id": category_en.lower().replace(" ", "_").replace("&", "and"),
        "title_en": category_en,
        "title_cn": category_translations.get(category_en, category_en),
        "items": items
    })

# Write to Python file for easy editing/importing
with open(r"c:\Users\92860\Desktop\Excel格式整理\global_sounds_data.py", "w", encoding="utf-8") as f:
    f.write("global_sounds_data = " + json.dumps(extracted_data, indent=4, ensure_ascii=False))

print("Data extracted to global_sounds_data.py")
