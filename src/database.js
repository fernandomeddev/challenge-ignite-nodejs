import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf-8').then(data => {
            this.#database = JSON.parse(data);
        }).catch(() => {
            this.#persist();
        });
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database));
    };

    select(table, search) {
        let data = this.#database[table] ?? []

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].includes(value)
                })
            })
        }

        return data
    };

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist();

        return data;
    };

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id );

        if (rowIndex > -1) {
            const task = this.#database[table][rowIndex];

            const updatedTask = { ...task, title: data.title, description: data.description, updated_at: Date.now() }

            const newTask = this.#database[table][rowIndex] = { ...updatedTask }

            this.#persist()

            return newTask;
        }

        return { responseError: 'Registro não encontrado' }
    };

    updateState(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id );
        
        if (rowIndex > -1) {
            const task = this.#database[table][rowIndex];

            let state = task.completed_at ? true : false;

            if (state) {
                state = false;
            } else {
                state = true
            }

            const updateStateTask = { ...task, completed_at: state ? Date.now() : null, updated_at: Date.now() };
        
            const changedStateTask = this.#database[table][rowIndex] = { ...updateStateTask };
            
            this.#persist()

            return changedStateTask;
        }

        return { responseError: 'Registro não encontrado' }
    };

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id )

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }
};
