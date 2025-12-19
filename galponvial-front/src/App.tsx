import "./App.css";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      
      <Navbar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl text-gray-800">Contenido de la página</h1>
        <p className="text-gray-600 mt-4">
          Aquí va el resto de la aplicación. Como ves, el navbar ya no ocupa todo.
        </p>
      </main>
      
    </div>
  );
}

export default App;
