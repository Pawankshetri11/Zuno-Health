import os, re

SRC = "D:\\Zuno\\frontend\\src"

# Fix imports in all moved files
files_to_check = []

# User pages
for f in os.listdir(os.path.join(SRC, "modules", "user", "pages")):
    if f.endswith(".tsx"):
        files_to_check.append(os.path.join(SRC, "modules", "user", "pages", f))

# Admin pages
for f in os.listdir(os.path.join(SRC, "modules", "admin", "pages")):
    if f.endswith(".tsx"):
        files_to_check.append(os.path.join(SRC, "modules", "admin", "pages", f))

# Admin components
for f in os.listdir(os.path.join(SRC, "modules", "admin", "components")):
    if f.endswith(".tsx"):
        files_to_check.append(os.path.join(SRC, "modules", "admin", "components", f))

# User components
for f in os.listdir(os.path.join(SRC, "modules", "user", "components")):
    if f.endswith(".tsx"):
        files_to_check.append(os.path.join(SRC, "modules", "user", "components", f))

# Also check App.tsx and any remaining files in pages/ and components/
for f in os.listdir(os.path.join(SRC, "pages")):
    if f.endswith(".tsx"):
        files_to_check.append(os.path.join(SRC, "pages", f))

for f in os.listdir(os.path.join(SRC, "components")):
    if f.endswith(".tsx"):
        files_to_check.append(os.path.join(SRC, "components", f))

# Fix imports in each file
for filepath in files_to_check:
    with open(filepath, "r", encoding="utf-8", errors="replace") as fh:
        content = fh.read()
    
    original = content
    
    # Fix user page imports
    content = content.replace("@/pages/Dashboard", "@/modules/user/pages/Dashboard")
    content = content.replace("@/pages/Profile", "@/modules/user/pages/Profile")
    content = content.replace("@/pages/HealthMetrics", "@/modules/user/pages/HealthMetrics")
    content = content.replace("@/pages/Checkout", "@/modules/user/pages/Checkout")
    content = content.replace("@/pages/PaymentHistory", "@/modules/user/pages/PaymentHistory")
    
    # Fix admin page imports
    content = content.replace("@/pages/admin/AdminAuth", "@/modules/admin/pages/AdminAuth")
    content = content.replace("@/pages/admin/AdminCoupons", "@/modules/admin/pages/AdminCoupons")
    content = content.replace("@/pages/admin/AdminDashboard", "@/modules/admin/pages/AdminDashboard")
    content = content.replace("@/pages/admin/AdminProfileEdit", "@/modules/admin/pages/AdminProfileEdit")
    content = content.replace("@/pages/admin/AdminSettings", "@/modules/admin/pages/AdminSettings")
    content = content.replace("@/pages/admin/AdminTransactions", "@/modules/admin/pages/AdminTransactions")
    content = content.replace("@/pages/admin/AdminUserProfiles", "@/modules/admin/pages/AdminUserProfiles")
    content = content.replace("@/pages/admin/AdminUsers", "@/modules/admin/pages/AdminUsers")
    
    # Fix component imports
    content = content.replace("@/components/ProtectedAdminRoute", "@/modules/admin/components/ProtectedAdminRoute")
    content = content.replace("@/components/UserSidebar", "@/modules/user/components/UserSidebar")
    content = content.replace("@/components/admin/AdminLayout", "@/modules/admin/components/AdminLayout")
    
    if content != original:
        with open(filepath, "w", encoding="utf-8") as fh:
            fh.write(content)
        print(f"Updated imports in: {os.path.relpath(filepath, SRC)}")

print("\nImport paths updated!")