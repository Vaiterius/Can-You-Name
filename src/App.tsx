import Categories from "./components/Categories";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ResultsList from "./components/ResultsList";

function App() {
  return (
    <div>
      <Header />
      
      <Categories />
      
      <SearchBar />

      <ResultsList />
    </div>
  )
}

export default App;
