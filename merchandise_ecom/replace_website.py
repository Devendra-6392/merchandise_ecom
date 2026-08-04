import os, glob, re

website_dir = r'c:\Users\PC\Desktop\merchandise_ecom\merchandise_ecom\website'
files = glob.glob(website_dir + '/**/*', recursive=True)

for file in files:
    if not os.path.isfile(file) or not file.endswith(('.js', '.jsx', '.ts', '.tsx')):
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    # Replace process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1" with "https://turf.localhostt.live/api/v1"
    new_content = new_content.replace('process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"', '"https://turf.localhostt.live/api/v1"')
    new_content = new_content.replace('`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}`', '`https://turf.localhostt.live/api/v1`')

    if content != new_content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {file}')
