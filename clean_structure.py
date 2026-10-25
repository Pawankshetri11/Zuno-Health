import os, shutil

SRC = "D:\Zuno\frontend\src"

# Remove any nested modulex directories
for root, dirs, files in os.walk(SRC, topdown=False):
    for d in dirs:
        if d == "modulex":
            path = os.path.join(root, d)
            # Move contents to proper location
            for item in os.listdir(path):
                src = os.path.join(path, item)
                # Determine destination based on contents
                if item == "admin":
                    dst = os.path.join(SRC, "modules", "admin")
                    if os.path.exists(dst):
                        # Move subdirectories
                        for sub in os.listdir(src):
                            sub_src = os.path.join(src, sub)
                            sub_dst = os.path.join(dst, sub)
                            if os.path.exists(sub_dst):
                                for f in os.listdir(sub_src):
                                    shutil.move(os.path.join(sub_src, f), os.path.join(sub_dst, f))
                            else:
                                shutil.move(sub_src, sub_dst)
                    else:
                        shutil.move(src, dst)
            shutil.rmtree(path)
            print(f"Removed nested: {path}")

# Verify structure
print("\nFinal structure:")
for root, dirs, files in os.walk(SRC):
    if "node_modules" in root:
        continue
    level = root.replace(SRC, "").count(os.sep)
    indent = "  " * level
    print(f"{indent}{os.path.basename(root)}/")
    for f in files:
        if f.endswith(".tsx"):
            print(f"{indent}  {f}")