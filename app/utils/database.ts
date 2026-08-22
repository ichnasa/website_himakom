import Database from "better-sqlite3";

const db = new Database('local.db', {
    verbose: console.log,
});

/* ------------------------------------------------------------------ */
/*  Safe migration helper — tambah kolom hanya jika belum ada          */
/* ------------------------------------------------------------------ */
function addColumnIfNotExists(table: string, column: string, definition: string) {
    const info = db.prepare(`PRAGMA table_info("${table}")`).all() as { name: string }[];
    if (!info.some((col) => col.name === column)) {
        db.exec(`ALTER TABLE "${table}" ADD COLUMN ${column} ${definition}`);
        console.log(`[migration] Added column "${column}" to table "${table}"`);
    }
}

/* ------------------------------------------------------------------ */
/*  Tabel yang sudah ada — pastikan skema dasar                        */
/* ------------------------------------------------------------------ */

db.exec(`
    CREATE TABLE IF NOT EXISTS feedback(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category VARCHAR(50) NOT NULL,
        message VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
`)

db.exec(`
    CREATE TABLE IF NOT EXISTS event(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        location VARCHAR(100) NOT NULL,
        date DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        time_start DATETIME,
        time_end DATETIME
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS user(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(100) NOT NULL DEFAULT 'pengguna',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
`)

db.exec(`
    CREATE TABLE IF NOT EXISTS module(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL UNIQUE,
        label VARCHAR(100) NOT NULL DEFAULT '',
        href VARCHAR(100) NOT NULL DEFAULT '',
        is_protected INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
`);

/* ------------------------------------------------------------------ */
/*  Migrasi kolom baru pada tabel yang sudah ada                        */
/* ------------------------------------------------------------------ */

// user: tambah updated_at (SQLite ALTER TABLE tidak support CURRENT_TIMESTAMP sebagai default)
addColumnIfNotExists('user', 'updated_at', 'DATETIME');

// module: tambah icon, description, slug, updated_at
addColumnIfNotExists('module', 'icon', 'TEXT');
addColumnIfNotExists('module', 'description', 'TEXT');
addColumnIfNotExists('module', 'slug', 'VARCHAR(100)');
addColumnIfNotExists('module', 'updated_at', 'DATETIME');

/* ------------------------------------------------------------------ */
/*  Tabel baru sesuai ERD                                              */
/* ------------------------------------------------------------------ */

db.exec(`
    CREATE TABLE IF NOT EXISTS "group" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_by INTEGER REFERENCES user(id) ON DELETE SET NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS user_group (
        user_id INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE,
        group_id INTEGER NOT NULL REFERENCES "group"(id) ON DELETE CASCADE,
        created_by INTEGER REFERENCES user(id) ON DELETE SET NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY (user_id, group_id)
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS group_module (
        group_id INTEGER NOT NULL REFERENCES "group"(id) ON DELETE CASCADE,
        module_id INTEGER NOT NULL REFERENCES module(id) ON DELETE CASCADE,
        created_by INTEGER REFERENCES user(id) ON DELETE SET NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY (group_id, module_id)
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS permission (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL UNIQUE,
        label VARCHAR(100) NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS group_permission (
        group_id INTEGER NOT NULL REFERENCES "group"(id) ON DELETE CASCADE,
        permission_id INTEGER NOT NULL REFERENCES permission(id) ON DELETE CASCADE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY (group_id, permission_id)
    );
`);

/* ------------------------------------------------------------------ */
/*  Tabel Peminjaman Barang                                           */
/* ------------------------------------------------------------------ */

