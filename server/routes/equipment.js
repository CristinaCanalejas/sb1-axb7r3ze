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

  return router;
}