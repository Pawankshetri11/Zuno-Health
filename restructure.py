import os, shutil

SRC = "D:\\Zuno\\frontend\\src"

# Remove any leftover modulex directory
shutil.rmtree(os.path.join(SRC, "modulex"), ignore_errors=True)

# Create admin module
admin_pages = os.path.join(SRC, "modules", "admin", "pages")
admin_components = os.path.join(SRC, "modules", "admin", "components")
os.makedirs(admin_pages, exist_ok=True)
os.makedirs(admin_components, exist_ok=True)

# Create user module
user_pages = os.path.join(SRC, "modules", "user", "pages")
user_components = os.path.join(SRC, "modules", "user", "components")
os.makedirs(user_pages, exist_ok=True)
os.makedirs(user_components, exist_ok=True)

# Move user pages from pages/ to modules/user/pages/
user_pages_list = [
    "Dashboard.tsx", "Profile.tsx", "HealthMetrics.tsx",
    "Checkout.tsx", "PaymentHistory.tsx"
]
for f in user_pages_list:
    src = os.path.join(SRC, "pages", f)
    dst = os.path.join(user_pages, f)
    if os.path.exists(src):
        shutil.move(src, dst)
        print(f"Moved: pages/{f} -> modules/user/pages/{f}")

# Move admin pages from pages/admin/ to modules/admin/pages/
admin_pages_list = [
    "AdminAuth.tsx", "AdminCoupons.tsx", "AdminDashboard.tsx",
    "AdminProfileEdit.tsx", "AdminSettings.tsx", "AdminTransactions.tsx",
    "AdminUserProfiles.tsx", "AdminUsers.tsx"
]
for f in admin_pages_list:
    src = os.path.join(SRC, "pages", "admin", f)
    dst = os.path.join(admin_pages, f)
    if os.path.exists(src):
        shutil.move(src, dst)
        print(f"Moved: pages/admin/{f} -> modules/admin/pages/{f}")

# Move admin components
admin_components_list = ["AdminLayout.tsx", "ProtectedAdminRoute.tsx"]
for f in admin_components_list:
    src = os.path.join(SRC, "components", f)
    dst = os.path.join(admin_components, f)
    if os.path.exists(src):
        shutil.move(src, dst)
        print(f"Moved: components/{f} -> modules/admin/components/{f}")

# Move UserSidebar to user components
src = os.path.join(SRC, "components", "UserSidebar.tsx")
dst = os.path.join(user_components, "UserSidebar.tsx")
if os.path.exists(src):
    shutil.move(src, dst)
    print(f"Moved: components/UserSidebar.tsx -> modules/user/components/UserSidebar.tsx")

# Remove empty admin pages directory
admin_old = os.path.join(SRC, "pages", "admin")
if os.path.isdir(admin_old) and not os.listdir(admin_old):
    os.rmdir(admin_old)
    print("Removed empty pages/admin/")

print("\nRestructuring complete!")