import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import DeleteME                                 from "./pages/DeleteME"

function App() {
  

  return (
    <Router>
      <Routes>
        {/* filler page for now (delete asap) */}
        <Route path="/" element={<DeleteME/>}/>




      </Routes>
    </Router>
  )
}

export default App
