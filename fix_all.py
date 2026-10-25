import os, shutil

SRC = "D:\\Zuno\\frontend\\src"

# Remove any modulex directory
modulex_path = os.path.join(SRC, "modulex")
if os.path.exists(modulex_path):
    shutil.rmtree(modulex_path)
    print("Removed modulex")

# Ensure proper directories exist
os.makedirs(os.path.join(SRC, "modules", "admin", "pages"), exist_ok=True)
os.makedirs(os.path.join(SRC, "modules", "admin", "components"), exist_ok=True)
os.makedirs(os.path.join(SRC, "modules", "user", "pages"), exist_ok=True)
os.makedirs(os.path.join(SRC, "modules", "user", "components"), exist_ok=True)

# Move AdminLayout from components/admin/ to modules/admin/components/
src = os.path.join(SRC, "components", "admin", "AdminLayout.tsx")
dst = os.path.join(SRC, "modules", "admin", "components", "AdminLayout.tsx")
if os.path.exists(src):
    shutil.move(src, dst)
    print("Moved AdminLayout.tsx")

# Remove empty components/admin/ directory
admin_dir = os.path.join(SRC, "components", "admin")
if os.path.isdir(admin_dir) and not os.listdir(admin_dir):
    os.rmdir(admin_dir)
    print("Removed empty components/admin/")

# Fix imports in all files
for root, dirs, files in os.walk(SRC):
    if "node_modules" in root:
        continue
    for f in files:
        if not f.endswith(".tsx"):
            continue
        filepath = os.path.join(root, f)
        with open(filepath, "r", encoding="utf-8", errors="replace") as fh:
            content = fh.read()
        
        original = content
        content = content.replace("@/pages/admin/", "@/modules/admin/pages/")
        content = content.replace("@/pages/Dashboard", "@/modules/user/pages/Dashboard")
        content = content.replace("@/pages/Profile", "@/modules/user/pages/Profile")
        content = content.replace("@/pages/HealthMetrics", "@/modules/user/pages/HealthMetrics")
        content = content.replace("@/pages/Checkout", "@/modules/user/pages/Checkout")
        content = content.replace("@/pages/PaymentHistory", "@/modules/user/pages/PaymentHistory")
        content = content.replace("@/components/ProtectedAdminRoute", "@/modules/admin/components/ProtectedAdminRoute")
        content = content.replace("@/components/UserSidebar", "@/modules/user/components/UserSidebar")
        content = content.replace("@/components/admin/", "@/modules/admin/components/")
        
        if content != original:
            with open(filepath, "w", encoding="utf-8") as fh:
                fh.write(content)
            print(f"Fixed imports in: {os.path.relpath(filepath, SRC)}")

print("\nDone!")