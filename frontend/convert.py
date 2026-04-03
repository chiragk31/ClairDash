import os
import re

html_files = [
    "dashboard.html",
    "login.html",
    "escalations.html",
    "complaint_detail.html",
    "analytics.html"
]

def to_camel_case(snake_str):
    components = snake_str.split('-')
    return components[0] + ''.join(x.title() for x in components[1:])

def convert_html_to_jsx(html_content):
    # Extract just the body HTML if possible
    body_match = re.search(r'<body[^>]*>(.*?)</body>', html_content, re.DOTALL | re.IGNORECASE)
    if body_match:
        html_content = body_match.group(1)
        
    # Replace class= with className=
    jsx = html_content.replace('class="', 'className="')
    jsx = jsx.replace("class='", "className='")
    
    # Self-close inputs, imgs, br, hr
    jsx = re.sub(r'<input([^>]*?)>', r'<input\1 />', jsx)
    jsx = re.sub(r'<img([^>]*?)>', r'<img\1 />', jsx)
    jsx = re.sub(r'<br([^>]*?)>', r'<br\1 />', jsx)
    jsx = re.sub(r'<hr([^>]*?)>', r'<hr\1 />', jsx)
    
    # Fix any already self-closed that got double closed
    jsx = jsx.replace('//>', '/>')
    
    # Replace inline styles. A simple regex for style="..." -> style={{...}}
    # For robust handling, we'll implement a basic one:
    def style_replacer(match):
        style_str = match.group(1)
        # Very hacky parsing for style="color: red; background-color: blue"
        parts = style_str.split(';')
        style_obj = []
        for p in parts:
            if ':' in p:
                k, v = p.split(':', 1)
                k = k.strip()
                v = v.strip()
                k = to_camel_case(k)
                style_obj.append(f"{k}: '{v}'")
        return 'style={{' + ', '.join(style_obj) + '}}'
        
    jsx = re.sub(r'style="([^"]*)"', style_replacer, jsx)
    
    # Fix comments
    jsx = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', jsx, flags=re.DOTALL)
    
    # SVG fixes
    jsx = jsx.replace('stroke-width', 'strokeWidth')
    jsx = jsx.replace('stroke-linecap', 'strokeLinecap')
    jsx = jsx.replace('stroke-linejoin', 'strokeLinejoin')
    jsx = jsx.replace('fill-rule', 'fillRule')
    jsx = jsx.replace('clip-rule', 'clipRule')
    
    return jsx

# Write a shared layout that includes the Material Symbols and Inter
layout_content = """import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClairDash',
  description: 'Customer Ops Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-background text-on-surface`}>
        {children}
      </body>
    </html>
  )
}
"""

with open("app/layout.tsx", "w", encoding="utf-8") as f:
    f.write(layout_content)

for fn in html_files:
    if os.path.exists(fn):
        with open(fn, "r", encoding="utf-8") as f:
            content = f.read()
            
        jsx = convert_html_to_jsx(content)
        
        name = fn.replace(".html", "")
        # For simplicity, make pages out of this
        # dashboard -> page.tsx
        # others -> folder/page.tsx
        if name == "dashboard":
            page_path = "app/page.tsx"
        else:
            os.makedirs(f"app/{name}", exist_ok=True)
            page_path = f"app/{name}/page.tsx"
            
        component_name = "".join([part.capitalize() for part in name.split("_")]) + "Page"
            
        out_content = f"""export default function {component_name}() {{
  return (
    <div className="flex min-h-screen w-full">
      {jsx}
    </div>
  )
}}
"""
        with open(page_path, "w", encoding="utf-8") as f:
            f.write(out_content)
        print(f"Generated {page_path}")
