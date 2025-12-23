import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <Navbar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl text-gray-800">Contenido de la página</h1>
        <p className="text-red-600 mt-4">
          Aquí va el resto de la aplicación. Como ves, el navbar ya no ocupa todo.
        </p>
        <p className="text-blue-600">Hola</p>
      </div>
      
    </div>
  );
}

export default App;
