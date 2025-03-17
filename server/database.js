import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class Database {
  constructor() {
    this.db = new sqlite3.Database(join(__dirname, 'database.sqlite'));
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Departments table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS departments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Equipment table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS equipment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            internal_number TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            status TEXT NOT NULL,
            department_id INTEGER,
            technical_sheet_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (department_id) REFERENCES departments (id)
          )
        `);

        // Personnel table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS personnel (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            department_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (department_id) REFERENCES departments (id)
          )
        `);

        // Equipment photos table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS equipment_photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            equipment_id INTEGER NOT NULL,
            url TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (equipment_id) REFERENCES equipment (id) ON DELETE CASCADE
          )
        `);

        // Create triggers for updated_at
        this.db.run(`
          CREATE TRIGGER IF NOT EXISTS departments_updated_at 
          AFTER UPDATE ON departments
          BEGIN
            UPDATE departments SET updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.id;
          END;
        `);

        this.db.run(`
          CREATE TRIGGER IF NOT EXISTS equipment_updated_at 
          AFTER UPDATE ON equipment
          BEGIN
            UPDATE equipment SET updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.id;
          END;
        `);

        this.db.run(`
          CREATE TRIGGER IF NOT EXISTS personnel_updated_at 
          AFTER UPDATE ON personnel
          BEGIN
            UPDATE personnel SET updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.id;
          END;
        `);
      }, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Generic query methods
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }
}