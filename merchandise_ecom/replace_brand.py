import os, glob, re

root_dir = r'c:\Users\PC\Desktop\merchandise_ecom\merchandise_ecom'
files = glob.glob(root_dir + '/**/*', recursive=True)
files = [f for f in files if os.path.isfile(f)]

for file in files:
    # Skip node_modules, .git, .next, dist
    if 'node_modules' in file or '.git' in file or '.next' in file or 'dist' in file or '.env' in file:
        continue
        
    if not file.endswith(('.js', '.jsx', '.ts', '.tsx', '.html', '.md', '.json')):
        continue
        
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        new_content = new_content.replace('TailAdmin', 'Merch Studio')
        new_content = new_content.replace('tailadmin-react', 'merch-studio')
        new_content = new_content.replace('tailadmin', 'merch-studio')
        new_content = new_content.replace('Tailadmin', 'Merch Studio')
        
        if content != new_content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated {file}')
    except Exception as e:
        print(f"Error processing {file}: {e}")
