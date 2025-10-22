import { BrowserRouter as Router,Route,Routes } from "react-router-dom"

const App = () => {
  return (
   <>
    <div className="bg-gray-900 flex justify-center items-center h-screen w-screen">
      <Router>
        <Routes>
          <Route path="/"  />
        </Routes>
      </Router>
    </div>
   </>
  )
}

export default App