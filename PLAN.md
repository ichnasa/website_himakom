## Phase
1. Develop Static Part of the Web
2. Develop Dashboard for Himakom Rental Product

### Most Reused Components:
1. Navbar
2. Footer
3. Admin Sidebar

### Site Tree:
1. Beranda (Static)
    - Card dgn layout GRID 2 kolom, dikiri untuk slogan dan dikanan untuk visi dan misi 
        - Slogan Himpunan Mahasiswa
        - Visi dan Misi (Card)
    - About Us (Tentang Himakom)
    - Partner (Static)
    - Feedback (Static) dengan form untuk memberikan feedback secara anonim (ini nanti akan masuk ke db) 
2. Kalendar Kegiatan Himakom
3. Links

### How does kalender kegiatan works?
1. Admin menginputkan kegiatan himakom ke database (Tanggal, Nama Kegiatan, Deskripsi, Waktu, Tempat, dll) 
2. Backend memeriksa apakah ada jadwal waktu pada hari tersebut.
3. Jika tidak ada jadwal pada hari tersebut, backend tidak akan menambahkan jadwal tersebut ke frontend. Jika ada jadwal maka backend akan menambahkan jadwal tersebut ke frontend. 
4. Kalender ini hanya diperbarui ketika diupdate admin dan client otomatis refetch ketika ada perubahan di database seperti webhook

### LOGIN AUTH
1. Superadmin create the account
2. User login with the account
3. Create JWT Token that expires in 2 hours
4. Refresh Token for refreshing expired JWT token

### RBAC User
1. Create a user table
2. Create a module table
3. Create a group table (group will be assigned a module access)
4. Create a relationship many-to-many table group_module (group can have many module access and module can be assigned to more than 1 group)
5. Create a relationship many-to-many table user_group (user can be assigned to many group and group can be assigned to many user)
6. Create a group management page where admin can assign user to a group and module accessed can be toggle on/off on that group
    -

