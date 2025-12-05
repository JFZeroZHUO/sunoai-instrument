import os
from global_sounds_data import global_sounds_data

# HTML Header with CSS
html_header = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Suno AI Global Sounds Prompt Guide</title>
    <style>
        :root {
            --primary-color: #2563eb;
            --secondary-color: #475569;
            --bg-color: #f8fafc;
            --card-bg: #ffffff;
            --text-primary: #1e293b;
            --text-secondary: #64748b;
            --border-color: #e2e8f0;
            --accent-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
        }
        
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-primary);
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }

        /* App Layout */
        .app-container {
            display: flex;
            min-height: 100vh;
        }
        .sidebar {
            width: 280px;
            background: #fff;
            border-right: 1px solid var(--border-color);
            height: 100vh;
            position: sticky;
            top: 0;
            overflow-y: auto;
            flex-shrink: 0;
            padding: 20px;
            box-sizing: border-box;
        }
        .main-content {
            flex-grow: 1;
            background-color: var(--bg-color);
            min-width: 0;
            padding-bottom: 50px;
        }

        /* Sidebar Navigation */
        .nav-title {
            font-size: 1.2em;
            font-weight: 800;
            color: var(--primary-color);
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--border-color);
        }
        .nav-link {
            display: block;
            padding: 10px 15px;
            color: var(--text-secondary);
            text-decoration: none;
            border-radius: 8px;
            margin-bottom: 5px;
            transition: all 0.2s;
            font-size: 0.95em;
        }
        .nav-link:hover {
            background-color: #f1f5f9;
            color: var(--primary-color);
            transform: translateX(5px);
        }
        .nav-link.active {
            background-color: #e0e7ff;
            color: var(--primary-color);
            font-weight: 600;
        }
        
        .sidebar::-webkit-scrollbar { width: 6px; }
        .sidebar::-webkit-scrollbar-track { background: #f1f1f1; }
        .sidebar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

        /* Header */
        header {
            background: #fff;
            border-bottom: 1px solid var(--border-color);
            padding: 40px 0;
            text-align: center;
            margin-bottom: 40px;
        }
        header h1 {
            margin: 0;
            font-size: 2.5em;
            background: var(--accent-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        header p {
            color: var(--text-secondary);
            margin-top: 10px;
            font-size: 1.1em;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Sections */
        .category-section {
            margin-bottom: 60px;
            scroll-margin-top: 40px;
        }
        .category-header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid var(--border-color);
        }
        .category-title {
            font-size: 2em;
            font-weight: 700;
            margin: 0;
            color: var(--text-primary);
        }
        .category-subtitle {
            font-size: 1.2em;
            color: var(--text-secondary);
            margin-left: 15px;
            font-weight: 400;
        }

        /* Cards */
        .prompt-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }
        .prompt-card {
            background: var(--card-bg);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border: 1px solid var(--border-color);
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            flex-direction: column;
        }
        .prompt-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px rgba(0,0,0,0.05);
        }
        
        .card-header {
            margin-bottom: 15px;
        }
        .card-title {
            font-size: 1.1em;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 5px;
        }
        
        .card-content {
            flex-grow: 1;
        }
        .desc-en {
            font-size: 0.95em;
            color: var(--text-secondary);
            margin-bottom: 8px;
            font-style: italic;
        }
        .desc-cn {
            font-size: 1em;
            color: var(--text-primary);
            line-height: 1.5;
        }

        .copy-btn {
            margin-top: 15px;
            background-color: #f1f5f9;
            color: var(--text-secondary);
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9em;
            transition: all 0.2s;
            align-self: flex-start;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .copy-btn:hover {
            background-color: var(--primary-color);
            color: white;
        }

        @media (max-width: 1024px) {
            .app-container { flex-direction: column; }
            .sidebar { width: 100%; height: auto; position: relative; border-right: none; border-bottom: 1px solid var(--border-color); }
            .prompt-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>

<div class="app-container">
    <nav class="sidebar">
        <div class="nav-title">Global Sounds / 全球之声</div>
        {sidebar_links}
    </nav>
    
    <main class="main-content">
        <header>
            <div class="container">
                <h1>Suno AI Global Sounds Guide<br><span style="font-size:0.6em">全球乐器提示词指南</span></h1>
                <p>Explore music styles from around the world / 探索世界各地的音乐风格</p>
            </div>
        </header>
        
        <div class="container">
"""

html_footer = """
        </div>
    </main>
</div>
<script>
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            // Show a temporary tooltip or feedback could be nice, but alert is simple
            // Let's make it less intrusive
            const btn = document.activeElement;
            const originalText = btn.innerText;
            btn.innerText = "Copied! / 已复制";
            setTimeout(() => {
                btn.innerText = originalText;
            }, 2000);
        }, function(err) {
            console.error('Could not copy text: ', err);
        });
    }
</script>
</body>
</html>
"""

# Generate Sidebar Links
sidebar_links = ""
for section in global_sounds_data:
    sidebar_links += f'<a href="#{section["id"]}" class="nav-link">{section["title_en"]} {section["title_cn"]}</a>'

# Generate Body Content
body_content = ""

for section in global_sounds_data:
    cards_html = ""
    for item in section["items"]:
        # Construct the prompt text to copy
        copy_text = f"{item['title']}: {item['desc_en']}"
        safe_copy_text = copy_text.replace("'", "\\'")
        
        cards_html += f"""
        <div class="prompt-card">
            <div class="card-header">
                <div class="card-title">{item['title']}</div>
            </div>
            <div class="card-content">
                <div class="desc-en">{item['desc_en']}</div>
                <div class="desc-cn">{item['desc_cn']}</div>
            </div>
            <button class="copy-btn" onclick="copyToClipboard('{safe_copy_text}')">
                📋 Copy Prompt / 复制
            </button>
        </div>
        """
    
    body_content += f"""
    <div id="{section['id']}" class="category-section">
        <div class="category-header">
            <div class="category-title">{section['title_en']}</div>
            <div class="category-subtitle">{section['title_cn']}</div>
        </div>
        <div class="prompt-grid">
            {cards_html}
        </div>
    </div>
    """

# Assemble Final HTML
final_html = html_header.replace("{sidebar_links}", sidebar_links) + body_content + html_footer

output_path = r"c:\Users\92860\Desktop\Excel格式整理\pdf_webpage\global_sounds.html"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(final_html)

print(f"Webpage generated at {output_path}")
