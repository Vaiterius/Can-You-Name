import React, { useState } from "react";
import { motion, type Variants, type Easing } from "motion/react";

import Category from "./SearchCategory";
import { searchPerson } from "./services/wikidataService";
import type { WikidataPerson } from "./services/wikidataService";


// Slide motion for result list items.
// Not sure what the hell any of this is but thanks Claude.
const slideVariants: Variants = {
  hidden: (index: number) => ({
    opacity: 0,
    x: index % 2 === 0 ? -300 : 300,
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as Easing,
    },
  },
};


// Checking if user has already queried the same person.
function hasDuplicate(results: WikidataPerson[], result: WikidataPerson): boolean {
  if (results.length === 0) return false;
  
  let hasDupe = false
  results.forEach((item) => {
    if (item.name === result.name && item.occupation === result.occupation) {
      hasDupe = true;
    };
  })

  return hasDupe;
}


function App() {
  const [activeCategory, setActiveCategory] = useState<Category>(Category.None);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WikidataPerson[]>([]);
  const [result, setResult] = useState<WikidataPerson | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();  // Prevent page reload.
    if (!query.trim()) return;  // Nothing is typed in.

    setIsLoading(true);

    // Only search if a category is selected.
    if (activeCategory !== Category.None) {
      console.log("Query: " + query);

      // Quit after 3 seconds of no results.
      const result = await Promise.race([
        searchPerson(query, activeCategory),
        new Promise<null>(resolve => setTimeout(() => resolve(null), 3000))
      ]);

      setResult(result);
      
      if (!result) {
        setIsLoading(false);
        return;
      }

      console.log("Result: " + result.name + ", " + result.occupation)

      // Prevent duplicate people.
      if (!hasDuplicate(results, result)) {
        setResults(prevResults => [...prevResults, { name: result.name, occupation: result.occupation }])
      }

      console.log(results)
    }
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-mono -mt-25">
      {/* Header */}
      <h1 className="text-2xl text-center font-bold mb-2 md:mb-10 sm:text-3xl md:text-5xl">Bet you can't name them all</h1>
      

      {/* Categories */}
      {/* <p>[DEBUG] selected: { activeCategory }</p> */}
      <div className="flex flex-col items-center mb-5">
        <p className="mb-1">Pick a category: </p>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveCategory(Category.Women)}
            className={`btn w-32 ${activeCategory === Category.Women ? 'btn-secondary' : 'btn-ghost btn-outline'}`}
          >
            {Category.Women}
          </button>
          <button
            onClick={() => setActiveCategory(Category.Men)}
            className={`btn w-32 ${activeCategory === Category.Men ? 'btn-secondary' : 'btn-ghost btn-outline'}`}
          >
            {Category.Men}
          </button>
        </div>
      </div>


      
      <div className="flex flex-col">
        {/* Search Bar */}
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-2 mb-3">
              <input type="text" value={query} placeholder="Search for a name" onChange={(event) => setQuery(event.target.value)} className="input w-xs md:w-3/4" disabled={activeCategory === Category.None}/>
              {isLoading ? <span className="loading loading-spinner loading-lg"></span> : <button type="submit" className="btn md:w-1/4" disabled={activeCategory === Category.None}>Search</button>}
            </div>
        </form>
        {(result === null && results.length > 0) && "No person found"}
        {/* Results list */}
        <ul className="flex flex-col gap-2 w-150">
          {results.map((person, index) => {
            // Last item appended to list should have a smooth slide in animation.
            const isLast = index === results.length - 1;
            const Tag = isLast ? motion.li : "li";
            return (
              <Tag
                key={person.name}
                {...(isLast && {
                  custom: index,
                  variants: slideVariants,
                  initial: 'hidden',
                  animate: 'visible',
                })}
              >
                {/* {person.name} - {person.occupation} */}
                <div role="alert" className="alert alert-soft alert-error">
                  <span>{ index + 1 }</span> <span>{person.name}, {person.occupation}</span>
                </div>
              </Tag>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default App;
