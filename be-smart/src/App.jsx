import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import DeleteME                                 from "./pages/DeleteME"
import ProtectedRoute                           from "./components/global-context/protected_routes"
import { UserProvider }                         from "./components/global-context/context_provider"

function App() {
  

  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* filler page for now (delete asap) */}
          <Route path="/" element={<DeleteME/>}/>

          {/* example of using our protected routes */}
          <Route path="/test" element={<ProtectedRoute><DeleteME/></ProtectedRoute>}/>




        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