db.exec(`
    CREATE TABLE IF NOT EXISTS item (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        quantity INTEGER NOT NULL DEFAULT 1,
        available INTEGER NOT NULL DEFAULT 1,
        image_url TEXT,
        category VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS borrowing (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL REFERENCES item(id) ON DELETE CASCADE,
        borrower_name VARCHAR(100) NOT NULL,
        borrower_nim VARCHAR(20) NOT NULL,
        borrower_phone VARCHAR(20),
        purpose TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        borrow_date DATE NOT NULL,
        return_date DATE NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'menunggu',
        note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

/* ------------------------------------------------------------------ */
/*  Keep legacy user_module (tidak di-drop agar aman)                  */
/* ------------------------------------------------------------------ */
db.exec(`
    CREATE TABLE IF NOT EXISTS user_module (
        user_id INTEGER NOT NULL,
        module_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY (user_id, module_id),
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (module_id) REFERENCES module(id) ON DELETE CASCADE
    )
`);

/* ------------------------------------------------------------------ */
/*  Seed: Event                                                         */
/* ------------------------------------------------------------------ */
const eventCount = (db.prepare('SELECT COUNT(*) as count FROM event').get() as { count: number }).count;

if (eventCount === 0) {
    console.log("Seeding event data...");
    const insertEvent = db.prepare(`
        INSERT INTO event (name, description, location, date, time_start, time_end)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');

    const seedData = [
        ['Rapat Rutin Himpunan', 'Rapat evaluasi bulanan kepengurusan Himakom.', 'Ruang Sidang Gedung A', `${currentYear}-${currentMonth}-25`, '15:00:00', '17:30:00'],
        ['Webinar Tech Talk: AI in 2026', 'Diskusi perkembangan AI di dunia perkuliahan.', 'Zoom Meeting', `${currentYear}-${currentMonth}-28`, '19:00:00', '21:00:00'],
        ['Workshop React & Next.js', 'Pelatihan Next.js App Router.', 'Lab Komputer 1', `${currentYear}-09-05`, '13:00:00', '16:00:00'],
        ['Istirahat & Networking', 'Sesi bebas setelah workshop.', 'Area Depan Lab', `${currentYear}-09-05`, '16:00:00', '17:00:00'],
        ['Lomba Koding Internal', 'Competitive programming antar anggota Himakom.', 'Lab Komputer 2', `${currentYear}-09-10`, '18:00:00', '21:00:00'],
        ['Kunjungan Industri: TechCorp', 'Field trip ke kantor TechCorp.', 'Kantor TechCorp Tower', `${currentYear}-09-15`, '08:00:00', '14:00:00'],
        ['Malam Keakraban Himakom', 'Bonding seluruh anggota himpunan.', 'Villa Pegunungan', `${currentYear}-09-20`, '18:00:00', '23:59:00'],
    ];

    const insertMany = db.transaction((events: any[]) => {
        for (const ev of events) insertEvent.run(ev);
    });
    insertMany(seedData);
    console.log("Event data seeded!");
}

/* ------------------------------------------------------------------ */
/*  Seed: User admin                                                    */
/* ------------------------------------------------------------------ */
const userCount = (db.prepare('SELECT COUNT(*) as count FROM user').get() as { count: number }).count;
if (userCount === 0) {
    db.prepare(`INSERT INTO user (username, password, role) VALUES (?, ?, ?)`).run('admin', 'password123', 'admin');
    console.log("User admin seeded!");
}

/* ------------------------------------------------------------------ */
/*  Seed: Module                                                        */
/* ------------------------------------------------------------------ */
const moduleCount = (db.prepare('SELECT COUNT(*) as count FROM module').get() as { count: number }).count;
if (moduleCount === 0) {
    const insertModule = db.prepare(`
        INSERT INTO module (name, label, href, is_protected, is_active, icon) VALUES (?, ?, ?, ?, ?, ?)
    `);
    const modules = [
        ['dashboard',         'Dashboard',         '/dashboard',         1, 1, 'dashboard'],
        ['peminjaman-barang', 'Peminjaman Barang',  '/peminjaman-barang', 1, 1, 'package'],
        ['kalender',          'Kalender Kegiatan', '/kalender',          1, 1, 'calendar'],
        ['feedback',          'Feedback',          '/feedback',          1, 1, 'feedback'],
        ['pengaturan',        'Pengaturan',         '/pengaturan',        1, 1, 'settings'],
        ['groups',            'Groups',             '/groups',            1, 1, 'users'],
        ['pengguna',          'Pengguna',           '/pengguna',          1, 1, 'user'],
    ];
    const insertAll = db.transaction((mods: any[]) => { for (const m of mods) insertModule.run(m); });
    insertAll(modules);
    console.log("Module seeded!");
}

