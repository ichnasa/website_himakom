import Database from "better-sqlite3";
import { v4 as uuidv4 } from 'uuid';

const db = new Database('local.db', {
    verbose: console.log,
});

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
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
`)

db.exec(`
   CREATE TABLE IF NOT EXISTS module(
        id INTEGER primary key AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
   ) 
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS user_module (
        user_id INTEGER NOT NULL,
        module_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY (user_id, module_id),
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (module_id) REFERENCES module(id) ON DELETE CASCADE
    )`
);

const eventCountStmt = db.prepare('SELECT COUNT(*) as count FROM event');
const eventCount = eventCountStmt.get() as { count: number };

if (eventCount.count === 0) {
    console.log("Seeding event data...");
    const insertEvent = db.prepare(`
        INSERT INTO event (name, description, location, date, time_start, time_end) 
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    // Use current month so events show up in the current calendar view
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');

    const seedData = [
        ['Rapat Rutin Himpunan', 'Rapat evaluasi bulanan kepengurusan Himakom periode ini.', 'Ruang Sidang Gedung A', `${currentYear}-${currentMonth}-05`, '15:00:00', '17:30:00'],
        ['Webinar Tech Talk: AI in 2026', 'Diskusi santai mengenai perkembangan AI dan cara pemanfaatannya di dunia perkuliahan.', 'Zoom Meeting', `${currentYear}-${currentMonth}-12`, '19:00:00', '21:00:00'],
        ['Workshop React & Next.js', 'Pelatihan dasar hingga menengah pembuatan website modern menggunakan Next.js App Router.', 'Lab Komputer 1', `${currentYear}-${currentMonth}-15`, '13:00:00', '16:00:00'],
        ['Istirahat & Networking', 'Sesi bebas untuk berkenalan sesama peserta setelah workshop selesai.', 'Area Depan Lab Komputer', `${currentYear}-${currentMonth}-15`, '16:00:00', '17:00:00'],
        ['Lomba Koding Internal', 'Kompetisi coding cepat (competitive programming) antar anggota Himakom.', 'Lab Komputer 2', `${currentYear}-${currentMonth}-15`, '18:00:00', '21:00:00'],
        ['Kunjungan Industri: TechCorp', 'Field trip ke kantor TechCorp untuk belajar mengenai infrastruktur backend.', 'Kantor TechCorp Tower', `${currentYear}-${currentMonth}-20`, '08:00:00', '14:00:00'],
        ['Malam Keakraban Himakom', 'Acara bonding untuk seluruh anggota himpunan, diselingi dengan game, sharing session, dan bakar-bakar.', 'Villa Pegunungan', `${currentYear}-${currentMonth}-25`, '18:00:00', '23:59:00']
    ];

    const insertMany = db.transaction((events) => {
        for (const ev of events) {
            insertEvent.run(ev);
        }
    });

    insertMany(seedData);
    console.log("Event data seeded successfully!");
}

const userCountStmt = db.prepare('SELECT COUNT(*) as count FROM user');
const userCount = userCountStmt.get() as { count: number };
if (userCount.count === 0) {
    const insertUser = db.prepare(`
        INSERT INTO user (username, password) VALUES (?, ?)
    `);
    insertUser.run('admin', 'password123');
    console.log("User admin seeded!");
}

export default db;