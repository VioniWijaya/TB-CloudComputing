const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors()); // Mengizinkan Cross-Origin Resource Sharing
app.use(express.json()); // Mem-parsing body request JSON

// Penyimpanan data di memori (sesuai ketentuan tidak boleh menggunakan database) [cite: 8]
let todos = [
    {
        "id": 1,
        "title": "Contoh To-Do",
        "description": "Ini adalah contoh to-do yang sudah ada.",
        "completed": false,
        "dueDate": "2025-07-01",
        "createdAt": new Date().toISOString()
    }
];
let currentId = 2;

// Router untuk semua endpoint di bawah /api
const router = express.Router();

// [GET] /api/todos - Mengambil seluruh data to-do
router.get('/todos', (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Data to-do berhasil diambil",
        data: todos
    });
});

// [POST] /api/todos - Menambahkan to-do baru
router.post('/todos', (req, res) => {
    const { title, description, dueDate } = req.body;

    if (!title || !description || !dueDate) {
        return res.status(400).json({
            status: "error",
            message: "Title, description, dan dueDate wajib diisi"
        });
    }

    const newTodo = {
        id: currentId++,
        title,
        description,
        completed: false,
        dueDate,
        createdAt: new Date().toISOString()
    };

    todos.push(newTodo);

    res.status(201).json({
        status: "success",
        message: "To-do baru berhasil ditambahkan",
        data: newTodo
    });
});

// [GET] /api/todos/:id - Mengambil detail to-do berdasarkan ID
router.get('/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));

    if (!todo) {
        return res.status(404).json({
            status: "error",
            message: "To-do dengan ID tersebut tidak ditemukan"
        });
    }

    res.status(200).json({
        status: "success",
        message: "Detail to-do berhasil diambil",
        data: todo
    });
});

// [PUT] /api/todos/:id - Memperbarui to-do berdasarkan ID
router.put('/todos/:id', (req, res) => {
    const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));

    if (todoIndex === -1) {
        return res.status(404).json({
            status: "error",
            message: "To-do dengan ID tersebut tidak ditemukan"
        });
    }

    const { title, description, completed, dueDate } = req.body;
    const updatedTodo = {
        ...todos[todoIndex],
        title: title || todos[todoIndex].title,
        description: description || todos[todoIndex].description,
        completed: typeof completed === 'boolean' ? completed : todos[todoIndex].completed,
        dueDate: dueDate || todos[todoIndex].dueDate
    };

    todos[todoIndex] = updatedTodo;

    res.status(200).json({
        status: "success",
        message: "To-do berhasil diperbarui",
        data: updatedTodo
    });
});

// [DELETE] /api/todos/:id - Menghapus to-do berdasarkan ID
router.delete('/todos/:id', (req, res) => {
    const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));

    if (todoIndex === -1) {
        return res.status(404).json({
            status: "error",
            message: "To-do dengan ID tersebut tidak ditemukan"
        });
    }

    todos.splice(todoIndex, 1);

    res.status(200).json({
        status: "success",
        message: "To-do berhasil dihapus",
        data: null
    });
});

// Gunakan router dengan prefix /api [cite: 11]
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
