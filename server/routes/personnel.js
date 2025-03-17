import { Router } from 'express';

export default function(db) {
  const router = Router();

  // Get all personnel
  router.get('/', async (req, res, next) => {
    try {
      const personnel = await db.all(`
        SELECT p.*, d.name as department_name
        FROM personnel p
        LEFT JOIN departments d ON p.department_id = d.id
        ORDER BY p.full_name
      `);
      res.json(personnel);
    } catch (err) {
      next(err);
    }
  });

  // Get personnel by ID
  router.get('/:id', async (req, res, next) => {
    try {
      const person = await db.get(`
        SELECT p.*, d.name as department_name
        FROM personnel p
        LEFT JOIN departments d ON p.department_id = d.id
        WHERE p.id = ?
      `, [req.params.id]);
      
      if (!person) return res.status(404).json({ error: 'Personnel not found' });
      res.json(person);
    } catch (err) {
      next(err);
    }
  });

  // Create personnel
  router.post('/', async (req, res, next) => {
    try {
      const { full_name, email, phone, department_id } = req.body;
      
      if (!full_name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      const result = await db.run(
        'INSERT INTO personnel (full_name, email, phone, department_id) VALUES (?, ?, ?, ?)',
        [full_name, email, phone, department_id]
      );

      const person = await db.get(`
        SELECT p.*, d.name as department_name
        FROM personnel p
        LEFT JOIN departments d ON p.department_id = d.id
        WHERE p.id = ?
      `, [result.id]);

      res.status(201).json(person);
    } catch (err) {
      next(err);
    }
  });

  // Update personnel
  router.put('/:id', async (req, res, next) => {
    try {
      const { full_name, email, phone, department_id } = req.body;
      
      if (!full_name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      await db.run(
        'UPDATE personnel SET full_name = ?, email = ?, phone = ?, department_id = ? WHERE id = ?',
        [full_name, email, phone, department_id, req.params.id]
      );

      const person = await db.get(`
        SELECT p.*, d.name as department_name
        FROM personnel p
        LEFT JOIN departments d ON p.department_id = d.id
        WHERE p.id = ?
      `, [req.params.id]);

      if (!person) return res.status(404).json({ error: 'Personnel not found' });
      res.json(person);
    } catch (err) {
      next(err);
    }
  });

  // Delete personnel
  router.delete('/:id', async (req, res, next) => {
    try {
      const result = await db.run('DELETE FROM personnel WHERE id = ?', [req.params.id]);
      if (result.changes === 0) return res.status(404).json({ error: 'Personnel not found' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
}