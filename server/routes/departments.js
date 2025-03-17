import { Router } from 'express';

export default function(db) {
  const router = Router();

  // Get all departments
  router.get('/', async (req, res, next) => {
    try {
      const departments = await db.all('SELECT * FROM departments ORDER BY name');
      res.json(departments);
    } catch (err) {
      next(err);
    }
  });

  // Get department by ID
  router.get('/:id', async (req, res, next) => {
    try {
      const department = await db.get('SELECT * FROM departments WHERE id = ?', [req.params.id]);
      if (!department) return res.status(404).json({ error: 'Department not found' });
      res.json(department);
    } catch (err) {
      next(err);
    }
  });

  // Create department
  router.post('/', async (req, res, next) => {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ error: 'Name is required' });

      const result = await db.run('INSERT INTO departments (name) VALUES (?)', [name]);
      const department = await db.get('SELECT * FROM departments WHERE id = ?', [result.id]);
      res.status(201).json(department);
    } catch (err) {
      next(err);
    }
  });

  // Update department
  router.put('/:id', async (req, res, next) => {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ error: 'Name is required' });

      await db.run('UPDATE departments SET name = ? WHERE id = ?', [name, req.params.id]);
      const department = await db.get('SELECT * FROM departments WHERE id = ?', [req.params.id]);
      if (!department) return res.status(404).json({ error: 'Department not found' });
      res.json(department);
    } catch (err) {
      next(err);
    }
  });

  // Delete department
  router.delete('/:id', async (req, res, next) => {
    try {
      const result = await db.run('DELETE FROM departments WHERE id = ?', [req.params.id]);
      if (result.changes === 0) return res.status(404).json({ error: 'Department not found' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
}