/* ------------------------------------------------------------------ */
/*  Seed: Permission                                                    */
/* ------------------------------------------------------------------ */
const permCount = (db.prepare('SELECT COUNT(*) as count FROM permission').get() as { count: number }).count;
if (permCount === 0) {
    const insertPerm = db.prepare(`INSERT INTO permission (name, label, description) VALUES (?, ?, ?)`);
    const perms = [
        ['view_dashboard',   'Lihat Dashboard',    'Akses halaman dashboard'],
        ['manage_users',     'Kelola Pengguna',    'Tambah, edit, hapus pengguna'],
        ['manage_events',    'Kelola Event',       'Tambah, edit, hapus event'],
        ['manage_borrowing', 'Kelola Peminjaman',  'Kelola peminjaman barang'],
        ['manage_groups',    'Kelola Group',       'Tambah, edit, hapus group'],
        ['manage_settings',  'Kelola Pengaturan',  'Toggle modul aktif/nonaktif'],
    ];
    const insertAll = db.transaction((ps: any[]) => { for (const p of ps) insertPerm.run(p); });
    insertAll(perms);
    console.log("Permission seeded!");
}

/* ------------------------------------------------------------------ */
/*  Seed: Group default                                                 */
/* ------------------------------------------------------------------ */
const groupCount = (db.prepare('SELECT COUNT(*) as count FROM "group"').get() as { count: number }).count;
if (groupCount === 0) {
    // Buat 2 group default
    const insertGroup = db.prepare(`INSERT INTO "group" (name, description) VALUES (?, ?)`);
    insertGroup.run('Pengurus Inti', 'Akses penuh ke semua fitur admin');
    insertGroup.run('Anggota Biasa', 'Akses terbatas hanya ke fitur publik');
    console.log("Default groups seeded!");

    // Assign semua modul ke Pengurus Inti (id=1)
    const allModules = db.prepare('SELECT id FROM module').all() as { id: number }[];
    const insertGM = db.prepare(`INSERT OR IGNORE INTO group_module (group_id, module_id) VALUES (?, ?)`);
    const insertAllGM = db.transaction(() => {
        for (const mod of allModules) insertGM.run(1, mod.id);
    });
    insertAllGM();

    // Assign hanya dashboard ke Anggota Biasa (id=2)
    const dashboardModule = db.prepare(`SELECT id FROM module WHERE name = 'dashboard'`).get() as { id: number } | undefined;
    if (dashboardModule) {
        db.prepare(`INSERT OR IGNORE INTO group_module (group_id, module_id) VALUES (?, ?)`).run(2, dashboardModule.id);
    }

    // Assign admin user ke Pengurus Inti
    const adminUser = db.prepare(`SELECT id FROM user WHERE username = 'admin'`).get() as { id: number } | undefined;
    if (adminUser) {
        db.prepare(`INSERT OR IGNORE INTO user_group (user_id, group_id) VALUES (?, ?)`).run(adminUser.id, 1);
    }

    console.log("Default group modules + members seeded!");
}

/* ------------------------------------------------------------------ */
/*  Seed: Item Peminjaman Barang                                        */
/* ------------------------------------------------------------------ */
const itemCount = (db.prepare('SELECT COUNT(*) as count FROM item').get() as { count: number }).count;
if (itemCount === 0) {
    const insertItem = db.prepare(`
        INSERT INTO item (name, description, quantity, available, category) VALUES (?, ?, ?, ?, ?)
    `);
    const items = [
        ['Proyektor Epson EB-X51', 'Proyektor standar untuk presentasi kelas atau rapat.', 3, 3, 'Elektronik'],
        ['Kabel HDMI 5 Meter', 'Kabel HDMI panjang untuk koneksi laptop ke proyektor.', 5, 5, 'Aksesoris'],
        ['Kamera Canon EOS 3000D', 'Kamera DSLR untuk dokumentasi kegiatan himpunan.', 1, 1, 'Kamera'],
        ['Tripod Kamera Takara', 'Tripod standar untuk kamera DSLR/Mirrorless.', 2, 2, 'Kamera'],
        ['Speaker Aktif Portable', 'Speaker portable dengan mic wireless untuk acara outdoor.', 2, 2, 'Elektronik'],
    ];
    const insertAll = db.transaction((its: any[]) => { for (const i of its) insertItem.run(i); });
    insertAll(items);
    console.log("Item peminjaman seeded!");
}

export default db;