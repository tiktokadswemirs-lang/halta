import json

def process():
    with open('countries.json', encoding='utf-8') as f:
        data = json.load(f)
    
    countries = []
    for c in data:
        # Some countries might not have idd or suffixes
        if 'idd' not in c or not c['idd']:
            continue
        idd = c['idd']
        root = idd.get('root', '')
        suffixes = idd.get('suffixes', [])
        # If there are many suffixes, usually it's something like +1 for US, Canada, etc.
        # We will just take the root + first suffix if it makes sense, or just root if suffixes are too many
        if not root:
            continue
        
        # for USA, root is +1, suffixes: ['201', '202', ...] -> we just want +1
        # for Afghanistan, root is +9, suffixes: ['3'] -> we want +93
        if suffixes and len(suffixes) == 1:
            code = root + suffixes[0]
        else:
            code = root
        
        name = c['name']['common']
        
        # Attempt to get a local name
        local_names = c['name'].get('nativeName', {})
        local_name = ""
        if local_names:
            first_lang = list(local_names.keys())[0]
            local_name = local_names[first_lang].get('common', '')
            if local_name == name:
                local_name = ""
        
        display_name = f"{name} ({local_name})" if local_name else name
        flag = c.get('flag', '')
        
        if flag and code:
            countries.append({
                "name": display_name,
                "code": code,
                "flag": flag,
                "rawName": name
            })
    
    # Sort by name
    countries.sort(key=lambda x: x['rawName'])
    
    # Generate JS
    js_content = "var countriesData = " + json.dumps(countries, ensure_ascii=False, indent=2) + ";\n"
    
    with open('countries.js', 'w', encoding='utf-8') as f:
        f.write(js_content)

if __name__ == '__main__':
    process()
