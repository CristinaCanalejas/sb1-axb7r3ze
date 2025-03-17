import { Router } from 'express';

export default function(db) {
  const router = Router();

  // Get all equipment
  router.get('/', async (req, res, next) => {
    try {
      const equipment = await db.all(`
        SELECT e.*, d.name as department_name, 
        GROUP_CONCAT(ep.url) as photo_urls
        FROM equipment e
        LEFT JOIN departments d ON e.department_id = d.id
        LEFT JOIN equipment_photos ep ON e.id = ep.equipment_id
        GROUP BY e.id
        ORDER BY e.name
      `);
      res.json(equipment.map(eq => ({
        ...eq,
        photo_urls: eq.photo_urls ? eq.photo_urls.split(',') : []
      })));
    } catch (err) {
      next(err);
    }
  });

  // Get equipment by ID
  router.get('/:id', async (req, res, next) => {
    try {
      const equipment = await db.get(`
        SELECT e.*, d.name as department_name,
        GROUP_CONCAT(ep.url) as photo_urls
        FROM equipment e
        LEFT JOIN departments d ON e.department_id = d.id
        LEFT JOIN equipment_photos ep ON e.id = ep.equipment_id
        WHERE e.id = ?
        GROUP BY e.id
      `, [req.params.id]);
      
      if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
      
      equipment.photo_urls = equipment.photo_urls ? equipment.photo_urls.split(',') : [];
      res.json(equipment);
    } catch (err) {
      next(err);
    }
  });

  // Create equipment
  router.post('/', async (req, res, next) => {
    try {
      const { internal_number, name, type, status, department_id, technical_sheet_url, photos } = req.body;
      
      if (!internal_number || !name || !type || !status) {
        return res.status(400).json({ error: 'Required fields missing' });
      }

      const result = await db.run(
        'INSERT INTO equipment (internal_number, name, type, status, department_id, technical_sheet_url) VALUES (?, ?, ?, ?, ?, ?)',
        [internal_number, name, type, status, department_id, technical_sheet_url]
      );

      if (photos && photos.length > 0) {
        const photoValues = photos.map(url => `(${result.id}, '${url}')`).join(',');
        await db.run(`INSERT INTO equipment_photos (equipment_id, url) VALUES ${photoValues}`);
      }

      const equipment = await db.get(`
        SELECT e.*, d.name as department_name,
        GROUP_CONCAT(ep.url) as photo_urls
        FROM equipment e
        LEFT JOIN departments d ON e.department_id = d.id
        LEFT JOIN equipment_photos ep ON e.id = ep.equipment_id
        WHERE e.id = ?
        GROUP BY e.id
      `, [result.id]);

      equipment.photo_urls = equipment.photo_urls ? equipment.photo_urls.split(',') : [];
      res.status(201).json(equipment);
    } catch (err) {
      next(err);
    }
  });

  // Update equipment
  router.put('/:id', async (req, res, next) => {
    try {
      const { internal_number, name, type, status, department_id, technical_sheet_url, photos } = req.body;
      
      if (!internal_number || !name || !type || !status) {
        return res.status(400).json({ error: 'Required fields missing' });
      }

      await db.run(
        'UPDATE equipment SET internal_number = ?, name = ?, type = ?, status = ?, department_id = ?, technical_sheet_url = ? WHERE id = ?',
        [internal_number, name, type, status, department_id, technical_sheet_url, req.params.id]
      );

      if (photos) {
        await db.run('DELETE FROM equipment_photos WHERE equipment_id = ?', [req.params.id]);
        if (photos.length > 0) {
          const photoValues = photos.map(url => `(${req.params.id}, '${url}')`).join(',');
          await db.run(`INSERT INTO equipment_photos (equipment_id, url) VALUES ${photoValues}`);
        }
      }

      const equipment = await db.get(`
        SELECT e.*, d.name as department_name,
        GROUP_CONCAT(ep.url) as photo_urls
        FROM equipment e
        LEFT JOIN departments d ON e.department_id = d.id
        LEFT JOIN equipment_photos ep ON e.id = ep.equipment_id
        WHERE e.id = ?
        GROUP BY e.id
      `, [req.params.id]);

      if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
      
      equipment.photo_urls = equipment.photo_urls ? equipment.photo_urls.split(',') : [];
      res.json(equipment);
    } catch (err) {
      next(err);
    }
  });

  // Delete equipment
  router.delete('/:id', async (req, res, next) => {
    try {
      const result = await db.run('DELETE FROM equipment WHERE id = ?', [req.params.id]);
      if (result.changes === 0) return res.status(404).json({ error: 'Equipment not found' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  // Get equipment status history
  router.get('/status/history', async (req, res, next) => {
    try {
      const statusRecords = await db.all(`
        SELECT esr.*, 
               e.name as equipment_name,
               p1.full_name as supervisor_name,
               p2.full_name as mechanic_name
        FROM equipment_status_records esr
        LEFT JOIN equipment e ON esr.equipment_id = e.id
        LEFT JOIN personnel p1 ON esr.supervisor = p1.id
        LEFT JOIN personnel p2 ON esr.mechanic = p2.id
        ORDER BY esr.created_at DESC
      `);
      
      // Parse JSON strings back to arrays
      const formattedRecords = statusRecords.map(record => ({
        ...record,
        problems: record.problems ? JSON.parse(record.problems) : [],
        spare_parts: record.spare_parts ? JSON.parse(record.spare_parts) : []
      }));
      
      res.json(formattedRecords);
    } catch (err) {
      next(err);
    }
  });

  // Create equipment status record
  router.post('/status', async (req, res, next) => {
    try {
      const {
        equipmentId,
        status,
        exitDate,
        exitTime,
        supervisor,
        mechanic,
        problems,
        spareParts
      } = req.body;

      if (!equipmentId || !status) {
        return res.status(400).json({ error: 'Campos requeridos faltantes' });
      }

      // Obtener el número interno del equipo
      const equipment = await db.get('SELECT internal_number FROM equipment WHERE id = ?', [equipmentId]);
      
      if (!equipment) {
        return res.status(404).json({ error: 'Equipo no encontrado' });
      }

      const internalNumber = equipment.internal_number;

      // Convert arrays to JSON strings for storage
      const problemsJson = problems || null;
      const sparePartsJson = spareParts || null;

      const result = await db.run(`
        INSERT INTO equipment_status_records (
          equipment_id,
          internal_number,
          status,
          exit_date,
          exit_time,
          supervisor,
          mechanic,
          problems,
          spare_parts,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [
        equipmentId,
        internalNumber,
        status,
        exitDate || null,
        exitTime || null,
        supervisor || null,
        mechanic || null,
        problemsJson,
        sparePartsJson
      ]);

      // Update the equipment status in the equipment table
      await db.run(`
        UPDATE equipment 
        SET status = ? 
        WHERE id = ?
      `, [status, equipmentId]);

      const record = await db.get(`
        SELECT esr.*, 
               e.name as equipment_name,
               p1.full_name as supervisor_name,
               p2.full_name as mechanic_name
        FROM equipment_status_records esr
        LEFT JOIN equipment e ON esr.equipment_id = e.id
        LEFT JOIN personnel p1 ON esr.supervisor = p1.id
        LEFT JOIN personnel p2 ON esr.mechanic = p2.id
        WHERE esr.id = ?
      `, [result.lastID]);

      // Parse JSON strings back to arrays
      record.problems = record.problems ? JSON.parse(record.problems) : [];
      record.spare_parts = record.spare_parts ? JSON.parse(record.spare_parts) : [];

      res.status(201).json(record);
    } catch (err) {
      next(err);
    }
  });

  return router;
}