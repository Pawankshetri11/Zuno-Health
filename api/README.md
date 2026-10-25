# Backend Setup

1. **Database Setup**:
   - Open PHPMyAdmin.
   - Create a database named `zunodb`.
   - Import the `zuno.sql` file found in this directory.

2. **Configuration**:
   - Open `config/config.php` and verify it uses XAMPP credentials: database `zunodb`, user `root`, and an empty password.

3. **Running**:
   - You can host this folder on your local server (e.g., XAMPP/WAMP `htdocs`).
   - If using XAMPP, place the `backend` folder in `C:\xampp\htdocs\dietplan_backend`.
   - Your API endpoints will be accessible at `http://localhost/dietplan_backend/api.php` (etc).

4. **Frontend Integration**:
   - You will need to update your Frontend code to fetch from these PHP endpoints instead of Supabase.
