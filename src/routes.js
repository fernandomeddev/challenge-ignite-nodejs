import { Database } from './database.js';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-routes-path.js';
import { validator } from './utils/validator.js';

const database = new Database();

export const routes = [
    // Create task
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const body = req.body
            const validBody = validator(body)

            if (validBody.responseError) return res.writeHead(400).end(JSON.stringify(validBody.responseError));
            const { title, description } = validBody;

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: Date.now(), 
                updated_at: Date.now()
            }

            database.insert('tasks', task);

            return res.writeHead(201).end();
        }
    },

     // Read
     {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },

    // Update
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler : (req, res) => {
            const { id } = req.params;
    
            const body = req.body
            const validBody = validator(body)

            if (validBody.responseError) return res.writeHead(400).end(JSON.stringify(validBody.responseError));
            const { title, description } = validBody;

            const updatedTask = database.update('tasks', id, { title, description })
            return res.writeHead(201).end(JSON.stringify(updatedTask))
        }
    },

    // Update State
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/completed'),
        handler : (req, res) => {
            const { id } = req.params;

            const updatedTaskState = database.updateState('tasks', id);
            return res.writeHead(201).end(JSON.stringify(updatedTaskState))
        }
    },

    //Delete
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler : (req, res) => {
            const { id } = req.params

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    }
]
