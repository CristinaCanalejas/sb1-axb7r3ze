import { Router } from 'express';

export default function(db) {
  const router = Router();

  // Get all fuel records
  router.get('/', async (req, res, next) => {
    try {
      const records = await db.all(`
        SELECT f.*, 
               e.name as equipment_name,
               p.full_name as operator_name,
               s.full_name as supervisor_name
        FROM fuel_records f
        LEFT JOIN equipment e ON f.equipment_id = e.id
        LEFT JOIN personnel p ON f.operator_id = p.id
        LEFT JOIN personnel s ON f.supervisor = s.id
        ORDER BY f.date DESC
      `);
      res.json(records);
    } catch (err) {
      next(err);
    }
  });

  // Create fuel record
  router.post('/', async (req, res, next) => {
    try {
      const {
        date,
        department,
        operatorId,
        internalNumber,
        equipmentId,
        odometer,
        fuelType,
        liters,
        supervisor
      } = req.body;

      if (!operatorId || !equipmentId || !fuelType || !liters || !supervisor || !department) {
        return res.status(400).json({ error: 'Campos requeridos faltantes' });
      }

      const result = await db.run(`
        INSERT INTO fuel_records (
          date,
          department,
          operator_id,
          internal_number,
          equipment_id,
          odometer,
          fuel_type,
          liters,
          supervisor,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [
        new Date(date).toISOString(),
        department,
        operatorId,
        internalNumber,
        equipmentId,
        odometer,
        fuelType,
        liters,
        supervisor
      ]);

      const record = await db.get(`
        SELECT f.*, 
               e.name as equipment_name,
               p.full_name as operator_name,
               s.full_name as supervisor_name
        FROM fuel_records f
        LEFT JOIN equipment e ON f.equipment_id = e.id
        LEFT JOIN personnel p ON f.operator_id = p.id
        LEFT JOIN personnel s ON f.supervisor = s.id
        WHERE f.id = ?
      `, [result.id]);

      res.status(201).json(record);
    } catch (err) {
      next(err);
    }
  });

  return router;
}