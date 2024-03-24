from fastapi import FastAPI, HTTPException


# Pydantic es una librería para validar los datos.
# BaseModel sirve para definir clases para crear los modelos de datos que se van a usar en la API.
from pydantic import BaseModel

from typing import List

# Motor es una versión asíncrona de PyMongo,
# la biblioteca estándar de Python para trabajar con MongoDB.
import motor.motor_asyncio

# Para aceptar peticiones de diferentes dominios.
from fastapi.middleware.cors import CORSMiddleware


# Define el modelo de datos para un usuario utilizando Pydantic.
# Esto ayuda a FastAPI a validar los tipos de datos entrantes.
class Book(BaseModel):
    ibsn: str
    title: str
    published: int
    genre: str
    editorial: str
    author_name: str


# Crea la instancia de la aplicación FastAPI
app = FastAPI()

# Lista de origenes permitidos.
origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Método permitidos
    allow_headers=["*"], # Cabeceras permitidas
)

# Cadena de conexión a MongoDB con autenticación
MONGODB_URL = "mongodb://admin:123@mongodb:27017/?authSource=admin"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client.books

# Endpoint para obtener un libro específico por ibsn.
@app.get("/books/{ibsn}", response_description="Obtiene un libro", response_model=Book)
async def find_book(ibsn: str):
    book = await db["books"].find_one({"ibsn": ibsn})
    if book:
        return book
    raise HTTPException(status_code=404, detail=f"Libro con ibsn {ibsn} no se ha encontrado.")

# Endpoint para listar todos los libros.
@app.get("/books/", response_description="Lista todos los libros", response_model=List[Book])
async def list_books():
    books = await db["books"].find().to_list(1000)
    return books

#Endpoint para crear un nuevo libro.
@app.post("/books/", response_description="Añade un nuevo libro", response_model=Book) 
async def create_book(book: Book):
    book_dict = book.dict()
    """ book_dict["fecha_publicacion"] = datetime.combine(libro.fecha_publicacion, datetime.min.time()) """
    await db["books"].insert_one(book_dict)
    return book

# Endpoint para borrar un libro especifico por ibsn.
@app.delete("/books/{ibsn}", response_description="Borra un libro", status_code=204)
async def delete_book(ibsn: str):
    delete_result = await db["books"].delete_one({"ibsn": ibsn})

    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Libro con ibsn {ibsn} no se ha encontrado.")

# Endpoint para actualizar un usuario especifico por ibsn.
@app.put("/books/{ibsn}", response_description="Actualiza un usuario por el ibsn", status_code=204)
async def update_book(ibsn: str, book: Book):
    book_dict = book.dict()
    """ book_dict["fecha_publicacion"] = datetime.combine(book.fecha_publicacion, datetime.min.time()) """
    await db["books"].update_one({"ibsn": ibsn}, {"$set": book_dict})
    return book


# Endpoint para listar todos los libros de una editorial
@app.get("/books/editorial/{editorial}", response_description="Obtiene un libro por editorial", response_model=List[Book])
async def find_book(editorial: str):
    books = await db["books"].find({"editorial": editorial}).to_list(1000)
    if books:
        return books
    raise HTTPException(status_code=404, detail=f"No se han encontrado libros {editorial}")

# Endpoint para listar todos los libros de un género
@app.get("/books/genre/{genre}", response_description="Obtiene un libro por genre", response_model=List[Book])
async def find_book(genre: str):
    books = await db["books"].find({"genre": genre}).to_list(1000)
    if books:
        return books
    raise HTTPException(status_code=404, detail=f"No se han encontrado libros de {genre}")

# Endpoint para listar todos los libros de un autor
@app.get("/books/author/{author_name}", response_description="Obtiene un libro por nombre de autor", response_model=List[Book])
async def find_book(author_name: str):
    books = await db["books"].find({"author_name": author_name}).to_list(1000)
    if books:
        return books
    raise HTTPException(status_code=404, detail=f"No se han encontrado libros de {author_name}")



""" # Endpoint para listar todos los libros.
@app.get("/users/minors/", response_description="Lista los menores de edad", response_model=List[User])
async def list_minors():
    now = datetime.now()
    pipeline = [
        {
            "$project": {
                "dni": 1,
                "nombre": 1,
                "apellido": 1,
                "direccion": 1,
                "telefono": 1,
                "fecha_nacimiento": 1,
                "edad": {
                    "$divide": [
                        {"$subtract": [now, "$fecha_nacimiento"]},
                        365 * 24 * 60 * 60 * 1000
                    ]
                }
            }
        },
        {
            "$match": {
                "edad": {"$lt": 18}
            }
        }
    ]
    minors = await db["users"].aggregate(pipeline).to_list(1000)
    return minors """

""" # Endpoint para listar todos los usuarios mayores de edad.
@app.get("/users/adults/", response_description="Lista los mayores de edad", response_model=List[User])
async def list_adults():
    now = datetime.now()
    pipeline = [
        {
            "$project": {
                "dni": 1,
                "nombre": 1,
                "apellido": 1,
                "direccion": 1,
                "telefono": 1,
                "fecha_nacimiento": 1,
                "edad": {
                    "$divide": [
                        {"$subtract": [now, "$fecha_nacimiento"]},
                        365 * 24 * 60 * 60 * 1000
                    ]
                }
            }
        },
        {
            "$match": {
                "edad": {"$gte": 18}
            }
        }
    ]
    adults = await db["users"].aggregate(pipeline).to_list(1000)
    return adults """
