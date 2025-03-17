import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class Database {
  constructor() {
    this.dbPath = join(__dirname, 'database.sqlite');
  }

  async init() {
    try {
      // Ensure database directory exists
      await fs.mkdir(dirname(this.dbPath), { recursive: true });
      
      return new Promise((resolve, reject) => {
        this.db = new sqlite3.Database(this.dbPath, (err) => {
          if (err) {
            console.error('Error opening database:', err);
            reject(err);
            return;
          }

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

            // Fuel records table
            this.db.run(`
              CREATE TABLE IF NOT EXISTS fuel_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date DATETIME NOT NULL,
                department TEXT NOT NULL,
                operator_id INTEGER NOT NULL,
                internal_number TEXT NOT NULL,
                equipment_id INTEGER NOT NULL,
                odometer INTEGER,
                fuel_type TEXT NOT NULL,
                liters REAL NOT NULL,
                supervisor INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (operator_id) REFERENCES personnel (id),
                FOREIGN KEY (equipment_id) REFERENCES equipment (id),
                FOREIGN KEY (supervisor) REFERENCES personnel (id)
              )
            `);

            // Equipment status records table
            this.db.run(`
              CREATE TABLE IF NOT EXISTS equipment_status_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                equipment_id INTEGER NOT NULL,
                internal_number TEXT NOT NULL,
                status TEXT NOT NULL,
                exit_date DATETIME,
                exit_time TEXT,
                supervisor TEXT,
                mechanic TEXT,
                problems TEXT,
                spare_parts TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (equipment_id) REFERENCES equipment (id)
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

            resolve();
          });
        });
      });
    } catch (err) {
      console.error('Error initializing database:', err);
      throw err;
    }
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

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}