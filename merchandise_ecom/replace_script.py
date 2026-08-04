import os, glob, re

src_dir = r'c:\Users\PC\Desktop\merchandise_ecom\merchandise_ecom\src'
files = glob.glob(src_dir + '/**/*', recursive=True)

for file in files:
    if not os.path.isfile(file) or not file.endswith(('.js', '.jsx', '.ts', '.tsx')):
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    # Replace "/api/v1/ with `${import.meta.env.VITE_API_URL}/v1/
    new_content = re.sub(r'"/api/v1/([^"]*)"', r'`${import.meta.env.VITE_API_URL}/v1/\1`', new_content)
    # Replace `/api/v1/ with `${import.meta.env.VITE_API_URL}/v1/
    new_content = re.sub(r'`/api/v1/([^`]*)`', r'`${import.meta.env.VITE_API_URL}/v1/\1`', new_content)

    if content != new_content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {file}')
